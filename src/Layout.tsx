import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { findRouteByPath } from '@/routers'

export function Layout() {
  const location = useLocation() as unknown as { pathname: string }
  const matched = findRouteByPath(location.pathname)
  const pageTitle = matched?.title ?? location.pathname

  return (
    <SidebarProvider style={
      {
        '--sidebar-width': '19rem',
      } as React.CSSProperties
    }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-muted/50 min-h-[100vh]  rounded-xl md:min-h-min">

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
