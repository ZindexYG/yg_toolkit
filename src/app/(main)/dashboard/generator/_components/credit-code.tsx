"use client";

import { useState } from "react";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import { getAllDistrictCodes } from "./utils/area-utils";

const CHAR_TO_VALUE: Record<string, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  P: 23,
  Q: 24,
  R: 25,
  T: 26,
  U: 27,
  W: 28,
  X: 29,
  Y: 30,
};

const POSITION_WEIGHT: Record<string, number> = {
  "1": 1,
  "2": 3,
  "3": 9,
  "4": 27,
  "5": 19,
  "6": 26,
  "7": 16,
  "8": 17,
  "9": 20,
  "10": 29,
  "11": 25,
  "12": 13,
  "13": 8,
  "14": 24,
  "15": 10,
  "16": 30,
  "17": 28,
};

const VALUE_TO_CHAR: Record<string, string> = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "A",
  "11": "B",
  "12": "C",
  "13": "D",
  "14": "E",
  "15": "F",
  "16": "G",
  "17": "H",
  "18": "J",
  "19": "K",
  "20": "L",
  "21": "M",
  "22": "N",
  "23": "P",
  "24": "Q",
  "25": "R",
  "26": "T",
  "27": "U",
  "28": "W",
  "29": "X",
  "30": "Y",
  "31": "0",
};

export function CreditCode() {
  const [creditCode, setCreditCode] = useState<string>("");

  const generateCreditCode = () => {
    const regOrg = "9";
    const orgtype = "1";

    const codes = getAllDistrictCodes();
    const randIdx = Math.floor(Math.random() * codes.length);
    const area = String(codes[randIdx] || "000000").padStart(6, "0");

    const num = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    const ws = [3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    const s = String(num);
    for (let i = 0; i < 8; i++) {
      sum += Number(s.charAt(i)) * ws[i];
    }
    let c9: string | number = 11 - (sum % 11);
    if (c9 === 11) c9 = "0";
    else if (c9 === 10) c9 = "X";
    else c9 = String(c9);
    const orgCode = `${num}${c9}`;
    const code17 = `${regOrg}${orgtype}${area}${orgCode}`;

    if (code17.length !== 17) {
      toast.warning(`生成失败：前17位长度异常（${code17.length}）`);
      return;
    }

    let sum2 = 0;
    for (let i = 0; i < 17; i++) {
      const ch = code17.charAt(i);
      const a = CHAR_TO_VALUE[ch];
      const b = POSITION_WEIGHT[String(i + 1)];
      if (a === undefined || b === undefined) {
        toast.warning("生成失败：字符映射或权重缺失");
        return;
      }
      sum2 += a * b;
    }
    let c18: number | string = 31 - (sum2 % 31);
    if (c18 === 31) c18 = 0;
    const last = VALUE_TO_CHAR[String(c18)];
    if (last === undefined) {
      toast.warning("生成失败：校验映射缺失");
      return;
    }

    setCreditCode(`${code17}${last}`);
  };

  return (
    <TabsContent value="creditCode">
      <Card className="p-6">
        <div className="m-auto w-full min-w-36 max-w-96">
          <Button className="w-full" onClick={generateCreditCode}>
            生成统一社会信用代码
          </Button>
          {creditCode && (
            <div className="mb-4 text-center">
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="font-mono">{creditCode}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(creditCode);
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
