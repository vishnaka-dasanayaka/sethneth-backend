const moment = require("moment");

module.exports = {
  friendlyName: "Monthly trend",

  description: "Compare this month vs same period last month",

  inputs: {
    model: {
      type: "ref",
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    const model = inputs.model.model;
    const where = inputs.model.where;
    const dateField = inputs.model.dateField;

    const Model = sails.models[model.toLowerCase()];

    const today = moment();

    const thisMonthStart = moment().startOf("month").toDate();
    const thisMonthEnd = today.toDate();

    const lastMonthStart = moment().subtract(1, "month").startOf("month");

    const lastMonthEnd = moment()
      .subtract(1, "month")
      .startOf("month")
      .add(today.date() - 1, "days")
      .endOf("day")
      .toDate();

    if (model.toLowerCase() === "invoice") {
      where.type = "CONS";
    }

    const thisMonthWhere = {
      ...where,
      [dateField]: {
        ">=": thisMonthStart,
        "<=": thisMonthEnd,
      },
    };

    const lastMonthWhere = {
      ...where,
      [dateField]: {
        ">=": lastMonthStart.toDate(),
        "<=": lastMonthEnd,
      },
    };

    const thisMonthCount = await Model.count(thisMonthWhere);
    const lastMonthCount = await Model.count(lastMonthWhere);

    // Trend logic
    let trend = "nochange";
    let percentage = 0;

    if (lastMonthCount === 0 && thisMonthCount > 0) {
      trend = "increase";
      percentage = 100;
    } else if (thisMonthCount > lastMonthCount) {
      trend = "increase";
      percentage = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
    } else if (thisMonthCount < lastMonthCount) {
      trend = "decrease";
      percentage = ((lastMonthCount - thisMonthCount) / lastMonthCount) * 100;
    }

    percentage = Number(percentage.toFixed(2));

    return exits.success({
      last_month: lastMonthCount,
      this_month: thisMonthCount,
      trend,
      percentage,
    });
  },
};
