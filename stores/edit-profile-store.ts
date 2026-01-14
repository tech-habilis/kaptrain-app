import { create } from "zustand";
import type { Database } from "@/utilities/supabase/database.types";
import { getUserProfile, updateUserProfile } from "@/utilities/supabase/profile";
import { uploadProfileImage } from "@/utilities/supabase/storage";
import { toast } from "@/components/toast";
import { supabase } from "@/utilities/supabase";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface EditProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  localAvatarUri: string | null;

  // Form state
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "female" | "male" | "nonbinary" | "prefer_not_to_say" | "";
  height: string;
  inWheelchair: boolean;
  weight: string;
  sportLevel: "beginner" | "intermediate" | "advanced" | "confirmed" | "expert" | "";

  // Actions
  loadProfile: (userId: string) => Promise<void>;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setBirthDate: (value: string) => void;
  setGender: (value: "female" | "male" | "nonbinary" | "prefer_not_to_say") => void;
  setHeight: (value: string) => void;
  setInWheelchair: (value: boolean) => void;
  setWeight: (value: string) => void;
  setSportLevel: (value: "beginner" | "intermediate" | "advanced" | "confirmed" | "expert") => void;
  setLocalAvatarUri: (uri: string | null) => void;
  saveProfile: (userId: string) => Promise<boolean>;
  reset: () => void;
}

export const useEditProfileStore = create<EditProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  localAvatarUri: null,

  // Initial form state
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  height: "",
  inWheelchair: false,
  weight: "",
  sportLevel: "",

  loadProfile: async (userId) => {
    try {
      set({ isLoading: true });
      const profile = await getUserProfile(userId);
      set({
        profile,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        birthDate: profile.date_of_birth || "",
        gender: (profile.gender as any) || "",
        height: profile.height?.toString() || "",
        inWheelchair: profile.in_wheelchair || false,
        weight: profile.weight?.toString() || "",
        sportLevel: (profile.sport_level as any) || "",
      });
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      set({ isLoading: false });
    }
  },

  setFirstName: (value) => set({ firstName: value }),
  setLastName: (value) => set({ lastName: value }),
  setBirthDate: (value) => set({ birthDate: value }),
  setGender: (value) => set({ gender: value }),
  setHeight: (value) => set({ height: value }),
  setInWheelchair: (value) => set({ inWheelchair: value }),
  setWeight: (value) => set({ weight: value }),
  setSportLevel: (value) => set({ sportLevel: value }),
  setLocalAvatarUri: (uri) => set({ localAvatarUri: uri }),

  saveProfile: async (userId) => {
    const { firstName, lastName, birthDate, gender, height, inWheelchair, weight, sportLevel, localAvatarUri } =
      get();

    try {
      set({ isSaving: true });

      const updates: Record<string, any> = {};

      // Upload avatar if changed
      if (localAvatarUri) {
        try {
          const avatarUrl = await uploadProfileImage(userId, localAvatarUri);
          updates.avatar_url = avatarUrl;
          set({ localAvatarUri: null });
        } catch (error: any) {
          console.error("Error uploading avatar:", error);
          toast.error(error.message || "Failed to upload profile image");
          set({ isSaving: false });
          return false;
        }
      }

      // Update other fields if they changed
      if (firstName) updates.first_name = firstName;
      if (lastName) updates.last_name = lastName;
      if (birthDate) updates.date_of_birth = birthDate;
      if (gender) updates.gender = gender;
      if (height) updates.height = parseInt(height, 10);
      updates.in_wheelchair = inWheelchair;
      if (weight) updates.weight = parseFloat(weight.replace(",", "."));
      if (sportLevel) updates.sport_level = sportLevel;

      await updateUserProfile(userId, updates);

      // Also update auth metadata to keep in sync
      if (updates.avatar_url || updates.first_name || updates.last_name) {
        try {
          const fullName = `${updates.first_name || ""} ${updates.last_name || ""}`.trim();
          await supabase.auth.updateUser({
            data: {
              ...(fullName && { name: fullName }),
              ...(updates.avatar_url && { avatar_url: updates.avatar_url }),
            },
          });
        } catch (authError) {
          console.error("Error updating auth metadata:", authError);
          // Don't fail the save if auth metadata update fails
        }
      }

      set({ isSaving: false });
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
      set({ isSaving: false });
      return false;
    }
  },

  reset: () => ({
    profile: null,
    isLoading: false,
    isSaving: false,
    localAvatarUri: null,
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    height: "",
    inWheelchair: false,
    weight: "",
    sportLevel: "",
  }),
}));
