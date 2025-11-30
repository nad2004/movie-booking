import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, Building2 } from "lucide-react";
import { Theater } from "@/types/theater";

interface RoomToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTheater: string;
  onTheaterChange: (val: string) => void;
  theaters: Theater[];
  onOpenAdd: () => void;
}

export function RoomToolbar({ 
  search, onSearchChange, 
  selectedTheater, onTheaterChange, theaters, 
  onOpenAdd 
}: RoomToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm ">
      <div className="flex flex-1 flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative min-w-[250px] ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm tên phòng..."
            className="pl-9 bg-gray-50 border-gray-200"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter Theater */}
        <div className="relative min-w-[250px] bg-gray-50 text-gray-900">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <Select value={selectedTheater} onValueChange={onTheaterChange}>
            <SelectTrigger className="pl-9 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Lọc theo rạp" />
            </SelectTrigger>
            <SelectContent className="bg-gray-50 text-gray-900">
                <SelectItem value="all">Tất cả các rạp</SelectItem>
                {theaters.map(t => (
                    <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>

      <Button onClick={onOpenAdd} className="bg-primary hover:bg-primary/90 text-white gap-2">
        <Plus className="w-4 h-4" /> Thêm Phòng Mới
      </Button>
    </div>
  );
}