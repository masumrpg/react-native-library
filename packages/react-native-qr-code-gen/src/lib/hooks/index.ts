import { useMemo } from "react";
import QRCode, { QRCodeErrorCorrectionLevel } from "qrcode";
import { LogoOptions } from "../types";

type Props = {
  value: string;
  logo?: LogoOptions;
  version?: number;
  maxVersion?: number;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
};

export const useGenerateQrCode = ({
  value,
  logo,
  version,
  maxVersion = 10,
  errorCorrectionLevel,
}: Props) => {
  const matrix = useMemo(() => {
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

      const qr = QRCode.create(value, options);

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
  }, [value, logo, version, maxVersion, errorCorrectionLevel]);

  return matrix;
};
