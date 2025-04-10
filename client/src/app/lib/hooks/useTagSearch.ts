import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_URL;

function useTagSearch(query: string) {
  return useQuery({
    queryKey: ["tagSearch", query],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tags/search?query=${query}`);
      return res.json();
    },
    enabled: query.length > 0,
  });
}

export default useTagSearch;
