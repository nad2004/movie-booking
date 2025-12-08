'use client'
import { useState, useCallback } from 'react';
import { TopPerformersSection } from './components/TopPerformersSection';
import { KPIDetailSection } from './components/KPIDetailSection';
import { TrendsSection } from './components/TrendsSection';
import { ComparisonSection } from './components/ComparisonSection';
import { AlertsSection } from './components/AlertsSection';

export interface TopPerformer {
  id: number;
  name: string;
  value: number;
  subValue: number;
  trend: 'up' | 'down';
}

interface KPIData {
  kpi: number;
  completion: number;
  shifts: number;
  performance: number;
}
export interface Alert {
  id: number;
  type: 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  time: string;
}


// Custom Hooks
const useKPICalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateKPI = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      alert('KPI đã được tính toán và cập nhật thành công!');
    }, 1500);
  }, []);

  return { isCalculating, calculateKPI };
};

const useEmployeeSelection = (initialId: number = 1) => {
  const [selectedEmployee, setSelectedEmployee] = useState(initialId);
  return { selectedEmployee, setSelectedEmployee };
};

// Mock Data
export const MOCK_DATA = {
  topPerformers: {
    employees: [
      { id: 1, name: 'Nguyễn Văn An', value: 95, subValue: 1250000, trend: 'up' as const },
      { id: 2, name: 'Trần Thị Bình', value: 92, subValue: 1180000, trend: 'up' as const },
      { id: 3, name: 'Lê Văn Cường', value: 88, subValue: 1050000, trend: 'down' as const },
    ],
    movies: [
      { id: 1, name: 'Avatar: The Way of Water', value: 5200000, subValue: 8500, trend: 'up' as const },
      { id: 2, name: 'Avengers: Endgame', value: 4800000, subValue: 7800, trend: 'up' as const },
      { id: 3, name: 'The Dark Knight', value: 4200000, subValue: 6900, trend: 'down' as const },
    ],
    theaters: [
      { id: 1, name: 'Rạp Trung tâm', value: 94, subValue: 8500000, trend: 'up' as const },
      { id: 2, name: 'Rạp Quận 1', value: 89, subValue: 7200000, trend: 'up' as const },
      { id: 3, name: 'Rạp Quận 7', value: 85, subValue: 6800000, trend: 'down' as const },
    ],
  },
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
  trendData: [
    { month: 'T1', nhanVien: 85, rap: 88, doanhThu: 4200, luotXem: 6800 },
    { month: 'T2', nhanVien: 87, rap: 89, doanhThu: 4500, luotXem: 7200 },
    { month: 'T3', nhanVien: 89, rap: 91, doanhThu: 4800, luotXem: 7600 },
    { month: 'T4', nhanVien: 91, rap: 90, doanhThu: 5100, luotXem: 8100 },
    { month: 'T5', nhanVien: 90, rap: 92, doanhThu: 5300, luotXem: 8400 },
    { month: 'T6', nhanVien: 92, rap: 94, doanhThu: 5500, luotXem: 8800 },
  ],
  comparisonData: [
    { metric: 'KPI', 'Nguyễn Văn An': 95, 'Trần Thị Bình': 92, 'Lê Văn Cường': 88 },
    { metric: 'Hoàn thành', 'Nguyễn Văn An': 92, 'Trần Thị Bình': 88, 'Lê Văn Cường': 85 },
    { metric: 'Ca làm việc', 'Nguyễn Văn An': 93, 'Trần Thị Bình': 87, 'Lê Văn Cường': 83 },
    { metric: 'Hiệu suất', 'Nguyễn Văn An': 94, 'Trần Thị Bình': 90, 'Lê Văn Cường': 87 },
    { metric: 'Doanh số', 'Nguyễn Văn An': 96, 'Trần Thị Bình': 91, 'Lê Văn Cường': 86 },
  ],
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
};

// Main Component
export default function Performance() {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeSelection();
  const { isCalculating, calculateKPI } = useKPICalculation();

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

        <TopPerformersSection />
        
        <KPIDetailSection
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          isCalculating={isCalculating}
          calculateKPI={calculateKPI}
        />
        
        <TrendsSection />
        
        <ComparisonSection />
        
        <AlertsSection />
      </div>
    </div>
  );
}