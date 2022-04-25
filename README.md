# Roulette Telegram Chat

![Man speaking with women](./docs/logo.png)
The idea is to create a chat for communication between two random people without revealing their identities.

## Use case diagram

![Interaction between user, moderator and system](./docs/useCase.png)
Main points:

### User

- can register in system(by pressing button start)
- can change companion to new one
- can stop communication
- report companion abuse
- block companion to not interact with him anymore
- get companion "fake" identity (name, age, hobbies)
- watch own identity
- edit own identity
- set random identity (default action on start of the bot)

### Moderator

- can ban user (for inappropriate behaviour(Look more in "inapropriate behavior"))
- watch logs by user

**Notice**
We collect messages to provide platform without abuse, advertisement.

## Data that we collect

![Er diagram with 3 enteties](./docs/ER.png)

### User

- chat_id
- username
- fake identity

### Role

- name (for now 'admin' and 'user')

### Logs

- message (who send, and who received)
- date (when message was send)

### Indexes

- on chat_id (it will be unique)
- logs ON date send and person who send or receive

## We will ban you if you provide:

- porn 🔞
- abuse 🔫
- child porn 👶
- information that break copyright law (or any of it analogue) ©
- advertisement
- and staff that can violate law

## Scenario of usage

- `/start` - user get a random identity and get fake identity, status of searching is false
- `/find_companion` - user status of searching set to true. If match will be found user will get message with companion identity
- `/stop` - user stop communication with companion (or searching companion), status of searching is false
- `/my_identity` - user get his identity (name, age, hobbies, favorite films)
- `/companion_identity` - get companion identity (name, age, hobbies, favorite films). If not in conversation get err message.
- `/random_identity` - user sets random name, age. Hobbies and favorite films will be empty
- `/set_name {name}` - set name
- `/set_age {age}` - set age (can be only number)
- `/set_hobbies {hobbies}` - string of hobbies
- `/set_films {favorite films}` - set favorite films
- `/block` - person will be added to blacklist. current conversation will e stopped.
- `/report` - report companion. (The same affect as `block` command + admin can give permanent ban for violation rules )
- `{any message}` - if person in conversation will be sent to companion

### Admin commands:

- `/ban {user_id}` - give a permanent ban for person. Banned person will be kicked off any present conversation and will get `You're banned` for any command
- `/user_logs {user_id}` - get logs for user as a txt file

## Admin automation

Before sending messages to admin, they will be send to sentiment analyzer engine. If your text will be evaluated as abuse, you will get ban without calling admin.

### Sentiment analyzer:

We will use Node.JS [sentiment library](https://github.com/thisandagain/sentiment). Scores lower than -3 will earn ban

## Development

### Migrations

To apply migrations you need to run

```bash
migrate -path migrations -database postgres://$LOGIN:$PASSWORD@localhost:5432/postgres?sslmode=disable up
```

with [migrate previously installed](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate#installation)
