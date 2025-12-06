import { memo, type FC } from 'react';
import AdminHeader from './_components/layout/AdminHeader';
import AdminFooter from './_components/layout/AdminFooter';

const Admin: FC = memo(() => {
    return (
        <>
            <AdminHeader />
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600">Welcome to Admin panel!</p>
                    </div>
                </div>
            </main>
            <AdminFooter />
        </>
    );
});

Admin.displayName = 'Admin';

export default Admin;
