import React, { useState, useEffect } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export interface BaseCardProps {
  title: string;
  description?: string;
  expanded: boolean;
  onToggle: () => void;
  fullWidth: boolean;
  isMainCard?: boolean;
  footerContent?: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps & { children?: React.ReactNode }> = ({
  title,
  description,
  expanded,
  onToggle,
  fullWidth,
  isMainCard = false,
  footerContent,
  children,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (expanded) {
      setIsExpanding(true);
      const timer = setTimeout(() => setIsExpanding(false), 300);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  const showFooter = isMainCard || expanded;

  return (
    <Card
      className={`overflow-hidden ${
        fullWidth ? "w-full h-full" : "w-full"
      } transition-all duration-300 ${
        isExpanding ? "animate-in zoom-in-95" : ""
      } flex flex-col lg:h-full`}>
      <CardHeader className='relative flex-shrink-0'>
        <div className='flex justify-between items-center'>
          <CardTitle>{title}</CardTitle>
          <button
            onClick={onToggle}
            className='text-gray-500 hover:text-gray-700 transition-colors duration-200'>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        {expanded && description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className='px-2 md:p-6 flex-grow overflow-auto'>
        {children}
      </CardContent>
      {showFooter && (
        <CardFooter className='text-sm text-muted-foreground flex-shrink-0'>
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};

export default BaseCard;
