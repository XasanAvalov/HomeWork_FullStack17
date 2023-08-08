const { InlineKeyboard } = require("grammy");

const isJoin = async (ctx, next) => {
    const telegramID = ctx.from.id;

    const { status } = await ctx.api.getChatMember("-1001933913889", telegramID);

    if(status !== "left") {
        return next();
    }

    const keyboard = new InlineKeyboard().url("A'zo bolish", "https://t.me/+4MXMjBUr1es0MWY6");

    await ctx.reply("avval kanalga a'zo boling va qayta /start bosing", {
        reply_markup: {
            ...keyboard
        }
    });
};


module.exports = isJoin;