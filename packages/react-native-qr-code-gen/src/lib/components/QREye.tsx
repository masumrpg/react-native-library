import { G, Circle, Path, Defs, Mask, Rect } from 'react-native-svg';
import {
  DotShapeProps,
  EyeSize,
  QREyeProps,
  SquareRadius,
} from '../types';
import { normalizeRadius, roundedRectPath } from '../utils';

export const QREye = ({
  x,
  y,
  cellSize,
  eyeOptions,
  defaultColor,
  defaultBackgroundColor,
  keyPrefix,
  asMask = false,
}: QREyeProps) => {
  const color = asMask ? 'white' : defaultColor;

  const {
    shape = 'shape',
    color: eyeColor = color,
    innerColor: innerEyeColor = eyeColor,
    backgroundColor: eyeBg = defaultBackgroundColor,
    dotSizeRatio = 0.5,
  } = eyeOptions;

  const squareSize: EyeSize | undefined =
    shape === 'square' && 'size' in eyeOptions ? eyeOptions.size : {};
  const {
    outer: squareSizeOuter, // 7
    center: squareSizeCenter, // 5
    inner: squareSizeInner, // 3
  } = squareSize || {};

  const squareRadius: SquareRadius | undefined =
    shape === 'square' && 'radius' in eyeOptions ? eyeOptions.radius : {};
  const {
    radiusOuter = 0,
    radiusInner = 0,
    radiusCenter = 0,
  } = squareRadius || {};

  const circleSize: EyeSize | undefined =
    shape === 'circle' && 'size' in eyeOptions ? eyeOptions.size : {};
  const {
    outer: outerCircleSize,
    center: centerCircleSize,
    inner: innerCircleSize,
  } = circleSize || {};

  const rOuter = normalizeRadius(radiusOuter);
  const rInner = normalizeRadius(radiusInner);
  const rCenter = normalizeRadius(radiusCenter);

  const center = {
    x: x + cellSize * 3.5,
    y: y + cellSize * 3.5,
  };

  const options = {
    keyPrefix,
    x,
    y,
    cellSize,
    innerEyeColor,
    dotSizeRatio,
    eyeBg,
    eyeColor,
    asMask,
  };

  if (shape === 'dot' || shape === 'triangle' || shape === 'heart') {
    return dotShape(shape, options);
  }

  return shape === 'circle' ? (
    asMask ? (
      <G key={keyPrefix}>
        <Circle
          cx={center.x}
          cy={center.y}
          r={cellSize * (outerCircleSize ? outerCircleSize + 2.5 : 3.5)}
          fill={eyeColor}
        />
        <Circle
          cx={center.x}
          cy={center.y}
          r={cellSize * (centerCircleSize ? centerCircleSize + 1.5 : 2.5)}
          fill={eyeBg}
        />
        <Circle
          cx={center.x}
          cy={center.y}
          r={cellSize * (innerCircleSize ? innerCircleSize + 0.5 : 1.5)}
          fill={eyeColor}
        />
      </G>
    ) : (
      <>
        <Defs>
          <Mask id={`cirecle-mask-${keyPrefix}`}>
            <Rect width="100%" height="100%" fill="black" />
            <Circle
              cx={center.x}
              cy={center.y}
              r={cellSize * (outerCircleSize ? outerCircleSize + 2.5 : 3.5)}
              fill={'white'}
            />
            <Circle
              cx={center.x}
              cy={center.y}
              r={cellSize * (centerCircleSize ? centerCircleSize + 1.5 : 2.5)}
              fill={'black'}
            />
          </Mask>
        </Defs>
        <G mask={`url(#cirecle-mask-${keyPrefix})`}>
          <Rect width="100%" height="100%" fill={eyeColor} />
        </G>
        <G key={keyPrefix}>
          <Circle
            cx={center.x}
            cy={center.y}
            r={cellSize * (centerCircleSize ? centerCircleSize + 1.5 : 2.5)}
            fill={eyeBg}
          />
          <Circle
            cx={center.x}
            cy={center.y}
            r={cellSize * (innerCircleSize ? innerCircleSize + 0.5 : 1.5)}
            fill={innerEyeColor}
          />
        </G>
      </>
    )
  ) : asMask ? (
    <G key={keyPrefix}>
      <Path
        d={roundedRectPath(
          x +
            (cellSize * (7 - (squareSizeOuter ? squareSizeOuter + 6 : 7))) / 2,
          y +
            (cellSize * (7 - (squareSizeOuter ? squareSizeOuter + 6 : 7))) / 2,
          (squareSizeOuter ? squareSizeOuter + 6 : 7) * cellSize,
          (squareSizeOuter ? squareSizeOuter + 6 : 7) * cellSize,
          rOuter
        )}
        fill={eyeColor}
      />
      <Path
        d={roundedRectPath(
          x +
            (cellSize * (7 - (squareSizeCenter ? squareSizeCenter + 4 : 5))) /
              2,
          y +
            (cellSize * (7 - (squareSizeCenter ? squareSizeCenter + 4 : 5))) /
              2,
          (squareSizeCenter ? squareSizeCenter + 4 : 5) * cellSize,
          (squareSizeCenter ? squareSizeCenter + 4 : 5) * cellSize,
          rInner
        )}
        fill={eyeBg}
      />
      <Path
        d={roundedRectPath(
          x +
            (cellSize * (7 - (squareSizeInner ? squareSizeInner + 2 : 3))) / 2,
          y +
            (cellSize * (7 - (squareSizeInner ? squareSizeInner + 2 : 3))) / 2,
          (squareSizeInner ? squareSizeInner + 2 : 3) * cellSize,
          (squareSizeInner ? squareSizeInner + 2 : 3) * cellSize,
          rCenter
        )}
        fill={eyeColor}
      />
    </G>
  ) : (
    <>
      <Defs>
        <Mask id={`square-mask-${keyPrefix}`}>
          <Rect width="100%" height="100%" fill="black" />
          <Path
            d={roundedRectPath(
              x +
                (cellSize * (7 - (squareSizeOuter ? squareSizeOuter + 6 : 7))) /
                  2,
              y +
                (cellSize * (7 - (squareSizeOuter ? squareSizeOuter + 6 : 7))) /
                  2,
              (squareSizeOuter ? squareSizeOuter + 6 : 7) * cellSize,
              (squareSizeOuter ? squareSizeOuter + 6 : 7) * cellSize,
              rOuter
            )}
            fill={'white'}
          />
          <Path
            d={roundedRectPath(
              x +
                (cellSize *
                  (7 - (squareSizeCenter ? squareSizeCenter + 4 : 5))) /
                  2,
              y +
                (cellSize *
                  (7 - (squareSizeCenter ? squareSizeCenter + 4 : 5))) /
                  2,
              (squareSizeCenter ? squareSizeCenter + 4 : 5) * cellSize,
              (squareSizeCenter ? squareSizeCenter + 4 : 5) * cellSize,
              rInner
            )}
            fill={'black'}
          />
        </Mask>
      </Defs>
      <G mask={`url(#square-mask-${keyPrefix})`}>
        <Rect width="100%" height="100%" fill={eyeColor} />
      </G>
      <G key={keyPrefix}>
        <Path
          d={roundedRectPath(
            x +
              (cellSize * (7 - (squareSizeCenter ? squareSizeCenter + 4 : 5))) /
                2,
            y +
              (cellSize * (7 - (squareSizeCenter ? squareSizeCenter + 4 : 5))) /
                2,
            (squareSizeCenter ? squareSizeCenter + 4 : 5) * cellSize,
            (squareSizeCenter ? squareSizeCenter + 4 : 5) * cellSize,
            rInner
          )}
          fill={eyeBg}
        />
        <Path
          d={roundedRectPath(
            x +
              (cellSize * (7 - (squareSizeInner ? squareSizeInner + 2 : 3))) /
                2,
            y +
              (cellSize * (7 - (squareSizeInner ? squareSizeInner + 2 : 3))) /
                2,
            (squareSizeInner ? squareSizeInner + 2 : 3) * cellSize,
            (squareSizeInner ? squareSizeInner + 2 : 3) * cellSize,
            rCenter
          )}
          fill={innerEyeColor}
        />
      </G>
    </>
  );
};

