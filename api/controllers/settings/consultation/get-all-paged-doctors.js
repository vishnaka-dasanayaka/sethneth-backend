module.exports = {
  friendlyName: "Get all paged doctors",

  description: "",

  inputs: {
    offset: {
      required: true,
      type: "number",
    },
    rows: {
      required: true,
      type: "number",
    },
    event: {
      required: true,
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    var offset = inputs.event.first;
    var rows = inputs.event.rows;

    // sorting
    var order_by = " t1.id ";
    if (inputs.event.sortField == "name") {
      order_by = " t1.name ";
    } else if (inputs.event.sortField == "status") {
      order_by = " t1.status ";
    } else if (inputs.event.sortField == "fee") {
      order_by = " t1.fee ";
    }

    var order_method = " ASC ";
    if (inputs.event.sortOrder == -1) {
      order_method = " DESC ";
    }

    var global_search_filter = "";
    if (inputs.event.filters.global) {
      if (inputs.event.filters.global.matchMode == "contains") {
        var search_text = inputs.event.filters.global.value;
        global_search_filter =
          "  WHERE (t1.name LIKE '%" + search_text + "%') ";
      }
    }

    var doctors_sql =
      "SELECT t1.* from doctors t1 " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var doctors = await sails.sendNativeQuery(doctors_sql);
    doctors = doctors.rows;

    var doctors_count_sql =
      "SELECT COUNT(*) as no_of_doctors from doctors t1 " +
      global_search_filter;

    var no_of_doctors = await sails.sendNativeQuery(doctors_count_sql);
    no_of_doctors = no_of_doctors.rows[0].no_of_doctors;

    return exits.success({
      doctors: doctors,
      no_of_doctors: no_of_doctors,
    });
  },
};
