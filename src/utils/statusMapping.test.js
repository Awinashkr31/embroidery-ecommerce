import { describe, it, expect } from 'vitest';
import { getTrackingStatus } from './statusMapping';

describe('getTrackingStatus', () => {
    it('handles falsy or empty inputs', () => {
        expect(getTrackingStatus(null)).toEqual({ title: 'Unknown Status', message: '' });
        expect(getTrackingStatus(undefined)).toEqual({ title: 'Unknown Status', message: '' });
        expect(getTrackingStatus('')).toEqual({ title: 'Unknown Status', message: '' });
    });

    it('handles non-string inputs safely', () => {
        const expected = { title: '12345', message: 'Status update received' };
        expect(getTrackingStatus(12345)).toEqual(expected);
        expect(getTrackingStatus({ some: 'object' })).toEqual({ title: '[object Object]', message: 'Status update received' });
        expect(getTrackingStatus(['manifested'])).toEqual({ title: 'Order Confirmed', message: 'Your order has been placed' });
    });

    it('maps Order Confirmed status correctly', () => {
        const expected = { title: 'Order Confirmed', message: 'Your order has been placed' };
        expect(getTrackingStatus('manifested')).toEqual(expected);
        expect(getTrackingStatus('placed')).toEqual(expected);
        expect(getTrackingStatus('pending')).toEqual(expected);
        expect(getTrackingStatus('Order Manifested')).toEqual(expected);
    });

    it('maps Order Processed status correctly', () => {
        const expected = { title: 'Order Processed', message: 'Seller has processed your order' };
        expect(getTrackingStatus('invoiced')).toEqual(expected);
        expect(getTrackingStatus('ready for pickup')).toEqual(expected);
        expect(getTrackingStatus('booked')).toEqual(expected);
        expect(getTrackingStatus('processing')).toEqual(expected);
    });

    it('maps Picked Up status correctly', () => {
        const expected = { title: 'Picked Up', message: 'Your item has been picked up by Delhivery' };
        expect(getTrackingStatus('picked up')).toEqual(expected);
        expect(getTrackingStatus('Item picked up')).toEqual(expected);
    });

    it('maps Shipped status correctly', () => {
        const expectedInTransit = { title: 'Shipped', message: 'Shipment is on the way' };
        expect(getTrackingStatus('in transit')).toEqual(expectedInTransit);

        const expectedReachedHub = { title: 'Shipped', message: 'Shipment received at nearest hub' };
        expect(getTrackingStatus('reached at hub')).toEqual(expectedReachedHub);
        expect(getTrackingStatus('dispatched')).toEqual(expectedReachedHub);
    });

    it('maps Out For Delivery status correctly', () => {
        const expected = { title: 'Out For Delivery', message: 'Your item is out for delivery' };
        expect(getTrackingStatus('out for delivery')).toEqual(expected);
    });

    it('maps Delivered status correctly', () => {
        const expected = { title: 'Delivered', message: 'Your item has been delivered' };
        expect(getTrackingStatus('delivered')).toEqual(expected);
        // Note: 'undelivered' should not map to 'Delivered'
    });

    it('does not map undelivered to Delivered status', () => {
        // "undelivered" should not match the Delivered rule
        const deliveredExpected = { title: 'Delivered', message: 'Your item has been delivered' };
        expect(getTrackingStatus('undelivered')).not.toEqual(deliveredExpected);

        // "delivered" combined with "un" (e.g. un-delivered) shouldn't match either
        expect(getTrackingStatus('un-delivered')).not.toEqual(deliveredExpected);
    });

    it('maps Delivery Attempt Failed status correctly', () => {
        const expected = { title: 'Delivery Attempt Failed', message: 'Delivery attempt failed' };
        expect(getTrackingStatus('undelivered')).toEqual(expected);
        expect(getTrackingStatus('failed')).toEqual(expected);
    });

    it('maps Returned status correctly', () => {
        const expected = { title: 'Returned', message: 'Item is being returned to seller' };
        expect(getTrackingStatus('RTO Initiated')).toEqual(expected);
        expect(getTrackingStatus('return to origin')).toEqual(expected);
    });

    it('handles special Delayed status', () => {
        const expected = { title: 'Delivery Delayed', message: 'Due to operational reasons' };
        expect(getTrackingStatus('delayed')).toEqual(expected);
        expect(getTrackingStatus('shipment delayed')).toEqual(expected);
    });

    it('handles fallback string formatting correctly', () => {
        expect(getTrackingStatus('custom status')).toEqual({
            title: 'Custom Status',
            message: 'Status update received'
        });
        expect(getTrackingStatus('unknown-event')).toEqual({
            title: 'Unknown-event',
            message: 'Status update received'
        });
        expect(getTrackingStatus('A VERY LONG STATUS UPDATE')).toEqual({
            title: 'A Very Long Status Update',
            message: 'Status update received'
        });
    });

    it('normalizes inputs by lowercasing and trimming', () => {
        const expected = { title: 'Order Confirmed', message: 'Your order has been placed' };
        expect(getTrackingStatus('  MANIFESTED  ')).toEqual(expected);
        expect(getTrackingStatus('\tplaced\n')).toEqual(expected);
    });
});