const dotShape = (
  variant: 'dot' | 'triangle' | 'heart',
  {
    keyPrefix,
    x,
    y,
    cellSize,
    innerEyeColor,
    dotSizeRatio,
    eyeBg,
    eyeColor,
    asMask,
  }: DotShapeProps
) => {
  return (
    <G key={keyPrefix}>
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 7 }).map((_, col) => {
          const cx = x + col * cellSize + cellSize / 2;
          const cy = y + row * cellSize + cellSize / 2;

          const isCenter = row >= 2 && row <= 4 && col >= 2 && col <= 4;
          const isInner = row >= 1 && row <= 5 && col >= 1 && col <= 5;

          const fill = isCenter ? innerEyeColor : isInner ? eyeBg : eyeColor;

          const radius = cellSize * dotSizeRatio;

          if (isInner && !isCenter) {
            const isInnerCorner =
              (row === 1 && col === 1) ||
              (row === 1 && col === 5) ||
              (row === 5 && col === 1) ||
              (row === 5 && col === 5);
            if (!isInnerCorner) {
              return null;
            }
          }

          const heartPath = `
            M ${cx} ${cy + radius * 0.7}
            C ${cx} ${cy + radius * 0.3} ${cx - radius * 1.0} ${
            cy - radius * 0.5
          } ${cx - radius * 1.0} ${cy - radius * 0.2}
            C ${cx - radius * 1.0} ${cy - radius * 1.2} ${cx} ${
            cy - radius * 1.2
          } ${cx} ${cy - radius * 0.7}
            C ${cx} ${cy - radius * 1.2} ${cx + radius * 1.0} ${
            cy - radius * 1.2
          } ${cx + radius * 1.0} ${cy - radius * 0.2}
            C ${cx + radius * 1.0} ${cy - radius * 0.5} ${cx} ${
            cy + radius * 0.3
          } ${cx} ${cy + radius * 0.7}
            Z`
            .trim()
            .replace(/\s+/g, ' ');

          switch (variant) {
            case 'heart':
              return (
                <Path
                  key={`${keyPrefix}-heart-${row}-${col}`}
                  d={heartPath}
                  fill={asMask ? 'white' : fill}
                />
              );
            case 'triangle':
              return (
                <Path
                  key={`${keyPrefix}-triangle-${row}-${col}`}
                  d={`M ${cx} ${cy - radius}
                      L ${cx + radius} ${cy + radius}
                      L ${cx - radius} ${cy + radius} Z`}
                  fill={asMask ? 'white' : fill}
                />
              );
            case 'dot':
            default:
              return (
                <Circle
                  key={`${keyPrefix}-dot-rounded-${row}-${col}`}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={asMask ? 'white' : fill}
                />
              );
          }
        })
      )}
    </G>
  );
};