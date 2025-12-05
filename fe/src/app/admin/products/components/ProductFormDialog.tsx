import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, ProductCreateDTO } from "@/types/product";
import { useProductMutations } from "../hooks/useProductMutations";
import { Upload } from "lucide-react";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: Product | null;
}

export function ProductFormDialog({ open, onOpenChange, productToEdit }: ProductFormDialogProps) {
  const { createMutation, updateMutation, uploadImageMutation } = useProductMutations();
  const isEditMode = !!productToEdit;
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProductCreateDTO>({
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      category: "Popcorn",
      size: "M",
      description: "",
      imageUrl: "",
      inStock: true,
      stockQuantity: 0,
      lowStockThreshold: 10,
      featured: false,
      isActive: true,
      calories: 0,
      allergens: [],
      tags: [],
    }
  });

  useEffect(() => {
    if (productToEdit) {
      setValue("name", productToEdit.name);
      setValue("slug", productToEdit.slug);
      setValue("price", productToEdit.price);
      setValue("originalPrice", productToEdit.originalPrice || 0);
      setValue("discount", productToEdit.discount || 0);
      setValue("category", productToEdit.category);
      setValue("size", productToEdit.size);
      setValue("description", productToEdit.description || "");
      setValue("imageUrl", productToEdit.imageUrl || "");
      setValue("inStock", productToEdit.inStock);
      setValue("stockQuantity", productToEdit.stockQuantity || 0);
      setValue("lowStockThreshold", productToEdit.lowStockThreshold || 10);
      setValue("featured", productToEdit.featured || false);
      setValue("isActive", productToEdit.isActive);
      setValue("calories", productToEdit.calories || 0);
    } else {
      reset({
        name: "",
        slug: "",
        price: 0,
        originalPrice: 0,
        discount: 0,
        category: "Popcorn",
        size: "M",
        description: "",
        imageUrl: "",
        inStock: true,
        stockQuantity: 0,
        lowStockThreshold: 10,
        featured: false,
        isActive: true,
      });
    }
    setImageFile(null);
  }, [productToEdit, open, reset, setValue]);

  const onSubmit = async (data: ProductCreateDTO) => {
    try {
      if (isEditMode && productToEdit) {
        await updateMutation.mutateAsync({ id: productToEdit._id, data });
        
        // Upload image if file selected
        if (imageFile) {
          await uploadImageMutation.mutateAsync({ 
            productId: productToEdit._id, 
            imageFile 
          });
        }
        
        onOpenChange(false);
      } else {
        const result = await createMutation.mutateAsync(data);
        
        // Upload image after creating product
        if (imageFile && result?.data?._id) {
          await uploadImageMutation.mutateAsync({ 
            productId: result.data._id, 
            imageFile 
          });
        }
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || uploadImageMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50 text-gray-900">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Tên & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên sản phẩm *</Label>
                <Input {...register("name", { required: true })} placeholder="Bắp rang bơ lớn" />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input {...register("slug", { required: true })} placeholder="bap-rang-bo-lon" />
              </div>
            </div>

            {/* Category & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Danh mục *</Label>
                <Select 
                  onValueChange={(val: any) => setValue("category", val)} 
                  defaultValue={productToEdit?.category || "Popcorn"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Popcorn">Bắp rang</SelectItem>
                    <SelectItem value="Drink">Nước uống</SelectItem>
                    <SelectItem value="Combo">Combo</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Size</Label>
                <Select 
                  onValueChange={(val: any) => setValue("size", val)} 
                  defaultValue={productToEdit?.size || "M"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S - Small</SelectItem>
                    <SelectItem value="M">M - Medium</SelectItem>
                    <SelectItem value="L">L - Large</SelectItem>
                    <SelectItem value="XL">XL - Extra Large</SelectItem>
                    <SelectItem value="N/A">N/A - Không áp dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Giá bán (VNĐ) *</Label>
                <Input 
                  type="number" 
                  {...register("price", { valueAsNumber: true, required: true })} 
                  placeholder="50000"
                />
              </div>
              <div>
                <Label>Giá gốc (VNĐ)</Label>
                <Input 
                  type="number" 
                  {...register("originalPrice", { valueAsNumber: true })} 
                  placeholder="60000"
                />
              </div>
              <div>
                <Label>Giảm giá (%)</Label>
                <Input 
                  type="number" 
                  {...register("discount", { valueAsNumber: true, min: 0, max: 100 })} 
                  placeholder="20"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Số lượng tồn kho *</Label>
                <Input 
                  type="number" 
                  {...register("stockQuantity", { valueAsNumber: true, required: true })} 
                  placeholder="100"
                />
              </div>
              <div>
                <Label>Ngưỡng cảnh báo hết hàng</Label>
                <Input 
                  type="number" 
                  {...register("lowStockThreshold", { valueAsNumber: true })} 
                  placeholder="10"
                />
              </div>
            </div>

            {/* Nutrition */}
            <div>
              <Label>Calories (kcal)</Label>
              <Input 
                type="number" 
                {...register("calories", { valueAsNumber: true })} 
                placeholder="250"
              />
            </div>

            {/* Description */}
            <div>
              <Label>Mô tả</Label>
              <Textarea 
                {...register("description")} 
                placeholder="Nhập mô tả sản phẩm..." 
                className="h-20" 
              />
            </div>

            {/* Image */}
            <div>
              <Label>Image URL</Label>
              <Input {...register("imageUrl")} placeholder="https://example.com/popcorn.jpg" />
            </div>

            <div>
              <Label>Hoặc upload ảnh</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imageFile && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {imageFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inStock"
                  checked={watch("inStock")}
                  onCheckedChange={(checked) => setValue("inStock", checked as boolean)}
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  Còn hàng
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured"
                  checked={watch("featured")}
                  onCheckedChange={(checked) => setValue("featured", checked as boolean)}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Sản phẩm nổi bật
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked as boolean)}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Đang hoạt động
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="default" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} variant='default'>
              {isLoading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}