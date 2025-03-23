import { useTailors } from "./useTailors";

export const useSearchTailors = () => {
  const { fetchTailors, loading, error, data } = useTailors();

  const searchTailors = (params) => {
    // If params is a string, convert it to an object with query property
    const searchParams =
      typeof params === "string" ? { query: params } : params;
    return fetchTailors(searchParams);
  };

  return { searchTailors, loading, error, data };
};
