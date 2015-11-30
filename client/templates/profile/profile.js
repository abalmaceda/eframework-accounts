// /**
//  * onCreated: Account Profile View
//  */

/**
 * Template.accountProfile.onCreated
 * @summary Helpers para Template.accountProfile
 * Account Profile View
 * @todo all
 */
Template.accountProfile.onCreated(() => {
	let template = Template.instance();
	// Crea variable reactiva
	template.userHasPassword = ReactiveVar(false);

	Meteor.call("accounts/currentUserHasPassword", (error, result) => {
		template.userHasPassword.set(result);
	});
});

 /**
 * Template.accountProfile.helpers
 * @summary Helpers para Template.accountProfile
 * Account Profile View
 * @todo all
 */
Template.accountProfile.helpers({

	/**
	* @function userHasPassword
	* @summary Comprueba si el usuario tiene password.
	* @return {Boolean}
	*/
	userHasPassword: function() {
		return Template.instance().userHasPassword.get();
	},

  /**
   * User's order history
   * @return {Array|null} an array of available orders for the user
   */
   /**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
//   userOrders() {
//     if (Meteor.user()) {
//       return EFrameworkCore.Collections.Orders.find({
//         userId: Meteor.userId()
//       }, {
//         sort: {
//           createdAt: -1
//         },
//         limit: 25
//       });
//     }
//   },

  /**
   * User's account profile
   * @return {Object} account profile
   */

   /**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
//   account() {
//     return EFrameworkCore.Collections.Accounts.findOne();
//   },

  /**
   * Returns the address book default view
   * @return {String} "addressBookGrid" || "addressBookAdd"
   */

	/**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
//   addressBookView: function () {
//     let account = EFrameworkCore.Collections.Accounts.findOne();
//     if (account.profile) {
//       return "addressBookGrid";
//     }
//     return "addressBookAdd";
//   }
});
