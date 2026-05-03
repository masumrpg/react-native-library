import { EyeCornerRadius, EyeLayerRadius } from '../types';

const normalizeRadius = (r: EyeLayerRadius = 0): EyeCornerRadius => {
  if (r === null || r === undefined) {
    return { tl: 0, tr: 0, br: 0, bl: 0 };
  }
  return typeof r === 'number'
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
  r: EyeCornerRadius = {}
) => {
  const { tl = 0, tr = 0, br = 0, bl = 0 } = r;

  const validTL = isFinite(tl) ? tl : 0;
  const validTR = isFinite(tr) ? tr : 0;
  const validBR = isFinite(br) ? br : 0;
  const validBL = isFinite(bl) ? bl : 0;

  return `
    M${x + validTL},${y}
    H${x + w - validTR}
    A${validTR},${validTR} 0 0 1 ${x + w},${y + validTR}
    V${y + h - validBR}
    A${validBR},${validBR} 0 0 1 ${x + w - validBR},${y + h}
    H${x + validBL}
    A${validBL},${validBL} 0 0 1 ${x},${y + h - validBL}
    V${y + validTL}
    A${validTL},${validTL} 0 0 1 ${x + validTL},${y}
    Z
  `;
};

export { normalizeRadius, roundedRectPath };
