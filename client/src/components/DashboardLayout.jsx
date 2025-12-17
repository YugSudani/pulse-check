import { Outlet } from 'react-router-dom'
import Slidebar from './Slidebar'

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-[#0B0F17] text-white">
            <Slidebar />
            <Outlet /> {/* Child routes render here */}
        </div>
    )
}
