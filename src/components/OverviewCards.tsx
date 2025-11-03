import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

interface OverviewCardsProps {
  transactions: Transaction[];
}

export const OverviewCards = ({ transactions }: OverviewCardsProps) => {
  const { currency } = useTheme();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      gradient: 'from-green-400 to-green-600',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Expense',
      amount: totalExpense,
      icon: TrendingDown,
      gradient: 'from-red-400 to-red-600',
      bgLight: 'bg-red-50',
      bgDark: 'bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Current Balance',
      amount: balance,
      icon: Wallet,
      gradient: 'from-blue-400 to-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgLight} dark:${card.bgDark} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {card.title}
              </p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 + 0.2 }}
                className={`text-3xl font-bold ${card.textColor}`}
              >
                {currency}{Math.abs(card.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            </div>
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 + 0.3 }}
              className={`bg-gradient-to-br ${card.gradient} p-3 rounded-xl`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
