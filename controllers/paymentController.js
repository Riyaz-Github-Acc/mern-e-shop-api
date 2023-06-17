import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentSession = async (orderItems, order) => {
  // Convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.name,
          desc: item?.desc,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:8800/success",
    cancel_url: "http://localhost:8800/cancel",
  });

  return session.url;
};

export default paymentSession;
