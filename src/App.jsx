import { useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'
import {default as ShowCategories} from './components/admin/categories/Show'
import Sample from './components/Sample'
import {default as CreateCategory} from './components/admin/categories/Create'
import {default as EditCategory} from './components/admin/categories/Edit'

import {default as ShowBrands} from './components/admin/brand/Show'
import {default as CreateBrands} from './components/admin/brand/Create'
import {default as EditBrands} from './components/admin/brand/Edit'

import {default as ShowProducts} from './components/admin/product/Show'
import {default as CreateProducts} from './components/admin/product/Create'
import {default as EditProducts} from './components/admin/product/Edit'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/shop' element={<Shop/>}/>
      <Route path='/product' element={<Product/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/checkout' element={<Checkout/>}/>
      <Route path='/admin/login' element={<Login/>}/>
       <Route path='/admin/dashboard' element={
        <AdminRequireAuth>
            <Dashboard/>
        </AdminRequireAuth>}/>
      <Route path='/admin/categories' element={
        <AdminRequireAuth>
            <ShowCategories/>
        </AdminRequireAuth>}/>
      <Route path='/admin/categories/create' element={
        <AdminRequireAuth>
            <CreateCategory/>
        </AdminRequireAuth>}/>
      <Route path='/admin/categories/edit/:id' element={
        <AdminRequireAuth>
            <EditCategory/>
        </AdminRequireAuth>}/>
      <Route path='/admin/brand' element={
        <AdminRequireAuth>
            <ShowBrands/>
        </AdminRequireAuth>}/>
      <Route path='/admin/brand/create' element={
        <AdminRequireAuth>
            <CreateBrands/>
        </AdminRequireAuth>}/>
      <Route path='/admin/brand/edit/:id' element={
        <AdminRequireAuth>
            <EditBrands/>
        </AdminRequireAuth>}/>

        <Route path='/admin/product' element={
        <AdminRequireAuth>
            <ShowProducts/>
        </AdminRequireAuth>}/>
      <Route path='/admin/product/create' element={
        <AdminRequireAuth>
            <CreateProducts/>
        </AdminRequireAuth>}/>
      <Route path='/admin/product/edit/:id' element={
        <AdminRequireAuth>
            <EditProducts/>
        </AdminRequireAuth>}/>
    </Routes>
    </BrowserRouter>
    <ToastContainer/>
    </>
  )
}

export default App
