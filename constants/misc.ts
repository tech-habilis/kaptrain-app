import Constants from "expo-constants";
import { ColorConst } from "./theme";

export const appName = Constants.expoConfig?.name || "";
export const appScheme = (Constants.expoConfig?.scheme as string) + "://";

export const IMAGE_PICKER_OPTIONS = {
  width: 500,
  height: 500,
  cropping: true,
  cropperToolbarTitle: "Recadrer la photo",
  cropperCancelText: "Annuler",
  cropperChooseText: "Valider",
  cropperCircleOverlay: true,
  compressImageQuality: 0.8,
  mediaType: "photo" as const,
  cropperToolbarColor: ColorConst.primary,
  cropperActiveWidgetColor: ColorConst.primary,
  cropperToolbarWidgetColor: '#FFFFFF',
  hideBottomControls: true,
} as const;
