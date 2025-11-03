import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, Heart, Frown } from 'lucide-react';
import { Transaction } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

interface SmartInsightsProps {
  transactions: Transaction[];
}

export const SmartInsights = ({ transactions }: SmartInsightsProps) => {
  const { currency } = useTheme();

  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  const currentMonthExpenses = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && date >= currentMonthStart && date <= currentMonthEnd;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const lastMonthExpenses = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && date >= lastMonthStart && date <= lastMonthEnd;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseChange = lastMonthExpenses > 0
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
    : 0;

  const categoryTotals = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && date >= currentMonthStart && date <= currentMonthEnd;
    })
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
  const topCategoryPercentage = topCategory && currentMonthExpenses > 0
    ? (topCategory[1] / currentMonthExpenses) * 100
    : 0;

  const regretfulExpenses = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return t.type === 'expense' && t.emotion === 'regret' && date >= currentMonthStart && date <= currentMonthEnd;
    });

  const regretfulTotal = regretfulExpenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const regretfulPercentage = currentMonthExpenses > 0
    ? (regretfulTotal / currentMonthExpenses) * 100
    : 0;

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const daysRemaining = daysInMonth - currentDay;
  const avgDailySpending = currentDay > 0 ? currentMonthExpenses / currentDay : 0;
  const projectedMonthlySpending = avgDailySpending * daysInMonth;

  const insights: Array<{
    icon: any;
    title: string;
    message: string;
    color: string;
    bgLight: string;
    bgDark: string;
  }> = [];

  if (expenseChange !== 0) {
    const isDecrease = expenseChange < 0;
    insights.push({
      icon: isDecrease ? TrendingDown : TrendingUp,
      title: isDecrease ? 'Spending Decreased!' : 'Spending Increased',
      message: `Your ${format(new Date(), 'MMMM')} expenses ${isDecrease ? 'dropped' : 'increased'} by ${Math.abs(expenseChange).toFixed(1)}% compared to last month. ${
        isDecrease
          ? 'Excellent work! Keep up the good habits.'
          : 'Consider reviewing your expenses to identify savings opportunities.'
      }`,
      color: isDecrease ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
      bgLight: isDecrease ? 'bg-green-50' : 'bg-yellow-50',
      bgDark: isDecrease ? 'bg-green-900/20' : 'bg-yellow-900/20',
    });
  }

  if (topCategory && topCategoryPercentage >= 40) {
    insights.push({
      icon: Lightbulb,
      title: 'Category Alert',
      message: `You're spending ${topCategoryPercentage.toFixed(0)}% of your money on ${topCategory[0]} this month (${currency}${topCategory[1].toLocaleString('en-IN')}). Consider setting a category-specific budget or finding cheaper alternatives.`,
      color: 'text-blue-600 dark:text-blue-400',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
    });
  }

  if (regretfulExpenses.length > 0) {
    insights.push({
      icon: Frown,
      title: 'Regretful Spending',
      message: `You tagged ${regretfulExpenses.length} expense${regretfulExpenses.length > 1 ? 's' : ''} as "regret" this month (${currency}${regretfulTotal.toLocaleString('en-IN')} or ${regretfulPercentage.toFixed(1)}% of total). Before making similar purchases, try waiting 24 hours to see if you still want it.`,
      color: 'text-purple-600 dark:text-purple-400',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900/20',
    });
  }

  if (projectedMonthlySpending > 0 && daysRemaining > 0) {
    insights.push({
      icon: TrendingUp,
      title: 'Spending Forecast',
      message: `Based on your current spending pattern (${currency}${avgDailySpending.toFixed(2)}/day), you're projected to spend ${currency}${projectedMonthlySpending.toLocaleString('en-IN')} by month end. ${
        projectedMonthlySpending > currentMonthExpenses * 1.2
          ? 'Try to reduce daily spending to stay on track.'
          : 'Keep up the consistent spending!'
      }`,
      color: 'text-teal-600 dark:text-teal-400',
      bgLight: 'bg-teal-50',
      bgDark: 'bg-teal-900/20',
    });
  }

  const motivationalQuotes = [
    "A penny saved is a penny earned.",
    "It's not about how much money you make, but how much you keep.",
    "Financial freedom is available to those who learn about it and work for it.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Don't save what is left after spending, spend what is left after saving.",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-4">
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${insight.bgLight} dark:${insight.bgDark} rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-start space-x-4">
                <div className={`${insight.color} p-3 bg-white dark:bg-gray-800 rounded-xl`}>
                  <insight.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${insight.color}`}>
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {insight.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 shadow-lg text-white"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Daily Motivation</h3>
            <p className="text-sm opacity-90 italic">"{randomQuote}"</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
