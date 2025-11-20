import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { UserListResponse } from "@/types/user";

export async function getUsers(page = 1, limit = 10, role?: string) {
  try {
    const res = await axios.get<UserListResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      params: { page, limit, role },
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch users", err);
    return {
      users: [],
      pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 },
    };
  }
}

export default function useUsers(page = 1, limit = 10, role?: string) {
  return useQuery({
    queryKey: ["users", page, limit, role],
    queryFn: () => getUsers(page, limit, role),
    staleTime: 1000 * 60 * 10, // cache 10 phút
    retry: 2,
  });
}
