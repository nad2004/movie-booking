'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
interface ChartProps {
  title: string;
  description: string;
  data: { name: string; value: number; color: string; unit?: string }[];
}

export function HorizontalChart({ title, description, data }: ChartProps) {

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="border-gray-100 shadow-sm h-full bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="relative group">
            {/* Label bên trái hoặc trên thanh tùy design, ở đây làm kiểu label đè lên hoặc nằm trên */}
            <div className="flex justify-between text-xs mb-1.5 text-gray-500 font-medium">
              <span>{item.name}</span>
              {/* <span>{item.value.toLocaleString()} {item.unit}</span> */}
            </div>
            
            {/* Thanh Background */}
            <div className="h-8 w-full bg-gray-50 rounded-r-md relative overflow-hidden">
              {/* Thanh Value */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${item.color} rounded-r-md flex items-center justify-end pr-3`}
                suppressHydrationWarning
              >
                {/* Chỉ hiện số nếu thanh đủ dài */}
                {(item.value / maxValue) > 0.15 && (
                    <span className="text-white text-xs font-bold">
                        {item.value.toLocaleString()} {item.unit}
                    </span>
                )}
              </motion.div>
            </div>
            
            {/* Grid line mờ (Optional) */}
            <div className="absolute top-0 bottom-0 left-[25%] border-l border-dashed border-gray-200 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-[50%] border-l border-dashed border-gray-200 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-[75%] border-l border-dashed border-gray-200 pointer-events-none" />
          </div>
        ))}
        
        {/* X-Axis Labels (Giả lập) */}
        <div className="flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-100">
            <span>0</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{maxValue}</span>
        </div>
      </CardContent>
    </Card>
  );
}