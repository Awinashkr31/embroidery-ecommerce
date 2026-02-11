
/**
 * Get estimated delivery date range (Generic)
 * @param {number} minDays 
 * @param {number} maxDays 
 * @returns {string} Formatted date range (e.g., "15 Feb - 17 Feb")
 */
export const getEstimatedDeliveryDate = (minDays = 5, maxDays = 7) => {
    const today = new Date();
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { day: 'numeric', month: 'short' };
    
    return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
};
