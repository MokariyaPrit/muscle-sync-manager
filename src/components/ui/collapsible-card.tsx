
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  headerActions?: React.ReactNode;
  style?: React.CSSProperties;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  children,
  icon,
  defaultCollapsed = false,
  className,
  headerActions,
  style
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <Card 
      className={cn(
        "transition-all duration-300 ease-in-out hover:shadow-lg",
        "border border-gray-200 bg-white/50 backdrop-blur-sm",
        className
      )}
      style={style}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            {icon}
            <span className="truncate">{title}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {headerActions}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "max-h-0" : "max-h-[2000px]"
      )}>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </div>
    </Card>
  );
};
