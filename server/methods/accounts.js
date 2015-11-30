/* TODO : verificar todo el codigo */


/**
 * Reaction Accounts handlers
 * creates a login type "anonymous"
 * default for all unauthenticated visitors
 */

Accounts.registerLoginHandler(function (options) {
  if (!options.anonymous) {
    return void 0;
  }
  let loginHandler;
  let stampedToken = Accounts._generateStampedLoginToken();
  let userId = Accounts.insertUserDoc({
    services: {
      anonymous: true
    },
    token: stampedToken.token
  });
  loginHandler = {
    type: "anonymous",
    userId: userId
  };
  return loginHandler;
});

/**
 * Accounts.onCreateUser
 * @summary Se agrega un role
 * adding either a guest or anonymous role to the user on create
 * adds Accounts record for reaction user profiles
 * we clone the user into accounts, as the user collection is
 * only to be used for authentication.
 * @event onCreateUser
 * @param {} options
 * @param {} user
 * @returns {Number} Sum of a and b
 * @this What_does_the_THIS_keyword_refer_to_here
 * @description add_two_numbers
 * @see {@link http://docs.meteor.com/#/full/accounts_oncreateuser|Meteor}
 * @todo Documentar
 */
Accounts.onCreateUser(function (options, user) {
	let shop = EFrameworkCore.getCurrentShop();
	let shopId = EFrameworkCore.getShopId();
	let roles = {};

	// clone before adding roles
	let account = _.clone(user);
	account.userId = user._id;

	EFrameworkCore.Collections.Accounts.insert(account);
	// init default user roles
	if (shop) {
		if (user.services === undefined) {
			roles[shopId] = shop.defaultVisitorRole || ["anonymous", "guest"];
		}
		else {
			roles[shopId] = shop.defaultRoles || ["guest", "account/profile"];
		}
	}
	// assign default user roles
	user.roles = roles;
	return user;
});

/**
 * Accounts.onLogin event
 * automatically push checkoutLogin when users login.
 * let"s remove "anonymous" role, if the login type isn't "anonymous"
 * @param
 * @returns
 * @todo Documentar y entender
 */
Accounts.onLogin(function (options) {
  // remove anonymous role
  // all users are guest, but anonymous user don"t have profile access
  // or ability to order history, etc. so ensure its removed upon login.
  if (options.type !== "anonymous" && options.type !== "resume") {
    let update = {
      $pullAll: {}
    };

    update.$pullAll["roles." + EFrameworkCore.getShopId()] = ["anonymous"];

    Meteor.users.update({
      _id: options.user._id
    }, update, {
      multi: true
    });
    // debug info
    EFrameworkCore.Log.debug("removed anonymous role from user: " + options.user._id);

    // onLogin, we want to merge session cart into user cart.
    // cart = EFrameworkCore.Collections.Cart.findOne({userId: options.user._id});
    // Meteor.call("cart/mergeCart", cart._id);

    // logged in users need an additonal worfklow push to get started with checkoutLogin
    return Meteor.call("workflow/pushCartWorkflow", "coreCartWorkflow", "checkoutLogin");
  }
});

