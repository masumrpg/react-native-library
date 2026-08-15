import React from "react";
import { type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface BreadcrumbProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function Breadcrumb({ style, ...props }: BreadcrumbProps): React.JSX.Element;
export interface BreadcrumbItemProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function BreadcrumbItem({ style, ...props }: BreadcrumbItemProps): React.JSX.Element;
export interface BreadcrumbLinkProps extends PressableProps {
    children?: React.ReactNode;
}
export interface BreadcrumbPageProps {
    children?: React.ReactNode;
}
export interface BreadcrumbSeparatorProps {
    children?: React.ReactNode;
}
export declare function BreadcrumbLink({ children, disabled, ...props }: BreadcrumbLinkProps): React.JSX.Element;
export declare function BreadcrumbPage({ children }: BreadcrumbPageProps): React.JSX.Element;
export declare function BreadcrumbSeparator({ children, }: BreadcrumbSeparatorProps): React.JSX.Element;
//# sourceMappingURL=Breadcrumb.d.ts.map