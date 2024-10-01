import React, { useState } from 'react';
import './App.css';

interface Expense {
  id: number;
  name: string;
  amount: number;
  category: string;
}

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: number) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete }) => (
  <div className='list'>
    <p>
      {expense.name} - {expense.amount} тг ({expense.category})
      <button onClick={() => onDelete(expense.id)}>Удалить</button>
    </p>
  </div>
);

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Entertainment');

  const addExpense = () => {
    if (name === '' || amount === '') {
      return alert('Нельзя добавить пустой список');
    }

    setExpenses([
      ...expenses,
      { id: Date.now(), name, amount: parseFloat(amount), category }
    ]);
    setName('');
    setAmount('');
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryDistribution = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const renderBar = () => {
    return Object.keys(categoryDistribution).map((category) => {
      const percent = (categoryDistribution[category] / totalAmount) * 100;
      return (
        <div
          key={category}
          style={{
            backgroundColor: getCategoryColor(category),
            width: `${percent}%`,
            height: '30px',
          }}
        >
          {category} ({Math.round(percent)}%)
        </div>
      );
    });
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Entertainment':
        return 'lightblue';
      case 'Car':
        return 'lightgreen';
      case 'Food':
        return 'lightcoral';
      default:
        return 'gray';
    }
  };

  return (
    <div className='app'>
      <h1>Учет персональных финансов</h1>
      <div className='inputThing'>
        <input
          type='text'
          value={name}
          placeholder='Название траты'
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type='number'
          value={amount}
          placeholder='Сумма'
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value='Entertainment'>Entertainment</option>
          <option value='Car'>Car</option>
          <option value='Food'>Food</option>
        </select>
        <button onClick={addExpense}>Добавить</button>
      </div>

      <h2>Список затрат</h2>
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={deleteExpense} />
      ))}

      <h2>Общая сумма: {totalAmount} тг</h2>

      <h2>Распределение по категориям</h2>
      <div style={{ display: 'flex', width: '100%', border: '1px solid black' }}>
        {renderBar()}
      </div>
    </div>
  );
};

export default App;
