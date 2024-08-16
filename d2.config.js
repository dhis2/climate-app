const config = {
    type: "app",
    pluginType: "DASHBOARD",
    title: "Climate Data",
    entryPoints: {
        app: "./src/App.js",
        plugin: "./src/DashboardPlugin.js",
    },
};

module.exports = config;
