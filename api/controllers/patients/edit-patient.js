const moment = require("moment");

module.exports = {
  friendlyName: "Add Patient",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    phone: {
      type: "string",
      allowNull: true,
    },
    gender: {
      type: "string",
      allowNull: true,
    },
    dob: {
      type: "ref",
    },
    nic: {
      type: "string",
      allowNull: true,
    },
    address: {
      type: "string",
      allowNull: true,
    },
    description: {
      type: "string",
      allowNull: true,
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

      let existing_patient = null;

      if (inputs.name !== null && inputs.name !== undefined) {
        existing_patient = await Patient.findOne({
          name: inputs.name,
          id: { "!=": inputs.id },
        });
      }

      if (existing_patient) {
        return exits.success({
          status: false,
          err: "A Patient find with the same name",
        });
      }

      let existing_nic = null;

      if (inputs.nic !== null && inputs.nic !== undefined) {
        existing_nic = await Patient.findOne({
          nic: inputs.nic,
          id: { "!=": inputs.id },
        });
      }

      if (existing_nic) {
        return exits.success({
          status: false,
          err: "A Patient find with the same NIC",
        });
      }

      // let existing_phone = null;

      // if (inputs.phone !== null && inputs.phone !== undefined) {
      //   existing_phone = await Patient.findOne({
      //     phone: inputs.phone,
      //     id: { "!=": inputs.id },
      //   });
      // }

      // if (existing_phone) {
      //   return exits.success({
      //     status: false,
      //     err: "A Patient find with the same Contact No",
      //   });
      // }

      if (inputs.dob) {
        var dob = await moment(inputs.dob).utc().format("YYYY-MM-DD");
      } else {
        dob = null;
      }

      await Patient.updateOne({ id: inputs.id }).set({
        name: inputs.name,
        phone: inputs.phone,
        gender: inputs.gender,
        dob: dob,
        nic: inputs.nic,
        address: inputs.address,
        description: inputs.description,
      });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Updated a patient of ID :" + inputs.id,
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
        path: "api/v1/patients/edit-patient",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
