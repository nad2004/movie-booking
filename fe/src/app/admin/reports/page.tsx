'use client'
import { useState } from 'react'
import { TopPerformersSection } from './components/TopPerformersSection'
import { KPIDetailSection } from './components/KPIDetailSection'
import { TrendsSection } from './components/TrendsSection'
import { ComparisonSection } from './components/ComparisonSection'
import { AlertsSection } from './components/AlertsSection'

export interface TopPerformer {
  id: number
  name: string
  value: number
  subValue: number
  trend: 'up' | 'down'
}

interface KPIData {
  kpi: number
  completion: number
  shifts: number
  performance: number
}

export interface Alert {
  id: number
  type: 'warning' | 'danger' | 'info'
  title: string
  description: string
  time: string
}

// Mock Data (keep for KPI section and alerts)
export const MOCK_DATA = {
  employees: [
    { id: 1, name: 'Nguyễn Văn An' },
    { id: 2, name: 'Trần Thị Bình' },
    { id: 3, name: 'Lê Văn Cường' },
    { id: 4, name: 'Phạm Thị Dung' },
    { id: 5, name: 'Hoàng Văn Em' },
  ],
  kpiData: {
    1: { kpi: 95, completion: 92, shifts: 28, performance: 94 },
    2: { kpi: 92, completion: 88, shifts: 26, performance: 90 },
    3: { kpi: 88, completion: 85, shifts: 25, performance: 87 },
    4: { kpi: 82, completion: 80, shifts: 24, performance: 83 },
    5: { kpi: 78, completion: 75, shifts: 22, performance: 79 },
  },
  alerts: [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Giảm hiệu suất đột ngột',
      description: 'Lê Văn Cường: Hiệu suất giảm 12% trong 7 ngày qua',
      time: '2 giờ trước',
    },
    {
      id: 2,
      type: 'danger' as const,
      title: 'KPI dưới ngưỡng',
      description: 'Hoàng Văn Em: KPI đạt 78/100 (ngưỡng: 80)',
      time: '5 giờ trước',
    },
    {
      id: 3,
      type: 'warning' as const,
      title: 'Ca làm việc bất thường',
      description: 'Phạm Thị Dung: Vắng mặt 3/5 ca làm việc tuần này',
      time: '1 ngày trước',
    },
    {
      id: 4,
      type: 'info' as const,
      title: 'Xu hướng tích cực',
      description: 'Nguyễn Văn An: Tăng 8% hiệu suất trong tháng',
      time: '2 ngày trước',
    },
  ],
}

// Main Component
export default function Performance() {
  const currentYear = new Date().getFullYear()
  const [selectedEmployee, setSelectedEmployee] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)

  // Year states for different sections
  const [topPerformersYear, setTopPerformersYear] = useState(currentYear)
  const [trendsYear, setTrendsYear] = useState(currentYear)
  const [comparisonYear, setComparisonYear] = useState(currentYear)

  const calculateKPI = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      alert('KPI đã được tính toán và cập nhật thành công!')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hiệu Suất & KPI</h1>
          <p className="text-muted-foreground">
            Theo dõi và đánh giá hiệu suất làm việc, KPI nhân viên và xu hướng kinh doanh
          </p>
        </div>

        <TopPerformersSection
          selectedYear={topPerformersYear}
          onYearChange={setTopPerformersYear}
        />

        <KPIDetailSection
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          isCalculating={isCalculating}
          calculateKPI={calculateKPI}
        />

        <TrendsSection selectedYear={trendsYear} onYearChange={setTrendsYear} />

        <ComparisonSection selectedYear={comparisonYear} onYearChange={setComparisonYear} />

        <AlertsSection />
      </div>
    </div>
  )
}
