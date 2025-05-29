import React from 'react';
import { Tabs } from 'antd';
import PurchaseManagement from '../components/PurchaseManagement';
// ... existing imports ...

const AdminDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <h1>Admin Dashboard</h1>
            <Tabs defaultActiveKey="purchases">
                <Tabs.TabPane tab="Purchases" key="purchases">
                    <PurchaseManagement />
                </Tabs.TabPane>
                {/* ... existing tabs ... */}
            </Tabs>
        </div>
    );
};

export default AdminDashboard; 