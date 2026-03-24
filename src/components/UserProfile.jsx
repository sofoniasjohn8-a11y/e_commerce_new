import React from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from './common/Sidebar'
import UserSidebar from './UserSidebar'

const profile = () => {
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
                <div className="row">
                  <div className="col-md-6">
                     <label className="form-label">Name</label>
                     <input type="text" 
                     placeholder="Name"
                     className="form-control"
                     />
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">Email</label>
                     <input type="text" 
                     placeholder="Email"
                     className="form-control"
                     />
                  </div>
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <textarea
                  className="form-control"
                  placeholder="Address"
                  colspan={3}/>
                </div>
                 <div className="row">
                  <div className="col-md-6">
                     <label className="form-label">Phone</label>
                     <input type="text" 
                     placeholder="Phone"
                     className="form-control"
                     />
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">City</label>
                     <input type="text" 
                     placeholder="City"
                     className="form-control"
                     />
                  </div>

                </div>
                 <div className="row">
                  <div className="col-md-6">
                     <label className="form-label">Zip</label>
                     <input type="text" 
                     placeholder="Zip"
                     className="form-control"
                     />
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">State</label>
                     <input type="text" 
                     placeholder="State"
                     className="form-control"
                     />
                  </div>
                </div>
            </div>
          </div>
          <button className="btn btn-primary mt-3">Update</button>
          
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default profile