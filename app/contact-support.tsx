import BasicScreen from "@/components/basic-screen";
import IcMail from "@/components/icons/mail";
import IcPhoneRing from "@/components/icons/phone-ring";
import Text from "@/components/text";
import { ReactNode } from "react";
import { Linking, Pressable, View } from "react-native";

const ContactCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => {
  return (
    <View className="rounded-xl p-3 flex-row gap-4 items-center border border-stroke">
      <View className="p-2 bg-light rounded-md">{icon}</View>
      <View className="gap-1">
        <Text className="text-sm text-subtleText">{label}</Text>
        <Text className="text-secondary text-base font-bold">{value}</Text>
      </View>
    </View>
  );
};

export default function ContactSupport() {
  const contacts = [
    {
      label: "Appelez nous",
      value: "02 25 44 67 82",
      icon: <IcPhoneRing />,
      onPress: () => Linking.openURL("tel:0225446782"),
    },
    {
      label: "Envoyez nous un mail",
      value: "kaptrain@support.com",
      icon: <IcMail />,
      onPress: () => Linking.openURL("mailto:kaptrain@support.com"),
    },
  ];

  return (
    <BasicScreen
      title="Contacter le support"
      description="Une question, un bug ou un retour à nous faire ?"
    >
      <View className="pt-6 px-4 gap-4">
        {contacts.map((contact, index) => (
          <Pressable key={index} onPress={contact.onPress}>
            <ContactCard
              label={contact.label}
              value={contact.value}
              icon={contact.icon}
            />
          </Pressable>
        ))}
      </View>
    </BasicScreen>
  );
}
