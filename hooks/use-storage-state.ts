import { useCallback, useEffect, useReducer } from "react";
import { Platform } from "react-native";
import * as SecureStorage from "expo-secure-store";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null,
    ): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(
  key: string,
  value: string | null,
): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local Storage is unavailable: ", e);
    }
  } else {
    if (value === null) {
      await SecureStorage.deleteItemAsync(key);
    } else {
      await SecureStorage.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  // get initial value from storage
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStorage.getItemAsync(key).then((value: string | null) => {
        setState(value);
      });
    }
  }, [key, setState]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
}

export function useJsonStorageState<T>(key: string): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>();

  // get initial value from storage
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(JSON.parse(localStorage.getItem(key) || "{}"));
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStorage.getItemAsync(key).then((value: string | null) => {
        try {
          setState(JSON.parse(value || "{}"));
        } catch {
          setState(null);
        }
      });
    }
  }, [key, setState]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value ? JSON.stringify(value) : null);
    },
    [key, setState],
  );

  return [state, setValue];
}

export function getStorageValue(key: string) {
  if (Platform.OS === "web") {
    try {
      if (typeof localStorage !== "undefined") {
        return Promise.resolve(localStorage.getItem(key));
      }

      return Promise.resolve(null);
    } catch (e) {
      console.error("Local storage is unavailable:", e);
      return Promise.resolve(null);
    }
  } else {
    return SecureStorage.getItemAsync(key);
  }
}
