import { Box, Typography } from '@mui/material';
import { format as formatDate, parseISO } from 'date-fns';
import { Link } from './Link';
import { PostMetadata } from './postTypes';
import TagChips from './TagChips';

export function PostCard({ post }: { post: PostMetadata }) {
    return <Box sx={{ borderLeft: 4, borderColor: 'var(--mui-palette-divider)', pl: 4, mb: 4 }}>
        <Typography variant="h2" fontWeight={500} component="h2">
            <Link href={post.url}>{post.title}</Link>
        </Typography>
        {post.subtitle}
        <TagChips post={post} />
        <time dateTime={post.createdOn}>{formatDate(+parseISO(post.createdOn), 'LLLL d, yyyy')}</time>
    </Box>;
}