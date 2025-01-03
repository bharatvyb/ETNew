import React from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function MonthPicker({ selectedDate, onChange }: MonthPickerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onChange(subMonths(selectedDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <h2 className="text-lg font-medium">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={() => onChange(addMonths(selectedDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}