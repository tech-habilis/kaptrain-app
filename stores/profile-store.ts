import { create } from "zustand";
import type { Database } from "@/utilities/supabase/database.types";
import { getUserProfile, updateUserProfile } from "@/utilities/supabase/profile";
import { uploadProfileImage } from "@/utilities/supabase/storage";
import { toast } from "@/components/toast";
import { supabase } from "@/utilities/supabase";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

type Gender = "female" | "male" | "nonbinary" | "prefer_not_to_say" | "";
type SportLevel = "beginner" | "intermediate" | "advanced" | "confirmed" | "expert" | "";
type UserRole = Database["public"]["Enums"]["user_role"];

interface ProfileState {
  // Profile data
  profile: UserProfile | null;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Local avatar URI for upload
  localAvatarUri: string | null;

  // Form fields - Basic Info
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  email: string;
  phone: string;

  // Form fields - Personal Details
  birthDate: string;
  gender: Gender;
  height: string;
  inWheelchair: boolean;
  weight: string;
  sportLevel: SportLevel;

  // System fields (read-only)
  role: UserRole | null;

  // Actions
  loadProfile: (userId: string) => Promise<void>;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setDisplayName: (value: string) => void;
  setBio: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setBirthDate: (value: string) => void;
  setGender: (value: Gender) => void;
  setHeight: (value: string) => void;
  setInWheelchair: (value: boolean) => void;
  setWeight: (value: string) => void;
  setSportLevel: (value: SportLevel) => void;
  setLocalAvatarUri: (uri: string | null) => void;
  saveProfile: (userId: string) => Promise<boolean>;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  localAvatarUri: null,

  // Initial form state
  firstName: "",
  lastName: "",
  displayName: "",
  bio: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  height: "",
  inWheelchair: false,
  weight: "",
  sportLevel: "",
  role: null,

  loadProfile: async (userId) => {
    try {
      set({ isLoading: true });
      const profile = await getUserProfile(userId);

      if (!profile) {
        // No profile row exists yet — keep defaults
        set({ profile: null });
        return;
      }

      set({
        profile,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        displayName: profile.display_name || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: (profile as any).phone || "",
        birthDate: profile.date_of_birth || "",
        gender: (profile.gender as Gender) || "",
        height: profile.height?.toString() || "",
        inWheelchair: profile.in_wheelchair || false,
        weight: profile.weight?.toString() || "",
        sportLevel: (profile.sport_level as SportLevel) || "",
        role: profile.role || null,
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
  setDisplayName: (value) => set({ displayName: value }),
  setBio: (value) => set({ bio: value }),
  setEmail: (value) => set({ email: value }),
  setPhone: (value) => set({ phone: value }),
  setBirthDate: (value) => set({ birthDate: value }),
  setGender: (value) => set({ gender: value }),
  setHeight: (value) => set({ height: value }),
  setInWheelchair: (value) => set({ inWheelchair: value }),
  setWeight: (value) => set({ weight: value }),
  setSportLevel: (value) => set({ sportLevel: value }),
  setLocalAvatarUri: (uri) => set({ localAvatarUri: uri }),

  saveProfile: async (userId) => {
    const {
      firstName,
      lastName,
      displayName,
      bio,
      email,
      phone,
      birthDate,
      gender,
      height,
      inWheelchair,
      weight,
      sportLevel,
      localAvatarUri,
    } = get();

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

      // Update basic info fields
      if (firstName) updates.first_name = firstName;
      if (lastName) updates.last_name = lastName;
      if (displayName) updates.display_name = displayName;
      if (bio !== undefined) updates.bio = bio || null;
      if (email) updates.email = email;
      if (phone) updates.phone = phone;

      // Update personal details fields
      if (birthDate) updates.date_of_birth = birthDate;
      if (gender) updates.gender = gender;
      if (height) updates.height = parseFloat(height.replace(",", "."));
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
    displayName: "",
    bio: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    height: "",
    inWheelchair: false,
    weight: "",
    sportLevel: "",
    role: null,
  }),
}));
