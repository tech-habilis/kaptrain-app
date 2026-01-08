import { View } from "react-native";
import TabataCard from "./tabata-card";
import TabataWidget from "./tabata-widget";
import Text from "./text";

/**
 * Example usage of Tabata components
 * 
 * Both components use the same useTabataTimer hook under the hood,
 * but with different UI presentations.
 */

export function TabataExamples() {
  return (
    <View className="p-4 gap-6">
      <Text className="text-2xl font-bold">Tabata Components Examples</Text>

      {/* Full Card Example */}
      <View className="gap-2">
        <Text className="text-lg font-semibold">Full Card (Large)</Text>
        <TabataCard
          timerType="Tabata"
          effortSeconds={20}
          restSeconds={10}
          totalRounds={8}
          size="large"
          onStarted={() => console.log("Timer started!")}
          onModify={() => console.log("Modify clicked")}
          onClose={() => console.log("Close clicked")}
        />
      </View>

      {/* Compact Widget Example */}
      <View className="gap-2">
        <Text className="text-lg font-semibold">Compact Widget</Text>
        <TabataWidget
          effortSeconds={30}
          restSeconds={15}
          totalRounds={5}
          onStarted={() => console.log("Widget timer started!")}
          onCompleted={() => console.log("Widget timer completed!")}
        />
      </View>

      {/* Custom Timer Example */}
      <View className="gap-2">
        <Text className="text-lg font-semibold">Custom HIIT Timer</Text>
        <TabataWidget
          effortSeconds={45}
          restSeconds={15}
          totalRounds={10}
        />
      </View>

      {/* Short Sprint Example */}
      <View className="gap-2">
        <Text className="text-lg font-semibold">Sprint Timer</Text>
        <TabataCard
          timerType="Sprint"
          effortSeconds={60}
          restSeconds={30}
          totalRounds={4}
          size="small"
        />
      </View>
    </View>
  );
}

/**
 * HOOK USAGE EXAMPLE
 * 
 * You can also use the hook directly to build your own custom timer UI:
 * 
 * ```typescript
 * import { useTabataTimer } from "@/hooks/use-tabata-timer";
 * import { TabataTheme } from "@/constants/tabata-theme";
 * 
 * export function MyCustomTimer() {
 *   const {
 *     state,
 *     phase,
 *     round,
 *     remainingSeconds,
 *     formattedMinutes,
 *     formattedSeconds,
 *     start,
 *     pause,
 *     resume,
 *     reset,
 *   } = useTabataTimer({
 *     effortSeconds: 20,
 *     restSeconds: 10,
 *     totalRounds: 8,
 *     onStarted: () => console.log("Started!"),
 *     onCompleted: () => console.log("Done!"),
 *     onPhaseChange: (phase) => console.log("Phase:", phase),
 *     onRoundChange: (round) => console.log("Round:", round),
 *   });
 * 
 *   // Get theme colors
 *   const phaseTheme = TabataTheme[phase];
 * 
 *   return (
 *     <View style={{ backgroundColor: phaseTheme.cardBackgroundColor }}>
 *       <Text>{formattedMinutes}:{formattedSeconds}</Text>
 *       <Text>Round {round + 1} / 8</Text>
 *       <Text>Phase: {phase}</Text>
 *       
 *       {state === "default" && <Button onPress={start}>Start</Button>}
 *       {state === "running" && <Button onPress={pause}>Pause</Button>}
 *       {state === "paused" && (
 *         <>
 *           <Button onPress={resume}>Resume</Button>
 *           <Button onPress={reset}>Reset</Button>
 *         </>
 *       )}
 *       {state === "completed" && <Button onPress={reset}>Reset</Button>}
 *     </View>
 *   );
 * }
 * ```
 */

/**
 * THEME CUSTOMIZATION
 * 
 * The TabataTheme config in @/constants/tabata-theme.ts provides:
 * 
 * - TabataTheme.effort: Colors for effort phase (red/error theme)
 *   - progressColor: ColorConst.error2
 *   - backgroundColor: "#FFE8E5"
 *   - borderColor: ColorConst.error
 *   - cardBackgroundColor: "#FFF7F6"
 *   - tabBackgroundColor: ColorConst.error2
 *   - badgeBackgroundColor: ColorConst.error
 *   - textColor: ColorConst.error
 * 
 * - TabataTheme.rest: Colors for rest phase (green/success theme)
 *   - progressColor: ColorConst.green
 *   - backgroundColor: rgba(success, 0.1)
 *   - borderColor: ColorConst.success
 *   - cardBackgroundColor: rgba(success, 0.05)
 *   - tabBackgroundColor: ColorConst.green
 *   - badgeBackgroundColor: ColorConst.success
 *   - textColor: ColorConst.success
 * 
 * - TabataTheme.default: Colors for default/starting state
 *   - backgroundColor: ColorConst.light
 *   - borderColor: ColorConst.stroke
 *   - textColor: ColorConst.accent
 * 
 * - TabataTheme.completed: Colors for completed state
 *   - backgroundColor: ColorConst.light
 *   - borderColor: ColorConst.primary
 *   - buttonBackgroundColor: ColorConst.success
 */