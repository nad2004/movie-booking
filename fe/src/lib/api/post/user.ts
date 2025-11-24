import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

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