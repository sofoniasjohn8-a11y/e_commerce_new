import React, { useEffect, useState } from 'react'
import productImg1 from '../../assets/images/eleven.jpg'
import { adminToken, apiUrl } from './http';
import { toast } from 'react-toastify';

const FeaturedProducts = () => {
   const [featuredProducts,setFeaturedProducts] = useState([]);
      const fetchFeatured = async () => {
                    try {
                        const res = await fetch(`${apiUrl}/products/get-featured`, {
                            'method': 'GET',
                            'headers': {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${adminToken()}`
                            }
                        });
                        const result = await res.json();
                        if (result.status === 200) {
                         console.log(result.data);
                          setFeaturedProducts(result.data);
                            toast.success(result.message);
                        } else {
                            toast.error(result.message || "something went wrong!");
                        }
                    } catch (error) {
                        toast.error("An error occurred while fetching   the featured products.");
                    }
            }
            useEffect(() =>{
               fetchFeatured();
            },[]);
    return (
       <section className='section-2 pt-5'>
          <div className='container'>
              <h2 className="mt-3">Featured</h2>
              <div className='row mt-5'>
                  {
                      featuredProducts && featuredProducts.length > 0 && featuredProducts.map((featuredProduct,index) => (
                  <div className="col-md-3 col-6" key={`key-${index}`}>
                      <div className='product card border-0'>
                          <div className='card-img'>
                                  <img src={featuredProduct.image_url} alt="" className='w-100'/>
                              </div>
                              <div className='card-body pt-3'>
                                  {featuredProduct.title && <span >{featuredProduct.title}</span>}
                                  <div className='price'>
                                      ${featuredProduct.price }
                                      {
                                          featuredProduct.compare_price && <span className='text-decoration-line-through ms-2'>${featuredProduct.compare_price}</span>
                               
                                      }
                              
                               
  
                                  </div>
                              </div>
                                  
                      </div>
                  </div>
                      ))
                  }
             
               
              </div>
          </div>
      </section>
    )
}

export default FeaturedProducts