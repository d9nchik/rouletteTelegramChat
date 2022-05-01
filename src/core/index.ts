import { Chat, Update } from 'telegraf/typings/core/types/typegram';
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
  isUserBanned,
} from './user';
import { getCompanionIdentity, stop } from './conversation';
import { ban } from './admin';
import { CreateUser } from '../types/user';
import { Context, Telegraf } from 'telegraf';

function registerHandlersOnBot(bot: Telegraf<Context<Update>>) {
  bot.start(async ctx =>
    ctx.reply(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        async createUser => {
          await getUserID(createUser);
          return `Hi👋!`;
        }
      )
    )
  );

  bot.command('help', async ctx =>
    ctx.reply(
      await insureChatIsPrivateAndUserIsNotBanned(
        ctx.chat,
        async () =>
          `Commands:
/help - show this message
/find_companion - user status of searching set to true. If match will be found user will get message with companion identity
/stop - user stop communication with companion (or searching companion), status of searching is false
/my_identity - user get his identity (name, age, hobbies, favorite films)
/set_name {name} - set your name
/set_age {age} - set your age
/set_hobbies {hobbies} - set your hobbies
/set_films {films} - set your films
/random_identity - generate random name and age. Hobbies and favorite films will be empty
/set_favorite_film {favorite films} - set your favorite film
/block - person will be added to blacklist. Current conversation will be stopped.
/report - report companion. (The same affect as block command + admin can give permanent ban for violation rules)
{any message} - if person in conversation will be sent to companion

We will ban you if you provide:
- porn 🔞
- abuse 🔫
- child porn 👶
- information that break copyright law (or any of it analogue) ©
- advertisement
- and staff that can violate law
`
      )
    )
  );

  bot.command('my_identity', async ctx =>
    ctx.reply(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        getUserStatus
      )
    )
  );

  bot.command('set_name', async ctx =>
    ctx.replyWithMarkdown(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        async createUser => {
          const parts = ctx.message.text.split(' ');
          if (parts.length != 2) {
            return `Usage: \`/set_name <name>\``;
          }

          createUser.fakeName = parts[1];

          return (await setUserName(createUser))
            ? `Your name has been set to *${createUser.fakeName}*`
            : `Sorry, I couldn't set your name.`;
        }
      )
    )
  );

  bot.command('set_hobbies', async ctx =>
    ctx.replyWithMarkdown(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        async createUser => {
          const parts = ctx.message.text.split(' ');
          if (parts.length == 1) {
            return `Usage: \`/set_hobbies <hobbies>\``;
          }

          parts.shift();
          const hobbies = parts.join(' ');

          return (await updateHobbies(createUser, hobbies))
            ? `Your hobbies has been set to *${hobbies}*`
            : `Sorry, I couldn't set your hobbies.`;
        }
      )
    )
  );

  bot.command('set_films', async ctx =>
    ctx.replyWithMarkdown(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        async crateUser => {
          const parts = ctx.message.text.split(' ');
          if (parts.length == 1) {
            return `Usage: \`/set_films <films>\``;
          }

          parts.shift();
          const films = parts.join(' ');

          return (await updateFilms(crateUser, films))
            ? `Your films🎥 has been set to *${films}*`
            : `Sorry, I couldn't set your films.`;
        }
      )
    )
  );

  bot.command('set_age', async ctx =>
    ctx.replyWithMarkdown(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        async crateUser => {
          const parts = ctx.message.text.split(' ');
          if (parts.length != 2 || Number.isNaN(Number(parts[1]))) {
            return `Usage: \`/set_age <age>\``;
          }

          crateUser.age = Number(parts[1]);

          return (await updateAge(crateUser))
            ? `Your age has been set to *${crateUser.age}*`
            : `Sorry, I couldn't set your age.`;
        }
      )
    )
  );

  bot.command('random_identity', async ctx =>
    ctx.replyWithMarkdown(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        randomIdentity
      )
    )
  );

  bot.command('companion_identity', async ctx =>
    ctx.reply(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(
        ctx.chat,
        getCompanionIdentity
      )
    )
  );

  bot.command('stop', async ctx =>
    ctx.reply(
      await insureChatIsPrivateAndUserIsNotBannedWithCreateUser(ctx.chat, stop)
    )
  );

  // Admin
  bot.command('ban', async ctx =>
    ctx.replyWithMarkdown(
      await insureChatIsPrivateAndUserIsNotBanned(ctx.chat, async chat => {
        const parts = ctx.message.text.split(' ');
        if (parts.length != 2 || Number.isNaN(Number(parts[1]))) {
          return `Usage: \`/ban <user_id>\``;
        }

        return ban(getCreateUser(chat), Number(parts[1]));
      })
    )
  );
}

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

async function checkIsUserBanned(
  chat: Chat.PrivateChat,
  fn: (chat: Chat.PrivateChat) => Promise<string>
): Promise<string> {
  if (await isUserBanned(getCreateUser(chat))) {
    return `Sorry, you are banned.💀`;
  }

  return fn(chat);
}

const insureChatIsPrivateAndUserIsNotBanned = (
  chat: Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat,
  fn: (chat: Chat.PrivateChat) => Promise<string>
) => insureChatIsPrivate(chat, async chat => checkIsUserBanned(chat, fn));

const insureChatIsPrivateAndUserIsNotBannedWithCreateUser = (
  chat: Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat,
  fn: (u: CreateUser) => Promise<string>
) =>
  insureChatIsPrivateAndUserIsNotBanned(chat, async chat =>
    fn(getCreateUser(chat))
  );

export default registerHandlersOnBot;
