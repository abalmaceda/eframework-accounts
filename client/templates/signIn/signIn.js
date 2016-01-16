/* TODO */

/**
 * onCreated: Login form sign in view
 */
 /* TODO : entender para que se crea este objeto al iniciar la creación de este template. Ademas estas variables entonces viven siempre dentro de este template ???*/
Template.loginFormSignInView.onCreated(() => {
	let template = Template.instance();

	template.uniqueId = Random.id();
	/*
		TODO : Entender como funciona lo de new ReactiveVar();
	*/
	template.formMessages = new ReactiveVar({});
});

/**
 * Helpers: Login form sign in view
 */
 /* TODO : se estan entregando como helpers --> LoginFormSharedHelpers . SE esta utilizando esto ???????*/
Template.loginFormSignInView.helpers(LoginFormSharedHelpers);

/**
 * Events: Login form sign in view
 */
Template.loginFormSignInView.events({

	/**
	* Submit form - Evento que se inicia cuando se presiona el botón Sign In en el formulario para hacer log-in.
	* @param  {Event} event - jQuery Event
	* @param  {Template} template - Blaze Template
	* @return {void}
	*/
	/* TODO : Al parecer, los eventos se ponen como string. Ademas, entiendo que el parametro "event" sea pasado, pero por que el parametro template se pasa. A que corresponde este parametro. Me imagino que corresponde a la variable creade en .onCreated(). */
	/* TODO : after-login Aun no entiendo solo la primera vez de entrar a este evento, la apicacion llama a Router.onBeforeAction() generico que se encuentra en el archivo router.js del package framework-core. Yo imaginaria que se llamaria al package Router y se enrutaria a una direcino despues de verificar si el usuario existia y tenia las credenciales correctas (Meteor.loginWithPassword)*/
	"submit form": (event, template) => {
		event.preventDefault();

		/* Se obtienen las credenciales para autenticarse*/
		let usernameInput = template.$(".login-input-email");
		let passwordInput = template.$(".login-input-password");

		let username = usernameInput.val().trim();
		let password = passwordInput.val().trim();

		/* Se validan las credenciales */
		/*
			Se valida que el email sea un string que cumpla con la estructura de un mail.
			Aunque no es el caso, podria restringirse el tipo de correo: A modo de ejempo si existe una empresa llamada MiEmpresa que tiene correos de la forma __________ @miempresa.com, se podria restringir que solo acepte correos de tipo "xxxxxxxxx@miempresa.com"
		*/
		let validatedEmail = LoginFormValidation.email(username);
		/*
			Se valida si el password es considerado valido
			TODO: entender que quiere decir que el validationLevel = "exists"
		*/
		let validatedPassword = LoginFormValidation.password(password, {validationLevel: "exists"});

		/* TODO : verificar esta instancia de template */
		let templateInstance = Template.instance();
		let errors = {};

		/* TODO : verificar como funciona esto */
		templateInstance.formMessages.set({});

		if (validatedEmail !== true) {
			errors.email = validatedEmail.reason;
		}

		if (validatedPassword !== true) {
			errors.password = validatedPassword;
		}

		if ($.isEmptyObject(errors) === false) {
			/* TODO : verificar como funciona esto */
			templateInstance.formMessages.set({
				errors: errors
			});
			/*  Evita enviar las credeciales para autenticar ya que no paso las validaciones*/
			return;
		}

		/* En caso de que las credenciales tengan una estructura valida, se verifica en el servidor si estas pertenecen a algún usuario. */
		/* Meteor.loginWithPassword es una funcion provista por el package “accounts-password” */
		Meteor.loginWithPassword(username, password, (error) => {
			if (error) {
				/* La autenticacion envio un error. Asi que se muestra el error sobre los campos del formulario */
				/* TODO : verificar como funciona esto */
				templateInstance.formMessages.set({
					alerts: [error]
				});
			} else {
				/* TODO: verificar para que es este ELSE */
				// Close dropdown or navigate to page
			}
		});
	}
});
