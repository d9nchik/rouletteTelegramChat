import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Chat } from 'telegraf/typings/core/types/typegram';
import { generateAge, generateName, getUserID } from './src/core/user';
import { CreateUser } from './src/types/user';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start(async ctx => {
  const chat = ctx.chat;
  if (chat.type !== 'private' || !chat.username) {
    return ctx.reply(`Sorry, I can only work in private chats.`);
  }

  await getUserID(getCreateUser(chat));

  return ctx.reply(`Hi👋!`);
});
bot.help(ctx => ctx.reply('Send me a sticker'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function getCreateUser(chat: Chat.PrivateChat): CreateUser {
  return {
    chatID: chat.id,
    userName: chat.username ? chat.username : '',
    fakeName: generateName(),
    age: generateAge(),
  };
}
