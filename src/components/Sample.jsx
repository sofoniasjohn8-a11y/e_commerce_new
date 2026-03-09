import React from 'react'
import { Link } from 'react-router-dom'

const Sample = () => {
  return (
    <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4  mb-0'>Categories</h4>
            <Link to="/admin/show" className="btn btn-primary">Back</Link>
          </div>
          <div className="col-md-3">
          <Sidebar/>
          </div>
          <div className="col-md-9">
          <div className="card shadow">
            <div className="card-body p-4">

            </div>
          </div>
          
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Sample