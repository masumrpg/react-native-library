import React from "react";
import { StyleSheet } from "react-native";
import { useTheme, useToast, type RenderIcon, type BottomSheetMethods } from "@masumdev/rn-ui";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

export function useSectionContext() {
  const theme = useTheme();
  const { colors, colorScheme, isDark, setColorScheme, radii, spacing, typography, shadows, components } = theme;
  const toast = useToast();
  const sheetRef = React.useRef<BottomSheetMethods>(null);

  const [sampleInput, setSampleInput] = React.useState("Hello @masumdev/rn-ui");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checkOne, setCheckOne] = React.useState(true);
  const [checkTwo, setCheckTwo] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("option1");
  const [switchValue, setSwitchValue] = React.useState(true);
  const [sliderValue, setSliderValue] = React.useState(65);
  const [ratingValue, setRatingValue] = React.useState(4.5);
  const [selectValue, setSelectValue] = React.useState("react-native");
  const [framework, setFramework] = React.useState("expo");
  const [activeTab, setActiveTab] = React.useState("tab1");
  const [activeStep, setActiveStep] = React.useState(2);
  const [commandVisible, setCommandVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("2026-08-23");
  const [monthCursor, setMonthCursor] = React.useState("2026-08");

  // Additional states destructured in specific sections
  const [alertDialogVisible, setAlertDialogVisible] = React.useState(false);
  const [showBookmark, setShowBookmark] = React.useState(false);
  const [compactMenu, setCompactMenu] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [showAlertDetails, setShowAlertDetails] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState("1234");
  const [activeSegment, setActiveSegment] = React.useState("weekly");

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: { flexWrap: "wrap" },
        card: { gap: 12 },
        row: { flexDirection: "row", alignItems: "center", gap: 12 },
        settingDivider: { marginVertical: 8 },
        topBar: { marginBottom: 12 },
        headerSpacer: { width: 32 },
        bareCard: { flex: 1, minWidth: 140 },
        contentScroll: { flex: 1 },
        container: { padding: 16 },
      }),
    []
  );

  const openSheet = React.useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  return {
    colors,
    colorScheme,
    isDark,
    setColorScheme,
    radii,
    spacing,
    typography,
    shadows,
    components,
    toast,
    sheetRef,
    openSheet,
    icon,
    styles,
    sampleInput,
    setSampleInput,
    searchQuery,
    setSearchQuery,
    checkOne,
    setCheckOne,
    checkTwo,
    setCheckTwo,
    radioValue,
    setRadioValue,
    switchValue,
    setSwitchValue,
    sliderValue,
    setSliderValue,
    ratingValue,
    setRatingValue,
    selectValue,
    setSelectValue,
    framework,
    setFramework,
    activeTab,
    setActiveTab,
    activeStep,
    setActiveStep,
    commandVisible,
    setCommandVisible,
    selectedDate,
    setSelectedDate,
    monthCursor,
    setMonthCursor,
    alertDialogVisible,
    setAlertDialogVisible,
    showBookmark,
    setShowBookmark,
    compactMenu,
    setCompactMenu,
    page,
    setPage,
    showAlertDetails,
    setShowAlertDetails,
    otpValue,
    setOtpValue,
    activeSegment,
    setActiveSegment,
  };
}
