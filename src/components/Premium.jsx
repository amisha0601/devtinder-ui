import React from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "../utils/notification";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buyingType, setBuyingType] = useState(null);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      toast.error("Failed to verify premium status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async (type) => {
    setBuyingType(type);
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true },
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "devTinder",
        description: "Connect with other developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate payment");
      console.error(err);
    } finally {
      setBuyingType(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return isUserPremium ? (
    <div className="flex justify-center items-center min-h-[80vh] px-4 text-base-content">
      <div className="card bg-base-300 w-96 shadow-xl border border-base-content/5">
        <div className="card-body text-center">
          <h1 className="text-3xl font-extrabold mb-4">🎉 Premium User</h1>
          <p className="text-base-content/70 mb-4 font-medium">You're already enjoying premium benefits!</p>
          <ul className="text-left text-base-content/80 space-y-2.5 max-w-xs mx-auto">
            <li>✅ Unlimited chat messages</li>
            <li>✅ Unlimited connection requests</li>
            <li>✅ Verified badge</li>
            <li>✅ Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="m-10 text-base-content">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4">Upgrade to Premium ✨</h1>
        <p className="text-base-content/70 font-medium">Unlock unlimited possibilities and connect with more developers</p>
      </div>
      
      <div className="flex flex-col md:flex-row w-full gap-8 max-w-5xl mx-auto items-stretch">
        <div className="card bg-base-300 rounded-box flex-1 shadow-md border border-base-content/5">
          <div className="card-body">
            <h1 className="font-bold text-2xl">🥈 Silver Membership</h1>
            <p className="text-4xl font-extrabold text-secondary my-4">₹99</p>
            <ul className="space-y-2.5 text-base-content/80 grow">
              <li>✓ Chat with other developers</li>
              <li>✓ 100 connection requests/day</li>
              <li>✓ Blue verification tick</li>
              <li>✓ 3 months validity</li>
            </ul>
            <button
              onClick={() => handleBuyClick("silver")}
              disabled={buyingType === "silver"}
              className="btn btn-secondary text-secondary-content w-full mt-6 font-bold"
            >
              {buyingType === "silver" ? "Processing..." : "Buy Silver"}
            </button>
          </div>
        </div>
        
        <div className="divider md:divider-horizontal">OR</div>
        
        <div className="card bg-base-300 rounded-box flex-1 shadow-xl border-2 border-primary">
          <div className="card-body">
            <div className="badge badge-primary font-bold mb-2 w-fit">Most Popular</div>
            <h1 className="font-bold text-2xl">🥇 Gold Membership</h1>
            <p className="text-4xl font-extrabold text-primary my-4">₹199</p>
            <ul className="space-y-2.5 text-base-content/80 grow">
              <li>✓ Chat with other developers</li>
              <li>✓ Unlimited connection requests</li>
              <li>✓ Gold verification badge</li>
              <li>✓ 6 months validity</li>
            </ul>
            <button
              onClick={() => handleBuyClick("gold")}
              disabled={buyingType === "gold"}
              className="btn btn-primary text-primary-content w-full mt-6 font-bold"
            >
              {buyingType === "gold" ? "Processing..." : "Buy Gold"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;