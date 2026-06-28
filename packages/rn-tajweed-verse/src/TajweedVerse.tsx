import React from "react";
import { StyleProp, TextStyle, Alert, Text } from "react-native";
import ParsedText, { ParseShape } from "react-native-parsed-text";

/**
 * Configuration for an individual Tajweed rule styling and interaction.
 */
export interface TajweedRuleConfig {
  /**
   * Custom styling (e.g., text color) to apply to matches of this Tajweed rule.
   */
  style?: StyleProp<TextStyle>;
  /**
   * Callback function invoked when a match of this Tajweed rule is pressed.
   * @param text - The matched substring text without the markup tags.
   * @param index - The position index of the matched substring in the text.
   */
  onPress?: (text: string, index: number) => void;
}

/**
 * The complete set of supported Tajweed rules configuration.
 * Each property corresponds to a specific Tajweed rule.
 */
export interface TajweedConfig {
  /**
   * Hamzatul Wasl (connecting hamzah).
   * Pattern: `[h[...]`
   */
  ham_wasl?: TajweedRuleConfig;
  /**
   * Silent letter.
   * Patterns: `[s[...]` and `[l[...]`
   */
  slnt?: TajweedRuleConfig;
  /**
   * Normal Madd (prolongation).
   * Pattern: `[n[...]`
   */
  madda_normal?: TajweedRuleConfig;
  /**
   * Permissible Madd.
   * Pattern: `[p[...]`
   */
  madda_permissible?: TajweedRuleConfig;
  /**
   * Necessary Madd.
   * Pattern: `[m[...]`
   */
  madda_necessary?: TajweedRuleConfig;
  /**
   * Qalqalah (echoing/shaking sound on select letters).
   * Pattern: `[q[...]`
   */
  qlq?: TajweedRuleConfig;
  /**
   * Obligatory Madd.
   * Pattern: `[o[...]`
   */
  madda_obligatory?: TajweedRuleConfig;
  /**
   * Ikhfa' Syafawi (nasal merging sound for Meem).
   * Pattern: `[c[...]`
   */
  ikhf_shfw?: TajweedRuleConfig;
  /**
   * Ikhfa' (hiding/concealing sound).
   * Pattern: `[f[...]`
   */
  ikhf?: TajweedRuleConfig;
  /**
   * Idgham Syafawi (merging sound for Meem).
   * Pattern: `[w[...]`
   */
  idghm_shfw?: TajweedRuleConfig;
  /**
   * Iqlb (changing/turning sound to Meem).
   * Pattern: `[i[...]`
   */
  iqlb?: TajweedRuleConfig;
  /**
   * Idgham Ma'al Ghunnah (merging with nasalization).
   * Pattern: `[a[...]`
   */
  idgh_ghn?: TajweedRuleConfig;
  /**
   * Idgham Bighairil Ghunnah (merging without nasalization).
   * Pattern: `[u[...]`
   */
  idgh_w_ghn?: TajweedRuleConfig;
  /**
   * Idgham Mutamathilayn/Mutajanisayn (merging similar/homogenous sounds).
   * Patterns: `[d[...]` and `[b[...]`
   */
  idgh_mus?: TajweedRuleConfig;
  /**
   * Ghunnah (nasal sound).
   * Pattern: `[g[...]`
   */
  ghn?: TajweedRuleConfig;
}

/**
 * Global configuration options for the TajweedVerse component.
 */
export interface TajweedVerseConfig {
  /**
   * Base text style properties for the whole verse (e.g., fontSize, lineHeight, direction).
   */
  style?: TextStyle;
  /**
   * Individual configuration overrides for Tajweed rules.
   */
  tajweed?: TajweedConfig;
}

/**
 * Component props for TajweedVerse.
 */
