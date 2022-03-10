import React, { useState, useEffect } from 'react';
import AxiosService from '../services/AxiosService';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const PaymentView = ({ items }) => {
    const [clientSecret, setClientSecret] = useState("");
    const stripePromise = loadStripe("pk_test_51KbqcQHFjmgpUD3Xzba15pCS45bs5XJkfhjA6mtkDjPkrltuZ9A3zmSyfwRunD57engz5dvOUuhR7dGuiN1rTq3T00sqYc4YZO")

    useEffect(() => {
        AxiosService.getRestClient().post("/create-payment-intent", { items: items }, {withCredentials: true})
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.log(err))
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div>
            {clientSecret &&
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
            }
        </div>
    )
}

export default PaymentView;