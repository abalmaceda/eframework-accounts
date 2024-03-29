


Meteor.methods({
  "accounts/updateServiceConfiguration": (service, fields) => {

    check(service, String);
    check(fields, Array);

    var dataToSave = {};

    _.each(fields, function(field) {
      dataToSave[field.property] = field.value
    });

    if (EFrameworkCore.hasPermission(["dashboard/accounts"])) {
      return ServiceConfiguration.configurations.upsert({
        service: service
      }, {
        $set: dataToSave
      });
    }

    return false;
  }

})
