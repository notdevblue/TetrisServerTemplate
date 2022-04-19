const { MatchMaking } = require("../Utils/MatchMaking")

module.exports = {
    type: "leavemm",
    handle(socket, payload) {
        MatchMaking.leaveMatchmaking(socket);
    }
}