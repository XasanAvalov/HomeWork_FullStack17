class User {
    constructor (id, firstName, telegramID) {
        this.id = id;
        this.firstName = firstName;
        this.telegramID = telegramID;
        this.status = true;
    };
};
module.exports = User;