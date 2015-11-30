/*  TODO */
/*
 * update address book (cart) form handling
 * onSubmit we need to add accountId which is not in context
 */

/*
 * addressBookAddForm form handling
 * gets accountId and calls addressBookAdd method
 */

 /**
 * AutoForm.hooks
 * @summary Hooks para addressBookEditForm
 */
AutoForm.hooks({
	/**
	 * @summary Eventos del formulario del Template addressBookEditForm
	 */
	addressBookEditForm: {
		/**
		* @event onSubmit
		* @summary Recupera el Address desde el formulario y lo agrega al Account
		* @param {Account} insertDoc - información de account
		* @todo buscar que es this.done
		*/
		onSubmit: function(insertDoc, updateDoc, currentDoc) {

		this.event.preventDefault();

		var addressBook = $(this.template.firstNode).closest('.address-book');
		var accountId = EFrameworkCore.Collections.Accounts.findOne()._id;
		var error;

		try {
			Meteor.call("accounts/addressBookUpdate", insertDoc, accountId, function(error, result) {
				if(error){
					// TODO: Mostar mensaje de error
				}
			});
		}
		catch (_error) {
			error = _error;
			this.done(new Error(error));
			return false;
		}
		this.done();

		// Mostrar addressBookGrid
		addressBook.trigger($.Event('showMainView'));

		}
	}
});
