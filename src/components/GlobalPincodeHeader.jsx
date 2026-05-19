import React, { useState } from 'react';
import { MapPin, X, Loader2, CheckCircle2 } from 'lucide-react';
import { usePincode } from '../context/PincodeContext';

export const GlobalPincodeHeader = () => {
    const { pincode, serviceability, savePincode, clearPincode } = usePincode();
    const [isOpen, setIsOpen] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputVal.length !== 6) return;
        setLoading(true);
        setError('');
        const success = await savePincode(inputVal);
        if (success) {
            setIsOpen(false);
            setInputVal('');
        } else {
            setError('Pincode is not serviceable');
        }
        setLoading(false);
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 hover:bg-stone-50 px-2.5 py-1.5 rounded-lg transition-colors group"
            >
                <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                <div className="hidden sm:flex flex-col items-start leading-tight min-h-[32px] justify-center">
                    <span className="text-[10px] text-stone-400 font-medium">
                        {pincode ? 'Deliver to' : 'Select Location'}
                    </span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                        {pincode 
                            ? `${serviceability?.city || pincode}, ${pincode}` 
                            : 'Enter Pincode'}
                    </span>
                </div>
                <span className="sm:hidden text-xs font-bold text-stone-700">
                    {pincode || '📍'}
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <h3 className="font-heading font-medium text-lg text-stone-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-rose-700" /> Choose Location
                            </h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-stone-200 rounded-full transition-colors text-stone-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-stone-600">
                                Enter your pincode to check delivery availability and exact estimates.
                            </p>
                            
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value.replace(/\D/g, ''))}
                                        placeholder="6-digit Pincode"
                                        className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-300 bg-stone-50 focus:bg-white transition-colors"
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={inputVal.length !== 6 || loading}
                                        className="px-5 py-2.5 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[90px]"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                                {error && <p className="text-xs text-rose-600 font-medium animate-pulse">{error}</p>}
                            </form>

                            {pincode && serviceability && serviceability.serviceable && (
                                <div className="pt-4 border-t border-stone-100 space-y-2">
                                    <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-widest mb-2">Current Location</h4>
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <div>
                                                <p className="text-sm font-semibold text-emerald-900">{pincode}</p>
                                                <p className="text-xs text-emerald-700">{serviceability.city}, {serviceability.state}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => clearPincode()}
                                            className="text-xs text-rose-700 font-medium hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
