
require('dotenv').config();
const express = require('express');
const cors =require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:9002' // Adjust if your Next.js dev port is different
}));
app.use(express.json());
// app.use(express.static('public')); // Uncomment if you have a public folder for static assets

app.get('/', (req, res) => {
  res.send('MemeTrade Pro Backend Server is running!');
});

// Example: Create a Payment Intent (basic setup)
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, paymentMethodType } = req.body; // paymentMethodType could be 'card'

  if (!amount || !currency) {
    return res.status(400).send({ error: 'Amount and currency are required.' });
  }

  try {
    const params = {
      amount: amount, // Amount in cents
      currency: currency,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    };
    // If a specific payment method type is provided (e.g., 'card'), you can add it.
    // Otherwise, automatic_payment_methods will handle it.
    if (paymentMethodType) {
        // params.payment_method_types = [paymentMethodType]; // This is not needed if automatic_payment_methods is enabled
    }

    const paymentIntent = await stripe.paymentIntents.create(params);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).send({ error: error.message });
  }
});


// TODO: Add more Stripe routes like /webhook for handling events after payment

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
