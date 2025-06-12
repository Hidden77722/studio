
require('dotenv').config();
const express = require('express');
const cors =require('cors');
const Stripe = require('stripe'); // Corrected to uppercase Stripe

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MemeTrade Pro Backend Server is running!');
});

// Cria sessão de checkout para ASSINATURAS
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body; // priceId do plano do Stripe

  if (!priceId) {
    return res.status(400).send({ error: 'Price ID é obrigatório.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Você pode adicionar outros métodos aqui
      mode: 'subscription', // MODO ASSINATURA
      line_items: [
        {
          price: priceId, // ID do Preço do Stripe
          quantity: 1,
        },
      ],
      // As URLs devem apontar para o seu frontend
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}&new_sub=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Erro ao criar sessão de checkout do Stripe:', err.message);
    res.status(500).json({ error: 'Erro ao criar checkout', details: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

