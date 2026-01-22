import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { useSocket } from '../context/AdminSocketContext';
import {
    LayoutDashboard,
    Users,
    Map,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Settings,
    History
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { to: '/admin/users', icon: Users, label: 'Community' },
        { to: '/admin/plans', icon: Map, label: 'Travel Plans' },
        { to: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
        { to: '/admin/audit', icon: History, label: 'Audit Trails' },
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 overflow-hidden relative">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                <div className="p-8 border-b border-white/5 relative group">
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3 relative">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <span className="text-lg">⚡</span>
                        </div>
                        NexusAdmin
                    </h1>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-medium">Control Center</p>
                </div>

                <nav className="flex-1 p-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${isActive
                                    ? 'bg-white/5 text-white shadow-lg border border-white/10'
                                    : 'text-gray-400 hover:text-gray-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                    )}
                                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:scale-110 group-hover:text-gray-200'}`} />
                                    <span className="font-medium text-sm tracking-wide">{item.label}</span>
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors -z-10"></div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-gray-900/20 backdrop-blur-md">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_40%)]">
                <header className="h-20 bg-gray-900/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-10 transition-all">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-100 tracking-tight">System Console</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Node-01 Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="h-6 w-px bg-white/5 hidden md:block"></div>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-gray-200 tracking-wide">Administrator</span>
                                <span className="text-[10px] text-gray-500 -mt-0.5">@admin_nexus</span>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-lg border border-white/10 transition-transform group-hover:scale-105">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
