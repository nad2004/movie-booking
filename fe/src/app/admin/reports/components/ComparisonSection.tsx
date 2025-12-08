import { Users } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { MOCK_DATA } from "../page";

export const ComparisonSection = () => (
  <section className="bg-card rounded-lg border border-border p-6 mb-8">
    <SectionHeader
      icon={Users}
      title="So Sánh Hiệu Suất"
      subtitle="So sánh các chỉ số giữa nhiều nhân viên"
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">So sánh cột</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={MOCK_DATA.comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="metric" stroke="#6b7280" style={{ fontSize: '11px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="Nguyễn Văn An" fill="#3b82f6" />
            <Bar dataKey="Trần Thị Bình" fill="#8b5cf6" />
            <Bar dataKey="Lê Văn Cường" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">So sánh Radar</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={MOCK_DATA.comparisonData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" stroke="#6b7280" style={{ fontSize: '11px' }} />
            <PolarRadiusAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Radar
              name="Nguyễn Văn An"
              dataKey="Nguyễn Văn An"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Radar
              name="Trần Thị Bình"
              dataKey="Trần Thị Bình"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
            />
            <Radar
              name="Lê Văn Cường"
              dataKey="Lê Văn Cường"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </section>
)
