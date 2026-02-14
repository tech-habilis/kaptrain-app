import { fetchAthleteSports, fetchSports } from "@/services/sport.service"
import { TSportQuery } from "@/types/sport.type"
import { useQuery } from "@tanstack/react-query"

export function useAthleteSports(query?: TSportQuery) {
  return useQuery({
    queryKey: ["athlete-sports", query],
    queryFn: () => fetchAthleteSports(query),
  })
}

export function useSports(query?: TSportQuery) {
  return useQuery({
    queryKey: ["sports", query],
    queryFn: () => fetchSports(query),
  })
}
