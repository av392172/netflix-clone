import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from "../features/userSlice";
import db from '../firebase';
import './PlansScreen.css';

function PlansScreen() {
    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);

    useEffect(() => {
        db.collection("products")
            .where("active", "==", true)
            .get()
            .then(querySnapshot => {
                const products = {};
                querySnapshot.forEach(async (productDoc) => {
                    products[productDoc.id] = productDoc.data();
                    const priceSnap = await productDoc.ref.collection("prices").get();
                    priceSnap.docs.forEach(price => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            priceData: price.data(),
                        };
                    });
                });
                setProducts(products);
            });
    }, []);

    console.log(products);

    const loadCheckout = async (priceId) => {
        const docRef = await db
            .collection("customers")
            .doc(user.uid)
            .collection("checkout_sessions")        //new collection
            .add({
                price: priceId,
                successUrl: window.location.origin,
                cancelUrl: window.location.origin,
            });

        docRef.onSnapshot(async (snap) => {
            const { error, sessionId } = snap.data();

            if (error) {
                //show an error to your customer and inspect your cloud function
                //logs in firebase console.
                alert(`An error occured: ${error.message}`);
            }

            if (sessionId) {
                //we have a session, let's redirect to Checkout
                //init stripe

                const stripe = await loadStripe('pk_test_51ITGEjIOtMjTfc2sanEnQ9PRTQzo6lQx0yhqSFSb7ms5uuRLndv0SpFof5b6Pu8ek2YkfPFtXhfgy4oCR4m12Ur900TUsQWU5K');     //stripe publishable key
                stripe.redirectToCheckout({ sessionId });
            }
        })
    };
    return (
        <div className="plansScreen">
            {Object.entries(products).map(([productId, productData]) => {
                // add some logic to check if the user's subscription is active...
                return (
                    <div className="plansScreen__plan">
                        <div className="plansScreen__info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>

                        <button onClick={() => loadCheckout(productData.prices.priceId)}>Subscribe</button>

                    </div>
                );
            })}
        </div>
    )
}

export default PlansScreen;
