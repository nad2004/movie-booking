'use client'
import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Film,
  Building2,
  Users,
  Target,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Activity,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const topPerformers = {
  employees: [
    { id: 1, name: 'Nguyễn Văn An', kpi: 95, sales: 1250000, trend: 'up' },
    { id: 2, name: 'Trần Thị Bình', kpi: 92, sales: 1180000, trend: 'up' },
    { id: 3, name: 'Lê Văn Cường', kpi: 88, sales: 1050000, trend: 'down' },
  ],
  movies: [
    { id: 1, name: 'Avatar: The Way of Water', revenue: 5200000, tickets: 8500, trend: 'up' },
    { id: 2, name: 'Avengers: Endgame', revenue: 4800000, tickets: 7800, trend: 'up' },
    { id: 3, name: 'The Dark Knight', revenue: 4200000, tickets: 6900, trend: 'down' },
  ],
  theaters: [
    { id: 1, name: 'Rạp Trung tâm', efficiency: 94, revenue: 8500000, trend: 'up' },
    { id: 2, name: 'Rạp Quận 1', efficiency: 89, revenue: 7200000, trend: 'up' },
    { id: 3, name: 'Rạp Quận 7', efficiency: 85, revenue: 6800000, trend: 'down' },
  ],
};

const employees = [
  { id: 1, name: 'Nguyễn Văn An' },
  { id: 2, name: 'Trần Thị Bình' },
  { id: 3, name: 'Lê Văn Cường' },
  { id: 4, name: 'Phạm Thị Dung' },
  { id: 5, name: 'Hoàng Văn Em' },
];

const kpiData = {
  1: { kpi: 95, completion: 92, shifts: 28, performance: 94 },
  2: { kpi: 92, completion: 88, shifts: 26, performance: 90 },
  3: { kpi: 88, completion: 85, shifts: 25, performance: 87 },
  4: { kpi: 82, completion: 80, shifts: 24, performance: 83 },
  5: { kpi: 78, completion: 75, shifts: 22, performance: 79 },
};

const trendData = [
  { month: 'T1', nhanVien: 85, rap: 88, doanhThu: 4200, luotXem: 6800 },
  { month: 'T2', nhanVien: 87, rap: 89, doanhThu: 4500, luotXem: 7200 },
  { month: 'T3', nhanVien: 89, rap: 91, doanhThu: 4800, luotXem: 7600 },
  { month: 'T4', nhanVien: 91, rap: 90, doanhThu: 5100, luotXem: 8100 },
  { month: 'T5', nhanVien: 90, rap: 92, doanhThu: 5300, luotXem: 8400 },
  { month: 'T6', nhanVien: 92, rap: 94, doanhThu: 5500, luotXem: 8800 },
];

const comparisonData = [
  { metric: 'KPI', 'Nguyễn Văn An': 95, 'Trần Thị Bình': 92, 'Lê Văn Cường': 88 },
  { metric: 'Hoàn thành', 'Nguyễn Văn An': 92, 'Trần Thị Bình': 88, 'Lê Văn Cường': 85 },
  { metric: 'Ca làm việc', 'Nguyễn Văn An': 93, 'Trần Thị Bình': 87, 'Lê Văn Cường': 83 },
  { metric: 'Hiệu suất', 'Nguyễn Văn An': 94, 'Trần Thị Bình': 90, 'Lê Văn Cường': 87 },
  { metric: 'Doanh số', 'Nguyễn Văn An': 96, 'Trần Thị Bình': 91, 'Lê Văn Cường': 86 },
];

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Giảm hiệu suất đột ngột',
    description: 'Lê Văn Cường: Hiệu suất giảm 12% trong 7 ngày qua',
    time: '2 giờ trước',
  },
  {
    id: 2,
    type: 'danger',
    title: 'KPI dưới ngưỡng',
    description: 'Hoàng Văn Em: KPI đạt 78/100 (ngưỡng: 80)',
    time: '5 giờ trước',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Ca làm việc bất thường',
    description: 'Phạm Thị Dung: Vắng mặt 3/5 ca làm việc tuần này',
    time: '1 ngày trước',
  },
  {
    id: 4,
    type: 'info',
    title: 'Xu hướng tích cực',
    description: 'Nguyễn Văn An: Tăng 8% hiệu suất trong tháng',
    time: '2 ngày trước',
  },
];

