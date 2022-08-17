import Head from 'next/head';
import { allPosts, type Post } from 'contentlayer/generated';
import { GetServerSideProps } from 'next';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { PostCard } from 'src/PostCard';
import { Fragment } from 'react';

interface Constraint {
    parts: {
        color: 'plain' | 'subtle' | 'error';
        text: string;
    }[];
}

interface PageProps {
    posts: Post[];
    query: Constraint[];
}

function splitQuery(query: string) {
    return [...query.match(/(?:[^\s"]+|"[^"]*")+/g) ?? []];
}

function includesCaseInsensitive(haystack: string, needle: string) {
    return haystack.toLowerCase().includes(needle.toLowerCase());
}

function includesSomewhere(haystack: string[], needle: string) {
    return haystack.some(x => includesCaseInsensitive(x, needle));
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
    const constraintStrings = query.q instanceof Array
        ? query.q.flatMap(splitQuery)
        : splitQuery(query.q ?? '');
    
    const constraints = [] as Constraint[];
    let posts = allPosts;
    for (const constraintString of constraintStrings) {
        const [_, keyword, value] = constraintString.match(/^(?:([^:"]*):)?(.*)$/) ?? [];
        const effectiveValue = value.match(/^".*"$/) ? value.slice(1, -1) : value;
        switch (keyword) {
            case undefined:
                posts = posts.filter(x => includesSomewhere([x.title, x.subtitle, ...x.tags, ...x.authors], effectiveValue));
                constraints.push({ parts: [{ color: 'plain', text: value }] });
                continue;
            case 'tag':
                posts = posts.filter(x => includesSomewhere(x.tags, effectiveValue));
                break;
            case 'author':
                posts = posts.filter(x => includesSomewhere(x.authors, effectiveValue));
                break;
            default:
                constraints.push({ parts: [
                    { color: 'error', text: `${keyword}:` },
                    { color: 'plain', text: value },
                ] });
                continue;
        }
        constraints.push({ parts: [
            { color: 'subtle', text: `${keyword}:` },
            { color: 'plain', text: value },
        ] });
    }
    
    return { props: { posts, query: constraints } };
}

function ConstraintPart({ color, text }: Constraint['parts'][number]) {
    switch (color) {
        case 'plain':
            return <>{text}</>;
        case 'subtle':
            return <Box component="span" sx={{ color: 'rgba(var(--mui-palette-text-primaryChannel) / 0.5)' }}>{text}</Box>
        case 'error':
            return <Box component="span" sx={{ color: 'var(--mui-palette-error-main)' }}>{text}</Box>
    }
}

export default function Home({ posts, query }: PageProps) {
    return <div className="mx-auto max-w-2xl py-16 text-center">
        <Head>
            <title>Necode Blog - Search</title>
        </Head>

        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h2" component="h1">
                {query.length > 0
                    ? <code>{query.flatMap((constraint, cidx) => <>
                        {cidx > 0 ? <> </> : null}
                        {constraint.parts.map((part, pidx) => <ConstraintPart key={`${cidx}-${pidx}`} {...part} />)}
                    </>)}</code>
                    : "No Query"}
            </Typography>
            <Divider sx={{ mt: 2, mb: 4 }} />
            <Stack direction="column" sx={{ maxWidth: 'sm' }}>
                {posts.map(post => <PostCard key={post._id} post={post} />)}
            </Stack>
        </Container>
    </div>;
}