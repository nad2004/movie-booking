import { useState } from 'react';
import { Shield, KeyRound, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChangePasswordDialog } from './ChangePasswordDialog'; // Import component mới

export function ProfileSecurity() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-text-primary text-lg font-bold">Bảo mật</h3>
          </div>
        </div>

        <div 
          // Thêm onClick vào container hoặc button để mở modal
          onClick={() => setIsChangePasswordOpen(true)}
          className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
              <div className="bg-surface p-2 rounded-lg border border-border group-hover:border-primary/30 transition-colors">
                  <KeyRound className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </div>
              <div>
                  <p className="text-text-primary font-medium text-sm">Đổi mật khẩu</p>
              </div>
          </div>
          <Button variant="ghost" size="icon" className="text-text-secondary group-hover:text-primary">
              <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Dialog Component */}
      <ChangePasswordDialog 
        open={isChangePasswordOpen} 
        onOpenChange={setIsChangePasswordOpen} 
      />
    </>
  );
}