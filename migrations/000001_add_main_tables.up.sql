BEGIN;
-- Table role
create table role
(
    id   serial
        constraint role_pk
            primary key,
    name VARCHAR(20) not null
);

create unique index role_name_uindex
    on role (name);

-- Table users
create table users
(
    id        serial
        constraint user_pk
            primary key,
    chat_id   int                     not null,
    username  VARCHAR(70)             not null,
    fake_name VARCHAR(70)             not null,
    age       int                     not null,
    hobbies   VARCHAR(100) default '' not null,
    films     VARCHAR(100) default '' not null
);

create unique index user_chat_id_uindex
    on users (chat_id);

-- Table user_roles
create table user_roles
(
    user_id int not null
        constraint user_roles_users_id_fk
            references users,
    role_id int not null
        constraint user_roles_role_id_fk
            references role,
    constraint user_roles_pk
        primary key (user_id, role_id)
);

-- Table blocked
create table block_list
(
    list_author     int not null
        constraint block_list_users_id_id_fk
            references users,
    blocked_user_id int not null
        constraint block_list_users_blocked_user_id_id_fk
            references users,
    constraint block_list_pk
        primary key (list_author, blocked_user_id)
);

-- Table conversations
create table conversation
(
    id       serial
        constraint conversation_pk
            primary key,
    is_ended boolean default FALSE not null,
    sender   int                   not null
        constraint conversation_users_id_fk
            references users,
    receiver int                   not null
        constraint conversation_users_id_fk_2
            references users
);

-- Table logs
create table logs
(
    id              serial
        constraint logs_pk
            primary key,
    message         VARCHAR(1000)           not null,
    date            timestamp default now() not null,
    sender          int                     not null
        constraint logs_users_id_fk
            references users,
    conversation_id int                     not null
        constraint logs_conversations_id references conversation
);

COMMIT;