export interface TajweedVerseProps {
  /**
   * The raw Quranic verse text containing Tajweed markup tags (e.g., `[q[خَلَقَ]`).
   */
  verse?: string;
  /**
   * Custom configuration options to override default styles or onPress actions.
   */
  config?: TajweedVerseConfig;
  /**
   * Whether the component should parse and apply Tajweed rule color-coding.
   * If `false`, it renders a clean, unstyled verse without parsing markup.
   * @default true
   */
  colored?: boolean;
  /**
   * Whether tapping on a colored Tajweed word should show a rule description popup.
   * If `true` and no custom `onRulePress` is provided, it falls back to native `Alert.alert`.
   * @default false
   */
  interactive?: boolean;
  /**
   * Callback invoked when a tajweed-coded word is pressed and `interactive={true}`.
   * @param ruleName - The human-readable name of the Tajweed rule (e.g., 'Qalqalah').
   * @param description - Detailed description explaining the rule and pronunciation.
   * @param matchedText - The actual word from the verse text that was tapped.
   */
  onRulePress?: (
    ruleName: string,
    description: string,
    matchedText: string,
  ) => void;
  /**
   * Optional custom parsing rules to merge and prepend to standard patterns.
   */
  customRules?: ParseShape[];
}

/**
 * Structural definition for Tajweed rule educational information.
 */
export interface TajweedRuleInfo {
  /** The human-readable name of the Tajweed rule. */
  name: string;
  /** The linguistic explanation of the rule. */
  description: string;
  /** The instruction on how to pronounce the matched letters. */
  pronunciation: string;
}

/**
 * Detailed educational definitions and pronunciation guides for each Tajweed rule.
 */
export const TAJWEED_RULE_INFO: Record<keyof TajweedConfig, TajweedRuleInfo> = {
  ham_wasl: {
    name: "Hamzatul Wasl",
    description:
      "Connecting Hamzah. It is pronounced when beginning a sentence but dropped when connecting words.",
    pronunciation:
      "Skip pronunciation when connecting (blend with the next letter).",
  },
  slnt: {
    name: "Silent Letter",
    description:
      "Letters written in the text but not pronounced during recitation.",
    pronunciation: "Do not pronounce this letter.",
  },
  madda_normal: {
    name: "Normal Madd",
    description: "Standard prolongation of a vowel letter (Alif, Waw, Ya).",
    pronunciation: "Prolong the sound for 2 beats (harakat).",
  },
  madda_permissible: {
    name: "Permissible Madd (Madd Jaiz)",
    description:
      "Optional prolongation when a hamzah follows a madd letter in the next word.",
    pronunciation: "Prolong the sound for 2, 4, or 5 beats.",
  },
  madda_necessary: {
    name: "Necessary Madd (Madd Lazim)",
    description:
      "Compulsory prolongation due to a sukoon or shaddah following a madd letter in the same word.",
    pronunciation: "Prolong the sound for exactly 6 beats.",
  },
  qlq: {
    name: "Qalqalah",
    description:
      "Echoing or bouncing sound produced when reciting specific letters (ق, ط, ب, ج, د) with sukoon.",
    pronunciation:
      "Make a quick echoing or rebounding sound at the end of the letter.",
  },
  madda_obligatory: {
    name: "Obligatory Madd (Madd Wajib)",
    description:
      "Compulsory prolongation when a hamzah follows a madd letter within the same word.",
    pronunciation: "Prolong the sound for 4 or 5 beats.",
  },
  ikhf_shfw: {
    name: "Ikhfa Syafawi",
    description:
      "Hiding the sound of Meem Sakinah followed by Ba by pronouncing it with nasalization (ghunnah).",
    pronunciation:
      "Pronounce Meem softly with a 2-beat nasal tone while holding the lips closed.",
  },
  ikhf: {
    name: "Ikhfa",
    description:
      "Concealing the sound of Noon Sakinah or Tanween when followed by one of the 15 Ikhfa letters.",
    pronunciation:
      "Conceal Noon Sakinah in the nasal cavity for 2 beats before transitioning to the next letter.",
  },
  idghm_shfw: {
    name: "Idgham Syafawi (Idgham Mithlayn)",
    description:
      "Merging Meem Sakinah into a following Meem with nasalization.",
    pronunciation:
      "Merge the Meem sounds cleanly and hold with a nasal sound for 2 beats.",
  },
  iqlb: {
    name: "Iqlab",
    description:
      "Converting Noon Sakinah or Tanween into a Meem sound when followed by the letter Ba.",
    pronunciation:
      "Change the Noon sound to a soft Meem sound and hold for 2 beats with nasalization.",
  },
  idgh_ghn: {
    name: "Idgham Ma'al Ghunnah",
    description:
      "Merging Noon Sakinah or Tanween into one of the letters (ي, ن, م, و) with nasalization.",
    pronunciation:
      "Merge the Noon completely and prolong the nasal sound for 2 beats.",
  },
  idgh_w_ghn: {
    name: "Idgham Bighairil Ghunnah",
    description:
      "Merging Noon Sakinah or Tanween into the letters (ل, ر) without nasalization.",
    pronunciation:
      "Merge the Noon completely into the next letter with no nasal hold.",
  },
  idgh_mus: {
    name: "Idgham Mutamathilayn/Mutajanisayn",
    description:
      "Merging of two identical or closely related consonants meeting each other.",
    pronunciation:
      "Merge the first letter into the second and pronounce it with a shaddah.",
  },
  ghn: {
    name: "Ghunnah",
    description:
      "Nasalization sound emitted through the nose, specifically on a Noon or Meem with a shaddah.",
    pronunciation: "Hold the nasal sound at the back of the nose for 2 beats.",
  },
};

