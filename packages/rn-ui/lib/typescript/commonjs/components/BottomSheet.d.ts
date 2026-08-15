import React from "react";
import { BottomSheetBackdrop as GorhomBottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetSectionList, BottomSheetTextInput, BottomSheetView, useBottomSheet, useBottomSheetModal, type BottomSheetBackdropProps, type BottomSheetModalProps, type BottomSheetProps as GorhomBottomSheetProps } from "@gorhom/bottom-sheet";
import type { StyleProp, ViewStyle } from "react-native";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
type GorhomBackdropComponentProps = React.ComponentProps<typeof GorhomBottomSheetBackdrop>;
export interface BottomSheetProps extends GorhomBottomSheetProps {
    withBackdrop?: boolean;
    backdropOpacity?: number;
    backdropAppearsOnIndex?: number;
    backdropDisappearsOnIndex?: number;
    backdropPressBehavior?: GorhomBackdropComponentProps["pressBehavior"];
    backdropStyle?: StyleProp<ViewStyle>;
}
export declare const BottomSheet: React.ForwardRefExoticComponent<BottomSheetProps & React.RefAttributes<BottomSheetMethods>>;
export { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetSectionList, BottomSheetTextInput, BottomSheetView, useBottomSheet, useBottomSheetModal, };
export type { BottomSheetBackdropProps, BottomSheetMethods, BottomSheetModalProps, GorhomBottomSheetProps, };
//# sourceMappingURL=BottomSheet.d.ts.map