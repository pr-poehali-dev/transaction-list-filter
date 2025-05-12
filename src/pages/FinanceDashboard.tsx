
import React, { useState } from 'react';
import FinanceHeader from '@/components/FinanceHeader';
import TabsNavigation from '@/components/TabsNavigation';
import StatCard from '@/components/StatCard';
import FinanceChart from '@/components/FinanceChart';
import TransactionList from '@/components/TransactionList';

const tabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'income', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
];

// Пример транзакций для демонстрации
const sampleTransactions = [
  { 
    id: '1', 
    title: 'Зарплата', 
    amount: 78000, 
    date: '15 мая 2025', 
    category: 'Доход', 
    type: 'income' as const 
  },
  { 
    id: '2', 
    title: 'Супермаркет', 
    amount: 3450, 
    date: '12 мая 2025', 
    category: 'Продукты', 
    type: 'expense' as const 
  },
  { 
    id: '3', 
    title: 'Кафе', 
    amount: 1200, 
    date: '10 мая 2025', 
    category: 'Развлечения', 
    type: 'expense' as const 
  },
];

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <FinanceHeader 
        title="Учет финансов" 
        description="Отслеживайте свои доходы и расходы" 
      />
      
      <TabsNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Баланс" 
          amount={145000} 
          percentChange={12} 
          bgColor="bg-violet-500" 
          icon="Wallet"
        />
        <StatCard 
          title="Доходы" 
          amount={78000} 
          percentChange={5} 
          bgColor="bg-green-500"
          icon="TrendingUp" 
        />
        <StatCard 
          title="Расходы" 
          amount={53000} 
          percentChange={-3} 
          bgColor="bg-red-500" 
          icon="TrendingDown"
        />
      </div>
      
      <FinanceChart />
      
      <TransactionList transactions={sampleTransactions} />
    </div>
  );
};

export default FinanceDashboard;