/**
 * Default style and coloring configuration for Tajweed rules.
 * Uses standard color rules common in Tajweed Quran prints.
 */
export const defaultConfig: TajweedVerseConfig = {
  style: {
    fontSize: 32,
    lineHeight: 60,
    color: "black",
    direction: "rtl",
  },
  tajweed: {
    ham_wasl: {
      style: { color: "#AAAAAA" },
      onPress: undefined,
    },
    slnt: {
      style: { color: "#AAAAAA" },
      onPress: undefined,
    },
    madda_normal: {
      style: { color: "#537FFF" },
      onPress: undefined,
    },
    madda_permissible: {
      style: { color: "#4050FF" },
      onPress: undefined,
    },
    madda_necessary: {
      style: { color: "#000EBC" },
      onPress: undefined,
    },
    qlq: {
      style: { color: "#DD0008" },
      onPress: undefined,
    },
    madda_obligatory: {
      style: { color: "#2144C1" },
      onPress: undefined,
    },
    ikhf_shfw: {
      style: { color: "#D500B7" },
      onPress: undefined,
    },
    ikhf: {
      style: { color: "#9400A8" },
      onPress: undefined,
    },
    idghm_shfw: {
      style: { color: "#58B800" },
      onPress: undefined,
    },
    iqlb: {
      style: { color: "#26BFFD" },
      onPress: undefined,
    },
    idgh_ghn: {
      style: { color: "#169777" },
      onPress: undefined,
    },
    idgh_w_ghn: {
      style: { color: "#169200" },
      onPress: undefined,
    },
    idgh_mus: {
      style: { color: "#A1A1A1" },
      onPress: undefined,
    },
    ghn: {
      style: { color: "#FF7E1E" },
      onPress: undefined,
    },
  },
};

/**
 * Predefined color themes for Tajweed rules.
 */
