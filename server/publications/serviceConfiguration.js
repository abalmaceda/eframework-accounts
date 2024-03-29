/**
 * Publish ServiceConfiguration
 */
 /*TODO*/
Meteor.publish("ServiceConfiguration", function (userId) {
  check(userId, Match.OneOf(String, null));

  // Admins and account managers can manage the login methods for the shop
  if (EFrameworkCore.hasPermission(["dashboard/accounts"], this.userId)) {
    return ServiceConfiguration.configurations.find({}, {
      fields: {
        secret: 1
      }
    });
  }

  return ServiceConfiguration.configurations.find({});
});
