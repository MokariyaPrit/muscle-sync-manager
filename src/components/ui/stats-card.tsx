
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className
}) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 ease-in-out",
      "hover:shadow-xl hover:-translate-y-1 hover:scale-105",
      "border border-gray-200 bg-gradient-to-br from-white to-gray-50/50",
      "backdrop-blur-sm cursor-pointer",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
          {title}
        </CardTitle>
        <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {value}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {subtitle && (
            <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "text-green-600 bg-green-100" 
                : "text-red-600 bg-red-100"
            )}>
              {trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
