(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.adminPortalUrl = 'https://uatapi.anniyam.in/dev/adminportal-service/v2';
  window.__env.shgUrl = 'https://shgrepuat.anniyam.in';
  window.__env.ftJriUrl = 'https://uatapi.anniyam.in/dev';
  window.__env.payurl = 'https://uat.anniyam.in';

  window.__env.isExpired = false;
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.currentEnv = "DEVELOPMENT";
}(this));