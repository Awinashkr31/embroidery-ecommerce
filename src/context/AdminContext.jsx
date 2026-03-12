import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
    const { adminUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);
    
    // We only want to fetch this data if the user is an admin
    // Currently relying on the route protection, but checking currentUser is a good fallback
    
    const fetchAdminData = useCallback(async (isRefresh = false) => {
        if (!adminUser) return; // Prevent fetching if logged out
        
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            // 1. Fetch orders optimized (avoiding heavy SELECT * where possible, though we need most fields for Orders page)
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('id, created_at, status, payment_status, payment_method, total, customer_name, customer_email, customer_phone, shipping_address, items, waybill_id, courier_name, tracking_url, expected_delivery_date, final_shipping_cost')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;
            
            // 2. Fetch users optimized
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('email, display_name, photo_url, created_at, last_login');

            if (usersError && usersError.code !== 'PGRST116') {
                 console.error("AdminContext: Error fetching users", usersError);
            }

            // 3. Fetch secure revenue from RPC
            const { data: revenueData, error: revenueError } = await supabase.rpc('get_total_revenue');
            if (revenueError) {
                 console.error("AdminContext: Error fetching revenue", revenueError);
            } else {
                 setTotalRevenue(Number(revenueData) || 0);
            }

            setOrders(ordersData || []);
            setUsers(usersData || []);
            
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [adminUser]); // Depend on adminUser so identity changes re-fetch if needed

    useEffect(() => {
        if (adminUser) {
            fetchAdminData();
        }
    }, [adminUser, fetchAdminData]);

    const value = {
        orders,
        users,
        loading,
        refreshing,
        refreshData: () => fetchAdminData(true),
        
        // Helper methods for easy access across admin pages
        getRecentOrders: (limit = 10) => orders.slice(0, limit),
        getPendingOrdersCount: () => orders.filter(o => o.status === 'pending').length,
        getTotalRevenue: () => totalRevenue
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
