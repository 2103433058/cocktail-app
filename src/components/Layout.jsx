import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 pb-20 md:pb-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
