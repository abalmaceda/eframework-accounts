
/*
* Recordar que Template.instance() es para acceder la instancia del Template generalmente desde los helpers
*/


window.LoginFormSharedHelpers = {
	/**
	* messages
	* @summary Rertona toda la información que tiene la variable formMessages. formMessages us una "reactive data", por lo tanto esta funcion se ejecuta cada vez qeu dicha variable sufre algun cambios.
	* @return {Object} - Retorna un objecto con todos los mensajes almacenados en relación al Template actual.
	*/
	messages: function() {
		return Template.instance().formMessages.get();
	},

	/**
	* hasError
	* @summary Verifica que el parametro contenga informaión de un error.
	* @param {String} error - Información de un error
	* @return {String/ Boolean} - Retorna un String con classes (css) si hay errores, o "false" en caso contrario
	*/
	/* TODO: cambio hasError(error) -> hasError: function(error) para verificar compatibilidad */
	hasError: function(error) {
		// We're checking if theres some other message to display
		/* True significa que el campo e valido ( no tiene errores )*/
		if (error !== true && typeof error !== "undefined") {
			return "has-error has-feedback";
		}

		return false;
	},
	/* TODO : al paraecer esta funcion esta deprecada. Solo se esta utilzando messages()*/
	formErrors() {
		return Template.instance().formErrors.get();
	},
	/* TODO */
	uniqueId: function() {
		return Template.instance().uniqueId;
	},

	/**
	* services - Obtiene todos los servicios disponibles para hacer Third-Party Authentication.
	* @return {Array[Object]} - 
	*/
	services() {
		let serviceHelper = new EFrameworkServiceHelper();
		return serviceHelper.services();
	},

	/* TODO */
	shouldShowSeperator() {
		let serviceHelper = new EFrameworkServiceHelper();
		let services = serviceHelper.services();
		let enabledServices = _.where(services, {enabled: true});

		return !!Package["accounts-password"] && enabledServices.length > 0;
	},

	/* TODO */
	hasPasswordService() {
		return !!Package["accounts-password"];
	}
};


/**
 * registerHelper displayName
 */
 /* TODO */
Template.registerHelper("displayName", function (user) {
  let username;
  let authenticated = false;
  user = user || Meteor.user();

  if (user && user.profile && user.profile.name) {
    return user.profile.name;
  } else if (user && user.username) {
    return user.username;
  }

  if (user.services && user.services !== 'anonymous' && user.services !== 'resume') {
    authenticated = true;
  }

  if (user && authenticated === true) {
    return username = (function () {
      switch (false) {
        case !user.services.twitter:
          return user.services.twitter.name;
        case !user.services.google:
          return user.services.google.name;
        case !user.services.facebook:
          return user.services.facebook.name;
        case !user.services.instagram:
          return user.services.instagram.name;
        case !user.services.pinterest:
          return user.services.pinterest.name;
        default:
          return i18n.t('accountsUI.guest') || "Guest";
      }
    })();
  } else {
    return i18n.t('accountsUI.signIn') || "Sign in TEST";
  }
});

/**
 * registerHelper fName
 */
/* TODO */
Template.registerHelper("fName", function (user) {
  var username;
  user = user || Meteor.user();
  if (user && user.profile && user.profile.name) {
    return user.profile.name.split(" ")[0];
  } else if (user && user.username) {
    return user.username.name.split(" ")[0];
  }
  if (user && user.services) {
    return username = (function () {
      switch (false) {
        case !user.services.twitter:
          return user.services.twitter.first_name;
        case !user.services.google:
          return user.services.google.given_name;
        case !user.services.facebook:
          return user.services.facebook.first_name;
        case !user.services.instagram:
          return user.services.instagram.first_name;
        case !user.services.pinterest:
          return user.services.pinterest.first_name;
        default:
          return i18n.t('accountsUI.guest') || "Guest";
      }
    })();
  } else {
    return i18n.t('accountsUI.signIn') || "Sign in";
  }
});
