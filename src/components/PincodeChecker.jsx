import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { usePincode } from '../context/PincodeContext';

export const PincodeChecker = () => {
    const { pincode: globalPincode, serviceability: globalServiceability, loading: globalLoading, savePincode } = usePincode();
    const [localPincode, setLocalPincode] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [localResult, setLocalResult] = useState(null);

    // Sync with global state when it changes or loads
    useEffect(() => {
        if (globalPincode) {
            setLocalPincode(globalPincode);
            setLocalResult(globalServiceability);
            setIsEditing(false);
        } else {
            setIsEditing(true); // default to editing if no global pincode
        }
    }, [globalPincode, globalServiceability]);

    const checkPincode = async (e) => {
        e.preventDefault();
        if (localPincode.length !== 6) return;
        setLocalLoading(true);
        
        // Use global save function which also handles local storage
        const success = await savePincode(localPincode);
        if (!success) {
            // It will update globalServiceability with the failed data
            setLocalResult({ serviceable: false, error: 'Failed to check pincode' });
        }
        setLocalLoading(false);
    };

    if (globalLoading) {
        return (
            <div className="flex items-center justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-3 font-body-alt">
            {!isEditing && globalPincode && (
                <div className="flex justify-between items-center text-xs">
                    <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-700" /> 
                        Delivering to <span className="font-bold text-stone-900">{globalPincode}</span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="font-medium text-rose-900 underline underline-offset-4 hover:text-rose-700"
                    >
                        Change
                    </button>
                </div>
            )}
            
            {isEditing && (
                <form onSubmit={checkPincode} className="flex gap-2">
                    <input 
                        type="text" 
                        maxLength={6}
                        value={localPincode}
                        onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit Pincode"
                        className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-rose-300 bg-white"
                    />
                    <button 
                        type="submit" 
                        disabled={localPincode.length !== 6 || localLoading}
                        className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[70px]"
                    >
                        {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                    </button>
                    {globalPincode && (
                        <button
                            type="button"
                            onClick={() => {
                                setLocalPincode(globalPincode);
                                setIsEditing(false);
                            }}
                            className="px-2.5 py-2 text-xs text-stone-500 hover:text-stone-800 font-medium"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {localResult && (!isEditing || !globalPincode) && (
                <div className="pt-2 text-sm">
                    {localResult.serviceable ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50/50 p-3 rounded-[12px] border-l-4 border-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]">
                                <Truck className="w-4 h-4 shrink-0" />
                                <div>
                                    <span className="font-bold block text-sm">Delivery by {localResult.eddString}</span>
                                </div>
                            </div>
                            {localResult.codAvailable ? (
                                <p className="flex items-center gap-1.5 text-stone-600 text-xs mt-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> COD Available in {localResult.city}, {localResult.state}
                                </p>
                            ) : (
                                <p className="flex items-center gap-1.5 text-stone-600 text-xs mt-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Prepaid Only in {localResult.city}, {localResult.state}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                            <XCircle className="w-4 h-4 shrink-0" />
                            <span>Currently not serviceable at this pincode.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
