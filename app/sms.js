'use strict';

var q = require('q');
var request = require('request');
var config = require('./config');

var encodeBase64 = function (str) {
  return new Buffer(str).toString('base64');
};

var phoneNumber = function (mobile) {
  var result;
  if ((/^\d{3}-\d{3,4}-\d{4}$/).test(mobile)) {
    result = mobile;
  } else if ((/^\d{10}$/).test(mobile)) {
    result = mobile.substr(0, 3) + '-' + mobile.substr(3, 3) + '-' + mobile.substr(6, 4)
  } else if ((/^\d{11}$/).test(mobile)) {
    result = mobile.substr(0, 3) + '-' + mobile.substr(3, 4) + '-' + mobile.substr(7, 4)
  } else {
    result = undefined;
  }
  return result;
};

var checkParams = function (params) {
  return params &&
         params.user_id &&
         params.secure &&
         params.msg &&
         params.rphone;
};


exports.send = function (options) {
  var deferred = q.defer();
  var parameters = {
    user_id: encodeBase64(config.sms.userId),
    secure: encodeBase64(config.sms.secure),
    msg: encodeBase64(options.msg),
    rphone: encodeBase64(phoneNumber(options.mobile)),
    sphone1: encodeBase64(config.sms.source.phone1),
    sphone2: encodeBase64(config.sms.source.phone2),
    sphone3: encodeBase64(config.sms.source.phone3),
    rdate: encodeBase64(''),
    rtime: encodeBase64(''),
    mode: encodeBase64('1'),
    testflag: encodeBase64(''),
    destination: encodeBase64(''),
    repeatFlag: encodeBase64(''),
    repeatNum: encodeBase64(''),
    repeatTime: encodeBase64(''),
    returnurl: encodeBase64(''),
    nointeractive: encodeBase64('')
  };
  if (!checkParams(parameters)) deferred.reject();

  var smsRequest = request.post(config.sms.url, function (err, res, body) {
    if (err) {
      deferred.reject(err);
    } else {
      if (body.substr(0, 7) === 'success')  deferred.resolve(body);
      else deferred.reject(body);
    }
  });

  var reqForm = smsRequest.form();
  for (var param in parameters) {
    reqForm.append(param, parameters[param]);
  }

  return deferred.promise;
};
