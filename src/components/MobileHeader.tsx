
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileHeader = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/writing', label: 'Writing' },
    { path: '/work-in-progress', label: 'Work in Progress' },
    { path: '/desserts', label: 'Desserts' },
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b border-[#333] bg-portfolio-sidebar md:hidden">
      <h1 className="font-custom font-bold text-xl text-white">Shubhank Pawar</h1>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="text-white p-2">
            <Menu size={24} />
            <span className="sr-only">Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="bg-portfolio-sidebar text-white pt-10 pb-6">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-base ${
                    isActive ? 'bg-[#333333] text-white' : 'text-gray-300 hover:bg-[#333333]'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileHeader;
