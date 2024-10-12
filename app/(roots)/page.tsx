import HeaderBox from '@/components/ui/HeaderBox'
import RightSidebar from '@/components/ui/RightSidebar'
import TotalBalanceBox from '@/components/ui/TotalBalanceBox'
import React from 'react'

const Home = () => {

    const loggedIn = { firstname: 'Siva' }

    return (
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.firstname || 'Guest'}
                        subtext="Access and manage your transection efficienty"
                    />
                    <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={1250.35}

                    
                    />

                </header>
                RECENT TRANSECTIONS
            </div>
            <RightSidebar
            user={loggedIn}
            transections={[]} 
            banks={[]}
            />
        </section>
    )
}

export default Home