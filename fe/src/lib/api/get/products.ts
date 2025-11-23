import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { ProductsResponse } from "@/types/product"; // Import type từ file bạn gửi

// Định nghĩa Params lọc (nếu cần mở rộng sau này)
export interface GetProductsParams {
  category?: "Popcorn" | "Drink" | "Combo" | "Snack";
  limit?: number;
  page?: number;
}



export async function getProducts(params: GetProductsParams = {}) {
  try {
    const res = await api.get<ProductsResponse>("/products", {
      params, // axios tự build query string
    });
    
    // Trả về data (là mảng Product[])
    return res.data.data; 
  } catch (error) {
    console.error("Failed to fetch products", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
}

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 30, // Cache 30 phút (vì giá ít thay đổi)
    retry: 2,
  });
}