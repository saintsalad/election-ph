import axios from "axios";
import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";

interface UseReactQueryNextOptions<T>
  extends Omit<UseQueryOptions<T, Error, T, QueryKey>, "queryKey" | "queryFn"> {
  manual?: boolean;
}

/**
 * A custom hook that combines React Query with Next.js-specific functionality.
 *
 * @param queryKey - The key for the query, used for caching and refetching.
 * @param baseEndpoint - The base URL for the API endpoint.
 * @param options - Additional options for the query, including manual mode.
 * @returns An object containing the query result and additional refetch methods.
 */
export default function useReactQueryNext<T>(
  queryKey: QueryKey,
  baseEndpoint: string,
  options: UseReactQueryNextOptions<T> = {}
) {
  const queryClient = useQueryClient();
  const { manual = false, ...queryOptions } = options;

  /**
   * Constructs the full URL by appending the parameter string to the base endpoint.
   */
  const constructUrl = (paramString?: string) => {
    if (!paramString) return baseEndpoint;
    if (paramString.startsWith("?")) {
      return `${baseEndpoint}${paramString}`;
    }
    return `${baseEndpoint}${paramString}`;
  };

  const query = useQuery<T, Error, T, QueryKey>(
    queryKey,
    async () => {
      const { data } = await axios.get<T>(baseEndpoint);
      return data;
    },
    {
      ...queryOptions,
      enabled: !manual,
    }
  );

  /**
   * Refetches the data without using the cache.
   * @param paramString - Optional parameter string to append to the URL.
   */
  const refetchWithoutCache = async (paramString?: string) => {
    const url = constructUrl(paramString);
    await queryClient.fetchQuery(queryKey, async () => {
      const { data } = await axios.get<T>(url, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      return data;
    });
  };

  /**
   * Refetches the data with an updated parameter string.
   * @param paramString - The parameter string to append to the URL.
   */
  const refetchNext = async (paramString: string) => {
    const url = constructUrl(paramString);
    return queryClient.fetchQuery(queryKey, async () => {
      const { data } = await axios.get<T>(url);
      return data;
    });
  };

  return { ...query, refetchWithoutCache, refetchNext };
}

/**
 * Usage Example:
 *
 * import useReactQueryNext from './hooks/useReactQueryNext';
 *
 * function UserProfile() {
 *   const { data, isLoading, error, refetchWithoutCache, refetchNext } = useReactQueryNext<User>(
 *     ['user', 1],
 *     '/api/users/1',
 *     { staleTime: 5 * 60 * 1000 } // 5 minutes
 *   );
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <h1>{data.name}</h1>
 *       <button onClick={() => refetchWithoutCache()}>Refresh (Skip Cache)</button>
 *       <button onClick={() => refetchNext('?include=posts')}>Fetch with Posts</button>
 *     </div>
 *   );
 * }
 */
