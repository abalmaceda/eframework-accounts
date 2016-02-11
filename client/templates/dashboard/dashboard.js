 /**
 * Template.accountsDashboardControls.events
 * @summary Events para Template.accountsDashboardControls
 */
Template.accountsDashboardControls.events({
//   /**
//    * Accounts helpers
//    * @return {void}
//    */
//   "click [data-event-action=addShopMember]": () => {
//     EFrameworkCore.showActionView({
//       label: "Add Shop Member",
//       template: "memberForm"
//     });
//   }
});

/**
 * Template.accountsDashboard.helpers
 * @summary Helpers para Template.accountsDashboard
 */
Template.accountsDashboard.helpers({
	/**
	 * @function isShopMember
	 * @summary Veririca que se tenga permisos de Dashboard|Administrator|Owner
	 * @returns {Boolean} True is el miembro es un administrador
	 * @todo Documentar
	 */
	isShopMember: function() {
		let roles = ["Dashboard", "Administrator", "Owner"];
		if (_.contains(roles, this.role)) {
			return true;
		}
		return false;
	},

	/**
	 * @function isShopGuest
	 * @summary Veririca que no se tenga permisos de Dashboard|Administrator|Owner
	 * @returns {Boolean}
	 * @todo Documentar
	 */
	isShopGuest: function() {
		let roles = ["Dashboard", "Administrator", "Owner"];
		if (_.contains(roles, this.role) === false) {
			return true;
		}
		return false;
	},

	/**
	* @function members
	* @summary
	* @return {Boolean} True if the memnber is an administrator
	* @todo Documentar y entender
	*/
	members: function() {
		let ShopMembers;
		let members = [];
		let shopUsers;

		if (EFrameworkCore.hasPermission("dashboard/accounts")) {
			ShopMembers = Meteor.subscribe("ShopMembers");

			if (ShopMembers.ready()) {
				shopUsers = Meteor.users.find();

				shopUsers.forEach(function(user) {
					let member = {};

					member.userId = user._id;

					if (user.email) {
						if (user.emails[0] !== null) {
							member.email = user.emails[0];
						}
					}
					member.user = user;
					member.username = user !== null ? user.username : void 0;
					member.isAdmin = Roles.userIsInRole(user._id, "admin", EFrameworkCore.getShopId());
					member.roles = user.roles;
					member.services = user.services;

					if (Roles.userIsInRole(member.userId, "dashboard", EFrameworkCore.getShopId())) {
						member.role = "Dashboard";
					}

					if (Roles.userIsInRole(member.userId, "admin", EFrameworkCore.getShopId())) {
						member.role = "Administrator";
					}

					if (Roles.userIsInRole(member.userId, "owner", EFrameworkCore.getShopId())) {
						member.role = "Owner";
					} else if (Roles.userIsInRole(member.userId, EFrameworkCore.getShopId(), EFrameworkCore.getShopId())) {
						member.role = "Guest";
					}

					members.push(member);
				});

				return members;
			}
		}
	}

});

/**
 * Account Settings Helpers
 */
// Template.accountsSettings.onCreated(() => {
//   Meteor.subscribe("ServiceConfiguration", Meteor.userId());
// });


 /**
 * Template.accountsSettings.helpers
 * @summary Helpers para Template.accountsSettings
 */
Template.accountsSettings.helpers({

//   /**
//    * services
//    * @return {Array} available services
//    */
//   services() {
//     let serviceHelper = new ReactionServiceHelper();
//     let configurations = ServiceConfiguration.configurations.find().fetch();

//     let services = serviceHelper.services((item) => {
//       let matchingConfigurations = _.where(configurations, {service: item.name});
//       if (matchingConfigurations.length) {
//         return matchingConfigurations[0];
//       }
//     });

//     return services;
//   },

//   /**
//    * Template helper to add a hidden class if the condition is false
//    * @param  {Boolean} enabled Service enabled
//    * @return {String}          "hidden" or ""
//    */
//   shown(enabled) {
//     return enabled !== true ? "hidden" : "";
//   },

//   /**
//    * Return checked classname if true
//    * @param  {Boolean} enabled Boolean value true/false
//    * @return {String}          "checked" or ""
//    */
//   checked(enabled) {
//     return enabled === true ? "checked" : "";
//   },

//   /**
//    * Returns a value from the supplied service object with a field name
//    * @param  {String} fieldName name of field to retrive the value for.
//    * @param  {Object} service   Service object to find the value in.
//    * @return {String}           A value or blank string if nothing is found.
//    */
//   valueForField(fieldName, service) {
//     return service[fieldName] || "";
//   }
});

/**
 * Template.accountsSettings.events
 * @summary Events para Template.accountsSettings
 */
Template.accountsSettings.events({

//   /**
//    * Account settings form submit
//    * @param  {event} event    jQuery event
//    * @return {void}
//    */
//   "submit form": (event) => {
//     event.preventDefault();

//     let service = event.target.service.value;
//     let serviceHelper = new ReactionServiceHelper();
//     let fields = serviceHelper.configFieldsForService(service);
//     let niceName = serviceHelper.capitalizedServiceName(service);

//     for (let field of fields) {
//       field.value = event.target[field.property].value;
//     }

//     Meteor.call("accounts/updateServiceConfiguration", service, fields, (error) => {
//       if (!error) {
//         Alerts.add(`Updated service configuration for ${niceName}`, {
//           type: `service-config-${service}`,
//           i18nKey: `serviceConfig.successUpdate${niceName}`
//         });
//       }
//     });
//   },

//   /**
//    * Account settings update enabled status for login service on change
//    * @param  {event} event    jQuery Event
//    * @return {void}
//    */
//   "change input[name=enabled]": (event) => {
//     let service = event.target.value;
//     let fields = [{
//       property: "enabled",
//       value: event.target.checked
//     }];

//     Meteor.call("accounts/updateServiceConfiguration", service, fields);
//   },

//   /**
//    * Account settings show/hide secret key for a service
//    * @param  {event} event    jQuery Event
//    * @return {void}
//    */
//   "click [data-event-action=showSecret]": (event) => {
//     let button = $(event.currentTarget);
//     let input = button.closest(".form-group").find("input[name=secret]");

//     if (input.attr("type") === "password") {
//       input.attr("type", "text");
//       button.html("Hide");
//     } else {
//       input.attr("type", "password");
//       button.html("Show");
//     }
//   }
});
