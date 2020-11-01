const express = require('express');
const router = express.Router();
const Driver = require('../models/driver');
const Tour = require('../models/tour');

// All Drivers Route
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const drivers = await Driver.find(searchOptions);
    res.render('drivers/index', {
      drivers: drivers,
      searchOptions: req.query
/*
      ,
      toursAssocCurrentDriver: tours
*/
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// New Driver Route
router.get('/new', (req, res) => {
  res.render('drivers/new', { driver: new Driver() })
});

// Create Driver Route
router.post('/', async (req, res) => {
  const driver = new Driver({
    name: req.body.name,
    phone: req.body.phone,
    rentPrice: req.body.rentPrice,
    bus: /*[*/{
      numberPlate: req.body.numberPlate,
      mark: req.body.mark,
      capacity: req.body.capacity
    }/*]*/
  });
  try {
    const newDriver = await driver.save();
    res.redirect(`drivers/${newDriver.id}`);
  } catch (err) {
    console.log(err);
    res.render('drivers/new', {
      driver: driver,
      errorMessage: err
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    const tours = await Tour.find({ driver: driver.id }).exec();
    res.render('drivers/show', {
      driver: driver,
      toursAssocCurrentDriver: tours
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    res.render('drivers/edit', { driver: driver });
  } catch (err) {
    console.log(err);
    res.redirect('/drivers');
  }
});

router.put('/:id', async (req, res) => {
  let driver;
  try {
    driver = await Driver.findById(req.params.id);
    driver.name = req.body.name;
    driver.phone = req.body.phone;
    driver.rentPrice = req.body.rentPrice;
    driver.bus.numberPlate = req.body.numberPlate;
    driver.bus.mark = req.body.mark;
    driver.bus.capacity = req.body.capacity;
    await driver.save();
    res.redirect(`/drivers/${driver.id}`);
  } catch (err) {
    console.log(err);
    if (driver == null) {
      res.redirect('/');
    } else {
      res.render('drivers/edit', {
        driver: driver,
        errorMessage: 'Error updating Driver'
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let driver;
  try {
    driver = await Driver.findById(req.params.id);
    await driver.remove();
    res.redirect('/drivers');
  } catch (err) {
    console.log(err);
    if (driver == null) {
      res.redirect('/');
    } else {
      res.redirect(`/drivers/${driver.id}`);
    }
  }
});

module.exports = router;