export const TajweedThemes = {
  /** Default physical Quran color coding - light theme */
  classic: defaultConfig.tajweed as Required<TajweedConfig>,

  /** Classic color palette adapted for dark backgrounds with higher luminescence */
  dark: {
    ham_wasl: { style: { color: "#888888" }, onPress: undefined },
    slnt: { style: { color: "#888888" }, onPress: undefined },
    madda_normal: { style: { color: "#68B0FF" }, onPress: undefined },
    madda_permissible: { style: { color: "#568BFF" }, onPress: undefined },
    madda_necessary: { style: { color: "#3A62FF" }, onPress: undefined },
    qlq: { style: { color: "#FF4D4D" }, onPress: undefined },
    madda_obligatory: { style: { color: "#4EA6FF" }, onPress: undefined },
    ikhf_shfw: { style: { color: "#FF7EE2" }, onPress: undefined },
    ikhf: { style: { color: "#E456FF" }, onPress: undefined },
    idghm_shfw: { style: { color: "#7AFF3A" }, onPress: undefined },
    iqlb: { style: { color: "#5FE5FF" }, onPress: undefined },
    idgh_ghn: { style: { color: "#2BD2A3" }, onPress: undefined },
    idgh_w_ghn: { style: { color: "#4CFF2B" }, onPress: undefined },
    idgh_mus: { style: { color: "#C2C2C2" }, onPress: undefined },
    ghn: { style: { color: "#FFA64D" }, onPress: undefined },
  } as Required<TajweedConfig>,

  /** Softer, less saturated pastel colors for a clean modern look */
  pastel: {
    ham_wasl: { style: { color: "#B0B0B0" }, onPress: undefined },
    slnt: { style: { color: "#B0B0B0" }, onPress: undefined },
    madda_normal: { style: { color: "#7C9DFF" }, onPress: undefined },
    madda_permissible: { style: { color: "#6E8BFF" }, onPress: undefined },
    madda_necessary: { style: { color: "#5067FF" }, onPress: undefined },
    qlq: { style: { color: "#FFA3A3" }, onPress: undefined },
    madda_obligatory: { style: { color: "#64AEFF" }, onPress: undefined },
    ikhf_shfw: { style: { color: "#FFA6EC" }, onPress: undefined },
    ikhf: { style: { color: "#FFA0F4" }, onPress: undefined },
    idghm_shfw: { style: { color: "#AFFF9E" }, onPress: undefined },
    iqlb: { style: { color: "#A0EBFF" }, onPress: undefined },
    idgh_ghn: { style: { color: "#8CEAD2" }, onPress: undefined },
    idgh_w_ghn: { style: { color: "#ABFF9E" }, onPress: undefined },
    idgh_mus: { style: { color: "#D4D4D4" }, onPress: undefined },
    ghn: { style: { color: "#FFCDA3" }, onPress: undefined },
  } as Required<TajweedConfig>,

  /** High contrast, color-blind friendly styling option */
  accessible: {
    ham_wasl: { style: { color: "#7E7E7E" }, onPress: undefined },
    slnt: { style: { color: "#7E7E7E" }, onPress: undefined },
    madda_normal: {
      style: { color: "#0055D4", fontWeight: "bold" },
      onPress: undefined,
    },
    madda_permissible: {
      style: { color: "#0043A6", fontWeight: "bold" },
      onPress: undefined,
    },
    madda_necessary: {
      style: { color: "#002C6C", fontWeight: "bold" },
      onPress: undefined,
    },
    qlq: {
      style: { color: "#C60000", fontWeight: "bold" },
      onPress: undefined,
    },
    madda_obligatory: {
      style: { color: "#0074E4", fontWeight: "bold" },
      onPress: undefined,
    },
    ikhf_shfw: {
      style: { color: "#9B007F", fontWeight: "bold" },
      onPress: undefined,
    },
    ikhf: {
      style: { color: "#73005F", fontWeight: "bold" },
      onPress: undefined,
    },
    idghm_shfw: {
      style: { color: "#2F6C00", fontWeight: "bold" },
      onPress: undefined,
    },
    iqlb: {
      style: { color: "#0097D4", fontWeight: "bold" },
      onPress: undefined,
    },
    idgh_ghn: {
      style: { color: "#00835D", fontWeight: "bold" },
      onPress: undefined,
    },
    idgh_w_ghn: {
      style: { color: "#217300", fontWeight: "bold" },
      onPress: undefined,
    },
    idgh_mus: {
      style: { color: "#6A6A6A", fontWeight: "bold" },
      onPress: undefined,
    },
    ghn: {
      style: { color: "#B54900", fontWeight: "bold" },
      onPress: undefined,
    },
  } as Required<TajweedConfig>,
};

