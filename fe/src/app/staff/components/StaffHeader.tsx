import { Bell, User, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function StaffHeader() {
  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm phim, vé, khách hàng..."
            className="pl-10 bg-input-background border-border rounded-[10px]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Ca làm việc */}
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-[10px]">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm text-foreground font-medium">Ca 2 (14:00 - 22:00)</span>
        </div>

        {/* Thông báo */}
        <button className="relative p-2 hover:bg-card-hover rounded-[10px] transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        {/* Thông tin nhân viên */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm text-foreground font-medium">Nguyễn Văn An</p>
            <p className="text-xs text-muted-foreground">NV001</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-[10px] flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}