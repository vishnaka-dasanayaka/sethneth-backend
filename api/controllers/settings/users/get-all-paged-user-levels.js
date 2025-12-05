module.exports = {
  friendlyName: "Get all paged user_levels",

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
    if (inputs.event.sortField == "user_level") {
      order_by = " t1.rolename ";
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
          "  WHERE (t1.rolename LIKE '%" + search_text + "%') ";
      }
    }

    var user_levels_sql =
      "SELECT t1.* from user_roles t1 " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var user_levels = await sails.sendNativeQuery(user_levels_sql);
    user_levels = user_levels.rows;

    var clients_count_sql =
      "SELECT COUNT(*) as no_of_user_levels from user_roles t1 " +
      global_search_filter;

    var user_levels_count = await sails.sendNativeQuery(clients_count_sql);
    user_levels_count = user_levels_count.rows[0].no_of_user_levels;

    return exits.success({
      user_levels: user_levels,
      no_of_user_levels: user_levels_count,
    });
  },
};
