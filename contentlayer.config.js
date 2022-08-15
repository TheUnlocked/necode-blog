// @ts-check

import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { refractor } from 'refractor/lib/all.js';
import rehypePrismGenerator from 'rehype-prism-plus/generator';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkCodeTitle from './src/plugins/remarkCodeTitle';
import remarkUnwrapMdx from './src/plugins/remarkUnwrapMdx';
import rehypePrismPlusExtras from './src/plugins/rehypePrismPlusExtras';
import mike from './src/prism/mike';

export const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: `**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: {
            type: 'string',
            description: 'The title of the post',
            required: true,
        },
        subtitle: {
            type: 'string',
            description: 'The subtitle of the post',
            default: '',
            required: false,
        },
        authors: {
            type: 'list',
            of: {
                type: 'string'
            },
            description: 'The author(s) that created the post',
            required: true,
        },
        createdOn: {
            type: 'date',
            description: 'The date that the post was created',
            required: true,
        },
        modifiedOn: {
            type: 'date',
            description: 'The date that the post was last modified',
            required: false,
        },
        tags: {
            type: 'list',
            of: {
                type: 'string'
            },
            description: 'The tags related to this post',
            default: [],
            required: true,
        },
    },
    computedFields: {
        url: {
            type: 'string',
            resolve: post => `/posts/${post._raw.flattenedPath}`,
        },
        slug: {
            type: 'string',
            resolve: post => post._raw.flattenedPath,
        }
    },
}));

refractor.register(mike);

export default makeSource({
    contentDirPath: 'posts',
    documentTypes: [Post],
    mdx: {
        rehypePlugins: [
            rehypeAutolinkHeadings,
            rehypeSlug,
            rehypePrismGenerator(refractor),
            rehypePrismPlusExtras,
        ],
        remarkPlugins: [
            remarkGfm,
            remarkCodeTitle,
            remarkUnwrapMdx,
        ],
    }
});
