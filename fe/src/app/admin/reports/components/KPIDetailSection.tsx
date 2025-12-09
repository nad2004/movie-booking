import { MOCK_DATA } from '../page'
import { SectionHeader } from './SectionHeader'
import { Target, Activity, BarChart3, CheckCircle2, Calendar } from 'lucide-react'
import { KPIMetricCard } from './KPIMetricCard'
export const KPIDetailSection = ({
  selectedEmployee,
  setSelectedEmployee,
  isCalculating,
  calculateKPI,
}: {
  selectedEmployee: number
  setSelectedEmployee: (id: number) => void
  isCalculating: boolean
  calculateKPI: () => void
}) => {
  const currentKPI = MOCK_DATA.kpiData[selectedEmployee as keyof typeof MOCK_DATA.kpiData]

  return (
    <section className="bg-card rounded-lg border border-border p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <SectionHeader icon={Target} title="KPI Nhân Viên" />
        <button
          onClick={calculateKPI}
          disabled={isCalculating}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm whitespace-nowrap"
        >
          {isCalculating ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              Đang tính...
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4" />
              Calculate KPI
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Chọn nhân viên
          </label>
          <select
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(Number(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {MOCK_DATA.employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIMetricCard
            icon={Target}
            value={currentKPI.kpi}
            label="Điểm KPI"
            description="Tổng hợp từ các chỉ số"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <KPIMetricCard
            icon={CheckCircle2}
            value={`${currentKPI.completion}%`}
            label="Tỉ lệ hoàn thành"
            description="Nhiệm vụ được giao"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <KPIMetricCard
            icon={Calendar}
            value={currentKPI.shifts}
            label="Số ca làm việc"
            description="Trong tháng này"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <KPIMetricCard
            icon={Activity}
            value={`${currentKPI.performance}%`}
            label="Chỉ số hiệu suất"
            description="Đánh giá tổng thể"
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>
      </div>
    </section>
  )
}
