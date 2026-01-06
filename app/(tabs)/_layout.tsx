import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { ColorConst, Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ROUTE_NAME } from "@/constants/route";
import { useTranslation } from "react-i18next";
import IcHome from "@/components/icons/home";
import IcLibrary from "@/components/icons/library";
import IcAgenda from "@/components/icons/agenda";
import IcProfile from "@/components/icons/profile";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 12,
          backgroundColor: ColorConst.light
        },
        sceneStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("menu.home"),
          tabBarIcon: ({ color }) => <IcHome size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name={ROUTE_NAME.LIBRARY}
        options={{
          title: t("menu.library"),
          tabBarIcon: ({ color }) => <IcLibrary size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name={ROUTE_NAME.AGENDA}
        options={{
          title: t("menu.agenda"),
          tabBarIcon: ({ color }) => <IcAgenda size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name={ROUTE_NAME.PROFILE}
        options={{
          title: t("menu.profile"),
          tabBarIcon: ({ color }) => <IcProfile size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
