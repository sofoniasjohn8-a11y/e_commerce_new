import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { adminToken, apiUrl, userToken } from '../../common/http'
import Loader from '../../common/Loader'
import Nostate from '../../common/Nostate'

const ShowOrder = () => {
    const [orders,setOrders] = useState([]);
    const [loading,setLoading] = useState();
    const [items,setItems] = useState([]);

     const FetchOrders = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${apiUrl}/order`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        });
        const result = await res.json();
        if (result.status === 200) {
            console.log(`inside ${result.data.name}`);
            setLoading(false);
            setOrders(result.data);
        } else {
            setLoading(false);
            console.log("something went wrong!");
        }
    } catch (error) {
        setLoading(false);
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
    }
  }
  useEffect(()=>{
    FetchOrders();
  },[]);
  return (
     <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Categories</h4>
            <Link to="/admin/orders" className="btn btn-primary">Create</Link>
          </div>
          <div className="col-md-3">
          <Sidebar/>
          </div>
          <div className="col-md-9">
          <div className="card shadow">
            <div className="card-body p-4">
                 <div className="card-body p-4">
              {
                  loading && <Loader/>
              }
              {
                orders.length == 0 && loading == false && <Nostate text="Orders Not Found"/>
              }
              {
                orders && orders.length > 0 && 
                 <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Account</th>
                    <th>Date</th>
                    <th>Payment_status</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders && orders.map(order =>{
                    return (
                        <tr key={order.id}>
                      <td><Link to={`/admin/orders/${order.id}`}>{order.id}</Link></td>
                      <td>{order.name}</td>
                      <td>{order.email}</td>
                      <td>${order.grand_total}</td>
                      <td>{order.created_at}</td>
                      <td>
                        {
                          order.payment_status == 'paid' && <span className='badge text-bg-success'>{order.payment_status}</span> 
                                                
                        }
                         {
                          order.payment_status == 'not paid' && <span className='badge text-bg-warning'>{order.payment_status}</span> 
                                                
                        }

                      </td>
                     <td>
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
                     </td>
                    </tr>
                      )
                    })
                    }
                  
                </tbody>
              </table>
              }
             
            </div>
            </div>
          </div>
          
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShowOrder