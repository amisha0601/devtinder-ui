import React from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "../utils/notification";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(true);

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
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return isUserPremium ? (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body text-center">
          <h1 className="text-3xl text-white mb-4">🎉 Premium User</h1>
          <p className="text-gray-400 mb-4">You're already enjoying premium benefits!</p>
          <ul className="text-left text-gray-300 space-y-2">
            <li>✅ Unlimited chat messages</li>
            <li>✅ Unlimited connection requests</li>
            <li>✅ Verified badge</li>
            <li>✅ Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="m-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Upgrade to Premium ✨</h1>
        <p className="text-gray-400">Unlock unlimited possibilities and connect with more developers</p>
      </div>
      
      <div className="flex w-full gap-8 max-w-6xl mx-auto">
        <div className="card bg-base-300 rounded-box flex-1 h-auto">
          <div className="card-body">
            <h1 className="font-bold text-2xl text-white">🥈 Silver Membership</h1>
            <p className="text-3xl font-bold text-secondary my-4">₹99</p>
            <ul className="space-y-2 text-gray-300 grow">
              <li>✓ Chat with other developers</li>
              <li>✓ 100 connection requests/day</li>
              <li>✓ Blue verification tick</li>
              <li>✓ 3 months validity</li>
            </ul>
            <button
              onClick={() => handleBuyClick("silver")}
              className="btn btn-secondary w-full mt-4"
            >
              Buy Silver
            </button>
          </div>
        </div>
        
        <div className="divider divider-horizontal">OR</div>
        
        <div className="card bg-base-300 rounded-box flex-1 h-auto border-2 border-primary">
          <div className="card-body">
            <div className="badge badge-primary mb-2 w-fit">Most Popular</div>
            <h1 className="font-bold text-2xl text-white">🥇 Gold Membership</h1>
            <p className="text-3xl font-bold text-primary my-4">₹199</p>
            <ul className="space-y-2 text-gray-300 grow">
              <li>✓ Chat with other developers</li>
              <li>✓ Unlimited connection requests</li>
              <li>✓ Gold verification badge</li>
              <li>✓ 6 months validity</li>
            </ul>
            <button
              onClick={() => handleBuyClick("gold")}
              disabled={buyingType === "gold"}
              className="btn btn-primary w-full mt-4"
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
