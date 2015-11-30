/* TODO: Descomentar */

Template.loginDropdown.events({

	/**
	* Submit sign up form
	* @param  {Event} event - jQuery Event
	* @param  {Template} template - Blaze Template
	* @return {void}
	* @todo Entender para que es esto
	*/
	"click .dropdown-menu": (event) => {
		return event.stopPropagation();
	},

	/**
	* Submit sign up form
	* @param  {Event} event - jQuery Event
	* @param  {Template} template - Blaze Template
	* @return {void}
	* @todo Entender que sucede aca tambien
	*/
	"click #logout": (event, template) => {
		/* TODO: para se setea el valor de esta variable. Para que se usa. ????*/
		Session.set("displayConsoleNavBar", false);

		/* TODO: Puede haver mas de un cliente conectado ???? Para que es eso ??? */
		Meteor.logoutOtherClients();
		/*Se envía al servidor solicitud de log-out.*/
		Meteor.logout((error) => {
			/* En caso de que el proceso falle, lo notificamos en el debug.*/
			/*
				TODO: No se que sucede si el proceso falla desde el punto de vista del cliente.
				Tampoco se que sucede en el caso que el cliente haga el proceso exitoso. Me imagino que habra una variable reactiva.
			*/
			if (error) {
				EFrameworkCore.Log.warn("Failed to logout.", error);
				return Meteor._debug(error);
			}
		});
		/* TODO: Cual es la accion default del event ???*/
		event.preventDefault();

		/*TODO: Que esta pasando aca ???*/
		template.$(".dropdown-toggle").dropdown("toggle");
	},

	/**
	* Submit sign up form
	* @param  {Event} event - jQuery Event
	* @param  {Template} template - Blaze Template
	* @return {void}
	* @todo entender todo
	*/
	"click .user-accounts-dropdown-apps a": function (event, template) {
		/* TODO: Haciendo debug me di cuenta que hay una serie de variables entre las que se encuentra
		this.route. No se como se crean dichas variables.*/

		/*En este caso, significa que se presiono el botón para agregar productos.*/
		if (this.route === "createProduct") {
			event.preventDefault();
			event.stopPropagation();

			Meteor.call("products/createProduct", (error, productId) => {
				let currentTag;
				let currentTagId;
				/*
					En caso de que se produzca un error en la creación de productos.
					Un ejemplo de error es cuando se intenta crear un product sin tener los permisos.
				*/
				if (error) {
					throw new Meteor.Error("createProduct error", error);
				}
				/*En caso de que se tiene un "productId"*/
				else if (productId) {
					/*Se busca  el currentTag*/
					currentTagId = Session.get("currentTag");
					currentTag = EFrameworkCore.Collections.Tags.findOne(currentTagId);
					/*En caso de existir, se le asigna inmediatamente al product en creación*/
					if (currentTag) {
						/*TODO: Me da la impresión que verifican si hay un currentTag, y si hay uno se le asigna inmediatamente al nuevo product*/
						Meteor.call("products/updateProductTags", productId, currentTag.name, currentTagId);
					}
					/*Redirigir la vista al nuevo producto creado.*/
					Router.go("product", { _id: productId });
				}
			});
		}
		/* En el caso de que this.route sea distinto a "createProduct" y distinto de null, significa que solo debemos redirigir la actual vista a la que indica dicho valor.*/
		else if (this.route) {
			event.preventDefault();
			/*TODO: No entiendo que sucede aca*/
			template.$(".dropdown-toggle").dropdown("toggle");
			/*TODO: Me envia a donde mismo estoy ????*/
			return Router.go(this.route);
		}
	}
});
