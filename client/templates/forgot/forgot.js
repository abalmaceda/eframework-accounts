Template.loginFormResetPasswordView.events({

	/**
	* Submit el formulario de  password reset
	* @param {Event} event - jQuery Event
	* @param {Object} template - Blaze Template
	* @return {void}
	*/
	"submit form": (event, template) => {
	event.preventDefault();
		/* Obtine el email */
		let emailAddress = template.$(".login-input-email").val().trim();
		/* valida el email */
		let validatedEmail = LoginFormValidation.email(emailAddress);
		let templateInstance = Template.instance();
		let errors = {};

		templateInstance.formMessages.set({});
		/* verifiva si hubieron errores */
		if (validatedEmail !== true) {
			errors.email = validatedEmail.reason;
		}

		if ($.isEmptyObject(errors) === false) {
			templateInstance.formMessages.set( {errors: errors} );
		// prevent password reset
		/* TODO : return estaba comentado antes, asi que probare momentaneamente descomentandolo*/
			return;
		}

		/* TODO : de aca para abajo no funciona aun */
		// Make sure mail is properly configured for this shop before we end anything
		EFrameworkCore.configureMailUrl();

		Accounts.forgotPassword({ email: emailAddress}, (error) => {
			// Show some message confirming result

			if (error) {
				templateInstance.formMessages.set({
				alerts: [error]
				});
			}
			else {
				templateInstance.formMessages.set(
				{
					info: [
					{
						reason: i18n.t("accountsUI.info.passwordResetSend")
					}]
				});
			}
		});
	}

});

/**
 * loginFormResetPasswordView
 *
 */
Template.loginFormResetPasswordView.onCreated(() => {
  let template = Template.instance();

  template.uniqueId = Random.id();
  template.formMessages = new ReactiveVar({});
});


Template.loginFormResetPasswordView.helpers(LoginFormSharedHelpers);
