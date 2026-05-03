import React from 'react';
import {
  Svg,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Mask,
  G,
} from 'react-native-svg';
import { GradientDirection, QRGradientProps } from '../types';

const getLinearCoords = (
  direction: GradientDirection | undefined,
  width: number,
  height: number
) => {
  switch (direction) {
    case 'to-right':
      return { x1: '0', y1: '0', x2: String(width), y2: '0' };
    case 'to-left':
      return { x1: String(width), y1: '0', x2: '0', y2: '0' };
    case 'to-bottom':
      return { x1: '0', y1: '0', x2: '0', y2: String(height) };
    case 'to-top':
      return { x1: '0', y1: String(height), x2: '0', y2: '0' };
    case 'to-bottom-right':
      return { x1: '0', y1: '0', x2: String(width), y2: String(height) };
    case 'to-bottom-left':
      return { x1: String(width), y1: '0', x2: '0', y2: String(height) };
    case 'to-top-right':
      return { x1: '0', y1: String(height), x2: String(width), y2: '0' };
    case 'to-top-left':
      return { x1: String(width), y1: String(height), x2: '0', y2: '0' };
    default:
      return { x1: '0', y1: '0', x2: String(width), y2: '0' };
  }
};

export const QRGradient = ({
  width = 300,
  height = 300,
  id = 'qrGradient',
  children,
  onGradientIdGenerated,
  ...gradientProps
}: QRGradientProps) => {
  const gradientId = id;
  const maskId = `${id}-mask`;

  React.useEffect(() => {
    if (onGradientIdGenerated) {
      onGradientIdGenerated(gradientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onGradientIdGenerated]);

  return (
    <Svg
      width={width}
      height={height}
      style={{ backgroundColor: 'transparent' }}
    >
      <Defs>
        {gradientProps.type === 'linear' ? (
          (() => {
            const coords = getLinearCoords(
              gradientProps.direction,
              width,
              height
            );
            return (
              <LinearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1={gradientProps.x1 ?? coords.x1}
                y1={gradientProps.y1 ?? coords.y1}
                x2={gradientProps.x2 ?? coords.x2}
                y2={gradientProps.y2 ?? coords.y2}
              >
                {gradientProps.colors.map((stop, i) => (
                  <Stop
                    key={i}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity ?? 1}
                  />
                ))}
              </LinearGradient>
            );
          })()
        ) : (
          <RadialGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            cx={gradientProps.cx ?? String(width / 2)}
            cy={gradientProps.cy ?? String(height / 2)}
            r={gradientProps.r ?? String(Math.min(width, height) / 2)}
            fx={gradientProps.fx ?? gradientProps.cx ?? String(width / 2)}
            fy={gradientProps.fy ?? gradientProps.cy ?? String(height / 2)}
          >
            {gradientProps.colors.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity ?? 1}
              />
            ))}
          </RadialGradient>
        )}

        <Mask id={maskId}>
          <G fill="white">{children}</G>
        </Mask>
      </Defs>

      <Rect
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
      />
    </Svg>
  );
};
