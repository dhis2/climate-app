const config = {
  type: "app",
  pluginType: "DASHBOARD",
  title: "DHIS2 Climate App",
  entryPoints: {
    app: "./src/App.js",
    plugin: "./src/DashboardPlugin.js",
  },
};

module.exports = config;
