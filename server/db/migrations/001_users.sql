-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
