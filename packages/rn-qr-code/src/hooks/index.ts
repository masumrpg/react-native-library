import { useEffect, useMemo, useState } from "react";
import QRCode, { QRCodeErrorCorrectionLevel } from "qrcode";
import { LogoOptions } from "../types";

type Props = {
  value: string;
  logo?: LogoOptions;
  version?: number;
  maxVersion?: number;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  isAsync?: boolean;
};

export const computeQrMatrix = ({
  value,
  logo,
  version,
  maxVersion = 10,
  errorCorrectionLevel,
}: Omit<Props, "isAsync">): number[][] => {
  if (!value) return [];
  try {
    const level: QRCodeErrorCorrectionLevel =
      errorCorrectionLevel ?? (logo ? "H" : "M");

    const options: QRCode.QRCodeOptions = {
      errorCorrectionLevel: level,
    };

    if (version) {
      options.version = version;
    }

    let qr: QRCode.QRCode | null = null;
    try {
      qr = QRCode.create(value, options);
    } catch (err) {
      if (options.version) {
        // If data exceeds the specified fixed version, fallback to auto-fit version
        delete options.version;
        qr = QRCode.create(value, options);
      } else {
        throw err;
      }
    }

    if (!qr) return [];

    if (maxVersion && qr.version > maxVersion) {
      console.warn(
        `[QRCode] Generated version ${qr.version} exceeds maxVersion ${maxVersion}`,
      );
    }

    const { size, data } = qr.modules;
    const newMatrix: number[][] = [];

    for (let i = 0; i < size; i++) {
      newMatrix.push(Array.from(data.slice(i * size, (i + 1) * size)));
    }

    return newMatrix;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return [];
  }
};

export const useGenerateQrCode = ({
  value,
  logo,
  version,
  maxVersion = 10,
  errorCorrectionLevel,
  isAsync = false,
}: Props) => {
  const [asyncMatrix, setAsyncMatrix] = useState<number[][]>([]);

  // Synchronous matrix (instant for lightweight usage)
  const syncMatrix = useMemo(() => {
    if (isAsync) return [];
    return computeQrMatrix({
      value,
      logo,
      version,
      maxVersion,
      errorCorrectionLevel,
    });
  }, [value, logo, version, maxVersion, errorCorrectionLevel, isAsync]);

  // Non-blocking asynchronous calculation
  useEffect(() => {
    if (!isAsync) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) return;
      const result = computeQrMatrix({
        value,
        logo,
        version,
        maxVersion,
        errorCorrectionLevel,
      });
      if (isMounted) {
        setAsyncMatrix(result);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [value, logo, version, maxVersion, errorCorrectionLevel, isAsync]);

  return isAsync ? asyncMatrix : syncMatrix;
};
