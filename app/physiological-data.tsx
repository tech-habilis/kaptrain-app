import BasicScreen from "@/components/basic-screen";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal";
import Button from "@/components/button";
import Input from "@/components/input";
import IcLightning from "@/components/icons/lightning";
import IcPencil from "@/components/icons/pencil";
import Text from "@/components/text";
import { useRef, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";

interface MetricCardProps {
  label: string;
  date: string;
  value: string;
  unit: string;
  onEdit: () => void;
}

const MetricCard = ({ label, date, value, unit, onEdit }: MetricCardProps) => {
  return (
    <View className="flex-row items-center justify-between gap-3 p-3 bg-light border border-stroke rounded-xl">
      <View className="flex-1 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-secondary text-sm font-medium">{label}</Text>
          <Text className="text-subtleText text-xs text-right w-31">
            {date}
          </Text>
        </View>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-secondary text-lg font-bold">{value}</Text>
          <Text className="text-subtleText text-sm font-medium">{unit}</Text>
        </View>
      </View>
      <Pressable onPress={onEdit} className="p-1">
        <IcPencil size={16} />
      </Pressable>
    </View>
  );
};

interface CategorySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const CategorySection = ({ icon, title, children }: CategorySectionProps) => {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1">
        {icon}
        <Text className="text-subtleText text-sm font-medium">{title}</Text>
      </View>
      {children}
    </View>
  );
};

interface MetricData {
  label: string;
  unit: string;
  value: string;
}

export default function PhysiologicalData() {
  const bottomSheetRef = useRef<RawBottomSheetModalType>(null);
  const [currentMetric, setCurrentMetric] = useState<MetricData | null>(null);
  const [editValue, setEditValue] = useState("");

  const [fcMax, setFcMax] = useState("188");
  const [vma, setVma] = useState("17,5");
  const [pma, setPma] = useState("320");
  const [ftp, setFtp] = useState("250");

  const handleEdit = (metric: MetricData) => {
    setCurrentMetric(metric);
    setEditValue(metric.value);
    bottomSheetRef.current?.present();
  };

  const handleSave = () => {
    if (currentMetric) {
      switch (currentMetric.label) {
        case "FC MAX":
          setFcMax(editValue);
          break;
        case "VMA (km/h)":
          setVma(editValue);
          break;
        case "PMA (W)":
          setPma(editValue);
          break;
        case "FTP (W)":
          setFtp(editValue);
          break;
      }
    }
    bottomSheetRef.current?.dismiss();
  };

  const handleCancel = () => {
    bottomSheetRef.current?.dismiss();
  };

  return (
    <BasicScreen
      title="Mes données physiologiques"
      description="Ces données sont des valeurs de référence pour individualiser tes séances d'entrainements au plus proche de ton profil"
    >
      <ScrollView className="flex-1 px-4 pt-6">
        <View className="gap-6 pb-6">
          {/* Cardiaque Section */}
          <CategorySection icon={<IcLightning size={16} />} title="Cardiaque">
            <MetricCard
              label="FC MAX"
              date="12/08/2025"
              value={fcMax}
              unit="bpm"
              onEdit={() => handleEdit({ label: "FC MAX", unit: "bpm", value: fcMax })}
            />
          </CategorySection>

          {/* Vitesse Section */}
          <CategorySection icon={<IcLightning size={16} />} title="Vitesse">
            <MetricCard
              label="VMA (km/h)"
              date="12/08/2025"
              value={vma}
              unit="km/h"
              onEdit={() => handleEdit({ label: "VMA (km/h)", unit: "km/h", value: vma })}
            />
          </CategorySection>

          {/* Puissance Section */}
          <CategorySection icon={<IcLightning size={16} />} title="Puissance">
            <View className="gap-2">
              <MetricCard
                label="PMA (W)"
                date="12/08/2025"
                value={pma}
                unit="W"
                onEdit={() => handleEdit({ label: "PMA (W)", unit: "W", value: pma })}
              />
              <MetricCard
                label="FTP (W)"
                date="12/08/2025"
                value={ftp}
                unit="W"
                onEdit={() => handleEdit({ label: "FTP (W)", unit: "W", value: ftp })}
              />
            </View>
          </CategorySection>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <BottomSheetModal
        ref={bottomSheetRef}
        name="edit-metric-modal"
        snapPoints={["40%"]}
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">
          {currentMetric?.label || "Modifier la valeur"}
        </Text>

        <View className="pt-6 gap-4">
          <Input
            type="unit"
            unit={currentMetric?.unit}
            value={editValue}
            onChangeText={setEditValue}
            placeholder="0"
          />
        </View>

        <View className="grow" />

        <View className="flex-row gap-3 mb-6">
          <Button
            text="Annuler"
            type="secondary"
            className="flex-1"
            onPress={handleCancel}
          />
          <Button
            text="Enregistrer"
            type="primary"
            className="flex-1"
            onPress={handleSave}
          />
        </View>
      </BottomSheetModal>
    </BasicScreen>
  );
}