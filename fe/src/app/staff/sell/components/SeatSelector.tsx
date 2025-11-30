'use client'

import { Card } from '@/components/ui/card';
import { Clock, Armchair, Loader2 } from 'lucide-react';
import { SeatMaps } from '@/app/components/shared/seatsmap';
import { Schedule } from '@/types/schedule';
import { BookedSeat } from '@/types/booking';
import type { Seat } from '@/types/theater';

interface SeatSelectorProps {
  schedules: Schedule[];
  isLoadingSchedules: boolean;
  selectedSchedule: Schedule | null;
  onSelectSchedule: (schedule: Schedule) => void;
  
  selectedSeats: BookedSeat[];
  onSeatClick: (seat: Seat) => void;
}

export function SeatSelector({
  schedules,
  isLoadingSchedules,
  selectedSchedule,
  onSelectSchedule,
  selectedSeats,
  onSeatClick
}: SeatSelectorProps) {
  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      
      {/* List Suất Chiếu */}
      <Card className="p-4 border border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Chọn suất chiếu</h3>
        </div>

        {isLoadingSchedules ? (
          <div className="py-4 flex justify-center"><Loader2 className="animate-spin text-primary w-5 h-5" /></div>
        ) : schedules.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-2">Không có suất chiếu.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {schedules.map(schedule => (
              <button
                key={schedule._id}
                onClick={() => onSelectSchedule(schedule)}
                className={`px-3 py-2 rounded-lg border text-sm transition-all relative overflow-hidden ${
                  selectedSchedule?._id === schedule._id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary font-medium'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {schedule.startTime}
                <span className="text-[10px] text-gray-500 ml-1 block">
                    {schedule.roomName}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Bản Đồ Ghế */}
      {selectedSchedule && (
        <Card className="p-4 border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <Armchair className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Sơ đồ ghế: {selectedSchedule.roomName}</h3>
              </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-2 flex-1 overflow-auto">
              <SeatMaps 
                  schedule={selectedSchedule}
                  selectedSeats={selectedSeats}
                  onSeatClick={onSeatClick}
              />
          </div>
        </Card>
      )}
    </div>
  );
}