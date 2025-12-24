import Constants from "expo-constants";

export const appName = Constants.expoConfig?.name || "";
export const appScheme = (Constants.expoConfig?.scheme as string) + "://";
