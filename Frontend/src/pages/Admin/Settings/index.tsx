import { memo, type FC } from 'react';

const Settings: FC = memo(() => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">General Settings</h2>
                        <p className="text-gray-600">Configure general application settings</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Security</h2>
                        <p className="text-gray-600">Manage security and privacy settings</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Notifications</h2>
                        <p className="text-gray-600">Control notification preferences</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

Settings.displayName = 'Settings';

export default Settings;
