import { Clipboard } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { TabsContent } from '@/components/ui/tabs'

function CreditCode() {
  const [creditCode, setCreditCode] = useState<string>('')

  // 将字符映射为数值（用于计算）
  function getMapC(pa: string): number | undefined {
    switch (pa) {
      case '0': return 0
      case '1': return 1
      case '2': return 2
      case '3': return 3
      case '4': return 4
      case '5': return 5
      case '6': return 6
      case '7': return 7
      case '8': return 8
      case '9': return 9
      case 'A': return 10
      case 'B': return 11
      case 'C': return 12
      case 'D': return 13
      case 'E': return 14
      case 'F': return 15
      case 'G': return 16
      case 'H': return 17
      case 'J': return 18
      case 'K': return 19
      case 'L': return 20
      case 'M': return 21
      case 'N': return 22
      case 'P': return 23
      case 'Q': return 24
      case 'R': return 25
      case 'T': return 26
      case 'U': return 27
      case 'W': return 28
      case 'X': return 29
      case 'Y': return 30
    }
    return undefined
  }

  // 根据位次获取权重（原逻辑）
  function getMapW(pa: string): number | undefined {
    switch (pa) {
      case '1': return 1
      case '2': return 3
      case '3': return 9
      case '4': return 27
      case '5': return 19
      case '6': return 26
      case '7': return 16
      case '8': return 17
      case '9': return 20
      case '10': return 29
      case '11': return 25
      case '12': return 13
      case '13': return 8
      case '14': return 24
      case '15': return 10
      case '16': return 30
      case '17': return 28
    }
    return undefined
  }

  // 校验位映射（原逻辑）
  function getMapR(pa: string): string | undefined {
    switch (pa) {
      case '0': return '0'
      case '1': return '1'
      case '2': return '2'
      case '3': return '3'
      case '4': return '4'
      case '5': return '5'
      case '6': return '6'
      case '7': return '7'
      case '8': return '8'
      case '9': return '9'
      case '10': return 'A'
      case '11': return 'B'
      case '12': return 'C'
      case '13': return 'D'
      case '14': return 'E'
      case '15': return 'F'
      case '16': return 'G'
      case '17': return 'H'
      case '18': return 'J'
      case '19': return 'K'
      case '20': return 'L'
      case '21': return 'M'
      case '22': return 'N'
      case '23': return 'P'
      case '24': return 'Q'
      case '25': return 'R'
      case '26': return 'T'
      case '27': return 'U'
      case '28': return 'W'
      case '29': return 'X'
      case '30': return 'Y'
      case '31': return '0'
    }
    return undefined
  }

  // 获取登记机构编码（保留原映射）
  function getRegOrgCode(num: string): string | undefined {
    switch (num) {
      case '1':
        return '1'
      case '2':
        return '2'
      case '3':
        return '3'
      case '4':
        return '4'
      case '5':
        return '5'
      case '6':
        return '6'
      case '7':
        return '7'
      case '8':
        return '8'
      case '9':
        return '9'
      case '10':
        return 'A'
      case '11':
        return 'B'
      case '12':
        return 'C'
      case '13':
        return 'D'
      case '14':
        return 'E'
      case '15':
        return 'F'
      case '16':
        return 'G'
      case '17':
        return 'Y'
    }
    return undefined
  }

  /**
   * 生成统一社会信用代码（沿用原脚本逻辑）
   * 说明：使用全局 areas 数组（原脚本依赖），通过 window.areas 访问以兼容 TS 环境
   */
  const generateCreditCode = () => {
    // 默认登记机构为工商（"9"），默认组织类别为"1"
    const regOrg = getRegOrgCode('9') || '9'
    const orgtype = '1'

    // 随机选择区域下标并读取全局 areas（保持原逻辑）
    // const randIdx = Math.floor(Math.random() * 100)
    // 通过 window.areas 获取全局定义的 areas（项目中原脚本预期存在）
    // const area = (window as any).areas ? (window as any).areas[randIdx] : '0000'
    const areasArr = (window as any).areas as string[] | undefined
    const randIdx = areasArr && areasArr.length > 0
      ? Math.floor(Math.random() * areasArr.length)
      : Math.floor(Math.random() * 100)
    let area = areasArr && areasArr.length > 0 ? String(areasArr[randIdx]) : '000000'
    // 确保 area 为 6 位（原脚本期望 6 位区域码），不足则左侧补零
    area = area.padStart(6, '0')

    // 生成 8 位随机数（10000000-99999999）
    const num = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000
    // 计算组织机构代码部分的校验位（与 orgCode 的算法一致）
    const ws = [3, 7, 9, 10, 5, 8, 4, 2]
    let sum = 0
    const s = String(num)
    for (let i = 0; i < 8; i++) {
      sum += Number(s.charAt(i)) * ws[i]
    }
    let C9: string | number = 11 - (sum % 11)
    if (C9 === 11)
      C9 = '0'
    else if (C9 === 10)
      C9 = 'X'
    else C9 = String(C9)

    // 拼接 orgCode（9位，含校验位）
    const orgCode = `${num}${C9}`

    // 拼接前17位：登记机构 + 组织类别 + 区域 + 9位orgCode
    const code17 = `${regOrg}${orgtype}${area}${orgCode}`

    // 防护检查：保证拼接后的前17位长度为 17，若不满足则提示并返回
    if (code17.length !== 17) {
      // 发生此情况说明 area 或其它部分长度异常，提前返回以避免 undefined
      toast.warning(`生成失败：前17位长度异常（${code17.length}），请检查 area 源数据`)
      return
    }

    // 计算最后一位校验（第18位），沿用原权重与映射
    let sum2 = 0
    for (let i = 0; i < 17; i++) {
      const ch = code17.charAt(i)
      const a = getMapC(ch)
      const b = getMapW(String(i + 1))
      if (typeof a === 'undefined' || typeof b === 'undefined') {
        toast.warning('生成失败：字符映射或权重缺失')
        return
      }
      sum2 += a * b
    }
    let C18 = 31 - (sum2 % 31)
    if (C18 === 31)
      C18 = 0
    const last = getMapR(String(C18))
    if (typeof last === 'undefined') {
      toast.warning('生成失败：校验映射缺失')
      return
    }

    const fullCode = `${code17}${last}`
    setCreditCode(fullCode)
    // toast.success('已生成统一社会信用代码')
  }

  return (
    <TabsContent value="creditCode">
      <Card className="p-6">
        <Toaster position="top-center" />
        <div className="min-w-36 w-full max-w-96 m-auto">

          <Button className="w-full" onClick={generateCreditCode}>生成统一社会信用代码</Button>

          {creditCode && (
            <div className="mb-4 text-center">
              <div className="flex justify-center items-center gap-2 mt-2">
                <div className="font-mono">{creditCode}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(creditCode)
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

export default CreditCode
