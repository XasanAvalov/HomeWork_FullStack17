const Io = require("../utils/Io");
const User = require("../models/User.model")

const Users = new Io(process.cwd()+"/database/users.json");

const isAuth = async(ctx, next) => {
    const users = await Users.read();

    const telegramID = ctx.from.id;
    const findUser = users.find((user) => user.telegramID == telegramID);

    if(!findUser) {
        const id = (users[users.length - 1]?.id || 0) + 1;

        const newUser = new User(id, ctx.from.first_name, telegramID);

        const data = users.length ? [...users, newUser] : [newUser];

        await Users.write(data);
    }else if(!findUser.status){
        findUser.status = true;

        await Users.write(users)
    }

    next();
};

module.exports = isAuth;