
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  id: string;
  label: string;
}

interface TabsNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  tabs, 
  activeTab,
  onChange
}) => {
  return (
    <div className="w-full mb-8">
      <Tabs value={activeTab} onValueChange={onChange} className="w-full">
        <TabsList className="w-full max-w-md bg-background border">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabsNavigation;
