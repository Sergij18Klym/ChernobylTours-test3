const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Participant = require('../models/participant');

// All Drivers Route
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const customers = await Customer.find(searchOptions);
    res.render('customers/index', {
      customers: customers,
      searchOptions: req.query
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// New Driver Route
router.get('/new', (req, res) => {
  res.render('customers/new', { customer: new Customer() })
});

// Create Driver Route
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    passport: req.body.passport,
    citizenship: req.body.citizenship
  });
  try {
    const newCustomer = await customer.save();
    res.redirect(`customers/${newCustomer.id}`);
  } catch (err) {
    console.log(err);
    res.render('customers/new', {
      customer: customer,
      errorMessage: err
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const participants = await Participant.find({ customer: customer.id }).exec();
    res.render('customers/show', {
      customer: customer,
      customersParticipations: participants
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render('customers/edit', { customer: customer });
  } catch (err) {
    console.log(err);
    res.redirect('/customers');
  }
});

router.put('/:id', async (req, res) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.email = req.body.email;
    customer.passport = req.body.passport;
    customer.citizenship = req.body.citizenship;
    await customer.save();
    res.redirect(`/customers/${customer.id}`);
  } catch (err) {
    console.log(err);
    if (customer == null) {
      res.redirect('/');
    } else {
      console.log(err);
      res.render('customers/edit', {
        customer: customer,
        errorMessage: err
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    await customer.remove();
    res.redirect('/customers');
  } catch (err) {
    console.log(err);
    if (customer == null) {
      res.redirect('/');
    } else {
      res.redirect(`/customers/${customer.id}`);
    }
  }
});

module.exports = router;