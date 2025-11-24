'use client'

import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types'; 
import { useUploadAvatar } from '@/hooks/useUploadAvatar';
import { Loader2, Camera } from 'lucide-react';

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate kích thước file (ví dụ: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn, vui lòng chọn ảnh dưới 5MB");
        return;
      }
      // Gọi API upload
      uploadAvatar(file);
    }
  };

  const triggerFileInput = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full lg:w-[320px] flex-shrink-0">
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-border sticky top-24">
        <div className="flex flex-col items-center text-center">
          
          {/* Avatar Wrapper */}
          <div 
            className="mb-6 relative group cursor-pointer"
            onClick={triggerFileInput}
          >
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-surface shadow-lg group-hover:opacity-90 transition-opacity bg-white">
              <AvatarImage 
                src={user.profilePicture} 
                alt={user.fullName} 
                className="object-cover" 
              />
              <AvatarFallback className="bg-primary text-white text-3xl sm:text-4xl font-bold">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Hover/Loading Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-all duration-200 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isUploading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                    <div className="flex flex-col items-center text-white">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Thay đổi</span>
                    </div>
                )}
            </div>
            
            {/* Input File Ẩn */}
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" // Chỉ chấp nhận file ảnh
                onChange={handleFileChange}
                disabled={isUploading}
            />
          </div>

          {/* User Info */}
          <h2 className="mb-2 text-text-primary text-xl font-bold">{user.fullName}</h2>
          <p className="text-text-secondary mb-4 text-sm">{user.email}</p>

          <div className="flex flex-col gap-2 items-center">
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full border-0 text-sm font-medium capitalize"
            >
              {user.role === 'customer' ? 'Khách hàng' : user.role}
            </Badge>
            
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