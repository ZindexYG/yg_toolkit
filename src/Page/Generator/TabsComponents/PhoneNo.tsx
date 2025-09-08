import { Clipboard } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { TabsContent } from '@/components/ui/tabs'

function PhoneNo() {
  const [phoneNo, setPhoneNo] = useState<string>('')

  // 号段数组，与原 phoneNo.js 中 hd 保持一致
  function haoDuan(num: number | null): string | undefined {
    const hd = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '145', '147', '150', '151', '152', '153', '156', '157', '158', '159', '170', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
    if (num != null && num >= 1 && num <= hd.length) {
      return hd[num - 1]
    }
    return undefined
  }

  // 生成手机号（沿用原 generatorPhoneNo 的逻辑）
  const generatePhoneNo = () => {
    // 随机选号段索引：parseInt((Math.random() * 34) + 1) -> 1..34
    const idx = Number.parseInt((Math.random() * 34 + 1).toString())
    const prefix = haoDuan(idx) || '130' // 若异常，回退到常见号段 130（仅作容错，不改算法核心）
    // 生成 8 位随机数（与原脚本相同的表达方式）
    const max = 99999999
    const min = 10000000
    const num = Number.parseInt(((Math.random() * (max - min)) + min).toString())
    const full = `${prefix}${num}`
    setPhoneNo(full)
    // 可选提示，若项目使用 sonner toast 可显示
    if (typeof toast === 'function')
      toast.success('已生成手机号')
  }

  return (
    <TabsContent value="phoneNo">
      <Card className="p-6">
        <Toaster position="top-center" />
        <div className="min-w-36 w-full max-w-96 m-auto">

          <Button className="w-full" onClick={generatePhoneNo}>生成手机号码</Button>

          {phoneNo && (
            <div className="mb-4 text-center">
              {/* <div className="text-sm text-muted-foreground">生成手机号码</div> */}
              <div className="flex justify-center items-center gap-2 mt-2">
                <div className="font-mono">{phoneNo}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(phoneNo)
                    toast.success('已复制到剪贴板')
                  }}
                >
                  <Clipboard />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </TabsContent>
  )
}

export default PhoneNo
