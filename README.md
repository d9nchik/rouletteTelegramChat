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
