import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const Edit = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const FetchCategory = async () => {
        try {
            const res = await fetch(`${apiUrl}/categories/${params.id}`, {
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await res.json();
            if (result.status === 200) {
                // Auto-fill form with fetched data
                setValue('name', result.data.name);
                setValue('status', String(result.data.status));
            } else {
                console.log("can't fetch category data");
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    }
    useEffect(() => {
        FetchCategory();
    }, [params.id]);
    const saveCategory = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/categories/${params.id}`, {
                'method': 'PUT',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.status === 200) {
                setLoading(false);
                toast.success(result.message);
                navigate('/admin/show');
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
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Category/Edit</h4>
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
                        <select {...register('status', {
                            required: 'The status is required'
                        })}
                            className={`form-control ${errors.status && 'is-invalid'}`}>
                            <option value="">Select a status</option>
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                        </select>
                        {errors.status && (
                            <p className='invalid-feedback'>{errors.status?.message}</p>
                        )}
                    </div>
                  
                </div>
            </div>
            <button className="btn btn-primary mt-3" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
            </button>
         </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit