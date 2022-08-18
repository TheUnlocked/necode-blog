import Head from 'next/head';
import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { GetStaticProps } from 'next';
import { Container, Divider, Stack, Typography } from '@mui/material';
import { PostCard } from 'src/PostCard';
import { getPostMetadata, PostMetadata } from 'src/postTypes';

interface PageProps {
    posts: PostMetadata[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
    const posts = allPosts.sort((a, b) => {
        return compareDesc(new Date(a.createdOn), new Date(b.createdOn))
    }).map<PostMetadata>(getPostMetadata);
    return { props: { posts } };
}

export default function Home({ posts }: PageProps) {
    return <div>
        <Head>
            <title>Necode Blog</title>
        </Head>

        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h1">Recent Posts</Typography>
            <Divider sx={{ mt: 2, mb: 4 }} />
            <Stack direction="column" sx={{ maxWidth: 'sm' }}>
                {posts.map(post => <PostCard key={post._id} post={post} />)}
            </Stack>
        </Container>
    </div>;
}