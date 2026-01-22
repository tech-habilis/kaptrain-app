import { useLocalSearchParams } from "expo-router";
import { View, Pressable, FlatList } from "react-native";
import Text from "@/components/text";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import Button from "@/components/button";
import AreaChart from "@/components/charts/area-chart";
import { ColorConst } from "@/constants/theme";
import IcPencil from "@/components/icons/pencil";
import IcMuscular from "@/components/icons/muscular";
import Input from "@/components/input";
import DatePicker from "@/components/date-picker";
import { DateType } from "react-native-ui-datepicker";
import BasicScreen from "@/components/basic-screen";
import ConfirmActionModal from "@/components/confirm-action-modal";
import IcCompass from "@/components/icons/compass";

const today = new Date();

type RecordHistoryItem = {
  id: string;
  x: string;
  y: number;
};

export default function RecordDetailItemScreen() {
  const params = useLocalSearchParams();
  const sportId = (params.sport as string) || "musculation";
  const recordLabel = (params.label as string) || "Record";

  // Get sport name from ID (in production, this would come from API)
  const sportName = sportId.charAt(0).toUpperCase() + sportId.slice(1);

  const addRecordModalRef = useRef<BottomSheetModalType>(null);
  const editRecordModalRef = useRef<BottomSheetModalType>(null);
  const [date, setDate] = useState<DateType>(today);
  const [editingItem, setEditingItem] = useState<RecordHistoryItem | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openEditModal = (item: RecordHistoryItem) => {
    setEditingItem(item);
    editRecordModalRef.current?.present();
  };

  const handleDeletePress = () => {
    editRecordModalRef.current?.dismiss();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    // In production, this would delete the record from the backend
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Mock data - in production this would come from API based on recordId
  const data: RecordHistoryItem[] = [
    {
      id: "1",
      x: "05/01/2026",
      y: 80,
    },
    {
      id: "2",
      x: "06/01/2026",
      y: 82,
    },
    {
      id: "3",
      x: "07/01/2026",
      y: 80,
    },
    {
      id: "4",
      x: "08/01/2026",
      y: 78,
    },
    {
      id: "5",
      x: "09/01/2026",
      y: 79,
    },
    {
      id: "6",
      x: "10/01/2026",
      y: 80,
    },
    {
      id: "7",
      x: "11/01/2026",
      y: 82,
    },
  ];

  const minValue = Math.min(...data.map((item) => item.y));
  const maxValue = Math.max(...data.map((item) => item.y));

  return (
    <>
      <BasicScreen headerClassName="bg-light" title={recordLabel}>
        <View className="flex-row items-center justify-between pt-6 px-4">
          <Text className="text-base text-secondary font-semibold">
            Performance
          </Text>
          <Button
            size="small"
            type="secondaryV2"
            text="Recenter"
            rightIcon={<IcCompass />}
            onPress={() => {}}
          />
        </View>
        <View className="border border-stroke m-4 p-4 rounded-lg items-center">
          <View className="flex-row">
            <AreaChart
              height={200}
              minY={0.9 * minValue}
              maxY={1.05 * maxValue}
              lineColor={ColorConst.primary}
              lineWidth={4}
              gradientTopColor={ColorConst.primary}
              gradientBottomColor={ColorConst.light}
              textColor={ColorConst.subtleText}
              data={data}
              withCurvedLines={false}
              showGridLines
              renderXAxisLabel={(x, index) => {
                const isFirstOrLast = index === 0 || index === data.length - 1;
                return isFirstOrLast ? (
                  <Text className="text-subtleText">{x}</Text>
                ) : undefined;
              }}
            />
          </View>
        </View>

        <View className="px-4 gap-3">
          <Text className="text-secondary font-semibold text-base">
            Historique
          </Text>
          <FlatList
            data={data}
            contentContainerClassName="gap-1.5"
            renderItem={({ item }) => (
              <View className="border border-stroke bg-light p-3 rounded-lg flex-row justify-between items-center">
                <Text className="text-accent text-sm w-1/3">{`${item.y} kg`}</Text>
                <Text className="text-accent text-sm w-1/3">{item.x}</Text>
                <Pressable onPress={() => openEditModal(item)}>
                  <IcPencil />
                </Pressable>
              </View>
            )}
          />
        </View>
      </BasicScreen>

      <View className="pb-safe absolute bottom-0 left-0 right-0 bg-linear-to-t from-white to-transparent blur-3xl">
        <Button
          text="Ajouter un record"
          className="mx-4 mt-6 mb-6"
          type="secondary"
          onPress={() => addRecordModalRef.current?.present()}
        />
      </View>

      <BottomSheetModal
        ref={addRecordModalRef}
        name="add-record"
        snapPoints={["70%"]}
        key="add-record"
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">
          Ajoute un record
        </Text>

        <View className="pt-6 gap-4">
          {/* Sport and record label info */}
          <View className="flex-row gap-2 items-center">
            <IcMuscular size={32} />
            <View className="flex flex-col gap-2">
              <Text className="text-text text-base font-semibold">
                {sportName}
              </Text>
              <Text className="text-subtleText text-sm">{recordLabel}</Text>
            </View>
          </View>

          <Input
            label="Poids"
            placeholder="Entre le poids en kg"
            inputClassName="text-base font-normal"
            keyboardType="numeric"
            returnKeyType="done"
          />

          <DatePicker
            label="Date du record"
            labelOnTop
            selectedDate={date}
            onSelect={(selectedDate) => setDate(selectedDate)}
            maxDate={today}
          />
        </View>

        <View className="grow" />

        <Button
          text="Annuler"
          type="secondary"
          className="mb-2"
          onPress={() => addRecordModalRef.current?.dismiss()}
        />
        <Button text="Ajouter" className="mb-6" />
      </BottomSheetModal>

      <BottomSheetModal
        ref={editRecordModalRef}
        name="edit-record"
        snapPoints={["70%"]}
        key="edit-record"
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">
          Modifier un record
        </Text>

        <View className="pt-6 gap-4">
          {/* Sport and record label info */}
          <View className="flex-row gap-2 items-center">
            <IcMuscular size={32} />
            <View className="flex flex-col gap-2">
              <Text className="text-text text-base font-semibold">
                {sportName}
              </Text>
              <Text className="text-subtleText text-sm">{recordLabel}</Text>
            </View>
          </View>

          <Input
            label="Poids"
            placeholder="Entre le poids en kg"
            defaultValue={editingItem?.y.toString()}
            inputClassName="text-base font-normal"
            keyboardType="numeric"
            returnKeyType="done"
          />

          <DatePicker
            label="Date du record"
            labelOnTop
            selectedDate={date}
            onSelect={(selectedDate) => setDate(selectedDate)}
            maxDate={today}
          />
        </View>

        <View className="grow" />

        <View className="flex flex-col gap-2 mb-6">
          <Button
            type="tertiary"
            text="Supprimer le record"
            size="large"
            onPress={handleDeletePress}
          />
          <Button
            text="Modifier le record"
            size="large"
            onPress={() => editRecordModalRef.current?.dismiss()}
          />
        </View>
      </BottomSheetModal>

      <ConfirmActionModal
        title="Supprimer ce record ?"
        message="Ce record sera effacé de ton historique."
        name="delete-record-confirmation"
        confirm={{
          text: "Oui, supprimer ce record",
          isDestructive: true,
          onPress: handleDeleteConfirm,
        }}
        onCancel={handleDeleteCancel}
        show={showDeleteModal}
      />
    </>
  );
}
