import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRiceAndCurry } from '../../services/api';

const ViewRiceAndCurry = () => {
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            const response = await getRiceAndCurry();
            setMeals(response.data);
        } catch (err) {
            setError('Failed to fetch rice and curry meals. Please try again.');
            console.error('Error fetching meals:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return `Rs. ${parseFloat(price).toFixed(2)}`;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedMeals = () => {
        if (!sortConfig.key) return meals;

        return [...meals].sort((a, b) => {
            let aValue, bValue;

            switch (sortConfig.key) {
                case 'totalPrice':
                    aValue = parseFloat(a.rice.price) + parseFloat(a.curry1.price) + parseFloat(a.curry2.price);
                    bValue = parseFloat(b.rice.price) + parseFloat(b.curry1.price) + parseFloat(b.curry2.price);
                    break;
                case 'totalPortion':
                    aValue = parseInt(a.rice.portion) + parseInt(a.curry1.portion) + parseInt(a.curry2.portion);
                    bValue = parseInt(b.rice.portion) + parseInt(b.curry1.portion) + parseInt(b.curry2.portion);
                    break;
                case 'riceName':
                    aValue = a.rice.name.toLowerCase();
                    bValue = b.rice.name.toLowerCase();
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'status':
                    aValue = a.saved ? 1 : 0;
                    bValue = b.saved ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleEditMeal = (meal) => {
        // Navigate to edit page with meal data
        navigate('/riceandcurry', { 
            state: { 
                editMode: true, 
                mealData: meal,
                mealId: meal._id 
            } 
        });
    };

    const SortButton = ({ sortKey, children }) => (
        <button
            onClick={() => handleSort(sortKey)}
            className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
            {children}
            {sortConfig.key === sortKey && (
                <span className="text-blue-500">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    const MealDetailModal = ({ meal, onClose }) => {
        if (!meal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Meal Set Details</h2>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[
                                { data: meal.rice, title: "🍚 Rice", color: "yellow" },
                                { data: meal.curry1, title: "🍛 Curry 1", color: "orange" },
                                { data: meal.curry2, title: "🍛 Curry 2", color: "red" }
                            ].map((item, idx) => (
                                <div key={idx} className={`bg-${item.color}-50 rounded-lg p-4 border border-${item.color}-200`}>
                                    <h3 className={`text-lg font-semibold text-${item.color}-700 mb-4`}>{item.title}</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white rounded p-3">
                                            <label className="text-sm text-gray-600">Name:</label>
                                            <p className="font-medium">{item.data.name}</p>
                                        </div>
                                        <div className="bg-white rounded p-3">
                                            <label className="text-sm text-gray-600">Portion:</label>
                                            <p className="font-medium">{item.data.portion} plates</p>
                                        </div>
                                        <div className="bg-white rounded p-3">
                                            <label className="text-sm text-gray-600">Price:</label>
                                            <p className="font-medium text-green-700">{formatPrice(item.data.price)}</p>
                                        </div>
                                        {item.data.image && (
                                            <div className="bg-white rounded p-3">
                                                <label className="text-sm text-gray-600 block mb-2">Image:</label>
                                                <img 
                                                    src={`http://localhost:5000/uploads/${item.data.image}`}
                                                    alt={item.data.name}
                                                    className="w-full h-32 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjRMMTEwIDc0SDkwTDEwMCA2NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Total Price</p>
                                    <p className="text-xl font-bold text-green-700">
                                        {formatPrice(parseFloat(meal.rice.price) + parseFloat(meal.curry1.price) + parseFloat(meal.curry2.price))}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Total Portions</p>
                                    <p className="text-xl font-bold text-blue-700">
                                        {parseInt(meal.rice.portion) + parseInt(meal.curry1.portion) + parseInt(meal.curry2.portion)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className={`text-lg font-bold ${meal.saved ? 'text-green-700' : 'text-yellow-700'}`}>
                                        {meal.saved ? 'Saved' : 'Draft'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Created</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {new Date(meal.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading rice and curry meals...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchMeals}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🍚 Rice & Curry Meals
                    </h1>
                    <p className="text-gray-600 text-lg">
                        View all available rice and curry meal combinations
                    </p>
                    <div className="mt-4 flex justify-center gap-4 text-sm">
                        <span className="bg-white px-4 py-2 rounded-full shadow-sm">
                            📊 Total Meals: <strong>{meals.length}</strong>
                        </span>
                        <button
                            onClick={fetchMeals}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                {/* Meals Table */}
                {meals.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Meals Found</h3>
                        <p className="text-gray-500 mb-6">There are no rice and curry meals available yet.</p>
                        <a
                            href="/riceandcurry"
                            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Add New Meal Set
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                <SortButton sortKey="riceName">🍚 Rice</SortButton>
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">🍛 Curry 1</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">🍛 Curry 2</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                <SortButton sortKey="totalPortion">Total Portions</SortButton>
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                <SortButton sortKey="totalPrice">Total Price</SortButton>
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                <SortButton sortKey="status">Status</SortButton>
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                <SortButton sortKey="createdAt">Created</SortButton>
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {getSortedMeals().map((meal, index) => {
                                            const totalPrice = parseFloat(meal.rice.price) + parseFloat(meal.curry1.price) + parseFloat(meal.curry2.price);
                                            const totalPortion = parseInt(meal.rice.portion) + parseInt(meal.curry1.portion) + parseInt(meal.curry2.portion);
                                            
                                            return (
                                                <tr key={meal._id || index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-yellow-100 flex-shrink-0">
                                                                {meal.rice.image ? (
                                                                    <img 
                                                                        src={`http://localhost:5000/uploads/${meal.rice.image}`}
                                                                        alt={meal.rice.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div className="w-full h-full flex items-center justify-center text-yellow-600 text-xs">
                                                                    🍚
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{meal.rice.name}</p>
                                                                <p className="text-xs text-gray-500">{meal.rice.portion} g • {formatPrice(meal.rice.price)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                                                                {meal.curry1.image ? (
                                                                    <img 
                                                                        src={`http://localhost:5000/uploads/${meal.curry1.image}`}
                                                                        alt={meal.curry1.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div className="w-full h-full flex items-center justify-center text-orange-600 text-xs">
                                                                    🍛
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{meal.curry1.name}</p>
                                                                <p className="text-xs text-gray-500">{meal.curry1.portion} g • {formatPrice(meal.curry1.price)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-red-100 flex-shrink-0">
                                                                {meal.curry2.image ? (
                                                                    <img 
                                                                        src={`http://localhost:5000/uploads/${meal.curry2.image}`}
                                                                        alt={meal.curry2.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div className="w-full h-full flex items-center justify-center text-red-600 text-xs">
                                                                    🍛
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{meal.curry2.name}</p>
                                                                <p className="text-xs text-gray-500">{meal.curry2.portion} g • {formatPrice(meal.curry2.price)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {totalPortion} g
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="text-lg font-bold text-green-700">
                                                            {formatPrice(totalPrice)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            meal.saved 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {meal.saved ? '✓ Saved' : '⏳ Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-gray-500">
                                                        {new Date(meal.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex gap-2 justify-center">
                                                            <button
                                                                onClick={() => setSelectedMeal(meal)}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditMeal(meal)}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {getSortedMeals().map((meal, index) => {
                                const totalPrice = parseFloat(meal.rice.price) + parseFloat(meal.curry1.price) + parseFloat(meal.curry2.price);
                                const totalPortion = parseInt(meal.rice.portion) + parseInt(meal.curry1.portion) + parseInt(meal.curry2.portion);
                                
                                return (
                                    <div key={meal._id || index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-bold">Set #{index + 1}</h3>
                                                <div className="text-right">
                                                    <p className="text-sm opacity-90">Total</p>
                                                    <p className="text-xl font-bold">{formatPrice(totalPrice)}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between text-sm opacity-90">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    meal.saved ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}>
                                                    {meal.saved ? '✓ Saved' : '⏳ Draft'}
                                                </span>
                                                <span>{totalPortion} g total</span>
                                            </div>
                                        </div>

                                        {/* Meal Items */}
                                        <div className="p-4 space-y-3">
                                            {/* Rice */}
                                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-yellow-100 flex-shrink-0">
                                                    {meal.rice.image ? (
                                                        <img 
                                                            src={`http://localhost:5000/uploads/${meal.rice.image}`}
                                                            alt={meal.rice.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className="w-full h-full flex items-center justify-center text-yellow-600">
                                                        🍚
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{meal.rice.name}</p>
                                                    <p className="text-sm text-gray-600">{meal.rice.portion} g • {formatPrice(meal.rice.price)}</p>
                                                </div>
                                            </div>

                                            {/* Curry 1 */}
                                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                                                    {meal.curry1.image ? (
                                                        <img 
                                                            src={`http://localhost:5000/uploads/${meal.curry1.image}`}
                                                            alt={meal.curry1.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className="w-full h-full flex items-center justify-center text-orange-600">
                                                        🍛
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{meal.curry1.name}</p>
                                                    <p className="text-sm text-gray-600">{meal.curry1.portion} g • {formatPrice(meal.curry1.price)}</p>
                                                </div>
                                            </div>

                                            {/* Curry 2 */}
                                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-red-100 flex-shrink-0">
                                                    {meal.curry2.image ? (
                                                        <img 
                                                            src={`http://localhost:5000/uploads/${meal.curry2.image}`}
                                                            alt={meal.curry2.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className="w-full h-full flex items-center justify-center text-red-600">
                                                        🍛
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{meal.curry2.name}</p>
                                                    <p className="text-sm text-gray-600">{meal.curry2.portion} g • {formatPrice(meal.curry2.price)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(meal.createdAt).toLocaleDateString()}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedMeal(meal)}
                                                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditMeal(meal)}
                                                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Detail Modal */}
                <MealDetailModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
            </div>
        </div>
    );
};

export default ViewRiceAndCurry;
