import { EyeCornerRadius, EyeLayerRadius } from "../types";

const normalizeRadius = (r: EyeLayerRadius = 0): EyeCornerRadius => {
  if (r === null || r === undefined) {
    return { tl: 0, tr: 0, br: 0, bl: 0 };
  }
  return typeof r === "number"
    ? { tl: r, tr: r, br: r, bl: r }
    : {
        tl: r.tl || 0,
        tr: r.tr || 0,
        br: r.br || 0,
        bl: r.bl || 0,
      };
};

const roundedRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: EyeCornerRadius = {},
) => {
  const { tl = 0, tr = 0, br = 0, bl = 0 } = r;

  const maxR = Math.min(w, h) / 2;
  const validTL = Math.max(0, Math.min(isFinite(tl) ? tl : 0, maxR));
  const validTR = Math.max(0, Math.min(isFinite(tr) ? tr : 0, maxR));
  const validBR = Math.max(0, Math.min(isFinite(br) ? br : 0, maxR));
  const validBL = Math.max(0, Math.min(isFinite(bl) ? bl : 0, maxR));

  return `M${x + validTL},${y}H${x + w - validTR}A${validTR},${validTR} 0 0 1 ${x + w},${y + validTR}V${y + h - validBR}A${validBR},${validBR} 0 0 1 ${x + w - validBR},${y + h}H${x + validBL}A${validBL},${validBL} 0 0 1 ${x},${y + h - validBL}V${y + validTL}A${validTL},${validTL} 0 0 1 ${x + validTL},${y}Z`;
};

const getPiecePath = (
  shape: string = "square",
  posX: number,
  posY: number,
  cellSize: number,
  adjustedSize: number,
  borderRadius: number = 0,
): string => {
  switch (shape) {
    case "triangle":
      return `M ${posX + adjustedSize / 2} ${posY} L ${posX + adjustedSize} ${
        posY + adjustedSize
      } L ${posX} ${posY + adjustedSize} Z `;
    case "heart":
      return `M ${posX + adjustedSize / 2} ${posY + adjustedSize} C ${
        posX + adjustedSize / 2
      } ${posY + adjustedSize * 0.5} ${posX} ${posY} ${posX} ${
        posY + adjustedSize * 0.5
      } C ${posX} ${posY - adjustedSize * 0.2} ${posX + adjustedSize / 2} ${
        posY - adjustedSize * 0.2
      } ${posX + adjustedSize / 2} ${posY + adjustedSize * 0.3} C ${
        posX + adjustedSize / 2
      } ${posY - adjustedSize * 0.2} ${posX + adjustedSize} ${
        posY - adjustedSize * 0.2
      } ${posX + adjustedSize} ${posY + adjustedSize * 0.5} C ${posX} ${posY} ${
        posX + adjustedSize / 2
      } ${posY + adjustedSize * 0.5} ${posX + adjustedSize / 2} ${
        posY + adjustedSize
      } Z `;
    case "dot": {
      const r = adjustedSize / 2;
      const cx = posX + r;
      const cy = posY + r;
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r} Z `;
    }
    case "rounded":
      return (
        roundedRectPath(posX, posY, adjustedSize, adjustedSize, {
          tl: borderRadius,
          tr: borderRadius,
          br: borderRadius,
          bl: borderRadius,
        }) + " "
      );
    case "rain": {
      const rainBarWidth = adjustedSize * 0.7;
      const rainBarHeight = adjustedSize * 0.95;
      const rainBarX = posX + (adjustedSize - rainBarWidth) / 2;
      const rainBarY = posY + (cellSize - rainBarHeight) / 2;
      return (
        roundedRectPath(rainBarX, rainBarY, rainBarWidth, rainBarHeight, {
          tl: rainBarWidth / 2,
          tr: rainBarWidth / 2,
          br: rainBarWidth / 2,
          bl: rainBarWidth / 2,
        }) + " "
      );
    }
    case "square":
    default:
      if (borderRadius > 0) {
        return (
          roundedRectPath(posX, posY, adjustedSize, adjustedSize, {
            tl: borderRadius,
            tr: borderRadius,
            br: borderRadius,
            bl: borderRadius,
          }) + " "
        );
      }
      return `M ${posX} ${posY} h ${adjustedSize} v ${adjustedSize} h -${adjustedSize} Z `;
  }
};

export { normalizeRadius, roundedRectPath, getPiecePath };
