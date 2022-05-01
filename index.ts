import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Chat } from 'telegraf/typings/core/types/typegram';
import {
  generateAge,
  generateName,
  getUserID,
  getUserStatus,
  setUserName,
  updateHobbies,
  updateFilms,
  updateAge,
  randomIdentity,
} from './src/core/user';
import { CreateUser } from './src/types/user';

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error('No token provided');
}

const bot = new Telegraf(token);

bot.start(async ctx =>
  ctx.reply(
    await insureChatIsPrivate(ctx.chat, async chat => {
      await getUserID(getCreateUser(chat));
      return `Hi👋!`;
    })
  )
);

bot.command('my_identity', async ctx =>
  ctx.reply(
    await insureChatIsPrivate(ctx.chat, chat =>
      getUserStatus(getCreateUser(chat))
    )
  )
);

bot.command('set_name', async ctx =>
  ctx.replyWithMarkdown(
    await insureChatIsPrivate(ctx.chat, async chat => {
      const parts = ctx.message.text.split(' ');
      if (parts.length != 2) {
        return `Usage: \`/set_name <name>\``;
      }

      const user = getCreateUser(chat);
      user.fakeName = parts[1];

      return (await setUserName(user))
        ? `Your name has been set to *${user.fakeName}*`
        : `Sorry, I couldn't set your name.`;
    })
  )
);

bot.command('set_hobbies', async ctx =>
  ctx.replyWithMarkdown(
    await insureChatIsPrivate(ctx.chat, async chat => {
      const parts = ctx.message.text.split(' ');
      if (parts.length == 1) {
        return `Usage: \`/set_hobbies <hobbies>\``;
      }

      const user = getCreateUser(chat);
      parts.shift();
      const hobbies = parts.join(' ');

      return (await updateHobbies(user, hobbies))
        ? `Your hobbies has been set to *${hobbies}*`
        : `Sorry, I couldn't set your hobbies.`;
    })
  )
);

bot.command('set_films', async ctx =>
  ctx.replyWithMarkdown(
    await insureChatIsPrivate(ctx.chat, async chat => {
      const parts = ctx.message.text.split(' ');
      if (parts.length == 1) {
        return `Usage: \`/set_films <films>\``;
      }

      const user = getCreateUser(chat);
      parts.shift();
      const films = parts.join(' ');

      return (await updateFilms(user, films))
        ? `Your films🎥 has been set to *${films}*`
        : `Sorry, I couldn't set your films.`;
    })
  )
);

bot.command('set_age', async ctx =>
  ctx.replyWithMarkdown(
    await insureChatIsPrivate(ctx.chat, async chat => {
      const parts = ctx.message.text.split(' ');
      if (parts.length != 2 || Number.isNaN(Number(parts[1]))) {
        return `Usage: \`/set_age <age>\``;
      }

      const user = getCreateUser(chat);
      user.age = Number(parts[1]);

      return (await updateAge(user))
        ? `Your age has been set to *${user.age}*`
        : `Sorry, I couldn't set your age.`;
    })
  )
);

bot.command('random_identity', async ctx =>
  ctx.replyWithMarkdown(
    await insureChatIsPrivate(ctx.chat, chat =>
      randomIdentity(getCreateUser(chat))
    )
  )
);

bot.help(ctx => ctx.reply('Send me a sticker'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

async function insureChatIsPrivate(
  chat: Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat,
  fn: (chat: Chat.PrivateChat) => Promise<string>
): Promise<string> {
  if (chat.type !== 'private') {
    return `Sorry, I can only work in private chats.`;
  }

  return fn(chat);
}

function getCreateUser(chat: Chat.PrivateChat): CreateUser {
  return {
    chatID: chat.id,
    userName: chat.username ?? '',
    fakeName: generateName(),
    age: generateAge(),
  };
}
