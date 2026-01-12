import BasicScreen from "@/components/basic-screen";
import Text from "@/components/text";
import { View } from "react-native";

const TermItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <View className="gap-2">
      <Text className="text-secondary text-sm font-bold">{title}</Text>
      <Text className="text-subtleText text-sm">{description}</Text>
    </View>
  );
};

export default function PrivacyPolicy() {
  const terms = [
    {
      title: "1. Utilisation de l’app",
      description:
        "Kaptrain est une plateforme qui te permet de suivre tes entraînements, ton état de forme et d’échanger avec ton coach. Tu t’engages à utiliser l’app de manière responsable, dans un cadre personnel et non commercial.",
    },
    {
      title: "2. Confidentialité des données",
      description:
        "Tes données sont à toi. On les protège et on ne les partage jamais sans ton accord. Tu peux consulter notre politique de confidentialité pour en savoir plus.",
    },
    {
      title: "3. Respect entre utilisateurs",
      description:
        "Tu t’engages à rester respectueux dans tes échanges avec ton coach.",
    },
  ];

  return (
    <BasicScreen
      title="Politique de confidentialité"
      description="Utilise les paramètres ci-dessous pour définir ton niveau d’accès aux différentes parties de l’application. Sache que si tu as un coach, il aura toujours accès à ton profil et à son contenu."
    >
      <View className="pt-6 px-4 gap-8">
        {terms.map((contact, index) => (
          <TermItem
            key={index}
            title={contact.title}
            description={contact.description}
          />
        ))}
      </View>
    </BasicScreen>
  );
}
