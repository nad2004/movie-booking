'use client'
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Film, Clock, MapPin, Armchair, CheckCircle2, XCircle, ScanLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ConfirmTicket() {
  const [maVe, setMaVe] = useState('');
  const [thongTinVe, setThongTinVe] = useState<any>(null);

  const handleQuetVe = () => {
    // Giả lập quét mã vé
    const veGiaLap = {
      maVe: 'VE' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      tenPhim: 'Avatar: The Way of Water',
      ngayChieu: '15/11/2025',
      gioChieu: '19:00',
      phongChieu: 'Phòng 3',
      ghe: ['C5', 'C6'],
      trangThai: Math.random() > 0.3 ? 'hop-le' : 'het-han',
      tenKhach: 'Nguyễn Thị Minh',
      soLuong: 2,
      tongTien: 170000,
    };
    setThongTinVe(veGiaLap);
  };

  const handleXacNhanVaoRap = () => {
    alert('Đã xác nhận khách vào rạp!');
    setThongTinVe(null);
    setMaVe('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-foreground">Kiểm tra & Xác nhận vé</h2>
        <p className="text-muted-foreground mt-1">Quét mã vé điện tử và xác nhận khách vào rạp</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Quét mã vé */}
        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground">Quét mã QR</h3>
              <p className="text-sm text-muted-foreground">Quét mã vé của khách hàng</p>
            </div>
          </div>

          {/* Vùng quét QR giả lập */}
          <div className="mb-6">
            <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-[10px] flex flex-col items-center justify-center border-2 border-dashed border-primary/30">
              <ScanLine className="w-16 h-16 text-primary/60 mb-4 animate-pulse" />
              <p className="text-foreground mb-2 font-medium">Hướng mã QR vào camera</p>
              <p className="text-sm text-muted-foreground">hoặc nhập mã thủ công bên dưới</p>
            </div>
          </div>

          {/* Nhập mã thủ công */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Hoặc nhập mã vé:</label>
            <Input
              value={maVe}
              onChange={(e) => setMaVe(e.target.value)}
              placeholder="Nhập mã vé (VD: VE123456789)"
              className="rounded-[10px]"
            />
            <Button 
              onClick={handleQuetVe}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-[10px] shadow-md shadow-primary/20"
            >
              Kiểm tra vé
            </Button>
          </div>
        </Card>

        {/* Thông tin vé */}
        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground">Thông tin vé</h3>
              <p className="text-sm text-muted-foreground">Chi tiết vé điện tử</p>
            </div>
          </div>

          {!thongTinVe ? (
            <div className="py-12 text-center">
              <QrCode className="w-16 h-16 text-muted mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có thông tin vé</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Vui lòng quét mã QR hoặc nhập mã vé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Trạng thái vé */}
              <div className={`p-4 rounded-[10px] flex items-center gap-3 ${
                thongTinVe.trangThai === 'hop-le'
                  ? 'bg-chart-3/10 border border-chart-3/20'
                  : 'bg-destructive/10 border border-destructive/20'
              }`}>
                {thongTinVe.trangThai === 'hop-le' ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-chart-3" />
                    <div>
                      <p className="text-foreground font-semibold">Vé hợp lệ</p>
                      <p className="text-sm text-muted-foreground">Có thể vào rạp</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-destructive" />
                    <div>
                      <p className="text-foreground font-semibold">Vé không hợp lệ</p>
                      <p className="text-sm text-muted-foreground">Hết hạn hoặc đã sử dụng</p>
                    </div>
                  </>
                )}
              </div>

              {/* Thông tin chi tiết */}
              <div className="space-y-3 p-4 bg-secondary rounded-[10px]">
                <div className="flex items-start gap-3">
                  <Film className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Tên phim</p>
                    <p className="text-foreground font-medium">{thongTinVe.tenPhim}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Thời gian chiếu</p>
                    <p className="text-foreground font-medium">{thongTinVe.gioChieu} - {thongTinVe.ngayChieu}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phòng chiếu</p>
                    <p className="text-foreground font-medium">{thongTinVe.phongChieu}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Armchair className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Ghế ngồi</p>
                    <div className="flex gap-2 mt-1">
                      {thongTinVe.ghe.map((ghe: string) => (
                        <Badge key={ghe} variant="outline" className="rounded-[6px]">{ghe}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin khách */}
              <div className="p-4 bg-primary/5 rounded-[10px] border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Tên khách hàng</p>
                <p className="text-foreground font-semibold">{thongTinVe.tenKhach}</p>
                <div className="flex justify-between mt-3 pt-3 border-t border-primary/20">
                  <span className="text-sm text-muted-foreground">Mã vé:</span>
                  <span className="text-foreground font-medium">{thongTinVe.maVe}</span>
                </div>
              </div>

              {/* Button xác nhận */}
              {thongTinVe.trangThai === 'hop-le' && (
                <Button 
                  onClick={handleXacNhanVaoRap}
                  className="w-full bg-chart-3 hover:bg-chart-3/90 text-white rounded-[10px] shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Xác nhận vào rạp
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Vé đã kiểm tra hôm nay</p>
              <p className="text-foreground font-semibold mt-1">245 vé</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Vé hợp lệ</p>
              <p className="text-chart-3 font-semibold mt-1">238 vé</p>
            </div>
            <div className="w-12 h-12 bg-chart-3/10 rounded-[10px] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-chart-3" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Vé không hợp lệ</p>
              <p className="text-destructive font-semibold mt-1">7 vé</p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-[10px] flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}