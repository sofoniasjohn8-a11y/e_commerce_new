import React, { useContext, useState } from 'react'
import Layout from './common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import ProductImg from '../assets/images/Mens/seven.jpg'
import { CartContext } from './context/Cart';
import { useForm } from 'react-hook-form';
import { apiUrl, userToken } from './common/http';
import { toast } from 'react-toastify';
import Loader from './common/Loader';

const Checkout = () => {
    const [PaymentMethod,SetPaymentMethod] = useState('cod');
    const [loading,setLoading] = useState();
    const {cartData,shipping,SubTotal,GrandTotal} = useContext(CartContext);
    const navigate = useNavigate();
    const HandlePaymentStatus = (e) =>{
        SetPaymentMethod(e.target.value);
        console.log(e.target.value);
    }
   
    const ProccessOrder = (data) =>{
        if(PaymentMethod == 'cod'){
            saveOrder(data,'not paid');
        }
    }
    const {
          register,
          handleSubmit,
          watch,
          setError,
          formErrors,
          formState: { errors },
        } = useForm({
            
                     defaultValues: async () => {
                       setLoading(true);
                      const res = await fetch(`${apiUrl}/get-profile-detail`, {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                          'Authorization': `Bearer ${userToken()}`
                      }
                  });
                  setLoading(false);
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
                  return {}; 
              }
          });

        const saveOrder = async (orderData,Payment_status) => {
            setLoading(true);
            const formData = { ...orderData, 
                grand_total:GrandTotal(),
                subtotal:SubTotal(),
                shipping:shipping(),
                discount:0,
                payment_status:Payment_status,
                status:'pending',
                cart:cartData
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
        
                const result = await response.json(); // Correctly parsing the response
        
                if (result.status === 200) {
                    localStorage.removeItem('cart');
                    navigate(`/order/confirmation/${result.id}`)
                    toast.success(result.message);
                } else {
                    // console.error("Server Error:", result);
                    // toast.error(result.message);
                     const formErrors = result.errors;
                          Object.keys(formErrors).forEach((field)=>{
                            setError(field,{message : formErrors[field][0]});
                          })
                }
            } catch (error) {
                console.error("Network Error:", error);
                toast.error("Network error. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };
  return (
    <Layout>
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
            {
                loading ==  true && <Loader/>
            }
            {
                loading == false && <form action={handleSubmit(ProccessOrder)}>
                    <div className="row ">
                    
                        <div className="col-md-7">
                            <h2 className="border-bottom pt-2">Billing Details</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input type="text" 
                                        {
                                                ... register('name',{
                                                    required:'The name is required'
                                                })
                                            }
                                        className={`form-control ${errors.name && 'is-invalid'}`} placeholder='Name'/>
                                        {
                                            errors.name && <p className='invalid-feedback'>{errors.name.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <input type="text" 
                                        {
                                                ... register('email',{
                                                    required:'The email is required'
                                                })
                                            }
                                        className={`form-control ${errors.email && 'is-invalid'}`} placeholder="Email"/>
                                        {
                                            errors.email && <p className='invalid-feedback'>{errors.email.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <textarea type="text" 
                                        {
                                                ... register('address',{
                                                    required:'The address is required'
                                                })
                                            }
                                        className={`form-control ${errors.address && 'is-invalid'}`} placeholder='Address'/>
                                        {
                                            errors.address && <p className='invalid-feedback'>{errors.address.message}</p>
                                        }
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                         <input type="text" 
                                        {
                                                ... register('city',{
                                                    required:'The city is required'
                                                })
                                            }
                                        className={`form-control ${errors.city && 'is-invalid'}`} placeholder='City'/>
                                        {
                                            errors.city && <p className='invalid-feedback'>{errors.city.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                         <input type="text" 
                                        {
                                                ... register('state',{
                                                    required:'The state is required'
                                                })
                                            }
                                        className={`form-control ${errors.state && 'is-invalid'}`} placeholder="State"/>
                                        {
                                            errors.state && <p className='invalid-feedback'>{errors.state.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                         <input type="text" 
                                        {
                                                ... register('zip',{
                                                    required:'The zip is required'
                                                })
                                            }
                                        className={`form-control ${errors.zip && 'is-invalid'}`}  placeholder='Zip'/>
                                        {
                                            errors.zip && <p className='invalid-feedback'>{errors.zip.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                         <input type="text" 
                                        {
                                                ... register('mobile',{
                                                    required:'The mobile is required'
                                                })
                                            }
                                        className={`form-control ${errors.mobile && 'is-invalid'}`} placeholder="Mobile"/>
                                        {
                                            errors.mobile && <p className='invalid-feedback'>{errors.mobile.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                        <div className="col-md-5">
                            <h2 className="border-bottom pt-2">Items</h2>

                            <table className="table">
                                    <tbody>
                                        {
                                            cartData && cartData.map(item =>(
                                                    <tr key={`item1-${item.id}`}>
                                            <td ><img src={item.image_url} alt="" width={80}/></td>
                                            <td width={600}>
                                                <h4>{item.title}</h4>
                                                <div className="d-flex align-items-center pt-3">
                                                    <span>{item.price}</span>
                                                    <div className=''>
                                                        <button className="btn btn-size ms-1">{item.size}</button>
                                                    </div>
                                                    <div className="ps-5">
                                                        {item.qty}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            
                                        </tr>
                                            ))
                                        }
                                
                                    </tbody>
                                </table>
                            <div className="row">
                                
                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <div>SubTotal</div>
                                        <div>${SubTotal()}</div>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <div>Shipping</div>
                                        <div>${shipping()}</div>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom py-2">
                                        <div><strong>GrandTotal</strong></div>
                                        <div>${GrandTotal()}</div>
                                    </div>
                                </div>
                        
                                    <div className="col-md-12">
                                        <h2 className="border-bottom pt-3 pb-2">Payment Method</h2>
                                    <div>
                                        <input type="radio" 
                                        onClick={(e)=>HandlePaymentStatus(e)}
                                        defaultChecked={PaymentMethod == 'stripe'}value={'stripe'} />
                                        <label htmlFor="" className="ps-2">Stripe</label>
                                
                                        <input type="radio" 
                                        onClick={(e)=>HandlePaymentStatus(e)}
                                        defaultChecked={PaymentMethod == 'cod'}  value={'cod'} className='ms-3' />
                                        <label htmlFor="" className="ps-2">Cod</label>
                                    </div>
                                    </div>
                            
                                <div className="d-flex  pt-3 pb-5">
                                    <button className="btn btn-primary">Pay Now</button>
                                </div>
                        
                    </div>
                    </div>
              </form>
            }
              
        </div>
    </Layout>
  )
}

export default Checkout