var express = require('express');
var router = express.Router();

const projectDetails = {
  service: `ENHANCED_DVLA_API`,
  appliacationName: 'DRIVE_THRU',
  developedBy: 'COSC450 ADVANCED SYSTEMS ANALYSIS AND DESIGN',
  contractors: [
    {
      name: 'Ampofo Kwabena Amo',
      ID: '215CS02003297',
      contact: '0559633956',
      role: 'Lead Developer',
      email: 'kwabenaampofo5@gmail.com'
    },
    {
      name: 'Sarfo George',
      ID: '',
      contact: '',
      role: 'Project Manager',
      email: ''
    }
  ],
  projectInitiationDate: 'November 1 2019',
  projectDeliveryDate: '',
  currentDate: new Date()
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200);
  res.json(projectDetails);

  console.log(projectDetails);
});

module.exports = router;
