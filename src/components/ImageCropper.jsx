import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check, ZoomIn, RotateCw } from 'lucide-react';

const ImageCropper = ({ imageSrc, aspect: initialAspect = 1, onCancel, onCropComplete }) => {
    // Determine initial aspect selection. If passed aspect is 1, 4/3 etc match it.
    // If we want "Free" as an option, we need to handle aspect prop being undefined or similar in Cropper.
    // However, react-easy-crop needs a number. We can use aspect={undefined} or aspect={null} maybe?
    // Docs say: aspect (number) defaults to 4/3. 
    // Wait, let's just stick to predefined ones and maybe a numeric input if needed?
    // Let's stick to buttons.
    const [aspect, setAspect] = useState(initialAspect); // Control aspect internally
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                   <h3 className="font-bold text-lg text-gray-800">Edit Image</h3>
                   <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                       <X className="w-5 h-5 text-gray-500" />
                   </button>
                </div>

                <div className="relative h-[400px] w-full bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className="p-6 space-y-6">
                     {/* Aspect Ratio Controls */}
                     <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Aspect Ratio</span>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Free', value: undefined }, // Free/Custom
                                { label: '1:1', value: 1 },
                                { label: '4:3', value: 4/3 },
                                { label: '16:9', value: 16/9 },
                                { label: '3:2', value: 3/2 },
                                { label: '2:3', value: 2/3 }, // Portrait
                            ].map((ratio) => (
                                <button
                                    key={ratio.label}
                                    onClick={() => setAspect(ratio.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                        aspect === ratio.value
                                            ? 'bg-rose-900 text-white border-rose-900 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {ratio.label}
                                </button>
                            ))}
                        </div>
                     </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <ZoomIn className="w-5 h-5 text-gray-500" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-900"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <RotateCw className="w-5 h-5 text-gray-500" />
                            <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                onChange={(e) => setRotation(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-900"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-2.5 rounded-xl bg-rose-900 text-white font-bold hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20 flex items-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Save Crop
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
