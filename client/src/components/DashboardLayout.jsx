import { Outlet } from 'react-router-dom'
import Slidebar from './Slidebar'

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-[#101724] text-white overflow-hidden">
            <Slidebar />
            <div className="flex-1 overflow-hidden flex flex-col md:ml-0">
                <Outlet /> {/* Child routes render here */}
            </div>
        </div>
    )
}