/**
* @function Meteor.methods
* @summary Metodos Reactivos para Accounts
* @return {Boolean}
*/
Meteor.methods({

   /**
	* @function accounts/currentUserHasPassword
	* @summary Verifica si el usuario tiene password
	* @return {Boolean}
	*/
	"accounts/currentUserHasPassword": function () {
		let user;
		user = Meteor.users.findOne(Meteor.userId());
		if (user.services.password) {
			return true;
		}
		return false;
	},

	/**
	* @function accounts/addressBookAdd
	* @summary Agrega una nueva address a la account
	* @param {Account} doc - objeto account con información de nueva address
	* @param {String} accountId - id de la cuenta
	* @return {String} return Mongo upsert result
	*/
	"accounts/addressBookAdd": function (doc, accountId) {
		this.unblock();
		check(doc, EFrameworkCore.Schemas.Address);
		check(accountId, String);
		EFrameworkCore.Schemas.Address.clean(doc);
		if (doc.isShippingDefault || doc.isBillingDefault) {
			if (doc.isShippingDefault) {
				EFrameworkCore.Collections.Accounts.update({
					"_id": accountId,
					"userId": accountId,
					"profile.addressBook.isShippingDefault": true
				},
				{
					$set: { "profile.addressBook.$.isShippingDefault": false }
				});
			}
			if (doc.isBillingDefault) {
				EFrameworkCore.Collections.Accounts.update({
					"_id": accountId,
					"userId": accountId,
					"profile.addressBook.isBillingDefault": true
				},
				{
					$set: { "profile.addressBook.$.isBillingDefault": false }
				});
			}
		}
		return EFrameworkCore.Collections.Accounts.upsert(accountId, {
			$set: { userId: accountId },
			$addToSet: { "profile.addressBook": doc }
		});
  	},

	/**
	* @function accounts/addressBookUpdate
	* @summary Actualiza una address existente en el profile del usuario
	* @param {Account} doc - objeto account con información de nueva address
	* @param {String} accountId - id de la cuenta
	* @return {String} return Mongo update result
	*/
	"accounts/addressBookUpdate": function (doc, accountId) {
		this.unblock();
		check(doc, EFrameworkCore.Schemas.Address);
		check(accountId, String);
		if (doc.isShippingDefault || doc.isBillingDefault) {
			if (doc.isShippingDefault) {
				EFrameworkCore.Collections.Accounts.update({
					"_id": accountId,
					"profile.addressBook.isShippingDefault": true
				},
				{
				$set: {
				"profile.addressBook.$.isShippingDefault": false
				}
				});
			}
			if (doc.isBillingDefault) {
				EFrameworkCore.Collections.Accounts.update({
					"_id": accountId,
					"profile.addressBook.isBillingDefault": true
				},
				{
					$set: {
						"profile.addressBook.$.isBillingDefault": false
					}
				});
			}
		}
		return EFrameworkCore.Collections.Accounts.update({
			"_id": accountId,
			"profile.addressBook._id": doc._id
		},
		{
			$set: {
				"profile.addressBook.$": doc
			}
		});
	},

	/**
	* @function accounts/addressBookRemove
	* @summary Verifica si el usuario tiene password
	* @param {Account} doc - account que se eliminará
	* @param {String} accountId - id del account
	* @return {String} return Mongo update result
	*/
	"accounts/addressBookRemove": function (doc, accountId) {
		this.unblock();
		check(doc, EFrameworkCore.Schemas.Address);
		check(accountId, String);
		return EFrameworkCore.Collections.Accounts.update({
			"_id": accountId,
			"profile.addressBook._id": doc._id
		},
		{
			$pull: {
				"profile.addressBook": { _id: doc._id }
			}
		});
	},

  // /*
  //  * invite new admin users
  //  * (not consumers) to secure access in the dashboard
  //  * to permissions as specified in packages/roles
  //  */
  // "accounts/inviteShopMember": function (shopId, email, name) {
  //   let currentUserName;
  //   let shop;
  //   let token;
  //   let user;
  //   let userId;
  //   check(shopId, String);
  //   check(email, String);
  //   check(name, String);
  //   this.unblock();
  //   shop = Shops.findOne(shopId);

  //   if (!EFrameworkCore.hasOwnerAccess()) {
  //     throw new Meteor.Error(403, "Access denied");
  //   }

  //   EFrameworkCore.configureMailUrl();

  //   if (shop && email && name) {
  //     let currentUser = Meteor.user();
  //     if (currentUser) {
  //       if (currentUser.profile) {
  //         currentUserName = currentUser.profile.name;
  //       } else {
  //         currentUserName = currentUser.username;
  //       }
  //     } else {
  //       currentUserName = "Admin";
  //     }

  //     user = Meteor.users.findOne({
  //       "emails.address": email
  //     });

  //     if (!user) {
  //       userId = Accounts.createUser({
  //         email: email,
  //         username: name
  //       });
  //       user = Meteor.users.findOne(userId);
  //       if (!user) {
  //         throw new Error("Can't find user");
  //       }
  //       token = Random.id();
  //       Meteor.users.update(userId, {
  //         $set: {
  //           "services.password.reset": {
  //             token: token,
  //             email: email,
  //             when: new Date()
  //           }
  //         }
  //       });
  //       SSR.compileTemplate("shopMemberInvite", Assets.getText("server/emailTemplates/shopMemberInvite.html"));
  //       try {
  //         Email.send({
  //           to: email,
  //           from: currentUserName + " <" + shop.emails[0] + ">",
  //           subject: "You have been invited to join " + shop.name,
  //           html: SSR.render("shopMemberInvite", {
  //             homepage: Meteor.absoluteUrl(),
  //             shop: shop,
  //             currentUserName: currentUserName,
  //             invitedUserName: name,
  //             url: Accounts.urls.enrollAccount(token)
  //           })
  //         });
  //       } catch (_error) {
  //         throw new Meteor.Error(403, "Unable to send invitation email.");
  //       }
  //     } else {
  //       SSR.compileTemplate("shopMemberInvite", Assets.getText("server/emailTemplates/shopMemberInvite.html"));
  //       try {
  //         Email.send({
  //           to: email,
  //           from: currentUserName + " <" + shop.emails[0] + ">",
  //           subject: "You have been invited to join the " + shop.name,
  //           html: SSR.render("shopMemberInvite", {
  //             homepage: Meteor.absoluteUrl(),
  //             shop: shop,
  //             currentUserName: currentUserName,
  //             invitedUserName: name,
  //             url: Meteor.absoluteUrl()
  //           })
  //         });
  //       } catch (_error) {
  //         throw new Meteor.Error(403, "Unable to send invitation email.");
  //       }
  //     }
  //   } else {
  //     throw new Meteor.Error(403, "Access denied");
  //   }
  //   return true;
  // },

  // /*
  //  * send an email to consumers on sign up
  //  */
  // "accounts/sendWelcomeEmail": function (shopId, userId) {
  //   let email;
  //   check(shop, Object);
  //   this.unblock();
  //   email = Meteor.user(userId).emails[0].address;
  //   EFrameworkCore.configureMailUrl();
  //   SSR.compileTemplate("welcomeNotification", Assets.getText("server/emailTemplates/welcomeNotification.html"));
  //   Email.send({
  //     to: email,
  //     from: shop.emails[0],
  //     subject: "Welcome to " + shop.name + "!",
  //     html: SSR.render("welcomeNotification", {
  //       homepage: Meteor.absoluteUrl(),
  //       shop: shop,
  //       user: Meteor.user()
  //     })
  //   });
  //   return true;
  // },

	/**
	* accounts/addUserPermissions
	* @summary
	* @param {String} userId
	* @param {Array|String} permission
	*               Name of role/permission.  If array, users
	*               returned will have at least one of the roles
	*               specified but need not have _all_ roles.
	* @param {String} [group] Optional name of group to restrict roles to.
	*                         User"s Roles.GLOBAL_GROUP will also be checked.
	* @returns {Boolean} success/failure
	* @todo all
	*/
	"accounts/addUserPermissions": function (userId, permissions, group) {
		check(userId, Match.OneOf(String, Array));
		check(permissions, Match.OneOf(String, Array));
		check(group, Match.Optional(String));
		this.unblock();
		try {
			return Roles.addUsersToRoles(userId, permissions, group);
		} catch (error) {
			return EFrameworkCore.Log.info(error);
		}
	},

	/**
	* accounts/removeUserPermissions
	* @summary Elimina el permiso
	* @param {String} userId
	* @param {Array|String} permission
	* @param {String} [group]
	* @returns {Boolean} success/failure
	*/
	"accounts/removeUserPermissions": function (userId, permissions, group) {
		check(userId, String);
		check(permissions, Match.OneOf(String, Array));
		check(group, Match.Optional(String, null));
		this.unblock();
		try {
			return Roles.removeUsersFromRoles(userId, permissions, group);
		} catch (error) {
			EFrameworkCore.Log.info(error);
			throw new Meteor.Error(403, "Access Denied");
		}
	},

   /**
	* accounts/setUserPermissions
	* @summary Establecer permiso
	* @param {String} userId
	* @param {Array|String} permission
	* @param {String} [group]
	* @returns {}
	*/
	"accounts/setUserPermissions": function (userId, permissions, group) {
		check(userId, String);
		check(permissions, Match.OneOf(String, Array));
		check(group, Match.Optional(String));
		this.unblock();
		try {
			return Roles.setUserRoles(userId, permissions, group);
		}
		catch (error) {
			return EFrameworkCore.Log.info(error);
		}
	}
});
