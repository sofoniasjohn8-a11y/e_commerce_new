import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'
import Loader from '../../common/Loader'
import { useForm } from 'react-hook-form'

const ShowDetails = () => {
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
            const res = await fetch(`${apiUrl}/order/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await res.json();
            if (result.status === 200) {
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
    }, [params.id, reset]);
      
       const updateOrder = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/order/${params.id}`, {
                'method': 'PUT',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body:JSON.stringify(data)
            });
            const result = await res.json();
            if (result.status === 200) {
                console.log(`from update ${result}`);
                setLoading(false);
                await fetchOrder();
            toast.success(result.message);
            } else {
                setLoading(false);
                console.log("something went wrong!");
            }
        } catch (e) {
            setLoading(false);
            console.error("Error updating products:", e.message);
            toast.error("Failed to updating products");
        }
      }
      useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);
  return (
    <Layout>
        <div className="container py-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Orders</h4>
            <Link to="/admin/orders" className="btn btn-primary">Back</Link>
          </div>
          <div className="col-md-3">
          <Sidebar/>
          </div>
          <div className="col-md-9">
            <div className="row">
                <div className="col-md-9">
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
                                   <div className="py-3">
                                     <h4 className="text-secondary">Payment Method</h4>
                                     <p>COD</p>
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
                <div className="col-md-3">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit(updateOrder)}>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select 
                                {
                                    ...register('status',{required:true})
                                }
                                id="status" className='form-select'>
                                    <option value="pending">Pending</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="shipped">Shipped</option>
                                </select>
                            </div>
                             <div className="mb-3">
                                <label htmlFor="Payment_status" className="form-label">Payment Status</label>
                                <select
                                 {
                                    ...register('payment_status',{required:true})
                                }
                                id="Payment_status"
                                 className='form-select'>
                                    <option value="paid">Paid</option>
                                    <option value="not paid">not Paid</option>
                                </select>
                            </div>
                            <div>
                                <button type='submit' className='btn btn-primary' >Update</button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
         
          
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShowDetails