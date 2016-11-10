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
		* @param {Object} insertDoc -  The form input values in a document, suitable for use with insert(). This object has been cleaned and validated, but auto values and default values have not been added to it.
		* @param {Object} updateDoc - The form input values in a modifier, suitable for use with update(). This object has not been validated.
		* @param {Object} currentDoc - The object that's currently bound to the form through the doc attribute.
		* @todo buscar que es this.done
		* @description Información sobre autoform
		*
		* In addition to the normal this hook context, there is a this.done() method, which you must call when you are done with your custom client submission logic. This allows you to do asynchronous tasks if necessary. You may optionally pass one argument. If you pass an Error object, then any onError hooks will be called; otherwise, any onSuccess hooks will be called.
		*
		* If you return false, no further submission will happen, and it is equivalent to calling this.event.preventDefault() and this.event.stopPropagation(). If you return anything other than false, the browser will submit the form.
		*
		* @see {@link https://atmospherejs.com/aldeed/autoform |ATMOSPHERE}
		*/
		onSubmit: function(insertDoc, updateDoc, currentDoc) {

		this.event.preventDefault();

			var addressBook = $(this.template.firstNode).closest('.address-book');
			var accountId = EFrameworkCore.Collections.Accounts.findOne()._id;
			var error;

			try {
				Meteor.call("accounts/addressBookUpdate", insertDoc, accountId, function(error, result) {
					if(error){
						// TODO: Mostrar mensaje de error
					}
				});
			}
			catch (_error) {
				error = _error;
				//para sincronizar
				this.done(new Error(error));
				//is equivalent to calling this.event.preventDefault() and this.event.stopPropagation()
				return false;
			}
			//Para sincronizar
			this.done();

			// Mostrar addressBookGrid
			addressBook.trigger($.Event('showMainView'));

		}
	}
});
