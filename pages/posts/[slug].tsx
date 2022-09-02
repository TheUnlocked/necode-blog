import { Alert, Box, Container, Divider, Paper, Typography } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { PropsWithChildren, useCallback } from 'react';
import { Link } from '../../src/Link';
import { allPosts, type Post } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import type { ParsedUrlQuery } from 'querystring';
import TagChips from 'src/TagChips';
import { StaticFetcherType, StaticFetchProvider } from 'src/useStaticFetch';
import * as ReactDOMServer from 'react-dom/server';
import Issue from 'src/github/Issue';
import Image from 'src/Image';
import Video from 'src/Video';
import { PostInfoProvider } from 'src/usePostInfo';
import { StaticComputeProvider, StaticComputeRunner } from 'src/useStaticCompute';

const h1 = (props: PropsWithChildren<{}>) => <>
    <Typography sx={{ mt: 6 }} variant="h2" fontWeight="500" {...props} />
    <Divider sx={{ my: 2 }} />
</>;

const h2 = (props: PropsWithChildren<{}>) => <Typography sx={{ mt: 4, mb: 2 }} variant="h3" {...props} />;
const h3 = (props: PropsWithChildren<{}>) => <Typography sx={{ mt: 4, mb: 2 }} variant="h4" {...props} />;
const h4 = (props: PropsWithChildren<{}>) => <Typography sx={{ mt: 4, mb: 2 }} variant="h5" {...props} />;
const h5 = (props: PropsWithChildren<{}>) => <Typography sx={{ mt: 4, mb: 2 }} variant="h6" {...props} />;
const h6 = h5;

const sup = (props: PropsWithChildren<{}>) => <Typography variant="sup" component="sup" {...props} />
const a = (props: PropsWithChildren<{}>) => <Link {...props} />;
const hr = () => <Divider sx={{ my: 4 }} />;

const section = (props: PropsWithChildren<{}>) => <Paper {...props} />;

const Info = (props: PropsWithChildren<{}>) => <Alert severity="info" variant="standard" {...props} />;

const components = {
    h1, h2, h3, h4, h5, h6,
    sup, a, hr, section,
    Info,
    Image, Video,
    // Should be able to import these in MDX, but ContentLayer issue prevents it.
    Issue,
};

interface PageParams extends ParsedUrlQuery {
    slug: string;
}

interface PageProps {
    post: Post;
    prefetchedData: { [url: string]: any };
    fetcher?: (...args: Parameters<StaticFetcherType>) => any;
    precomputedData: { [id: string]: any };
    computeRunner?: StaticComputeRunner;
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
    return {
        paths: allPosts.map(({ slug }) => ({
            params: { slug }
        })),
        fallback: false
    };
};

const staticFetchCache = {} as { [url: string]: any };

export const getStaticProps: GetStaticProps<PageProps, PageParams> = async ({ params }) => {
    if (params?.slug) {
        const post = allPosts.find(x => x.slug === params.slug);
        if (post) {
            const trimmedPost = { ...post };
            // @ts-ignore
            delete trimmedPost.body.raw;

            const toFetch = [] as Parameters<StaticFetcherType>[];
            const urlsToFetch = new Set<string>();
            const toCompute = [] as Parameters<StaticComputeRunner>[];
            ReactDOMServer.renderToStaticMarkup(
                <PostPage post={trimmedPost}
                    prefetchedData={{}} fetcher={(...args) => {
                        if (!urlsToFetch.has(args[0])) {
                            urlsToFetch.add(args[0]);
                            toFetch.push(args);
                        }
                    }}
                    precomputedData={{}} computeRunner={(...args) => toCompute.push(args)} />
            );

            const [prefetchedDataEntries, precomputedDataEntries] = await Promise.all([
                Promise.allSettled(toFetch.map(args => args[0] in staticFetchCache
                    ? Promise.resolve(staticFetchCache[args[0]])
                    : fetch(...args).then(x => x.json()).then(x => [args[0], x]))),
                Promise.all(toCompute.map(([id, callback]) => callback().then(x => [id, x]))),
            ]);
            
            return { props: {
                post: trimmedPost,
                prefetchedData: Object.fromEntries(
                    prefetchedDataEntries
                        .filter((x): x is PromiseFulfilledResult<any> => x.status === 'fulfilled')
                        .map(x => x.value)
                ),
                precomputedData: Object.fromEntries(precomputedDataEntries),
            } };
        }
    }
    return {
        notFound: true,
    };
};

const PostPage: NextPage<PageProps> = ({ post, prefetchedData, fetcher, precomputedData, computeRunner }) => {
    const defaultFetcher = useCallback((...args: Parameters<typeof fetch>) => {
        if (args[0] as string in prefetchedData) {
            return prefetchedData[args[0] as string];
        }
        return fetch(...args).then(x => x.json());
    }, [prefetchedData]);

    const defaultComputeRunner = useCallback((computeId: string) => {
        if (computeId in precomputedData) {
            return precomputedData[computeId];
        }
    }, [precomputedData]);

    const MDXContent = useMDXComponent(post.body.code);

    return <StaticFetchProvider fetch={fetcher ?? defaultFetcher}>
        <StaticComputeProvider computeRunner={computeRunner ?? defaultComputeRunner}>
        <PostInfoProvider value={post}>
            <Head>
                <title>{`Necode Blog - ${post.title}`}</title>
                <meta name="description" content={post.subtitle} />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h1" sx={{ my: 2 }}>{post.title}</Typography>
                <Typography variant="h3" component="div" sx={{ my: 1 }}>{post.subtitle}</Typography>
                <TagChips post={post} />
                <Divider sx={{ mt: 1, mb: 4 }} />
                <Box sx={({ breakpoints: { values: { sm } } }) => ({ maxWidth: sm })}>
                    <MDXContent components={components} />
                </Box>
            </Container>
        </PostInfoProvider>
        </StaticComputeProvider>
    </StaticFetchProvider>;
}

export default PostPage;
