import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export const AppLayout = () => (
  <div className="flex flex-col min-h-screen max-w-[430px] mx-auto relative">
    <main className="flex-1 pb-20 overflow-y-auto">
      <Outlet />
    </main>
    <BottomNav />
  </div>
)
