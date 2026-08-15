import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { type SharedValue } from "react-native-reanimated";
import { type RenderIcon } from "./types.js";
export interface CarouselProps {
    itemWidth?: number;
    onIndexChange?: (index: number) => void;
    showPagination?: boolean;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export interface CarouselContextProps {
    scrollX: SharedValue<number>;
    itemWidth: number;
    activeIndex: number;
    totalItems: number;
    setTotalItems: React.Dispatch<React.SetStateAction<number>>;
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    scrollViewRef: React.RefObject<any>;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}
export declare function useCarousel(): CarouselContextProps;
export declare function Carousel({ itemWidth, onIndexChange, showPagination, style, children, ...props }: CarouselProps): React.JSX.Element;
export interface CarouselContentProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function CarouselContent({ style, children }: CarouselContentProps): React.JSX.Element;
export interface CarouselItemProps {
    index?: number;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function CarouselItem({ index, style, children, ...props }: CarouselItemProps): React.JSX.Element;
export interface CarouselButtonProps {
    style?: StyleProp<ViewStyle>;
    icon?: RenderIcon;
}
export declare function CarouselPrevious({ style, icon }: CarouselButtonProps): React.JSX.Element | null;
export declare function CarouselNext({ style, icon }: CarouselButtonProps): React.JSX.Element | null;
//# sourceMappingURL=Carousel.d.ts.map