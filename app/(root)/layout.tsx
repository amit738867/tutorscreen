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

import { ThemeToggle } from "@/components/ThemeToggle";

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
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent/30 selection:text-white transition-colors duration-500 font-mona-sans">
      {/* Background Texture - Very subtle */}
      <div className="fixed inset-0 z-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Modern Glass Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-8'
        }`}>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 border ${
              isScrolled 
                ? 'bg-card-bg/80 backdrop-blur-xl border-border-color shadow-lg' 
                : 'bg-transparent border-transparent'
            }`}>
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative size-10 flex items-center justify-center bg-accent rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-accent/20">
                   <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={24} 
                    height={24} 
                    className="invert brightness-0"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-text-primary">TutorScreen</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold -mt-1">AI Tutor Screener</span>
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
                <ThemeToggle />
                <div className="relative group">
                  <button className="flex items-center gap-3 p-1 pr-3 rounded-full bg-bg-secondary hover:bg-bg-secondary/80 border border-border-color transition-all shadow-sm">
                    <div className="size-8 rounded-full bg-accent flex items-center justify-center text-white">
                       <User size={16} />
                    </div>
                    <ChevronDown size={14} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-4 w-64 origin-top-right bg-card-bg border border-border-color rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50 overflow-hidden backdrop-blur-xl">
                    <div className="p-4 border-b border-border-color">
                        <p className="font-bold text-text-primary">{user?.name || 'Session Operator'}</p>
                        <p className="text-xs text-text-secondary">{user?.email || 'operator@devprep.pro'}</p>
                    </div>
                    <div className="p-2">
                      <DropdownItem href="/profile" icon={<User size={16} />}>Profile Settings</DropdownItem>
                      <DropdownItem href="/settings" icon={<Settings size={16} />}>System Config</DropdownItem>
                      <div className="h-px bg-border-color my-2" />
                      <button
                        onClick={() => {
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.href = '/sign-in';
                        }}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold"
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
          <div className="flex items-center justify-around p-2 bg-card-bg border border-border-color rounded-2xl shadow-2xl backdrop-blur-xl">
            <MobileNavLink href="/" icon={<Home size={20} />} active={pathname === "/"} />
            <MobileNavLink href="/interviews" icon={<FileText size={20} />} active={pathname === "/interviews"} />
            <div className="size-12 rounded-xl bg-accent flex items-center justify-center -mt-8 shadow-lg shadow-accent/20">
               <Link href="/interview"><LogOut size={24} className="rotate-90 text-white" /></Link>
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
    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'text-accent bg-accent/10' 
        : 'text-text-secondary hover:text-accent hover:bg-accent/5'
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
        ? 'text-accent' 
        : 'text-text-secondary hover:text-accent'
    }`}
  >
    {icon}
  </Link>
);

const DropdownItem = ({ href, icon, children }: any) => (
  <Link 
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-accent/5 hover:text-accent rounded-xl transition-all"
  >
    {icon}
    {children}
  </Link>
);

export default Layout;