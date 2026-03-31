import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import UserSidebar from '../UserSidebar'
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiUrl, userToken } from '../common/http';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

export const OrderDetail = () => {
     const [order,setOrder] = useState({});
            const [loading,setLoading] = useState(false);
            const [items,setItems] = useState([]);
            const params = useParams();
            const {
                    register,
                    handleSubmit,
                    reset,
                    formState:{errors},
                } = useForm();
            const fetchOrder = useCallback(async () => {
                
            setLoading(true);
            try {
                console.log(`id : ${params.id}`)
                const res = await fetch(`${apiUrl}/get-order-detail/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${userToken()}`
                    }
                });
                const result = await res.json();
                if (result.status === 200) {
                    console.log(`inside detail : ${result.data}`);
                    setOrder(result.data);
                    setItems(result.data.items || []);
                    reset({
                        status: result.data.status,
                        payment_status: result.data.payment_status,
                    });
                } else {
                    toast.error("Order not found");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("Failed to load order");
            } finally {
                setLoading(false);
            }
        }, []);
        useEffect(()=>{
            fetchOrder();
        },[]);
  return (
     <Layout>
        <div className="container py-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0 ms-4'>My Account</h4>
            <Link to="/account/orders" className="btn btn-primary">Back</Link>
          </div>
          <div className="col-md-3">
          <UserSidebar/>
          </div>
          <div className="col-md-9  ">
          <div className="card shadow">
             <div className="card-body p-4">
                            {
                                loading == true && <Loader/>
                            }
                            {
                                loading == false && 
                                <div>
                                    <div className="row">
                                <div className="col-md-4">
                                    <h4>Order ID: {order.id}</h4>
                                    {
                                        order.status == 'pending' && <span className='badge text-bg-warning'>{order.status}</span> 
                                                                
                                        }
                                        {
                                        order.status == 'delivered' && <span className='badge text-bg-success'>{order.status}</span> 
                                                                
                                        }
                                        {
                                        order.status == 'shipped' && <span className='badge text-bg-warning'>{order.status}</span> 
                                                                
                                        }
                                        {
                                        order.status == 'cancelled' && <span className='badge text-bg-danger'>{order.status}</span> 
                                                                
                                    }
                                </div>
                                 <div className="col-md-4">
                                     <div className="text-secondary">Date</div>
                                     <h4 className='pt-2'>{order.created_at}</h4>
                                </div>
                                 <div className="col-md-4">
                                    <h4 className="text-secondary">Payment Status</h4>
                                     {
                                        order.payment_status == 'paid' && <span className='badge text-bg-success'>{order.payment_status}</span> 
                                                                
                                        }
                                        {
                                        order.payment_status == 'not paid' && <span className='badge text-bg-warning'>{order.payment_status}</span> 
                                                                
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="py-3">
                                        <strong>{order.name}</strong>
                                        <div>{order.email}</div>
                                        <div>{order.mobile}</div>
                                        <div>{order.address},{order.city},{order.state},{order.zip}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                   <div className='mt-2' >
                                        <strong>Payment Method:</strong><br/>   
                                            {
                                                order.payment_method == 'stripe'? <span className="badge bg-success">Stripe</span> : <span className="badge bg-warning">COD</span>
                                        
                                        }
                                    </div>
                                </div>

                            </div>
                                                        
                            <div className="row">
                            <h3 className="pb-2 "><strong>Items</strong></h3>
                            {
                                items && items.map(item =>(
                                     <div className="row justify-content-end " key={`item-${item.id}`}>
                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                        <div className="d-flex">
                                            {
                                                item.product.image && 
                                                <img  width="70" className="me-3" src={item.product.image_url}></img>
                                            }
                                        {/* <img width="70" className="me-3" src="http://localhost:7000/uploads/products/small/1734940173.png" alt=""/> */}
                                        <div className="d-flex flex-column">
                                            <div className="mb-2"><span>{item.name}</span></div>
                                            <div><button className="btn btn-size">{item.size}</button></div>
                                        </div>
                                        </div>
                                        <div className="d-flex">
                                           <div>X {item.qty}</div>
                                        <div className="ps-3">${item.price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                ))
                            }
                           
                            <div className="row justify-content-end">
                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                        <div>Subtotal</div>
                                        <div>${order.subtotal}</div>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                        <div>Shipping</div>
                                        <div>${order.shipping}</div>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2 text-danger">
                                            <div>Discount</div>
                                            <div>-${order.discount}</div>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                        <div><strong>Grand Total</strong></div>
                                        <div><strong>${order.grand_total}</strong></div>
                                    </div>
                                </div>
                         </div>
                            </div>
                                    </div>
                            }
                        </div>
          </div>
          
          
          </div>
        </div>
      </div>
    </Layout>
  )
}
