import { memo, type FC } from 'react';
import { Link } from 'react-router-dom';

const HomeHeader: FC = memo(() => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Logo
                </Link>
                <nav className="flex gap-6">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                        Admin
                    </Link>
                </nav>
            </div>
        </header>
    );
});

HomeHeader.displayName = 'HomeHeader';

export default HomeHeader;
