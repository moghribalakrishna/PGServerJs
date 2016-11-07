var models  = require('../models');
var express = require('express');
var router  = express.Router();

var aItem = {
      "item_id": "",
      "name": "appale ",
      "item_number": "7869",
      "cost_price": "56",
      "unit_price": "56",
      "1_quantity": "56",
      "receiving_quantity": "56",
      "reorder_level": "0",
      "loyaltyPerc":"0",
      "tax_names": {
        "tax_name_1":"",
        "tax_name_2":""
      },
      "tax_percents": {
        "tax_percent_1":"",
        "tax_percent_2":""
      },
      "description": "",
      "discount":"",
      "category": "csajhas",
      "supplier_id": null,
      "item_image": "",
      "is_serialized": "0",
      "is_deleted": "0",
      "itemNprice": "6",
      "expiry": "",
      "allow_alt_description": "0",
      "ItemType": "Prepared",
      "custom1": 0,
      "custom2": 0,
      "custom3": 0,
      "custom4": 0,
      "custom5": 0,
      "custom6": 0,
      "custom7": 0,
      "custom8": 0,
      "custom9": 0,
      "custom10": 0
    };

router.post('/create', function(req, res) {
  var newItem=req.body.item;
  console.log(newItem);
  models.profitGuru_items.create(aItem).then(function(resp) {
    console.log('Successfully added Item');
    res.send(resp);
  }).catch(function(err){
    console.log(err);
    res.send(err);
  });
  res.end();
});

// router.get('/:user_id/destroy', function(req, res) {
//   models.User.destroy({
//     where: {
//       id: req.params.user_id
//     }
//   }).then(function() {
//     res.redirect('/');
//   });
// });

// router.post('/:user_id/tasks/create', function (req, res) {
//   models.Task.create({
//     title: req.body.title,
//     UserId: req.params.user_id
//   }).then(function() {
//     res.redirect('/');
//   });
// });

// router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
//   models.Task.destroy({
//     where: {
//       id: req.params.task_id
//     }
//   }).then(function() {
//     res.redirect('/');
//   });
// });


module.exports = router;
