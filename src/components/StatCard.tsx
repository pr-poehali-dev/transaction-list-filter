
import React from 'react';
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface StatCardProps {
  title: string;
  amount: number;
  percentChange: number;
  bgColor: string;
  textColor?: string;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  percentChange,
  bgColor,
  textColor = "text-white",
  icon
}) => {
  const formattedAmount = new Intl.NumberFormat('ru-RU').format(amount);
  const isPositive = percentChange >= 0;
  
  return (
    <Card className={`${bgColor} ${textColor} p-5 flex flex-col h-full w-full`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {icon && (
          <div className="opacity-80">
            <Icon name={icon} size={20} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-3xl font-bold">{formattedAmount} ₽</span>
        <div className={`flex items-center text-sm ${isPositive ? 'opacity-80' : 'opacity-70'}`}>
          <Icon 
            name={isPositive ? "TrendingUp" : "TrendingDown"} 
            size={16} 
            className="mr-1" 
          />
          <span>{isPositive ? '+' : ''}{percentChange}% с прошлого месяца</span>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
