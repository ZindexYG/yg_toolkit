"use client";

import { useState } from "react";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

const HAO_DUAN = [
  "130",
  "131",
  "132",
  "133",
  "134",
  "135",
  "136",
  "137",
  "138",
  "139",
  "145",
  "147",
  "150",
  "151",
  "152",
  "153",
  "156",
  "157",
  "158",
  "159",
  "170",
  "176",
  "177",
  "178",
  "180",
  "181",
  "182",
  "183",
  "184",
  "185",
  "186",
  "187",
  "188",
  "189",
];

export function PhoneNo() {
  const [phoneNo, setPhoneNo] = useState<string>("");

  const generatePhoneNo = () => {
    const idx = Math.floor(Math.random() * HAO_DUAN.length);
    const prefix = HAO_DUAN[idx];
    const max = 99999999;
    const min = 10000000;
    const num = Math.floor(Math.random() * (max - min) + min);
    setPhoneNo(`${prefix}${num}`);
  };

  return (
    <TabsContent value="phoneNo">
      <Card className="p-6">
        <div className="m-auto w-full min-w-36 max-w-96">
          <Button className="w-full" onClick={generatePhoneNo}>
            生成手机号码
          </Button>
          {phoneNo && (
            <div className="mb-4 text-center">
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="font-mono">{phoneNo}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(phoneNo);
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
