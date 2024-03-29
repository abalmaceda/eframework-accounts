/* TODO */

/**
* EFrameworkCore Schemas Email
*/

// EFrameworkCore.Schemas.Email = new SimpleSchema({
//   provides: {
//     type: String,
//     defaultValue: "default",
//     optional: true
//   },
//   address: {
//     type: String,
//     regEx: SimpleSchema.RegEx.Email
//   },
//   verified: {
//     type: Boolean,
//     defaultValue: false,
//     optional: true
//   }
// });

/**
* EFrameworkCore Schemas Address
*/

// EFrameworkCore.Schemas.Address = new SimpleSchema({
//   _id: {
//     type: String,
//     defaultValue: Random.id(),
//     optional: true
//   },
//   fullName: {
//     type: String,
//     label: "Full name"
//   },
//   address1: {
//     label: "Address 1",
//     type: String
//   },
//   address2: {
//     label: "Address 2",
//     type: String,
//     optional: true
//   },
//   city: {
//     type: String,
//     label: "City"
//   },
//   company: {
//     type: String,
//     label: "Company",
//     optional: true
//   },
//   phone: {
//     type: String,
//     label: "Phone"
//   },
//   region: {
//     label: "State/Province/Region",
//     type: String
//   },
//   postal: {
//     label: "ZIP/Postal Code",
//     type: String
//   },
//   country: {
//     type: String,
//     label: "Country"
//   },
//   isCommercial: {
//     label: "This is a commercial address.",
//     type: Boolean
//   },
//   isBillingDefault: {
//     label: "Make this your default billing address?",
//     type: Boolean
//   },
//   isShippingDefault: {
//     label: "Make this your default shipping address?",
//     type: Boolean
//   },
//   metafields: {
//     type: [EFrameworkCore.Schemas.Metafield],
//     optional: true
//   }
// });

/**
* EFrameworkCore Schemas Accounts
*/

EFrameworkCore.Schemas.Accounts = new SimpleSchema({
  "userId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    label: "Accounts ShopId"
  },
  "sessions": {
    type: [String],
    optional: true,
    index: 1
  },
  "shopId": {
    type: String,
    autoValue: EFrameworkCore.shopIdAutoValue,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  },
  "emails": {
    type: [EFrameworkCore.Schemas.Email],
    optional: true
  },
  "acceptsMarketing": {
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  "state": {
    type: String,
    defaultValue: "new",
    optional: true
  },
  "note": {
    type: String,
    optional: true
  },
  "profile": {
    type: Object,
    optional: true
  },
  "profile.addressBook": {
    type: [EFrameworkCore.Schemas.Address],
    optional: true
  },
  "metafields": {
    type: [EFrameworkCore.Schemas.Metafield],
    optional: true
  },
  "createdAt": {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    }
  },
  "updatedAt": {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return {
          $set: new Date
        };
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    optional: true
  }
});


/**
* EFrameworkCore Collections Accounts
*/
EFrameworkCore.Collections.Accounts = new Mongo.Collection("Accounts");

EFrameworkCore.Collections.Accounts.attachSchema(EFrameworkCore.Schemas.Accounts);
