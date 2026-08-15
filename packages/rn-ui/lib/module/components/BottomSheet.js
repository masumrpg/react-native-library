"use strict";

import React from "react";
import GorhomBottomSheet, { BottomSheetBackdrop as GorhomBottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetSectionList, BottomSheetTextInput, BottomSheetView, useBottomSheet, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const BottomSheet = /*#__PURE__*/React.forwardRef(function BottomSheet({
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
}, ref) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const themedBackdrop = React.useCallback(backdropProps => /*#__PURE__*/_jsx(GorhomBottomSheetBackdrop, {
    ...backdropProps,
    appearsOnIndex: backdropAppearsOnIndex,
    disappearsOnIndex: backdropDisappearsOnIndex,
    opacity: backdropOpacity,
    pressBehavior: backdropPressBehavior,
    style: [{
      backgroundColor: colors.overlay
    }, backdropProps.style, backdropStyle]
  }), [backdropAppearsOnIndex, backdropDisappearsOnIndex, backdropOpacity, backdropPressBehavior, backdropStyle, colors.overlay]);
  return /*#__PURE__*/_jsx(GorhomBottomSheet, {
    ref: ref,
    backdropComponent: backdropComponent ?? (withBackdrop ? themedBackdrop : undefined),
    backgroundStyle: [{
      backgroundColor: colors.surface,
      borderTopLeftRadius: radii.xxl,
      borderTopRightRadius: radii.xxl,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border
    }, backgroundStyle],
    handleStyle: [{
      paddingTop: spacing.md,
      paddingBottom: spacing.sm
    }, handleStyle],
    handleIndicatorStyle: [{
      width: 40,
      height: 4,
      borderRadius: radii.full,
      backgroundColor: colors.border
    }, handleIndicatorStyle],
    style: [{
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    }, style],
    ...props,
    children: children
  });
});
export { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetSectionList, BottomSheetTextInput, BottomSheetView, useBottomSheet, useBottomSheetModal };
//# sourceMappingURL=BottomSheet.js.map