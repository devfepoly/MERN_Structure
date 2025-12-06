import { memo, lazy, Suspense, type FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHeader from './_components/layout/AdminHeader';
import AdminFooter from './_components/layout/AdminFooter';
import Loading from '@components/Loading';

// Lazy load admin pages
const Dashboard = lazy(() => import('./Dashboard'));
const Users = lazy(() => import('./Users'));
const UserDetail = lazy(() => import('./Users/Detail'));
const Products = lazy(() => import('./Products'));
const ProductDetail = lazy(() => import('./Products/Detail'));
const Orders = lazy(() => import('./Orders'));
const OrderDetail = lazy(() => import('./Orders/Detail'));
const Settings = lazy(() => import('./Settings'));

const Admin: FC = memo(() => {
    return (
        <>
            <AdminHeader />
            <main className="min-h-screen bg-gray-50">
                <Suspense fallback={<Loading size="lg" fullScreen />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="users/:id" element={<UserDetail />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:id" element={<ProductDetail />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:id" element={<OrderDetail />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <AdminFooter />
        </>
    );
});

Admin.displayName = 'Admin';

export default Admin;
