import {
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SectionHeader } from './SectionHeader';
import { MOCK_DATA } from "../page";

export const TrendsSection = () => (
  <section className="bg-card rounded-lg border border-border p-6 mb-8">
    <SectionHeader 
      icon={TrendingUp} 
      title="Xu Hướng Hiệu Suất" 
      subtitle="Theo dõi sự thay đổi theo thời gian"
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Hiệu suất Nhân viên & Rạp
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={MOCK_DATA.trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="nhanVien"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Nhân viên"
            />
            <Line
              type="monotone"
              dataKey="rap"
              stroke="#10b981"
              strokeWidth={2}
              name="Rạp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Doanh thu & Lượt xem
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={MOCK_DATA.trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="doanhThu" fill="#8b5cf6" name="Doanh thu (x1000)" />
            <Bar dataKey="luotXem" fill="#f59e0b" name="Lượt xem" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </section>
);