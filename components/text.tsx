import { useTranslation } from "react-i18next";
import { TextProps, Text as DefaultText } from "react-native";

/**
 * The default text component with translation support.
 *
 * usage:
 * ```
 * <Text>insert.translated.text.key</Text>
 * <Text>Or normal text like this</Text>
 * ````
 *
 * If you need to pass a ReactNode as children, use the default Text component directly instead.
 */
export default function Text({
  children,
  ...props
}: Omit<TextProps, "children"> & {
  children: string;
}) {
  const { t } = useTranslation();
  return <DefaultText {...props}>{t(children)}</DefaultText>;
}
