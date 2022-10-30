const PROXY_CONFIG = [
    {
        context:
        [
            "/sheets",
            "/sheets/list",
            "/sheets/one",
            "/editor",
            "/browse"
        ],
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;