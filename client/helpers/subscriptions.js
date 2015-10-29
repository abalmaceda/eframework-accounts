/*TODO : */

EFrameworkCore.Subscriptions.Account =
  Meteor.subscribe("Accounts", Meteor.userId());

EFrameworkCore.Subscriptions.Profile =
  Meteor.subscribe("UserProfile", Meteor.userId());
