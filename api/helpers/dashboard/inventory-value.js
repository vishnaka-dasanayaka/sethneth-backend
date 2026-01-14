const moment = require("moment");

module.exports = {
  friendlyName: "Inventory Value",

  description: "Get the inventry values buying and selling",

  inputs: {},

  fn: async function (inputs, exits) {
    var stocks = await Stock.find({ status: 2 });

    var buying_value = 0;
    var selling_value = 0;

    for (var item of stocks) {
      buying_value += item.available_no_of_units * item.buying_price;
      selling_value += item.available_no_of_units * item.selling_price;
    }

    // const today = moment();

    // const thisMonthStart = moment().startOf("month").toDate();
    // const thisMonthEnd = today.toDate();

    // const lastMonthStart = moment().subtract(1, "month").startOf("month");

    // const lastMonthEnd = moment()
    //   .subtract(1, "month")
    //   .startOf("month")
    //   .add(today.date() - 1, "days")
    //   .endOf("day")
    //   .toDate();

    // const thisMonthStock = await Stock.find({
    //   status: 2,
    //   created_on: { ">=": thisMonthStart, "<=": thisMonthEnd },
    // });

    // const lastMonthStock = await Stock.find({
    //   status: 2,
    //   created_on: { ">=": lastMonthStart.toDate(), "<=": lastMonthEnd },
    // });

    // var this_month_buying_value = 0;
    // var this_month_selling_value = 0;
    // var last_month_buying_value = 0;
    // var last_month_selling_value = 0;

    // for (var item of thisMonthStock) {
    //   this_month_buying_value += item.available_no_of_units * item.buying_price;
    //   this_month_selling_value +=
    //     item.available_no_of_units * item.selling_price;
    // }

    // for (var item of lastMonthStock) {
    //   last_month_buying_value += item.available_no_of_units * item.buying_price;
    //   last_month_selling_value +=
    //     item.available_no_of_units * item.selling_price;
    // }

    // // Trend logic
    // let buying_trend = "nochange";
    // let buying_percentage = 0;

    // if (last_month_buying_value === 0 && this_month_buying_value > 0) {
    //   buying_trend = "increase";
    //   buying_percentage = 100;
    // } else if (this_month_buying_value > last_month_buying_value) {
    //   buying_trend = "increase";
    //   buying_percentage =
    //     ((this_month_buying_value - last_month_buying_value) /
    //       last_month_buying_value) *
    //     100;
    // } else if (this_month_buying_value < last_month_buying_value) {
    //   buying_trend = "decrease";
    //   buying_percentage =
    //     ((last_month_buying_value - this_month_buying_value) /
    //       last_month_buying_value) *
    //     100;
    // }

    // buying_percentage = Number(buying_percentage.toFixed(2));

    // // Trend logic
    // let selling_trend = "nochange";
    // let selling_percentage = 0;

    // if (last_month_buying_value === 0 && this_month_buying_value > 0) {
    //   selling_trend = "increase";
    //   selling_percentage = 100;
    // } else if (this_month_buying_value > last_month_buying_value) {
    //   selling_trend = "increase";
    //   selling_percentage =
    //     ((this_month_buying_value - last_month_buying_value) /
    //       last_month_buying_value) *
    //     100;
    // } else if (this_month_buying_value < last_month_buying_value) {
    //   selling_trend = "decrease";
    //   selling_percentage =
    //     ((last_month_buying_value - this_month_buying_value) /
    //       last_month_buying_value) *
    //     100;
    // }

    // selling_percentage = Number(selling_percentage.toFixed(2));

    return exits.success({
      buying_value: buying_value,
      selling_value: selling_value,
    });
  },
};
