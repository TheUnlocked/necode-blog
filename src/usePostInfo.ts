import type { Post } from 'contentlayer/generated';
import { createContext, useContext } from 'react';

const PostInfoContext = createContext<Post>(undefined!); 

export const PostInfoProvider = PostInfoContext.Provider;

export default function usePostInfo() {
    return useContext(PostInfoContext);
}