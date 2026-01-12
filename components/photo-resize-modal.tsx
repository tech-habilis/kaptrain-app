import { forwardRef, useImperativeHandle, useRef } from "react";
import { Dimensions, View, Image, ImageSourcePropType, Pressable } from "react-native";
import Button from "./button";
import BottomSheetModal from "./bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcClose from "./icons/close";
import Text from "./text";

interface PhotoResizeModalProps {
  imageSource: ImageSourcePropType;
  onConfirm: (croppedImage?: any) => void;
  onCancel?: () => void;
}

export interface PhotoResizeModalRef {
  present: () => void;
  dismiss: () => void;
}

const PhotoResizeModal = forwardRef<PhotoResizeModalRef, PhotoResizeModalProps>(
  ({ imageSource, onConfirm, onCancel }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const handleConfirm = () => {
      // TODO: Implement actual cropping logic
      onConfirm();
      bottomSheetModalRef.current?.dismiss();
    };

    const handleCancel = () => {
      onCancel?.();
      bottomSheetModalRef.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="photo-resize-modal"
        snapPoints={["70%"]}
        className="pt-6"
        detached
        bottomInset={Dimensions.get('screen').height * 0.25}
        style={{ marginHorizontal: 16 }}
        withHandle={false}
        backgroundStyle={{ borderRadius: 16 }}
        enablePanDownToClose={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[20px] font-futura font-bold text-secondary">
            Recadrer la photo
          </Text>
          <Pressable
            onPress={handleCancel}
            className="w-10 h-10 items-center justify-center"
          >
            <IcClose size={24} />
          </Pressable>
        </View>

        {/* Image Preview with Crop Overlay */}
        <View className="mb-4">
          <View className="h-69.5 rounded-xl overflow-hidden relative bg-[#F6F7FC]">
            {/* Image */}
            <Image
              source={imageSource}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Crop Overlay */}
            <View className="absolute inset-0 items-center justify-center">
              {/* Semi-transparent background overlay */}
              <View className="absolute inset-0 bg-black/40" />

              {/* Visible crop area */}
              <View className="w-67.25 h-60.5 border-4 border-primary rounded-xl">
                {/* Corner Handles */}
                <View className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-sm border-8 border-primary" />
                <View className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-sm border-8 border-primary" />
                <View className="absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-sm border-8 border-primary" />
                <View className="absolute -right-2.5 -bottom-2.5 w-5 h-5 rounded-sm border-8 border-primary" />

                {/* Edge Midpoint Handles */}
                <View className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-2.5 h-2.5 rounded-sm bg-primary" />
                <View className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rounded-sm bg-primary" />
                <View className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-2.5 rounded-sm bg-primary" />
                <View className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-2.5 rounded-sm bg-primary" />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Button
            text="Annuler"
            type="secondary"
            size="small"
            className="flex-1"
            onPress={handleCancel}
          />
          <Button
            text="Valider"
            type="primary"
            size="small"
            className="flex-1"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheetModal>
    );
  }
);

PhotoResizeModal.displayName = "PhotoResizeModal";

export default PhotoResizeModal;
