module.exports = {
  friendlyName: "Add Lat and Long",

  description: "",

  inputs: {
    branch_id: {
      type: "number",
      required: true,
    },
    lat: {
      type: "number",
      required: true,
    },
    long: {
      type: "number",
      required: true,
    },
    rad: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var branch = await Branch.findOne({ id: inputs.branch_id });

      if (!branch) {
        return exits.success({
          status: false,
          err: "Branch Not Found",
        });
      }

      await Branch.updateOne({ id: branch.id }).set({
        latitude: inputs.lat,
        longitude: inputs.long,
        radius: inputs.rad,
      });

      return exits.success({
        status: true,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/patiets/get-all-active-branches",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
