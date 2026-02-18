'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FileText, 
  Home, 
  Settings, 
  Users, 
  Palette, 
  Layout, 
  FileStack,
  LogOut,
  ChevronLeft,
  Scale
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Propostas',
    href: '/proposals',
    icon: FileText,
  },
  {
    title: 'Briefings',
    href: '/briefings',
    icon: FileStack,
  },
]

const adminMenuItems = [
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Templates',
    href: '/admin/templates',
    icon: FileText,
  },
  {
    title: 'Estilos',
    href: '/admin/styles',
    icon: Palette,
  },
  {
    title: 'Layouts',
    href: '/admin/layouts',
    icon: Layout,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
]

// Helper to check if path starts with href
const isActivePath = (pathname: string, href: string) => {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname.startsWith(href)
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-card border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">MPF Proposals</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              isCollapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Main Menu */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-xs font-medium text-muted-foreground px-3 py-2">
              Menu
            </span>
          )}
          {menuItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </div>

        {/* Admin Menu */}
        <div className="pt-4 space-y-1">
          {!isCollapsed && (
            <span className="text-xs font-medium text-muted-foreground px-3 py-2">
              Administração
            </span>
          )}
          {adminMenuItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'justify-between px-3')}>
          {!isCollapsed && <span className="text-xs text-muted-foreground">Tema</span>}
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className={cn(
            'w-full text-muted-foreground hover:text-destructive',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </aside>
  )
}
