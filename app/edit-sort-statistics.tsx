import BottomSheetModal from "@/components/bottom-sheet-modal";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcDrag from "@/components/icons/drag";
import IcInfoCircle from "@/components/icons/info-circle";
import Text from "@/components/text";
import { StatisticWidget } from "@/constants/mock";
import { useRef, useState } from "react";
import { Pressable, View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import Button from "@/components/button";
import { router } from "expo-router";
import { mockStatistics } from "@/components/home/statistics";
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  RenderItemParams,
  useOnCellActiveAnimation,
} from "react-native-draggable-flatlist";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface StatisticWidgetWithKey extends StatisticWidget {
  key: string;
}

export default function EditSortStatistics() {
  const total = mockStatistics.length;

  // Convert to include unique keys
  const statisticsWithKeys: StatisticWidgetWithKey[] = mockStatistics.map(
    (stat, index) => ({
      ...stat,
      key: `stat-${index}`,
    }),
  );

  const [current, setCurrent] = useState<StatisticWidgetWithKey[]>(
    statisticsWithKeys.slice(0, total - 2),
  );
  const [unselected, setUnselected] = useState<StatisticWidgetWithKey[]>(
    statisticsWithKeys.slice(total - 2),
  );

  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);
  const [selectedStatistic, setSelectedStatistic] =
    useState<StatisticWidget | null>(null);

  const showModal = (selected: StatisticWidget) => {
    console.log('showModal route', selected.route)
    setSelectedStatistic(selected);
    bottomSheetModalRef.current?.present();
  };

  const CurrentItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<StatisticWidgetWithKey>) => {
    const { isActive: cellActive } = useOnCellActiveAnimation();

    const animatedStyle = useAnimatedStyle(() => {
      const scale = cellActive ? withSpring(0.95) : withSpring(1);
      return {
        transform: [{ scale }],
      };
    }, [cellActive]);

    return (
      <Animated.View style={animatedStyle}>
        <View
          style={[styles.itemContainer, isActive && styles.itemContainerActive]}
        >
          <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
            <IcDrag />
          </TouchableOpacity>
          <Text className="flex-1 ml-2">{item.title}</Text>
          <Pressable onPress={() => showModal(item)}>
            <IcInfoCircle />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const UnselectedItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<StatisticWidgetWithKey>) => {
    const { isActive: cellActive } = useOnCellActiveAnimation();

    const animatedStyle = useAnimatedStyle(() => {
      const scale = cellActive ? withSpring(0.95) : withSpring(1);
      return {
        transform: [{ scale }],
      };
    }, [cellActive]);

    return (
      <Animated.View style={animatedStyle}>
        <View
          style={[styles.itemContainer, isActive && styles.itemContainerActive]}
        >
          <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
            <IcDrag />
          </TouchableOpacity>
          <Text className="flex-1 ml-2">{item.title}</Text>
          <Pressable onPress={() => showModal(item)}>
            <IcInfoCircle />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <NestableScrollContainer style={styles.scrollContainer}>
        <View className="py-safe px-4 bg-white">
          <View className="flex flex-row gap-1 items-center mb-2">
            <Pressable onPress={router.back}>
              <IcArrowLeft />
            </Pressable>
            <Text className="font-bold text-lg">Modifier mes statistiques</Text>
          </View>

          <Text className="text-subtleText mb-6">
            Glisse et dépose les statistiques que tu veux voir sur ta page
            d&apos;accueil.
          </Text>

          {/* Current Statistics */}
          <View className="border border-primary border-dashed gap-2 p-2 rounded-lg bg-light mb-6">
            <Text className="text-base font-semibold mb-2 mt-3">
              Statistiques principales
            </Text>
            <NestableDraggableFlatList
              data={current}
              renderItem={CurrentItem}
              keyExtractor={(item) => item.key}
              onDragEnd={({ data }) => setCurrent(data)}
              containerStyle={styles.flatListContainer}
            />
          </View>

          {/* Unselected Statistics */}
          <View className="gap-2 p-2 mb-6">
            <NestableDraggableFlatList
              data={unselected}
              renderItem={UnselectedItem}
              keyExtractor={(item) => item.key}
              onDragEnd={({ data }) => setUnselected(data)}
              containerStyle={styles.flatListContainer}
            />
          </View>
        </View>
      </NestableScrollContainer>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="setting"
        snapPoints={["88%"]}
        key="statistic"
        className="pb-safe"
      >
        {selectedStatistic ? (
          <View>
            <Text className="text-lg font-bold text-secondary">
              {selectedStatistic.title}
            </Text>
            <Text className="text-subtleText text-base">
              Visualise ta pratique sous tous les angles. Une vue claire pour
              équilibrer ta routine et suivre ta progression globale
            </Text>
            <View className="border border-stroke p-4 mt-6 rounded-lg h-95">
              {selectedStatistic.chartDetail ?? selectedStatistic.chart}
            </View>
          </View>
        ) : null}

        <View className="grow" />

        <Button
          text="Définir comme widget principal"
          type="secondary"
          onPress={() => {
            bottomSheetModalRef.current?.close();
            console.log(selectedStatistic?.route);
            router.push(selectedStatistic?.route as any);
          }}
        />
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flatListContainer: {
    backgroundColor: "transparent",
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContainerActive: {
    opacity: 0.9,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  dragHandle: {
    padding: 4,
  },
});
