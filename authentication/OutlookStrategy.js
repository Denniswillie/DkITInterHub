//jshint esversion:6
require('dotenv').config();
const OutlookStrategy = require('passport-outlook').Strategy;

function useStrategy(passport, userModel) {
  passport.use(new OutlookStrategy({
      clientID: process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/outlook/dashboard'
    },
    function(accessToken, refreshToken, profile, done) {
      var user = {
        outlookId: profile.id,
        name: profile.DisplayName,
        email: profile.EmailAddress,
        accessToken: accessToken
      };
      if (refreshToken)
        user.refreshToken = refreshToken;
      if (profile.MailboxGuid)
        user.mailboxGuid = profile.MailboxGuid;
      if (profile.Alias)
        user.alias = profile.Alias;
      userModel.findOrCreate({
          outlookId: profile.id,
          name: profile.displayName
        },

        function(err, user) {
          return done(err, user);
        });
    }
  ));
}

module.exports.useStrategy = useStrategy;