/**
 * TajweedVerse Component
 *
 * A React Native component that parses Quranic verse text annotated with Tajweed markup tags
 * and renders it with appropriate color-coding and press interaction handlers.
 *
 * @example
 * ```tsx
 * import TajweedVerse, { TajweedThemes } from '@masumdev/rn-tajweed-verse';
 *
 * const verseWithMarkup = "[q[خَلَقَ]] ٱلْإِنسَٰنَ مِنْ [f[عَلَقٍ]]";
 *
 * <TajweedVerse
 *   verse={verseWithMarkup}
 *   interactive={true}
 *   config={{
 *     style: { fontSize: 28 },
 *     tajweed: TajweedThemes.pastel
 *   }}
 * />
 * ```
 */
function TajweedVerse({
  verse = "",
  config = defaultConfig,
  colored = true,
  interactive = false,
  onRulePress,
  customRules,
}: TajweedVerseProps) {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    style: {
      ...defaultConfig.style,
      ...config?.style,
    },
    tajweed: {
      ham_wasl: {
        ...defaultConfig.tajweed?.ham_wasl,
        ...config?.tajweed?.ham_wasl,
      },
      slnt: {
        ...defaultConfig.tajweed?.slnt,
        ...config?.tajweed?.slnt,
      },
      madda_normal: {
        ...defaultConfig.tajweed?.madda_normal,
        ...config?.tajweed?.madda_normal,
      },
      madda_permissible: {
        ...defaultConfig.tajweed?.madda_permissible,
        ...config?.tajweed?.madda_permissible,
      },
      madda_necessary: {
        ...defaultConfig.tajweed?.madda_necessary,
        ...config?.tajweed?.madda_necessary,
      },
      qlq: {
        ...defaultConfig.tajweed?.qlq,
        ...config?.tajweed?.qlq,
      },
      madda_obligatory: {
        ...defaultConfig.tajweed?.madda_obligatory,
        ...config?.tajweed?.madda_obligatory,
      },
      ikhf_shfw: {
        ...defaultConfig.tajweed?.ikhf_shfw,
        ...config?.tajweed?.ikhf_shfw,
      },
      ikhf: {
        ...defaultConfig.tajweed?.ikhf,
        ...config?.tajweed?.ikhf,
      },
      idghm_shfw: {
        ...defaultConfig.tajweed?.idghm_shfw,
        ...config?.tajweed?.idghm_shfw,
      },
      iqlb: {
        ...defaultConfig.tajweed?.iqlb,
        ...config?.tajweed?.iqlb,
      },
      idgh_ghn: {
        ...defaultConfig.tajweed?.idgh_ghn,
        ...config?.tajweed?.idgh_ghn,
      },
      idgh_w_ghn: {
        ...defaultConfig.tajweed?.idgh_w_ghn,
        ...config?.tajweed?.idgh_w_ghn,
      },
      idgh_mus: {
        ...defaultConfig.tajweed?.idgh_mus,
        ...config?.tajweed?.idgh_mus,
      },
      ghn: {
        ...defaultConfig.tajweed?.ghn,
        ...config?.tajweed?.ghn,
      },
    },
  };

  /**
   * Helper function to strip out all Tajweed markup tags from the verse.
   */
  const getPlainVerse = (rawVerse: string): string => {
    let clean = rawVerse.replace(/\:[\d]+/g, "");
    clean = clean.replace(/\[\w\[([^\]]+)\]/g, "$1");
    return clean;
  };

  // Render plain, uncolored, un-parsed text if colored prop is false
  if (!colored) {
    return <Text style={mergedConfig.style}>{getPlainVerse(verse)}</Text>;
  }

  // Remove verse index number if any (e.g. ":1" at the end of a verse)
  const processedVerse = verse.replace(/\:[\d]+/g, "");

  /**
   * Removes Tajweed markup tags from the matched string to render clean Quranic script.
   * Called by ParsedText matching rules.
   *
   * @param matchingString - The matched text pattern containing tags (e.g., `[q[word]`)
   * @returns The clean, un-marked word to be rendered in the component.
   */
  const renderText = (matchingString: string): string => {
    const match = matchingString.replace(/\[\w\[/, "").replace(/\]/, "");
    return match;
  };

  /**
   * Action handler invoked when a colored word is pressed.
   * Displays the Tajweed rule name, description, and pronunciation guide.
   */
  const handleRulePress = (
    ruleKey: keyof TajweedConfig,
    matchedText: string,
  ) => {
    const ruleInfo = TAJWEED_RULE_INFO[ruleKey];
    if (!ruleInfo) return;

    const fullDescription = `${ruleInfo.description}\n\nPronunciation:\n${ruleInfo.pronunciation}`;

    if (onRulePress) {
      onRulePress(ruleInfo.name, fullDescription, matchedText);
    } else {
      Alert.alert(
        ruleInfo.name,
        `Text: "${matchedText}"\n\n${ruleInfo.description}\n\nPronunciation:\n${ruleInfo.pronunciation}`,
        [{ text: "OK" }],
      );
    }
  };

  /**
   * Determines the active onPress callback for a parser rule shape.
   */
  const getOnPressHandler = (
    ruleKey: keyof TajweedConfig,
    configOnPress: ((text: string, index: number) => void) | undefined,
  ) => {
    if (configOnPress) {
      return configOnPress;
    }
    if (interactive) {
      return (text: string) => handleRulePress(ruleKey, text);
    }
    return undefined;
  };

  /**
   * Helper to merge the base text style with the rule style,
   * ensuring properties like fontFamily, fontSize, and lineHeight
   * are correctly inherited by nested parsed child elements.
   */
  const getRuleStyle = (ruleStyle: StyleProp<TextStyle>) => {
    return [mergedConfig.style, ruleStyle];
  };

  const parser: ParseShape[] = [
    ...(customRules || []),
    {
      pattern: /\[h\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.ham_wasl?.style),
      renderText,
      onPress: getOnPressHandler(
        "ham_wasl",
        mergedConfig.tajweed.ham_wasl?.onPress,
      ),
    },
    {
      pattern: /\[s\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.slnt?.style),
      renderText,
      onPress: getOnPressHandler("slnt", mergedConfig.tajweed.slnt?.onPress),
    },
    {
      pattern: /\[l\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.slnt?.style),
      renderText,
      onPress: getOnPressHandler("slnt", mergedConfig.tajweed.slnt?.onPress),
    },
    {
      pattern: /\[n\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.madda_normal?.style),
      renderText,
      onPress: getOnPressHandler(
        "madda_normal",
        mergedConfig.tajweed.madda_normal?.onPress,
      ),
    },
    {
      pattern: /\[p\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.madda_permissible?.style),
      renderText,
      onPress: getOnPressHandler(
        "madda_permissible",
        mergedConfig.tajweed.madda_permissible?.onPress,
      ),
    },
    {
      pattern: /\[m\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.madda_necessary?.style),
      renderText,
      onPress: getOnPressHandler(
        "madda_necessary",
        mergedConfig.tajweed.madda_necessary?.onPress,
      ),
    },
    {
      pattern: /\[q\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.qlq?.style),
      renderText,
      onPress: getOnPressHandler("qlq", mergedConfig.tajweed.qlq?.onPress),
    },
    {
      pattern: /\[o\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.madda_obligatory?.style),
      renderText,
      onPress: getOnPressHandler(
        "madda_obligatory",
        mergedConfig.tajweed.madda_obligatory?.onPress,
      ),
    },
    {
      pattern: /\[c\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.ikhf_shfw?.style),
      renderText,
      onPress: getOnPressHandler(
        "ikhf_shfw",
        mergedConfig.tajweed.ikhf_shfw?.onPress,
      ),
    },
    {
      pattern: /\[f\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.ikhf?.style),
      renderText,
      onPress: getOnPressHandler("ikhf", mergedConfig.tajweed.ikhf?.onPress),
    },
    {
      pattern: /\[w\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.idghm_shfw?.style),
      renderText,
      onPress: getOnPressHandler(
        "idghm_shfw",
        mergedConfig.tajweed.idghm_shfw?.onPress,
      ),
    },
    {
      pattern: /\[i\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.iqlb?.style),
      renderText,
      onPress: getOnPressHandler("iqlb", mergedConfig.tajweed.iqlb?.onPress),
    },
    {
      pattern: /\[a\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.idgh_ghn?.style),
      renderText,
      onPress: getOnPressHandler(
        "idgh_ghn",
        mergedConfig.tajweed.idgh_ghn?.onPress,
      ),
    },
    {
      pattern: /\[u\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.idgh_w_ghn?.style),
      renderText,
      onPress: getOnPressHandler(
        "idgh_w_ghn",
        mergedConfig.tajweed.idgh_w_ghn?.onPress,
      ),
    },
    {
      pattern: /\[d\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.idgh_mus?.style),
      renderText,
      onPress: getOnPressHandler(
        "idgh_mus",
        mergedConfig.tajweed.idgh_mus?.onPress,
      ),
    },
    {
      pattern: /\[b\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.idgh_mus?.style),
      renderText,
      onPress: getOnPressHandler(
        "idgh_mus",
        mergedConfig.tajweed.idgh_mus?.onPress,
      ),
    },
    {
      pattern: /\[g\[([^\]]+)\]/,
      style: getRuleStyle(mergedConfig.tajweed.ghn?.style),
      renderText,
      onPress: getOnPressHandler("ghn", mergedConfig.tajweed.ghn?.onPress),
    },
  ];

  return (
    <ParsedText parse={parser} style={mergedConfig.style}>
      {processedVerse}
    </ParsedText>
  );
}

