import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, MapPin, Truck, CreditCard, Loader, Plus, AlertTriangle, Tag, X, ShoppingBag, ChevronDown, ChevronUp, Lock, Gift, Smartphone, Smile, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { supabase } from '../config/supabase';
import { DelhiveryService } from '../services/delhivery';
import { getEstimatedDeliveryDate } from '../utils/dateUtils';
import { usePincode } from '../context/PincodeContext';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const { cart, cartLoading, cartTotal, subtotal, giftWrapTotal, shippingCharge, discountAmount, appliedCoupon, applyCoupon, removeCoupon, placeOrder, savedAddresses, saveAddress, COD_EXTRA_CHARGE, COD_STATUS, isGiftWrapped } = useCart();
    const { currentUser, loading: authLoading } = useAuth();
    const { addToast } = useToast();
    const { pincode: globalPincode } = usePincode();
    const navigate = useNavigate();
    
    const [shouldSaveAddress, setShouldSaveAddress] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState('new'); // 'new' or address ID

    // Filter addresses for current user
    const userAddresses = savedAddresses.filter(addr => addr.userId === (currentUser?.uid || currentUser?.id));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isZipLoading, setIsZipLoading] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const zipTimeoutRef = React.useRef(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [expandedPayment, setExpandedPayment] = useState('upi'); // 'upi', 'cards', 'gift', 'cod', 'emi'
    const [selectedUpiApp, setSelectedUpiApp] = useState('paytm');



    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        setCouponLoading(true);
        try {
            applyCoupon(couponCode);
            setCouponCode('');
        } catch (err) {
            setCouponError(err.message || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponError('');
    };

    const [formData, setFormData] = useState({
        fullName: '',
        email: currentUser?.email || '',
        phone: '',
        alternatePhone: '',
        address: '',
        houseNo: '',
        area: '',
        landmark: '',
        addressType: 'Home',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'online'
    });

    // Force payment method to online if COD is not active
    useEffect(() => {
        if (COD_STATUS !== 'active' && formData.paymentMethod === 'cod') {
            setFormData(prev => ({ ...prev, paymentMethod: 'online' }));
        }
    }, [COD_STATUS, formData.paymentMethod]);
    // COD Charge Calculation
    const codCharge = formData.paymentMethod === 'cod' ? COD_EXTRA_CHARGE : 0;
    const finalTotal = cartTotal + codCharge;

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
        if (id !== 'new') {
            const addr = userAddresses.find(a => a.id === id);
            if (addr) {
                setFormData(prev => ({
                    ...prev,
                    fullName: `${addr.firstName} ${addr.lastName}`,
                    phone: addr.phone || '',
                    alternatePhone: addr.alternatePhone || '',
                    address: addr.address || '',
                    houseNo: addr.houseNo || '',
                    area: addr.area || '',
                    landmark: addr.landmark || '',
                    addressType: addr.addressType || 'Home',
                    city: addr.city || '',
                    state: addr.state || '',
                    zipCode: addr.zipCode || ''
                }));
            }
        } else {
             setFormData(prev => ({
                ...prev,
                fullName: '',
                phone: '',
                alternatePhone: '',
                address: '',
                houseNo: '',
                area: '',
                landmark: '',
                addressType: 'Home',
                city: '',
                state: '',
                zipCode: globalPincode || '',
                email: currentUser?.email || prev.email || ''
            }));
            
            // Trigger check if global pincode exists
            if (globalPincode && globalPincode.length === 6) {
                simulateZipCheck(globalPincode);
            }
        }
    };

    const hasInitializedAddressRef = React.useRef(false);

    // Initial load logic for "new" address without saved addresses
    React.useEffect(() => {
        if (!hasInitializedAddressRef.current && savedAddresses.length === 0 && globalPincode) {
             setFormData(prev => ({ ...prev, zipCode: globalPincode }));
             simulateZipCheck(globalPincode);
        }
    }, [savedAddresses.length, globalPincode]);

    // Helper to run check without event
    const simulateZipCheck = async (zip) => {
        setIsZipLoading(true);
        try {
            const sydneyCheck = await DelhiveryService.checkServiceability(zip);
            if (sydneyCheck.serviceable === false) {
                addToast('We do not deliver to this Pincode.', 'error');
                setFormData(prev => ({ ...prev, city: '', state: '' }));
            } else if (sydneyCheck.city || sydneyCheck.state) {
                setFormData(prev => ({ ...prev, city: sydneyCheck.city || prev.city, state: sydneyCheck.state || prev.state }));
            }
        } catch (error) {
            console.error('Serviceability check failed:', error);
        }
        setIsZipLoading(false);
    };

    // Set default address if available
    React.useEffect(() => {
        if (savedAddresses.length > 0 && !hasInitializedAddressRef.current) {
            const defaultAddr = savedAddresses.find(addr => addr.userId === (currentUser?.uid || currentUser?.id));
            if (defaultAddr) {
                 setSelectedAddressId(defaultAddr.id);
                 setFormData(prev => ({
                    ...prev,
                    fullName: `${defaultAddr.firstName} ${defaultAddr.lastName}`,
                    phone: defaultAddr.phone || '',
                    alternatePhone: defaultAddr.alternatePhone || '',
                    address: defaultAddr.address || '',
                    houseNo: defaultAddr.houseNo || '',
                    area: defaultAddr.area || '',
                    landmark: defaultAddr.landmark || '',
                    addressType: defaultAddr.addressType || 'Home',
                    city: defaultAddr.city || '',
                    state: defaultAddr.state || '',
                    zipCode: defaultAddr.zipCode || ''
                }));
            }
            hasInitializedAddressRef.current = true;
        }
    }, [savedAddresses, currentUser]);


    const handleZipChange = (e) => {
        const zip = e.target.value.replace(/\D/g, '').slice(0, 6); // Allow only numbers, max 6 digits
        // Use functional state update to prevent stale state issues
        setFormData(prev => ({ ...prev, zipCode: zip }));

        if (zip.length === 6) {
            if (zipTimeoutRef.current) clearTimeout(zipTimeoutRef.current);
            zipTimeoutRef.current = setTimeout(async () => {
                setIsZipLoading(true);
                try {
                    // Try Delhivery Service first, as it's our source of truth
                    const sydneyCheck = await DelhiveryService.checkServiceability(zip);
                    
                    if (sydneyCheck.city || sydneyCheck.state) {
                        setFormData(prev => ({
                            ...prev,
                            city: sydneyCheck.city || prev.city,
                            state: sydneyCheck.state || prev.state
                        }));
                    } else {
                        // Fallback to Postal API if Delhivery didn't return city/state
                        const response = await fetch(`https://api.postalpincode.in/pincode/${zip}`);
                        const data = await response.json();
                        if (data && data[0] && data[0].Status === 'Success') {
                            setFormData(prev => ({
                                ...prev,
                                city: data[0].PostOffice[0].District,
                                state: data[0].PostOffice[0].State
                            }));
                        } else {
                            addToast('Invalid Pincode', 'error');
                            setFormData(prev => ({ ...prev, city: '', state: '' }));
                        }
                    }

                    if (sydneyCheck.serviceable === false) {
                        addToast('We do not deliver to this Pincode.', 'error');
                    } else if (sydneyCheck.codAvailable === false) {
                        setFormData(prev => {
                            if (prev.paymentMethod === 'cod') {
                                addToast('COD is not available for this location. Please choose Online Payment.', 'info');
                                return { ...prev, paymentMethod: 'online' };
                            }
                            return prev;
                        });
                    }
                } catch (error) {
                    console.error("Error fetching pincode details:", error);
                    // Absolute Fallback to Postal API
                    try {
                        const response = await fetch(`https://api.postalpincode.in/pincode/${zip}`);
                        const data = await response.json();
                        if (data && data[0] && data[0].Status === 'Success') {
                            setFormData(prev => ({
                                ...prev,
                                city: data[0].PostOffice[0].District,
                                state: data[0].PostOffice[0].State
                            }));
                        }
                    } catch (e) {
                        console.error("Fallback API also failed", e);
                    }
                } finally {
                    setIsZipLoading(false);
                }
            }, 600); // 600ms debounce
        } else {
            // Clear city and state if pincode is not 6 digits
            setFormData(prev => ({ ...prev, city: '', state: '' }));
        }
    };

    // Show loading state while Auth or Cart is initializing
    if (authLoading || (cartLoading && cart.length === 0)) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center font-body pt-20">
                 <div className="w-12 h-12 border-4 border-stone-200 border-t-rose-900 rounded-full animate-spin mb-4"></div>
                 <p className="text-stone-500 font-medium animate-pulse">Loading checkout...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-body pt-20">
                <div className="text-center bg-white p-10 rounded-2xl shadow-lg border border-stone-100 max-w-md mx-4">
                    <h2 className="text-2xl font-heading font-bold text-stone-900 mb-4">Please Log In</h2>
                    <p className="text-stone-600 mb-8">You must be logged in to complete your purchase.</p>
                    <div className="space-y-4">
                        <Link 
                            to="/login" 
                            className="block w-full bg-rose-900 text-white py-3 rounded-xl font-bold uppercase hover:bg-rose-800 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/register" 
                            className="block w-full bg-stone-100 text-stone-900 py-3 rounded-xl font-bold uppercase hover:bg-stone-200 transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-body pt-20">
                <div className="text-center">
                    <h2 className="text-2xl font-heading font-bold text-stone-900 mb-4">Your cart is empty</h2>
                    <Link to="/shop" className="text-rose-900 hover:underline font-bold">Return to Shop</Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.address || !formData.phone || !formData.fullName || !formData.email) {
            addToast('Please fill in all required fields including email.', 'error');
            return;
        }

        setIsSubmitting(true);

        // Split Full Name
        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const submissionData = {
            ...formData,
            firstName,
            lastName
        };

        if (currentUser && shouldSaveAddress && selectedAddressId === 'new') {
            saveAddress(submissionData, (currentUser.uid || currentUser.id));
        }

        try {
            if (formData.paymentMethod === 'online') {
                // 1. Load Razorpay SDK
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
                }

                // 2. Create Order via Vercel Serverless Function
                const createOrderRes = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: Math.max(100, Math.round(finalTotal * 100)), currency: 'INR' })
                });
                
                if (!createOrderRes.ok) {
                    const errText = await createOrderRes.text();
                    throw new Error(errText || 'Failed to create order');
                }
                const orderData = await createOrderRes.json();

                // 3. Initialize Razorpay Options
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Enbroidery",
                    description: "Handcrafted Embroidery",
                    order_id: orderData.id,
                    prefill: {
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#881337"
                    },
                    handler: async function (response) {
                        try {
                            // 4. Verify Payment Signature
                            const verifyRes = await fetch('/api/verify-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            if (!verifyRes.ok) {
                                throw new Error('Payment verification failed');
                            }

                            // 5. Place Order in Database
                            const orderResult = await placeOrder({
                                ...submissionData,
                                userId: (currentUser?.uid || currentUser?.id),
                                email: currentUser?.email || formData.email
                            }, {
                                status: 'paid',
                                paymentId: response.razorpay_payment_id
                            });

                            navigate('/order-success', { state: { orderId: orderResult } });
                        } catch (err) {
                            console.error('Payment verification error:', err);
                            addToast('Payment verification failed. Please contact support if amount was deducted.', 'error');
                            setIsSubmitting(false);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            setIsSubmitting(false);
                            addToast('Payment popup closed. You can retry when ready.', 'info');
                        }
                    }
                };

                const paymentObject = new window.Razorpay(options);
                
                // Intercept Explicit Failures
                paymentObject.on('payment.failed', function (response) {
                    setIsSubmitting(false);
                    const errorMsg = response.error?.description || response.error?.reason || 'Payment was declined by your bank.';
                    navigate('/order-failed', { state: { error: errorMsg } });
                });

                paymentObject.open();

            } else {
                // COD Flow - Redirect to Confirmation Page
                navigate('/order-confirmation', { 
                    state: { 
                        formData: {
                            ...submissionData,
                            paymentMethod: 'cod',
                            codCharge: codCharge
                        } 
                    } 
                });
            }
        } catch (error) {
            console.error('Order placement failed:', error);
            addToast(error.message || 'Failed to place order. Please try again.', 'error');
            setIsSubmitting(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#FAF8F6] font-body pb-32 md:pb-24 selection:bg-rose-100 selection:text-rose-900">
            {/* Header - Compact */}
            <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-100">
                <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/cart')} className="p-1 -ml-1 text-stone-800 hover:text-stone-900 transition-colors inline-block">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-stone-900 text-lg">Checkout</span>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">Step 3/3</div>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            Secure Payment <Lock className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom pt-4 md:pt-8 max-w-lg mx-auto lg:max-w-6xl">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-12">
                    {/* Left Column: Flow */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* 1. Address Section */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-stone-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-rose-50 p-1.5 rounded-lg">
                                    <MapPin className="text-rose-900 w-4 h-4" />
                                </div>
                                <h2 className="text-base font-bold text-stone-900">Delivery Address</h2>
                            </div>
                            
                            {currentUser && userAddresses.length > 0 ? (
                                <div className="space-y-3">
                                    {userAddresses.map(addr => (
                                        <div 
                                            key={addr.id}
                                            onClick={() => handleAddressSelect(addr.id)}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all ${
                                                selectedAddressId === addr.id 
                                                ? 'bg-rose-50/50 shadow-sm border border-rose-100' 
                                                : 'bg-[#FAF8F6] border border-transparent hover:bg-stone-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                                                    {selectedAddressId === addr.id && <CheckCircle className="w-4 h-4 text-rose-600" />}
                                                    {addr.firstName}
                                                </div>
                                                <span className="text-[10px] bg-white text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 font-bold uppercase">{addr.addressType}</span>
                                            </div>
                                            <div className="text-xs text-stone-500 leading-relaxed pr-8">{addr.address}, {addr.city}</div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => handleAddressSelect('new')}
                                        className="w-full text-center py-3 text-rose-900 font-bold text-sm hover:bg-rose-50 rounded-xl transition-colors mt-2"
                                    >
                                        + Add Address
                                    </button>
                                </div>
                            ) : null}

                            {/* New Address Form block (only shown if selectedAddressId === 'new') */}
                            {selectedAddressId === 'new' && (
                                <form className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 bg-[#FAF8F6] focus:bg-white outline-none transition-all text-sm font-medium text-stone-900 placeholder:text-stone-400" placeholder="Full Name" />
                                        </div>
                                        <div className="col-span-2">
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 bg-[#FAF8F6] focus:bg-white outline-none transition-all text-sm font-medium text-stone-900 placeholder:text-stone-400" placeholder="Email Address" />
                                        </div>
                                        <div>
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 bg-[#FAF8F6] focus:bg-white outline-none transition-all text-sm font-medium text-stone-900 placeholder:text-stone-400" placeholder="Mobile Number" />
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <input type="text" name="zipCode" required maxLength="6" pattern="[0-9]*" inputMode="numeric" value={formData.zipCode} onChange={handleZipChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 bg-[#FAF8F6] focus:bg-white outline-none transition-all text-sm font-medium text-stone-900 placeholder:text-stone-400" placeholder="Pincode" />
                                                {isZipLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-900"></div></div>}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <textarea name="address" required rows="2" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 bg-[#FAF8F6] focus:bg-white outline-none transition-all text-sm font-medium text-stone-900 resize-none placeholder:text-stone-400" placeholder="House No, Building, Street, Area"></textarea>
                                        </div>
                                        <div>
                                            <input type="text" name="city" required readOnly value={formData.city} className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-100 text-stone-500 outline-none cursor-not-allowed text-sm font-medium" placeholder="City" />
                                        </div>
                                        <div>
                                            <input type="text" name="state" required readOnly value={formData.state} className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-100 text-stone-500 outline-none cursor-not-allowed text-sm font-medium" placeholder="State" />
                                        </div>
                                        
                                        {currentUser && (
                                            <div className="col-span-2 flex items-center p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                <input id="save-address" type="checkbox" checked={shouldSaveAddress} onChange={(e) => setShouldSaveAddress(e.target.checked)} className="h-4 w-4 text-rose-900 focus:ring-rose-900 border-stone-300 rounded" />
                                                <label htmlFor="save-address" className="ml-2 text-sm font-medium text-stone-700 cursor-pointer select-none">Save address for future?</label>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* 2. Delivery Promise */}
                        <div className="bg-[#e9faec] rounded-xl p-4 flex items-center justify-between border border-emerald-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-emerald-600" />
                                <div>
                                    <div className="font-bold text-emerald-900 text-sm">Delivery by {getEstimatedDeliveryDate()}</div>
                                    <div className="text-xs text-emerald-700 mt-0.5">Free shipping applied</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Methods */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-stone-100">
                            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                                Payment Method
                            </h2>
                            
                            <div className="space-y-3">
                                {/* UPI Row */}
                                <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${formData.paymentMethod === 'online' ? 'border-rose-200 bg-rose-50/30 ring-1 ring-rose-200' : 'border-stone-100 hover:border-stone-200 hover:bg-[#FAF8F6]'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleChange} className="w-4 h-4 text-rose-600 border-stone-300 focus:ring-rose-600" />
                                        <div>
                                            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                                                UPI & Cards
                                                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Recommended ⚡</span>
                                            </div>
                                            <div className="text-xs text-stone-500 mt-0.5">GPay, PhonePe, Paytm, Visa, RuPay</div>
                                        </div>
                                    </div>
                                </label>

                                {/* COD Row */}
                                <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${formData.paymentMethod === 'cod' ? 'border-rose-200 bg-rose-50/30 ring-1 ring-rose-200' : 'border-stone-100 hover:border-stone-200 hover:bg-[#FAF8F6]'} ${COD_STATUS === 'hidden' || COD_STATUS === 'coming_soon' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-4 h-4 text-rose-600 border-stone-300 focus:ring-rose-600" disabled={COD_STATUS === 'hidden' || COD_STATUS === 'coming_soon'} />
                                        <div>
                                            <div className="font-bold text-stone-900 text-sm">
                                                Cash on Delivery
                                            </div>
                                            <div className="text-xs text-stone-500 mt-0.5">Pay cash at doorstep {COD_EXTRA_CHARGE > 0 ? `(+₹${COD_EXTRA_CHARGE})` : ''}</div>
                                        </div>
                                    </div>
                                    {(COD_STATUS === 'hidden' || COD_STATUS === 'coming_soon') && (
                                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">Unavailable</span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* 4. Offers & Coupons */}
                        <div className="space-y-4">
                            {/* Coupon Accordion */}
                            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50/50">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-emerald-700" />
                                            <div>
                                                <div className="font-bold text-emerald-900 text-sm">{appliedCoupon.code} Applied</div>
                                                <div className="text-xs text-emerald-600">You saved ₹{discountAmount.toLocaleString()}!</div>
                                            </div>
                                        </div>
                                        <button type="button" onClick={handleRemoveCoupon} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <details className="group">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-stone-800 text-sm list-none select-none">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-stone-400" />
                                                Apply Coupon
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="p-4 pt-0">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter code"
                                                    value={couponCode}
                                                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-sm font-bold uppercase tracking-wider focus:border-rose-900 focus:ring-2 outline-none bg-[#FAF8F6] focus:bg-white transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode.trim()}
                                                    className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 disabled:opacity-50"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {couponError && <p className="text-red-500 text-xs font-medium mt-2">{couponError}</p>}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Desktop Sticky, Mobile Collapsible) */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            {/* Mobile Collapsible Header */}
                            <details className="lg:hidden bg-white rounded-xl shadow-sm border border-stone-100 group">
                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
                                    <span className="font-bold text-stone-800 text-sm">Order Summary ({cart.length} items)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-stone-900 text-sm">₹{finalTotal.toLocaleString()}</span>
                                        <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                                    </div>
                                </summary>
                                <div className="p-4 pt-0 border-t border-stone-100 mt-2">
                                    {/* Mobile Summary Contents */}
                                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pt-2">
                                        {cart.map((item, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-16 h-16 rounded-lg bg-[#FAF8F6] overflow-hidden shrink-0 border border-stone-100">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-bold text-stone-800 text-sm truncate">{item.name}</h4>
                                                    <p className="text-xs text-stone-500 mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right flex flex-col justify-center">
                                                    <p className="font-bold text-stone-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-stone-100 mt-4 text-sm">
                                        <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                                        {shippingCharge === 0 && <div className="flex justify-between text-emerald-600"><span>Shipping</span><span>Free</span></div>}
                                        {appliedCoupon && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discountAmount.toLocaleString()}</span></div>}
                                    </div>
                                </div>
                            </details>

                            {/* Desktop Summary Card */}
                            <div className="hidden lg:block bg-white rounded-[20px] p-6 shadow-sm border border-stone-100">
                                <h3 className="font-bold text-stone-900 mb-4">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-[#FAF8F6] overflow-hidden shrink-0 border border-stone-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <h4 className="font-bold text-stone-800 text-sm truncate">{item.name}</h4>
                                                <p className="text-[11px] text-stone-500 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right py-1">
                                                <p className="font-bold text-stone-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-4 border-t border-stone-100 text-sm">
                                    <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                                    {shippingCharge === 0 && <div className="flex justify-between text-emerald-600"><span>Shipping</span><span>Free</span></div>}
                                    {appliedCoupon && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discountAmount.toLocaleString()}</span></div>}
                                </div>
                                <div className="flex justify-between text-lg font-bold text-stone-900 pt-4 border-t border-stone-200 mt-4">
                                    <span>Total Pay</span>
                                    <span>₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Signals & Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200/60 shadow-[0_-10px_40px_rgb(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
                {/* Trust Row */}
                <div className="bg-[#FAF8F6] py-2 border-b border-stone-100">
                    <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 text-[10px] md:text-xs font-bold text-stone-500">
                        <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> 100% Secure</span>
                        <span className="flex items-center gap-1.5"><Truck className="w-3 h-3" /> Fast Delivery</span>
                    </div>
                </div>
                
                {/* CTA Row */}
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="text-xl font-bold text-stone-900 leading-none mb-1">₹{finalTotal.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-500 font-medium">Total incl. taxes</div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[1.5] bg-rose-900 text-white h-[54px] rounded-xl font-bold text-[15px] shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting 
                            ? <Loader className="w-5 h-5 animate-spin" />
                            : `Pay Securely`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
