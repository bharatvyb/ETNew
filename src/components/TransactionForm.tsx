import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { TransactionType, Transaction } from '../types';
import { format } from 'date-fns';

interface TransactionFormProps {
  type: TransactionType;
  editingTransaction?: Transaction | null;
  onSave?: () => void;
  selectedDate: Date;
}

export function TransactionForm({ 
  type, 
  editingTransaction, 
  onSave,
  selectedDate
}: TransactionFormProps) {
  const { categories, paymentMethods, addTransaction, updateTransaction } = useStore();
  const [date, setDate] = useState(selectedDate);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Set default values from categories and payment methods
  useEffect(() => {
    const defaultCategory = categories.find(c => c.isDefault);
    const defaultMethod = paymentMethods.find(m => m.isDefault);
    
    if (defaultCategory && !category) {
      setCategory(defaultCategory.id);
    }
    if (defaultMethod && !paymentMethod) {
      setPaymentMethod(defaultMethod.id);
    }
  }, [categories, paymentMethods]);

  // Load editing transaction data
  useEffect(() => {
    if (editingTransaction) {
      setDate(new Date(editingTransaction.date));
      setAmount(editingTransaction.amount.toString());
      setMemo(editingTransaction.memo);
      setCategory(editingTransaction.category);
      setPaymentMethod(editingTransaction.paymentMethod);
    }
  }, [editingTransaction]);

  // Update date when selectedDate changes
  useEffect(() => {
    if (!editingTransaction) {
      setDate(selectedDate);
    }
  }, [selectedDate, editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction = {
      type,
      date: format(date, 'yyyy-MM-dd'),
      amount: parseFloat(amount),
      memo,
      category,
      paymentMethod,
    };

    if (editingTransaction) {
      updateTransaction({ ...transaction, id: editingTransaction.id });
    } else {
      addTransaction(transaction);
    }

    // Reset form
    setAmount('');
    setMemo('');
    
    // Notify parent
    onSave?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={format(date, 'yyyy-MM-dd')}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Amount Field */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          step="0.01"
        />
      </div>

      {/* Memo Field */}
      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
          Memo
        </label>
        <input
          type="text"
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} {cat.isDefault ? '(Default)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method Field */}
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name} {method.isDefault ? '(Default)' : ''}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-medium
          ${type === 'revenue' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        `}
      >
        {editingTransaction ? 'Update' : 'Add'} {type === 'revenue' ? 'Revenue' : 'Expense'}
      </button>
    </form>
  );
}