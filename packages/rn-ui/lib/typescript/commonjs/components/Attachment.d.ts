import React from "react";
import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export type AttachmentLayout = "card" | "row";
export type AttachmentDescriptionTone = "default" | "info" | "success" | "warning" | "danger";
export interface AttachmentProps {
    /**
     * Layout style of the attachment.
     * - 'card': A square card layout, ideal for grid-like previews of images.
     * - 'row': A full-width horizontal row, ideal for document/file listings.
     * Defaults to 'row'.
     */
    layout?: AttachmentLayout;
    /**
     * Name of the file, e.g., 'workspace.png'.
     */
    name: string;
    /**
     * Description or metadata, e.g., 'PNG • 820 KB' or 'Uploading • 64%'.
     */
    description?: string;
    /**
     * Pluggable icon/thumbnail for the attachment.
     * Can be a URI string (rendered as Image), a ReactNode, or a RenderIcon function.
     */
    thumbnail?: string | RenderIcon;
    /**
     * Pluggable fallback file icon when no thumbnail is provided.
     */
    fileIcon?: RenderIcon;
    /**
     * Tone for the description text. Use this instead of deriving visual state from copy.
     */
    descriptionTone?: AttachmentDescriptionTone;
    /**
     * If true, shows a loading spinner in the thumbnail slot.
     */
    loading?: boolean;
    /**
     * Callback triggered when the remove button is pressed.
     * Shows a close button on the right side if defined.
     */
    onRemove?: () => void;
    /**
     * Pluggable close/remove icon.
     */
    closeIcon?: RenderIcon;
    /**
     * Callback triggered when pressing the entire attachment card/row.
     */
    onPress?: () => void;
    /**
     * Style overrides for the root container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Style overrides for the name text.
     */
    nameStyle?: StyleProp<TextStyle>;
    /**
     * Style overrides for the description text.
     */
    descriptionStyle?: StyleProp<TextStyle>;
}
export declare function Attachment({ layout, name, description, thumbnail, loading, onRemove, closeIcon, fileIcon, descriptionTone, onPress, style, nameStyle, descriptionStyle, ...props }: AttachmentProps): React.JSX.Element;
//# sourceMappingURL=Attachment.d.ts.map