
/**
* Submit Inicializa variables al crearse el Template de SignUp
* @event onCreated
* @return {void}
*/
Template.loginFormSignUpView.onCreated(() => {
	let template = Template.instance();

	template.uniqueId = Random.id();
  /* Variable reactiva para el manejo de errores en el formulario */
	template.formMessages = new ReactiveVar({});
	template.type = "signUp";
});

/**
 * Helpers: Login form sign up view
 */
 /* TODO */
Template.loginFormSignUpView.helpers(LoginFormSharedHelpers);

/**
 * Events: Login form sign up view
 */
 /* TODO */
Template.loginFormSignUpView.events({
    /**
    * Submit sign up form
    * @param  {Event} event - jQuery Event
    * @param  {Template} template - Blaze Template
    * @return {void}
    */
    "submit form": function (event, template) {
        event.preventDefault();

        /* Recuperar los valores del formulario*/
        let emailInput = template.$(".login-input-email");
        let passwordInput = template.$(".login-input-password");

        let email = emailInput.val().trim();
        let password = passwordInput.val().trim();

        /* Verifico los valores ingresados en el formulario*/
        let validatedEmail = LoginFormValidation.email(email);
        let validatedPassword = LoginFormValidation.password(password);

        let templateInstance = Template.instance();
        let errors = {};

        /* Eliminos todos los comentarios */
        templateInstance.formMessages.set({});

        /* Compruebo si existian errores */
        if (validatedEmail !== true) {
            errors.email = validatedEmail.reason;
        }

        if (validatedPassword !== true) {
            errors.password = validatedPassword;
        }

        /* Si existen errores, los setteo en la variable Reactiva. De esta manera se ejecuta el código en el template "loginFormSignUpView" */
        if ($.isEmptyObject(errors) === false) {
            templateInstance.formMessages.set({errors: errors});
            /* Evitar Sign Uo */
            return;
        }

        /* Si no se detectaron errores, se agrupa la información para enviarla */
        let newUserData = {
          // username: username,
          email: email,
          password: password
        };

        /* 
            Accounts.createUser es una función que viene en el package “accounts-password”.
            Se solicita al servidor la creación de un nuevo usuarios.
        */
        Accounts.createUser(newUserData, function (error) {
        	if (error) {
        		/* Si el servidor tiene comentarios */
        		templateInstance.formMessages.set({ alerts: [error] });
        	} else {
        		// Close dropdown or navigate to page
        	}
        });
    }
});
