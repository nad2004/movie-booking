'use client'

import { DashboardHeader } from "./components/DashboardHeader";
import { KpiStats } from "./components/KpiStats";
import { HorizontalChart } from "./components/HorizontalChart";
import { UpcomingMoviesList } from "./components/UpcomingMoviesList";
import { RecentActivities } from "./components/RecentActivities";
import { SystemNotification } from "./components/SystemNotification";

// Import dữ liệu giả (Mock Data)
import { topMovies, topTheaters } from "./constants/mockData";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-gray-50/30 min-h-screen">
      <DashboardHeader />
      <KpiStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalChart 
            title="Top 5 Phim Xem Nhiều Nhất"
            description="Xếp hạng theo lượt xem"
            data={topMovies} // Truyền dữ liệu phim
        />
        
        {/* Biểu đồ Top Rạp (Doanh thu) */}
        <HorizontalChart 
            title="Top 5 Rạp Doanh Thu Cao Nhất"
            description="Đơn vị: Triệu VND"
            data={topTheaters} // Truyền dữ liệu rạp
        />
      </div>

      {/* 4. Lists Section (Danh sách phim & Hoạt động) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Phim sắp chiếu */}
        <div className="h-full">
            <UpcomingMoviesList />
        </div>
        
        {/* Cột phải: Hoạt động gần đây */}
        <div className="h-full">
            <RecentActivities />
        </div>
      </div>

      {/* 5. Footer Alerts */}
      <SystemNotification />
    </div>
  );
}