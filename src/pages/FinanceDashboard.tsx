import React, { useState } from "react";
import FinanceHeader from "@/components/FinanceHeader";
import TabsNavigation from "@/components/TabsNavigation";
import StatCard from "@/components/StatCard";
import FinanceChart from "@/components/FinanceChart";
// Импортируем новый компонент для улучшенного списка транзакций
import EnhancedTransactionList from "@/components/EnhancedTransactionList";

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "income", label: "Доходы" },
  { id: "expenses", label: "Расходы" },
];

// Расширенный список транзакций для демонстрации
const sampleTransactions = [
  {
    id: "1",
    title: "Зарплата",
    amount: 78000,
    date: "15 мая 2025",
    category: "Доход",
    type: "income" as const,
  },
  {
    id: "2",
    title: "Супермаркет",
    amount: 3450,
    date: "12 мая 2025",
    category: "Продукты",
    type: "expense" as const,
  },
  {
    id: "3",
    title: "Кафе",
    amount: 1200,
    date: "10 мая 2025",
    category: "Развлечения",
    type: "expense" as const,
  },
  {
    id: "4",
    title: "Фриланс проект",
    amount: 15000,
    date: "08 мая 2025",
    category: "Дополнительный доход",
    type: "income" as const,
  },
  {
    id: "5",
    title: "Коммунальные платежи",
    amount: 5600,
    date: "05 мая 2025",
    category: "Жилье",
    type: "expense" as const,
  },
  {
    id: "6",
    title: "Такси",
    amount: 480,
    date: "04 мая 2025",
    category: "Транспорт",
    type: "expense" as const,
  },
  {
    id: "7",
    title: "Подписка на сервисы",
    amount: 899,
    date: "03 мая 2025",
    category: "Развлечения",
    type: "expense" as const,
  },
  {
    id: "8",
    title: "Возврат долга",
    amount: 5000,
    date: "01 мая 2025",
    category: "Прочее",
    type: "income" as const,
  },
];

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Функции для работы с транзакциями
  const handleViewAllTransactions = () => {
    console.log("Показать все транзакции");
    // Здесь можно добавить переход на страницу со всеми транзакциями
  };

  const handleEditTransaction = (transaction: any) => {
    console.log("Редактировать транзакцию:", transaction);
    // Здесь можно открыть модальное окно для редактирования
  };

  const handleDeleteTransaction = (transactionId: string) => {
    console.log("Удалить транзакцию:", transactionId);
    // Здесь можно показать подтверждение удаления
  };

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

      {/* Заменяем старый компонент на новый улучшенный список транзакций */}
      <EnhancedTransactionList
        title="Последние транзакции"
        transactions={sampleTransactions}
        onViewAll={handleViewAllTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default FinanceDashboard;
