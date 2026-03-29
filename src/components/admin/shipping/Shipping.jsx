import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { set, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { adminToken, apiUrl } from '../../common/http';
import { toast } from 'react-toastify';
import Sidebar from '../../common/Sidebar';

const Shipping = () => {
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
     const {
        register,
        handleSubmit,
        watch,
        setValue ,
        formState: { errors },
      } = useForm();
        const getShipping = async (data) =>{
        console.log(data);
        setLoading(true);
        const res =  await fetch(`${apiUrl}/get-shipping`,{
            'method':'GET',
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
                console.log(result);
                 setValue('amount',result.data.amount);
            }
            else
                console.log("something went wrong!");
            })
    }
    const saveShipping = async (data) =>{
        console.log(data);
        setLoading(true);
        const res =  await fetch(`${apiUrl}/update-shipping`,{
            'method':'PUT',
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
            }
            else
                console.log("something went wrong!");
            })
    }
    useEffect(()=>{     
        getShipping();
    },[]);
  return (
     <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Shipping/edit</h4>
            <Link to="/admin/dashboard" className="btn btn-primary">Back</Link>
          </div>
          <div className="col-md-3">
          <Sidebar/>
          </div>
          <div className="col-md-9">
        <form onSubmit={handleSubmit(saveShipping)}>
            <div className="card shadow">
                <div className="card-body p-4">
                    <div className="mb-3">
                        <label htmlFor="" className='from-label'>Shipping Charge</label>
                    <input
                        type="text"
                        {...register('amount', {
                            required: 'The amount is required'
                        })}
                        className={`form-control ${errors.amount && 'is-invalid'}`}
                        placeholder="Amount"
                        />

                        {errors.amount && (
                        <p className="invalid-feedback">{errors.amount.message}</p>
                        )}
                    </div>
                </div>
            </div>
           <button className="btn btn-primary mt-3">Update</button>
         </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Shipping