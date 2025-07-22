import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className={cn(
          "flex-1 p-6 overflow-auto",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}