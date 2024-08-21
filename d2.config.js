const config = {
  type: "app",
  pluginType: "DASHBOARD",
  title: "Climate app",
  entryPoints: {
    app: "./src/App.js",
    plugin: "./src/plugin/DashboardPlugin.js",
  },
};

module.exports = config;
