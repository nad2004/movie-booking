import { Wallet, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface StepPaymentMethodProps {
  selectedMethod: 'vnpay' | 'momo' | null
  onSelect: (method: 'vnpay' | 'momo') => void
}

export function StepPaymentMethod({ selectedMethod, onSelect }: StepPaymentMethodProps) {
  const paymentMethods = [
    {
      id: 'vnpay' as const,
      name: 'VNPAY',
      description: 'Thanh toán qua cổng VNPAY',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      logo: '/vnpay-logo.png', // Thay bằng path logo thực tế
    },
    {
      id: 'momo' as const,
      name: 'MoMo',
      description: 'Thanh toán qua ví MoMo',
      icon: <Wallet className="w-8 h-8" />,
      color: 'from-pink-500 to-pink-600',
      logo: '/momo-logo.png', // Thay bằng path logo thực tế
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="mb-6 text-text-primary text-xl font-bold">Chọn phương thức thanh toán</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {paymentMethods.map(method => {
          const isSelected = selectedMethod === method.id

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`relative bg-surface rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/30 hover:bg-bg-secondary hover:scale-102'
              }`}
            >
              {/* Checkmark khi được chọn */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}

              {/* Icon/Logo */}
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mb-4 shadow-lg`}
              >
                {method.icon}
              </div>

              {/* Tên phương thức */}
              <h3 className="text-text-primary font-bold text-xl mb-2">{method.name}</h3>

              {/* Mô tả */}
              <p className="text-text-secondary text-sm">{method.description}</p>

              {/* Features */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bảo mật cao</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Thanh toán nhanh chóng</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Thông tin bổ sung */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm max-w-3xl mx-auto">
        <div className="flex gap-2">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold mb-1">Lưu ý thanh toán</p>
            <p>
              Vui lòng hoàn tất thanh toán trong vòng <strong>10 phút</strong> để giữ chỗ. Sau thời
              gian này, ghế của bạn sẽ được tự động hủy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
