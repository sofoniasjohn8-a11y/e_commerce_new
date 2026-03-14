import React, { useEffect, useState , useRef, useMemo} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../../common/Layout';
import Sidebar from '../../common/Sidebar';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrl } from '../../common/http';
import { toast } from 'react-toastify';
import { Controller } from 'react-hook-form';
import JoditEditor from 'jodit-react';


const Edit = ({ placeholder }) => {
     const params = useParams();
     const [products,setProducts] = useState([]);
     const [loading,setLoading] = useState(false);
     const [disabled,setDisabled] = useState(false);
     const [categories,setCategories] = useState([]);
     const [brands,setBrands] = useState([]);
     const [galleryImages,setGalleryImages] = useState([]);
     const [productImages,setProductImages] = useState([]);
     const navigate = useNavigate();
     const editor = useRef(null);
     const [content, setContent] = useState('');
     const config = useMemo(
       () => ({
         readonly: false, // all options from https://xdsoft.net/jodit/docs/,
         placeholder: placeholder || 'Start typings...'
       }),
       [placeholder]
     );
   
       const {
         register,
         handleSubmit,
         watch,
         reset,
         control,
         formState: { errors },
       } = useForm({
        defaultValues : async () =>  {
           
            const res = await fetch(`${apiUrl}/products/${params.id}`, {
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    setProductImages(result.data.product_images)
                    // result.data.product_images && result.data.product_images.length > 0 && result.data.product_images.map((productImage) => {
                    //     galleryImages.push(productImage.image_url);
                    // }   )
                    result.data.product_images && result.data.product_images.length > 0 &&  result.data.product_images.map((productImage) => {
                    // console.log(`productImages : ${productImage.image_url} - ${productImage.id}`);
                    galleryImages.push(productImage.image_url);
                    setGalleryImages(galleryImages);
                    
                    })
                    console.log("Gallery Images:", galleryImages);

                    reset({
                        title: result.data.title,
                        category_id: result.data.category_id,
                        brand_id: result.data.brand_id, 
                        short_description: result.data.short_description,
                        description: result.data.description,
                        price: result.data.price,
                        sku: result.data.sku,
                        qty: result.data.qty,
                        status: String(result.data.status),
                        compare_price: result.data.compare_price,
                        is_featured: result.is_featured,
                        is_featured: result.data.is_featured 
                    })
                }
                );
            
           const result = await response.json();
            return result.data;
        }
       }
       );
       
    //    const FetchProducts = async () => {
    //        setLoading(true);
    //        try {
    //            const res = await fetch(`${apiUrl}/products/${params.id}`, {
    //                'method': 'GET',
    //                'headers': {
    //                    'Content-Type': 'application/json',
    //                    'Accept': 'application/json',
    //                    'Authorization': `Bearer ${adminToken()}`
    //                }
    //            });
    //            const result = await res.json();
    //            if (result.status === 200) {
    //                console.log(result);
    //                setLoading(false);
    //                setProducts(result.data);
    //                console.log(products);
    //            } else {
    //                setLoading(false);
    //                console.log("something went wrong!");
    //            }
    //        } catch (error) {
    //            setLoading(false);
    //            console.error("Error fetching products:", error);
    //            toast.error("Failed to load products");
    //        }
    //      }
       const saveProduct = async (data) =>{
         const formData = {...data,"gallery":gallery};
           console.log(formData);
           setLoading(true);
           const res =  await fetch(`${apiUrl}/products`,{
               'method':'POST',
               'headers':{
                   'Content-Type':'application/json',
                   'Accept':'application/json',
                   'Authorization':`Bearer ${adminToken()}`
               },
                  body : JSON.stringify(formData)
               }).then(res =>res.json(formData))
               .then(result => {
               if(result.status == 200){
                   setLoading(false);
                   console.log(result);
                   toast.success(result.message);
                   navigate('/admin/product');
               }
               else
                   console.log("something went wrong!");
                 console.log(result);
               })
       }
       const FetchCategories = async () => {
           setLoading(true);
           try {
               const res = await fetch(`${apiUrl}/categories`, {
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
                   console.log(categories);
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
                   const res = await fetch(`${apiUrl}/brands`, {
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
                       console.log("brands is fetched ");
                   } else {
                       setLoading(false);
                       console.log("something went wrong!");
                   }
               } catch (error) {
                   setLoading(false);
                   console.error("Error fetching Brands:", error);
                   toast.error("Failed to load brands");
               }
             }
         const handleFile = async (e) => {
       const file = e.target.files[0];
       if (!file) return;
   
       const formData = new FormData();
       formData.append('image', file);
       
       setDisabled(true);
   
       try {
           const res = await fetch(`${apiUrl}/temp-images`, {
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Authorization': `Bearer ${adminToken()}`
               },
               body: formData
           });
   
           const result = await res.json();
   
           if (res.status === 200) {
               setDisabled(false);
               setGallery(prevGallery => [...prevGallery, result.image_id]); 
               galleryImages.push(result.image_url);
               setGalleryImages(galleryImages);
               console.log(galleryImages);
               e.target.value = "";
           } else {
               setDisabled(false);
               toast.error(result.message || "Upload failed");
           }
       } catch (error) {
           setDisabled(false);
           console.error("Upload error:", error);
           toast.error("An error occurred during upload");
       }
   }
       const DeleteImage = async (image_url) => {
        console.log(`Deleting image: ${image_url}`);
        console.log("Current gallery images before deletion:", galleryImages);
          const newGalleryImages = galleryImages.filter(img => img !== image_url);
        console.log("Gallery images after filtering:", newGalleryImages);
        
         setGalleryImages(newGalleryImages);
       }     
         useEffect(() => {
           FetchCategories();
           FetchBrands();
        //    FetchProducts();
         }, []);
        
         
  return (
     <Layout>
        <div className="container">
        <div className="row mb-5" >
            <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Product/Edit</h4>
            <Link to="/admin/product" className="btn btn-primary">Back</Link>
            </div>
            <div className="col-md-3">
            <Sidebar/>
            </div>
            <div className="col-md-9">
            <form onSubmit={handleSubmit(saveProduct)}>
            <div className="card shadow">
                <div className="card-body p-4">
                    <div className="mb-3">
                        <label htmlFor="" className=''>Title</label>
                    <input
                        type="text"
                        {...register('title', {
                            required: 'The title is required'
                        })}
                        className={`form-control ${errors.title && 'is-invalid'}`}
                        placeholder="Title"
                        
                        />

                        {errors.title && (
                        <p className="invalid-feedback">{errors.title.message}</p>
                        )}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">Category</label>
                            <select {
                            ... register('category_id',{
                                required:'The category is required'
                            })
                        }
                         className={`form-control ${errors.category_id && 'is-invalid'}`}>

                              <option value="">Select a category</option>
                              {
                                categories && categories.length > 0 && categories.map((category,index) => (
                                  
                                  <option key={index} value={category.id} >{category.name}</option>
                                ))
                              }
                               
                            </select>
                            {
                                errors.category_id && <p className='invalid-feedback'>{errors.category_id?.message}</p>
                            }
                          </div>
                      </div>
                      <div className="col-md-6">
                         <div className="mb-3">
                            <label htmlFor="" className="form-label">Brand</label>
                            
                              <select {
                            ... register('brand_id',{
                                required:'The brand is required'
                            })
                        }
                         className={`form-control ${errors.brand_id && 'is-invalid'}`}>

                              <option value="">Select a brand</option>
                              {
                                brands && brands.length > 0 && brands.map((brand,index) => (
                                  <option key={index} value={brand.id}>{brand.name}</option>
                                ))
                              }
                             
                            </select>
                              {
                                errors.brand_id && <p className='invalid-feedback'>{errors.brand_id?.message}</p>
                            }
                          </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">Short Description</label>
                      <textarea
                        {...register('short_description', {
                          required: 'The short description is required'
                        })}
                        placeholder="Short Description"
                        className={`form-control ${errors.short_description && 'is-invalid'}`}
                        row="3"
                      />
                      {errors.short_description && (
                        <p className="invalid-feedback">{errors.short_description.message}</p>
                        )}
                    </div>
                    <div className="mb-">
                      <label htmlFor="" className="form-label">Description</label>
                       <Controller
                        name = "description" // The key in your form data
                        control={control}
                        rules={{ required: 'Content is required' }}
                        render={({ field: { onChange, value } }) => (
                            <JoditEditor
                                ref={editor}
                                value={value}
                                config={config}
                                tabIndex={1}
                                // Update the form state whenever the user stops editing
                                onBlur={(newContent) => onChange(newContent)} 
                            />
                        )}
                    />
                    
                    {errors.content && (
                        <p className="text-danger mt-1">{errors.content.message}</p>
                    )}
                    </div>
                    <h3 className="py-3 border-bottom mb-3">Pricing </h3>
                    <div className="row">
                      
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">Price</label>
                          
                          <input type="text"  
                           {...register('price', {
                          required: 'The price is required'
                        })}
                        placeholder="Price"
                        className={`form-control ${errors.price && 'is-invalid'}`}
                        row="3"
                      />
                      {errors.price && (
                        <p className="invalid-feedback">{errors.price.message}</p>
                        )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">Discounted Price</label>
                          <input type="text"  
                          name="compare_price"
                        placeholder="Discounted Price"
                        className={'form-control '}
                        row="3"
                      />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <h3 className="pt-3">Inventory</h3><hr/>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">SKU</label>
                          <input type="text"  
                           {...register('sku', {
                          required: 'The SKU is required'
                        })}
                        placeholder="SKU"
                        className={`form-control ${errors.sku && 'is-invalid'}`}
                        row="3"
                      />
                      {errors.sku && (
                        <p className="invalid-feedback">{errors.sku.message}</p>
                        )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3"> 
                          <label htmlFor="" className="form-label">Barcode</label>
                         <input type="text"  
                          
                        placeholder="Barcode"
                        className='form-control'
                        row="3"
                      />
                      
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <h3 className="pt-2">Qty</h3><hr/>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">Qty</label>
                         <input type="text"  
                            {...register('qty', {
                          required: 'The Qty is required'
                        })}
                        placeholder="Quantity"
                        className={`form-control ${errors.qty && 'is-invalid'}`}
                        row="3"
                      />
                      {errors.qty && (
                        <p className="invalid-feedback">{errors.qty.message}</p>
                        )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className=''>Status</label>
                        <select {
                            ... register('status',{
                                required:'The status is required'
                            })
                        }
                         className={`form-control ${errors.status && 'is-invalid'}`}>
                            <option value="">Select a status</option>
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                        </select>
                          {
                                errors.status && <p className='invalid-feedback'>{errors.status.message}</p>
                            }
                        </div>
                      </div>
                       <div className="mb-3">
                        <label className="form-label">Is Featured?</label>
                        <Controller
                            name="is_featured"
                            control={control}
                            render={({ field }) => (
                                <select 
                                    {...field} // This handles value, onChange, onBlur, and ref
                                    className="form-control"
                                >
                                <option value="">Select a feature</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                       )}
                    />
                 </div>

                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">Image</label>
                      <input type="file" 
                      onChange = {handleFile}
                      className="form-control" />
                    </div>
                    <div className="mb-3">
                      <div className="row">
                       {
                         productImages && productImages.map((productImage,index) => {
                          return (
                            <div className="col-md-3 mb-3" key={index}>
                              <div className="card shadow">
                                <img src={productImage.image_url} alt={`Product-${index}`} className="" />
                               
                              </div>
                              <div className="card footer mt-2">
                                  <button 
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => DeleteImage(productImage.image_url)}>
                                      Delete
                                    </button>
                              </div>
                            </div>
                          )
                       })
                      }
                      </div>
                    </div>
                </div>
            </div>
           <button className="btn btn-primary mt-3" onClick={() => saveProduct()}>Create</button>
         </form>
            
            </div>
        </div>
        </div>
        </Layout>
  )
}

export default Edit