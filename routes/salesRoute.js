var models = require('../models');
var express = require('express');
var router = express.Router();

router.post('/addItemToCart', function(req, res) {
  var salesController = require('../controllers/Sales.js')(req.session);
  salesController.addItemToCart(req.body).then(function(resp) {
    console.log('Successfully added Item to cart', resp);
    res.send(resp);
    res.end();

  }).catch(function(reason) {
    console.log(reason);
    res.send(new Error(reason));
    res.end();
  });
  //res.end();
});

// router.put('/update', function(req, res) {

//   itemsController.updateItem(req.body.item).then(function(resp) {
//     console.log('Successfully updated Item', resp);
//     res.send(resp);
//     res.end();
//   }).catch(function(reason) {
//     //res.sendStatus(300);
//     res.send(new Error(reason));
//     res.end();
//   });

// });

// router.delete('/delete', function(req, res) {

//   itemsController.deleteItem(req.body.item).then(function(resp) {
//     console.log('Successfully updated Item', resp);
//     res.send(resp);
//     res.end();
//   }).catch(function(reason) {
//     //res.sendStatus(300);
//     res.send(new Error(reason));
//     res.end();
//   });

// });

module.exports = router;