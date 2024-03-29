/* TODO */

// ============================================================================
// Login form
//
//

// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
function capitalize(str) {
  let finalString = str === null ? "" : String(str);
  return finalString.charAt(0).toUpperCase() + finalString.slice(1);
}


// ----------------------------------------------------------------------------
// Login Form helpers
//
/* TODO: ver esta funcion */
Template.loginForm.helpers({
	/* TODO: ver esta definicion */
	/**
	* Login form current view
	* @return {String} Nombre del Template para utilizarlo como la vista actual
	*/
	loginFormCurrentView() {
		/* TODO : entender que es lo que hace aca */
		return Template.instance().loginFormCurrentView.get();
	},

  /**
   * Unique id to use on form elements
   * @return {String} String of the unique ID for the current template
   */
  uniqueId() {
    return Template.instance().uniqueId;
  }

});

/**
 * Login form onCreated
 */
 /* TODO : entender el codigo */
Template.loginForm.onCreated(function () {
	let template = Template.instance();
	let currentData = Template.currentData();
	let startView = "loginFormSignInView";

	if (currentData) {
		if (currentData.startView) {
			startView = currentData.startView;
		}
	}

	/* TODO : entender este código */
	template.loginFormCurrentView = new ReactiveVar(startView);
	template.uniqueId = Random.id();
	template.credentials = {};
});

/**
 * Login Form events
 * These events are shared across all login form views and subviews
 */
 /*TODO*/
Template.loginForm.events({

	/**
	* Event: Show sign in view
	* @param  {Event}    event    jQuery Event
	* @param  {Template} template Blaze Template instance
	* @return {void}
	*/
	/*TODO*/
	"click [data-event-action=signIn]": function (event, template) {
		event.preventDefault();
		event.stopPropagation();

		template.email = template.$(".login-input-email").val();
		template.password = template.$(".login-input-password").val();

		template.loginFormCurrentView.set("loginFormSignInView");
	},

  /**
   * Event: Show the sign up (register) view
   * @param  {Event}    event    jQuery Event
   * @param  {Template} template Blaze Template instance
   * @return {void}
   */
  "click [data-event-action=signUp]": (event, template) => {
    event.preventDefault();
    event.stopPropagation();

    template.email = template.$(".login-input-email").val();
    template.password = template.$(".login-input-password").val();

    template.loginFormCurrentView.set("loginFormSignUpView");
  },

  /**
   * Event: Show the password reset view
   * @param  {Event}    event    jQuery Event
   * @param  {Template} template Blaze Template instance
   * @return {void}
   */
  "click [data-event-action=forgotPassword]": (event, template) => {
    event.preventDefault();
    event.stopPropagation();

    template.email = template.$(".login-input-email").val();
    template.password = template.$(".login-input-password").val();

    template.loginFormCurrentView.set("loginFormResetPasswordView");
  }
});

/**
 * Service sign in button helpers
 */
Template.loginFormServiceButton.events({

	/**
	* Event: Click (click on the service button to sign in / sign up)
	* @param  {Event}    event    jQuery Event
	* @param  {Template} template Blaze Template instance
	* @return {void}
	*/
	"click button": (event, template) => {
	let serviceName = template.data.name;

		// Get proper service name
		if (serviceName === "meteor-developer") {
			serviceName = "MeteorDeveloperAccount";
		} else {
			serviceName = capitalize(serviceName);
		}

		let loginWithService = Meteor["loginWith" + serviceName];
		let options = {}; // use default scope unless specified

		loginWithService(options, () => {
			// TODO: add error message for failed login attempt
		});
	}
});
