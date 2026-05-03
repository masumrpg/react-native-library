export const QR_CODE_CONFIGS = {
  BASIC: {
    value: 'Basic Qr Code',
    size: 250,
  },
  TRIANGLE: {
    value: 'Triangle Qr Code',
    piece: {
      shape: 'triangle',
    },
    color: '#DAA520',
    eye: {
      topLeft: { shape: 'triangle' },
      topRight: { shape: 'triangle' },
      bottomLeft: { shape: 'triangle' },
    },
    size: 250,
  },
  HEART: {
    value: 'Heart Qr Code',
    size: 250,
    color: 'pink',
    eye: {
      topLeft: { shape: 'heart' },
      topRight: { shape: 'heart' },
      bottomLeft: { shape: 'heart' },
    },
    piece: {
      shape: 'heart',
      size: 1,
    },
  },
  DOT: {
    value: 'Heart Qr Code',
    size: 250,
    color: '#483D8B',
    eye: {
      topLeft: { shape: 'dot' },
      topRight: { shape: 'dot' },
      bottomLeft: { shape: 'dot' },
    },
    piece: {
      shape: 'dot',
      size: 1,
    },
  },
  WITH_LOGO: {
    value: 'With Logo Qr Code',
    size: 250,
    logo: {
      source: require('../assets/logo.png'),
      size: 0.25,
      backgroundColor: 'transparent',
    },
    version: 3,
    piece: {
      shape: 'dot',
    },
    eye: {
      topRight: {
        shape: 'square',
        radius: {
          radiusOuter: 9,
          radiusInner: 5,
          radiusCenter: 3,
        },
        color: '#3178c6',
        innerColor: 'black',
      },
      bottomLeft: {
        shape: 'square',
        radius: {
          radiusOuter: 9,
          radiusInner: 5,
          radiusCenter: 3,
        },
        color: '#3178c6',
        innerColor: 'black',
      },
      topLeft: {
        shape: 'square',
        radius: {
          radiusOuter: 9,
          radiusInner: 5,
          radiusCenter: 3,
        },
        color: '#3178c6',
        innerColor: 'black',
      },
    },
    includeBackground: true,
  },
  RAIN: {
    value: 'Rain Qr Code',
    size: 250,
    color: '#2074a7',
    version: 2,
    eye: {
      topLeft: {
        shape: 'square',
        size: {
          center: 1.2,
          inner: 1.3,
        },
        radius: {
          radiusOuter: 20,
          radiusInner: 13,
          radiusCenter: 10,
        },
      },
      topRight: {
        shape: 'square',
        size: {
          center: 1.2,
          inner: 1.3,
        },
        radius: {
          radiusOuter: 20,
          radiusInner: 13,
          radiusCenter: 10,
        },
      },
      bottomLeft: {
        shape: 'square',
        size: {
          center: 1.2,
          inner: 1.3,
        },
        radius: {
          radiusOuter: 20,
          radiusInner: 13,
          radiusCenter: 10,
        },
      },
    },
    piece: {
      shape: 'rain',
      size: 1,
    },
    includeBackground: true,
  },
  LINEAR_GRADIENT: {
    value: 'Linear Gradient Qr Code',
    size: 250,
    includeBackground: true,
    version: 3,
    logo: {
      source: require('../assets/logo.png'),
      size: 0.25,
      backgroundColor: 'white',
      padding: 7,
      borderRadius: 99,
    },
    eye: {
      topRight: {
        shape: 'square',
        radius: {
          radiusOuter: {
            tl: 20,
            tr: 20,
            bl: 0,
            br: 20,
          },
          radiusInner: {
            tl: 13,
            tr: 13,
            bl: 0,
            br: 13,
          },
          radiusCenter: 15,
        },
        size: {
          center: 1.3,
          inner: 1.3,
        },
      },
      topLeft: {
        shape: 'square',
        radius: {
          radiusOuter: {
            tl: 20,
            tr: 20,
            bl: 20,
            br: 0,
          },
          radiusInner: {
            tl: 13,
            tr: 13,
            bl: 13,
            br: 0,
          },
          radiusCenter: 15,
        },
        size: {
          center: 1.3,
          inner: 1.3,
        },
      },
      bottomLeft: {
        shape: 'square',
        radius: {
          radiusOuter: {
            tl: 20,
            tr: 0,
            bl: 20,
            br: 20,
          },
          radiusInner: {
            tl: 13,
            tr: 0,
            bl: 13,
            br: 13,
          },
          radiusCenter: 15,
        },
        size: {
          center: 1.3,
          inner: 1.3,
        },
      },
    },
    piece: {
      shape: 'dot',
    },
    gradient: {
      type: 'linear',
      colors: [
        {
          offset: '0%',
          color: '#6366F1', // Modern Indigo
          opacity: 0.8,
        },
        {
          offset: '33%',
          color: '#EC4899', // Modern Pink
          opacity: 0.7,
        },
        {
          offset: '66%',
          color: '#8B5CF6', // Modern Purple
          opacity: 0.7,
        },
        {
          offset: '100%',
          color: '#3B82F6', // Modern Blue
          opacity: 0.8,
        },
      ],
      maskLogo: true,
    },
  },
  RADIAL_GRADIENT: {
    value: 'Radial Gradient Qr Code',
    size: 250,
    includeBackground: true,
    version: 3,
    piece: {
      shape: 'rounded',
      borderRadius: 2,
    },
    eye: {
      topRight: {
        shape: 'square',
        radius: {
          radiusOuter: 20,
          radiusInner: 13,
          radiusCenter: 10,
        },
      },
      topLeft: {
        shape: 'square',
        radius: {
          radiusOuter: 20,
          radiusInner: 13,
          radiusCenter: 10,
        },
      },
      bottomLeft: {
        shape: 'square',
        radius: {
          radiusOuter: 20,
          radiusInner: 13,
          radiusCenter: 10,
        },
      },
    },
    gradient: {
      type: 'radial',
      colors: [
        {
          offset: '10%',
          color: '#FFF242', // White center
          opacity: 0.5,
        },
        {
          offset: '100%',
          color: '#228B22', // Forest green
          opacity: 0.8,
        },
      ],
    },
  },
  IMAGE_BACKGROUND: {
    value: 'Image Background Qr Code',
    size: 250,
    includeBackground: true,
    version: 4,
    eye: {
      topRight: {
        shape: 'circle',
      },
      topLeft: {
        shape: 'circle',
      },
      bottomLeft: {
        shape: 'circle',
      },
    },
    errorCorrectionLevel: 'H',
    piece: {
      shape: 'dot',
    },
    imageClip: {
      href: require('../assets/logo.png'),
    },
  },
};
