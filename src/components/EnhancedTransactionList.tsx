import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import TransactionFilters, { FilterOptions } from "./TransactionFilters";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  description?: string;
}

interface EnhancedTransactionListProps {
  title?: string;
  transactions: Transaction[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

const ITEMS_PER_PAGE = 5;

const EnhancedTransactionList: React.FC<EnhancedTransactionListProps> = ({
  title = "Транзакции",
  transactions = [],
  isLoading = false,
  onViewAll,
  onEdit,
  onDelete,
}) => {
  // Состояние фильтров
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    category: "all",
    dateRange: undefined,
    searchQuery: "",
    minAmount: "",
    maxAmount: "",
  });

  // Состояние раскрытия фильтров
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);

  // Получение уникальных категорий из транзакций
  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category)));
  }, [transactions]);

  // Применение фильтров к транзакциям
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Фильтр по типу
      if (filters.type !== "all" && transaction.type !== filters.type) {
        return false;
      }

      // Фильтр по категории
      if (
        filters.category !== "all" &&
        transaction.category !== filters.category
      ) {
        return false;
      }

      // Фильтр по поисковому запросу
      if (
        filters.searchQuery &&
        !transaction.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Фильтр по минимальной сумме
      if (filters.minAmount && transaction.amount < Number(filters.minAmount)) {
        return false;
      }

      // Фильтр по максимальной сумме
      if (filters.maxAmount && transaction.amount > Number(filters.maxAmount)) {
        return false;
      }

      // Фильтр по диапазону дат
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const transactionDate = new Date(transaction.date);

        if (
          filters.dateRange.from &&
          transactionDate < filters.dateRange.from
        ) {
          return false;
        }

        if (filters.dateRange.to) {
          // Устанавливаем конец дня для to даты, чтобы включить весь день
          const toDateEnd = new Date(filters.dateRange.to);
          toDateEnd.setHours(23, 59, 59, 999);

          if (transactionDate > toDateEnd) {
            return false;
          }
        }
      }

      return true;
    });
  }, [transactions, filters]);

  // Пагинация
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  // Вычисление общего количества страниц
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };

  // Обработчик сброса фильтров
  const handleClearFilters = () => {
    setFilters({
      type: "all",
      category: "all",
      dateRange: undefined,
      searchQuery: "",
      minAmount: "",
      maxAmount: "",
    });
    setCurrentPage(1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          {title}
          {filteredTransactions.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredTransactions.length}{" "}
              {filteredTransactions.length === 1
                ? "запись"
                : filteredTransactions.length < 5
                  ? "записи"
                  : "записей"}
              )
            </span>
          )}
        </CardTitle>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
          >
            <Icon name="SlidersHorizontal" size={16} className="mr-1" />
            Фильтры
          </Button>

          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-violet-500 hover:text-violet-600 hover:bg-violet-50"
            >
              Все транзакции
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <TransactionFilters
          onFilterChange={handleFilterChange}
          categories={categories}
          onClearFilters={handleClearFilters}
          isExpanded={filtersExpanded}
          toggleExpand={() => setFiltersExpanded(!filtersExpanded)}
        />

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
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <div className="flex justify-center mb-2">
              <Icon name="Search" size={32} className="opacity-40" />
            </div>
            <p>Транзакций не найдено</p>
            {Object.values(filters).some(
              (v) => v !== "all" && v !== "" && v !== undefined,
            ) && (
              <Button
                variant="link"
                onClick={handleClearFilters}
                className="mt-2 text-violet-500"
              >
                Сбросить фильтры
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {paginatedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 px-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <Icon
                        name={
                          transaction.type === "income"
                            ? "ArrowDownLeft"
                            : "ArrowUpRight"
                        }
                        className={
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center bg-muted px-1.5 py-0.5 rounded text-xs font-medium mr-1">
                          {transaction.category}
                        </span>
                        {transaction.date}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 italic max-w-[250px] truncate">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {new Intl.NumberFormat("ru-RU").format(
                        transaction.amount,
                      )}{" "}
                      ₽
                    </span>

                    <div className="flex items-center ml-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onEdit(transaction)}
                        >
                          <Icon name="Pencil" size={16} />
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => onDelete(transaction.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTransactionList;
