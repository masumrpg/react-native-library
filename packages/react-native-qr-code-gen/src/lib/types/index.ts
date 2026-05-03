import { QRCodeErrorCorrectionLevel } from 'qrcode';
import React from 'react';
import { ImageProps } from 'react-native-svg';
import { QR_CODE_CONFIGS } from '../constants';

type EyeCornerRadius = {
  tl?: number;
  tr?: number;
  br?: number;
  bl?: number;
};

type EyeLayerRadius = number | EyeCornerRadius;

type EyeSize = {
  /**
   * The size multiplier for the outer circle of the eye pattern
   * @default 1
   * @example
   * ```typescript
   *outerCircle: 1.2 // Makes the outer circle 20% larger
   * ```
   */
  outer?: number;

  /**
   * The size multiplier for the center circle of the eye pattern
   * @default 1
   * @example
   * ```typescript
   * centerCircle: 0.8 // Makes the center circle 20% smaller
   * ```
   */
  center?: number;

  /**
   * The size multiplier for the inner circle of the eye pattern
   * @default 1
   * @example
   * ```typescript
   * innerCircle: 0.5 // Makes the inner circle half the default size
   * ```
   */
  inner?: number;
};

type SquareRadius = {
  radiusOuter?: EyeLayerRadius;
  radiusInner?: EyeLayerRadius;
  radiusCenter?: EyeLayerRadius;
};

type BaseEyeOptions = {
  color?: string;
  innerColor?: string;
  backgroundColor?: string;
  dotSizeRatio?: number;
};

type SquareEyeOptions = BaseEyeOptions & {
  shape: 'square';
  radius?: SquareRadius;
  size?: EyeSize;
};

type CircleEyeOptions = BaseEyeOptions & {
  shape: 'circle';
  size?: EyeSize;
};

type OtherShapeEyeOptions = BaseEyeOptions & {
  shape?: 'dot' | 'triangle' | 'heart';
};

type EyeOptions = CircleEyeOptions | OtherShapeEyeOptions | SquareEyeOptions;

type PieceOptions = {
  shape?: 'square' | 'dot' | 'rounded' | 'heart' | 'triangle' | 'rain';
  color?: string;
  size?: number; // Size multiplier relative to cell size (1 = full size)
  opacity?: number;
  borderRadius?: number; // For 'rounded' shape or square with rounded corners
};

type LogoOptions = {
  source: number | string;
  size?: number; // Size as percentage of total QR code size (0.0-1.0)
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  padding?: number; // Padding inside logo background
};

type QRCodeGradientConfig = Omit<
  QRGradientProps,
  'width' | 'height' | 'children'
> & {
  maskLogo?: boolean;
  direction?: GradientDirection;
};

type QRImageProps = {
  children: React.ReactNode;
  size: number;
  source: ImageProps;
  baseClip?: React.ReactNode;
};

type QRCodeVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type QRCodeGeneratorProps = {
  value: string;
  size?: number;
  color?: string;
  gradient?: QRCodeGradientConfig;
  logo?: LogoOptions;
  imageClip?: ImageProps;
  backgroundColor?: string;
  piece?: PieceOptions;
  eye?: Partial<{
    topLeft: EyeOptions;
    topRight: EyeOptions;
    bottomLeft: EyeOptions;
  }>;
  includeBackground?: boolean;
  version?: QRCodeVersion;
  maxVersion?: QRCodeVersion;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
};

type Percentage = `${number}%`;

type GradientColor = {
  offset: Percentage;
  color: string;
  opacity?: number;
};

type GradientDirection =
  | 'to-right'
  | 'to-left'
  | 'to-bottom'
  | 'to-top'
  | 'to-bottom-right'
  | 'to-bottom-left'
  | 'to-top-right'
  | 'to-top-left';

type LinearProps = {
  type: 'linear';
  direction?: GradientDirection;
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  colors: GradientColor[];
};

type RadialProps = {
  type: 'radial';
  cx?: string;
  cy?: string;
  r?: string;
  fx?: string;
  fy?: string;
  colors: GradientColor[];
};

type QRGradientProps = {
  width: number;
  height: number;
  id?: string;
  children: React.ReactNode;
  onGradientIdGenerated?: (gradientId: string) => void;
} & (LinearProps | RadialProps);

type QREyeProps = {
  x: number;
  y: number;
  cellSize: number;
  eyeOptions: EyeOptions;
  defaultColor: string;
  defaultBackgroundColor: string;
  keyPrefix: string;
  asMask?: boolean;
};

type DotShapeProps = {
  keyPrefix: string;
  x: number;
  y: number;
  cellSize: number;
  innerEyeColor: string;
  dotSizeRatio: number;
  eyeBg: string;
  eyeColor: string;
  asMask: boolean;
};

type QRCodeProps = QRCodeGeneratorProps & {
  variant?: keyof typeof QR_CODE_CONFIGS;
};

export type {
  EyeCornerRadius,
  EyeLayerRadius,
  EyeOptions,
  PieceOptions,
  LogoOptions,
  QRCodeGradientConfig,
  QRCodeGeneratorProps,
  GradientColor as GradientStop,
  GradientDirection,
  LinearProps,
  RadialProps,
  QRGradientProps,
  QREyeProps,
  QRCodeVersion,
  QRImageProps,
  QRCodeErrorCorrectionLevel,
  DotShapeProps,
  CircleEyeOptions,
  EyeSize,
  SquareEyeOptions,
  SquareRadius,
  OtherShapeEyeOptions,
  BaseEyeOptions,
  QRCodeProps,
};
