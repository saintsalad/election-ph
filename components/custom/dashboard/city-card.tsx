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
    <BaseCard {...props} footerContent={footerContent}>
      {/* Add cities-specific content here */}
    </BaseCard>
  );
};

export default CityCard;
