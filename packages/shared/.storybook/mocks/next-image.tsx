import type { ImgHTMLAttributes } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

export default function Image({
  src,
  alt,
  width,
  height,
  priority: _priority,
  fill: _fill,
  ...rest
}: ImageProps) {
  return <img src={src} alt={alt} width={width} height={height} {...rest} />;
}
