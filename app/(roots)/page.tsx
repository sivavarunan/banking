import HomeComp from '@/components/HomeComp'
import RecentTransactions from '@/components/ui/RecentTransactions'
import RightSidebar from '@/components/ui/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'

const Home = async () => {
    const loggedIn = await getLoggedInUser();

    return (
        <section className='home'>
            <div className='home-content'>
                <HomeComp />
                RECENT TRANSECTIONS
                <RecentTransactions/>
            </div>
            <RightSidebar
            user={loggedIn}
            transections={[]} 
            banks={[{currentBalance: 123.50},{currentBalance: 503.50}]}
            />
        </section>
    )
}

export default Home;