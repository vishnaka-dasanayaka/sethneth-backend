/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  "GET /": { action: "view-homepage-or-redirect" },
  "GET /welcome/:unused?": { action: "dashboard/view-welcome" },

  "GET /faq": { action: "view-faq" },
  "GET /legal/terms": { action: "legal/view-terms" },
  "GET /legal/privacy": { action: "legal/view-privacy" },
  "GET /contact": { action: "view-contact" },

  "GET /signup": { action: "entrance/view-signup" },
  "GET /email/confirm": { action: "entrance/confirm-email" },
  "GET /email/confirmed": { action: "entrance/view-confirmed-email" },

  "GET /login": { action: "entrance/view-login" },
  "GET /password/forgot": { action: "entrance/view-forgot-password" },
  "GET /password/new": { action: "entrance/view-new-password" },

  "GET /account": { action: "account/view-account-overview" },
  "GET /account/password": { action: "account/view-edit-password" },
  "GET /account/profile": { action: "account/view-edit-profile" },

  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  "/terms": "/legal/terms",
  "/logout": "/api/v1/account/logout",

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  "/api/v1/account/logout": { action: "account/logout" },
  "PUT   /api/v1/account/update-password": {
    action: "account/update-password",
  },
  "PUT   /api/v1/account/update-profile": { action: "account/update-profile" },
  "PUT   /api/v1/account/update-billing-card": {
    action: "account/update-billing-card",
  },
  "PUT   /api/v1/entrance/login": { action: "entrance/login" },
  "POST  /api/v1/entrance/signup": { action: "entrance/signup" },
  "POST  /api/v1/entrance/send-password-recovery-email": {
    action: "entrance/send-password-recovery-email",
  },
  "POST  /api/v1/entrance/update-password-and-login": {
    action: "entrance/update-password-and-login",
  },
  "POST  /api/v1/deliver-contact-form-message": {
    action: "deliver-contact-form-message",
  },
  "POST  /api/v1/observe-my-session": {
    action: "observe-my-session",
    hasSocketFeatures: true,
  },

  // SETH NETH

  "/": {},

  // user endpoints
  "POST /api/v1/settings/user/login": {
    action: "settings/user/login",
  },
  "GET /api/v1/settings/user/validate-logged-in": {
    action: "settings/user/validate-logged-in",
  },

  // settings

  // supplier
  "POST /api/v1/settings/supplier/create-supplier": {
    action: "settings/supplier/create-supplier",
  },

  "POST /api/v1/settings/supplier/get-all-paged-suppliers": {
    action: "settings/supplier/get-all-paged-suppliers",
  },

  "POST /api/v1/settings/supplier/get-purchase-orders-per-supplier": {
    action: "settings/supplier/get-purchase-orders-per-supplier",
  },

  "GET /api/v1/settings/supplier/:id": {
    action: "settings/supplier/get-supplier",
  },

  "PATCH /api/v1/settings/supplier/update-status": {
    action: "settings/supplier/update-status",
  },

  "GET /api/v1/settings/supplier/get-active-suppliers": {
    action: "settings/supplier/get-active-suppliers",
  },

  // stock
  "POST /api/v1/settings/stock/create-purchase-order": {
    action: "settings/stock/create-purchase-order",
  },

  "POST /api/v1/settings/stock/get-all-paged-purchase-orders": {
    action: "settings/stock/get-all-paged-purchase-orders",
  },

  "POST /api/v1/settings/stock/get-purchase-order": {
    action: "settings/stock/get-purchase-order",
  },

  "PATCH /api/v1/settings/stock/update-po-status": {
    action: "settings/stock/update-po-status",
  },

  "POST /api/v1/settings/stock/create-category": {
    action: "settings/stock/create-category",
  },

  "POST /api/v1/settings/stock/get-all-paged-categories": {
    action: "settings/stock/get-all-paged-categories",
  },

  "PATCH /api/v1/settings/stock/update-category-status": {
    action: "settings/stock/update-category-status",
  },

  "POST /api/v1/settings/stock/create-brand": {
    action: "settings/stock/create-brand",
  },

  "GET /api/v1/settings/stock/get-active-categories": {
    action: "settings/stock/get-active-categories",
  },

  "GET /api/v1/settings/stock/get-active-brands": {
    action: "settings/stock/get-active-brands",
  },

  "POST /api/v1/settings/stock/get-all-paged-brands": {
    action: "settings/stock/get-all-paged-brands",
  },

  "POST /api/v1/settings/stock/create-model": {
    action: "settings/stock/create-model",
  },

  "POST /api/v1/settings/stock/create-stock": {
    action: "settings/stock/create-stock",
  },

  "POST /api/v1/settings/stock/get-all-paged-models": {
    action: "settings/stock/get-all-paged-models",
  },

  "POST /api/v1/settings/stock/get-all-paged-stocks": {
    action: "settings/stock/get-all-paged-stocks",
  },

  "POST /api/v1/settings/stock/get-active-brands-per-category": {
    action: "settings/stock/get-active-brands-per-category",
  },

  "POST /api/v1/settings/stock/get-active-models-per-brand": {
    action: "settings/stock/get-active-models-per-brand",
  },

  "POST /api/v1/settings/stock/get-active-po-per-supplier": {
    action: "settings/stock/get-active-po-per-supplier",
  },

  "POST /api/v1/settings/stock/get-stock": {
    action: "settings/stock/get-stock",
  },

  "PATCH /api/v1/settings/stock/update-stock-status": {
    action: "settings/stock/update-stock-status",
  },
};
