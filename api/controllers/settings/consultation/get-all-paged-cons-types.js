module.exports = {
  friendlyName: "Get all paged consultation types",

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

    var cons_type_sql =
      "SELECT t1.* from consultation_types t1 " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var consultation_types = await sails.sendNativeQuery(cons_type_sql);
    consultation_types = consultation_types.rows;

    var lenses_count_sql =
      "SELECT COUNT(*) as no_of_cons_types from consultation_types t1 " +
      global_search_filter;

    var no_of_cons_types = await sails.sendNativeQuery(lenses_count_sql);
    no_of_cons_types = no_of_cons_types.rows[0].no_of_cons_types;

    return exits.success({
      consultation_types: consultation_types,
      no_of_cons_types: no_of_cons_types,
    });
  },
};
