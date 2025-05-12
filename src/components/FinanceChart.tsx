
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartData {
  day: string;
  income: number;
  expenses: number;
}

const chartData: ChartData[] = [
  { day: 'Пн', income: 2400, expenses: 1800 },
  { day: 'Вт', income: 1800, expenses: 2400 },
  { day: 'Ср', income: 4000, expenses: 2400 },
  { day: 'Чт', income: 4500, expenses: 2100 },
  { day: 'Пт', income: 4200, expenses: 2400 },
  { day: 'Сб', income: 5000, expenses: 3000 },
  { day: 'Вс', income: 4800, expenses: 3200 },
];

const FinanceChart: React.FC = () => {
  const [period, setPeriod] = React.useState('week');

  return (
    <Card className="w-full mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Финансовый график
        </CardTitle>
        <Tabs defaultValue="week" value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12 }}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                labelStyle={{ 
                  fontWeight: 'bold', 
                  marginBottom: '4px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="1" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1" 
                stroke="#4ade80" 
                fill="#4ade80" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceChart;
