export const QR_CODE_CONFIGS = {
  BASIC: {
    value: "Basic Qr Code",
    size: 250,
  },
  TRIANGLE: {
    value: "Triangle Qr Code",
    piece: {
      shape: "triangle",
    },
    color: "#DAA520",
    eye: {
      topLeft: { shape: "triangle" },
      topRight: { shape: "triangle" },
      bottomLeft: { shape: "triangle" },
    },
    size: 250,
  },
  HEART: {
    value: "Heart Qr Code",
    size: 250,
    color: "pink",
    eye: {
      topLeft: { shape: "heart" },
      topRight: { shape: "heart" },
      bottomLeft: { shape: "heart" },
    },
    piece: {
      shape: "heart",
      size: 1,
    },
  },
  DOT: {
    value: "Heart Qr Code",
    size: 250,
    color: "#483D8B",
    eye: {
      topLeft: { shape: "dot" },
      topRight: { shape: "dot" },
      bottomLeft: { shape: "dot" },
    },
    piece: {
      shape: "dot",
      size: 1,
    },
  },
  WITH_LOGO: {
    value: "With Logo Qr Code",
    size: 250,
    logo: {
      source: require("../assets/logo.png"),
      size: 0.25,
      backgroundColor: "transparent",
    },
    piece: {
      shape: "dot",
    },
    eye: {
      topRight: {
        shape: "square",
        radius: {
          radiusOuter: 9,
          radiusInner: 5,
          radiusCenter: 3,
        },
        color: "#3178c6",
        innerColor: "black",
      },
      bottomLeft: {
        shape: "square",
        radius: {
          radiusOuter: 9,
          radiusInner: 5,
          radiusCenter: 3,
        },
        color: "#3178c6",
        innerColor: "black",
      },
      topLeft: {
        shape: "square",
        radius: {
          radiusOuter: 9,
          radiusInner: 5,
          radiusCenter: 3,
        },
        color: "#3178c6",
        innerColor: "black",
      },
    },
  },
  RAIN: {
    value: "Rain Qr Code",
    size: 250,
    color: "#2074a7",
    eye: {
      topLeft: {
        shape: "square",
        radius: {
          radiusOuter: 12,
          radiusInner: 8,
          radiusCenter: 6,
        },
      },
      topRight: {
        shape: "square",
        radius: {
          radiusOuter: 12,
          radiusInner: 8,
          radiusCenter: 6,
        },
      },
      bottomLeft: {
        shape: "square",
        radius: {
          radiusOuter: 12,
          radiusInner: 8,
          radiusCenter: 6,
        },
      },
    },
    piece: {
      shape: "rain",
      size: 1,
    },
  },
  LINEAR_GRADIENT: {
    value: "Linear Gradient Qr Code",
    size: 250,
    logo: {
      source: require("../assets/logo.png"),
      size: 0.25,
      backgroundColor: "white",
      padding: 7,
      borderRadius: 99,
    },
    eye: {
      topRight: {
        shape: "square",
        radius: {
          radiusOuter: {
            tl: 14,
            tr: 14,
            bl: 0,
            br: 14,
          },
          radiusInner: {
            tl: 8,
            tr: 8,
            bl: 0,
            br: 8,
          },
          radiusCenter: 6,
        },
      },
      topLeft: {
        shape: "square",
        radius: {
          radiusOuter: {
            tl: 14,
            tr: 14,
            bl: 14,
            br: 0,
          },
          radiusInner: {
            tl: 8,
            tr: 8,
            bl: 8,
            br: 0,
          },
          radiusCenter: 6,
        },
      },
      bottomLeft: {
        shape: "square",
        radius: {
          radiusOuter: {
            tl: 14,
            tr: 0,
            bl: 14,
            br: 14,
          },
          radiusInner: {
            tl: 8,
            tr: 0,
            bl: 8,
            br: 8,
          },
          radiusCenter: 6,
        },
      },
    },
    piece: {
      shape: "dot",
    },
    gradient: {
      type: "linear",
      colors: [
        {
          offset: "0%",
          color: "#6366F1", // Modern Indigo
          opacity: 0.8,
        },
        {
          offset: "33%",
          color: "#EC4899", // Modern Pink
          opacity: 0.7,
        },
        {
          offset: "66%",
          color: "#8B5CF6", // Modern Purple
          opacity: 0.7,
        },
        {
          offset: "100%",
          color: "#3B82F6", // Modern Blue
          opacity: 0.8,
        },
      ],
      maskLogo: true,
    },
  },
  RADIAL_GRADIENT: {
    value: "Radial Gradient Qr Code",
    size: 250,
    version: 3,
    piece: {
      shape: "rounded",
      borderRadius: 2,
    },
    eye: {
      topRight: {
        shape: "square",
        radius: {
          radiusOuter: 12,
          radiusInner: 8,
          radiusCenter: 6,
        },
      },
      topLeft: {
        shape: "square",
        radius: {
          radiusOuter: 12,
          radiusInner: 8,
          radiusCenter: 6,
        },
      },
      bottomLeft: {
        shape: "square",
        radius: {
          radiusOuter: 12,
          radiusInner: 8,
          radiusCenter: 6,
        },
      },
    },
    gradient: {
      type: "radial",
      colors: [
        {
          offset: "10%",
          color: "#EAB308", // Golden Yellow center
          opacity: 0.9,
        },
        {
          offset: "100%",
          color: "#16A34A", // Vibrant Green
          opacity: 1,
        },
      ],
    },
  },
  IMAGE_BACKGROUND: {
    value: "Image Background Qr Code",
    size: 250,
    eye: {
      topRight: {
        shape: "circle",
      },
      topLeft: {
        shape: "circle",
      },
      bottomLeft: {
        shape: "circle",
      },
    },
    errorCorrectionLevel: "H",
    piece: {
      shape: "dot",
    },
    imageClip: {
      href: require("../assets/logo.png"),
    },
  },
};
