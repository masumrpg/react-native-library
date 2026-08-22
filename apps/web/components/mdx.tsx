import defaultComponents from "fumadocs-ui/mdx";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { TypeTable } from "fumadocs-ui/components/type-table";
import {
  Accordion,
  Accordions,
} from "fumadocs-ui/components/accordion";
import { Banner } from "fumadocs-ui/components/banner";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { MDXComponents } from "mdx/types";

import { icons } from "lucide-react";
import { createElement } from "react";

function CustomCard({ icon, ...props }: React.ComponentProps<typeof Card>) {
  let resolvedIcon = icon;
  if (typeof icon === "string" && icon in icons) {
    resolvedIcon = createElement(icons[icon as keyof typeof icons], {
      className: "size-5 text-fd-primary",
    });
  }
  return <Card icon={resolvedIcon} {...props} />;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    // Package install tabs (npm/yarn/pnpm/bun)
    Tab,
    Tabs,
    // Callouts / Admonitions
    Callout,
    // Navigation cards
    Card: CustomCard,
    Cards,
    // Step-by-step guides
    Step,
    Steps,
    // File tree diagrams
    File,
    Files,
    Folder,
    // TypeScript props tables (from fumadocs-docgen)
    TypeTable,
    // Accordions
    Accordion,
    Accordions,
    // Full-width banner
    Banner,
    // Zoomable images
    img: (props) => <ImageZoom {...(props as object)} />,
    ...components,
  };
}
