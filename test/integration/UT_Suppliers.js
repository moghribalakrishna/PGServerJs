//RUN As below
//mocha -R spec ./UT_Suppliers.js

var request = require('supertest');
//var requestAsPromised = require("supertest-as-promised");
//var require = require('really-need');
var fs = require('fs');
var assert = require('assert');
//var jsonfile = require('jsonfile');
//var q = require('q');

var server;

describe('All Supplier functionalities:', function() {

  it('create Supplier', function creatingSupplier(done) {

    var aSupplier = {
      "supplier": {
        "person_id": "",
        "company_name": "cascas",
        "agency_name": "cascsa",
        "first_name": "casca",
        "last_name": "cascsa",
        "gender": "M",
        "email": "",
        "phone_number": "8884828597",
        "address_1": "",
        "address_2": "",
        "city": "",
        "state": "",
        "zip": "",
        "country": "",
        "comments": "",
        "account_number": ""
      }
    };

    request("http://localhost:3000")
      .post('/supplier/create')
      .send(aSupplier)
      .expect(200, done);
  });

});