'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    users = require('../../controllers/users.server.controller');

module.exports = function(config) {
  // Get config parameters for the strategy
  var clientID = _.get(config, 'facebook.clientID'),
      clientSecret = _.get(config, 'facebook.clientSecret'),
      callbackURL = _.get(config, 'facebook.callbackURL');

  // Don't configure the strategy if missing configuration
  if (!clientID || !clientSecret || !callbackURL) {
    return;
  }

  // Use facebook strategy
  passport.use(new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true,
    enableProof: false
  },
  function(req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    var providerUserProfile = {
      firstName: _.get(profile, 'name.givenName', undefined),
      lastName: _.get(profile, 'name.familyName', undefined),
      displayName: profile.displayName || undefined,
      email: _.get(profile, 'emails[0].value', undefined),
      provider: 'facebook',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
