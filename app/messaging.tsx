import IcArrowLeft from "@/components/icons/arrow-left";
import IcSendMessage from "@/components/icons/send-message";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text as RawText,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import IcChatCheckDouble from "@/components/icons/chat-check-double";

interface Message {
  id: string;
  text: string;
  time: string;
  isCoach: boolean;
  isRead?: boolean;
}

export default function Messaging() {
  const [message, setMessage] = useState<string>("");
  const [messages] = useState<Message[]>([
    {
      id: "1",
      text: "Pareil que la dernière séance",
      time: "11:12",
      isCoach: false,
      isRead: false,
    },
    {
      id: "2",
      text: "Haha",
      time: "11:12",
      isCoach: true,
      isRead: true,
    },
    {
      id: "3",
      text: "Tu m'as dit que les jambes étaient lourdes à la fin de la séance d'hier, c'est toujours le cas aujourd'hui ?",
      time: "11:12",
      isCoach: false,
      isRead: false,
    },
    {
      id: "4",
      text: "Ouais un peu, surtout les ischios. Le vélo de récup ce matin a aidé mais c'est pas encore ça.",
      time: "11:12",
      isCoach: true,
      isRead: true,
    },
    {
      id: "5",
      text: "Ok, on va alléger un peu la séance d'aujourd'hui. On reste sur la technique rame, sans charge, et un peu de gainage.",
      time: "11:14",
      isCoach: false,
      isRead: false,
    },
    {
      id: "6",
      text: "Parfait. Je préfère ça, j'ai pas envie de tirer dans la fatigue.",
      time: "11:15",
      isCoach: true,
      isRead: true,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement send message logic
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="auto" />

      {/* Header */}
      <View className="bg-white border-b border-stroke pt-safe pb-4 px-4">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={router.back}
            className="size-10 items-center justify-center"
          >
            <IcArrowLeft color={ColorConst.secondary} />
          </Pressable>

          {/* Coach Avatar and Name */}
          <View className="flex-row items-center gap-3">
            <Image
              source={require("@/assets/images/coach-avatar.png")}
              className="size-12 rounded-full"
            />
            <Text className="text-lg font-semibold text-text">
              Enguerrand Aucher
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={msg.isCoach ? "items-end" : "items-start"}
          >
            <View
              className={`rounded-2xl px-3 py-2 ${
                msg.isCoach ? "bg-secondary max-w-65" : "bg-white max-w-71.25"
              }`}
            >
              <Text
                className={`text-base leading-6 ${
                  msg.isCoach ? "text-white" : "text-text"
                }`}
              >
                {msg.text}
              </Text>

              <View className="flex-row justify-end items-center gap-1.5 mt-1">
                <RawText
                  className={`text-xs ${
                    msg.isCoach ? "text-white" : "text-subtleText"
                  }`}
                >
                  {msg.time}
                </RawText>
                {msg.isCoach && msg.isRead && <IcChatCheckDouble />}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="bg-light px-4 pb-safe mb-6">
        <View className="flex-row items-center gap-2 bg-white border border-stroke rounded-xl px-3 py-3">
          <TextInput
            className="flex-1 text-base text-text"
            placeholder="Message"
            placeholderTextColor={ColorConst.subtleText}
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ opacity: message ? 1 : 0.4 }}
          />
          <Pressable
            onPress={handleSendMessage}
            className="size-10 items-center justify-center"
          >
            <IcSendMessage size={32} color={ColorConst.primary} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
