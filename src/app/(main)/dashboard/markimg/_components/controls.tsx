"use client";

import { useContext, useEffect } from "react";

import { CloudUpload } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { MarkimgContext, type MarkimgFormValues } from "./markimg-context";

export function Controls() {
  const form = useForm<MarkimgFormValues>({
    defaultValues: {
      imageFile: null,
      text: "",
      color: "#FFF",
      alpha: 0.1,
      angle: 50,
      space: 3,
      size: 1,
      format: "png",
    },
  });

  const { register, setValue } = form;
  const watchedValues = useWatch<MarkimgFormValues>({ control: form.control });
  const markimgCtx = useContext(MarkimgContext);

  useEffect(() => {
    if (markimgCtx?.setControls) {
      markimgCtx.setControls({ form, watchedValues });
    }
  }, [watchedValues]);

  return (
    <Card className="h-full">
      <Form {...form}>
        <form>
          <CardHeader className="font-medium">选择本地图片</CardHeader>
          <CardContent className="relative">
            <Input
              {...register("imageFile")}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              placeholder="图片地址"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null;
                setValue("imageFile", file);
              }}
            />
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50">
              <CloudUpload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="font-medium text-gray-600">点击选择设备中的图片</p>
              <p className="mt-1 text-sm text-gray-400">支持 PNG、JPG、GIF - 本地处理</p>
            </div>
          </CardContent>

          <CardHeader className="font-medium">水印文字</CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Input className="col-span-2" type="text" placeholder="水印文字" {...register("text")} />
            <div className="flex flex-wrap gap-3">
              <div>水印颜色</div>
              <Input defaultValue={watchedValues?.color} type="color" {...register("color")} />
            </div>
            <div className="flex flex-wrap gap-3">
              <div>透明度</div>
              <Input type="range" min="0" max="1" step="0.05" {...register("alpha")} />
            </div>
            <div className="flex flex-wrap gap-3">
              <div>角度</div>
              <Input type="range" min="-90" max="90" step="3" {...register("angle")} />
            </div>
            <div className="flex flex-wrap gap-3">
              <div>间距</div>
              <Input type="range" min="1" max="8" step="0.2" {...register("space")} />
            </div>
            <div className="flex flex-wrap gap-3">
              <div>字体大小</div>
              <Input type="range" min="0.5" max="3" step="0.05" {...register("size")} />
            </div>
            <input type="hidden" {...register("format")} />
            <div className="flex flex-wrap gap-3">
              <div>导出格式</div>
              <Select onValueChange={(value: string) => setValue("format", value)} value={watchedValues?.format}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
