//jshint esversion:6
const googleStrategy = require("./GoogleStrategy");
const outlookStrategy = require("./OutlookStrategy");
const facebookStrategy = require("./FacebookStrategy");

function StrategiesManager(strategies, passport, userModel) {
  this._strategies = strategies;
  this._passport = passport;
  this._userModel = userModel;
}

StrategiesManager.prototype.STRATEGY = {
  GOOGLE: googleStrategy,
  OUTLOOK: outlookStrategy,
  FACEBOOK: facebookStrategy
}

StrategiesManager.prototype.useStrategies = function() {
  for (strategy of this._strategies) {
    strategy.useStrategy(this._passport, this._userModel);
  }
}

module.exports = StrategiesManager;
