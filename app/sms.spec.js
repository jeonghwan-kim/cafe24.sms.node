'use strict';

var should = require('should');
var sms = require('./sms');

describe('cafe24.sms.node', function () {

  it('should send sms', function (done) {
    sms.send({
      msg: '카페24 SMS 테스트',
      mobile: '01011112222'
    }).then(function (result) {
      console.log(result);
      should(result).ok;
      done();
    }).done(null, done);
  });

});
