import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/currency';
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { ChevronRight, TrendingUp, TrendingDown, Wallet2 } from 'lucide-react';
import { YearPicker } from '../components/YearPicker';
import { YearlySearch } from '../components/YearlySearch';
import { TotalSummaryDialog } from '../components/TotalSummaryDialog';
import { Card } from '../components/common';
import { Transaction } from '../types';

interface TotalTabProps {
  onMonthSelect: (date: Date) => void;
}

export function TotalTab({ onMonthSelect }: TotalTabProps) {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[] | null>(null);
  const { transactions } = useStore();

  // Filter transactions for selected year
  const yearStart = startOfYear(selectedYear);
  const yearEnd = endOfYear(selectedYear);
  
  const yearTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date >= yearStart && date <= yearEnd;
  });

  // Use filtered transactions if available, otherwise use year transactions
  const displayTransactions = filteredTransactions || yearTransactions;

  // Calculate yearly totals
  const yearlyTotals = displayTransactions.reduce((acc, t) => {
    if (t.type === 'revenue') acc.revenue += t.amount;
    else acc.expenses += t.amount;
    return acc;
  }, { revenue: 0, expenses: 0 });

  const yearlyBalance = yearlyTotals.revenue - yearlyTotals.expenses;

  // Get all months in the year
  const monthsInYear = eachMonthOfInterval({
    start: yearStart,
    end: yearEnd
  });

  // Calculate totals for each month
  const monthlyData = monthsInYear.map(month => {
    const monthKey = format(month, 'yyyy-MM');
    const monthTransactions = displayTransactions.filter(t => 
      format(new Date(t.date), 'yyyy-MM') === monthKey
    );

    const revenue = monthTransactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'outgo')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = revenue - expenses;

    return {
      month,
      monthKey,
      revenue,
      expenses,
      balance,
      hasTransactions: monthTransactions.length > 0
    };
  }).filter(data => data.hasTransactions)
    .sort((a, b) => b.month.getTime() - a.month.getTime());

  return (
    <div className="space-y-4">
      <YearPicker selectedYear={selectedYear} onChange={setSelectedYear} />

      <div 
        onClick={() => setShowSummaryDialog(true)}
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-blue-900">Yearly Summary</h3>
          <Wallet2 className="h-6 w-6 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(yearlyTotals.revenue)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              <span className="text-sm font-medium">Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(yearlyTotals.expenses)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Wallet2 className="h-5 w-5" />
              <span className="text-sm font-medium">Balance</span>
            </div>
            <div className={`text-xl font-bold ${yearlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(yearlyBalance)}
            </div>
          </div>
        </div>
      </div>

      <YearlySearch 
        transactions={yearTransactions}
        onFilter={setFilteredTransactions}
        selectedYear={selectedYear}
      />

      <div className="space-y-2">
        {monthlyData.map(({ month, revenue, expenses, balance }) => (
          <Card
            key={format(month, 'yyyy-MM')}
            onClick={() => onMonthSelect(month)}
            className={`hover:shadow-md transition-shadow ${
              balance >= 0 
                ? 'hover:bg-green-50/50' 
                : 'hover:bg-red-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">
                    {format(month, 'MMMM yyyy')}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="font-medium text-green-600">
                      {formatCurrency(revenue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Expenses</div>
                    <div className="font-medium text-red-600">
                      {formatCurrency(expenses)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Balance</div>
                    <div className={`font-medium ${
                      balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(balance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showSummaryDialog && (
        <TotalSummaryDialog 
          selectedYear={selectedYear}
          onClose={() => setShowSummaryDialog(false)} 
        />
      )}
    </div>
  );
}