
import React, { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";

export interface FilterOptions {
  type: string;
  category: string;
  dateRange: DateRange | undefined;
  searchQuery: string;
  minAmount: string;
  maxAmount: string;
}

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  onClearFilters: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  initialFilters?: Partial<FilterOptions>;
}

// Вспомогательные компоненты
const FilterHeader: React.FC<{
  title: string;
  isExpanded: boolean;
  toggleExpand: () => void;
}> = ({ title, isExpanded, toggleExpand }) => (
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-base font-medium">{title}</h3>
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleExpand}
      className="text-muted-foreground"
    >
      <Icon 
        name={isExpanded ? "ChevronUp" : "ChevronDown"}
        size={18}
        className="mr-1"
      />
      {isExpanded ? "Свернуть" : "Развернуть"}
    </Button>
  </div>
);

const TypeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="mb-4">
    <p className="text-sm mb-1 font-medium">Тип</p>
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Все типы" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все типы</SelectItem>
        <SelectItem value="income">Доходы</SelectItem>
        <SelectItem value="expense">Расходы</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const CategorySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}> = ({ value, onChange, categories }) => (
  <div>
    <p className="text-sm mb-1 font-medium">Категория</p>
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Все категории" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все категории</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>{category}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="mb-4">
    <p className="text-sm mb-1 font-medium">Поиск</p>
    <div className="relative">
      <Input 
        placeholder="Поиск транзакций..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
      <Icon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        size={16}
      />
    </div>
  </div>
);

const DateRangeSelector: React.FC<{
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
}> = ({ value, onChange }) => {
  // Форматирование даты для отображения в календаре
  const formatDateRange = () => {
    if (!value?.from) return "Выберите период";
    
    if (value.to) {
      return `${format(value.from, 'dd.MM.yyyy', { locale: ru })} - ${format(value.to, 'dd.MM.yyyy', { locale: ru })}`;
    }
    
    return format(value.from, 'dd.MM.yyyy', { locale: ru });
  };

  return (
    <div>
      <p className="text-sm mb-1 font-medium">Период</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Icon name="Calendar" className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const AmountRange: React.FC<{
  minAmount: string;
  maxAmount: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}> = ({ minAmount, maxAmount, onMinChange, onMaxChange }) => (
  <>
    <div className="mb-4">
      <p className="text-sm mb-1 font-medium">Сумма от</p>
      <Input
        type="number"
        placeholder="Мин. сумма"
        value={minAmount}
        onChange={(e) => onMinChange(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <p className="text-sm mb-1 font-medium">Сумма до</p>
      <Input
        type="number"
        placeholder="Макс. сумма"
        value={maxAmount}
        onChange={(e) => onMaxChange(e.target.value)}
      />
    </div>
  </>
);

// Основной компонент
const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onFilterChange,
  categories,
  onClearFilters,
  isExpanded,
  toggleExpand,
  initialFilters
}) => {
  // Инициализация состояния с начальными значениями или дефолтными
  const defaultFilters: FilterOptions = {
    type: "all",
    category: "all",
    dateRange: undefined,
    searchQuery: "",
    minAmount: "",
    maxAmount: ""
  };

  const [filters, setFilters] = useState<FilterOptions>({
    ...defaultFilters,
    ...initialFilters
  });

  // Обработчик изменения отдельных полей фильтров
  const handleFilterChange = useCallback((name: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  }, []);

  // Сброс всех фильтров к начальным значениям
  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters);
    onClearFilters();
  }, [onClearFilters]);

  // Применение фильтров при изменении с небольшой задержкой
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, onFilterChange]);

  // Если фильтры скрыты, показываем только заголовок
  if (!isExpanded) {
    return (
      <div className="mb-4">
        <FilterHeader 
          title="Фильтры" 
          isExpanded={isExpanded} 
          toggleExpand={toggleExpand} 
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <FilterHeader 
        title="Фильтры" 
        isExpanded={isExpanded} 
        toggleExpand={toggleExpand} 
      />

      <Card className="bg-muted/30 border-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Колонка 1: Тип и Категория */}
            <div>
              <TypeSelector 
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
              />
              <CategorySelector 
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                categories={categories}
              />
            </div>

            {/* Колонка 2: Поиск и Период */}
            <div>
              <SearchInput 
                value={filters.searchQuery}
                onChange={(value) => handleFilterChange('searchQuery', value)}
              />
              <DateRangeSelector 
                value={filters.dateRange}
                onChange={(range) => handleFilterChange('dateRange', range)}
              />
            </div>

            {/* Колонка 3: Диапазон сумм и Сброс */}
            <div>
              <AmountRange 
                minAmount={filters.minAmount}
                maxAmount={filters.maxAmount}
                onMinChange={(value) => handleFilterChange('minAmount', value)}
                onMaxChange={(value) => handleFilterChange('maxAmount', value)}
              />

              <Button 
                variant="outline" 
                className="w-full mt-1"
                onClick={handleClearFilters}
              >
                <Icon name="X" className="mr-2 h-4 w-4" />
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionFilters;
