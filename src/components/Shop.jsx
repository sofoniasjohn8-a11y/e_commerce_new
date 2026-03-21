import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import productImg1 from '../assets/images/eight.jpg'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from './common/http';

const Shop = () => {
    const [categories,setCategories] = useState();
    const [brands,setBrands] = useState();
    const [products,setProducts] = useState();
    const [loading,setLoading] = useState(false);
    const [SearchParams,setSearchParams] = new  useSearchParams()
    const [catChecked,setcatChecked] = useState(() => {
        const category =  SearchParams.get('category')
        return category ? category.split(','):[]
     });
    const [brandChecked,setBrandChecked] = useState(()=>{
        const brand = SearchParams.get('brand')
        return brand ? brand.split(','):[]
    });
    

    const FetchCategories = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${apiUrl}/get-categories`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        });
        const result = await res.json();
        if (result.status === 200) {
            setLoading(false);
            setCategories(result.data);
            
        } else {
            setLoading(false);
            console.log("something went wrong!");
        }
    } catch (error) {
        setLoading(false);
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
    }
  }
  const FetchProducts = async () => {
    let search = []
    let params = ''

    if(catChecked.length > 0){
        search.push(['category',catChecked])
    }
    if(brandChecked.length > 0){
        search.push(['brand',brandChecked])
    }
    if(search.length > 0){
       params =   new URLSearchParams(search)
       setSearchParams(params)
    }
    else{
        setSearchParams([])
    }
     
    setLoading(true);
    try {
        const res = await fetch(`${apiUrl}/get-products/?${params}`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        });
        const result = await res.json();
        if (result.status === 200) {
            setLoading(false);
            setProducts(result.data);
           
        } else {
            setLoading(false);
            console.log("something went wrong!");
        }
    } catch (error) {
        setLoading(false);
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
    }
  }
  const FetchBrands = async () => {
   
    
    setLoading(true);
    try {
        const res = await fetch(`${apiUrl}/get-brands`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        });
        const result = await res.json();
        if (result.status === 200) {
            setLoading(false);
            setBrands(result.data);
            
        } else {
            setLoading(false);
            console.log("something went wrong!");
        }
    } catch (error) {
        setLoading(false);
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
    }
  }
  const HandleCategory = (e) =>{
    const {checked,value} = e.target;
    if(checked){
        setcatChecked(pre =>[...pre,value])
    }
    else{
       setcatChecked(catChecked.filter(id => id != value))
    }

  }
  const HandleBrand = (e) =>{
    const {checked,value} = e.target;
    if(checked){
        setBrandChecked(pre =>[...pre,value])
    }
    else{
       setBrandChecked(brandChecked.filter(id => id != value))
    }

  }
  useEffect(()=>{
     FetchCategories()
     FetchBrands()
     FetchProducts()
  },[catChecked,brandChecked])

  return (
    <>
    <Layout>
        <nav aria-label="breadcrumb" className='py-4 ms-2'>
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Shop</li>
            </ol>
        </nav>
        <div className="row ms-2">
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
               <div className="card-body p-4">
                    <h3 className='mb-3'>Categories</h3>
                      <ul>
                        {
                            categories && categories.map(category =>(
                                <li className='mb-2' key={`cat-${category.id}`}>
                                    <input type="checkbox" 
                                    // defaultChecked={SearchParams.get('category') && SearchParams.get('category').includes(category.id)? true :false}
                                     defaultChecked={catChecked.includes(String(category.id))}
                                    value={category.id}
                                     onClick={HandleCategory}
                                     />
                                    <label htmlFor="" className='ps-2'>{category.name}</label>
                            </li>
                            ))
                        }
                      </ul>
               </div>
            </div>
            <div className="card shadow border-0 mb-3">
               <div className="card-body p-4">
                    <h3 className='mb-3'>Brands</h3>
                      <ul>
                        {
                            brands && brands.map(brand =>(
                                <li className='mb-2' key={`bra=${brand.id}`}>
                                    <input type="checkbox" 
                                    value={brand.id}
                                    checked={brandChecked.includes(String(brand.id))}
                                    onClick={HandleBrand}
                                    />
                                    <label htmlFor="" className='ps-2'>{brand.name}</label>
                                </li>
                            ))
                        }
                      </ul>
               </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row pb-5 me-5">
                {
                    products && products.map(product =>(
                        <div className="col-md-4 col-6" key={`pro-${product.id}`}>
                            <div className='product card border-0'>
                                <div className='card-img'>
                                    <img src={product.image_url} alt="" className='w-100'/>
                                </div>
                                <div className='card-body pt-3'>
                                    <a href="">{product.title}</a>
                                    <div className='price'>
                                        {product.price}{" "}
                                        {product.compare_price &&  <span className='text-decoration-line-through'>${product.compare_price}</span>}
                                        
                                    </div>
                                </div>

                            </div>
                       </div>
                    ))
                }
            
               
              </div>
          </div>
        </div>
    </Layout>
    </>
  )
}

export default Shop