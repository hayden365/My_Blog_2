import { useQuery } from "@tanstack/react-query";
import { getTags, searchTags } from "../api/fetch";

export function useSearchTags(query: string) {
  return useQuery({
    queryKey: ["searchTags", query],
    queryFn: async () => {
      const response = await searchTags(query);
      return response;
    },
    enabled: query.length > 0,
  });
}

export function useGetTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await getTags();
      return response;
    },
  });
}
