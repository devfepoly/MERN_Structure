import { memo, type FC } from 'react';
import { Link } from 'react-router-dom';

const AdminHeader: FC = memo(() => {
    return (
        <header className="bg-gray-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/admin" className="text-2xl font-bold">
                    Admin Panel
                </Link>
                <nav className="flex gap-6">
                    <Link to="/admin" className="hover:text-blue-400 transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/" className="hover:text-blue-400 transition-colors">
                        Home
                    </Link>
                    <button className="hover:text-red-400 transition-colors">
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
