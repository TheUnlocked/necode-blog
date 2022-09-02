import NextImage, { ImageProps, StaticImageData } from 'next/image';
import usePostInfo from './usePostInfo';
import { useStaticCompute } from './useStaticCompute';
import { promisify } from 'util';
import sizeOfWithCallback from 'image-size';
const sizeOf = promisify(sizeOfWithCallback);

export default function Image(props: ImageProps) {
    const { slug } = usePostInfo();
    const imageData: StaticImageData | undefined = useStaticCompute(async () => {
        const urlPath = `/content/${slug}/${props.src}`;
        const size = await sizeOf(`public/${urlPath}`);
        return {
            src: urlPath,
            width: size!.width!,
            height: size!.height!,
        };
    });
    if (!imageData) {
        // fallback for hot reload during development
        // eslint-disable-next-line @next/next/no-img-element
        return <img style={{ width: '100%' }} alt={props.alt} {...props} src={`/content/${slug}/${props.src}`} />;
    }
    return <NextImage alt={props.alt} {...props} src={imageData} />;
}