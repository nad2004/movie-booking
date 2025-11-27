'use client'
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Film, Clock, DoorOpen, Armchair, CreditCard, Banknote, QrCode, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const phimList = [
  { id: '1', ten: 'Avatar: The Way of Water', theLoai: 'Hành động, Phiêu lưu' },
  { id: '2', ten: 'Doraemon: Nobita Và Bản Giao Hưởng Địa Cầu', theLoai: 'Hoạt hình, Gia đình' },
  { id: '3', ten: 'Mai', theLoai: 'Tâm lý, Tình cảm' },
];

const suatChieuList = [
  { id: '1', gio: '10:00', phong: 'Phòng 1', ghe: 120, daChon: 45 },
  { id: '2', gio: '13:30', phong: 'Phòng 2', ghe: 100, daChon: 68 },
  { id: '3', gio: '16:00', phong: 'Phòng 1', ghe: 120, daChon: 23 },
  { id: '4', gio: '19:00', phong: 'Phòng 3', ghe: 150, daChon: 102 },
  { id: '5', gio: '21:30', phong: 'Phòng 2', ghe: 100, daChon: 34 },
];

const gheList = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8',
];

const gheDaChon = ['A2', 'A3', 'B5', 'C1', 'C2', 'D4', 'E7'];

export default function Sell() {
  const [phimChon, setPhimChon] = useState('');
  const [suatChon, setSuatChon] = useState('');
  const [gheChon, setGheChon] = useState<string[]>([]);
  const [phuongThucTT, setPhuongThucTT] = useState('tien-mat');

  const toggleGhe = (ghe: string) => {
    if (gheDaChon.includes(ghe)) return;
    
    if (gheChon.includes(ghe)) {
      setGheChon(gheChon.filter(g => g !== ghe));
    } else {
      setGheChon([...gheChon, ghe]);
    }
  };

  const giaVe = 85000;
  const tongTien = gheChon.length * giaVe;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Bán vé trực tiếp</h2>
          <p className="text-muted-foreground mt-1">Tạo đơn đặt vé tại quầy cho khách hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chọn phim và suất chiếu */}
        <div className="col-span-2 space-y-6">
          {/* Chọn phim */}
          <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground">Chọn phim</h3>
                <p className="text-sm text-muted-foreground">Chọn phim đang chiếu</p>
              </div>
            </div>
            
            <Select value={phimChon} onValueChange={setPhimChon}>
              <SelectTrigger className="rounded-[10px]">
                <SelectValue placeholder="-- Chọn phim --" />
              </SelectTrigger>
              <SelectContent>
                {phimList.map(phim => (
                  <SelectItem key={phim.id} value={phim.id}>
                    {phim.ten} ({phim.theLoai})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Chọn suất chiếu */}
          {phimChon && (
            <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-[10px] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-foreground">Chọn suất chiếu</h3>
                  <p className="text-sm text-muted-foreground">Chọn giờ và phòng chiếu</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {suatChieuList.map(suat => (
                  <button
                    key={suat.id}
                    onClick={() => setSuatChon(suat.id)}
                    className={`p-4 rounded-[10px] border-2 transition-all text-left ${
                      suatChon === suat.id
                        ? 'border-primary bg-card-hover'
                        : 'border-border hover:border-primary/50 hover:bg-card-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-medium">{suat.gio}</span>
                      <Badge variant="outline" className="rounded-[6px]">{suat.phong}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suat.daChon}/{suat.ghe} ghế đã đặt
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Chọn ghế */}
          {suatChon && (
            <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">Chọn ghế ngồi</h3>
                  <p className="text-sm text-muted-foreground">Chọn ghế cho khách hàng</p>
                </div>
              </div>

              {/* Màn hình */}
              <div className="mb-6">
                <div className="h-2 bg-gradient-to-b from-muted-foreground/50 to-muted-foreground/30 rounded-t-full mb-2"></div>
                <p className="text-center text-sm text-muted-foreground">Màn hình</p>
              </div>

              {/* Sơ đồ ghế */}
              <div className="space-y-2">
                {['A', 'B', 'C', 'D', 'E'].map(hang => (
                  <div key={hang} className="flex items-center gap-2">
                    <span className="w-8 text-center text-muted-foreground font-medium">{hang}</span>
                    <div className="flex gap-2 flex-1 justify-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(so => {
                        const ghe = `${hang}${so}`;
                        const daDat = gheDaChon.includes(ghe);
                        const dangChon = gheChon.includes(ghe);
                        
                        return (
                          <button
                            key={ghe}
                            onClick={() => toggleGhe(ghe)}
                            disabled={daDat}
                            className={`w-8 h-8 rounded-t-[8px] transition-all ${
                              daDat
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : dangChon
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                                : 'bg-chart-3 hover:bg-chart-3/80 text-white'
                            }`}
                          >
                            <Armchair className="w-4 h-4 mx-auto" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chú thích */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-chart-3 rounded-t-[6px]"></div>
                  <span className="text-sm text-muted-foreground">Còn trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-t-[6px]"></div>
                  <span className="text-sm text-muted-foreground">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted rounded-t-[6px]"></div>
                  <span className="text-sm text-muted-foreground">Đã đặt</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Tổng kết & thanh toán */}
        <div className="space-y-6">
          <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow sticky top-0">
            <h3 className="text-foreground mb-4">Tổng kết đơn hàng</h3>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phim:</span>
                <span className="text-foreground font-medium">
                  {phimChon ? phimList.find(p => p.id === phimChon)?.ten.substring(0, 15) + '...' : '--'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Suất chiếu:</span>
                <span className="text-foreground font-medium">
                  {suatChon ? suatChieuList.find(s => s.id === suatChon)?.gio : '--'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phòng:</span>
                <span className="text-foreground font-medium">
                  {suatChon ? suatChieuList.find(s => s.id === suatChon)?.phong : '--'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ghế:</span>
                <span className="text-foreground font-medium">
                  {gheChon.length > 0 ? gheChon.join(', ') : '--'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Số lượng:</span>
                <span className="text-foreground font-medium">{gheChon.length} vé</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 p-4 bg-primary/5 rounded-[10px]">
              <span className="text-foreground font-semibold">Tổng tiền:</span>
              <span className="text-primary font-bold">{tongTien.toLocaleString('vi-VN')}đ</span>
            </div>

            {/* Phương thức thanh toán */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-3 block">Phương thức thanh toán:</label>
              <div className="space-y-2">
                <button
                  onClick={() => setPhuongThucTT('tien-mat')}
                  className={`w-full p-3 rounded-[10px] border-2 flex items-center gap-3 transition-all ${
                    phuongThucTT === 'tien-mat'
                      ? 'border-primary bg-card-hover'
                      : 'border-border hover:border-primary/50 hover:bg-card-hover'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Tiền mặt</span>
                </button>
                <button
                  onClick={() => setPhuongThucTT('pos')}
                  className={`w-full p-3 rounded-[10px] border-2 flex items-center gap-3 transition-all ${
                    phuongThucTT === 'pos'
                      ? 'border-primary bg-card-hover'
                      : 'border-border hover:border-primary/50 hover:bg-card-hover'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-chart-4" />
                  <span className="text-foreground font-medium">POS / Thẻ</span>
                </button>
                <button
                  onClick={() => setPhuongThucTT('qr')}
                  className={`w-full p-3 rounded-[10px] border-2 flex items-center gap-3 transition-all ${
                    phuongThucTT === 'qr'
                      ? 'border-primary bg-card-hover'
                      : 'border-border hover:border-primary/50 hover:bg-card-hover'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">QR Code</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-[10px] shadow-md shadow-primary/20"
                disabled={gheChon.length === 0}
              >
                Xác nhận thanh toán
              </Button>
              <Button 
                variant="outline" 
                className="w-full rounded-[10px] border-primary text-primary hover:bg-card-hover"
                disabled={gheChon.length === 0}
              >
                <Printer className="w-4 h-4 mr-2" />
                In vé
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}