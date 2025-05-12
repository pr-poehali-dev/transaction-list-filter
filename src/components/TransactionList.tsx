
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions = [], 
  isLoading = false 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          Последние транзакции
        </CardTitle>
        <a 
          href="#" 
          className="text-sm text-violet-500 hover:text-violet-600 font-medium hover:underline"
        >
          Смотреть все
        </a>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <div className="flex justify-center mb-2">
              <Icon name="Receipt" size={32} className="opacity-40" />
            </div>
            <p>Транзакции будут отображаться здесь</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Icon 
                      name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                      className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.title}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} 
                  {new Intl.NumberFormat('ru-RU').format(transaction.amount)} ₽
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
