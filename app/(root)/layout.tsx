"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Settings,
  LogOut,
  User,
  BarChart3,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import Aurora from '../../components/Aurora';

import { getCurrentUser } from "@/lib/actions/auth.action";
import { isAuthenticated } from "@/lib/actions/auth.action"

import { usePathname } from "next/navigation";

const Layout =  ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const isUserAuthenticated = await isAuthenticated();
      if (!isUserAuthenticated) {
        redirect("/sign-in");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 text-foreground selection:bg-emerald-500/30 selection:text-white">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent_60%) pointer-events-none" />
      
      <div className="relative z-10">
        {/* Modern Glass Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-4' 
            : 'py-8'
        }`}>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
              isScrolled 
                ? 'bg-dark-200/80 backdrop-blur-xl border border-white/10 shadow-2xl' 
                : 'bg-transparent border border-transparent'
            }`}>
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative size-10 flex items-center justify-center bg-emerald-500 rounded-xl group-hover:rotate-6 transition-transform">
                   <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={24} 
                    height={24} 
                    className="invert brightness-0"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-outfit font-bold text-xl tracking-tight text-white">TutorScreen</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-500 font-bold -mt-1">AI Tutor Screener</span>
                </div>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                <HeaderLink href="/" icon={<Home size={16} />} active={pathname === "/"}>Dashboard</HeaderLink>
                <HeaderLink href="/interviews" icon={<FileText size={16} />} active={pathname === "/interviews"}>Interviews</HeaderLink>
                <HeaderLink href="/analytics" icon={<BarChart3 size={16} />} active={pathname === "/analytics"}>Analytics</HeaderLink>
                <HeaderLink href="/your-interviews" icon={<BookOpen size={16} />} active={pathname === "/your-interviews"}>History</HeaderLink>
              </nav>
              
              {/* User Section */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="flex items-center gap-3 p-1 pr-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-colors">
                    <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                       <User size={16} />
                    </div>
                    <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-4 w-64 origin-top-right bg-dark-300 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50 overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/5">
                        <p className="font-bold text-white">{user?.name || 'Session Operator'}</p>
                        <p className="text-xs text-slate-500">{user?.email || 'operator@devprep.pro'}</p>
                    </div>
                    <div className="p-2">
                      <DropdownItem href="/profile" icon={<User size={16} />}>Profile Settings</DropdownItem>
                      <DropdownItem href="/settings" icon={<Settings size={16} />}>System Config</DropdownItem>
                      <div className="h-px bg-white/5 my-2" />
                      <button
                        onClick={() => {
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.href = '/sign-in';
                        }}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <LogOut size={16} />
                        Terminate Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Interface */}
        <main className="container mx-auto px-6 pt-32 pb-24 max-w-7xl">
          {children}
        </main>

        {/* Mobile Command Bar */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
          <div className="flex items-center justify-around p-2 bg-dark-200/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
            <MobileNavLink href="/" icon={<Home size={20} />} active={pathname === "/"} />
            <MobileNavLink href="/interviews" icon={<FileText size={20} />} active={pathname === "/interviews"} />
            <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center -mt-8 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)]">
               <Link href="/interview"><LogOut size={24} className="rotate-90 text-slate-950" /></Link>
            </div>
            <MobileNavLink href="/analytics" icon={<BarChart3 size={20} />} active={pathname === "/analytics"} />
            <MobileNavLink href="/your-interviews" icon={<BookOpen size={20} />} active={pathname === "/your-interviews"} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Components
const HeaderLink = ({ href, icon, children, active = false }: any) => (
  <Link 
    href={href}
    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
      active 
        ? 'text-white bg-white/10' 
        : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {children}
  </Link>
);

const MobileNavLink = ({ href, icon, active = false }: any) => (
  <Link 
    href={href}
    className={`p-3 rounded-xl transition-all ${
      active 
        ? 'text-emerald-500' 
        : 'text-slate-500 hover:text-emerald-400'
    }`}
  >
    {icon}
  </Link>
);

const DropdownItem = ({ href, icon, children }: any) => (
  <Link 
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
  >
    {icon}
    {children}
  </Link>
);

export default Layout;