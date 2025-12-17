const jwt = require("jsonwebtoken");

function setUser(user) {
    const _id = user._id;
    return jwt.sign({
        _id
    },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
}

function getUser(UID) {
    return jwt.verify(UID, process.env.JWT_SECRET,)
}

module.exports = {
    setUser,
    getUser
}