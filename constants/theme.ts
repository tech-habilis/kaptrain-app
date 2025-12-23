/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const ColorConst = {
  primary: '#457CE2',
  secondary: '#06234B',
  tertiary: '#FF9E69',
  decorative: '#FFD1A7',
  text: '#04152D',
  subtleText: '#727988',
  stroke: '#E5E5EB',
  accent: '#424F65',
  light: '#EEEFF9',
  warmLight: '#FFF7F3',
  success: '#4FD365',
  error: '#FF604B',

  // others
  link: '#04152D',
  secondary500: '#1A1C1E'
}

const tintColorLight = ColorConst.secondary
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: ColorConst.text,
    background: ColorConst.light,
    tint: tintColorLight,
    icon: ColorConst.secondary,
    tabIconDefault: ColorConst.secondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: ColorConst.light,
    background: ColorConst.text,
    tint: tintColorDark,
    icon: ColorConst.secondary,
    tabIconDefault: ColorConst.secondary,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
