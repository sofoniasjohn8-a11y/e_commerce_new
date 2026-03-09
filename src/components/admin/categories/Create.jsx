import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'


const Create = () => {
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
     const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
    const saveCategory = async (data) =>{
        console.log(data);
        setLoading(true);
        const res =  await fetch(`${apiUrl}/categories`,{
            'method':'POST',
            'headers':{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`Bearer ${adminToken()}`
            },
               body : JSON.stringify(data)
            }).then(res =>res.json(data))
            .then(result => {
            if(result.status == 200){
                setLoading(false);
                toast.success(result.message);
                navigate('/admin/show');
            }
            else
                console.log("something went wrong!");
            })
    }
  return (
  <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Category/Create</h4>
            <Link to="/admin/show" className="btn btn-primary">Back</Link>
          </div>
          <div className="col-md-3">
          <Sidebar/>
          </div>
          <div className="col-md-9">
        <form onSubmit={handleSubmit(saveCategory)}>
            <div className="card shadow">
                <div className="card-body p-4">
                    <div className="mb-3">
                        <label htmlFor="" className=''>Name</label>
                    <input
                        type="text"
                        {...register('name', {
                            required: 'The name is required'
                        })}
                        className={`form-control ${errors.name && 'is-invalid'}`}
                        placeholder="Name"
                        />

                        {errors.name && (
                        <p className="invalid-feedback">{errors.name.message}</p>
                        )}
                    </div>
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
                            {
                                errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
                            }
                        </select>
                    </div>
                  
                </div>
            </div>
           <button className="btn btn-primary mt-3">Create</button>
         </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Create