"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
export interface FiltersState {
  status: 'all' | 'watched' | 'upcoming' | 'cancelled';
  time: 'all' | 'week' | 'month' | 'year';
  search: string;
}

export interface FiltersProps {
  bookingsCount: number;
  onFilterChange: (filters: FiltersState) => void;
}
export default function Filters({ bookingsCount, onFilterChange }: FiltersProps) {
  const [status, setStatus] = useState<'all' | 'watched' | 'upcoming' | 'cancelled'>("all");
  const [time, setTime] = useState<'all' | 'week' | 'month' | 'year'>("all");
  const [search, setSearch] = useState("");

  const emitChange = (next = {}) => {
    const filters = {
      status,
      time,
      search,
      ...next,
    };
    onFilterChange?.(filters);
  };

  return (
    <Card className="bg-surface border-border p-6 mb-8" style={{ borderRadius: '16px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Status */}
        <div>
          <label className="text-text-primary mb-2 block" style={{ fontWeight: 600, fontSize: "14px" }}>
            Trạng thái
          </label>
          <Tabs value={status} onValueChange={(v) => { const next = v as FiltersState['status']; setStatus(next); emitChange({ status: next }); }}>
            <TabsList className="w-full bg-bg-secondary">
              <TabsTrigger value="all" className="flex-1">Tất cả</TabsTrigger>
              <TabsTrigger value="watched" className="flex-1">Đã xem</TabsTrigger>
              <TabsTrigger value="upcoming" className="flex-1">Sắp chiếu</TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1">Đã huỷ</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Time */}
        <div>
          <label className="text-text-primary mb-2 block" style={{ fontWeight: 600, fontSize: "14px" }}>
            Thời gian
          </label>
          <Select value={time} onValueChange={(v) => { const selected = v as FiltersState['time']; setTime(selected); emitChange({ time: selected }); }}>
            <SelectTrigger className="bg-bg-secondary border-border text-text-primary">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="md:col-span-2">
          <label className="text-text-primary mb-2 block" style={{ fontWeight: 600, fontSize: "14px" }}>
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <Input
              placeholder="Tìm theo tên phim hoặc mã vé"
              value={search}
              onChange={(e) => { setSearch(e.target.value); emitChange({ search: e.target.value }); }}
              className="pl-10 bg-bg-secondary border-border text-text-primary"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-text-secondary">
          Tìm thấy <span className="text-primary font-semibold">{bookingsCount}</span> vé
        </p>
      </div>
    </Card>
  );
}
