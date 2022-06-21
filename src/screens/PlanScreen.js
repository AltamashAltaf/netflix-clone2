import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser} from "../features/userSlice";
import db from "../firebase";
import "./PlanScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlanScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect (() => {
    db.collection('customers')
    .doc(user.uid)
    .collection('subscriptions')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(async subscription => {
        setSubscription({
          role: subscription.data().role,
          current_period_end: subscription.data().current_period_end.seconds,
          current_period_start: subscription.data().current_period_start.seconds,
        });
      }); 
    });
  }, [user.uid]);

  useEffect(() => {
    db.collection("products")
    .where("active", "==", true)
    .get()
    .then((querySnapshot) => {
      const products = {};
      querySnapshot.forEach(async productDoc =>{
        products[productDoc.id] = productDoc.data();
        const priceSnap = await productDoc.ref.collection
        ("prices").get();
        priceSnap.docs.forEach(price => {
          products[productDoc.id].prices ={
            priceId: price.id,
            priceData: price.data()
          }
        })
      });
      setProducts(products);
    });
  }, []);

  console.log(products);
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    const docRef = await db.collection('customers')
    .doc(user.id)
    .collection("checkout_sessions")
    .add({
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    docRef.onSnapShot(async (snap) => {
      const {error, sessionId } = snap.data();

      if (error) {
        //show an error to your customer and 
        //inspect your Cloud Function in the Firebase console.
        alert(`An error occurred: ${error.message}`);
      }

      if (sessionId) {
        //we have a session, lets redirect to checkout
       // Init stripe

       const stripe = await loadStripe("sk_test_51LAXRGSJU6mFX38Fg6eUlWqMGw92woozjKFxSOuCCa3N00P8x7Gz1818l3ZrZl6Y6PNxkoEwMWibUef7IRY3U7uj00QIwvv2vr");
       stripe.redirectToCheckout({ sessionId })
      }
    });
  };

  return (
    <div className="planScreen">
      {subscription && (
      <p>
        Renewal date :("") 
        {new Date(
          subscription?.current_period_end * 1000 
          ).toLocaleDateString}
      </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        // TODO: add some logic to check is the user's subscription is active.
        const isCurrentPackage = productData
        ?.toLowerCase()
        .includes(subscription?.role);

        return(
          <div 
            key={productId}
            className={`${
              isCurrentPackage && "planScreen_plan--disabled"
            }"planScreen_plan"`}
          >
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button onClick = {() => 
              !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlanScreen;