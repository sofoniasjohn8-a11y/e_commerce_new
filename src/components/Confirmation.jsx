import React, { useContext, useEffect, useState } from 'react'
import Layout from './common/Layout'
import { useParams } from 'react-router-dom';
import { apiUrl, userToken } from './common/http';
import { toast } from 'react-toastify';
import { CartContext } from './context/Cart';

const Confirmation = () => {
  const {updateItem,clearCart} = useContext(CartContext);
  const [order,setOrder] = useState(null);
  const [loading,setLoading] = useState(false);
  const params = useParams();

  const FetchOrder = async () => {
    setLoading(true);
           try {
               const res = await fetch(`${apiUrl}/get-order-details/${params.id}`, {
                   'method': 'GET',
                   'headers': {
                       'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': `Bearer ${userToken()}`
                   }
               });
               const result = await res.json();
               if (result.status === 200) {
                  setLoading(false);
                   setOrder(result.data);
                   clearCart();
                   
               } else {
                setLoading(false);
                   toast.error(result.message);
               }
           } catch (error) {
            setLoading(false);
               toast.error("Error fetching category.");
           }
       }
       useEffect(()=>{
        FetchOrder()
       },[]);
  
  return (
   <Layout>
        <div className="container py-5">
          {
            loading==true && 
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
          }
          {
            loading === false  && order && 
            <>
                  <div className="row">
                  <h2 className="text-center text-success fw-bold">Thank You!</h2>
                  <p className="text-center text-muted">Your Order has been Succesfully Placed.</p>
              </div>
              <div className="card shadow">
                <div className="card-body">
                  <h3 className='fw-bold'>Order Summary</h3>
                  <hr/>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Order ID:</strong>{order.id}</p>
                      <p><strong>Date:</strong> {order.created_at}</p>
                      <p><strong>Status:</strong>
                      {
                        order.status == 'pending' &&  <span className="badge bg-warning">{order.status}</span>
                      }
                      {
                        order.status == 'shipped' &&  <span className="badge bg-warning">{order.status}</span>
                      }
                      {
                        order.status == 'delivered' &&  <span className="badge bg-success">{order.status}</span>
                      }
                      {
                        order.status == 'cancelled' &&  <span className="badge bg-danger">{order.status}</span>
                      }
                      
                      </p>
                      {
                        order.payment_status == 'not paid' && <p><strong>Payment :</strong>Cash on Delivery</p>
                      }
                      
                    </div>
                    <div className="col-md-6">
                      <p><strong>Customer :</strong>{order.name}</p>
                      <p><strong>Address:</strong> {order.address},{order.city},{order.state},{order.zip}</p>
                      <p><strong>Contact:</strong> {order.mobile}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table-striped table-borderd table">
                        <thead className='table-light'>
                          <tr>
                            <th>Items</th>
                              <th>Quantity</th>
                              <th width='150'>Price</th>
                              <th width='150'>Total</th>
                          
                          </tr>
                        </thead>
                        <tbody>
                          
                            {
                              order.items && order.items.map(item =>(
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.unit_price}</td>
                                    <td>{item.price}</td>
                                  </tr>
                              ))
                            }
                        
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className='text-end fw-bold' colspan={3}>SubTotal</td>
                            <td>{order.subtotal}</td>
                          </tr>
                          <tr>
                            <td className='text-end fw-bold' colspan={3}>Shipping</td>
                            <td>{order.shipping}</td>
                          </tr>
                          <tr>
                            <td className='text-end fw-bold' colspan={3}>GrandTotal</td>
                            <td>{order.grand_total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="text-center">
                      <button className="btn btn-primary">View Order Details</button>
                      <button className="btn btn-outline-secondary ms-2">Continue Shopping</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          {
             loading == false && !order && 
              <div className="row">
                  <h2 className="text-center text-warning fw-bold text-muted">Order Not Found!</h2>
              </div>
          }
        
      </div>
    </Layout>
  )
}

export default Confirmation