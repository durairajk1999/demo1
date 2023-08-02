(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.adminPortalUrl = 'https://tango.anniyam.in/adminportal-service/v2';
  window.__env.shgUrl = 'https://shg.anniyam.in';
  window.__env.ftJriUrl = 'https://tango.anniyam.in';
  window.__env.payurl = 'https://pay.anniyam.in';

  window.__env.isExpired = false;
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.currentEnv = "PRODUCTION";
}(this));