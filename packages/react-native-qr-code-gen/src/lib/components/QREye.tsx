import React from "react";
import { G, Circle, Path, Defs, Mask, Rect } from "react-native-svg";
import { DotShapeProps, EyeSize, QREyeProps, SquareRadius } from "../types";
import { normalizeRadius, roundedRectPath } from "../utils";

const QREyeComponent = ({
  x,
  y,
  cellSize,
  eyeOptions,
  defaultColor,
  defaultBackgroundColor,
  keyPrefix,
  asMask = false,
}: QREyeProps) => {
  const color = asMask ? "white" : defaultColor;

  const {
    shape = "shape",
    color: eyeColor = color,
    innerColor: innerEyeColor = eyeColor,
    backgroundColor: eyeBg = defaultBackgroundColor,
    dotSizeRatio = 0.5,
  } = eyeOptions;

  const squareSize: EyeSize | undefined =
    shape === "square" && "size" in eyeOptions ? eyeOptions.size : {};
  const {
    outer: squareSizeOuter, // 7
    center: squareSizeCenter, // 5
    inner: squareSizeInner, // 3
  } = squareSize || {};

  const squareRadius: SquareRadius | undefined =
    shape === "square" && "radius" in eyeOptions ? eyeOptions.radius : {};
  const {
    radiusOuter = 0,
    radiusInner = 0,
    radiusCenter = 0,
  } = squareRadius || {};

  const circleSize: EyeSize | undefined =
    shape === "circle" && "size" in eyeOptions ? eyeOptions.size : {};
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

  if (shape === "dot" || shape === "triangle" || shape === "heart") {
    return dotShape(shape, options);
  }

  return shape === "circle" ? (
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
              fill={"white"}
            />
            <Circle
              cx={center.x}
              cy={center.y}
              r={cellSize * (centerCircleSize ? centerCircleSize + 1.5 : 2.5)}
              fill={"black"}
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
          rOuter,
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
          rInner,
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
          rCenter,
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
              rOuter,
            )}
            fill={"white"}
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
              rInner,
            )}
            fill={"black"}
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
            rInner,
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
            rCenter,
          )}
          fill={innerEyeColor}
        />
      </G>
    </>
  );
};

const dotShape = (
  variant: "dot" | "triangle" | "heart",
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
  }: DotShapeProps,
) => {
  const elements: React.ReactNode[] = [];
  const radius = cellSize * dotSizeRatio;

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const isCenter = row >= 2 && row <= 4 && col >= 2 && col <= 4;
      const isInner = row >= 1 && row <= 5 && col >= 1 && col <= 5;

      if (isInner && !isCenter) {
        const isInnerCorner =
          (row === 1 && col === 1) ||
          (row === 1 && col === 5) ||
          (row === 5 && col === 1) ||
          (row === 5 && col === 5);
        if (!isInnerCorner) continue;
      }

      const cx = x + col * cellSize + cellSize / 2;
      const cy = y + row * cellSize + cellSize / 2;
      const fill = asMask
        ? "white"
        : isCenter
        ? innerEyeColor
        : isInner
        ? eyeBg
        : eyeColor;

      switch (variant) {
        case "heart": {
          const heartPath = `M ${cx} ${cy + radius * 0.7} C ${cx} ${
            cy + radius * 0.3
          } ${cx - radius} ${cy - radius * 0.5} ${cx - radius} ${
            cy - radius * 0.2
          } C ${cx - radius} ${cy - radius * 1.2} ${cx} ${
            cy - radius * 1.2
          } ${cx} ${cy - radius * 0.7} C ${cx} ${
            cy - radius * 1.2
          } ${cx + radius} ${cy - radius * 1.2} ${cx + radius} ${
            cy - radius * 0.2
          } C ${cx + radius} ${cy - radius * 0.5} ${cx} ${
            cy + radius * 0.3
          } ${cx} ${cy + radius * 0.7} Z`;
          elements.push(
            <Path
              key={`${keyPrefix}-heart-${row}-${col}`}
              d={heartPath}
              fill={fill}
            />,
          );
          break;
        }
        case "triangle":
          elements.push(
            <Path
              key={`${keyPrefix}-triangle-${row}-${col}`}
              d={`M ${cx} ${cy - radius} L ${cx + radius} ${
                cy + radius
              } L ${cx - radius} ${cy + radius} Z`}
              fill={fill}
            />,
          );
          break;
        case "dot":
        default:
          elements.push(
            <Circle
              key={`${keyPrefix}-dot-${row}-${col}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill={fill}
            />,
          );
          break;
      }
    }
  }

  return <G key={keyPrefix}>{elements}</G>;
};

export const QREye = React.memo(QREyeComponent);
