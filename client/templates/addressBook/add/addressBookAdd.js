/**
 * Template.addressBookAdd.helpers
 * @summary Helpers para Template.addressBookAdd
 */
Template.addressBookAdd.helpers({
	/**
	* @function thisAddress
	* @summary Obtiene
	* @return {Address}
	* @todo all
	*/
	thisAddress: function () {
		let thisAddress = {};
		let account = EFrameworkCore.Collections.Accounts.findOne();
		if (account) {
			if (account.profile) {
				if (account.profile.name) {
					thisAddress.fullName = account.profile.name;
				}
			}
		}
		if (Session.get("address")) {
			thisAddress.postal = Session.get("address").zipcode;
			thisAddress.country = Session.get("address").countryCode;
			thisAddress.city = Session.get("address").city;
			thisAddress.region = Session.get("address").state;
		}
		return thisAddress;
	},

	/**
	* @function hasAddressBookEntries
	* @summary Verifica si el usuario tiene o no entradas de Address.
	* @return {Boolean}
	*/
	hasAddressBookEntries: function () {
		//Obtiene la información del usuario
		let account = EFrameworkCore.Collections.Accounts.findOne({
			userId: Meteor.userId()
		});
		if (account) {
			if (account.profile) {
				if (account.profile.addressBook) {
					if (account.profile.addressBook.length > 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
});

/**
 * Template.addressBookAdd.events
 * @summary Events para Template.addressBookAdd
 */
Template.addressBookAdd.events({
	//Esto estaba comentado antes. Revizar si realmente debe estarlo
  // "click #cancel-new, form submit": function(event, template) {
  //   console.log(event, template, Template.instance())
  //   return Session.set("addressBookView", "addressBookGrid");
  // },
  // "submit form": function() {
  //   return Session.set("addressBookView", "addressBookGrid");
  // }
});



/**
 * AutoForm.hooks
 * @summary Hooks para addressBookAddForm
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario del Template addressBookAddForm
	 */
	addressBookAddForm: {
		/**
		* @event onSubmit
		* @summary Recupera el Address desde el formulario y lo agrega al Account
		* @param {Account} insertDoc - información de account
		* @todo buscar que es this.done
		*/
		onSubmit: function (insertDoc) {
			this.event.preventDefault();
			let accountId;
			let addressBook = $(this.template.firstNode).closest(".address-book");
			let account = EFrameworkCore.Collections.Accounts.findOne();
			accountId = account._id;

			if (!insertDoc._id) {
				insertDoc._id = Random.id();
			}

			try {
				Meteor.call("accounts/addressBookAdd", insertDoc, accountId);
			}
			catch (error) {
				this.done(new Error("Failed to add address", error));
				return false;
			}
			this.done();
			addressBook.trigger($.Event("showMainView"));
		}
	}
});
