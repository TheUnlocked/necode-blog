import { Alert, Box, Container, Divider, Paper, Typography } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { Link } from '../../src/Link';
import { allPosts, type Post } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import type { ParsedUrlQuery } from 'querystring';
import TagChips from 'src/TagChips';

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
};

interface PageParams extends ParsedUrlQuery {
    slug: string;
}

interface PageProps {
    post: Post;
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
    return {
        paths: allPosts.map(({ slug }) => ({
            params: { slug }
        })),
        fallback: false
    };
};

export const getStaticProps: GetStaticProps<PageProps, PageParams> = async ({ params }) => {
    if (params?.slug) {
        const post = allPosts.find(x => x.slug === params.slug);
        if (post) {
            const trimmedPost = { ...post };
            // @ts-ignore
            delete trimmedPost.body.raw;
            return { props: { post: trimmedPost } };
        }
    }
    return {
        notFound: true,
    };
};

const PostPage: NextPage<PageProps> = ({ post }) => {
    const MDXContent = useMDXComponent(post.body.code);

    return <>
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
    </>;
}

export default PostPage;
