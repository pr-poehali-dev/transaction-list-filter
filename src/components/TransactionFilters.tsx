
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Icon from "@/components/ui/icon";

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
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onFilterChange,
  categories,
  onClearFilters,
  isExpanded,
  toggleExpand
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>({
    type: "all",
    category: "all",
    dateRange: undefined,
    searchQuery: "",
    minAmount: "",
    maxAmount: ""
  });

  // Применение фильтров
  const applyFilters = React.useCallback(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Изменение отдельных фильтров
  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  // Очистка всех фильтров
  const handleClearFilters = () => {
    setFilters({
      type: "all",
      category: "all",
      dateRange: undefined,
      searchQuery: "",
      minAmount: "",
      maxAmount: ""
    });
    onClearFilters();
  };

  React.useEffect(() => {
    // Применение фильтров при их изменении с небольшой задержкой
    const handler = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, applyFilters]);

  // Форматирование даты для отображения в календаре
  const formatDateRange = () => {
    if (!filters.dateRange?.from) return "Выберите период";
    
    if (filters.dateRange.to) {
      return `${format(filters.dateRange.from, 'dd.MM.yyyy', { locale: ru })} - ${format(filters.dateRange.to, 'dd.MM.yyyy', { locale: ru })}`;
    }
    
    return format(filters.dateRange.from, 'dd.MM.yyyy', { locale: ru });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium">Фильтры</h3>
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

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
          <div>
            <div className="mb-4">
              <p className="text-sm mb-1 font-medium">Тип</p>
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleFilterChange('type', value)}
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

            <div>
              <p className="text-sm mb-1 font-medium">Категория</p>
              <Select 
                value={filters.category} 
                onValueChange={(value) => handleFilterChange('category', value)}
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
          </div>

          <div>
            <div className="mb-4">
              <p className="text-sm mb-1 font-medium">Поиск</p>
              <div className="relative">
                <Input 
                  placeholder="Поиск транзакций..." 
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="pl-9"
                />
                <Icon 
                  name="Search" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
              </div>
            </div>

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
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => handleFilterChange('dateRange', range)}
                    numberOfMonths={2}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <p className="text-sm mb-1 font-medium">Сумма от</p>
              <Input
                type="number"
                placeholder="Мин. сумма"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </div>

            <div className="mb-4">
              <p className="text-sm mb-1 font-medium">Сумма до</p>
              <Input
                type="number"
                placeholder="Макс. сумма"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>

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
      )}
    </div>
  );
};

export default TransactionFilters;
