import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface TableProps extends ViewProps {
    horizontal?: boolean;
    style?: StyleProp<ViewStyle>;
}
export interface TableRowProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export interface TableHeadProps extends ViewProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export interface TableCellProps extends ViewProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function Table({ horizontal, style, children, ...props }: TableProps): React.JSX.Element;
export declare function TableRow({ style, ...props }: TableRowProps): React.JSX.Element;
export declare function TableHead({ children, style, ...props }: TableHeadProps): React.JSX.Element;
export declare function TableCell({ children, style, ...props }: TableCellProps): React.JSX.Element;
//# sourceMappingURL=Table.d.ts.map