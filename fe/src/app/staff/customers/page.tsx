'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, AlertCircle, Send, CheckCircle, Phone, Mail, MessageSquare } from 'lucide-react'

export default function Customers() {
  const [formData, setFormData] = useState({
    tenKhach: '',
    soDienThoai: '',
    email: '',
    loaiVanDe: '',
    mucDoUuTien: '',
    noiDung: '',
  })
  const [daGui, setDaGui] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDaGui(true)
    setTimeout(() => {
      setDaGui(false)
      setFormData({
        tenKhach: '',
        soDienThoai: '',
        email: '',
        loaiVanDe: '',
        mucDoUuTien: '',
        noiDung: '',
      })
    }, 3000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-foreground">Quản lý khách hàng</h2>
        <p className="text-muted-foreground mt-1">Hỗ trợ và ghi nhận khiếu nại từ khách hàng</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Form khiếu nại */}
        <Card className="col-span-2 p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground">Form hỗ trợ khiếu nại</h3>
              <p className="text-sm text-muted-foreground">
                Ghi nhận thông tin phản ánh từ khách hàng
              </p>
            </div>
          </div>

          {daGui ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-chart-3/10 rounded-[10px] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-chart-3" />
              </div>
              <h3 className="text-foreground mb-2">Đã gửi báo cáo thành công!</h3>
              <p className="text-muted-foreground">
                Báo cáo đã được ghi nhận và chuyển đến bộ phận xử lý
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Thông tin khách hàng */}
              <div className="space-y-4 p-4 bg-secondary rounded-[10px]">
                <h4 className="text-foreground">Thông tin khách hàng</h4>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Tên khách hàng *
                  </label>
                  <Input
                    value={formData.tenKhach}
                    onChange={e => setFormData({ ...formData, tenKhach: e.target.value })}
                    placeholder="Nhập tên khách hàng"
                    className="rounded-[10px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.soDienThoai}
                        onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })}
                        placeholder="0123456789"
                        className="pl-10 rounded-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="pl-10 rounded-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin vấn đề */}
              <div className="space-y-4">
                <h4 className="text-foreground">Thông tin vấn đề</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Loại vấn đề *
                    </label>
                    <Select
                      value={formData.loaiVanDe}
                      onValueChange={value => setFormData({ ...formData, loaiVanDe: value })}
                    >
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue placeholder="-- Chọn loại vấn đề --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ve">Vấn đề về vé</SelectItem>
                        <SelectItem value="ghe">Vấn đề về ghế ngồi</SelectItem>
                        <SelectItem value="phong-chieu">
                          Phòng chiếu (âm thanh, hình ảnh)
                        </SelectItem>
                        <SelectItem value="dich-vu">Dịch vụ khách hàng</SelectItem>
                        <SelectItem value="ve-sinh">Vệ sinh</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Mức độ ưu tiên *
                    </label>
                    <Select
                      value={formData.mucDoUuTien}
                      onValueChange={value => setFormData({ ...formData, mucDoUuTien: value })}
                    >
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue placeholder="-- Chọn mức độ --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thap">Thấp</SelectItem>
                        <SelectItem value="trung-binh">Trung bình</SelectItem>
                        <SelectItem value="cao">Cao</SelectItem>
                        <SelectItem value="khan-cap">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Nội dung phản ánh *
                  </label>
                  <Textarea
                    value={formData.noiDung}
                    onChange={e => setFormData({ ...formData, noiDung: e.target.value })}
                    placeholder="Mô tả chi tiết vấn đề khách hàng gặp phải..."
                    className="rounded-[10px]"
                    rows={6}
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-[10px] shadow-md shadow-primary/20"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi báo cáo sự cố
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[10px]"
                  onClick={() =>
                    setFormData({
                      tenKhach: '',
                      soDienThoai: '',
                      email: '',
                      loaiVanDe: '',
                      mucDoUuTien: '',
                      noiDung: '',
                    })
                  }
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Hướng dẫn & Thống kê */}
        <div className="space-y-6">
          {/* Hướng dẫn */}
          <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-[10px] flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-foreground">Hướng dẫn</h3>
            </div>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Ghi nhận đầy đủ thông tin khách hàng</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Chọn đúng loại vấn đề và mức độ ưu tiên</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Mô tả chi tiết tình huống</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Giữ thái độ lịch sự và chuyên nghiệp</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Cố gắng giải quyết ngay nếu có thể</span>
              </li>
            </ul>
          </Card>

          {/* Thống kê hôm nay */}
          <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground">Thống kê hôm nay</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-[10px]">
                <span className="text-sm text-muted-foreground">Khách phục vụ</span>
                <span className="text-primary font-semibold">342 khách</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-chart-3/10 rounded-[10px]">
                <span className="text-sm text-muted-foreground">Phản ánh tích cực</span>
                <span className="text-chart-3 font-semibold">28 lượt</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/10 rounded-[10px]">
                <span className="text-sm text-muted-foreground">Khiếu nại đã xử lý</span>
                <span className="text-accent font-semibold">5 vấn đề</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-[10px]">
                <span className="text-sm text-muted-foreground">Chờ xử lý</span>
                <span className="text-destructive font-semibold">2 vấn đề</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
