import React from "react";
import { TrendingUp } from "lucide-react";
import BaseCard, {
  BaseCardProps,
} from "@/components/custom/dashboard/base-card";

export const CityCard: React.FC<BaseCardProps> = (props) => {
  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>Urban voter participation up 5.1%</span>
      </div>
      <div className='mt-1'>Highest turnout: New York City</div>
    </div>
  );
  return (
    <BaseCard
      {...props}
      // footerContent={footerContent}
    >
      {/* Add cities-specific content here */}
      <div className='flex flex-col items-center justify-center h-full min-h-[200px]'>
        <TrendingUp className='h-6 w-6 text-muted-foreground mb-2' />
        <span className='text-muted-foreground'>
          This section is under construction
        </span>
      </div>
    </BaseCard>
  );
};

export default CityCard;
