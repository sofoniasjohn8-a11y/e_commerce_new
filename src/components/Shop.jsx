import React from 'react'
import Layout from './common/Layout'
import productImg1 from '../assets/images/eight.jpg'
import { Link } from 'react-router-dom'

const Shop = () => {
  return (
    <>
    <Layout>
        <nav aria-label="breadcrumb" className='py-4'>
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Shop</li>
            </ol>
        </nav>
        <div className="row">
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
               <div className="card-body p-4">
                    <h3 className='mb-3'>Categories</h3>
                      <ul>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Kids</label>
                        </li>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Mens</label>
                        </li>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Womens</label>
                        </li>
                      </ul>
               </div>
            </div>
            <div className="card shadow border-0 mb-3">
               <div className="card-body p-4">
                    <h3 className='mb-3'>Brands</h3>
                      <ul>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Puma</label>
                        </li>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Killer</label>
                        </li>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Flying Machine</label>
                        </li>
                        <li className='mb-2'>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="" className='ps-2'>Levis</label>
                        </li>
                      </ul>
               </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row pb-5 me-5">
            <div className="col-md-4 col-6">
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
               <div className="col-md-4 col-6">
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
               <div className="col-md-4 col-6">
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
               <div className="col-md-4 col-6">
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
               <div className="col-md-4 col-6">
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
               <div className="col-md-4 col-6">
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
              </div>
          </div>
        </div>
    </Layout>
    </>
  )
}

export default Shop