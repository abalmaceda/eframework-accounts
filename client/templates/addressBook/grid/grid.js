/* TODO */

/*
 * handles display of addressBook grid
 */
 /* TODO */
Template.addressBookGrid.helpers({
  /* TODO */
  selectedBilling: function () {
    let cart = EFrameworkCore.Collections.Cart.findOne({
      userId: Meteor.userId()
    });

    if (cart) {
      if (cart.billing) {
        if (cart.billing[0].address) {
          if (this._id === cart.billing[0].address._id) {
            return "active";
          }
        }
      }
    }
  },
/* TODO */
  selectedShipping: function () {
    let cart = EFrameworkCore.Collections.Cart.findOne({
      userId: Meteor.userId()
    });

    if (cart) {
      if (cart.shipping) {
        if (cart.shipping[0].address) {
          if (this._id === cart.shipping[0].address._id) {
            return "active";
          }
        }
      }
    }
  },
  /* TODO */
  account: function () {
    return EFrameworkCore.Collections.Accounts.findOne({
      userId: Meteor.userId()
    });
  }
});

/*
 * events
 */
/* TODO */
Template.addressBookGrid.events({
  /* TODO */
  "click [data-event-action=selectShippingAddress]": function () {
    let cart = EFrameworkCore.Collections.Cart.findOne({
      userId: Meteor.userId()
    });
    return Meteor.call("cart/setShipmentAddress", cart._id, this);
  },
  /* TODO */
  "click [data-event-action=selectBillingAddress]": function () {
    let cart = EFrameworkCore.Collections.Cart.findOne({
      userId: Meteor.userId()
    });
    return Meteor.call("cart/setPaymentAddress", cart._id, this);
  }
});
