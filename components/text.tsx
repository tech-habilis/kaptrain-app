import { useTranslation } from "react-i18next";
import { TextProps, Text as DefaultText } from "react-native";

/**
 * The default text component with translation support.
 *
 * usage:
 * ```
 * <Text>insert.translated.text.key</Text>
 * <Text>singleKey</Text>
 * <Text translate={false}>00:00:00</Text>
 * <Text translate={false}>Or any non-translated text</Text>
 * ````
 *
 * If you need to pass a ReactNode as children, use the default Text component directly instead.
 */
export default function Text({
  children,
  translate = true,
  ...props
}: LocalTextProps) {
  const { t } = useTranslation();

  return <DefaultText {...props}>{translate ? t(children) : children}</DefaultText>;
}

export type LocalTextProps = Omit<TextProps, "children"> & {
  children: string;
  translate?: boolean;
}
