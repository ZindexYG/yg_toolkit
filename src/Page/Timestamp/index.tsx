import { useLayoutEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import iso8601 from './TabsComponents/iso8601'
// import rfc2822 from './TabsComponents/rfc2822'
import unix from './TabsComponents/unix'

const TabsDates = [
  {
    title: 'ISO 8601',
    value: 'iso8601',
    component: iso8601,
    desc: '`2023-10-13T12:00:00Z` 或 `2023-10-13T12:00:00+08:00`',
  },
  {
    title: 'Unix',
    value: 'unix',
    component: unix,
    desc: '`1697184000`',
  },
  // {
  //   title: 'RFC 2822',
  //   value: 'rfc2822',
  //   component: rfc2822,
  //   desc: '`Fri, 13 Oct 2023 12:00:00 +0000`',
  // },
]

export function Timestamp() {
  const [now, setNow] = useState<Date | null>(null)
  const intervalRef = useRef<number | null>(null)
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  } as const

  // 清除定时器的函数
  const clearInterval = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useLayoutEffect(() => {
    // 设置初始时间
    setNow(new Date())

    intervalRef.current = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval()
    }
  }, [])

  // 以安全的方式生成本地化字符串，避免 now 为 null 时抛错
  const localeString = now ? now.toLocaleString('zh-CN', options) : ''

  // 函数式组件返回 UI
  return (
    <>
      <Card className="w-full flex justify-center">
        <CardHeader>
          当前时间：
          {localeString}
          <Alert variant="success">
            <AlertDescription>
              <ul className="list-inside text-sm">
                {
                  TabsDates.map(item => (
                    <li key={item.value} className="flex">
                      <div className="w-20 font-mono font-medium">
                        {item.title}
                      </div>
                      例如：
                      <code>{item.desc}</code>
                    </li>
                  ))
                }
              </ul>
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iso8601">
            <TabsList className="w-full sm:h-12 h-24 flex flex-wrap justify-around">
              {TabsDates.map(item => (
                <TabsTrigger className="sm:h-full h-9" value={item.value} key={item.value}>{item.title}</TabsTrigger>
              ))}
            </TabsList>
            {
              TabsDates.map(item => (
                <TabsContent value={item.value} key={item.value}>
                  {item.component ? <item.component now={now} /> : <div className="text-sm text-muted-foreground">暂未实现对应格式的组件</div>}
                </TabsContent>
              ))
            }
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}

export default Timestamp
