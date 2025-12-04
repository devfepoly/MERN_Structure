import { memo, type FC } from 'react';
import HomeHeader from './_components/layout/HomeHeader';
import HomeFooter from './_components/layout/HomeFooter';

const Home: FC = memo(() => {
    return (
        <>
            <HomeHeader />
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-gray-800">Home</h1>
                </div>
            </main>
            <HomeFooter />
        </>
    );
});

Home.displayName = 'Home';

export default Home;
