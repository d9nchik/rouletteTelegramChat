BEGIN;
DROP TABLE IF EXISTS user_roles cascade;
DROP TYPE IF EXISTS role;
DROP TABLE IF EXISTS block_list cascade;
DROP TABLE IF EXISTS logs cascade;
DROP TABLE IF EXISTS conversation cascade;
DROP TABLE IF EXISTS users cascade;
COMMIT;
