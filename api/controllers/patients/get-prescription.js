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
      var pres = await Prescription.findOne({
        id: inputs.id,
      });

      if (!pres) {
        return exits.success({
          status: false,
          err: "Prescription not found",
        });
      }

      var pres_data = await PrescriptionData.findOne({ pres_id: inputs.id });

      return exits.success({
        status: true,
        pres_data: pres_data,
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
