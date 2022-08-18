import { Post } from 'contentlayer/generated';

export type PostMetadata = Pick<Post, '_id' | 'url' | 'title' | 'subtitle' | 'createdOn' | 'tags' | 'authors' | 'slug' | 'modifiedOn'>;

export function getPostMetadata({
    _id,
    url,
    slug,
    title,
    subtitle,
    authors,
    createdOn,
    modifiedOn,
    tags,
}: Post): PostMetadata {
    return {
        _id,
        url,
        slug,
        title,
        subtitle,
        authors,
        createdOn,
        ...modifiedOn ? { modifiedOn } : undefined,
        tags,
    };
}