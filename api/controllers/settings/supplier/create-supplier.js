module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    contact_person: {
      required: true,
      type: "string",
    },
    email: {
      type: "string",
      required: true,
    },
    phone: {
      required: true,
      type: "string",
    },
    supplier_name: {
      required: true,
      type: "string",
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var uniqueRequest = await UniqueReq.create({
        uniquecheck: inputs.uniquekey,
      }).intercept("E_UNIQUE", () => {
        return exits.OtherError({
          status: false,
          err: "Request already completed. Please Refresh",
        });
      });

      let existing_email = null;

      if (inputs.email !== null && inputs.email !== undefined) {
        existing_email = await Supplier.findOne({ email: inputs.email });
      }

      if (existing_email) {
        return exits.success({
          status: false,
          err: "A Supplier found with same primary email address",
        });
      }

      var prefix = "SUP";

      var generatedid = await sails.helpers.generateCode(
        (inputs.type = "SUP"),
        prefix
      );

      var supplier = await Supplier.create({
        code: generatedid,
        name: inputs.supplier_name,
        contact_person: inputs.contact_person,
        phone: inputs.phone,
        email: inputs.email,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Created a supplier of ID :" +
          supplier.id +
          " - " +
          supplier.client_code,
      });

      return exits.success({
        status: true,
        supplier: supplier,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/create-supplier",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
