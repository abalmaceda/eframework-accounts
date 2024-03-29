/* TODO : all */

/**
 * accounts
 */

var Accounts = EFrameworkCore.Collections.Accounts;

/**
* @function Meteor.publish('Accounts')
* @summary Recupera los datos  de la o las direcciones.
* @param {String} userId - id del usuario
* @return {Accounts[]}
*/
Meteor.publish("Accounts", function(userId) {
	check(userId, Match.OneOf(String, null));
	// global admin puede obtener todas accounts
	if (Roles.userIsInRole(this.userId, ['owner'], Roles.GLOBAL_GROUP)) {
		return Accounts.find();
	}
	//shop admin obtiene accounts solo para esta shop
	else if (Roles.userIsInRole(this.userId, ['admin', 'owner'], EFrameworkCore.getShopId(this))) {
		return Accounts.find({ shopId: EFrameworkCore.getShopId(this) });
	}
	// Usuarios regulares deben obtener solos sus acounts
	else {
		return EFrameworkCore.Collections.Accounts.find({'userId': this.userId});
	}
});


/**
 * userProfile
 * get any user name,social profile image
 * should be limited, secure information
 * users with permissions  ['dashboard/orders', 'owner', 'admin', 'dashboard/customers']
 * may view the profileUserId's profile data.
 *
 * @params {String} profileUserId -  view this users profile when permitted
 * @todo all
 */


Meteor.publish("UserProfile", function(profileUserId) {
  check(profileUserId, Match.OneOf(String, null));

  var permissions = ['dashboard/orders', 'owner', 'admin', 'dashboard/customers'];

  if (profileUserId !== this.userId && (Roles.userIsInRole(this.userId, permissions, EFrameworkCore.getCurrentShop(this)._id || Roles.userIsInRole(this.userId, permissions, Roles.GLOBAL_GROUP)))) {
    return Meteor.users.find({
      _id: profileUserId
    }, {
      fields: {
        "emails": true,
        "profile.firstName": true,
        "profile.lastName": true,
        "profile.familyName": true,
        "profile.secondName": true,
        "profile.name": true,
        "services.twitter.profile_image_url_https": true,
        "services.facebook.id": true,
        "services.google.picture": true,
        "services.github.username": true,
        "services.instagram.profile_picture": true
      }
    });
  } else if (this.userId) {
    return Meteor.users.find({
      _id: this.userId
    });
  } else {
    return [];
  }
});
