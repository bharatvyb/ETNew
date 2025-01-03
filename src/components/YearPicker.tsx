import React from 'react';
import { format, addYears, subYears } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearPickerProps {
  selectedYear: Date;
  onChange: (date: Date) => void;
}

export function YearPicker({ selectedYear, onChange }: YearPickerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onChange(subYears(selectedYear, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <h2 className="text-lg font-medium">
          {format(selectedYear, 'yyyy')}
        </h2>
        
        <button
          onClick={() => onChange(addYears(selectedYear, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}