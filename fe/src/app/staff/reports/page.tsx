'use client'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, DollarSign, Ticket, Target, Download, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Dữ liệu biểu đồ
const doanhThuTheoNgay = [
  { ngay: 'T2', doanhThu: 15200000 },
  { ngay: 'T3', doanhThu: 18500000 },
  { ngay: 'T4', doanhThu: 12800000 },
  { ngay: 'T5', doanhThu: 21300000 },
  { ngay: 'T6', doanhThu: 28900000 },
  { ngay: 'T7', doanhThu: 35600000 },
  { ngay: 'CN', doanhThu: 42100000 },
];

const veTheoGio = [
  { gio: '8h', soLuong: 12 },
  { gio: '10h', soLuong: 28 },
  { gio: '12h', soLuong: 45 },
  { gio: '14h', soLuong: 52 },
  { gio: '16h', soLuong: 68 },
  { gio: '18h', soLuong: 85 },
  { gio: '20h', soLuong: 92 },
  { gio: '22h', soLuong: 56 },
];

const phanLoaiVe = [
  { ten: 'Vé thường', giaTri: 45 },
  { ten: 'Vé VIP', giaTri: 30 },
  { ten: 'Vé cặp đôi', giaTri: 15 },
  { ten: 'Vé nhóm', giaTri: 10 },
];

const COLORS = ['#6C63FF', '#F9B233', '#10B981', '#3B82F6'];

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Báo cáo & KPI</h2>
          <p className="text-muted-foreground mt-1">Thống kê hiệu suất và doanh thu cá nhân</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-[10px]">
            <Calendar className="w-4 h-4 mr-2" />
            Hôm nay: 15/11/2025
          </Button>
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[10px] shadow-md shadow-primary/20">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/10 rounded-[6px]">+12%</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Vé đã bán</p>
          <p className="text-foreground font-semibold mt-1">245 vé</p>
          <p className="text-xs text-muted-foreground/70 mt-2">Mục tiêu: 280 vé</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{width: '87.5%'}}></div>
          </div>
        </Card>

        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-chart-3/10 rounded-[10px] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-chart-3" />
            </div>
            <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/10 rounded-[6px]">+18%</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Doanh thu</p>
          <p className="text-foreground font-semibold mt-1">21.8M VNĐ</p>
          <p className="text-xs text-muted-foreground/70 mt-2">Mục tiêu: 25M VNĐ</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-chart-3 rounded-full" style={{width: '87.2%'}}></div>
          </div>
        </Card>

        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-chart-5/10 rounded-[10px] flex items-center justify-center">
              <Users className="w-6 h-6 text-chart-5" />
            </div>
            <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/10 rounded-[6px]">+8%</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Khách phục vụ</p>
          <p className="text-foreground font-semibold mt-1">342 khách</p>
          <p className="text-xs text-muted-foreground/70 mt-2">Mục tiêu: 400 khách</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-chart-5 rounded-full" style={{width: '85.5%'}}></div>
          </div>
        </Card>

        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-[10px] flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/10 rounded-[6px]">Đạt</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Tỷ lệ hoàn thành</p>
          <p className="text-foreground font-semibold mt-1">86.7%</p>
          <p className="text-xs text-muted-foreground/70 mt-2">Trung bình: 82%</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{width: '86.7%'}}></div>
          </div>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-3 gap-6">
        {/* Doanh thu theo ngày */}
        <Card className="col-span-2 p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground">Doanh thu 7 ngày qua</h3>
                <p className="text-sm text-muted-foreground">Theo dõi doanh số hằng ngày</p>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={doanhThuTheoNgay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="ngay" stroke="#8A8A8A" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8A8A8A" tickFormatter={(value) => `${value / 1000000}M`} style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value) => `${(value as number).toLocaleString('vi-VN')}đ`}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="doanhThu" fill="#6C63FF" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Phân loại vé */}
        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground">Phân loại vé</h3>
              <p className="text-sm text-muted-foreground">Tỷ lệ loại vé bán ra</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={phanLoaiVe}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="giaTri"
                label={({ giaTri }) => `${giaTri}%`}
              >
                {phanLoaiVe.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5', 
                  borderRadius: '10px' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-2 mt-4">
            {phanLoaiVe.map((item, index) => (
              <div key={item.ten} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-muted-foreground">{item.ten}</span>
                </div>
                <span className="text-foreground font-medium">{item.giaTri}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Vé bán theo giờ */}
      <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground">Vé bán theo khung giờ</h3>
            <p className="text-sm text-muted-foreground">Phân tích hiệu suất bán vé theo giờ trong ngày</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={veTheoGio}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="gio" stroke="#8A8A8A" style={{ fontSize: '12px' }} />
            <YAxis stroke="#8A8A8A" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E5E5', 
                borderRadius: '10px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="soLuong" 
              stroke="#6C63FF" 
              strokeWidth={3} 
              dot={{ fill: '#6C63FF', r: 5 }} 
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Báo cáo chi tiết */}
      <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground">Báo cáo hoạt động hôm nay</h3>
              <p className="text-sm text-muted-foreground">Tổng hợp các chỉ số quan trọng</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[10px] shadow-md shadow-primary/20">
            <Download className="w-4 h-4 mr-2" />
            Gửi báo cáo cuối ca
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-primary/5 rounded-[10px] border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Tổng số vé bán</p>
            <p className="text-foreground font-semibold mb-2">245 vé</p>
            <p className="text-xs text-chart-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              12% so với hôm qua
            </p>
          </div>

          <div className="p-4 bg-chart-3/5 rounded-[10px] border border-chart-3/20">
            <p className="text-sm text-muted-foreground mb-1">Tổng doanh thu</p>
            <p className="text-foreground font-semibold mb-2">21,845,000đ</p>
            <p className="text-xs text-chart-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              18% so với hôm qua
            </p>
          </div>

          <div className="p-4 bg-accent/5 rounded-[10px] border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Sự cố ghi nhận</p>
            <p className="text-foreground font-semibold mb-2">7 vấn đề</p>
            <p className="text-xs text-muted-foreground">5 đã xử lý, 2 chờ xử lý</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-secondary rounded-[10px]">
          <h4 className="text-foreground mb-3">Ghi chú cuối ca</h4>
          <textarea
            className="w-full p-3 border border-border rounded-[10px] resize-none bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            placeholder="Nhập ghi chú về ca làm việc, các vấn đề đặc biệt..."
          />
        </div>
      </Card>
    </div>
  );
}