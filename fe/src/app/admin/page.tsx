import { redirect } from 'next/navigation'

export default function AdminPage({ children }: { children: React.ReactNode }) {
  redirect('/admin/dashboard')
  return <></>
}
