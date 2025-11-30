import { StaffHeader } from './components/StaffHeader';
import { StaffSidebar } from './components/StaffSidebar';


export default function StaffLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen bg-secondary">
      <StaffSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StaffHeader />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}