import { getCoachData } from "@/services/coach.service"
import { useQuery } from "@tanstack/react-query"

/**
 * React Query hook to fetch the current user's coach data
 * Returns coach profile information including name, avatar, and connection details
 */
export function useCoach() {
  return useQuery({
    queryKey: ["coach"],
    queryFn: getCoachData,
  })
}