// Memoized version of TajweedVerse with a strict custom comparison to prevent heavy re-parsing
const MemoizedTajweedVerse = React.memo(
  TajweedVerse,
  (prevProps, nextProps) => {
    if (prevProps.verse !== nextProps.verse) return false;
    if (prevProps.colored !== nextProps.colored) return false;
    if (prevProps.interactive !== nextProps.interactive) return false;
    if (prevProps.onRulePress !== nextProps.onRulePress) return false;

    // Compare custom rules length and items shallowly
    if (prevProps.customRules !== nextProps.customRules) {
      if (!prevProps.customRules || !nextProps.customRules) return false;
      if (prevProps.customRules.length !== nextProps.customRules.length)
        return false;
      for (let i = 0; i < prevProps.customRules.length; i++) {
        if (prevProps.customRules[i] !== nextProps.customRules[i]) return false;
      }
    }

    // Compare styling configurations
    if (prevProps.config !== nextProps.config) {
      if (!prevProps.config || !nextProps.config) return false;
      if (
        JSON.stringify(prevProps.config.style) !==
        JSON.stringify(nextProps.config.style)
      )
        return false;

      const prevTajweed = prevProps.config.tajweed;
      const nextTajweed = nextProps.config.tajweed;
      if (prevTajweed !== nextTajweed) {
        if (!prevTajweed || !nextTajweed) return false;
        const keys = Object.keys(
          defaultConfig.tajweed || {},
        ) as (keyof TajweedConfig)[];
        for (const key of keys) {
          if (
            JSON.stringify(prevTajweed[key]) !==
            JSON.stringify(nextTajweed[key])
          ) {
            return false;
          }
        }
      }
    }

    return true;
  },
);

export default MemoizedTajweedVerse;
export { MemoizedTajweedVerse as TajweedVerse };
