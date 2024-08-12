const config = {
    type: "app",
    pluginType: "dashboard",
    title: "Climate Data",
    entryPoints: {
        app: "./src/App.js",
        plugin: "./src/DashboardPlugin.js",
    },
};

module.exports = config;
