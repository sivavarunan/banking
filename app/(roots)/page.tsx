import HomeComp from '@/components/HomeComp'
import HeaderBox from '@/components/ui/HeaderBox'
import RecentTransactions from '@/components/ui/RecentTransactions'
import RightSidebar from '@/components/ui/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'

const Home = async () => {
    const loggedIn = await getLoggedInUser();

    return (
        <section className='home'>
            <div className='home-content'>
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.name || 'Guest'}
                        subtext="Access and manage your transactions efficiently"
                    /> </header>
                <HomeComp />
                RECENT TRANSECTIONS
                <RecentTransactions />
            </div>
            <RightSidebar
                user={loggedIn}
                transections={[]}
                banks={[{ currentBalance: 123.50 }, { currentBalance: 503.50 }]}
            />
        </section>
    )
}

export default Home;