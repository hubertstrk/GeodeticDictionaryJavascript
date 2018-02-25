var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('about', { title: 'About',  brand: 'Geodetic Dictionary', breadcrumbs: 'About' });
});

module.exports = router;