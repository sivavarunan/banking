import HeaderBox from '@/components/ui/HeaderBox'
import React from 'react'

const Home = () => {

const loggedIn = { firstname: 'Siva'}

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
            </header>

        </div>
    </section>
  )
}

export default Home