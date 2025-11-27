import { Input } from "@/components/ui/input";
import { Search, Users, UserPlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface UserToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  currentTab: string;
  onTabChange: (val: string) => void;
}

export function UserToolbar({ search, onSearchChange, currentTab, onTabChange }: UserToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Tabs Switcher */}
      <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl h-auto w-full sm:w-auto justify-start">
          <TabsTrigger 
            value="customer" 
            className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Khách hàng
          </TabsTrigger>
          <TabsTrigger 
            value="staff"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nhân viên
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5  " />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6">
           <UserPlus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>
    </div>
  );
}