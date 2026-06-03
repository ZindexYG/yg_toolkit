"use client";

import { useState } from "react";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function Bankaccount() {
  const [bankAccount, setBankAccount] = useState<string>("");

  const generateBankAccount = () => {
    const strBin = [
      "10",
      "18",
      "30",
      "35",
      "37",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "58",
      "60",
      "62",
      "65",
      "68",
      "69",
      "84",
      "87",
      "88",
      "94",
      "95",
      "98",
      "99",
    ];
    const idx = Math.floor(Math.random() * 34);
    const start = strBin[idx];
    const max = 999999999999999;
    const min = 100000000000;
    const end = Math.floor(Math.random() * (max - min) + min);
    const first15Or18Num = `${start}${end}`;

    const newArr: string[] = [];
    for (let i = first15Or18Num.length - 1; i > -1; i--) {
      newArr.push(first15Or18Num.substr(i, 1));
    }

    const arrJiShu: number[] = [];
    const arrJiShu2: number[] = [];
    const arrOuShu: number[] = [];
    for (let j = 0; j < newArr.length; j++) {
      const n = Number.parseInt(newArr[j], 10);
      if ((j + 1) % 2 === 1) {
        const v = n * 2;
        if (v < 9) arrJiShu.push(v);
        else arrJiShu2.push(v);
      } else {
        arrOuShu.push(n);
      }
    }

    const jishuChild1: number[] = [];
    const jishuChild2: number[] = [];
    for (let h = 0; h < arrJiShu2.length; h++) {
      jishuChild1.push(Number.parseInt(String(arrJiShu2[h] % 10), 10));
      jishuChild2.push(Math.floor(arrJiShu2[h] / 10));
    }

    let sumJiShu = 0;
    for (const v of arrJiShu) sumJiShu += v;
    let sumOuShu = 0;
    for (const v of arrOuShu) sumOuShu += v;
    let sumJiShuChild1 = 0;
    for (const v of jishuChild1) sumJiShuChild1 += v;
    let sumJiShuChild2 = 0;
    for (const v of jishuChild2) sumJiShuChild2 += v;

    const sumTotal = sumJiShu + sumOuShu + sumJiShuChild1 + sumJiShuChild2;
    const k = sumTotal % 10 === 0 ? 10 : sumTotal % 10;
    const luhm = 10 - k;

    setBankAccount(`${first15Or18Num}${luhm}`);
  };

  return (
    <TabsContent value="bankaccount">
      <Card className="p-6">
        <div className="m-auto w-full min-w-36 max-w-96">
          <Button className="w-full" onClick={generateBankAccount}>
            生成银行卡号
          </Button>
          {bankAccount && (
            <div className="mb-4 text-center">
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="font-mono">{bankAccount}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(bankAccount);
                    toast.success("已复制到剪贴板");
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
  );
}
