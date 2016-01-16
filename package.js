Package.describe({
	summary: "E-Framework Accounts - Authentication UI for E-Framework Commerce",
	name: "eframework:eframework-accounts",
	version: "1.2.3",
	git: ""
});


/**
 * @summary Define dependencies and expose package methods
 * @param {function} A function that takes in the package control api object, which keeps track of dependencies and exports.
 * @description Esta función es parte del API de Meteor
 * @see {@link http://docs.meteor.com/#/full/packagedescription|METEOR}
 * @todo Documentar
 */
Package.onUse(function (api) {

	/**
	 * @summary Use versions of core packages from a release.
	 * @description Esta función es parte del API de Meteor
	 * @see {@link http://docs.meteor.com/#/full/pack_versions|METEOR}
	 * @todo Documentar
	 */
	api.versionsFrom("METEOR@1.2");

	/**
	 * @summary Depend on package packagename.
	 * @param {String|Strings[]} A function that takes in the package control api object, which keeps track of dependencies and exports.
	 * @description Esta función es parte del API de Meteor
	 * @see {@link http://docs.meteor.com/#/full/pack_versions|METEOR}
	 * @todo Documentar
	 */
	// meteor base packages
	api.use("standard-minifiers");
	api.use("mobile-experience");
	api.use("meteor-base");
	api.use("mongo");
	api.use("blaze-html-templates");
	api.use("session");
	api.use("jquery");
	api.use("tracker");
	api.use("logging");
	api.use("reload");
	api.use("random");
	api.use("ejson");
	api.use("spacebars");
	api.use("check");
	api.use("ecmascript");

	// meteor add-on packages
	api.use("less");
	api.use("email");
	api.use("random");
	api.use("reactive-var");
	api.use("reactive-dict");

	/*
	* @summary Encrypt account secrets stored in the database
	* @see {@link https://atmospherejs.com/meteor/oauth-encryption|ATMOSPHERE}
	*/
	api.use("oauth-encryption");
	api.use("accounts-base");
	api.use("accounts-password");
	api.use("accounts-oauth");
	api.use("accounts-facebook");
	api.use("accounts-google");

	api.use("accounts-twitter");
	api.use("accounts-github");
	api.use("accounts-weibo");
	api.use("eframework:eframework-core");


  // Files
  api.addFiles("common/schemas/accounts.js");

  // // accounts
  api.addFiles("server/accounts.js", "server");
  api.addFiles("server/policy.js", "server");
   api.addFiles("common/factories/accounts.js");
  api.addFiles("server/publications/accounts.js", "server");
  api.addFiles("server/methods/serviceConfiguration.js", "server");


  // // Core Reaction packages
  // // register as a reaction package
   api.addFiles("server/register.js", "server");
 api.addFiles("server/methods/accounts.js", "server");
  api.addFiles("server/publications/serviceConfiguration.js", "server");
  api.addFiles("server/publications/members.js", "server");

   api.addFiles("common/routing.js", ["client", "server"]);

  	//TODO : revizar
	api.addFiles("client/helpers/util.js", ["client", "server"]);
	//TODO : revizar
	api.addFiles("client/helpers/validation.js", "client");
	//TODO : revizar
	api.addFiles("client/helpers/helpers.js", "client");
	//TODO : revizar
	api.addFiles("client/helpers/subscriptions.js", "client");

  // Dashboard
	api.addFiles("client/templates/dashboard/dashboard.html", "client");
	api.addFiles("client/templates/dashboard/dashboard.js", "client");

	api.addFiles("client/templates/members/member.html", "client");
	api.addFiles("client/templates/members/member.js", "client");
	api.addFiles("client/templates/members/memberForm/memberForm.html", "client");
	api.addFiles("client/templates/members/memberForm/memberForm.js", "client");

  // User profile
  api.addFiles("client/templates/profile/profile.html", "client");
  api.addFiles("client/templates/profile/profile.js", "client");

  // // Address Book
	api.addFiles("client/templates/addressBook/addressBook.html", "client");
	api.addFiles("client/templates/addressBook/addressBook.js", "client");

	api.addFiles("client/templates/addressBook/add/addressBookAdd.html", "client");
	api.addFiles("client/templates/addressBook/add/addressBookAdd.js", "client");

	api.addFiles("client/templates/addressBook/edit/addressBookEdit.html", "client");
	api.addFiles("client/templates/addressBook/edit/addressBookEdit.js", "client");

	api.addFiles("client/templates/addressBook/form/addressBookForm.html", "client");
	api.addFiles("client/templates/addressBook/form/addressBookForm.js", "client");

	api.addFiles("client/templates/addressBook/grid/addressBookGrid.html", "client");
	api.addFiles("client/templates/addressBook/grid/addressBookGrid.js", "client");

  // // core login form and generic templates
	api.addFiles("client/templates/login/loginForm.html", "client");
	api.addFiles("client/templates/login/loginButtons.html", "client");
	api.addFiles("client/templates/login/loginForm.less", "client");
	api.addFiles("client/templates/login/loginForm.js", "client");

	// sign in
	api.addFiles("client/templates/signIn/signIn.html", "client");
	api.addFiles("client/templates/signIn/signIn.js", "client");

	// sign up
	api.addFiles("client/templates/signUp/signUp.html", "client");
	api.addFiles("client/templates/signUp/signUp.js", "client");

	// reset password
	api.addFiles("client/templates/forgot/forgot.html", "client");
	api.addFiles("client/templates/forgot/forgot.js", "client");

  // // Update password views
  api.addFiles("client/templates/updatePassword/updatePassword.html", "client");
  api.addFiles("client/templates/updatePassword/updatePassword.js", "client");

	api.addFiles("client/templates/accounts.html", "client");

  // api.addFiles("client/templates/inline/inline.html", "client");
  // api.addFiles("client/templates/inline/inline.js", "client");

	api.addFiles("client/templates/dropdown/dropdown.html", "client");
	api.addFiles("client/templates/dropdown/dropdown.js", "client");

  // // Email Templates
  // api.addAssets("server/emailTemplates/welcomeNotification.html", "server");
  // api.addAssets("server/emailTemplates/shopMemberInvite.html", "server");
});

Package.onTest(function (api) {
  // api.use("sanjo:jasmine@0.18.0");
  // api.use("ecmascript");
  // api.use("jquery");
  // api.use("underscore");
  // api.use("dburles:factory@0.3.10");
  // api.use("velocity:html-reporter@0.8.2");
  // api.use("velocity:console-reporter@0.1.3");

  // api.use("eframework:eframework-accounts");

  // api.addFiles("tests/jasmine/client/integration/login.js", "client");
});
