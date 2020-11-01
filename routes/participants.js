const express = require('express');
const router = express.Router();
const Participant = require('../models/participant');
const Customer = require('../models/customer');
const Tour = require('../models/tour');

// All Tours Route
router.get('/', async (req, res) => {
  let query = Participant.find();
  /*
  if (req.query.tourType != null && req.query.tourType != '') {
    query = query.regex('tourType', new RegExp(req.query.tourType, 'i'))
  }
  */
  if (req.query.createBefore != null && req.query.createBefore != '') {
    query = query.lte('createDate', req.query.createBefore)
  }
  if (req.query.createAfter != null && req.query.createAfter != '') {
    query = query.gte('createDate', req.query.createAfter)
  }
  try {
    const participants = await query.exec();
    res.render('participants/index', {
      participants: participants,
      searchOptions: req.query
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// New Tour Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Participant());
});

// Create Tour Route
router.post('/', async (req, res) => {
  const participant = new Participant({
    cost: req.body.cost,
    permission: (req.body.permission == undefined ? false : true),
    customer: req.body.customer,
    tour: req.body.tour
  });
  try {
    const newParticipant = await participant.save();
    res.redirect(`participants/${newParticipant.id}`);
  } catch (err) {
    console.log(err);
    renderNewPage(res, participant, true);
  }
})

// Show Tour Route
router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id).populate(['customer', 'tour']).exec();
    res.render('participants/show', { participant: participant });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})

// Edit Tour Route
router.get('/:id/edit', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    renderEditPage(res, participant);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})

// Update Tour Route
router.put('/:id', async (req, res) => {
  let participant;
  try {
    participant = await Participant.findById(req.params.id)
    participant.cost = req.body.cost;
    participant.permission = (req.body.permission == undefined ? false : true);
    participant.customer = req.body.customer;
    participant.tour = req.body.tour;
    await participant.save();
    res.redirect(`/participants/${participant.id}`);
  } catch (err) {
    console.log(err);
    if (participant != null) {
      renderEditPage(res, participant, true);
    } else {
      redirect('/');
    }
  }
});

// Delete Tour Page
router.delete('/:id', async (req, res) => {
  let participant;
  try {
    participant = await Participant.findById(req.params.id);
    await participant.remove();
    res.redirect('/participants');
  } catch (err) {
    if (participant != null) {
      res.render('participants/show', {
        participant: participant,
        errorMessage: err
      });
    } else {
      res.redirect('/');
    }
  }
});

async function renderNewPage(res, participant, hasError = false) {
  renderFormPage(res, participant, 'new', hasError);
}

async function renderEditPage(res, participant, hasError = false) {
  renderFormPage(res, participant, 'edit', hasError);
}

async function renderFormPage(res, participant, form, hasError = false) {
  try {
    const customers = await Customer.find({});
    const tours = await Tour.find({});
    const params = {
      customers: customers,
      tours: tours,
      participant: participant
    };
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Participant';
      } else {
        params.errorMessage = 'Error Creating Participant';
      }
    }
    res.render(`participants/${form}`, params);
  } catch (err) {
    console.log(err);
    res.redirect('/participants');
  }
}

module.exports = router;