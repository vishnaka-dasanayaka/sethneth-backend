module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    branch_name: {
      required: true,
      type: "string",
    },
    email: {
      type: "string",
      allowNull: true,
    },
    phone: {
      required: true,
      type: "string",
    },
    type: {
      required: true,
      type: "string",
    },
    contact_person: {
      required: true,
      type: "number",
    },
    branch_manager: {
      required: true,
      type: "number",
    },
    address: {
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
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      let existing_name = null;

      if (inputs.branch_name !== null && inputs.branch_name !== undefined) {
        existing_name = await Branch.findOne({ name: inputs.branch_name });
      }

      if (existing_name) {
        return exits.success({
          status: false,
          err: "A Branch found with same name",
        });
      }

      var prefix = "BR-";

      var generatedid = await sails.helpers.generateCode("BR", prefix);

      if (inputs.email == "" || inputs.email == undefined) {
        inputs.email = null;
      }

      var branch = await Branch.create({
        code: generatedid,
        name: inputs.branch_name,
        type: inputs.type,
        phone: inputs.phone,
        email: inputs.email,
        address: inputs.address,
        contact_person: inputs.contact_person,
        branch_manager: inputs.branch_manager,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a branch of ID :" + branch.id + " - " + branch.code,
      });

      return exits.success({
        status: true,
        branch: branch,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/branch/create-branch",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
