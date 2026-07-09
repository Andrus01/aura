import sqlite3
import json
from datetime import datetime, timedelta

db_path = "C:/Users/indre/.local/share/mimocode/mimocode.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get sessions from the last 30 days
thirty_days_ago = int((datetime.now() - timedelta(days=30)).timestamp() * 1000)

cursor.execute("""
    SELECT id, title, directory, time_created, time_updated
    FROM session
    WHERE time_created > ?
    ORDER BY time_created DESC
""", (thirty_days_ago,))

sessions = cursor.fetchall()
print(f"Sessions in last 30 days: {len(sessions)}")
for s in sessions:
    title = s[1] or "Untitled"
    print(f"  {s[0]}: {title} ({s[2]})")

conn.close()
