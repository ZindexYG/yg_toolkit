import { Clipboard } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { TabsContent } from '@/components/ui/tabs'

function OrgCode() {
  const [orgCode, setOrgCode] = useState<string>('')

  const generateOrgCode = () => {
    const max = 99999999
    const min = 10000000
    const num = Math.floor(((Math.random() * (max - min)) + min))
    const ws = [3, 7, 9, 10, 5, 8, 4, 2]
    let sum = 0
    for (let i = 0; i < 8; i++) {
      sum += Number((`${num}`).charAt(i)) * ws[i]
    }
    let C9: string | number = 11 - (sum % 11)
    if (C9 === 11) {
      C9 = '0'
    }
    else if (C9 === 10) {
      C9 = 'X'
    }
    else {
      C9 = `${C9}`
    }
    setOrgCode(`${num}-${C9}`)
  }

  return (
    <TabsContent value="orgCode">
      <Card className="p-6">
        <Toaster position="top-center" />
        <div className="w-96 m-auto">
          {/* <Button className="w-full">生成组织机构代码</Button> */}
          <div className="w-96 m-auto">
            {/* 组织机构代码输入框，绑定状态便于显示和复制 */}
            {
              orgCode && (
                <div className="mb-4 text-center">
                  <div className="text-sm text-muted-foreground">生成的组织机构代码</div>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <div className="font-mono">
                      {orgCode}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(orgCode)
                        // 使用 toast.success 显示成功消息
                        toast.success('已复制到剪贴板')
                      }}
                    >
                      <Clipboard />
                    </Button>
                  </div>
                </div>
              )
            }
            {/* 触发生成逻辑 */}
            <Button className="w-full" onClick={generateOrgCode}>
              生成组织机构代码
            </Button>
          </div>
        </div>
      </Card>
    </TabsContent>
  )
}

export default OrgCode
