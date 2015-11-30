

// ModalHelper = {
//   closeModal: function (template) {
//     Blaze.remove(template.view);
//   }
// };

// /**
//  * Accounts Event: onResetPasswordLink When a user uses a password reset link
//  */
// Accounts.onResetPasswordLink((token, done) => {
//   Blaze.renderWithData(Template.loginFormUpdatePasswordOverlay, {
//     token: token,
//     callback: done
//   }, $("body").get(0));
// });

// /**
//  * Accounts Event: onEnrollmentLink When a user uses an enrollment link
//  */
// Accounts.onEnrollmentLink((token, done) => {
//   Blaze.renderWithData(Template.loginFormUpdatePasswordOverlay, {
//     token: token,
//     callback: done
//   }, $("body").get(0));
// });

// /**
//  * Accounts Event: onEmailVerificationLink When a user uses an verification link
//  */
// Accounts.onEmailVerificationLink(function (token, done) {
//   Accounts.verifyEmail(token);
//   done();
// });

/**
  * Template.loginFormUpdatePasswordOverlay.onCreated
  * @summary Se crean variables globales y reactivas para este template.
  */
Template.loginFormUpdatePasswordOverlay.onCreated(() => {
	let template = Template.instance();
	template.uniqueId = Random.id();
	template.formMessages = new ReactiveVar({});
});

// /**
//  * Helpers: Login Form Update Password Overlay
//  */
// Template.loginFormUpdatePasswordOverlay.helpers(LoginFormSharedHelpers);

// /**
//  * Events: Login Form Update Password Overlay
//  */
// Template.loginFormUpdatePasswordOverlay.events({

//   /**
//    * Close modal
//    * @param  {Event} event - jQuery Event
//    * @param  {Template} template - Blaze Template
//    * @return {void}
//    */
//   "click .close, click .cancel": (event, template) => {
//     Blaze.remove(template.view);
//   },

//   /**
//    * Submit form within modal - onSubmit reset password if validation is successful
//    * @param  {Event} event - jQuery Event
//    * @param  {Template} template - Blaze Template
//    * @return {void}
//    */
//   "submit form": (event, template) => {
//     event.preventDefault();
//     event.stopPropagation();

//     let passwordInput = template.$(".login-input--password");
//     let password = passwordInput.val().trim();
//     let validatedPassword = LoginFormValidation.password(password);

//     let templateInstance = Template.instance();
//     let errors = {};

//     templateInstance.formMessages.set({});

//     if (validatedPassword !== true) {
//       errors.password = validatedPassword;
//     }

//     if ($.isEmptyObject(errors) === false) {
//       templateInstance.formMessages.set({
//         errors: errors
//       });
//       // prevent password update
//       return;
//     }

//     Accounts.resetPassword(this.token, password, (error) => {
//       if (error) {
//         // Show some error message
//         templateInstance.formMessages.set({
//           alerts: [error]
//         });
//       } else {
//         // Close dropdown or navigate to page
//         template.data.callback();

//         Blaze.remove(template.view);
//       }
//     });
//   }
// });

 /**
  * Template.loginFormChangePassword.onCreated
  * @summary Se crean variables globales y reactivas para este template.
  */
Template.loginFormChangePassword.onCreated(() => {
	let template = Template.instance();
	template.uniqueId = Random.id();
	template.formMessages = new ReactiveVar({});
});

 /**
  * Template.loginFormChangePassword.helpers
  * @summary Se agrega variable global "LoginFormSharedHelpers" como Helper
  * @see {@link eframework/packages/eframework-accounts/client/helpers/helpers.js}
  */
Template.loginFormChangePassword.helpers(LoginFormSharedHelpers);

/**
 * Events: Login Form Change Password
 */

  /**
 * Template.loginFormChangePassword.events
 * @summary Events para Template.loginFormChangePassword
 * Account Profile View
 */
Template.loginFormChangePassword.events({

	/**
	* @event submit form
	* @summary Submit form para actualizar password
	* @param  {Event} event - jQuery Event
	* @param  {Template} template - Blaze Template
	* @return {void}
	*/
	"submit form": function (event, template) {
		event.preventDefault();
		event.stopPropagation();

		// Obtiene ambos passwords
		let oldPasswordInput = template.$(".login-input--oldPassword");
		let passwordInput = template.$(".login-input--password");

		let oldPassword = oldPasswordInput.val().trim();
		let password = passwordInput.val().trim();

		// We only check if it exists, just incase we"ve change the password strength and want the
		// user to have an oppurtinity to update to a stronger password
		// Solo se verifica si existe el password ( no otras cosas como su strength, etc )
		let validatedOldPassword = LoginFormValidation.password(password, {validationLevel: "exists"});
		let validatedPassword = LoginFormValidation.password(password);

		let templateInstance = Template.instance();
		let errors = {};

		templateInstance.formMessages.set({});


		if (validatedOldPassword !== true) {
			errors.oldPassword = validatedOldPassword;
		}

		if (validatedPassword !== true) {
			errors.password = validatedPassword;
		}

		if ($.isEmptyObject(errors) === false) {
			templateInstance.formMessages.set({ errors: errors });
			// previene password update
			return;
		}

		Accounts.changePassword(oldPassword, password, (error) => {
			if (error) {
				//En caso de error en cambio, muestra algunos mensajes de error
				templateInstance.formMessages.set({ alerts: [error] });
			}
			else {
				//Cerramos dropdown para navegar por la página
				templateInstance.formMessages.set({ info: [{ reason: i18n.t("accountsUI.info.passwordChanged") }] });
			}
		});
	}
});
