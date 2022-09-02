import { styled } from '@mui/material';
import { VideoHTMLAttributes } from 'react';
import usePostInfo from './usePostInfo';

const VideoElt = styled('video')`
    width: 100%;
`;

export default function Video(props: VideoHTMLAttributes<{}>) {
    const { slug } = usePostInfo();
    return <VideoElt controls {...props} src={props.src ? `/content/${slug}/${props.src}` : undefined} />;
}