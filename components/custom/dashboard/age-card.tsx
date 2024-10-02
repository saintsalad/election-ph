import React from "react";
import { TrendingUp } from "lucide-react";
import BaseCard, {
  BaseCardProps,
} from "@/components/custom/dashboard/base-card";

const AgeCard: React.FC<BaseCardProps> = (props) => {
  const footerContent = (
    <div className='ml-auto text-right'>
      <div className='flex items-center justify-end space-x-2'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <span>Youth voter turnout increased by 6.5%</span>
      </div>
      <div className='mt-1'>Largest voting bloc: Ages 35-44</div>
    </div>
  );

  return (
    <BaseCard
      {...props}
      // footerContent={footerContent}
    >
      {/* Add age-specific content here */}
      <div className='flex flex-col items-center justify-center h-full min-h-[200px]'>
        <TrendingUp className='h-6 w-6 text-muted-foreground mb-2' />
        <span className='text-muted-foreground'>
          This section is under construction
        </span>
      </div>
    </BaseCard>
  );
};

export default AgeCard;
