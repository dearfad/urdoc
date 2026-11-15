-- 学生表：学生凭「姓名 + 学号」免密登录，学号唯一
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  student_no TEXT NOT NULL,
  created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER))
);

-- 同一学号不会重复；姓名可能重名，因此用 (name, student_no) 联合索引做登录点查
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_student_no ON students(student_no);
CREATE INDEX IF NOT EXISTS idx_students_name_no ON students(name, student_no);

-- 教师表：教师凭「账号 + 密码」登录，密码使用 nuxt-auth-utils 的 scrypt 哈希
CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER))
);

CREATE INDEX IF NOT EXISTS idx_teachers_account ON teachers(account);

-- 管理员表：管理员凭「账号 + 密码」登录，结构与教师一致，独立成表
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER))
);

CREATE INDEX IF NOT EXISTS idx_admins_account ON admins(account);

-- ⚠️ 示例数据：学生免密，可直接插入
INSERT INTO students (name, student_no) VALUES
  ('张三', '2024001'),
  ('李四', '2024002'),
  ('王五', '2024003');

-- ⚠️ 教师示例（password_hash 需替换）：
-- 在「用户」页面的「哈希工具」中生成明文密码的哈希，再替换下面的值后执行。
-- INSERT INTO teachers (account, password_hash, name) VALUES ('teacher', '<替换为真实哈希>', '教师');

-- ⚠️ 管理员示例（password_hash 需替换，方式同上）：
-- INSERT INTO admins (account, password_hash, name) VALUES ('admin', '<替换为真实哈希>', '管理员');
