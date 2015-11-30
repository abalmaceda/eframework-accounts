// /*
//  * Template.checkoutAddressBook
//  * template determines which view should be used:
//  * addAddress (edit or add)
//  * addressBookView (view)
//  */


/**
 * Template.addressBook.onCreated
 * @summary Creo una variable reactiva con los address para utilizar en todo el Template
 */
Template.addressBook.onCreated(function () {
	//Obtengo la información del usuario
	let account = EFrameworkCore.Collections.Accounts.findOne({
		userId: Meteor.userId()
	});
	//Creo una variable reactiva para guardar los Templates (strings).
	this.currentViewTemplate = ReactiveVar("addressBookAdd");
	//Crea una variable reactiva para guardar los datos de adress
	this.templateData = ReactiveVar({});
	if (account){
		if (account.profile){
			if (account.profile.addressBook){
				if (account.profile.addressBook.length > 0) {
					// Si tiene al menos un address se agrega pone el template "addressBookGrid"
					this.currentViewTemplate.set("addressBookGrid");

					// TODO: make this more bullet proof
					// Assume that if we"re seeing the address book grid
					// then we should have both a default billing and shipping
					// address selected
				}
			}
		}
	}
});

// // Template.addressBook.onRendered(function () {
// //   let view = this.$("[blaze-view="addressBook"]").get(0);
// // });

 /**
 * Template.addressBook.helpers
 * @summary Helpers para Template.addressBook
 */
Template.addressBook.helpers({
	/**
	* @function
	* @summary
	* @return {}
	* @todo all
	*/
//   account: function () {
//     let account = EFrameworkCore.Collections.Accounts.findOne({
//       userId: Meteor.userId()
//     });
//     return account;
//   },

	/**
	* @function data
	* @summary Recupera los datos  de la o las direcciones.
	* @return {Address[]}
	* @todo all
	*/
	data: function () {
		return Template.instance().templateData.get();
	},

	/**
	* @function currentView
	* @summary Retorna un String que representa el actual Template que se esta utilizando
	* @return {String} opciones :  "addressBookGrid" | "addressBookEdit" | "addressBookAdd"
	*/
	currentView: function () {
		return Template.instance().currentViewTemplate.get();
	},

	/**
	* @function
	* @summary
	* @return {}
	* @todo all
	* @deprecated
	*/
	// selectedAddress: function () {
	// 	return Template.instance.templateData.get();
	// }
});

 /**
 * Template.addressBook.events
 * @summary Events para Template.addressBook
 */
Template.addressBook.events({

	/**
	* @event click [data-event-action=addNewAddress]
	* @summary Abre el formulario para creación de address
	* @param {} event -
	* @return {void}
	*/
	"click [data-event-action=addNewAddress]": function (event) {
		event.preventDefault();
		event.stopPropagation();

		Template.instance().currentViewTemplate.set("addressBookAdd");
	},

	/**
	* @event click [data-event-action=editAddress]
	* @summary
	* @param {} event -
	* @return {void}
	*/
	"click [data-event-action=editAddress]": function (event) {
		event.preventDefault();
		event.stopPropagation();

		Template.instance().templateData.set({ address: this });
		Template.instance().currentViewTemplate.set("addressBookEdit");
	},

	/**
	* @summary Elimina una address y si no queda ninguna disponible, muestra automaticamente el formulario de creación
	* @event click [data-event-action=removeAddress]
	* @param {} event -
	* @param {Blaze.Template} template - template actual
	* @return {void}
	*/
	"click [data-event-action=removeAddress]": function (event, template) {
		event.preventDefault();
		event.stopPropagation();

		Meteor.call("accounts/addressBookRemove", this, Meteor.userId(), function (error, result) {
			if(error){
				//Agregar manejo de errores
				EFrameworkCore.Log.warn("Failed to remove address from book",error);
			}
			let account = EFrameworkCore.Collections.Accounts.findOne({
				userId: Meteor.userId()
			});

			if (account) {
				if (account.profile) {
					if (account.profile.addressBook.length < 1) {
						template.currentViewTemplate.set("addressBookAdd");
					}
				}
			}
		});
	},

	/**
	* @event click [data-event-action=cancelAddressEdit], form submit, showMainView
	* @summary
	* @param {} event -
	* @return {void}
	*/
	"click [data-event-action=cancelAddressEdit], form submit, showMainView": function (event) {
		event.preventDefault();
		event.stopPropagation();

		Template.instance().currentViewTemplate.set("addressBookGrid");
	}
});
