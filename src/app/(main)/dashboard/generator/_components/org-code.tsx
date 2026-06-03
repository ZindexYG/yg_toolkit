"use client";

import { useState } from "react";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function OrgCode() {
  const [orgCode, setOrgCode] = useState<string>("");

  const generateOrgCode = () => {
    const max = 99999999;
    const min = 10000000;
    const num = Math.floor(Math.random() * (max - min) + min);
    const ws = [3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += Number(`${num}`.charAt(i)) * ws[i];
    }
    let c9: string | number = 11 - (sum % 11);
    if (c9 === 11) c9 = "0";
    else if (c9 === 10) c9 = "X";
    else c9 = `${c9}`;
    setOrgCode(`${num}-${c9}`);
  };

  return (
    <TabsContent value="orgCode">
      <Card className="p-6">
        <div className="m-auto w-full min-w-36 max-w-96">
          <Button className="w-full" onClick={generateOrgCode}>
            生成组织机构代码
          </Button>
          {orgCode && (
            <div className="mb-4 text-center">
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="font-mono">{orgCode}</div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(orgCode);
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
