/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

module.exports = {
  /**************************************************************************
   *                                                                         *
   * Tell Sails what database(s) it should use in production.                *
   *                                                                         *
   * (https://sailsjs.com/config/datastores)                                 *
   *                                                                         *
   **************************************************************************/
  datastores: {
    /***************************************************************************
     *                                                                          *
     * Configure your default production database.                              *
     *                                                                          *
     * 1. Choose an adapter:                                                    *
     *    https://sailsjs.com/plugins/databases                                 *
     *                                                                          *
     * 2. Install it as a dependency of your Sails app.                         *
     *    (For example:  npm install sails-mysql --save)                        *
     *                                                                          *
     * 3. Then set it here (`adapter`), along with a connection URL (`url`)     *
     *    and any other, adapter-specific customizations.                       *
     *    (See https://sailsjs.com/config/datastores for help.)                 *
     *                                                                          *
     ***************************************************************************/
    default: {
      // adapter: 'sails-mysql',
      // url: 'mysql://user:password@host:port/database',
      //--------------------------------------------------------------------------
      //  /\   To avoid checking it in to version control, you might opt to set
      //  ||   sensitive credentials like `url` using an environment variable.
      //
      //  For example:
      //  ```
      //  sails_datastores__default__url=mysql://admin:myc00lpAssw2D@db.example.com:3306/my_prod_db
      //  ```
      //--------------------------------------------------------------------------
      /****************************************************************************
       *                                                                           *
       * More adapter-specific options                                             *
       *                                                                           *
       * > For example, for some hosted PostgreSQL providers (like Heroku), the    *
       * > extra `ssl` object with a `rejectUnauthorized` option must be provided. *
       *                                                                           *
       * More info:                                                                *
       * https://sailsjs.com/config/datastores                                     *
       *                                                                           *
       ****************************************************************************/
      // ssl: { rejectUnauthorized: true },
    },
  },

  models: {
    /***************************************************************************
     *                                                                          *
     * To help avoid accidents, Sails automatically sets the automigration      *
     * strategy to "safe" when your app lifts in production mode.               *
     * (This is just here as a reminder.)                                       *
     *                                                                          *
     * More info:                                                               *
     * https://sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate *
     *                                                                          *
     ***************************************************************************/
    migrate: "safe",

    /***************************************************************************
     *                                                                          *
     * If, in production, this app has access to physical-layer CASCADE         *
     * constraints (e.g. PostgreSQL or MySQL), then set those up in the         *
     * database and uncomment this to disable Waterline's `cascadeOnDestroy`    *
     * polyfill.  (Otherwise, if you are using a databse like Mongo, you might  *
     * choose to keep this enabled.)                                            *
     *                                                                          *
     ***************************************************************************/
    // cascadeOnDestroy: false,
  },

  /**************************************************************************
   *                                                                         *
   * Always disable "shortcut" blueprint routes.                             *
   *                                                                         *
   * > You'll also want to disable any other blueprint routes if you are not *
   * > actually using them (e.g. "actions" and "rest") -- but you can do     *
   * > that in `config/blueprints.js`, since you'll want to disable them in  *
   * > all environments (not just in production.)                            *
   *                                                                         *
   ***************************************************************************/
  blueprints: {
    shortcuts: false,
  },

  /***************************************************************************
   *                                                                          *
   * Configure your security settings for production.                         *
   *                                                                          *
   * IMPORTANT:                                                               *
   * If web browsers will be communicating with your app, be sure that        *
   * you have CSRF protection enabled.  To do that, set `csrf: true` over     *
   * in the `config/security.js` file (not here), so that CSRF app can be     *
   * tested with CSRF protection turned on in development mode too.           *
   *                                                                          *
   ***************************************************************************/
  security: {
    /***************************************************************************
     *                                                                          *
     * If this app has CORS enabled (see `config/security.js`) with the         *
     * `allowCredentials` setting enabled, then you should uncomment the        *
     * `allowOrigins` whitelist below.  This sets which "origins" are allowed   *
     * to send cross-domain (CORS) requests to your Sails app.                  *
     *                                                                          *
     * > Replace "https://example.com" with the URL of your production server.  *
     * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
     *                                                                          *
     ***************************************************************************/
    cors: {
      // allowOrigins: [
      //   'https://example.com',
      // ]
    },
  },

  /***************************************************************************
   *                                                                          *
   * Configure how your app handles sessions in production.                   *
   *                                                                          *
   * (https://sailsjs.com/config/session)                                     *
   *                                                                          *
   * > If you have disabled the "session" hook, then you can safely remove    *
   * > this section from your `config/env/production.js` file.                *
   *                                                                          *
   ***************************************************************************/

  /**************************************************************************
   *                                                                          *
   * Set up Socket.io for your production environment.                        *
   *                                                                          *http
   * (https://sailsjs.com/config/sockets)                                     *
   *                                                                          *
   * > If you have disabled the "sockets" hook, then you can safely remove    *
   * > this section from your `config/env/production.js` file.                *
   *                                                                          *
   ***************************************************************************/
  sockets: {
    /***************************************************************************
     *                                                                          *
     * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
     * "origins" are allowed to open socket connections to your Sails app.      *
     *                                                                          *
     * > Replace "https://example.com" etc. with the URL(s) of your app.        *
     * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
     *                                                                          *
     ***************************************************************************/
    onlyAllowOrigins: ["https://sethneth.lk", "https://www.sethneth.lk"],
    /***************************************************************************
     *                                                                          *
     * If you are deploying a cluster of multiple servers and/or processes,     *
     * then uncomment the following lines.  This tells Socket.io about a Redis  *
     * server it can use to help it deliver broadcasted socket messages.        *
     *                                                                          *
     * > Be sure a compatible version of @sailshq/socket.io-redis is installed! *
     * > (See https://sailsjs.com/config/sockets for the latest version info)   *
     *                                                                          *
     * (https://sailsjs.com/docs/concepts/deployment/scaling)                   *
     *                                                                          *
     ***************************************************************************/
    // adapter: '@sailshq/socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //--------------------------------------------------------------------------
  },

  /**************************************************************************
   *                                                                         *
   * Set the production log level.                                           *
   *                                                                         *
   * (https://sailsjs.com/config/log)                                        *
   *                                                                         *
   ***************************************************************************/
  log: {
    level: "debug",
  },

  http: {
    /***************************************************************************
     *                                                                          *
     * The number of milliseconds to cache static assets in production.         *
     * (the "max-age" to include in the "Cache-Control" response header)        *
     *                                                                          *
     * If you are caching assets with a tool like Cloudflare, you may want to   *
     * reduce this considerably to allow more flexibility in purging the cache. *
     *                                                                          *
     ***************************************************************************/
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year

    /***************************************************************************
     *                                                                          *
     * Proxy settings                                                           *
     *                                                                          *
     * If your app will be deployed behind a proxy/load balancer - for example, *
     * on a PaaS like Heroku - then uncomment the `trustProxy` setting below.   *
     * This tells Sails/Express how to interpret X-Forwarded headers.           *
     *                                                                          *
     * This setting is especially important if you are using secure cookies     *
     * (see the `cookies: secure` setting under `session` above) or if your app *
     * relies on knowing the original IP address that a request came from.      *
     *                                                                          *
     * (https://sailsjs.com/config/http)                                        *
     *                                                                          *
     ***************************************************************************/
    trustProxy: true,
  },

  /**************************************************************************
   *                                                                         *
   * Lift the server on port 80.                                             *
   * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
   * probably don't need to set a port here, because it is oftentimes        *
   * handled for you automatically.  If you are not sure if you need to set  *
   * this, just try deploying without setting it and see if it works.)       *
   *                                                                         *
   ***************************************************************************/
  // port: 80,

  /**************************************************************************
   *                                                                         *
   * Configure an SSL certificate                                            *
   *                                                                         *
   * For the safety of your users' data, you should use SSL in production.   *
   * ...But in many cases, you may not actually want to set it up _here_.    *
   *                                                                         *
   * Normally, this setting is only relevant when running a single-process   *
   * deployment, with no proxy/load balancer in the mix.  But if, on the     *
   * other hand, you are using a PaaS like Heroku, you'll want to set up     *
   * SSL in your load balancer settings (usually somewhere in your hosting   *
   * provider's dashboard-- not here.)                                       *
   *                                                                         *
   * > For more information about configuring SSL in Sails, see:             *
   * > https://sailsjs.com/config/*#?sailsconfigssl                          *
   *                                                                         *
   **************************************************************************/
  // ssl: undefined,

  /**************************************************************************
   *                                                                         *
   * Production overrides for any custom settings specific to your app.      *
   * (for example, production credentials for 3rd party APIs like Stripe)    *
   *                                                                         *
   * > See config/custom.js for more info on how to configure these options. *
   *                                                                         *
   ***************************************************************************/
  custom: {
    baseUrl: "https://example.com",
    internalEmailAddress: "support@example.com",

    // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
    // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using environment variables.
    //
    // For example:
    // ```
    // sendgridSecret=SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU
    // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------
  },
};
