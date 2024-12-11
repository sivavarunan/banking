import HeaderBox from '@/components/ui/HeaderBox';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const fetchTransactions = async () => {
  try {
    const response = await fetch('/api/fetch-transactions');
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

const calculateTotalBalance = (transactions: any[]) => {
  return transactions.reduce((total, transaction) => {
    const amount = parseFloat(transaction.amount || 0);
    return total + amount;
  }, 0);
};

const HomeComp = async () => {
  const loggedIn = await getLoggedInUser();
  const transactions = await fetchTransactions();
  const totalCurrentBalance = calculateTotalBalance(transactions);

  return (
    <header className="home-header">
      <HeaderBox
        type="greeting"
        title="Welcome"
        user={loggedIn?.name || 'Guest'}
        subtext="Access and manage your transactions efficiently"
      />
      <TotalBalanceBox
        accounts={[]}
        totalBanks={1}
        totalCurrentBalance={totalCurrentBalance.toFixed(2)}
      />
    </header>
  );
};

export default HomeComp;
