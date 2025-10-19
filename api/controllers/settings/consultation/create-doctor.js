module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    name: {
      required: true,
      type: "string",
    },
    fee: {
      required: true,
      type: "number",
    },

    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      let existing_doctor = null;

      if (inputs.name !== null && inputs.name !== undefined) {
        existing_doctor = await Doctor.findOne({
          name: inputs.name,
        });
      }

      if (existing_doctor) {
        return exits.success({
          status: false,
          err: "A DOctor find with the same name",
        });
      }

      var doctor = await Doctor.create({
        name: inputs.name,
        fee: inputs.fee,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a doctor of ID :" + doctor.id,
      });

      return exits.success({
        status: true,
        doctor: doctor,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/consultation/create-doctor",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
