"use client";

import { useContext, useEffect, useRef, useState } from "react";

import { ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { MarkimgContext } from "./markimg-context";

export function Preview() {
  const ctx = useContext(MarkimgContext);
  const watched = ctx?.controls?.watchedValues;

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dataURItoBlob = (dataURI: string) => {
    const arr = dataURI.split(",");
    const mimeType = arr[0].match(/:(.*?);/)![1];
    const binStr = atob(arr[1]);
    const len = binStr.length;
    const uintArr = new Uint8Array(len);
    for (let i = 0; i < len; i++) uintArr[i] = binStr.charCodeAt(i);
    return new Blob([uintArr], { type: mimeType });
  };

  const generateFileName = (format = "png") => {
    const pad = (n: number) => (n < 10 ? `0${n}` : n.toString());
    const extension = format === "jpeg" ? ".jpg" : ".png";
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${extension}`;
  };

  const processImage = (file: File) => {
    if (!file || !(file instanceof File)) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const c = canvasRef.current;
        c.width = img.width;
        c.height = img.height;
        const cctx = c.getContext("2d");
        if (!cctx) return;
        cctx.drawImage(img, 0, 0);
        setCanvas(c);
        setImage(img);
      };
      img.src = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  };

  const drawWatermark = () => {
    if (!canvas || !image || !watched) return;
    const { text, color, alpha, angle, size, space } = watched as any;
    if (!text || !color) return;

    const cctx = canvas.getContext("2d");
    if (!cctx) return;
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.drawImage(image, 0, 0);

    const colorMatch = (color as string).match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!colorMatch) return;
    const rgba = `rgba(${Number.parseInt(colorMatch[1], 16)},${Number.parseInt(colorMatch[2], 16)},${Number.parseInt(colorMatch[3], 16)},${alpha || 0.5})`;
    const textSize = (size || 1) * Math.max(15, Math.min(canvas.width, canvas.height) / 25);

    cctx.save();
    cctx.translate(canvas.width / 2, canvas.height / 2);
    cctx.rotate(((angle || 0) * Math.PI) / 180);
    cctx.fillStyle = rgba;
    cctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;

    const width = cctx.measureText(text).width;
    const step = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
    const margin = cctx.measureText("国").width;
    const x = Math.ceil(step / (width + margin));
    const y = Math.ceil(step / (space * textSize) / 2);

    for (let i = -x; i <= x; i++) {
      for (let j = -y; j <= y; j++) {
        cctx.fillText(text, (width + margin) * i, space * textSize * j);
      }
    }
    cctx.restore();
  };

  const handleDownload = () => {
    if (!canvas || !watched) return;
    const format = watched.format || "png";
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const quality = format === "jpeg" ? 0.9 : undefined;
    const imageData = quality !== undefined ? canvas.toDataURL(mimeType, quality) : canvas.toDataURL(mimeType);
    const blob = dataURItoBlob(imageData);
    const link = document.createElement("a");
    link.download = generateFileName(format);
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    if (watched?.imageFile && watched.imageFile instanceof File) {
      processImage(watched.imageFile);
    }
  }, [watched?.imageFile]);

  useEffect(() => {
    if (canvas && image && watched) drawWatermark();
  }, [
    canvas,
    image,
    watched?.text,
    watched?.color,
    watched?.alpha,
    watched?.size,
    watched?.angle,
    watched?.space,
    watched?.format,
  ]);

  return (
    <Card className="h-full gap-2">
      <CardHeader className="flex items-end font-medium">
        <div>预览</div>
        <div className="text-center text-sm text-gray-500">点击带水印的图片即可下载</div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="flex min-h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
          onClick={handleDownload}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: image ? "block" : "none" }} />
          {!image && (
            <div className="text-center text-gray-500">
              <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium">选择图片进行预览</p>
              <p className="mt-1 text-sm">添加水印的图片将在此显示</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
