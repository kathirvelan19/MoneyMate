import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Edit2, Check, X } from 'lucide-react';
import { Transaction } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface BudgetTrackerProps {
  transactions: Transaction[];
}

export const BudgetTracker = ({ transactions }: BudgetTrackerProps) => {
  const { user } = useAuth();
  const { currency } = useTheme();
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const currentMonth = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .maybeSingle();

    if (data) {
      setBudgetLimit(Number(data.limit_amount));
    }
  };

  const saveBudget = async () => {
    if (!user) return;

    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('budgets')
          .update({ limit_amount: amount })
          .eq('id', existing.id);
      } else {
        await supabase.from('budgets').insert({
          user_id: user.id,
          month: currentMonth,
          limit_amount: amount,
        });
      }

      setBudgetLimit(amount);
      setIsEditing(false);
      setInputValue('');
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const currentMonthExpenses = transactions
    .filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate >= monthStart &&
        transactionDate <= monthEnd
      );
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const percentage = budgetLimit > 0 ? (currentMonthExpenses / budgetLimit) * 100 : 0;
  const remaining = budgetLimit - currentMonthExpenses;

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-red-600 dark:text-red-400';
    if (percentage >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Monthly Budget Tracker
          </h3>
        </div>

        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEditing(true);
              setInputValue(budgetLimit.toString());
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Set Budget</span>
          </motion.button>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter budget"
              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={saveBudget}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Check className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsEditing(false);
                setInputValue('');
              }}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {budgetLimit > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Limit</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {currency}{budgetLimit.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Spent</p>
              <p className={`text-2xl font-bold ${getStatusColor()}`}>
                {currency}{currentMonthExpenses.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
              <p className={`text-2xl font-bold ${getStatusColor()}`}>
                {currency}{Math.abs(remaining).toLocaleString('en-IN')}
                {remaining < 0 && ' over'}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget Usage
              </span>
              <span className={`text-sm font-bold ${getStatusColor()}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${getProgressColor()} rounded-full`}
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            {percentage < 80 && (
              <p className="text-sm text-blue-800 dark:text-blue-300">
                🌟 Great job! You're managing your budget well. Keep it up!
              </p>
            )}
            {percentage >= 80 && percentage < 100 && (
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                ⚠️ You're close to your budget limit. Consider cutting back on non-essential expenses.
              </p>
            )}
            {percentage >= 100 && (
              <p className="text-sm text-red-800 dark:text-red-300">
                🚨 You've exceeded your budget! Review your expenses and adjust your spending.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Set a monthly budget to track your spending
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all"
          >
            Set Budget Now
          </button>
        </div>
      )}
    </motion.div>
  );
};
