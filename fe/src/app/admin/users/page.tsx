'use client'

import { useState } from "react";
import { useUsers } from "@/lib/api/user";
import { useUserMutations } from "./hooks/useUserMutations";
import { UserTable } from "./components/UserTable";
import { UserToolbar } from "./components/UserToolbar";
import { UserDetailSheet } from "./components/UserDetailSheet";
import { UpdateRoleDialog } from "./components/UpdateRoleDialog";
import { User } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UserManagementPage() {
  // State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentTab, setCurrentTab] = useState("customer"); // 'customer' | 'staff'

  // Dialog State
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [userToEditRole, setUserToEditRole] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch API
  // API backend của bạn cần hỗ trợ param 'role' để lọc
  const { data: userData, isLoading } = useUsers({ 
    page: 1, 
    limit: 10, 
    search: debouncedSearch,
    role: currentTab // Lọc theo tab hiện tại
  });
  
  const { deleteMutation } = useUserMutations();

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Người Dùng</h1>

        <UserToolbar 
            search={search} 
            onSearchChange={setSearch}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
        />

        <UserTable 
          users={userData?.users || []}
          isLoading={isLoading}
          onViewDetail={(user) => setViewUserId(user._id)}
          onEditRole={setUserToEditRole}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      {/* Components Dialog / Sheet */}
      <UserDetailSheet 
        open={!!viewUserId} 
        onOpenChange={() => setViewUserId(null)} 
        userId={viewUserId} 
      />

      <UpdateRoleDialog 
        open={!!userToEditRole} 
        onOpenChange={() => setUserToEditRole(null)} 
        user={userToEditRole} 
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}