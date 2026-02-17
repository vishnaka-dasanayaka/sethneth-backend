module.exports = {
  friendlyName: "Validate logged in",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    var id = this.req.token.id;

    var userRecord = await User.findOne({ id: id })
      .populate("perm_list")
      .populate("branch");

    var userlevel = await UserRole.findOne({ id: userRecord.userlevel });

    userRecord.rolename = userlevel.rolename;
    if (!userRecord) {
      return exits.success({
        status: false,
      });
    } else {
      //codevus settings
      // var codevus_settings = await CodevusSettings.find();
      // userRecord.codevus_settings = codevus_settings;
      // //app settings
      // var app_settings = await sails.helpers.appSettings(this.req);
      // userRecord.app_settings = app_settings;

      // //app settings
      // var table_settings = await sails.helpers.tableSettings(id);
      // userRecord.table_settings = table_settings;

      // //production flag

      // var production_active = await sails.helpers.isProductionActive();

      // userRecord.production_active = production_active;

      // //production flag

      // var vehicle_module_active = await sails.helpers.isVehicleModuleActive();

      // userRecord.vehicle_module_active = vehicle_module_active;
      return exits.success(userRecord);
    }
  },
};
