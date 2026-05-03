import { Svg, Defs, Image as SVGImage, G, ClipPath } from 'react-native-svg';
import { QRImageProps } from '../types';

const QRImage = ({ children, size, source, baseClip }: QRImageProps) => {
  const clipId = 'imageClip';
  return (
    <Svg width={size} height={size}>
      {baseClip}
      <Defs>
        <ClipPath id={clipId}>
          <G>{children}</G>
        </ClipPath>
      </Defs>

      <SVGImage
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMaxYMax slice"
        {...source}
        clipPath={`url(#${clipId})`}
      />
    </Svg>
  );
};

export { QRImage };
