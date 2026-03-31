import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from './context/Cart';
import { set, useForm } from 'react-hook-form';
import { apiUrl, userToken } from './common/http';
import { toast } from 'react-toastify';
import Loader from './common/Loader';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [PaymentMethod, SetPaymentMethod] = useState('cod');
    const [paymentStatus, SetPaymentStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const { cartData, shipping, SubTotal, GrandTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/get-profile-detail`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${userToken()}`
                    }
                });
                const result = await res.json();
                if (result.data) {
                    return {
                        name: result.data.name,
                        email: result.data.email,
                        address: result.data.address,
                        state: result.data.state,
                        city: result.data.city,
                        zip: result.data.zip,
                        mobile: result.data.mobile,
                    };
                }
            } catch (error) {
                console.error("Profile fetch error", error);
            } finally {
                setLoading(false);
            }
            return {};
        }
    });

    const HandlePaymentStatus = (e) => {
        SetPaymentMethod(e.target.value);
    }

    const saveOrder = async (orderData, Payment_status) => {
        setLoading(true);
        const formData = {
            ...orderData,
            grand_total: GrandTotal(),
            subtotal: SubTotal(),
            shipping: shipping(),
            discount: 0,
            payment_status: Payment_status,
            payment_method: PaymentMethod,
            status: 'pending',
            cart: cartData
        };

        try {
            const response = await fetch(`${apiUrl}/save_product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === 200) {
                localStorage.removeItem('cart');
                navigate(`/order/confirmation/${result.id}`);
            } else {
                const formErrors = result.errors;
                Object.keys(formErrors).forEach((field) => {
                    setError(field, { message: formErrors[field][0] });
                });
            }
        } catch (error) {
            toast.error("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const ProccessOrder = async (data) => {
        SetPaymentStatus('');
        if (PaymentMethod === 'cod') {
            await saveOrder(data, 'not paid');
            return;
        }

        // Get Stripe Element while the form is still mounted
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            toast.error("Credit card field not found.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/create-payment-intent`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userToken()}`
                },
                body: JSON.stringify({ amount: Math.round(GrandTotal() * 100) }),
            });

            const result = await response.json();

            if (!result.client_secret) {
                SetPaymentStatus("Could not initialize payment.");
                toast.error("Could not initialize payment.");
                setLoading(false);
                return;
            }

            const paymentResult = await stripe.confirmCardPayment(result.client_secret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { 
                        name: data.name, 
                        email: data.email,
                        address: {
                            line1: data.address,
                            city: data.city,
                            state: data.state,
                            postal_code: data.zip
                        }
                    }
                },
            });

            if (paymentResult.error) {
                // toast.error(paymentResult.error.message);
                setLoading(false);
            } else if (paymentResult.paymentIntent.status === "succeeded") {
                SetPaymentStatus("Payment successful.");
                await saveOrder(data, 'paid');
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="container pb-5">
            <div className="row">
                <div className="col-md-12">
                    <nav aria-label="breadcrumb" className='py-4'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><Link to="/checkout">Checkout</Link></li>
                        </ol>
                    </nav>
                </div>
            </div>

            {loading && <Loader />}

            <form onSubmit={handleSubmit(ProccessOrder)}>
                <div className="row">
                    <div className="col-md-7">
                        <h2 className="border-bottom pt-2">Billing Details</h2>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input type="text" {...register('name', { required: 'The name is required' })}
                                    className={`form-control ${errors.name && 'is-invalid'}`} placeholder='Name' />
                                {errors.name && <p className='invalid-feedback'>{errors.name.message}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <input type="text" {...register('email', { required: 'The email is required' })}
                                    className={`form-control ${errors.email && 'is-invalid'}`} placeholder="Email" />
                                {errors.email && <p className='invalid-feedback'>{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <textarea {...register('address', { required: 'The address is required' })}
                                className={`form-control ${errors.address && 'is-invalid'}`} placeholder='Address' />
                            {errors.address && <p className='invalid-feedback'>{errors.address.message}</p>}
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input type="text" {...register('city', { required: 'The city is required' })}
                                    className={`form-control ${errors.city && 'is-invalid'}`} placeholder='City' />
                                {errors.city && <p className='invalid-feedback'>{errors.city.message}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <input type="text" {...register('state', { required: 'The state is required' })}
                                    className={`form-control ${errors.state && 'is-invalid'}`} placeholder="State" />
                                {errors.state && <p className='invalid-feedback'>{errors.state.message}</p>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input type="text" {...register('zip', { required: 'The zip is required' })}
                                    className={`form-control ${errors.zip && 'is-invalid'}`} placeholder='Zip' />
                                {errors.zip && <p className='invalid-feedback'>{errors.zip.message}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <input type="text" {...register('mobile', { required: 'The mobile is required' })}
                                    className={`form-control ${errors.mobile && 'is-invalid'}`} placeholder="Mobile" />
                                {errors.mobile && <p className='invalid-feedback'>{errors.mobile.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <h2 className="border-bottom pt-2">Items</h2>
                        <table className="table">
                            <tbody>
                                {cartData && cartData.map(item => (
                                    <tr key={`item-${item.id}`}>
                                        <td><img src={item.image_url} alt="" width={80} /></td>
                                        <td>
                                            <h4>{item.title}</h4>
                                            <div className="d-flex align-items-center pt-3">
                                                <span>${item.price}</span>
                                                <button type="button" className="btn btn-size ms-1">{item.size}</button>
                                                <div className="ps-5">Qty: {item.qty}</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="border-top mt-3">
                            <div className="d-flex justify-content-between py-2">
                                <div>SubTotal</div><div>${SubTotal()}</div>
                            </div>
                            <div className="d-flex justify-content-between py-2">
                                <div>Shipping</div><div>${shipping()}</div>
                            </div>
                            <div className="d-flex justify-content-between py-2">
                                <div><strong>Grand Total</strong></div><div><strong>${GrandTotal()}</strong></div>
                            </div>
                        </div>

                        <h2 className="border-bottom pt-3 pb-2">Payment Method</h2>
                        <div className="mb-3">
                            <input type="radio" id="stripe" value="stripe" onChange={HandlePaymentStatus} checked={PaymentMethod === 'stripe'} />
                            <label htmlFor="stripe" className="ps-2">Stripe</label>

                            <input type="radio" id="cod" value="cod" className='ms-3' onChange={HandlePaymentStatus} checked={PaymentMethod === 'cod'} />
                            <label htmlFor="cod" className="ps-2">Cash on Delivery</label>
                        </div>

                        {PaymentMethod === "stripe" && (
                            <div className='border p-3 mb-3 bg-light'>
                                <CardElement options={{ hidePostalCode: true }} />
                            </div>
                        )}

                        <div className="d-grid pt-3 pb-5">
                            <button className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                        {paymentStatus && <p className='alert alert-info mt-3'>{paymentStatus}</p>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CheckOutForm;