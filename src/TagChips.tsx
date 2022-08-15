import { Box, Chip, Stack } from '@mui/material';
import { Link } from './Link';
import { Post } from 'contentlayer/generated';

export interface TagChipProps {
    post: Post;
}

function TagChip({ type, value }: { type: string, value: string }) {
    const label = <><Box component="span" sx={{ color: ({ palette: { grey } }) => grey[500] }}>{type}:</Box>{value}</>;
    return <Chip label={label} clickable component={Link} href={{ pathname: '/search', query: { q: [`${type}:${value.includes(' ') ? JSON.stringify(value) : value}`] } }} />
}

export default function TagChips({ post }: TagChipProps) {
    return <Stack direction="row" columnGap={0.5} rowGap={0.5} sx={{ py: 1 }} flexWrap="wrap">
        {post.authors?.map(author => <TagChip key={author} type="author" value={author} />)}
        {post.tags?.map(tag => <TagChip key={tag} type="tag" value={tag} />)}
    </Stack>;
}