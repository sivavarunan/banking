import HeaderBox from '@/components/ui/HeaderBox'
import TotalBalanceBox from '@/components/ui/TotalBalanceBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'

const HomeComp = async() => {
    const loggedIn = await getLoggedInUser();
  return (
    <header className='home-header'>
    <HeaderBox
        type="greeting"
        title="Welcome"
        user={loggedIn?.name || 'Guest'}
        subtext="Access and manage your transection efficienty"
    />
    <TotalBalanceBox
    accounts={[]}
    totalBanks={1}
    totalCurrentBalance={1250.35}
    />
</header>
  )
}

export default HomeComp