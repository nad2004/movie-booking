import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="w-full lg:w-[320px] flex-shrink-0">
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-border sticky top-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative group cursor-pointer">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-surface shadow-lg group-hover:opacity-90 transition-opacity">
              {/* Sửa thành profilePicture */}
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="bg-primary text-white text-3xl sm:text-4xl font-bold">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Thay đổi</span>
            </div>
          </div>

          <h2 className="mb-2 text-text-primary text-xl font-bold">{user.fullName}</h2>
          <p className="text-text-secondary mb-4 text-sm">{user.email}</p>

          <div className="flex flex-col gap-2 items-center">
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full border-0 text-sm font-medium capitalize"
            >
              {user.role === 'customer' ? 'Khách hàng' : user.role}
            </Badge>
            
            {/* Hiển thị thêm hạng thành viên nếu có */}
            {user.membershipLevel && (
               <Badge variant="outline" className="border-accent text-accent text-xs">
                 Hạng: {user.membershipLevel}
               </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}