//jshint esversion:6
const googleStrategy = require("./GoogleStrategy");
const outlookStrategy = require("./OutlookStrategy");
const facebookStrategy = require("./FacebookStrategy");

class StrategiesManager {
  static STRATEGY = {
    GOOGLE: googleStrategy,
    OUTLOOK: outlookStrategy,
    FACEBOOK: facebookStrategy
  }
  constructor(strategies, passport, userModel) {
    strategies.forEach(function(strategy) {
      strategy.useStrategy(passport, userModel);
    });
  }
}

module.exports.StrategiesManager = StrategiesManager;
