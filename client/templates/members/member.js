/**
* shopMember helpers
* permissions / roles controls
* we use userInRole instead of EFrameworkCore intentionally
* to check each users permissions
*/

/**
* Template.productGridItems.events
* @summary Events para Template.productGridItems
*/
Template.member.events({
	/**
	 * @summary
	 * @event click [data-event-action=showMemberSettings]
	 * @returns {void}
	 */
	"click [data-event-action=showMemberSettings]": function () {
		EFrameworkCore.showActionView({
			label: "Edit Member",
			data: this,
			template: "memberSettings"
		});
	}
});

/**
* Template.memberSettings.helpers
* @summary Helpers para Template.memberSettings
*/
Template.memberSettings.helpers({
	/**
	* isOwnerDisabled
	* @summary
	* @return {Boolean}
	* @todo Documentar y Entender (Antes tuvo el parametro "shopId")
	*/
	isOwnerDisabled: function() {
		if (Meteor.userId() === this.userId) {
			if (Roles.userIsInRole(this.userId, 'owner', this.shopId)) {
				return true;
			}
		}
	},

	/**
	* hasPermissionChecked
	* @summary Verifica si el usuario tiene el permiso y retorna una clase CSS en caso afirmativo
	* @params {String} permission - permiso a consultar
	* @params {String} userId - userId del usuario a consultar
	* @return {String} CSS class en caso de tener el permiso
	* @todo Documentar y Entender
	*/
	hasPermissionChecked: function(permission, userId) {
		if (userId && (Roles.userIsInRole(userId, permission, this.shopId || Roles.userIsInRole(userId, permission, Roles.GLOBAL_GROUP)))) {
			return "text-primary checked";
		}
	},

	/**
	* hasPermissionChecked
	* @summary Verifica si el usuario tiene el permiso y retorna una clase CSS en caso afirmativo
	* @params {String} permission - permiso a consultar
	* @params {String} userId - userId del usuario a consultar
	* @return {String} CSS class en caso de tener el permiso
	* @todo Documentar y Entender
	*/
	hasPermissionCheckedIcon: function(permission, userId) {
		if (userId && (Roles.userIsInRole(userId, permission, this.shopId || Roles.userIsInRole(userId, permission, Roles.GLOBAL_GROUP)))) {
			return "fa-check-square-o";
		}
		else{
			return "fa-square-o";
		}
	},
	/**
	* groupsForUser
	* @summary Obtiene los grupos para el usuario
	* @params {String} userId - userId
	* @return {}
	* @todo Documentar y Entender
	*/
	groupsForUser: function(userId) {
		/* TODO: Que es esto "Template.parentData(1).userId" */
		userId = userId || this.userId || Template.parentData(1).userId;
		return Roles.getGroupsForUser(userId);
	},
	/**
	* shopLabel
	* @summary Obtiene el nombre de una "Shop"
	* @return {String} Nombre de la tienda
	* @todo Antes tuvo el parametro "shopId"
	*/
	shopLabel: function() {
		let _ref;
		_ref = EFrameworkCore.Collections.Shops.findOne({'_id': Template.currentData()});
		return _ref != null ? _ref.name : void 0;
	},

	/**
	* permissionGroups
	* @summary Obtiene todos los permission group que existen en la aplicación
	* @return {}
	* @todo Documentar y Entender (Antes tuvo el parametro "shopId")
	*/
	permissionGroups: function() {
		let permissionGroups;
		let shopId;
		let packages;
		permissionGroups = [];

		shopId = Template.currentData();

		/*Se recuperan todos los packages que existn para el shopId*/
		packages = EFrameworkCore.Collections.Packages.find({ 'shopId': shopId });

		packages.forEach(function (package) {
			let permissions = [];
			let permissionMap = {};

			if (package.enabled) {

				for (let i = 0; i < package.registry.length; i++) {
					let registryItem = package.registry[i];

					/*Skip si no tienen route*/
					if (!registryItem.route) {
						continue;
					}

					// Get all permissions, add them to an array
					/*Se obtienen todos los permisos para este registryItem*/
					if (registryItem.permissions) {
						_.each(registryItem.permissions, function (permission) {
							permission.shopId = shopId;
							permissions.push(permission);
						});
					}

					// Also create an object map of those same permissions as above
					_.each(permissions, function (existing) {
						permissionMap[existing.permission] = existing.label;
					});


					if (!permissionMap[registryItem.route]) {
						permissions.push({
							shopId: package.shopId,
							permission: registryItem.route,
							icon: registryItem.icon,
							label: registryItem.label || registryItem.provides || registryItem.route
						});
					}
				}

				/*Elimino la palabra eframework del package y utilizo o que queda del nombre, como nombre del package para la interfaz*/
				let label = package.name.replace('eframework', '').replace(/(-.)/g, function(x) {
					return " " + x[1].toUpperCase();
				});

				return permissionGroups.push({
					shopId: package.shopId,
					icon: package.icon,
					name: package.name,
					label: label,
					permissions: _.uniq(permissions)
				});
			}
		});

		return permissionGroups;
	},

	/**
	* hasManyPermissions
	* @summary Verifica si tiene mas de un permiso
	* @params {String[]} Array con permisos
	* @return {Boolean} True si tiene mas de un permiso
	*/
	hasManyPermissions: function (permissions) {
		return permissions.length > 1;
	}
});

/**
* Template.memberSettings.events
* @summary Events para Template.memberSettings
*/
Template.memberSettings.events({
	/**
	* @event change [data-event-action=toggleMemberPermission]
	* @summary Verifica si tiene mas de un permiso
	* @params {Event} event
	* @params {Blaze.TemplateInstance} template
	* @return {Boolean} True si tiene mas de un permiso
	* @todo Aun no distintgo la diferencia entre "template.data" y "this"
	*/
	"click [data-event-action=toggleMemberPermission]": function(event, template) {
		let member, permissions, self;
		self = this;
		permissions = [];
		member = template.data;
		if (!self.shopId) {
			throw new Meteor.Error("Shop is required");
		}
		if (self.name) {
			permissions.push(self.name);
			let _ref = self.permissions;
			for (let _i = 0  ; _i < _ref.length; _i++) {
				let pkgPermissions = _ref[_i];
				permissions.push(pkgPermissions.permission);
			}
		}
		else {
			permissions.push(self.permission);
		}

		/*Dependiendo del estado actual del botón es la acción que debo realizar*/
		//if ($(event.currentTarget).is(':checked')) {
		if (!$(event.currentTarget).hasClass('checked')) {
			//Agrego permiso al usuario
			Meteor.call("accounts/addUserPermissions", member.userId, permissions, self.shopId);
		}
		else {
			//Elimino permiso
			Meteor.call("accounts/removeUserPermissions", member.userId, permissions, self.shopId);
		}
	},
	/*TODO : Deprecado ??*/
//   "click [data-event-action=resetMemberPermission]": function(event, template) {
//     var $icon, index, role, _ref, _results;
//     $icon = $(event.currentTarget);
//     if (confirm($icon.data("confirm"))) {
//       _ref = template.data.roles;
//       _results = [];
//       for (role in _ref) {
//         index = _ref[role];
//         _results.push(Meteor.call("accounts/setUserPermissions", this.userId, ['guest', 'account/profile'], role));
//       }
//       return _results;
//     }
//   }
});
