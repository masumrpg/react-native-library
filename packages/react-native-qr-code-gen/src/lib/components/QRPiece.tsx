import { Circle, Rect, Path } from 'react-native-svg';
import { PieceOptions } from '../types';

type QRPieceProps = {
  x: number;
  y: number;
  cell: number;
  cellSize: number;
  pieceOptions: PieceOptions;
  defaultColor: string;
  keyPrefix: string;
  asMask?: boolean;
};

export const QRPiece = ({
  x,
  y,
  cell,
  cellSize,
  pieceOptions,
  defaultColor,
  keyPrefix,
  asMask = false, // ← default: false (normal mode)
}: QRPieceProps) => {
  if (!cell) return null;

  const color = asMask ? 'white' : defaultColor;

  const {
    shape = 'square',
    color: pieceColor = color,
    size: pieceSize = 1,
    opacity = 1,
    borderRadius = 0,
  } = pieceOptions;

  const adjustedSize = cellSize * pieceSize;
  const centerOffset = (cellSize - adjustedSize) / 2;
  const posX = x * cellSize + centerOffset;
  const posY = y * cellSize + centerOffset;

  // Rain Effect
  const rainBarWidth = adjustedSize * 0.6;
  const rainBarHeight = adjustedSize * 1.4;
  const rainBarX = posX + (adjustedSize - rainBarWidth) / 2;
  const rainBarY = posY + (cellSize - rainBarHeight) / 2;

  // Heart Shape
  const heartPath = `
      M ${posX + adjustedSize / 2} ${posY + adjustedSize}
      C ${posX + adjustedSize / 2} ${
    posY + adjustedSize * 0.5
  } ${posX} ${posY} ${posX} ${posY + adjustedSize * 0.5}
      C ${posX} ${posY - adjustedSize * 0.2} ${posX + adjustedSize / 2} ${
    posY - adjustedSize * 0.2
  } ${posX + adjustedSize / 2} ${posY + adjustedSize * 0.3}
      C ${posX + adjustedSize / 2} ${posY - adjustedSize * 0.2} ${
    posX + adjustedSize
  } ${posY - adjustedSize * 0.2} ${posX + adjustedSize} ${
    posY + adjustedSize * 0.5
  }
      C ${posX + adjustedSize} ${posY} ${posX + adjustedSize / 2} ${
    posY + adjustedSize * 0.5
  } ${posX + adjustedSize / 2} ${posY + adjustedSize}
      Z`
    .trim()
    .replace(/\s+/g, ' ');

  switch (shape) {
    case 'triangle':
      return (
        <Path
          key={keyPrefix}
          d={`M ${posX + adjustedSize / 2} ${posY}
             L ${posX + adjustedSize} ${posY + adjustedSize}
             L ${posX} ${posY + adjustedSize} Z`}
          fill={pieceColor}
          opacity={opacity}
        />
      );
    case 'heart':
      return (
        <Path
          key={keyPrefix}
          d={heartPath}
          fill={pieceColor}
          opacity={opacity}
        />
      );
    case 'dot':
      return (
        <Circle
          key={keyPrefix}
          cx={posX + adjustedSize / 2}
          cy={posY + adjustedSize / 2}
          r={adjustedSize / 2}
          fill={pieceColor}
          opacity={opacity}
        />
      );
    case 'rounded':
      return (
        <Rect
          key={keyPrefix}
          x={posX}
          y={posY}
          width={adjustedSize}
          height={adjustedSize}
          rx={borderRadius}
          ry={borderRadius}
          fill={pieceColor}
          opacity={opacity}
        />
      );
    case 'rain':
      return (
        <Rect
          key={keyPrefix}
          x={rainBarX}
          y={rainBarY}
          width={rainBarWidth}
          height={rainBarHeight}
          rx={rainBarWidth / 2}
          ry={rainBarWidth / 2}
          fill={pieceColor}
          opacity={opacity}
        />
      );
    case 'square':
    default:
      return (
        <Rect
          key={keyPrefix}
          x={posX}
          y={posY}
          width={adjustedSize}
          height={adjustedSize}
          rx={borderRadius}
          ry={borderRadius}
          fill={pieceColor}
          opacity={opacity}
        />
      );
  }
};
