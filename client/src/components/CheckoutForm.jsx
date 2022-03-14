import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();

    const [ message, setMessage ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const appearance = {
        theme: 'stripe'
    };

    useEffect(() => {
        if(!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if(!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("You payment was unsuccessful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.")
                    break;
            }
        });

    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });
        
        if(!error) {
            history.push("/payment-accepted");
        } else {
            if(error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occured.");
            }
            setIsLoading(false);
        }
    }


    return (
        <form id="payment-form" onSubmit={handleSubmit} className="col-6 mx-auto my-5 border border-dark shadow rounded-3 p-3">
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="btn btn-primary col-4 offset-4 mt-4">Pay Now</button>
        </form>
    )
}

export default CheckoutForm;