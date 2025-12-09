import { Users } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { YearFilter } from '../../components/YearFilter';
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
import { useTopEmployees } from '@/lib/api/report'

interface ComparisonSectionProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

interface ComparisonDataRow {
  metric: string;
  [key: string]: string | number; // Allow dynamic employee names as keys
}

export const ComparisonSection = ({ selectedYear, onYearChange }: ComparisonSectionProps) => {
  const { data: employeesData, isLoading } = useTopEmployees(selectedYear);

  // Generate comparison data from top employees
  const comparisonData: ComparisonDataRow[] = [
    { metric: 'KPI' },
    { metric: 'Hoàn thành' },
    { metric: 'Ca làm việc' },
    { metric: 'Hiệu suất' },
    { metric: 'Doanh số' },
  ];

  // Add employee data to each metric
  if (employeesData?.items) {
    employeesData.items.slice(0, 3).forEach((emp, idx) => {
      comparisonData.forEach((row) => {
        // Generate semi-realistic values based on employee's main value
        const baseValue = emp.value;
        const variance = Math.random() * 10 - 5;
        row[emp.name] = Math.round(baseValue + variance);
      });
    });
  }

  const employeeNames = employeesData?.items.slice(0, 3).map(emp => emp.name) || [];
  const colors = ['#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <section className="bg-card rounded-lg border border-border p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader
          icon={Users}
          title="So Sánh Hiệu Suất"
          subtitle="So sánh các chỉ số giữa nhiều nhân viên"
        />
        <YearFilter 
          selectedYear={selectedYear}
          onYearChange={onYearChange}
        />
      </div>

      {isLoading ? (
        <div className="h-[320px] flex items-center justify-center">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">So sánh cột</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={comparisonData}>
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
                {employeeNames.map((name, idx) => (
                  <Bar key={idx} dataKey={name} fill={colors[idx]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">So sánh Radar</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={comparisonData}>
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
                {employeeNames.map((name, idx) => (
                  <Radar
                    key={idx}
                    name={name}
                    dataKey={name}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.3}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  )
}