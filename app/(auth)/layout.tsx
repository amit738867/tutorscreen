"use client";

import React, { ReactNode } from 'react'
import { ThemeToggle } from "@/components/ThemeToggle"

const Authlayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='min-h-screen bg-bg-primary transition-colors duration-500 relative overflow-hidden flex items-center justify-center p-6'>
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent_60%) pointer-events-none" />
      
      {/* Absolute Toggle for Auth */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        {children}
      </div>
    </div>
  )
}

export default Authlayout