import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { batch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { addOrder } from '../redux/slices/orderSlice';
import { decrementQuantity } from '../redux/slices/productSlice';
import { clearPendingOrder } from '../redux/slices/pendingOrderSlice';

const PaymentMethod = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    
    const pendingOrder = useSelector((state) => state.pendingOrder);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const paymentMethods = [
        {
            id: 'credit_card',
            name: 'Credit Card',
            icon: '💳'
        },
        {
            id: 'bank_transfer',
            name: 'Bank Transfer',
            icon: '🏦'
        },
        {
            id: 'e_wallet',
            name: 'E-Wallet',
            icon: '📱'
        }
    ];

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        setPaymentDetails({});
        setError('');
    };

    const handleInputChange = (field, value) => {
        setPaymentDetails((prev) => ({ ...prev, [field]: value }));
    };

    const validatePaymentDetails = () => {
        if (selectedMethod === 'credit_card' && !paymentDetails.cardNumber) {
            return 'Credit Card number is required.';
        }
        if (selectedMethod === 'bank_transfer' && !paymentDetails.bankAccount) {
            return 'Bank Account number is required.';
        }
        if (selectedMethod === 'e_wallet' && !paymentDetails.walletNumber) {
            return 'E-Wallet number is required.';
        }
        return '';
    };

    const handlePayment = async () => {
        if (!selectedMethod) {
            setError('Please select a payment method before proceeding.');
            return;
        }
    
        const validationError = validatePaymentDetails();
        if (validationError) {
            setError(validationError);
            return;
        }
    
        setIsProcessing(true);
        setError('');
    
        try {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
    
            const orderId = `ORD${Date.now()}`;
    
            batch(() => {
                dispatch(addOrder({
                    id: orderId,
                    items: pendingOrder.items,
                    total: pendingOrder.total,
                    date: new Date().toISOString(),
                    paymentMethod: selectedMethod,
                    paymentDetails
                }));
    
                pendingOrder.items.forEach(item => {
                    for (let i = 0; i < item.quantity; i++) {
                        dispatch(decrementQuantity(item.id));
                    }
                });
    
                dispatch(clearCart());
                dispatch(clearPendingOrder());
            });
    
            navigate('/order-history', { state: { successMessage: 'Payment successful!' }, replace: true });
        } catch (error) {
            setError(error.message || 'Payment processing failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Payment Method</h2>

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Select Payment Method</h5>

                            {paymentMethods.map(method => (
                                <div 
                                    key={method.id}
                                    className={`d-flex align-items-center p-3 border rounded mb-3 ${selectedMethod === method.id ? 'border-primary' : ''}`}
                                    onClick={() => handleMethodSelect(method.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="fs-4 me-3">{method.icon}</div>
                                    <div>
                                        <h6 className="mb-0">{method.name}</h6>
                                    </div>
                                    <div className="ms-auto">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={selectedMethod === method.id}
                                            onChange={() => handleMethodSelect(method.id)}
                                            className="form-check-input"
                                        />
                                    </div>
                                </div>
                            ))}

                            {selectedMethod === 'credit_card' && (
                                <div className="mt-3">
                                    <label>Credit Card Number</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={paymentDetails.cardNumber || ''}
                                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                    />
                                </div>
                            )}

                            {selectedMethod === 'bank_transfer' && (
                                <div className="mt-3">
                                    <label>Bank Account Number</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={paymentDetails.bankAccount || ''}
                                        onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                                    />
                                </div>
                            )}

                            {selectedMethod === 'e_wallet' && (
                                <div className="mt-3">
                                    <label>E-Wallet Number</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={paymentDetails.walletNumber || ''}
                                        onChange={(e) => handleInputChange('walletNumber', e.target.value)}
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger mt-3">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Order Summary</h5>

                            {pendingOrder.items.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>{item.title} x {item.quantity}</span>
                                    <span>{formatter.format(item.price * item.quantity)}</span>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <strong>Total</strong>
                                <strong>{formatter.format(pendingOrder.total)}</strong>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Processing...
                                    </>
                                ) : `Pay ${formatter.format(pendingOrder.total)}`}
                            </button>

                            <button
                                className="btn btn-outline-secondary w-100 mt-2"
                                onClick={() => navigate('/cart')}
                                disabled={isProcessing}
                            >
                                Back to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;