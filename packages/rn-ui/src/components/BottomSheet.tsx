import React from "react";
import GorhomBottomSheet, {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheet,
  useBottomSheetModal,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps as GorhomBottomSheetModalProps,
  type BottomSheetProps as GorhomBottomSheetProps,
} from "@gorhom/bottom-sheet";
import type { StyleProp, ViewStyle } from "react-native";
import type {
  BottomSheetMethods,
  BottomSheetModalMethods,
} from "@gorhom/bottom-sheet/lib/typescript/types";

import { useTheme } from "../theme";

type GorhomBackdropComponentProps = React.ComponentProps<
  typeof GorhomBottomSheetBackdrop
>;

export interface BottomSheetProps extends GorhomBottomSheetProps {
  withBackdrop?: boolean;
  backdropOpacity?: number;
  backdropAppearsOnIndex?: number;
  backdropDisappearsOnIndex?: number;
  backdropPressBehavior?: GorhomBackdropComponentProps["pressBehavior"];
  backdropStyle?: StyleProp<ViewStyle>;
}

export const BottomSheet = React.forwardRef<
  BottomSheetMethods,
  BottomSheetProps
>(function BottomSheet(
  {
    index = -1,
    animateOnMount = false,
    enablePanDownToClose = true,
    withBackdrop = true,
    backdropOpacity = 0.48,
    backdropAppearsOnIndex = 0,
    backdropDisappearsOnIndex = -1,
    backdropPressBehavior = "close",
    backdropStyle,
    backdropComponent,
    backgroundStyle,
    handleStyle,
    handleIndicatorStyle,
    style,
    children,
    ...props
  },
  ref,
) {
  const { colors, components, radii, spacing } = useTheme();

  const themedBackdrop = React.useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <GorhomBottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={backdropAppearsOnIndex}
        disappearsOnIndex={backdropDisappearsOnIndex}
        opacity={backdropOpacity}
        pressBehavior={backdropPressBehavior}
        style={[
          {
            backgroundColor: colors.overlay,
          },
          backdropProps.style,
          backdropStyle,
        ]}
      />
    ),
    [
      backdropAppearsOnIndex,
      backdropDisappearsOnIndex,
      backdropOpacity,
      backdropPressBehavior,
      backdropStyle,
      colors.overlay,
    ],
  );

  return (
    <GorhomBottomSheet
      ref={ref}
      index={index}
      animateOnMount={animateOnMount}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={
        backdropComponent ?? (withBackdrop ? themedBackdrop : undefined)
      }
      backgroundStyle={[
        {
          backgroundColor: colors.surface,
          borderTopLeftRadius: radii.xxl,
          borderTopRightRadius: radii.xxl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
        },
        backgroundStyle,
      ]}
      handleStyle={[
        {
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        },
        handleStyle,
      ]}
      handleIndicatorStyle={[
        {
          width: 40,
          height: 4,
          borderRadius: radii.full,
          backgroundColor: colors.border,
        },
        handleIndicatorStyle,
      ]}
      style={[
        {
          elevation: 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </GorhomBottomSheet>
  );
});

export interface BottomSheetModalProps extends GorhomBottomSheetModalProps {
  withBackdrop?: boolean;
  backdropOpacity?: number;
  backdropAppearsOnIndex?: number;
  backdropDisappearsOnIndex?: number;
  backdropPressBehavior?: GorhomBackdropComponentProps["pressBehavior"];
  backdropStyle?: StyleProp<ViewStyle>;
}

export const BottomSheetModal = React.forwardRef<
  BottomSheetModalMethods,
  BottomSheetModalProps
>(function BottomSheetModal(
  {
    snapPoints = ["45%"],
    enablePanDownToClose = true,
    withBackdrop = true,
    backdropOpacity = 0.5,
    backdropAppearsOnIndex = 0,
    backdropDisappearsOnIndex = -1,
    backdropPressBehavior = "close",
    backdropStyle,
    backdropComponent,
    backgroundStyle,
    handleStyle,
    handleIndicatorStyle,
    style,
    children,
    ...props
  },
  ref,
) {
  const { colors, components, radii, spacing } = useTheme();

  const themedBackdrop = React.useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <GorhomBottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={backdropAppearsOnIndex}
        disappearsOnIndex={backdropDisappearsOnIndex}
        opacity={backdropOpacity}
        pressBehavior={backdropPressBehavior}
        style={[
          {
            backgroundColor: colors.overlay,
          },
          backdropProps.style,
          backdropStyle,
        ]}
      />
    ),
    [
      backdropAppearsOnIndex,
      backdropDisappearsOnIndex,
      backdropOpacity,
      backdropPressBehavior,
      backdropStyle,
      colors.overlay,
    ],
  );

  return (
    <GorhomBottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={
        backdropComponent ?? (withBackdrop ? themedBackdrop : undefined)
      }
      backgroundStyle={[
        {
          backgroundColor: colors.surface,
          borderTopLeftRadius: radii.xxl,
          borderTopRightRadius: radii.xxl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
        },
        backgroundStyle,
      ]}
      handleStyle={[
        {
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        },
        handleStyle,
      ]}
      handleIndicatorStyle={[
        {
          width: 40,
          height: 4,
          borderRadius: radii.full,
          backgroundColor: colors.border,
        },
        handleIndicatorStyle,
      ]}
      style={[
        {
          elevation: 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </GorhomBottomSheetModal>
  );
});

export {
  BottomSheetFlatList,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheet,
  useBottomSheetModal,
};

export type {
  BottomSheetBackdropProps,
  BottomSheetMethods,
  BottomSheetModalMethods,
  GorhomBottomSheetProps,
};
