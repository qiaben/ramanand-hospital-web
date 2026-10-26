CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL,            -- appt or lab
  doctor TEXT NOT NULL,          -- doctor slug, or "lab"
  date TEXT NOT NULL,            -- YYYY-MM-DD, India time
  time TEXT NOT NULL,            -- HH:MM, India time
  start_ts INTEGER NOT NULL,     -- the same moment as a UTC timestamp in milliseconds
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  lang TEXT,
  age TEXT,
  gender TEXT,
  details TEXT,                  -- JSON: reason, tests, address and so on
  token TEXT NOT NULL,           -- secret in the patient's cancel link
  status TEXT NOT NULL DEFAULT 'booked',
  reminded INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_slot ON bookings (kind, doctor, date, time, status);
CREATE INDEX IF NOT EXISTS idx_remind ON bookings (status, reminded, start_ts);
