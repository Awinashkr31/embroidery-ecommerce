import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // We only want to fetch this data if the user is an admin
    // Currently relying on the route protection, but checking currentUser is a good fallback
    
    const fetchAdminData = useCallback(async (isRefresh = false) => {
        if (!currentUser) return; // Prevent fetching if logged out
        
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            // 1. Fetch orders optimized
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('id, customer_email, customer_name, customer_phone, total, total_amount, amount, created_at, status, shipping_address, items, payment_status, payment_method, payment_id, waybill_id, tracking_url, courier_name, expected_delivery_date, estimated_shipping_date')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;
            
            // 2. Fetch users optimized
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('email, display_name, photo_url, created_at, last_login');

            if (usersError && usersError.code !== 'PGRST116') {
                 console.error("AdminContext: Error fetching users", usersError);
            }

            setOrders(ordersData || []);
            setUsers(usersData || []);
            
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentUser]); // Depend on currentUser so identity changes re-fetch if needed

    useEffect(() => {
        if (currentUser) {
            fetchAdminData();
        }
    }, [currentUser, fetchAdminData]);

    const value = {
        orders,
        users,
        loading,
        refreshing,
        refreshData: () => fetchAdminData(true),
        
        // Helper methods for easy access across admin pages
        getRecentOrders: (limit = 10) => orders.slice(0, limit),
        getPendingOrdersCount: () => orders.filter(o => o.status === 'pending').length,
        getTotalRevenue: () => orders.reduce((sum, o) => sum + (Number(o.total) || Number(o.total_amount) || Number(o.amount) || 0), 0)
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
