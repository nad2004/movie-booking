import { api } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

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



export async function uploadAvatarApi(file: File) {
  const formData = new FormData();
  formData.append("avatar", file); // Tên field 'avatar' phải khớp với ảnh Postman

  const res = await api.post("/users/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}