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
  "GET /api/v1/settings/user/get-user-levels": {
    action: "settings/user/get-user-levels",
  },

  // settings

  // users

  "POST /api/v1/settings/users/get-paged-users": {
    action: "settings/users/get-paged-users",
  },
  "POST /api/v1/settings/users": {
    action: "settings/users/create-user",
  },
  "GET /api/v1/settings/users/:id": {
    action: "settings/users/get-user",
  },
  "PATCH /api/v1/settings/users/update-user-status": {
    action: "settings/users/update-user-status",
  },
  "GET /api/v1/settings/users/get-user-levels": {
    action: "settings/users/get-user-levels",
  },
  "POST /api/v1/settings/users/get-all-paged-user-levels": {
    action: "settings/users/get-all-paged-user-levels",
  },
  "POST /api/v1/settings/users/create-user-level": {
    action: "settings/users/create-user-level",
  },

  "POST /api/v1/settings/users/get-permission-by-userlevel": {
    action: "settings/users/get-permission-by-userlevel",
  },

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

  "PATCH /api/v1/settings/stock/update-brand-status": {
    action: "settings/stock/update-brand-status",
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

  "GET /api/v1/settings/stock/get-all-active-models-with-stock": {
    action: "settings/stock/get-all-active-models-with-stock",
  },
  "GET /api/v1/settings/stock/get-all-active-lenses": {
    action: "settings/stock/get-all-active-lenses",
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

  "POST /api/v1/settings/stock/create-lense": {
    action: "settings/stock/create-lense",
  },

  "POST /api/v1/settings/stock/get-all-paged-lenses": {
    action: "settings/stock/get-all-paged-lenses",
  },

  "PATCH /api/v1/settings/stock/update-lense-status": {
    action: "settings/stock/update-lense-status",
  },

  // patient routes

  "POST /api/v1/patients/create-patient": {
    action: "patients/create-patient",
  },

  "POST /api/v1/patients/edit-patient": {
    action: "patients/edit-patient",
  },

  "POST /api/v1/patients/get-all-paged-patients": {
    action: "patients/get-all-paged-patients",
  },

  "POST /api/v1/patients/get-patient": {
    action: "patients/get-patient",
  },

  "PATCH /api/v1/patients/update-patient-status": {
    action: "patients/update-patient-status",
  },

  "GET /api/v1/patients/get-all-active-patients": {
    action: "patients/get-all-active-patients",
  },

  "POST /api/v1/patients/create-prescription": {
    action: "patients/create-prescription",
  },

  "POST /api/v1/patients/get-prescriptions-per-patient": {
    action: "patients/get-prescriptions-per-patient",
  },

  "POST /api/v1/patients/get-prescription": {
    action: "patients/get-prescription",
  },

  // Branches

  "GET /api/v1/branches/get-all-active-branches": {
    action: "branches/get-all-active-branches",
  },

  // Payments
  "POST /api/v1/payments/create-payment": {
    action: "payments/create-payment",
  },

  "POST /api/v1/payments/get-all-paged-payments": {
    action: "payments/get-all-paged-payments",
  },

  "POST /api/v1/payments/get-payment": {
    action: "payments/get-payment",
  },

  "PATCH /api/v1/payments/update-payment-status": {
    action: "payments/update-payment-status",
  },

  // Orders
  "POST /api/v1/orders/create-order": {
    action: "orders/create-order",
  },

  "POST /api/v1/orders/edit-order": {
    action: "orders/edit-order",
  },

  "POST /api/v1/orders/get-all-paged-orders": {
    action: "orders/get-all-paged-orders",
  },

  "POST /api/v1/orders/get-order": {
    action: "orders/get-order",
  },

  "POST /api/v1/orders/get-lense-list": {
    action: "orders/get-lense-list",
  },

  "POST /api/v1/orders/get-workflow-log": {
    action: "orders/get-workflow-log",
  },

  "PATCH /api/v1/orders/update-order-status": {
    action: "orders/update-order-status",
  },

  "POST /api/v1/orders/generate-invoice": {
    action: "orders/generate-invoice",
  },

  // Invoices

  "POST /api/v1/invoices/get-all-paged-invoices": {
    action: "invoices/get-all-paged-invoices",
  },

  "POST /api/v1/invoices/get-invoice": {
    action: "invoices/get-invoice",
  },

  "POST /api/v1/invoices/get-invoice-items": {
    action: "invoices/get-invoice-items",
  },

  "POST /api/v1/invoices/create-inv-item": {
    action: "invoices/create-inv-item",
  },

  "POST /api/v1/invoices/delete-inv-item": {
    action: "invoices/delete-inv-item",
  },

  "POST /api/v1/invoices/get-inv-per-patient": {
    action: "invoices/get-inv-per-patient",
  },

  "POST /api/v1/invoices/create-invoice": {
    action: "invoices/create-invoice",
  },

  "POST /api/v1/invoices/edit-invoice": {
    action: "invoices/edit-invoice",
  },

  "PATCH /api/v1/invoices/update-invoice-status": {
    action: "invoices/update-invoice-status",
  },

  "POST /api/v1/invoices/create-c-invoice": {
    action: "invoices/create-c-invoice",
  },

  "POST /api/v1/invoices/get-all-paged-c-invoices": {
    action: "invoices/get-all-paged-c-invoices",
  },

  "POST /api/v1/invoices/create-c-inv-item": {
    action: "invoices/create-c-inv-item",
  },

  // Consultation Settinngs
  "POST /api/v1/settings/consultation/create-cons-type": {
    action: "settings/consultation/create-cons-type",
  },

  "POST /api/v1/settings/consultation/get-all-paged-cons-types": {
    action: "settings/consultation/get-all-paged-cons-types",
  },

  "PATCH /api/v1/settings/consultation/update-cons-type-status": {
    action: "settings/consultation/update-cons-type-status",
  },

  "GET /api/v1/settings/consultation/get-all-active-cons-types": {
    action: "settings/consultation/get-all-active-cons-types",
  },

  "POST /api/v1/settings/consultation/create-doctor": {
    action: "settings/consultation/create-doctor",
  },

  "POST /api/v1/settings/consultation/get-all-paged-doctors": {
    action: "settings/consultation/get-all-paged-doctors",
  },

  "PATCH /api/v1/settings/consultation/update-doctor-status": {
    action: "settings/consultation/update-doctor-status",
  },

  "GET /api/v1/settings/consultation/get-all-active-doctors": {
    action: "settings/consultation/get-all-active-doctors",
  },

  // reports

  "POST /api/v1/reports/generate-stock-report": {
    action: "reports/generate-stock-report",
  },
};
