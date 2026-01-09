import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import IcArrowRight from "@/components/icons/arrow-right";
import IcLogout from "@/components/icons/logout";
import Toggle from "@/components/toggle";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSession } from "@/contexts/auth-context";
import DeleteAccountModal, {
  DeleteAccountModalRef,
} from "@/components/delete-account-modal";
import ConfirmActionModal from "@/components/confirm-action-modal";

interface SettingItemProps {
  label: string;
  onPress?: () => void;
  showArrow?: boolean;
  toggle?: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  };
}

const SettingItem = ({
  label,
  onPress,
  showArrow = true,
  toggle,
}: SettingItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !toggle}
      className="flex-row items-center justify-between py-2"
    >
      <Text
        className={`text-base font-semibold text-secondary ${toggle ? "flex-1" : ""}`}
      >
        {label}
      </Text>
      {toggle ? (
        <Toggle value={toggle.value} onValueChange={toggle.onValueChange} />
      ) : showArrow ? (
        <IcArrowRight color={ColorConst.secondary} />
      ) : null}
    </Pressable>
  );
};

interface SettingSectionProps {
  title: string;
  items: SettingItemProps[];
}

const SettingSection = ({ title, items }: SettingSectionProps) => {
  return (
    <View className="gap-3">
      <Text className="text-sm text-subtleText">{title}</Text>
      <View className="gap-3">
        {items.map((item, index) => (
          <SettingItem key={index} {...item} />
        ))}
      </View>
    </View>
  );
};

export default function Settings() {
  const [trainingNotifications, setTrainingNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { signOut } = useSession();

  const deleteAccountModalRef = useRef<DeleteAccountModalRef>(null);

  const handleLogout = async () => {
    // TODO: add loading state
    await signOut();
    router.replace(ROUTE.LANDING);
  };

  const handleDeleteAccountPress = () => {
    deleteAccountModalRef.current?.present();
  };

  const handleDeleteAccountConfirm = () => {
    console.log("Account deletion confirmed");
    // TODO: Implement account deletion logic
  };

  const profileSettings: SettingItemProps[] = [
    {
      label: "Modifier mon profil",
      onPress: () => router.push(ROUTE.EDIT_PROFILE),
    },
    {
      label: "Changer mon mot de passe",
      onPress: () => console.log("Change password"),
    },
  ];

  const trainingSettings: SettingItemProps[] = [
    {
      label: "Configurer mon ressenti",
      onPress: () => router.push(ROUTE.CONFIGURE_FEELING),
    },
    {
      label: "Suivi de forme au démarrage",
      onPress: () => router.push(ROUTE.CONFIGURE_SHAPE_TRACKING),
    },
  ];

  const appSettings: SettingItemProps[] = [
    {
      label: "Choisir les unités (kg/lb, cm/inch)",
      onPress: () => router.push(ROUTE.CHOOSE_UNIT),
    },
    {
      label: "Langue de l'application",
      onPress: () => router.push(ROUTE.APP_LANGUAGE)
    },
    {
      label: "Notifications d'entraînement",
      toggle: {
        value: trainingNotifications,
        onValueChange: setTrainingNotifications,
      },
    },
  ];

  const otherSettings: SettingItemProps[] = [
    {
      label: "Conditions d'utilisation",
      onPress: () => console.log("Terms of use"),
    },
    {
      label: "Politique de confidentialité",
      onPress: () => console.log("Privacy policy"),
    },
    {
      label: "Contacter le support",
      onPress: () => console.log("Contact support"),
    },
    {
      label: "Supprimer mon compte",
      onPress: handleDeleteAccountPress,
    },
  ];

  return (
    <BasicScreen title="Paramètres">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-8 mt-6">
          <SettingSection
            title="Paramètres de profil"
            items={profileSettings}
          />
          <SettingSection
            title="Paramètres d'entrainement"
            items={trainingSettings}
          />
          <SettingSection
            title="Paramètres d'application"
            items={appSettings}
          />
          <SettingSection title="Autres paramètres" items={otherSettings} />

          <Button
            text="Se déconnecter"
            type="secondary"
            size="large"
            onPress={() => setShowLogoutModal(true)}
            leftIcon={<IcLogout color={ColorConst.secondary} />}
            className="mt-4"
          />
        </View>
      </ScrollView>

      <ConfirmActionModal
        name="confirm-logout-modal"
        title="Se déconnecter ?"
        message="Tu vas quitter ta session. Tu pourras te reconnecter à tout moment."
        onCancel={() => setShowLogoutModal(false)}
        confirm={{
          text: "Se déconnecter",
          onPress: handleLogout,
        }}
        show={showLogoutModal}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        ref={deleteAccountModalRef}
        onConfirm={handleDeleteAccountConfirm}
      />
    </BasicScreen>
  );
}
