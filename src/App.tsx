import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { RecordTab } from './tabs/RecordTab';
import { MonthlyTab } from './tabs/MonthlyTab';
import { TotalTab } from './tabs/TotalTab';
import { SettingsTab } from './tabs/SettingsTab';
import { Transaction } from './types';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const tabs = [
    <RecordTab 
      key="record" 
      initialTransaction={editingTransaction}
      onTransactionSaved={() => setEditingTransaction(null)}
    />,
    <MonthlyTab 
      key="monthly" 
      onEditTransaction={setEditingTransaction}
    />,
    <TotalTab 
      key="total" 
      onMonthSelect={(date) => {
        setActiveTab(1);
      }} 
    />,
    <SettingsTab key="settings" />
  ];

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {tabs[activeTab]}
    </Layout>
  );
}

export default App;