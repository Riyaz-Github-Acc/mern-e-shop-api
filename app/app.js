import dotenv from "dotenv";
import Stripe from "stripe";
import express from "express";

import dbConnect from "../config/dbConnect.js";
import {
  globalErrorHandler,
  notFound,
} from "../middlewares/globalErrorHandler.js";
import Order from "../model/orderModel.js";

import authRoute from "../routes/authRoute.js";
import usersRoute from "../routes/usersRoute.js";
import salesRoute from "../routes/salesRoute.js";
import brandsRoute from "../routes/brandsRoute.js";
import colorsRoute from "../routes/colorsRoute.js";
import ordersRoute from "../routes/ordersRoute.js";
import couponsRoute from "../routes/couponsRoute.js";
import reviewsRoute from "../routes/reviewsRoute.js";
import productsRoute from "../routes/productsRoute.js";
import categoriesRoute from "../routes/categoriesRoute.js";

// To use environment variables
dotenv.config();

// To use express
const app = express();

// DB connection
dbConnect();

// Stripe webhook
// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      // Update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      // Find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          paymentStatus,
          paymentMethod,
          currency,
        },
        { new: true }
      );

      console.log(order);
    } else {
      return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// To accept the request
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/sales", salesRoute);
app.use("/api/v1/brands", brandsRoute);
app.use("/api/v1/colors", colorsRoute);
app.use("/api/v1/orders", ordersRoute);
app.use("/api/v1/coupons", couponsRoute);
app.use("/api/v1/reviews", reviewsRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/categories", categoriesRoute);

// Global error handler
app.use(notFound);
app.use(globalErrorHandler);

export default app;
