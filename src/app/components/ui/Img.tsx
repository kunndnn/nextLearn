import Image, { ImageProps } from "next/image";

type ImgProps = Omit<ImageProps, "alt"> & { alt?: string };

export default function Img({ alt = "", ...props }: ImgProps) {
  return <Image alt={alt} {...props} />;
}
