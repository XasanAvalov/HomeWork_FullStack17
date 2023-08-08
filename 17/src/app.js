const { Bot } = require("grammy");

const Io = require("./utils/Io");
const Box = require("./models/Box.model")
const config = require("../config");
const isAuth = require("./middlewares/isAuth");
const isJoin = require("./middlewares/isJoin");

const Users = new Io(process.cwd()+"/database/users.json")
const Boxes = new Io(process.cwd()+"/database/box.json")

const bot = new Bot(config.token);

bot.use(isAuth);
bot.use(isJoin);

bot.command("start", async (ctx) => {
    await ctx.reply("Hello");
});

bot.on("my_chat_member", async(ctx) => {
    const users = await Users.read();

    const telegramID = ctx.from.id;
    const findUser = users.find((user) => user.telegramID === telegramID);

    findUser.status = findUser.status ? false : true;

    await Users.write(users)
}); 

bot.on("message:text", async(ctx) => {
    const boxes = await Boxes.read();

    const telegramID = ctx.from.id;

    const findBox = boxes.find((box) => box.berlgan_id == ctx.message.text)
    
    if(!findBox) {
        ctx.reply('Bunaqa idlik messag sizda yo');
        return;
    };

    if(findBox.telegramID === telegramID){
        await ctx.api.copyMessage(ctx.from.id, "-1001933913889", findBox.message_id);
    }else{
        ctx.reply('Bunaqa idlik messag sizda yo');1
    }

})

bot.on("message", async (ctx) => {
    await ctx.api.copyMessage("-1001933913889", ctx.from.id, ctx.message.message_id);

    const boxes = await Boxes.read();

    const telegramID = ctx.from.id;

    const id = (boxes[boxes.length - 1]?.id || 0) + 1;

    const random =  Math.floor(Math.random()*1000)

    const message_id = ctx.message.forward_from_message_id

    const newBox = new Box(id, telegramID, message_id, random);

    const data = boxes.length ? [...boxes, newBox] : [newBox];

    await Boxes.write(data);

    ctx.reply(random)
})

//Hamma xatoliklar shu yerga tushadi.
bot.catch((error) => {
    console.log(error);
})

bot.start();