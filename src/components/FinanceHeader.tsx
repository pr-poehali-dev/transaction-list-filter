
import React from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface FinanceHeaderProps {
  title: string;
  description: string;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Button className="bg-violet-500 hover:bg-violet-600 text-white mt-4 md:mt-0">
        <Icon name="Plus" className="mr-1 h-4 w-4" />
        Добавить
      </Button>
    </div>
  );
};

export default FinanceHeader;
