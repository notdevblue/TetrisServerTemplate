const { MatchMaking } = require("../Utils/MatchMaking")

module.exports = {
    type: "entermm",
    handle(socket, payload) {
        MatchMaking.enterMatchmaking(socket);
    }
}