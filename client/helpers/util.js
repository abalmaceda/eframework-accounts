/**
* @summary Capitalize el primer caracter de un String
* @param {String} str - String sobre el que se desea realizar un Capitalize 
* @returns {String} String con el primer caracter Capitalize o vacio si el parametro era null
*/
function capitalize(str) {
	let finalString = str === null ? "" : String(str);
	return finalString.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @summary Helper para el manejo de los Third-Party Autentication
 * @class
 * @param {Fucntion} availableServices
 * @param {Fucntion} capitalizedServiceName
 * @param {Fucntion} configFieldsForService
 */
EFrameworkServiceHelper = class EFrameworkServiceHelper {

	construct() {}

	/**
	* @summary Obtiene todos los servicios disponibles de Third-Party Autentication
	* @returns {String[]} Nombre de los servicios Third-Party Autentication disponibles ordenados alfabeticamente.
	*/
	availableServices() {
		/* TODO : Entender como funciona esto de los packages  */
		let services = Package["accounts-oauth"] ? Accounts.oauth.serviceNames() : [];
		services.sort();

		return services;
	}
	/**
	* @summary Obtiene todos los servicios disponibles de Third-Party Autentication
	* @param {String} name - 
	* @returns {String} Se retorna el parametro con su primer caracter Capitalize, salvo que el parámetro sea "meteor-developer" donde se retornará "MeteorDeveloperAccount".
	*/
	/* TODO : Entender que representa el parametro "name" */
	capitalizedServiceName(name) {
		if (name === "meteor-developer") {
			return "MeteorDeveloperAccount";
		}

		return capitalize(name);
	}

	/* TODO : Documentar y entender esta función */
	/**
	* @summary Obtiene los campos necesarios para autenticarse en el servicio Third-Party
	* @param {String} name - Nombre del servicio  Third-Party del cual se desea obtener infomación ( Ejemplos: facebook, google, github, etc) 
	* @returns {String[]} [] si el servicio no existe, ó un String [] Con el valor de los campos necesarios que se necesitan agregar el formulario del para la autenticación
	*/
	configFieldsForService(name) {
		let capitalizedName = this.capitalizedServiceName(name);
		/* Template pertenece al Package de BLAZE ( Blaze.Template ). Es un arreglo que tiene como key el nombre de todos los templates registrados. Como valor tiene la información relacionada con dicho template; como sus helpers, events, etc. */
		let template = Template[`configureLoginServiceDialogFor${capitalizedName}`];

		if (template) {
			let fields = template.fields();

			return _.map(fields, (field) => {
				if (!field.type) {
					field.type = field.property === "secret" ? "password" : "text";
				}

				return _.extend(field, {
					type: field.type
				});
			});
		}

		return [];
	}

	/**
	* @summary Obtiene todos los servicios disponibles de Third-Party Autentication
	* @param {Function} extendEach - 
	* @returns {Object[]} Arreglo de objetos que contienen la información de los servicios Third-Party Autentication disponibles.
	*/
	services(extendEach) {
		let services = this.availableServices();

		/* TODO : Entender esta linea */
		let configurations = ServiceConfiguration.configurations.find().fetch();

		/* TODO : Entender todo este código */
		return _.map(services, (name) => {
			let matchingConfigurations = _.where(configurations, {service: name});
			let service = {
				name: name,
				label: this.capitalizedServiceName(name),
				fields: this.configFieldsForService(name)
			};

			if (matchingConfigurations.length) {
				service = _.extend(service, matchingConfigurations[0]);
			}

			if (_.isFunction(extendEach)) {
				service = _.extend(service, extendEach(service) || {});
			}

			return service;
		});
	}
};
