import { api } from '@/lib/api/axios';
import { CreateBookingRequest, CreateBookingResponse } from '@/types/booking';

export const createBookingApi = async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
  const response = await api.post<CreateBookingResponse>('/bookings', data);
  return response.data;
};