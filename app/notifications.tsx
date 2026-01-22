import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Text from "@/components/text";
import { useState } from "react";
import { ScrollView, View } from "react-native";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Remplir ton état de forme",
      description: "N'oublie pas de renseigner ta forme du jour.",
      time: "1h",
      isUnread: true,
    },
    {
      id: "2",
      title: "Nouveau message de ton coach",
      description: "Ton coach t'a écrit. Va voir tes messages !",
      time: "2h",
      isUnread: true,
    },
    {
      id: "3",
      title: "Nouvelles séances ajoutées",
      description: "De nouvelles séances sont prêtes dans ton planning.",
      time: "4h",
      isUnread: false,
    },
    {
      id: "4",
      title: "Rappel de séance à effectuer",
      description: "Une séance prévue aujourd'hui n'a pas encore été validée",
      time: "Hier",
      isUnread: false,
    },
    {
      id: "5",
      title: "Évalue ton ressenti post-séance",
      description:
        "Tu as oublié de noter ton ressenti après ta dernière séance",
      time: "28/04",
      isUnread: false,
    },
    {
      id: "6",
      title: "Toujours en séance ?",
      description: "Le chrono tourne encore. As-tu terminé ta séance ?",
      time: "28/04",
      isUnread: false,
    },
    {
      id: "7",
      title: "Forme en baisse depuis 3 jours",
      description:
        "Ton niveau de forme est en baisse ces derniers jours. Pense à ajuster tes efforts ou à accorder plus de temps à la récupération.",
      time: "28/04",
      isUnread: false,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isUnread: false })),
    );
  };

  return (
    <BasicScreen title="Notifications">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 mt-6">
          {notifications.map((notification) => (
            <View key={notification.id} className="flex-row items-start gap-3">
              {notification.isUnread && (
                <View className="size-2.5 rounded-full bg-error2 mt-1" />
              )}
              <View className="flex-1">
                <View className="flex-row justify-between items-start gap-1.5 mb-1.5">
                  <Text className="text-sm font-semibold text-text flex-1">
                    {notification.title}
                  </Text>
                  <Text className="text-xs text-subtleText">
                    {notification.time}
                  </Text>
                </View>
                <Text className="text-sm text-subtleText leading-tight">
                  {notification.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-linear-to-t from-white via-white to-transparent backdrop-blur-sm">
        <Button
          text="Tout marquer comme lu"
          type="secondary"
          size="large"
          onPress={handleMarkAllAsRead}
          className="mb-6"
        />
      </View>
    </BasicScreen>
  );
}
