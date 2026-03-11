import { describe, it, expect } from 'vitest';
import { getTrackingStatus } from './statusMapping.js';

describe('getTrackingStatus', () => {
    it('returns unknown status for empty or falsy inputs', () => {
        expect(getTrackingStatus(null)).toEqual({ title: 'Unknown Status', message: '' });
        expect(getTrackingStatus(undefined)).toEqual({ title: 'Unknown Status', message: '' });
        expect(getTrackingStatus('')).toEqual({ title: 'Unknown Status', message: '' });
    });

    it('returns Order Confirmed for manifested, placed, or pending statuses', () => {
        const expected = { title: 'Order Confirmed', message: 'Your order has been placed' };
        expect(getTrackingStatus('Manifested')).toEqual(expected);
        expect(getTrackingStatus('Order Placed')).toEqual(expected);
        expect(getTrackingStatus('pending')).toEqual(expected);
    });

    it('returns Order Processed for invoiced, ready for pickup, booked, or processing statuses', () => {
        const expected = { title: 'Order Processed', message: 'Seller has processed your order' };
        expect(getTrackingStatus('Invoiced')).toEqual(expected);
        expect(getTrackingStatus('Ready for pickup')).toEqual(expected);
        expect(getTrackingStatus('Booked')).toEqual(expected);
        expect(getTrackingStatus('Processing')).toEqual(expected);
    });

    it('returns Picked Up for picked up statuses', () => {
        const expected = { title: 'Picked Up', message: 'Your item has been picked up by Delhivery' };
        expect(getTrackingStatus('Picked up')).toEqual(expected);
        expect(getTrackingStatus('Item picked up by courier')).toEqual(expected);
    });

    it('returns Shipped for in transit statuses', () => {
        const expected = { title: 'Shipped', message: 'Shipment is on the way' };
        expect(getTrackingStatus('In transit')).toEqual(expected);
        expect(getTrackingStatus('Item is in transit')).toEqual(expected);
    });

    it('returns Shipped for reached at hub or dispatched statuses', () => {
        const expected = { title: 'Shipped', message: 'Shipment received at nearest hub' };
        expect(getTrackingStatus('Reached at hub')).toEqual(expected);
        expect(getTrackingStatus('Dispatched')).toEqual(expected);
    });

    it('returns Out For Delivery for out for delivery statuses', () => {
        const expected = { title: 'Out For Delivery', message: 'Your item is out for delivery' };
        expect(getTrackingStatus('Out for delivery')).toEqual(expected);
    });

    it('returns Delivered for delivered statuses ensuring undelivered is not falsely matched', () => {
        const expected = { title: 'Delivered', message: 'Your item has been delivered' };
        expect(getTrackingStatus('Delivered')).toEqual(expected);
        expect(getTrackingStatus('Successfully Delivered')).toEqual(expected);
    });

    it('returns Delivery Attempt Failed for undelivered or failed statuses', () => {
        const expected = { title: 'Delivery Attempt Failed', message: 'Delivery attempt failed' };
        expect(getTrackingStatus('Undelivered')).toEqual(expected);
        expect(getTrackingStatus('Delivery failed')).toEqual(expected);
    });

    it('returns Returned for rto or return statuses', () => {
        const expected = { title: 'Returned', message: 'Item is being returned to seller' };
        expect(getTrackingStatus('RTO Initiated')).toEqual(expected);
        expect(getTrackingStatus('Return to origin')).toEqual(expected);
    });

    it('returns Delivery Delayed for delayed statuses', () => {
        const expected = { title: 'Delivery Delayed', message: 'Due to operational reasons' };
        expect(getTrackingStatus('Delayed')).toEqual(expected);
        expect(getTrackingStatus('Shipment is delayed')).toEqual(expected);
    });

    it('returns fallback with title case mapping for unknown statuses', () => {
        expect(getTrackingStatus('custom status event')).toEqual({
            title: 'Custom Status Event',
            message: 'Status update received'
        });

        expect(getTrackingStatus('arrived at facility')).toEqual({
            title: 'Arrived At Facility',
            message: 'Status update received'
        });
    });

    it('handles extra spaces and irregular casing', () => {
        const expected = { title: 'Out For Delivery', message: 'Your item is out for delivery' };
        expect(getTrackingStatus('   OuT FoR DeLIVeRy   ')).toEqual(expected);
    });
});
