import React, { useEffect, useState } from 'react'
import Layout from '../components/common/Layout.jsx'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation  } from 'swiper/modules';
import { Rating } from 'react-simple-star-rating'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProductImgOne from '../assets/images/Mens/fivee.jpg'
import ProductImgTwo from '../assets/images/Mens/six.jpg'
import ProductImgThree from '../assets/images/Mens/seven.jpg'
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from './common/http.jsx';


const Product = () => {
        const [thumbsSwiper, setThumbsSwiper] = useState(null);
        const [rating, setRating] = useState(4);
        const [product,setProduct] = useState([]);
         const [loading,setLoading] = useState(false);
         const [productImage,setProductImage] = useState([])
         const [productSizes,setProductSizes] = useState([])
         const [sizeChecked,setSizeChecked] = useState([]);
        const params = useParams()
        
    const FetchProduct = async () => {
            // let search = []
            // let params = ''
            // if(catChecked.length > 0){
            //     search.push(['category',catChecked])
            // }
            // if(brandChecked.length > 0){
            //     search.push(['brand',brandChecked])
            // }
            // if(search.length > 0){
            //    params =   new URLSearchParams(search)
            //    setSearchParams(params)
            // }
            // else{
            //     setSearchParams([])
            // }  
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/get-product/${params.id}`, {
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
                   
                    setProduct(result.data);
                    setProductImage(result.data.product_images);
                   setProductSizes(result.data.product_sizes)
                    console.log(result.data.product_sizes);
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
        useEffect(()=>{
            FetchProduct()
        },[]);
  return (
    <>
    <Layout>
    <div className="container product-detail">
        <div className="row">
            <div className="col-md-12">
                <nav aria-label="breadcrumb" className='py-4'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page"><Link to="/shop">Shop</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Dummy Product Title</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div className="row mb-5">
            <div className="col-md-5">
                <div className="row">
                    <div className="col-md-2">
                       <Swiper
                            onSwiper={setThumbsSwiper}
                            direction={'vertical'}
                            spaceBetween={10}
                            slidesPerView={productImage.length} // Reduced from 6 to ensure they fit the height
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper"
                            style={{ height: '500px' }} // CRITICAL: Vertical needs a fixed height
                        >
                            {product.product_images?.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img src={item.image_url} className='w-100' style={{ height: '80px', objectFit: 'cover' }} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                     </div>
                    <div className="col-md-10">
                            <Swiper
                                style={{
                                '--swiper-navigation-color': '#000',
                                '--swiper-pagination-color': '#000',
                                }}
                                loop={true}
                                spaceBetween={0}
                                navigation={true}
                                observer={true}           // Add this
                                observeParents={true}
                               thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2"
                            >
                                  {
                                        product.product_images && product.product_images.map(product_image =>(
                                             <SwiperSlide>
                                                <div className='content'>
                                                    <img 
                                                        src={product_image.image_url} 
                                                        alt="" 
                                                        className='w-100' />
                                                </div>                                                                      
                                            </SwiperSlide>
                                        ))
                                    }
                               
                            </Swiper>
                    </div>
                </div>
            </div>
            <div className="col-md-7">
                <h2>
                    {product.title}
                </h2>
                <div className='d-flex'>
                  <Rating
                  readonly
                    initialValue={rating}
                  
                  />
                 <span className=" pt-1 ps-2">10 Reviews</span>
                </div>
                <div className="price h4 py-3">
                    ${product.price} &nbsp;
                    {product.compare_price && <span className='text-decoration-line-through'>${product.compare_price}</span>}
                </div>
                <div className="short-desc">
                    {product.short_description}
                </div>
                <div className="pt-3">
                    <strong>Select Size</strong>
                    <div className="sizes pt-2">
                        {
                            productSizes && productSizes.map(productSize =>(
                                 <button className="btn btn-size me-2" key={`prod-${productSize.id}`}>{productSize.size.name}</button>
                            ))
                        }
                    </div>
                </div>
                <div className="add-to-cart my-4">
                    <button className='btn btn-primary text-uppercase'>Add to Cart</button>
                </div>
                <hr/>
                <div className="sku">
                    <strong> SKU : </strong>{product.sku}
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <Tabs
                    defaultActiveKey="home"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                    >
                        <Tab eventKey="home" title="Description">
                           <div dangerouslySetInnerHTML={{__html:product.description}}></div>
                        </Tab>
                        <Tab eventKey="profile" title="Reviews(10)">
                            Reviews
                        </Tab>
                    </Tabs>
            </div>
        </div>
    </div>
    </Layout>
    </>
  )
}

export default Product