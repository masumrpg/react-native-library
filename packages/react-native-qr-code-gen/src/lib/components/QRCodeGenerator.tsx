import React from "react";
import { View } from "react-native";
import { Svg, Rect } from "react-native-svg";
import { QRCodeGeneratorProps } from "../types";
import { useGenerateQrCode } from "../hooks";
import { QRLogo } from "./QRLogo";
import { QREye } from "./QREye";
import { QRPiece } from "./QRPiece";
import { QRGradient } from "./QRGradient";
import { QRBgStyle } from "./QRBgStyle";
import { QRImage } from "./QRImage";

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
    includeBackground = false,
    version,
    maxVersion,
    errorCorrectionLevel,
    isLoading = false,
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
  });

  const cellSize = matrix.length > 0 ? size / matrix.length : 0;

  const pieces = React.useMemo(() => {
    if (!matrix || matrix.length === 0) return [];
    const eyeZone = 7;
    const len = matrix.length;
    const result: React.ReactNode[] = [];

    for (let y = 0; y < len; y++) {
      const row = matrix[y];
      for (let x = 0; x < len; x++) {
        if (!row[x]) continue;

        const inTopLeft = x < eyeZone && y < eyeZone;
        const inTopRight = x >= len - eyeZone && y < eyeZone;
        const inBottomLeft = x < eyeZone && y >= len - eyeZone;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        result.push(
          <QRPiece
            key={`piece-${x}-${y}`}
            x={x}
            y={y}
            cell={row[x]}
            cellSize={cellSize}
            pieceOptions={piece || {}}
            defaultColor={color}
            keyPrefix={`piece-${x}-${y}`}
          />,
        );
      }
    }
    return result;
  }, [matrix, cellSize, piece, color]);

  const maskPieces = React.useMemo(() => {
    if (!matrix || matrix.length === 0 || (!gradient && !imageClip)) return null;

    const eyeZone = 7;
    const len = matrix.length;
    const result: React.ReactNode[] = [];

    for (let y = 0; y < len; y++) {
      const row = matrix[y];
      for (let x = 0; x < len; x++) {
        if (!row[x]) continue;

        const inTopLeft = x < eyeZone && y < eyeZone;
        const inTopRight = x >= len - eyeZone && y < eyeZone;
        const inBottomLeft = x < eyeZone && y >= len - eyeZone;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        result.push(
          <QRPiece
            key={`piece-mask-${x}-${y}`}
            x={x}
            y={y}
            cell={row[x]}
            cellSize={cellSize}
            pieceOptions={piece || {}}
            defaultColor="white"
            keyPrefix={`piece-mask-${x}-${y}`}
            asMask
          />,
        );
      }
    }
    return result;
  }, [matrix, cellSize, piece, gradient, imageClip]);

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
          borderRadius: includeBackground ? 12 : 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  const renderSvgContent = (children: React.ReactNode) => {
    const svg = (
      <Svg
        ref={ref}
        width={size}
        height={size}
        style={{ backgroundColor: "transparent" }}
      >
        <Rect width={size} height={size} fill={"transparent"} />
        {children}
      </Svg>
    );

    return includeBackground ? (
      <QRBgStyle
        width={size}
        backgroundColor={
          backgroundColor === "transparent" ? "white" : backgroundColor
        }
      >
        {svg}
      </QRBgStyle>
    ) : (
      svg
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
