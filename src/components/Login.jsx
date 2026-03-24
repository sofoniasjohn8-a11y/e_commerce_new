import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './common/http';
import Layout from './common/Layout';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { Auth } from './context/Auth';

const Login = () => {
    const {login} = useContext(Auth)

 const {
      register,
      handleSubmit,
      watch,
      setError,
      formState: { errors },
    } = useForm()
      const navigate = useNavigate();

   const onSubmit = async (data) => {
    try {
        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.status === 200) {
            toast.success(result.message);
            if(result.status == 200){
            const userInfo = {
                token:result.token,
                id:result.id,
                name:result.name,

            }
            localStorage.setItem('userInfo',JSON.stringify(userInfo))
            login(userInfo)
           
            navigate('/account');
        } }
        // Changed to check for 400 and handle the flat object structure
        else if (res.status === 400 || res.status === 422) {
            // Since your Network tab shows { password: [...] } directly:
            const formErrors = result.error || result; 

            Object.keys(formErrors).forEach((field) => {
                // This will map "password" from the API to your "password" input
                setError(field, {
                    type: "server",
                    message: formErrors[field][0] 
                });
            });
        } else {
            toast.error(result.message || "An unexpected error occurred");
        }
    } catch (error) {
        console.error("Connection error:", error);
        toast.error("Could not connect to the server");
    }
};
  return (
    <Layout>
        <div className="container d-flex justify-content-center py-4">
          <div className="card shadow border-0 register">
           <form method='post' onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4">
                <h2 className='border-bottom mb-3 d-flex justify-content-center '>Login</h2>
                
                <div className="mb-3">
                    <label htmlFor="" className="form-label" >Email</label>
                    <input type="text" 
                    {
                        ...register('email',{
                            required: "The email field is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            } 
                        })
                    }
                    className={`form-control ${errors.email && 'is-invalid'}`} placeholder="Email"/>
                    {
                        errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="form-label">Password</label>
                    <input type="text" 
                      {
                              ... register('password',{
                                required:'The Password is required'
                              })
                          }

                    className={`form-control ${errors.password && 'is-invalid'}`} placeholder="Password"/>
                    {
                        errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                    }
                    
                </div>
                
                    <button className="btn btn-secondary w-100">Login</button>
                    <div className="d-flex justify-content-center pt-4 pb-2">
                      Not a member yet? &nbsp;<Link to="/account/register" >Register</Link>
                    </div>
            </div>
        </form>
        </div>
      </div>
    </Layout>
  )
}

export default Login