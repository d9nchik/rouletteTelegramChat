import 'dotenv/config';
import { Telegraf } from 'telegraf';
import registerHandlers from './src/core';

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error('No token provided');
}

const bot = new Telegraf(token);

registerHandlers(bot);

bot.help(ctx => ctx.reply('Send me a sticker'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
