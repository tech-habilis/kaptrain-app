import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { ColorConst } from "@/constants/theme";
import { ROUTE_NAME } from "@/constants/route";
import { useTranslation } from "react-i18next";
import IcHome from "@/components/icons/home";
import IcLibrary from "@/components/icons/library";
import IcAgenda from "@/components/icons/agenda";
import IcProfile from "@/components/icons/profile";
import TimerWidget from "@/components/timer-widget";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <>
      <TimerWidget />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ColorConst.secondary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: Platform.select({
              android: 4,
              ios: 12,
            }),
            backgroundColor: ColorConst.light,
          },
          sceneStyle: {
            backgroundColor: ColorConst.light,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: t("menu.home"),
          tabBarIcon: ({ color }) => <IcHome size={28} color={color} />,
          sceneStyle: {
            backgroundColor: 'white',
          },
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
    </>
  );
}
