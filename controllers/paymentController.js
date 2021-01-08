const Payment = require('../models/payment');
const constants = require('../util/constants');
const stripe = require('stripe')(constants.STRIPE_SECRET);


/**
 * Create a payment request.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
  const data = req.body;

  await stripe.paymentIntents.create({
    amount: constants.APP_AMOUNT,
    currency: data.currency || 'usd',
    payment_method_types: ['card'],
  })
    .then(async (paymentIntent) => {
      const payment = new Payment({
        payment_id: paymentIntent.id,
        amount: paymentIntent.amount * 0.01,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      });

      await payment.save((err, saved) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Unable to create payment.", error: err });
        } else {
          return res.status(201).json({ message: "Payment created successfully.", payment: saved });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Unable to create payment.", error: err });
    });
}

/**
 * Confirm a payment request.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.confirm = async (req, res) => {
  const paymentId = req.params.payment;
  const data = req.body;

  await Payment.findOne({ payment_id: paymentId }, async (err, payment) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to retrieve payment.", error: err });
    } else {
      await stripe.paymentIntents.confirm(payment.payment_id, { payment_method: data.method })
        .then(async (confirmation) => {
          payment.status = confirmation.status;
          
          await payment.save((err, saved) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Unable to confirm payment.", error: err });
            } else {
              return res.json({ message: "Payment confirmed successfully.", payment: saved });
            }
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ message: "Unable to confirm payment.", error: err });
        });
    }
  });
}

/**
 * Create new payment card with given data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.addCard = async (req, res) => {
  const data = req.body;

  await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: data.number,
      exp_month: data.exp.split('/')[0],
      exp_year: data.exp.split('/')[1],
      cvc: data.cvc,
    },
  })
    .then((method) => {
      console.log(method);
      return res.status(201).json(method);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Unable to add payment card.", error: err });
    });
}