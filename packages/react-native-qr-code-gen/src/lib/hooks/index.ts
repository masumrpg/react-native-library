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
    try {
      const level: QRCodeErrorCorrectionLevel =
        errorCorrectionLevel ?? (logo ? "H" : "M");

      let qr;

      if (version) {
        qr = QRCode.create(value, {
          errorCorrectionLevel: level,
          version,
        });
      } else {
        for (let v = 1; v <= maxVersion; v++) {
          try {
            qr = QRCode.create(value, {
              errorCorrectionLevel: level,
              version: v,
            });
            break;
          } catch {
            continue;
          }
        }
      }

      if (!qr) return [];

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
