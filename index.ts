import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import registerHandlers from './src/core';

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error('No token provided');
}

const bot = new Telegraf(token);

registerHandlers(bot);

export async function main(args: Update) {
  return await bot.handleUpdate(args);
}
