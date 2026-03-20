import React, { useEffect, useState , useRef, useMemo} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../common/Layout';
import Sidebar from '../../common/Sidebar';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrl } from '../../common/http';
import { toast } from 'react-toastify';
import { Controller } from 'react-hook-form';
import JoditEditor from 'jodit-react';



const Create = ({ placeholder }) => {
  
  const [loading,setLoading] = useState(false);
  const [disabled,setDisabled] = useState(false);
  const [categories,setCategories] = useState([]);
  const [brands,setBrands] = useState([]);
  const [gallery,setGallery] = useState([]);
  const [galleryImages,setGalleryImages] = useState([]);
  const [temp_images,setTemp_images] = useState([]);
  const [sizes,setSizes] = useState([]);
  // const [image_id,setImageId] = useState(null);
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
      control,
      formState: { errors },
    } = useForm();

    const saveProduct = async (data) => {
    const formData = { ...data, "gallery": gallery };
    setLoading(true);

    try {
        const response = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json(); // Correctly parsing the response

        if (result.status === 200) {
            toast.success(result.message);
            navigate('/admin/product');
        } else {
            console.error("Server Error:", result);
            toast.error(result.message);
        }
    } catch (error) {
        console.error("Network Error:", error);
        toast.error("Network error. Please check your connection.");
    } finally {
        setLoading(false);
    }
};
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
       const FetchSizes = async () => {

            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/sizes`, {
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
                    console.log(result.data);
                     setSizes(result.data);
                } else {
                    setLoading(false);
                    console.log("something went wrong!");
                }
            } catch (error) {
                setLoading(false);
                console.error("Error fetching sizes:", error);
                toast.error("Failed to load sizes");
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
            // Add the ID to the hidden gallery input array
            setGallery(prev => [...prev, result.image_id]); 
            
            // Add an object to the preview state
            setGalleryImages(prev => [...prev, { 
                id: result.image_id, 
                url: result.image_url 
            }]);

            e.target.value = "";
        }
    } catch (error) {
        setDisabled(false);
        toast.error("An error occurred during upload");
    }
}
    const DeleteImage = async (imgObject) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
        const res = await fetch(`${apiUrl}/temp-images/${imgObject.id}`, {
            method: 'DELETE', // Standard Laravel destroy method uses DELETE
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        });

        const result = await res.json();

        if (res.status === 200) {
            // 1. Remove from UI preview
            setGalleryImages(galleryImages.filter(img => img.id !== imgObject.id));
            
            // 2. Remove from the gallery IDs array that gets sent with the form
            setGallery(gallery.filter(id => id !== imgObject.id));
            
            toast.success(result.message);
        } else {
            toast.error(result.message || "Deletion failed");
        }
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred during deletion");
    }
}
      useEffect(() => {
        FetchCategories();
        FetchBrands();
        FetchSizes();
      }, []);

    
  return (
  <Layout>
        <div className="container ">
        <div className="row mb-5" >
            <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Product/Create</h4>
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
                            <input 
                              type="text"  
                              {...register('compare_price', { 
                                required: false,
                                setValueAs: v => v === "" ? null : v // Converts "" to null automatically
                              })} 
                              placeholder="Discounted Price"
                              className="form-control"
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
                          {
                            ...register('barcode',{
                                required:false
                            })
                          }
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

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">Sizes</label>
                      {
                        sizes && sizes.length > 0 && sizes.map((size,index) => {
                          return (
                              <div className="form-check-inline" key={`size-${index}`}>
                                <input 
                                {
                                    ...register('sizes', {
                                        required: 'At least one size must be selected'
                                    })
                                }
                                    className="form-check-input ms-2" type="checkbox" value={size.id} id={`size-${size.id}`} />
                                <label className="form-check-label ps-2" forhtml={`size-${size.id}`}>
                                  {size.name}
                                </label>
                                 {
                                errors.sizes && <p className='invalid-feedback'>{errors.sizes.message}</p>
                            }
                            </div>
                          )
                        })
                        
                    }
                    
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
                            galleryImages.map((imgObj, index) => (
                                <div className="col-md-3 mb-3" key={index}>
                                    <div className="card shadow">
                                        {/* Access the .url property */}
                                        <img src={imgObj.url} alt="Gallery" className="w-100" />

                                        <div className="card-footer mt-2 border-0">
                                        <button 
                                            type="button"
                                            className="btn btn-danger w-100"
                                            onClick={() => DeleteImage(imgObj)}>
                                            Delete
                                        </button>
                                    </div>
                                    </div>
                                    
                                </div>
                            ))
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

export default Create


