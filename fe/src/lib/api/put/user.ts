import { api } from "@/lib/api/axios";


// Interface cho body request (theo ảnh Swagger)
export interface UpdateProfileDTO {
  fullName?: string;
  phoneNumber?: string;
  // Thêm các trường khác nếu backend hỗ trợ sau này (vd: dateOfBirth)
}

export async function updateProfileApi(data: UpdateProfileDTO) {
  // Gọi PUT /users/profile
  const res = await api.put("/users/profile", data);
  return res.data;
}
