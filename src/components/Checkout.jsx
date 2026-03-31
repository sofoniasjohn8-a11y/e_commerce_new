import React from 'react'
import Layout from './common/Layout'
import CheckOutForm from './CheckOutForm'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLIC_KEY } from './common/http';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);


const Checkout = () => {
  return (
    <Layout>
       <Elements stripe={stripePromise}>   
            <CheckOutForm/>
       </Elements>
    </Layout>
  )
}

export default Checkout