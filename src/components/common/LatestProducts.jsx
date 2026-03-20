import React, { useEffect, useState } from 'react'
import productImg1 from '../../assets/images/eight.jpg'
import { adminToken, apiUrl } from './http';
import { toast } from 'react-toastify';

const LatestProducts = () => {
    const [latestProducts,setLatestProducts] = useState([]);
    const fetchLatest = async () => {
                  try {
                      const res = await fetch(`${apiUrl}/products/get-latest`, {
                          'method': 'GET',
                          'headers': {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                              'Authorization': `Bearer ${adminToken()}`
                          }
                      });
                      const result = await res.json();
                      if (result.status === 200) {
                       
                        setLatestProducts(result.data);

                          toast.success(result.message);
                      } else {
                          toast.error(result.message || "something went wrong!");
                      }
                  } catch (error) {
                      toast.error("An error occurred while fetching   the latest products.");
                  }
          }
          useEffect(() =>{
             fetchLatest();
          },[]);
  return (
     <section className='section-2 pt-5'>
        <div className='container'>
            <h2 className="mt-3">Arrivals</h2>
            <div className='row mt-3'>
                {
                    latestProducts && latestProducts.length > 0 && latestProducts.map((latestProduct,index) => (
                <div className="col-md-3 col-6" key={`key-${index}`}>
                        <div className='product card border-0'>
                            <div className='card-img'>
                                <img src={productImg1} alt="" className='w-100'/>
                            </div>
                            <div className='card-body pt-3'>
                                <a href="">{latestProduct.title}</a>
                                <div className='price'>
                                    ${latestProduct.price} <span className='text-decoration-line-through'>${latestProduct.compare_price}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    ))
                }
           
              {/* <div className="col-md-3 col-6">
                <div className='product card border-0'>
                    <div className='card-img'>
                        <img src={productImg1} alt="" className='w-100'/>
                    </div>
                    <div className='card-body pt-3'>
                        <a href="">Red Check Shirt</a>
                        <div className='price'>
                            $50 <span className='text-decoration-line-through'>$80</span>
                        </div>
                    </div>

                </div>
             </div>
              <div className="col-md-3 col-6">
                <div className='product card border-0'>
                    <div className='card-img'>
                        <img src={productImg1} alt="" className='w-100'/>
                    </div>
                    <div className='card-body pt-3'>
                        <a href="">Red Check Shirt</a>
                        <div className='price'>
                            $50 <span className='text-decoration-line-through'>$80</span>
                        </div>
                    </div>

                </div>
             </div>
              <div className="col-md-3 col-6">
                <div className='product card border-0'>
                    <div className='card-img'>
                        <img src={productImg1} alt="" className='w-100'/>
                    </div>
                    <div className='card-body pt-3'>
                        <a href="">Red Check Shirt</a>
                        <div className='price'>
                            $50 <span className='text-decoration-line-through'>$80</span>
                        </div>
                    </div>

                </div>
             </div> */}
            </div>
        </div>
    </section>
  )
}

export default LatestProducts