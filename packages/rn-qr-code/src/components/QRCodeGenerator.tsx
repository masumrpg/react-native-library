import React from "react";
import { View } from "react-native";
import { Svg, Rect, Path } from "react-native-svg";
import { QRCodeGeneratorProps } from "../types";
import { useGenerateQrCode } from "../hooks";
import { QRLogo } from "./QRLogo";
import { QREye } from "./QREye";
import { QRGradient } from "./QRGradient";
import { QRImage } from "./QRImage";
import { getPiecePath } from "../utils";

const QRCodeGeneratorSVG = (
  {
    value,
    size = 256,
    color = "#000",
    gradient,
    imageClip,
    logo,
    backgroundColor = "transparent",
    piece,
    eye,
    version,
    maxVersion,
    errorCorrectionLevel,
    isLoading = false,
    isAsync = false,
    renderLoading,
  }: QRCodeGeneratorProps,
  ref?: React.ForwardedRef<Svg> | null,
) => {
  const matrix = useGenerateQrCode({
    value,
    logo,
    version,
    maxVersion,
    errorCorrectionLevel,
    isAsync,
  });

  const cellSize = matrix.length > 0 ? size / matrix.length : 0;

  const piecePathData = React.useMemo(() => {
    if (!matrix || matrix.length === 0) return "";
    const eyeZone = 7;
    const len = matrix.length;
    const {
      shape = "square",
      size: pieceSize = 1,
      borderRadius = 0,
    } = piece || {};
    const adjustedSize = cellSize * pieceSize;
    const centerOffset = (cellSize - adjustedSize) / 2;
    let d = "";

    for (let y = 0; y < len; y++) {
      const row = matrix[y];
      for (let x = 0; x < len; x++) {
        if (!row[x]) continue;

        const inTopLeft = x < eyeZone && y < eyeZone;
        const inTopRight = x >= len - eyeZone && y < eyeZone;
        const inBottomLeft = x < eyeZone && y >= len - eyeZone;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        const posX = x * cellSize + centerOffset;
        const posY = y * cellSize + centerOffset;
        d += getPiecePath(
          shape,
          posX,
          posY,
          cellSize,
          adjustedSize,
          borderRadius,
        );
      }
    }
    return d;
  }, [matrix, cellSize, piece]);

  const pieces = React.useMemo(() => {
    if (!piecePathData) return null;
    return (
      <Path
        d={piecePathData}
        fill={piece?.color || color}
        opacity={piece?.opacity ?? 1}
      />
    );
  }, [piecePathData, piece?.color, color, piece?.opacity]);

  const maskPieces = React.useMemo(() => {
    if (!piecePathData || (!gradient && !imageClip)) return null;
    return (
      <Path
        d={piecePathData}
        fill="white"
        opacity={piece?.opacity ?? 1}
      />
    );
  }, [piecePathData, gradient, imageClip, piece?.opacity]);

  const eyes = React.useMemo(() => {
    if (!matrix || matrix.length === 0) return null;

    return (
      <>
        <QREye
          x={0}
          y={0}
          cellSize={cellSize}
          eyeOptions={eye?.topLeft || {}}
          defaultColor={color}
          defaultBackgroundColor={backgroundColor}
          keyPrefix="eye-tl"
        />
        <QREye
          x={size - cellSize * 7}
          y={0}
          cellSize={cellSize}
          eyeOptions={eye?.topRight || {}}
          defaultColor={color}
          defaultBackgroundColor={backgroundColor}
          keyPrefix="eye-tr"
        />
        <QREye
          x={0}
          y={size - cellSize * 7}
          cellSize={cellSize}
          eyeOptions={eye?.bottomLeft || {}}
          defaultColor={color}
          defaultBackgroundColor={backgroundColor}
          keyPrefix="eye-bl"
        />
      </>
    );
  }, [matrix, cellSize, eye, color, backgroundColor, size]);

  const maskEyes = React.useMemo(() => {
    if (!matrix || matrix.length === 0 || (!gradient && !imageClip)) return null;

    return (
      <>
        <QREye
          x={0}
          y={0}
          cellSize={cellSize}
          eyeOptions={eye?.topLeft || {}}
          defaultColor="white"
          defaultBackgroundColor="black"
          keyPrefix="eye-tl-mask"
          asMask
        />
        <QREye
          x={size - cellSize * 7}
          y={0}
          cellSize={cellSize}
          eyeOptions={eye?.topRight || {}}
          defaultColor="white"
          defaultBackgroundColor="black"
          keyPrefix="eye-tr-mask"
          asMask
        />
        <QREye
          x={0}
          y={size - cellSize * 7}
          cellSize={cellSize}
          eyeOptions={eye?.bottomLeft || {}}
          defaultColor="white"
          defaultBackgroundColor="black"
          keyPrefix="eye-bl-mask"
          asMask
        />
      </>
    );
  }, [matrix, cellSize, eye, size, gradient, imageClip]);

  if (isLoading || matrix.length === 0) {
    if (renderLoading) {
      return <>{renderLoading()}</>;
    }
    // Default placeholder to maintain layout stability
    return (
      <View
        style={{
          width: size,
          height: size,
          backgroundColor:
            backgroundColor === "transparent" ? "#f5f5f5" : backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  const renderSvgContent = (children: React.ReactNode) => {
    return (
      <Svg
        ref={ref}
        width={size}
        height={size}
        style={{ backgroundColor: "transparent" }}
      >
        {backgroundColor !== "transparent" && (
          <Rect width={size} height={size} fill={backgroundColor} />
        )}
        {children}
      </Svg>
    );
  };

  // --- CASE 1: Gradient with maskLogo
  if (gradient?.maskLogo) {
    return renderSvgContent(
      <QRGradient width={size} height={size} {...gradient}>
        {maskPieces}
        {maskEyes}
        {logo && <QRLogo logo={logo} size={size} matrix={matrix} />}
      </QRGradient>,
    );
  }

  // --- CASE 2: Gradient without mask
  if (gradient) {
    return renderSvgContent(
      <>
        <QRGradient width={size} height={size} {...gradient}>
          {maskPieces}
          {maskEyes}
        </QRGradient>
        {logo && <QRLogo logo={logo} size={size} matrix={matrix} />}
      </>,
    );
  }

  // --- CASE 3: Image
  if (imageClip) {
    return renderSvgContent(
      <QRImage
        size={size}
        source={imageClip}
        baseClip={
          <>
            {pieces}
            {eyes}
          </>
        }
      >
        {maskPieces}
        {maskEyes}
      </QRImage>,
    );
  }

  // --- CASE 4: Plain QR (no gradient)
  return renderSvgContent(
    <>
      {pieces}
      {eyes}
      {logo && <QRLogo logo={logo} size={size} matrix={matrix} />}
    </>,
  );
};

const QRCodeGenerator = React.forwardRef(QRCodeGeneratorSVG);
QRCodeGenerator.displayName = "QRCodeGenerator";
export { QRCodeGenerator };
