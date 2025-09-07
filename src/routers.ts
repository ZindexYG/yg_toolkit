import { Home as HomeIcon, Inbox as InboxIcon } from 'lucide-react'
import { createBrowserRouter } from "react-router";
import Layout from './Layout'
import Generator from './Page/Generator'
import Home from './Page/Home'

export interface AppRoute {
  title: string
  path: string
  Component: any // 非 any 应该是属于 ReactNode
  icon?: any
  index?: boolean
}

// 统一路由数据源（供 router、sidebar、breadcrumb 共用）
export const appRoutes: AppRoute[] = [
  { title: 'Home', path: '/', Component: Home, icon: HomeIcon, index: true },
  { title: 'Generator', path: '/generator', Component: Generator, icon: InboxIcon },
]

// 辅助：根据 pathname 查找匹配的 route（优先精确匹配）
export function findRouteByPath(pathname: string): AppRoute | undefined {
  const exact = appRoutes.find(r => r.path === pathname)
  if (exact) return exact
  // 非根路径按前缀匹配（简单策略，适用于当前场景）
  return appRoutes.find(r => r.path !== '/' && pathname.startsWith(r.path))
}

// 把 appRoutes 转换为 createBrowserRouter 需要的 children 配置
const children = appRoutes.map(r => {
  if (r.index) {
    return { index: true, Component: r.Component }
  }
  return { path: r.path.replace(/^\//, ''), Component: r.Component }
})

export const router = [
  {
    path: "/",
    Component: Layout,
    children,
  },
];


export default createBrowserRouter(router)