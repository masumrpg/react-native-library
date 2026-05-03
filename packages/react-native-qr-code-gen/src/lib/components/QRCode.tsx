import React from 'react';
import { QRCodeGenerator } from './QRCodeGenerator';
import type { QRCodeGeneratorProps, QRCodeProps } from '../types';
import { QR_CODE_CONFIGS } from '../constants';
import type { Svg } from 'react-native-svg';

const QRCode = React.forwardRef<Svg, QRCodeProps>(
  ({ variant = 'BASIC', ...overrides }, ref) => {
    const config = QR_CODE_CONFIGS[variant] as QRCodeGeneratorProps;

    return <QRCodeGenerator ref={ref} {...config} {...overrides} />;
  }
);

QRCode.displayName = 'QRCode';

export { QRCode };
