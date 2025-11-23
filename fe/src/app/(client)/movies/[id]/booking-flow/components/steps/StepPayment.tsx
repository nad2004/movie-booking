import { Wallet, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface StepPaymentProps {
  paymentUrl: string;
  bookingCode?: string;
  totalAmount: number;
}

export function StepPayment({ paymentUrl, bookingCode, totalAmount }: StepPaymentProps) {
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast.success("Đã sao chép liên kết thanh toán");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="mb-6 text-text-primary text-xl font-bold">Thanh toán đơn hàng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột trái: Thông tin & Hướng dẫn */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 text-sm">
            <div className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold mb-1">Đơn hàng đã được tạo!</p>
                <p>Vui lòng thanh toán trong vòng <strong>10 phút</strong> để giữ ghế.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-surface border border-border rounded-xl">
              <span className="text-text-secondary">Mã đơn hàng</span>
              <span className="font-mono font-bold text-lg text-text-primary">{bookingCode || '...'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-surface border border-border rounded-xl">
              <span className="text-text-secondary">Số tiền cần thanh toán</span>
              <span className="font-bold text-xl text-primary">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-primary">Phương thức thanh toán:</p>
            <div className="flex items-center gap-3 p-3 border-2 border-primary bg-primary/5 rounded-xl">
              <Wallet className="w-6 h-6 text-primary" />
              <span className="font-semibold text-primary">Cổng thanh toán VNPAY</span>
            </div>
          </div>
        </div>

        {/* Cột phải: QR Code & Action */}
        <div className="flex flex-col items-center justify-center bg-bg-primary p-6 rounded-2xl border border-border shadow-sm">
          <p className="text-sm text-text-secondary mb-4 text-center">Quét mã bên dưới để thanh toán nhanh</p>
          
          {/* QR Code generated from Payment URL */}
          <div className="relative w-48 h-48 mb-6 group">
            {paymentUrl ? (
              // Dùng API QR Server để tạo QR từ link VNPAY (An toàn, không cần thư viện)
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentUrl)}`}
                alt="Payment QR Code"
                className="w-full h-full object-contain rounded-lg border border-gray-100"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-400">
                Loading QR...
              </div>
            )}
          </div>

          <div className="w-full space-y-3">
            {paymentUrl ? (
              <Button 
                asChild
                className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
              >
                <Link href={paymentUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Mở trang thanh toán VNPAY
                </Link>
              </Button>
            ) : (
              <Button disabled className="w-full h-12">Đang tạo link...</Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleCopyUrl}
              disabled={!paymentUrl}
              className="w-full border-border text-text-secondary hover:bg-bg-secondary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Sao chép liên kết
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}