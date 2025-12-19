import { LanguageItem } from "@/components/language-item";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSession } from "@/contexts/auth-context";
import i18n, { changeLanguage } from "@/utilities/i18n";
import { Button } from "@react-navigation/elements";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";

export default function ProfileScreen() {
  const { signOut, session } = useSession();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const onLangClick = (lang: string) => {
    setCurrentLanguage(lang);
    changeLanguage(lang);
  };

  return (
    <ThemedView className="py-safe px-6 mt-2 flex-1 gap-6 flex">
      <ThemedText style={{ fontSize: 24 }}>menu.profile</ThemedText>
      {session?.user?.avatarUrl !== undefined ? (
        <Image
          source={{ uri: session?.user.avatarUrl! }}
          className="size-20 rounded-full self-center"
        />
      ) : null}
      <ThemedView
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText style={{ fontSize: 16, width: "50%" }} numberOfLines={1}>
          auth.name
        </ThemedText>
        <ThemedText
          style={{ fontSize: 16, width: "50%", textAlign: "right" }}
          numberOfLines={1}
        >
          {session?.user?.name || "N/A"}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText style={{ fontSize: 16, width: "50%" }} numberOfLines={1}>
          auth.email
        </ThemedText>
        <ThemedText
          style={{ fontSize: 16, width: "50%", textAlign: "right" }}
          numberOfLines={1}
        >
          {session?.user?.email || "N/A"}
        </ThemedText>
      </ThemedView>

      <View style={{ flexGrow: 1 }} />

      <ThemedView
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {["en", "fr"].map((lang) => (
          <LanguageItem
            key={lang}
            language={lang}
            isSelected={currentLanguage === lang}
            onSelect={() => onLangClick(lang)}
          />
        ))}
      </ThemedView>
      <Button onPressIn={signOut}>{t("auth.signOut")}</Button>
    </ThemedView>
  );
}
