/**
 * Maps Delhivery/Technical statuses to User-Friendly Timeline Events
 * Matches specific user requirements for "Flipkart-style" tracking.
 * 
 * @param {string} status - Raw status from API or DB
 * @returns {{ title: string, message: string }}
 */
export const getTrackingStatus = (status) => {
    if (!status) return { title: 'Unknown Status', message: '' };
    
    // Normalize: remove extra spaces, lowercase
    const normalized = status.toString().toLowerCase().trim();

    // Exact User Mapping Logic
    // Delhivery Status (Input)	Timeline Title	User Message
    
    // 1. Manifested -> Order Confirmed
    if (normalized.includes('manifested') || normalized.includes('placed') || normalized === 'pending') {
        return { title: 'Order Confirmed', message: 'Your order has been placed' };
    }

    // 2. Invoiced / Ready for Pickup -> Order Processed
    if (normalized.includes('invoiced') || normalized.includes('ready for pickup') || normalized.includes('booked') || normalized.includes('processing')) {
        return { title: 'Order Processed', message: 'Seller has processed your order' };
    }

    // 3. Picked Up -> Picked Up
    if (normalized.includes('picked up')) {
        return { title: 'Picked Up', message: 'Your item has been picked up by Delhivery' };
    }

    // 4. In Transit -> Shipped
    if (normalized.includes('in transit')) {
         return { title: 'Shipped', message: 'Shipment is on the way' };
    }

    // 5. Reached at Hub -> Shipped
    if (normalized.includes('reached at hub') || normalized.includes('dispatched')) {
        return { title: 'Shipped', message: 'Shipment received at nearest hub' };
    }

    // 6. Out for Delivery -> Out For Delivery
    if (normalized.includes('out for delivery')) {
        return { title: 'Out For Delivery', message: 'Your item is out for delivery' };
    }

    // 7. Delivered -> Delivered
    if (normalized.includes('delivered') && !normalized.includes('un')) {
        return { title: 'Delivered', message: 'Your item has been delivered' };
    }

    // 8. Undelivered -> Delivery Attempt Failed
    if (normalized.includes('undelivered') || normalized.includes('failed')) {
        return { title: 'Delivery Attempt Failed', message: 'Delivery attempt failed' };
    }

    // 9. RTO Initiated -> Returned
    if (normalized.includes('rto') || normalized.includes('return')) {
        return { title: 'Returned', message: 'Item is being returned to seller' };
    }

    // Special: Delays
    if (normalized.includes('delayed')) {
        return { title: 'Delivery Delayed', message: 'Due to operational reasons' };
    }

    // Fallback
    const title = normalized.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
        
    return { 
        title: title, 
        message: 'Status update received' 
    };
};
