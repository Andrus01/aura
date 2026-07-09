import sqlite3, json, os, sys

db_path = os.path.expanduser(r"~\.local\share\mimocode\mimocode.db")
db = sqlite3.connect(db_path)
db.row_factory = sqlite3.Row
cur = db.cursor()

# List tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cur.fetchall()]
print("=== TABLES ===")
print(tables)

# List sessions
print("\n=== SESSIONS ===")
cur.execute("SELECT id, directory, title, time_created FROM session ORDER BY time_created DESC LIMIT 20")
for r in cur.fetchall():
    print(f"  {r['id']} | dir={r['directory']} | title={r['title']} | time={r['time_created']}")

# List projects
print("\n=== SESSION COUNT BY DIRECTORY ===")
cur.execute("SELECT directory, COUNT(*) as cnt FROM session GROUP BY directory ORDER BY cnt DESC")
for r in cur.fetchall():
    print(f"  {r['directory']}: {r['cnt']} sessions")

db.close()
