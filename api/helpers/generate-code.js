module.exports = {
  friendlyName: "Generate code",

  description: "",

  inputs: {
    type: {
      required: true,
      type: "string"
    },
    prefix: {
      allowNull: true,
      type: "string"
    },
    suffix: {
      allowNull: true,
      type: "string"
    }
  },

  exits: {
    success: {
      description: "All done."
    }
  },

  fn: async function(inputs, exits) {
    // TODO
    var current_type_data = await CodeIncremental.findOne({ type: inputs.type });
    var current_no = current_type_data.current_no;

    if (current_no < 9999) {
      var generatedid = ("000" + Number(current_no)).slice(-4);
    } else {
      var generatedid = Number(current_no);
    }

    var code = generatedid;

    if (inputs.prefix != null) {
      code = inputs.prefix + code;
    }
    if (inputs.suffix != null) {
      code = code + inputs.suffix;
    }

    var new_no = current_no + 1;
    // update current value
    await CodeIncremental.update({ id: current_type_data.id }).set({ current_no: new_no });

    return exits.success(code);
  }
};
