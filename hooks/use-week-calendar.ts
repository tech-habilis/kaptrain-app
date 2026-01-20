import { useState, useMemo, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/fr";
import { supabase } from "@/utilities/supabase";
import type { Database } from "@/utilities/supabase/database.types";

// Extend dayjs with plugins
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(localeData);
dayjs.locale("fr");

type Session = Database["public"]["Tables"]["sessions"]["Row"];

export interface SessionWithCreator extends Session {
  coach?: {
    first_name: string | null;
    display_name: string | null;
  } | null;
}

export interface CalendarDay {
  date: Date;
  day: string;
  title: string;
  isToday: boolean;
  isSelected: boolean;
  activities: ("blue" | "orange" | "grey" | "green")[];
}

interface UseWeekCalendarReturn {
  currentWeekStart: Date;
  selectedDate: Date;
  weekDays: CalendarDay[];
  selectedDateSessions: SessionWithCreator[];
  goToToday: () => void;
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  selectDate: (date: Date) => void;
  isLoading: boolean;
  refreshSessions: () => Promise<void>;
}

export function useWeekCalendar(
  userId: string | undefined,
): UseWeekCalendarReturn {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week"),
  );
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sessions, setSessions] = useState<SessionWithCreator[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sessions for the current visible week
  const fetchSessions = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const weekStart = currentWeekStart.format("YYYY-MM-DD");
      const weekEnd = currentWeekStart.add(6, "day").format("YYYY-MM-DD");

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          coach:coach_id(
            first_name,
            display_name
          )
        `)
        .eq("coach_id", userId)
        .gte("scheduled_date", weekStart)
        .lte("scheduled_date", weekEnd)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      setSessions((data || []) as unknown as SessionWithCreator[]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart, userId]);

  // Refresh sessions
  const refreshSessions = async () => {
    await fetchSessions();
  };

  // Fetch sessions when screen comes into focus or when week/user changes
  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions]),
  );

  // Get sessions for selected date
  const selectedDateSessions = useMemo(() => {
    return sessions.filter((session) => {
      const sessionDate = dayjs(session.scheduled_date);
      return sessionDate.isSame(selectedDate, "day");
    });
  }, [sessions, selectedDate]);

  // Generate week days (Monday to Sunday)
  const weekDays = useMemo<CalendarDay[]>(() => {
    // Week day titles (Lun, Mar, etc.)
    const weekDayTitles = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

    // Build a map of sessions by date for activity dots
    const sessionsByDate = new Map<
      string,
      ("blue" | "orange" | "grey" | "green")[]
    >();
    sessions.forEach((session) => {
      const dateKey = session.scheduled_date;
      if (!sessionsByDate.has(dateKey)) {
        sessionsByDate.set(dateKey, []);
      }
      // Determine color based on session status or type
      const color = getActivityColor(session);
      sessionsByDate.get(dateKey)?.push(color);
    });

    // Generate 7 days for the current week (Monday to Sunday)
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = currentWeekStart.add(i, "day");
      const dateKey = dayDate.format("YYYY-MM-DD");
      days.push({
        date: dayDate.toDate(),
        day: dayDate.format("D"),
        title: weekDayTitles[i],
        isToday: dayDate.isSame(dayjs(), "day"),
        isSelected: dayDate.isSame(selectedDate, "day"),
        activities: sessionsByDate.get(dateKey) || [],
      });
    }

    return days;
  }, [currentWeekStart, selectedDate, sessions]);

  // Navigation handlers
  const goToToday = () => {
    const today = dayjs();
    const weekStart = today.startOf("week");
    setCurrentWeekStart(weekStart);
    setSelectedDate(today);
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => prev.add(1, "week"));
  };

  const goToPrevWeek = () => {
    setCurrentWeekStart((prev) => prev.subtract(1, "week"));
  };

  const selectDate = (date: Date) => {
    setSelectedDate(dayjs(date));
  };

  return {
    currentWeekStart: currentWeekStart.toDate(),
    selectedDate: selectedDate.toDate(),
    weekDays,
    selectedDateSessions,
    goToToday,
    goToNextWeek,
    goToPrevWeek,
    selectDate,
    isLoading,
    refreshSessions,
  };
}

// Helper: Determine activity color based on session
function getActivityColor(
  session: Session,
): "blue" | "orange" | "grey" | "green" {
  // If session has custom color, use it
  if (session.activity_color) {
    const colorMap: Record<string, "blue" | "orange" | "grey" | "green"> = {
      "#457CE2": "blue",
      "#FF9E69": "orange",
      "#727988": "grey",
      "#4FD365": "green",
    };
    return colorMap[session.activity_color] || "blue";
  }

  // Otherwise, base on session status
  switch (session.session_status) {
    case "completed":
      return "green";
    case "canceled":
      return "grey";
    case "in_progress":
      return "orange";
    default:
      return "blue";
  }
}
