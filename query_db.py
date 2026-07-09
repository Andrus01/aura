import sqlite3

db_path = "C:/Users/indre/.local/share/mimocode/mimocode.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print("Tables:", tables)

# Get schema info
for table in tables:
    cursor.execute(f"PRAGMA table_info({table})")
    columns = [(r[1], r[2]) for r in cursor.fetchall()]
    print(f"\n{table}: {columns}")

conn.close()
