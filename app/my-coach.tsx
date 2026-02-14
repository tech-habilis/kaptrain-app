import BasicScreen from "@/components/basic-screen"
import Button from "@/components/button"
import Input from "@/components/input"
import Text from "@/components/text"
import { toast } from "@/components/toast"
import { ColorConst } from "@/constants/theme"
import { useCoach } from "@/hooks/use-coach"
import { submitReferralCode } from "@/services/referral-code.service"
import { TCoach } from "@/types/coach.type"
import cn from "@/utilities/cn"
import { useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Image, RefreshControl, ScrollView, View } from "react-native"

const CoachCardSkeleton = () => (
  <View className={cn("bg-white border border-stroke p-3 mt-6 rounded-2xl")}>
    <View className="h-4 w-24 bg-light rounded-sm" />
    <View className="flex-row items-center mt-3 gap-2">
      <View className="size-9 bg-light rounded-full" />
      <View className="h-5 w-28 bg-light rounded-sm" />
    </View>
    <View className="mt-4 h-3 w-40 bg-light rounded-sm" />
  </View>
)

const CoachCard = ({ data }: { data: TCoach }) => {
  return (
    <View className={cn("bg-white border border-stroke p-3 mt-6 rounded-2xl")}>
      <Text className="text-text text-base font-semibold">Coach actuel</Text>

      <View className="flex-row items-center mt-3 gap-2">
        {data.profilePicture ? (
          <Image
            source={{ uri: data.profilePicture || "" }}
            className="size-9 bg-light p-0.5 rounded-full z-10"
          />
        ) : (
          <View className="size-9 bg-light p-0.5 rounded-full z-10 items-center justify-center">
            <Text className="text-text text-sm">{data.name?.[0]}</Text>
          </View>
        )}
        <Text className="bg-light px-2 text-text text-sm rounded-sm">
          {data.name}
        </Text>
      </View>

      <Text className="mt-4 text-sm text-subtleText">
        {`Depuis le ${dayjs(data.connectedSince).locale("fr").format("DD MMMM YYYY")}`}
      </Text>
    </View>
  )
}

export default function MyCoach() {
  const queryClient = useQueryClient()
  const [invitationCode, setInvitationCode] = useState("")
  const {
    data: coachData,
    isLoading: isLoadingCoach,
    refetch: refetchCoach,
    isFetching: isFetchingCoach,
  } = useCoach()
  const isConnectToCoachEnabled = invitationCode.length > 0
  const [submitting, setSubmitting] = useState(false)

  useFocusEffect(
    useCallback(() => {
      refetchCoach()
    }, [refetchCoach])
  )

  const reloadNewData = () => {
    queryClient.invalidateQueries({ queryKey: ["coach"] })
    refetchCoach()
  }

  const handleConnectToCoach = () => {
    if (!isConnectToCoachEnabled) return
    setSubmitting(true)
    submitReferralCode(invitationCode)
      .then((response) => {
        toast.success("Coach connected successfully")
        setSubmitting(false)
        reloadNewData()
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.message || "Failed to connect to coach")
        setSubmitting(false)
      })
  }

  return (
    <BasicScreen title="Mon coach">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingCoach}
            onRefresh={reloadNewData}
          />
        }
      >
        {isFetchingCoach && <CoachCardSkeleton />}
        {coachData && !isFetchingCoach && <CoachCard data={coachData} />}

        {/* <View className="border border-b border-stroke my-6" /> */}

        {!coachData && !isFetchingCoach && (
          <View className="mt-6">
            <Text className="text-secondary font-ls-bold text-base">
              Demande d’invitation. Renseigne ton code ici
            </Text>

            <Input
              label="Ton code d’invitation"
              placeholderTextColor={ColorConst.subtleText}
              placeholder="EX : JNKMD701"
              className="mt-3"
              inputClassName="font-semibold uppercase"
              value={invitationCode}
              onChangeText={setInvitationCode}
            />
          </View>
        )}

        {!coachData && !isFetchingCoach && (
          <View className="mt-auto pb-safe mb-2">
            <Button
              disabled={invitationCode.length === 0 || submitting}
              size="large"
              text="Se connecter à mon coach"
              onPress={handleConnectToCoach}
              loading={submitting}
            />
          </View>
        )}
      </ScrollView>
    </BasicScreen>
  )
}
