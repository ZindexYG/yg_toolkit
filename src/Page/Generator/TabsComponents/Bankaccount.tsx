import { Clipboard } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { TabsContent } from '@/components/ui/tabs'

function Bankaccount() {
  const [bankAccount, setBankAccount] = useState<string>('')

  // 生成银行卡号（移植自 bankaccount.js 的 generatorBankAccount）
  const generateBankAccount = () => {
    // 开头数组（保持原顺序与内容）
    const strBin = ['10', '18', '30', '35', '37', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '58', '60', '62', '65', '68', '69', '84', '87', '88', '94', '95', '98', '99']
    // 随机选择开头索引（原脚本用 parseInt(Math.random()*34)）
    const idx = Math.floor(Math.random() * 34)
    const start = strBin[idx]
    // 原脚本使用的范围：min (100000000000) 到 max (999999999999999)
    const max = 999999999999999
    const min = 100000000000
    // 生成中间随机数字（与原脚本语义一致，去除小数部分）
    const end = Math.floor((Math.random() * (max - min)) + min)
    // 拼接前置部分（原脚本称 first15Or18Num）
    const first15Or18Num = `${start}${end}`

    // 把前置部分倒序存入数组（与原逻辑一致）
    const newArr: string[] = []
    for (let i = first15Or18Num.length - 1; i > -1; i--) {
      newArr.push(first15Or18Num.substr(i, 1))
    }

    // 按 Luhm 规则拆分奇偶位并计算乘积
    const arrJiShu: number[] = [] // 奇数位*2 < 9
    const arrJiShu2: number[] = [] // 奇数位*2 >= 10
    const arrOuShu: number[] = [] // 偶数位（原始值）
    for (let j = 0; j < newArr.length; j++) {
      const n = Number.parseInt(newArr[j], 10)
      if ((j + 1) % 2 === 1) { // 奇数位（从右向左编号）
        const v = n * 2
        if (v < 9)
          arrJiShu.push(v)
        else arrJiShu2.push(v)
      }
      else { // 偶数位
        arrOuShu.push(n)
      }
    }

    // 处理大于9的奇数位乘积，拆分十位与个位并求和
    const jishu_child1: number[] = [] // 个位
    const jishu_child2: number[] = [] // 十位（实际为 v/10）
    for (let h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(Number.parseInt(String(arrJiShu2[h] % 10), 10))
      jishu_child2.push(Math.floor(arrJiShu2[h] / 10))
    }

    // 计算各部分之和
    let sumJiShu = 0
    for (let m = 0; m < arrJiShu.length; m++) sumJiShu += arrJiShu[m]

    let sumOuShu = 0
    for (let n2 = 0; n2 < arrOuShu.length; n2++) sumOuShu += arrOuShu[n2]

    let sumJiShuChild1 = 0
    for (let p = 0; p < jishu_child1.length; p++) sumJiShuChild1 += jishu_child1[p]

    let sumJiShuChild2 = 0
    for (let q = 0; q < jishu_child2.length; q++) sumJiShuChild2 += jishu_child2[q]

    // 总和与 Luhm 校验位计算（保持原公式）
    const sumTotal = sumJiShu + sumOuShu + sumJiShuChild1 + sumJiShuChild2
    const k = (sumTotal % 10) === 0 ? 10 : (sumTotal % 10)
    const luhm = 10 - k

    // 最终卡号 = 前置 + 校验位
    const full = `${first15Or18Num}${luhm}`
    setBankAccount(full)
    // if (typeof toast === 'function')
    //   toast.success('已生成银行卡号')
  }

  return (
    <TabsContent value="bankaccount">
      <Card className="p-6">
        <Toaster position="top-center" />
        <div className="min-w-36 w-full max-w-96 m-auto">

          <Button className="w-full" onClick={generateBankAccount}>生成银行卡号</Button>

          {/* 显示已生成的银行卡号并支持复制 */}
          {bankAccount && (
            <div className="mb-4 text-center">
              <div className="flex justify-center items-center gap-2 mt-2">
                <div className="font-mono">{bankAccount}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(bankAccount)
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

export default Bankaccount
