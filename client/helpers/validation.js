/* TODO : No entiendo por que se agrega  "LoginFormValidation" al objeto "window" */
window.LoginFormValidation = {

	/* TODO : al parecer no se utiliza esta funcion "username" */
	/**
	* email - valida que el String que se pasa como email, tenga una estructura correcta ( desde el punto de  vista de mail)
	* @param  {String} username - String que se desea revizar
	* @return {Boolean/Object} retorna True si es correcto o retorna un objeto con el "id" y "verbose" del error.
	*/
	username: function(username) {
		/*
			Se considera invalido si el "username" tiene un largo inferior a 3.
		*/
		if (username.length < 3) {
			/* TODO : Verificar si es necesario que aca el "error" y "reason" sean Strings */
			return {
				"error": "INVALID_USERNAME",
				/* TODO : Agregar internalizacion para el "reason" i18n.t(...) */
				"reason": "Username must be at least 3 characters long"
			};
		}

		/*  Hay algun lugar donde se verifique si el usuario ya existe */
		/*
			Si cumple con todos los requisitos ( para este caso solo uno ), entoces el "username" se considera correcto.
		*/
		return true;

	},

	/**
	* email - valida que el String que se pasa como email, tenga una estructura correcta ( desde el punto de  vista de mail)
	* @param  {String} email - String que se desea revizar
	* @param  {Boolean} optional - si tienen valor True permite que el email sea vacio
	* @return {Boolean/Object} retorna True si es correcto o retorna un objeto con el "id" y "verbose" del error.
	*/
	email: function(email, optional) {

		email = email.trim();

		// Valid
		if (optional === true && email.length === 0) {
			return true;
		}
		/*
			Aunque se espera un correo, esta funcion solo exige que tenga el caracter "@" para ser considerado como un correo.
			Notar que incluso bastaria con entregar un email = "@" para ser considerado valido.
			Se podria hacer mas restrictiva esto agregando una expresion regular por ejemplo, para verficiar que realmente tenga la estructura de un correo.
			Incluso se puede analizar el nombre del Dominio y forzarlo al de una empresa en particular.
		*/
		else if (email.indexOf('@') !== -1) {
			return true;
		}

		// Invalid
		return {
			error: "INVALID_EMAIL",
			reason: i18n.t('accountsUI.error.invalidEmail')
		};

	},
	/**
	* password - valida que el String que se pasa como email, tenga una estructura correcta ( desde el punto de  vista de mail)
	* @param  {String} password - String que se desea revizar
	* @param  {Boolean} optional - TODO : Agregar definicion
	* @return {Boolean/Object} retorna True si es correcto o retorna un objeto con el "id" y "verbose" del error.
	*/
	password: function(password, options) {

		/*
		 Expresion regular que simplemente valida que tenga al menos un caracter y/o simbolo.
		 Se podria agregar restricciones como que contenga mayusculas/minuscular; incluso aplicar un algoritmo para saber si es un password potencialmente inseguro.
		 */
		var validPasswordRegex = /^.*(?=.*[a-z])(?=.*[\d\W]).*$/;
		options = options || {};

		//Verificamos si se ingreso o no un password.
		// Por ejemplo es útil en caso de login forms ya que solo nos interesa saber si realmente ingreso algo, para luego verificarlo con lo que esta en el servidor.
		if (options.validationLevel === 'exists') {
			if (password.length > 0) {
				return true;
			} else {
				return [{
					error: "INVALID_PASSWORD",
					reason: i18n.t('accountsUI.error.passwordRequired')
				}];
			}
		}

	    // Se valida le password. Util cuando debe ser creado o actualizado
	    var errors = [];

	    /* Se agrega restriccion que tenga un largo al menos de 6 caracteres. Ojo que no se agrego esta restriccion dentro de la Expresion regular para asi poder identificar que el error es por largo y no por tipo de caracter insertado. */
	    if (password.length < 6) {
			errors.push({
				error: "INVALID_PASSWORD",
				reason: i18n.t('accountsUI.error.passwordMustBeAtLeast6CharactersLong')
			});
	    }

	    /* Se verifica que el password haga match con la expression regular */
	    if (password.match(validPasswordRegex) === null) {
			errors.push({
				error: "INVALID_PASSWORD",
				reason: i18n.t('accountsUI.error.passwordMustContainRequirements')
			});
	    }

	    /* Si existen errores, se retornan */
	    if (errors.length) {
			return errors;
	    }

	    /* Si no hay errores, entonces se considera como password valido. */
	    return true
  	}
};
