import Image, { type ImageProps } from 'next/image';
import { cn } from '@/app/lib/utils';

type RemoteImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt: string;
  className?: string;
};

export default function RemoteImage({ src, alt, className, ...props }: RemoteImageProps) {
  return <Image src={src} alt={alt} className={cn('object-cover', className)} {...props} />;
}
