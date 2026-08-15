import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface DataListProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export interface DataListItemProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export interface DataListLabelProps {
    children?: React.ReactNode;
}
export interface DataListValueProps {
    children?: React.ReactNode;
}
export declare function DataList({ style, ...props }: DataListProps): React.JSX.Element;
export declare function DataListItem({ style, ...props }: DataListItemProps): React.JSX.Element;
export declare function DataListLabel({ children }: DataListLabelProps): React.JSX.Element;
export declare function DataListValue({ children }: DataListValueProps): React.JSX.Element;
//# sourceMappingURL=DataList.d.ts.map