import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CreditCard, Truck, MapPin, Plus, CheckCircle, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../config/supabase';

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
    const { cart, cartTotal, subtotal, shippingCharge, discountAmount, appliedCoupon, placeOrder, savedAddresses, saveAddress } = useCart();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    
    const [shouldSaveAddress, setShouldSaveAddress] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState('new'); // 'new' or address ID

    // Filter addresses for current user
    const userAddresses = savedAddresses.filter(addr => addr.userId === currentUser?.uid);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'cod'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
        if (id !== 'new') {
            const addr = userAddresses.find(a => a.id === id);
            if (addr) {
                setFormData(prev => ({
                    ...prev,
                    firstName: addr.firstName,
                    lastName: addr.lastName,
                    phone: addr.phone,
                    address: addr.address,
                    city: addr.city,
                    state: addr.state,
                    zipCode: addr.zipCode
                }));
            }
        } else {
             setFormData(prev => ({
                ...prev,
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: ''
            }));
        }
    };

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
        if (!formData.address || !formData.phone || !formData.firstName) {
            addToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsSubmitting(true);

        if (currentUser && shouldSaveAddress && selectedAddressId === 'new') {
            saveAddress(formData, currentUser.uid);
        }

        try {
            if (formData.paymentMethod === 'online') {
                // 1. Load Razorpay SDK
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
                }

                // 2. Create Order via Supabase Edge Function (Secure)
                const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay-payment', {
                    body: { 
                        action: 'create-order',
                        cartItems: cart.map(item => ({ id: item.id, quantity: item.quantity })),
                        couponCode: appliedCoupon?.code
                    }
                });

                if (orderError) throw orderError;

                // 3. Initialize Razorpay Options
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Enbroidery",
                    description: "Handcrafted Embroidery",
                    order_id: orderData.id,
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#881337"
                    },
                    handler: async function (response) {
                        try {
                            // 4. Verify Payment Signature
                            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-payment', {
                                body: { 
                                    action: 'verify-signature',
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    signature: response.razorpay_signature
                                }
                            });

                            if (verifyError || verifyData?.status !== 'success') {
                                throw new Error('Payment verification failed');
                            }

                            // 5. Place Order in Database
                            await placeOrder({
                                ...formData,
                                userId: currentUser?.uid,
                                email: currentUser?.email || formData.email
                            }, {
                                status: 'paid',
                                paymentId: response.razorpay_payment_id
                            });

                            navigate('/order-success');
                        } catch (err) {
                            console.error('Payment verification error:', err);
                            addToast('Payment verification failed. Please contact support if amount was deducted.', 'error');
                            setIsSubmitting(false);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            setIsSubmitting(false);
                            addToast('Payment cancelled', 'info');
                        }
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            } else {
                // COD Flow - Redirect to Confirmation Page
                navigate('/order-confirmation', { 
                    state: { 
                        formData: {
                            ...formData,
                            paymentMethod: 'cod' 
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
        <div className="min-h-screen bg-[#fdfbf7] font-body pt-32 pb-24">
            <div className="container-custom">
                <Link to="/cart" className="inline-flex items-center text-stone-500 hover:text-rose-900 mb-8 transition-colors text-sm font-bold uppercase tracking-wide">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Checkout Form */}
                    <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-stone-100">
                        <h2 className="text-2xl font-heading font-bold text-stone-900 mb-8 flex items-center gap-3">
                            <div className="bg-rose-50 p-2 rounded-lg">
                                <Truck className="text-rose-900 w-6 h-6" />
                            </div>
                            Shipping Details
                        </h2>

                        {/* Saved Addresses Selection */}
                        {currentUser && userAddresses.length > 0 && (
                            <div className="mb-8 p-6 bg-stone-50/50 rounded-xl border border-stone-100">
                                <h3 className="font-bold text-stone-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                                    <MapPin className="w-4 h-4 mr-2 text-rose-900" />
                                    Select Saved Address
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {userAddresses.map(addr => (
                                        <div 
                                            key={addr.id}
                                            onClick={() => handleAddressSelect(addr.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                selectedAddressId === addr.id 
                                                ? 'border-rose-900 bg-white ring-1 ring-rose-900 shadow-md' 
                                                : 'border-stone-200 hover:border-rose-300 bg-white'
                                            }`}
                                        >
                                            <div className="font-bold text-stone-900 text-sm mb-1">{addr.firstName}</div>
                                            <div className="text-xs text-stone-500 truncate">{addr.address}</div>
                                        </div>
                                    ))}
                                    <div 
                                        onClick={() => handleAddressSelect('new')}
                                        className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                                            selectedAddressId === 'new' 
                                            ? 'border-rose-900 bg-rose-50/50 text-rose-900' 
                                            : 'border-stone-200 hover:border-rose-300 text-stone-400 hover:text-rose-900'
                                        }`}
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase">Add New</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Address</label>
                                <textarea
                                    name="address"
                                    required
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900 resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">ZIP</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-stone-100 rounded-xl focus:border-rose-900 focus:bg-white bg-stone-50 outline-none transition-all font-medium text-stone-900"
                                    />
                                </div>
                            </div>

                            {/* Save Address Checkbox */}
                            {currentUser && selectedAddressId === 'new' && (
                                <div className="flex items-center p-4 bg-stone-50 rounded-lg">
                                    <input
                                        id="save-address"
                                        type="checkbox"
                                        checked={shouldSaveAddress}
                                        onChange={(e) => setShouldSaveAddress(e.target.checked)}
                                        className="h-5 w-5 text-rose-900 focus:ring-rose-900 border-stone-300 rounded"
                                    />
                                    <label htmlFor="save-address" className="ml-3 text-sm font-medium text-stone-700 cursor-pointer select-none">
                                        Save this address for future reference
                                    </label>
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="pt-8 mt-8 border-t border-stone-100">
                                <h3 className="text-xl font-heading font-bold text-stone-900 mb-6 flex items-center gap-3">
                                    <div className="bg-rose-50 p-2 rounded-lg">
                                        <CreditCard className="text-rose-900 w-6 h-6" />
                                    </div>
                                    Payment Method
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center p-5 border-2 border-rose-900 bg-rose-50/30 rounded-xl cursor-pointer transition-all relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/50 group-hover:bg-transparent transition-colors"></div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="text-rose-900 focus:ring-rose-900 w-5 h-5 relative z-10"
                                        />
                                        <div className="ml-4 relative z-10">
                                            <span className="block font-bold text-stone-900">Cash on Delivery (COD)</span>
                                            <span className="text-xs text-stone-500">Pay when you receive your order</span>
                                        </div>
                                        <CheckCircle className="ml-auto w-5 h-5 text-rose-900 relative z-10" />
                                    </label>
                                    <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${
                                        formData.paymentMethod === 'online' 
                                        ? 'border-emerald-600 bg-emerald-50/30' 
                                        : 'border-stone-100 hover:border-emerald-200'
                                    }`}>
                                        <div className={`absolute inset-0 transition-colors ${formData.paymentMethod === 'online' ? '' : 'bg-white/50 group-hover:bg-transparent'}`}></div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={handleChange}
                                            className="text-emerald-600 focus:ring-emerald-600 w-5 h-5 relative z-10"
                                        />
                                        <div className="ml-4 relative z-10">
                                            <span className={`block font-bold ${formData.paymentMethod === 'online' ? 'text-emerald-800' : 'text-stone-900'}`}>Online Payment</span>
                                            <span className="text-xs text-stone-500">Secure payment via Razorpay</span>
                                        </div>
                                        {formData.paymentMethod === 'online' && (
                                            <CheckCircle className="ml-auto w-5 h-5 text-emerald-600 relative z-10" />
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-rose-900 text-white py-4 rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-rose-800 transition-all shadow-lg hover:shadow-rose-900/30 transform hover:-translate-y-0.5 mt-4 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Processing...' : `Place Order (₹${cartTotal.toLocaleString()})`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 sticky top-28">
                            <h2 className="text-xl font-heading font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-2">
                                        <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-stone-800 text-sm truncate">{item.name}</h4>
                                            <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-stone-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            {item.originalPrice && (
                                                <p className="text-xs text-stone-400 line-through">₹{(item.originalPrice * item.quantity).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-3 pt-6 border-t border-stone-100 bg-stone-50 -mx-8 -mb-8 p-8 rounded-b-2xl">
                                <div className="flex justify-between text-stone-600 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 text-sm">
                                        <span className="flex items-center font-bold"><Tag className="w-3 h-3 mr-1"/> Discount</span>
                                        <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600 text-sm">
                                    <span>Shipping</span>
                                    <span className={shippingCharge === 0 ? "text-emerald-700 font-bold" : "font-medium"}>
                                        {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-heading font-bold text-stone-900 pt-4 border-t border-stone-200 mt-2">
                                    <span>Total Pay</span>
                                    <span className="text-rose-900">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
