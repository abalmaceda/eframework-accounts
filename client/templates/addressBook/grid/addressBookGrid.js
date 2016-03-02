/**
 * Template.addressBookGrid.helpers
 * @summary Helpers para Template.addressBookGrid
 */
Template.addressBookGrid.helpers({
	/**
	* @function selectedBilling
	* @summary Verifica si
	* @return {String}
	*/
	selectedBilling: function () {
		let cart = EFrameworkCore.Collections.Cart.findOne({
			userId: Meteor.userId()
		});
		if (cart) {
			if (cart.billing) {
				if (cart.billing[0].address) {
					if (this._id === cart.billing[0].address._id) {
						return "active";
					}
				}
			}
		}
	},

	/**
	* @function selectedShipping
	* @summary Retorna la Class active si corresponde la url es el shipping seleccionado
	* @description Se verifica que la dirección "this" sea la seleccionada para shipping. De serlo, se devuelve la clase CSS para agregar feedback al usuario
	* @this corresponde al template que contiene la actual dirección
	* @return {String}
	*/
	selectedShipping: function () {
		let cart = EFrameworkCore.Collections.Cart.findOne({
			userId: Meteor.userId()
		});
		if (cart) {
			if (cart.shipping) {
				if (cart.shipping[0].address) {
					if (this._id === cart.shipping[0].address._id) {
						return "active";
					}
				}
			}
		}
	},

	/**
	* @function account
	* @summary Obtine el Cursor del  Collection.Account del usuario actual.
	* @return {Collection.Cursor} Cursor Con objeto Account del usuario actual
	*/
	account: function () {
		return EFrameworkCore.Collections.Accounts.findOne({
			userId: Meteor.userId()
		});
	}
});

/**
 * Template.addressBookGrid.events
 * @summary Events para Template.addressBookGrid
 */
Template.addressBookGrid.events({
	/**
	* @event click [data-event-action=selectShippingAddress]
	* @summaryselecciona la dirección para envio (shipping)
	* @return {} Meteor.call result
	* @todo Manejo de errores
	*/
	"click [data-event-action=selectShippingAddress]": function () {
		let cart = EFrameworkCore.Collections.Cart.findOne({
			userId: Meteor.userId()
		});
		return Meteor.call("cart/setShipmentAddress", cart._id, this);
	},

	/**
	* @event click [data-event-action=selectBillingAddress]
	* @summary Seleciona la dirección para cuentas (billing)
	* @return {} Meteor.call result
	* @todo Manejo de errores
	*/
	"click [data-event-action=selectBillingAddress]": function () {
		let cart = EFrameworkCore.Collections.Cart.findOne({
			userId: Meteor.userId()
		});
		return Meteor.call("cart/setPaymentAddress", cart._id, this);
	}
});
