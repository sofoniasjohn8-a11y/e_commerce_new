import React, { useState } from 'react'
import { apiUrl, userToken } from './common/http';
import { toast } from 'react-toastify';
import Layout from './common/Layout';
import UserSidebar from './UserSidebar';
import { useForm } from 'react-hook-form';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const {
             register,
             handleSubmit,
             setValue,
             formState: { errors },
         } = useForm();
         

           const savePassword = async (data) => {
                  setLoading(true);
                  try {
                      const res = await fetch(`${apiUrl}/account/change-password`, {
                          'method': 'PUT',
                          'headers': {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                              'Authorization': `Bearer ${userToken()}`
                          },
                          body: JSON.stringify(data)
                      });
                      const result = await res.json();
                      if (result.status === 200) {
                          setLoading(false);
                          toast.success(result.message);
                      } else {
                          setLoading(false);
                          toast.error(result.message || "something went wrong!");
                      }
                  } catch (error) {
                      setLoading(false);
                      console.error("Error:", error);
                      toast.error("An error occurred");
                  }
              }
  return (
     <Layout>
        <div className="container py-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0 ms-4'>Change Password</h4>
          </div>
          <div className="col-md-3">
          <UserSidebar/>
          </div>
           <div className="col-md-9">
        <form onSubmit={handleSubmit(savePassword)}>
            <div className="card shadow">
                <div className="card-body p-4">
                    <div className="mb-3">
                        <label htmlFor="" className=''>Current Password</label>
                    <input
                        type="text"
                        {...register('current_password', {
                            required: 'The current password is required'
                        })}
                        className={`form-control ${errors.current_password && 'is-invalid'}`}
                        placeholder="Current Password"
                        />

                        {errors.current_password && (
                        <p className="invalid-feedback">{errors.current_password.message}</p>
                        )}
                    </div>
                     <div className="mb-3">
                        <label htmlFor="" className=''>New Password</label>
                        <input
                            type="text"
                            {...register('new_password', {
                                required: 'The new password is required'
                            })}
                            className={`form-control ${errors.new_password && 'is-invalid'}`}
                            placeholder="New Password"
                        />
                        {errors.new_password && (
                            <p className="invalid-feedback">{errors.new_password.message}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className=''>Confirm Password</label>
                        <input
                            type="text"
                            {...register('new_password_confirmation', {
                                required: 'The confirm password is required'
                            })}
                            className={`form-control ${errors.new_password_confirmation && 'is-invalid'}`}
                            placeholder="Confirm Password"
                        />
                        {errors.new_password_confirmation && (
                            <p className="invalid-feedback">{errors.new_password_confirmation.message}</p>
                        )}
                    </div>
                </div>
            </div>
           <button className="btn btn-primary mt-3">Change Password</button>
         </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ChangePassword