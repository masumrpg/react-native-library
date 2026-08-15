import React from "react";
import { type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { BottomSheetView, type BottomSheetMethods, type BottomSheetProps } from "./BottomSheet";
export declare const Sheet: React.ForwardRefExoticComponent<BottomSheetProps & React.RefAttributes<BottomSheetMethods>>;
export { BottomSheetView as SheetContent };
export interface SheetHeaderProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function SheetHeader({ style, ...props }: SheetHeaderProps): React.JSX.Element;
export interface SheetTitleProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function SheetTitle({ children, style }: SheetTitleProps): React.JSX.Element;
export interface SheetDescriptionProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function SheetDescription({ children, style }: SheetDescriptionProps): React.JSX.Element;
export interface SheetFooterProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function SheetFooter({ style, ...props }: SheetFooterProps): React.JSX.Element;
//# sourceMappingURL=Sheet.d.ts.map