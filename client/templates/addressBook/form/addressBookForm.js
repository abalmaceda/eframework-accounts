/**
 * Template.addressBookForm.helpers
 * @summary Helpers para Template.addressBookForm
 */
Template.addressBookForm.helpers({
   /**
	* @function countryOptions
	* @summary Muestra las opciones de País que tiene disponible la shop
	* @returns {String[]} Paises
	* @todo update for i18n
	*/
	countryOptions: function() {
		var country, locale, options, ref, shop;
		options = [];
		shop = EFrameworkCore.Collections.Shops.findOne();
		ref = shop != null ? shop.locales.countries : void 0;
		for (country in ref) {
			locale = ref[country];
			options.push({ 'label': locale.name, 'value': country});
		}
		return options;
	},

	/**
	* @function statesForCountry
	* @summary Retorna los estados de paises que la shop tiene disponible
	* @returns {String[]} Estados de paises
	* @todo update for i18n
	*/
	statesForCountry: function() {
		var locale, options, ref, selectedCountry, shop, state;
		shop = EFrameworkCore.Collections.Shops.findOne();
		selectedCountry = Session.get('addressBookCountry' || AutoForm.getFieldValue('country'));
		if (!selectedCountry) {
			return false;
		}
		if ((shop != null ? shop.locales.countries[selectedCountry].states : void 0) == null) {
			return false;
		}
		options = [];
		ref = shop != null ? shop.locales.countries[selectedCountry].states : void 0;
		for (state in ref) {
			locale = ref[state];
			options.push({'label': locale.name, 'value': state });
		}
		return options;
	},

   /**
	* @function isBillingDefault
	* @summary Defaults billing cuando se agrega la primera address
	* @returns {Boolean}
	*/
	isBillingDefault: function() {
		let ref;
		if (!(((ref = this.profile) != null ? ref.addressBook : void 0) && !addressBookEditId.get())) {
			return true;
		}
	},
	/**
	* @function isShippingDefault
	* @summary Defaults shipping cuando se agrega la primera address
	* @returns {Boolean}
	*/
	isShippingDefault: function() {
		let ref;
		if (!(((ref = this.profile) != null ? ref.addressBook : void 0) && !addressBookEditId.get())) {
			return true;
		}
	}
});

/**
 * Template.addressBookForm.events
 * @summary Events para Template.addressBookForm
 */
Template.addressBookForm.events({
	/**
	* @event change [name="country"]
	* @summary Guarda en una variable reactiva el pais seleccionado
	* @return {void}
	*/
	'change [name="country"]': function() {
		return Session.set('addressBookCountry', AutoForm.getFieldValue('country'));
	}
});