export default function Performance() {
  const [selectedEmployee, setSelectedEmployee] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateKPI = () => {
    setIsCalculating(true);
    // Simulate API call
    setTimeout(() => {
      setIsCalculating(false);
      alert('KPI đã được tính toán và cập nhật thành công!');
    }, 1500);
  };

  const currentKPI = kpiData[selectedEmployee as keyof typeof kpiData];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Hiệu Suất & KPI</h1>
        <p className="text-muted-foreground">
          Theo dõi và đánh giá hiệu suất làm việc, KPI nhân viên và xu hướng kinh doanh
        </p>
      </div>

      {/* Top Performers */}
      <section>
        <h2 className="text-foreground mb-4">🏆 Top Performers</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Employees */}
          <div className="bg-card rounded-[10px] border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground">Nhân viên xuất sắc</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.employees.map((employee, index) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-[10px] hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.sales.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{employee.kpi}</span>
                    {employee.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Movies */}
          <div className="bg-card rounded-[10px] border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-foreground">Phim hiệu suất tốt</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.movies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-[10px] hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-foreground text-sm">{movie.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {movie.tickets.toLocaleString('vi-VN')} vé
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {movie.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Theaters */}
          <div className="bg-card rounded-[10px] border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-chart-3/10 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-chart-3" />
              </div>
              <h3 className="text-foreground">Rạp hiệu quả nhất</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.theaters.map((theater, index) => (
                <div
                  key={theater.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-[10px] hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-chart-3 rounded-full flex items-center justify-center text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-foreground">{theater.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {theater.revenue.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{theater.efficiency}%</span>
                    {theater.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KPI Detail */}
      <section className="bg-card rounded-[10px] border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground">KPI Nhân Viên</h2>
          </div>
          <button
            onClick={handleCalculateKPI}
            disabled={isCalculating}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-[10px] hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          {/* Employee Selector */}
          <div className="lg:col-span-1">
            <label className="text-muted-foreground mb-2 block">Chọn nhân viên</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(Number(e.target.value))}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-[10px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* KPI Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary to-primary-hover p-4 rounded-[10px] text-primary-foreground">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 opacity-80" />
                <span className="text-2xl">{currentKPI.kpi}</span>
              </div>
              <p className="text-sm opacity-90">Điểm KPI</p>
              <p className="text-xs opacity-70 mt-1">Tổng hợp từ các chỉ số</p>
            </div>

            <div className="bg-gradient-to-br from-chart-3 to-chart-3/80 p-4 rounded-[10px] text-white">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 opacity-80" />
                <span className="text-2xl">{currentKPI.completion}%</span>
              </div>
              <p className="text-sm opacity-90">Tỉ lệ hoàn thành</p>
              <p className="text-xs opacity-70 mt-1">Nhiệm vụ được giao</p>
            </div>

            <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-[10px] text-accent-foreground">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 opacity-80" />
                <span className="text-2xl">{currentKPI.shifts}</span>
              </div>
              <p className="text-sm opacity-90">Số ca làm việc</p>
              <p className="text-xs opacity-70 mt-1">Trong tháng này</p>
            </div>

            <div className="bg-gradient-to-br from-chart-4 to-chart-4/80 p-4 rounded-[10px] text-white">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 opacity-80" />
                <span className="text-2xl">{currentKPI.performance}%</span>
              </div>
              <p className="text-sm opacity-90">Chỉ số hiệu suất</p>
              <p className="text-xs opacity-70 mt-1">Đánh giá tổng thể</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trends */}
      <section className="bg-card rounded-[10px] border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-chart-4/10 rounded-[10px] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-chart-4" />
          </div>
          <div>
            <h2 className="text-foreground">Xu Hướng Hiệu Suất</h2>
            <p className="text-sm text-muted-foreground">Theo dõi sự thay đổi theo thời gian</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee & Theater Performance */}
          <div>
            <h3 className="text-foreground mb-4">Hiệu suất Nhân viên & Rạp</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="nhanVien"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  name="Nhân viên"
                />
                <Line
                  type="monotone"
                  dataKey="rap"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  name="Rạp"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue & Views */}
          <div>
            <h3 className="text-foreground mb-4">Doanh thu & Lượt xem</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                  }}
                />
                <Legend />
                <Bar dataKey="doanhThu" fill="var(--chart-2)" name="Doanh thu (x1000)" />
                <Bar dataKey="luotXem" fill="var(--chart-4)" name="Lượt xem" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-card rounded-[10px] border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-chart-5/10 rounded-[10px] flex items-center justify-center">
            <Users className="w-5 h-5 text-chart-5" />
          </div>
          <div>
            <h2 className="text-foreground">So Sánh Hiệu Suất</h2>
            <p className="text-sm text-muted-foreground">
              So sánh các chỉ số giữa nhiều nhân viên
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Comparison */}
          <div>
            <h3 className="text-foreground mb-4">So sánh cột</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="metric" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                  }}
                />
                <Legend />
                <Bar dataKey="Nguyễn Văn An" fill="var(--chart-1)" />
                <Bar dataKey="Trần Thị Bình" fill="var(--chart-2)" />
                <Bar dataKey="Lê Văn Cường" fill="var(--chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Comparison */}
          <div>
            <h3 className="text-foreground mb-4">So sánh Radar</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={comparisonData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" stroke="var(--muted-foreground)" />
                <PolarRadiusAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                  }}
                />
                <Legend />
                <Radar
                  name="Nguyễn Văn An"
                  dataKey="Nguyễn Văn An"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Trần Thị Bình"
                  dataKey="Trần Thị Bình"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Lê Văn Cường"
                  dataKey="Lê Văn Cường"
                  stroke="var(--chart-4)"
                  fill="var(--chart-4)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="bg-card rounded-[10px] border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-destructive/10 rounded-[10px] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-foreground">Cảnh Báo Hiệu Suất</h2>
            <p className="text-sm text-muted-foreground">
              Các vấn đề cần được chú ý và xử lý
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-[10px] border-l-4 ${
                alert.type === 'danger'
                  ? 'bg-destructive/5 border-l-destructive'
                  : alert.type === 'warning'
                  ? 'bg-accent/5 border-l-accent'
                  : 'bg-chart-4/5 border-l-chart-4'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {alert.type === 'danger' ? (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-accent" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-chart-4" />
                    )}
                    <h4 className="text-foreground">{alert.title}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">{alert.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {alert.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

