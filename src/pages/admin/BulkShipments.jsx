import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../../config/supabase';

const BulkShipments = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const { addToast } = useToast();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            addToast('Please upload a valid CSV file.', 'error');
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            const text = e.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            
            // Expected headers: Order_ID, Waybill, Courier, Status
            const headers = rows[0].map(h => h.trim().toLowerCase());
            
            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (row.length < 2) continue; // Skip empty rows

                try {
                    const orderId = row[0]?.trim();
                    const waybill = row[1]?.trim();
                    const courier = row[2]?.trim() || 'Delhivery';
                    const newStatus = row[3]?.trim() || 'shipped';

                    if (!orderId || !waybill) continue;

                    const { error } = await supabase
                        .from('orders')
                        .update({ 
                            waybill_id: waybill,
                            courier_name: courier,
                            status: newStatus
                        })
                        .eq('id', orderId);

                    if (error) throw error;
                    
                    // Add log
                    await supabase.from('order_status_logs').insert([{
                        order_id: orderId,
                        status: newStatus,
                        timestamp: new Date().toISOString(),
                        remarks: `Bulk Updated via CSV: ${waybill} (${courier})`
                    }]);

                    successCount++;
                } catch (err) {
                    errorCount++;
                    errors.push(`Row ${i + 1}: ${err.message}`);
                }
            }

            setResults({ successCount, errorCount, errors });
            setLoading(false);
            if (successCount > 0) addToast(`Successfully updated ${successCount} orders.`, 'success');
            if (errorCount > 0) addToast(`Failed to update ${errorCount} orders.`, 'error');
        };

        reader.readAsText(file);
    };

    return (
        <div className="font-body space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-stone-900">Bulk Shipments</h1>
                    <p className="text-stone-500 text-sm mt-0.5">Upload CSV to bulk update tracking numbers</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-0 max-w-2xl">
                <div className="border-2 border-dashed border-stone-200 rounded-2xl p-12 text-center">
                    <Upload className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Upload Tracking CSV</h3>
                    <p className="text-stone-500 text-sm mb-6">CSV must contain: Order_ID, Waybill, Courier, Status</p>
                    
                    <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden" 
                        id="csv-upload" 
                    />
                    <label 
                        htmlFor="csv-upload" 
                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors shadow-sm"
                    >
                        <FileText className="w-4 h-4" />
                        Select CSV File
                    </label>

                    {file && (
                        <div className="mt-6 p-4 bg-stone-50 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-medium text-stone-700">{file.name}</span>
                            <button 
                                onClick={handleUpload}
                                disabled={loading}
                                className="px-4 py-2 bg-rose-900 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-rose-800 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Process Bulk Update'}
                            </button>
                        </div>
                    )}
                </div>

                {results && (
                    <div className="mt-8 space-y-4">
                        <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-2">Results</h4>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold">{results.successCount} Successful</span>
                            </div>
                            {results.errorCount > 0 && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="font-bold">{results.errorCount} Failed</span>
                                </div>
                            )}
                        </div>
                        {results.errors.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg">
                                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                    {results.errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkShipments;
