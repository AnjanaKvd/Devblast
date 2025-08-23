import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addRiceAndCurry, uploadImage } from "../../services/api";

export default function RiceAndCurry() {
    const location = useLocation();
    const navigate = useNavigate();
    const { editMode, mealData, mealId } = location.state || {};
    const [formData, setFormData] = useState({
        rice: {
            name: '',
            image: null,
            imagePreview: null,
            imageFile: null,
            portion: '',
            price: ''
        },
        curry1: {
            name: '',
            image: null,
            imagePreview: null,
            imageFile: null,
            portion: '',
            price: ''
        },
        curry2: {
            name: '',
            image: null,
            imagePreview: null,
            imageFile: null,
            portion: '',
            price: ''
        }
    });

    const [currentStep, setCurrentStep] = useState('rice'); // Track current active section

    // Initialize form data with edit data if available
    useEffect(() => {
        if (editMode && mealData) {
            setFormData({
                rice: {
                    name: mealData.rice.name || '',
                    image: mealData.rice.image || null,
                    imagePreview: mealData.rice.image ? `http://localhost:5000/uploads/${mealData.rice.image}` : null,
                    imageFile: null,
                    portion: mealData.rice.portion || '',
                    price: mealData.rice.price || ''
                },
                curry1: {
                    name: mealData.curry1.name || '',
                    image: mealData.curry1.image || null,
                    imagePreview: mealData.curry1.image ? `http://localhost:5000/uploads/${mealData.curry1.image}` : null,
                    imageFile: null,
                    portion: mealData.curry1.portion || '',
                    price: mealData.curry1.price || ''
                },
                curry2: {
                    name: mealData.curry2.name || '',
                    image: mealData.curry2.image || null,
                    imagePreview: mealData.curry2.image ? `http://localhost:5000/uploads/${mealData.curry2.image}` : null,
                    imageFile: null,
                    portion: mealData.curry2.portion || '',
                    price: mealData.curry2.price || ''
                }
            });
            // Set current step to first incomplete section or rice if all complete
            setCurrentStep('rice');
        }
    }, [editMode, mealData]);

    const riceImageRef = useRef(null);
    const curry1ImageRef = useRef(null);
    const curry2ImageRef = useRef(null);
    const riceCameraRef = useRef(null);
    const curry1CameraRef = useRef(null);
    const curry2CameraRef = useRef(null);

    // Check if a section is complete
    const isSectionComplete = (mealType) => {
        const meal = formData[mealType];
        return meal.name && meal.image && meal.portion && meal.price;
    };

    // Get next step after completing current one
    const getNextStep = (currentMealType) => {
        if (currentMealType === 'rice') return 'curry1';
        if (currentMealType === 'curry1') return 'curry2';
        return 'completed';
    };

    const handleInputChange = (mealType, field, value) => {
        // Only allow input for current step
        if (mealType !== currentStep) return;
        
        setFormData(prev => {
            const newData = {
                ...prev,
                [mealType]: {
                    ...prev[mealType],
                    [field]: value
                }
            };
            
            // Check if current section is complete and auto-advance
            const updatedMeal = newData[mealType];
            if (updatedMeal.name && updatedMeal.image && updatedMeal.portion && updatedMeal.price) {
                const nextStep = getNextStep(mealType);
                if (nextStep !== 'completed') {
                    setTimeout(() => setCurrentStep(nextStep), 500); // Small delay for better UX
                }
            }
            
            return newData;
        });
    };

    const saveImageToServer = async (file, filename) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('filename', filename);
            
            const response = await uploadImage(formData);
            return {
                filename: response.data.filename,
                url: response.data.url
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            
            // Show more specific error message
            let errorMessage = 'Failed to upload image. ';
            if (error.response) {
                // Server responded with error status
                errorMessage += error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage += 'Cannot connect to server. Please check if the backend is running.';
            } else {
                // Something else happened
                errorMessage += error.message;
            }
            
            alert(errorMessage);
            return null;
        }
    };

    const createPreviewUrl = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (mealType, file) => {
        if (file) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${mealType}-${timestamp}-${file.name}`;
            
            // Create preview URL immediately for UI feedback
            const previewUrl = await createPreviewUrl(file);
            handleInputChange(mealType, 'imagePreview', previewUrl);
            
            // Upload image to server
            const uploadResult = await saveImageToServer(file, filename);
            
            if (uploadResult) {
                // Store the server filename and file object for later use
                handleInputChange(mealType, 'image', uploadResult.filename);
                handleInputChange(mealType, 'imageFile', file);
            } else {
                handleInputChange(mealType, 'imagePreview', null);
            }
        }
    };

    const handleCameraCapture = async (mealType) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0);
                
                // Generate a filename for the captured image
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `camera-${mealType}-${timestamp}.jpeg`;
                
                // Convert canvas to blob and create preview
                canvas.toBlob(async (blob) => {
                    const file = new File([blob], filename, { type: 'image/jpeg' });
                    
                    // Create preview URL immediately
                    const previewUrl = await createPreviewUrl(file);
                    handleInputChange(mealType, 'imagePreview', previewUrl);
                    
                    // Upload to server
                    const uploadResult = await saveImageToServer(file, filename);
                    
                    if (uploadResult) {
                        handleInputChange(mealType, 'image', uploadResult.filename);
                        handleInputChange(mealType, 'imageFile', file);
                    } else {
                        handleInputChange(mealType, 'imagePreview', null);
                    }
                }, 'image/jpeg', 0.8);

                stream.getTracks().forEach(track => track.stop());
            });
        } catch (error) {
            alert('Camera access denied or not available');
        }
    };

    const handleSave = async () => {
        // Validate required fields
        const requiredFields = ['rice', 'curry1', 'curry2'];
        let isValid = true;

        for (const mealType of requiredFields) {
            const meal = formData[mealType];
            if (!meal.name || !meal.image || !meal.portion || !meal.price) {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            alert('Please fill in all fields for rice and both curry meals');
            return;
        }

        try {
            // Send only meal data with image filenames
            const mealDataToSave = {
                rice: {
                    name: formData.rice.name,
                    image: formData.rice.image,
                    portion: formData.rice.portion,
                    price: formData.rice.price
                },
                curry1: {
                    name: formData.curry1.name,
                    image: formData.curry1.image,
                    portion: formData.curry1.portion,
                    price: formData.curry1.price
                },
                curry2: {
                    name: formData.curry2.name,
                    image: formData.curry2.image,
                    portion: formData.curry2.portion,
                    price: formData.curry2.price
                }
            };

            await addRiceAndCurry(mealDataToSave);
            
            if (editMode) {
                alert('Rice and curry meals updated successfully!');
                // Navigate back to view page after successful edit
                navigate('/viewriceandcurry');
            } else {
                alert('Rice and curry meals saved successfully!');
                // Reset form for new entry
                setFormData({
                    rice: { name: '', image: null, imagePreview: null, imageFile: null, portion: '', price: '' },
                    curry1: { name: '', image: null, imagePreview: null, imageFile: null, portion: '', price: '' },
                    curry2: { name: '', image: null, imagePreview: null, imageFile: null, portion: '', price: '' }
                });
                setCurrentStep('rice'); // Reset to first step
            }
        } catch (error) {
            console.error('Error saving meal data:', error);
            alert(`Failed to ${editMode ? 'update' : 'save'} meal data. Please try again.`);
        }
    };

    const MealCard = ({ mealType, title, imageRef, cameraRef }) => {
        const isActive = currentStep === mealType;
        const isCompleted = isSectionComplete(mealType);
        const isDisabled = !isActive && !isCompleted;
        
        return (
        <div className={`rounded-lg shadow-md p-6 mb-6 transition-all duration-300 ${
            isActive ? 'bg-blue-50 border-2 border-blue-300' : 
            isCompleted ? 'bg-green-50 border-2 border-green-300' : 
            'bg-gray-100 border-2 border-gray-200'
        } ${isDisabled ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${
                    isActive ? 'text-blue-800' : 
                    isCompleted ? 'text-green-800' : 
                    'text-gray-500'
                }`}>{title}</h2>
                <div className="flex items-center gap-2">
                    {isCompleted && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Complete
                        </span>
                    )}
                    {isActive && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            → Active
                        </span>
                    )}
                    {isDisabled && (
                        <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Locked
                        </span>
                    )}
                </div>
            </div>
            
            {/* Name Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {title} Name
                </label>
                <input
                    type="text"
                    value={formData[mealType].name}
                    onChange={(e) => handleInputChange(mealType, 'name', e.target.value)}
                    disabled={isDisabled}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        isDisabled ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' :
                        'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder={isDisabled ? 'Complete previous section first' : `Enter ${title.toLowerCase()} name`}
                />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {title} Image
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="file"
                        ref={imageRef}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(mealType, e.target.files[0])}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => imageRef.current.click()}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                            'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Upload Image
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCameraCapture(mealType)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                            'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Use Camera
                    </button>
                </div>
                {formData[mealType].image && (
                    <div className="mt-2">
                        <div className="w-32 h-32 bg-gray-100 rounded-md border overflow-hidden">
                            {formData[mealType].imagePreview ? (
                                <img 
                                    src={formData[mealType].imagePreview} 
                                    alt={`${title} preview`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center p-2">
                                        <div className="text-xs text-gray-600 mb-1">Selected:</div>
                                        <div className="text-xs font-medium text-gray-800 break-all">
                                            {formData[mealType].image}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 break-all">
                            File: {formData[mealType].image}
                        </div>
                    </div>
                )}
            </div>

            {/* Portion and Price */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portion Per plate
                    </label>
                    <input
                        type="number"
                        value={formData[mealType].portion}
                        onChange={(e) => handleInputChange(mealType, 'portion', e.target.value)}
                        disabled={isDisabled}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            isDisabled ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' :
                            'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder={isDisabled ? 'Locked' : 'Enter portion per plate'}
                    />
                    
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (Rs.)
                    </label>
                    <input
                        type="number"
                        value={formData[mealType].price}
                        onChange={(e) => handleInputChange(mealType, 'price', e.target.value)}
                        disabled={isDisabled}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            isDisabled ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' :
                            'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder={isDisabled ? 'Locked' : '0.00'}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>
        </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {editMode ? 'Edit Rice and Curry Meals' : 'Add Rice and Curry Meals'}
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                            currentStep === 'rice' ? 'bg-blue-100 text-blue-800' : 
                            isSectionComplete('rice') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                currentStep === 'rice' ? 'bg-blue-500' : 
                                isSectionComplete('rice') ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            Rice
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                            currentStep === 'curry1' ? 'bg-blue-100 text-blue-800' : 
                            isSectionComplete('curry1') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                currentStep === 'curry1' ? 'bg-blue-500' : 
                                isSectionComplete('curry1') ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            Curry 1
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                            currentStep === 'curry2' ? 'bg-blue-100 text-blue-800' : 
                            isSectionComplete('curry2') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                currentStep === 'curry2' ? 'bg-blue-500' : 
                                isSectionComplete('curry2') ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            Curry 2
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Complete each section to unlock the next one
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rice Card */}
                    <div className="lg:col-span-2">
                        <MealCard
                            mealType="rice"
                            title="Rice"
                            imageRef={riceImageRef}
                            cameraRef={riceCameraRef}
                        />
                    </div>

                    {/* Curry Cards */}
                    <MealCard
                        mealType="curry1"
                        title="Curry 1"
                        imageRef={curry1ImageRef}
                        cameraRef={curry1CameraRef}
                    />
                    <MealCard
                        mealType="curry2"
                        title="Curry 2"
                        imageRef={curry2ImageRef}
                        cameraRef={curry2CameraRef}
                    />
                </div>

                {/* Save Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleSave}
                        disabled={!isSectionComplete('rice') || !isSectionComplete('curry1') || !isSectionComplete('curry2')}
                        className={`px-8 py-3 font-semibold rounded-md transition-colors shadow-lg ${
                            isSectionComplete('rice') && isSectionComplete('curry1') && isSectionComplete('curry2') ?
                            'bg-red-500 text-white hover:bg-red-600' :
                            'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSectionComplete('rice') && isSectionComplete('curry1') && isSectionComplete('curry2') ?
                            (editMode ? 'Update Rice and Curry Meals' : 'Save Rice and Curry Meals') :
                            'Complete all sections to save'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
