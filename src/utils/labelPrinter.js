import html2pdf from 'html2pdf.js';

export const generateShippingLabels = async (orders) => {
    if (!orders || orders.length === 0) return;

    // Create a hidden container for the labels
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    let htmlContent = '';

    orders.forEach((order, index) => {
        // Label HTML Template (approx 4x6 inches ratio)
        // We use inline styles heavily for html2pdf to render correctly
        const labelHtml = `
            <div style="width: 384px; height: 576px; padding: 20px; box-sizing: border-box; font-family: sans-serif; border: 2px solid #000; margin-bottom: 20px; page-break-after: ${index < orders.length - 1 ? 'always' : 'auto'}; background-color: #fff;">
                
                <!-- Header -->
                <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase;">ENBROIDERY</h1>
                    <p style="margin: 5px 0 0; font-size: 12px;">Standard Shipping Label</p>
                </div>

                <!-- Courier & Tracking -->
                ${order.courierName ? `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 16px; font-weight: bold; border: 1px solid #000; display: inline-block; padding: 5px 15px; margin-bottom: 5px;">
                        ${order.courierName.toUpperCase()}
                    </div>
                    ${order.waybillId ? `<div style="font-size: 14px; font-weight: bold;">AWB: ${order.waybillId}</div>` : ''}
                </div>
                ` : ''}

                <!-- Shipping To -->
                <div style="margin-bottom: 15px;">
                    <strong style="font-size: 12px; text-transform: uppercase;">Ship To:</strong>
                    <div style="font-size: 16px; font-weight: bold; margin-top: 5px;">${order.customer?.firstName} ${order.customer?.lastName}</div>
                    <div style="font-size: 14px; margin-top: 3px;">
                        ${order.customer?.address || 'No Address Provided'}<br>
                        ${order.customer?.city || ''}, ${order.customer?.state || ''}<br>
                        <strong>PIN: ${order.customer?.zipCode || ''}</strong>
                    </div>
                    <div style="font-size: 12px; margin-top: 5px;">Ph: ${order.customer?.phone || ''}</div>
                </div>

                <!-- Shipping From (Return Address) -->
                <div style="border-top: 1px solid #000; padding-top: 10px; margin-bottom: 15px;">
                    <strong style="font-size: 10px; text-transform: uppercase;">Return Address:</strong>
                    <div style="font-size: 10px; margin-top: 3px;">
                        Enbroidery Returns<br>
                        123 Fashion Street, Industrial Area<br>
                        Ludhiana, Punjab - 141001<br>
                        Ph: +91 7428013214
                    </div>
                </div>

                <!-- Payment & Order Info -->
                <div style="display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 10px;">
                    <div>
                        <div style="font-size: 10px;">Order ID:</div>
                        <div style="font-size: 12px; font-weight: bold;">#${order.id.slice(0, 8).toUpperCase()}</div>
                        <div style="font-size: 10px; margin-top: 5px;">Weight: 0.5 kg</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px;">Payment Mode:</div>
                        <div style="font-size: 14px; font-weight: bold; text-transform: uppercase;">
                            ${order.paymentMethod === 'cod' ? 'COD' : 'PREPAID'}
                        </div>
                        ${order.paymentMethod === 'cod' ? `
                            <div style="font-size: 10px; margin-top: 2px;">Amount to Collect:</div>
                            <div style="font-size: 16px; font-weight: bold;">Rs. ${order.total}</div>
                        ` : ''}
                    </div>
                </div>

            </div>
        `;
        htmlContent += labelHtml;
    });

    container.innerHTML = htmlContent;

    // html2pdf configuration for a 4x6 label (in mm: ~101.6 x 152.4)
    const opt = {
        margin:       0,
        filename:     `shipping_labels_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: [4, 6], orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(container).save();
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        // Cleanup
        document.body.removeChild(container);
    }
};
