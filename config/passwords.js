const bcrypt = require('bcrypt');

let salt, passwordHash;

exports.passwordHash = function (password) {
    salt = bcrypt.hashSync(password, 4);
    return salt;
};

exports.hashCompare = function (stringPassword, hash) {
    passwordHash = bcrypt.compareSync(stringPassword, hash);
    return passwordHash;
}