import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface PaginationProps extends ViewProps {
    page: number;
    pageCount: number;
    onPageChange?: (page: number) => void;
    previousLabel?: string;
    nextLabel?: string;
    style?: StyleProp<ViewStyle>;
}
export declare function Pagination({ page, pageCount, onPageChange, previousLabel, nextLabel, style, ...props }: PaginationProps): React.JSX.Element;
//# sourceMappingURL=Pagination.d.ts.map