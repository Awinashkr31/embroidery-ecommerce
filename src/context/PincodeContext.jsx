import React, { createContext, useState, useContext, useEffect } from 'react';
import { DelhiveryService } from '../services/delhivery';

export const PincodeContext = createContext(null);

export const PincodeProvider = ({ children }) => {
    const [pincode, setPincode] = useState('');
    const [serviceability, setServiceability] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const saved = localStorage.getItem('userPincode');
            if (saved && saved.length === 6) {
                await savePincode(saved, false); // initial load
            }
            setLoading(false);
        };
        init();
    }, []);

    const savePincode = async (newPincode, showLoading = true) => {
        if (newPincode.length !== 6) return false;
        if (showLoading) setLoading(true);
        
        try {
            const data = await DelhiveryService.checkServiceability(newPincode);
            if (data.serviceable) {
                setPincode(newPincode);
                setServiceability(data);
                localStorage.setItem('userPincode', newPincode);
            } else {
                setServiceability(data); // still save the result to show error state
            }
            return data.serviceable;
        } catch (error) {
            console.error('Failed to check pincode globally:', error);
            return false;
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const clearPincode = () => {
        setPincode('');
        setServiceability(null);
        localStorage.removeItem('userPincode');
    };

    return (
        <PincodeContext.Provider value={{
            pincode,
            serviceability,
            loading,
            savePincode,
            clearPincode
        }}>
            {children}
        </PincodeContext.Provider>
    );
};

export const usePincode = () => {
    const context = useContext(PincodeContext);
    if (!context) {
        throw new Error('usePincode must be used within a PincodeProvider');
    }
    return context;
};
