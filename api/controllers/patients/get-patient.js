const moment = require("moment");

module.exports = {
  friendlyName: "Get Patient",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var patient = await Patient.findOne({
        id: inputs.id,
      })
      .populate("created_by");

      if (!patient) {
        return exits.success({
          status: false,
          err: "Patient is not found",
        });
      }

      return exits.success({
        status: true,
        patient: patient,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/patient/create-purchase-order",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
