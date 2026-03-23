import React, { useState } from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router-dom'
import ProductImg from '../assets/images/Mens/seven.jpg'

const Checkout = () => {
    const [PaymentMethod,SetPaymentMethod] = useState('cod');
    const HandleSubmit = (e) =>{
        SetPaymentMethod(e.target.value);
    }
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
            <div className="row ">
               
                <div className="col-md-7">
                     <h2 className="border-bottom pt-2">Billing Details</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input type="text" className="form-control"  placeholder='Name'/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input type="text" className="form-control"  placeholder="Email"/>
                            </div>
                        </div>
                    </div>
                     <div className="mb-3">
                        <textarea name="" id="" placeholder="Adress" className="form-control" row={3}></textarea>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input type="text" className="form-control"  placeholder='City'/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input type="text" className="form-control"  placeholder="Status"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input type="text" className="form-control"  placeholder='Zip'/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input type="text" className="form-control"  placeholder="Mobile"/>
                            </div>
                        </div>
                    </div>
                   
                </div>
                <div className="col-md-5">
                     <h2 className="border-bottom pt-2">Items</h2>
                     <table className="table">
                            <tbody>
                                <tr>
                                    <td ><img src={ProductImg} alt="" width={80}/></td>
                                    <td width={600}>
                                        <h4>Dummy Product Title</h4>
                                        <div className="d-flex align-items-center pt-3">
                                            <span>$20</span>
                                            <div className=''>
                                                <button className="btn btn-size ms-1">M</button>
                                            </div>
                                            <div className="ps-5">
                                                X1
                                            </div>
                                        </div>
                                    </td>
                                    
                                    
                                </tr>
                            </tbody>
                        </table>
                    <div className="row">
                            <div className="d-flex justify-content-between border-bottom py-2">
                                <div>SubTotal</div>
                                <div>$10</div>
                            </div>
                            <div className="d-flex justify-content-between border-bottom py-2">
                                <div>Shipping</div>
                                <div>$5</div>
                            </div>
                            <div className="d-flex justify-content-between border-bottom py-2">
                                <div><strong>GrandTotal</strong></div>
                                <div>$15</div>
                            </div>
                        </div>
                  
                            <div className="col-md-12">
                                <h2 className="border-bottom pt-3 pb-2">Payment Method</h2>
                            <div>
                                <input type="radio" 
                                onClick={HandleSubmit}
                                defaultChecked={PaymentMethod == 'stripe'}value={'stripe'} />
                                <label htmlFor="" className="ps-2">Stripe</label>
                           
                                <input type="radio" 
                                onClick={HandleSubmit}
                                defaultChecked={PaymentMethod == 'cod'}  value={'cod'} className='ms-3' />
                                <label htmlFor="" className="ps-2">Cod</label>
                            </div>
                            </div>
                    
                        <div className="d-flex  pt-3 pb-5">
                            <button className="btn btn-primary">Pay Now</button>
                        </div>
                
            </div>
              </div>
        </div>
    </Layout>
  )
}

export default Checkout