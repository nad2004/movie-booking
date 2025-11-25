"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { kpiData } from "../constants/mockData";

export function KpiStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiData.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative h-full">
              <div className={`absolute top-0 right-0 p-3 opacity-10`}>
                <Icon className="w-24 h-24" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {item.label}
                </CardTitle>
                <div className={`${item.color} bg-opacity-10 p-2 rounded-lg`}>
                  <span className="text-xl">{item.emoji}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Badge variant="secondary" className="text-green-600 bg-green-50 font-normal">
                    {item.change}
                  </Badge>
                  so với tháng trước
                </span>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}