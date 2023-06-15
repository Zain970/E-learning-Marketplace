import React, { useState } from 'react'
import StripeCheckout from "react-stripe-checkout";

import "./StripePayment.css"

function StripePayment() {

    const [product, setProduct] = useState({
        name: "Course payment",
        price: 3,
        productBy: "React J Course"
    })

    const makePayment = () => {

    }
    return (
        <section className='stripe-payment-section'>
            <section className="payment-template">
                <h1>Secure Payments through stripe</h1>

                {/* Stripe component */}
                <StripeCheckout
                    className="stripebutton"
                    token={makePayment}
                    name="Course Payment"
                    amount={product.price * 100}
                >
                    <button >
                        Proceed to the payments
                    </button>

                </StripeCheckout>

            </section>
        </section>
    )

}

export default StripePayment

