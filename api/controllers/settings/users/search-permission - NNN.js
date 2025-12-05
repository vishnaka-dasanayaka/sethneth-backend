module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    keyword: {
      allowNull: true,
      type: "string",
    },
    category: {
      allowNull: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var category_filter = " TRUE ";
      var keyword_filter = " TRUE ";

      if (inputs.keyword != "") {
        keyword_filter = 'perm_desc LIKE "%' + inputs.keyword + '%"';
      }

      if (inputs.category != "") {
        category_filter = 'perm_category = "' + inputs.category + '"';
      }

      var search_sql =
        "SELECT * FROM permission_settings t1 WHERE " +
        keyword_filter +
        " AND " +
        category_filter +
        " ORDER BY t1.perm_category ASC, t1.perm_desc ASC";

      var data = await sails.sendNativeQuery(search_sql);
      data = data.rows;

      var user_permission = [this.groupByCategory(data)];

      return exits.success({
        status: true,
        user_permission: user_permission,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-user",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },

  groupByCategory(data) {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.perm_category]) {
        acc[item.perm_category] = [];
      }
      acc[item.perm_category].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((category) => ({
      category: category,
      rows: grouped[category],
    }));
  },
};
