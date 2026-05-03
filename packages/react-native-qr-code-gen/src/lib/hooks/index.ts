import { useEffect, useState } from 'react';
import QRCode, { QRCodeErrorCorrectionLevel } from 'qrcode';
import { LogoOptions } from '../types';

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
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const generate = async () => {
      try {
        // Gunakan preferensi user, kalau tidak ada pakai default berdasarkan ada/tidaknya logo
        const level: QRCodeErrorCorrectionLevel =
          errorCorrectionLevel ?? (logo ? 'H' : 'M');

        let qr;

        if (version) {
          // Versi ditentukan langsung
          qr = await QRCode.create(value, {
            errorCorrectionLevel: level,
            version,
          });
        } else {
          // Coba dari versi 1 sampai maxVersion
          for (let v = 1; v <= maxVersion; v++) {
            try {
              qr = await QRCode.create(value, {
                errorCorrectionLevel: level,
                version: v,
              });
              break;
            } catch {
              continue;
            }
          }
        }

        if (!qr)
          throw new Error(
            'Unable to generate QR code with the provided configuration'
          );

        const { size, data } = qr.modules;
        const newMatrix: number[][] = [];

        for (let i = 0; i < size; i++) {
          newMatrix.push(Array.from(data.slice(i * size, (i + 1) * size)));
        }

        setMatrix(newMatrix);
      } catch (error) {
        console.error('Error generating QR code:', error);
        setMatrix([]);
      }
    };

    generate();
  }, [value, logo, version, maxVersion, errorCorrectionLevel]);

  return matrix;
};
