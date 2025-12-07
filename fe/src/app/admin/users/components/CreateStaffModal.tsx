import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateStaff } from "../hooks/useUserMutations";
import { useTheaters } from "@/lib/api/theaters";
import { useNotification } from "@/providers/NotificationProvider";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

const createStaffSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  assignedTheater: z.string().min(1, "Vui lòng chọn rạp"),
});

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

interface CreateStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStaffModal({ open, onOpenChange }: CreateStaffModalProps) {
  const { showSuccess, showError } = useNotification();
  const createStaffMutation = useCreateStaff();
  
  // Fetch theaters
  const { data: theatersData, isLoading: isLoadingTheaters } = useTheaters({limit: 100});
  const theaters = useMemo(() => theatersData?.theaters || [], [theatersData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
  });

  const onSubmit = async (data: CreateStaffFormData) => {
    try {
      await createStaffMutation.mutateAsync(data);
      showSuccess("Tạo tài khoản nhân viên thành công!");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      showError("Lỗi!", error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-gray-900 min-w-fit min-h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tạo Tài Khoản Nhân Viên</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="staff@cinema.com"
              className={`${errors.email ? "border-red-500" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className={`${errors.password ? "border-red-500" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              className={`${errors.fullName ? "border-red-500" : ""}`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              placeholder="0901234567"
              className={`${errors.phoneNumber ? "border-red-500" : ""}`}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Assigned Theater */}
          <div className="space-y-2">
            <Label htmlFor="assignedTheater" className="text-sm font-medium">
              Rạp được phân công <span className="text-red-500">*</span>
            </Label>
            {isLoadingTheaters ? (
              <div className="flex items-center justify-center py-2 border rounded-xl bg-gray-50">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Đang tải rạp...</span>
              </div>
            ) : theaters.length === 0 ? (
              <div className="py-2 px-3 border rounded-xl bg-yellow-50 text-yellow-700 text-sm">
                Không có rạp chiếu phim nào
              </div>
            ) : (
              <Controller
                name="assignedTheater"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger 
                      className={`rounded-xl ${errors.assignedTheater ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Chọn rạp chiếu phim" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {theaters.map((theater) => (
                        <SelectItem key={theater._id} value={theater._id}>
                          {theater.name} - {theater.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.assignedTheater && (
              <p className="text-red-500 text-sm">{errors.assignedTheater.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}