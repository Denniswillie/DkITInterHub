"use strict";
//jshint esversion:6
const LocalStrategy = require("./strategies/LocalStrategy");
const GoogleStrategy = require("./strategies/GoogleStrategy");
const OutlookStrategy = require("./strategies/OutlookStrategy");
const FacebookStrategy = require("./strategies/FacebookStrategy");

class StrategiesManager {
  constructor(strategies) {
    this._strategies = strategies;
  }

  static STRATEGY = {
    LOCAL: LocalStrategy,
    GOOGLE: GoogleStrategy,
    OUTLOOK: OutlookStrategy,
    FACEBOOK: FacebookStrategy
  }

  useStrategies() {
    for (var Strategy of this._strategies) {
      new Strategy();
    }
  }
}

module.exports = StrategiesManager;
