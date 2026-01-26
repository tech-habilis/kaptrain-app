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
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  activities: ("blue" | "orange" | "grey" | "green")[];
}

interface UseAgendaCalendarReturn {
  currentDate: Date;
  selectedDate: Date;
  currentMonthLabel: string;
  weekDays: string[];
  calendarWeeks: CalendarDay[][];
  selectedDateSessions: SessionWithCreator[];
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  selectDate: (date: Date) => void;
  isLoading: boolean;
  refreshSessions: () => Promise<void>;
}

export function useAgendaCalendar(
  userId: string | undefined,
): UseAgendaCalendarReturn {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sessions, setSessions] = useState<SessionWithCreator[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Week days starting Monday (France)
  const weekDays = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

  // Current month label (e.g., "Avril 2025")
  const currentMonthLabel = currentDate
    .format("MMMM YYYY")
    .replace(/^\w/, (c) => c.toUpperCase());

  // Fetch sessions for the current visible month (needed for calendar dots)
  const fetchSessions = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const monthStart = currentDate.startOf("month").format("YYYY-MM-DD");
      const monthEnd = currentDate.endOf("month").format("YYYY-MM-DD");

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
        .gte("scheduled_date", monthStart)
        .lte("scheduled_date", monthEnd)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      setSessions((data || []) as unknown as SessionWithCreator[]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, userId]);

  // Refresh sessions
  const refreshSessions = async () => {
    await fetchSessions();
  };

  // Fetch sessions when screen comes into focus or when current month/user changes
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

  // Generate calendar weeks
  const calendarWeeks = useMemo<CalendarDay[][]>(() => {
    const monthStart = currentDate.startOf("month");

    // Get the first day of the calendar (might be in previous month)
    // In France, week starts on Monday (weekday() where 0 = Sunday, 1 = Monday)
    const firstDayOfWeek = monthStart.weekday(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const calendarStart = monthStart.subtract(
      firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1,
      "day",
    );

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

    // Generate 6 weeks (42 days) to cover all possibilities
    const weeks: CalendarDay[][] = [];
    for (let week = 0; week < 6; week++) {
      const weekDays: CalendarDay[] = [];
      for (let day = 0; day < 7; day++) {
        const dayDate = calendarStart.add(week * 7 + day, "day");
        const dateKey = dayDate.format("YYYY-MM-DD");
        weekDays.push({
          date: dayDate.toDate(),
          day: dayDate.format("D"),
          isCurrentMonth: dayDate.month() === currentDate.month(),
          isToday: dayDate.isSame(dayjs(), "day"),
          isSelected: dayDate.isSame(selectedDate, "day"),
          activities: sessionsByDate.get(dateKey) || [],
        });
      }
      weeks.push(weekDays);
    }

    return weeks;
  }, [currentDate, selectedDate, sessions]);

  // Navigation handlers
  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
  };

  const goToPrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  };

  const selectDate = (date: Date) => {
    setSelectedDate(dayjs(date));
  };

  return {
    currentDate: currentDate.toDate(),
    selectedDate: selectedDate.toDate(),
    currentMonthLabel,
    weekDays,
    calendarWeeks,
    selectedDateSessions,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
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
