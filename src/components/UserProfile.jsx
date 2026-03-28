import React, { useState } from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from './common/Sidebar'
import UserSidebar from './UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from './common/http'
import { toast } from 'react-toastify'
import Loader from './common/Loader'

const Profile = () => {
   const [loading,setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    control, 
    formState :{errors}
  } = useForm({
    
             defaultValues: async () => {
               setLoading(true);
              const res = await fetch(`${apiUrl}/get-profile-detail`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${userToken()}`
              }
          });
          setLoading(false);
          const result = await res.json();
  
          if (result.data) {
              return {
                
                  name: result.data.name,
                  email: result.data.email,
                  address: result.data.address,
                  state: result.data.state,
                  city: result.data.city,
                  zip: result.data.zip,
                  mobile: result.data.mobile,
              };
               
          }
          return {}; 
      }
  });
     const updateProfile = async (data) => {
          setLoading(true);
          try {
              const res = await fetch(`${apiUrl}/update-profile`, {
                  'method': 'PUT',
                  'headers': {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${userToken()}`
                  },
                  body:JSON.stringify(data)
              });
              const result = await res.json();
              if (result.status === 200) {
                  console.log(`from update ${result}`);
                  setLoading(false);
              toast.success(result.message);
              } else {
                  setLoading(false);
                  console.log("something went wrong!");
                  const formErrors = result.errors;
                  Object.keys(formErrors).forEach((field)=>{
                    setError(field,{message : formErrors[field][0]});
                  })
              }
          } catch (e) {
              setLoading(false);
              console.error("Error updating your credentials:", e.message);
          }
        }
    
  return (
    <Layout>
        <div className="container py-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0 ms-4'>My Account</h4>
          </div>
          <div className="col-md-3">
          <UserSidebar/>
          </div>
          <div className="col-md-9  ">
          <div className="card shadow">
            <div className="card-body p-4">
              {
                loading == true && <Loader/>
              }
              {
                loading == false && <form onSubmit={handleSubmit(updateProfile)}>
                <div className="row">
                  <div className="col-md-6">
                     <label className="form-label">Name</label>
                     <input 
                          type="text" 
                          placeholder="Name"
                          {...register('name', {
                              required: 'the name is required'
                          })}
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                        />
                        {errors.name && (
                            <p className='invalid-feedback'>{errors.name.message}</p>
                        )}
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">Email</label>
                    <input 
                          type="text" 
                          placeholder="Email"
                             {
                        ...register('email',{
                            required: "The email field is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            } 
                        })
                         }
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                        />
                        {errors.email && (
                            <p className='invalid-feedback'>{errors.email.message}</p>
                        )}
                  </div>
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <textarea
                  placeholder="Address"
                  colspan={3}
                        {
                          ...register('address', {
                              required: 'the address is required'
                          })
                        }
                          className={`form-control ${errors.address ? 'is-invalid' : ''}` }/>
                        {errors.address && (
                            <p className='invalid-feedback'>{errors.address.message}</p>
                        )}
                </div>
                 <div className="row">
                  <div className="col-md-6">
                     <label className="form-label">Phone</label>
                      <input 
                          type="text" 
                          placeholder="Phone"
                          {...register('mobile', {
                              required: 'the phone is required'
                          })}
                          className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} 
                        />
                        {errors.mobile && (
                            <p className='invalid-feedback'>{errors.mobile.message}</p>
                        )}
                     
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input 
                          type="text" 
                          placeholder="Phone"
                          {...register('city', {
                              required: 'the city is required'
                          })}
                          className={`form-control ${errors.city ? 'is-invalid' : ''}`} 
                        />
                        {errors.city && (
                            <p className='invalid-feedback'>{errors.city.message}</p>
                        )}
                  </div>

                </div>
                 <div className="row">
                  <div className="col-md-6">
                     <label className="form-label">Zip</label>
                    <input 
                          type="text" 
                          placeholder="Zip"
                          {...register('zip', {
                              required: 'the zip is required'
                          })}
                          className={`form-control ${errors.zip ? 'is-invalid' : ''}`} 
                        />
                        {errors.zip && (
                            <p className='invalid-feedback'>{errors.zip.message}</p>
                        )}
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">State</label>
                      <input 
                          type="text" 
                          placeholder="State"
                          {...register('state', {
                              required: 'the state is required'
                          })}
                          className={`form-control ${errors.state ? 'is-invalid' : ''}`} 
                        />
                        {errors.state && (
                            <p className='invalid-feedback'>{errors.state.message}</p>
                        )}
                  </div>
                </div>
                <button className="btn btn-primary mt-3">Update</button>
              </form>
              }
              
            </div>
          </div>
          
          
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile