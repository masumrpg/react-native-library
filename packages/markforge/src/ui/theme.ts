import pc from "picocolors";

export const colors = {
  primary: (text: string) => pc.cyan(text),
  secondary: (text: string) => pc.blue(text),
  success: (text: string) => pc.green(text),
  warning: (text: string) => pc.yellow(text),
  error: (text: string) => pc.red(text),
  muted: (text: string) => pc.dim(text),
  bold: (text: string) => pc.bold(text),
  highlight: (text: string) => pc.magenta(text),
};
