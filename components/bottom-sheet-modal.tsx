import {
  BottomSheetBackdrop,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetModal as RawBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import BottomSheetHandle from "./bottom-sheet-handle";
import cn from "@/utilities/cn";

const BottomSheetModal = forwardRef<
  RawBottomSheetModal,
  Omit<BottomSheetModalProps, "children" | "name"> & {
    children: React.ReactNode;
    name: string;
    className?: string;
    withHandle?: boolean;
  }
>(({ className = "", name, children, withHandle = true, ...props }, ref) => {
  return (
    <RawBottomSheetModal
      ref={ref}
      backgroundStyle={{ borderRadius: 26 }}
      backdropComponent={(backdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      handleComponent={(props) =>
        withHandle ? <BottomSheetHandle {...props} name={name} /> : null
      }
      {...props}
      name={name}
      handleIndicatorStyle={{marginTop: 48}}
    >
      <BottomSheetView className={cn("h-full px-4", className)}>
        {children}
      </BottomSheetView>
    </RawBottomSheetModal>
  );
});

BottomSheetModal.displayName = "BottomSheetModal";

export type RawBottomSheetModalType = RawBottomSheetModal;

export default BottomSheetModal;
