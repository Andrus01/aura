import sqlite3
import json
from datetime import datetime, timedelta

db_path = "C:/Users/indre/.local/share/mimocode/mimocode.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get sessions from the last 30 days
thirty_days_ago = int((datetime.now() - timedelta(days=30)).timestamp() * 1000)

# Query for user prompts that suggest repeated workflows
cursor.execute("""
    SELECT 
        json_extract(m.data, '$.content') as user_prompt,
        count(*) as n
    FROM message m
    WHERE json_extract(m.data, '$.role') = 'user'
      AND m.time_created > ?
      AND json_extract(m.data, '$.content') IS NOT NULL
    GROUP BY json_extract(m.data, '$.content')
    HAVING count(*) > 1
    ORDER BY n DESC
    LIMIT 20
""", (thirty_days_ago,))

results = cursor.fetchall()
print("Repeated user prompts (top 20):")
for r in results:
    prompt = (r[0] or "")[:150]
    count = r[1]
    print(f"  {count}x: {prompt}...")

# Query for repeated bash commands
cursor.execute("""
    SELECT 
        json_extract(json_extract(p.data, '$.state.input'), '$.command') as command,
        count(*) as n
    FROM message m
    JOIN part p ON p.message_id = m.id
    WHERE json_extract(m.data, '$.role') = 'assistant'
      AND json_extract(p.data, '$.type') = 'tool'
      AND json_extract(p.data, '$.tool') = 'Bash'
      AND m.time_created > ?
    GROUP BY command
    HAVING count(*) > 2
    ORDER BY n DESC
    LIMIT 20
""", (thirty_days_ago,))

results = cursor.fetchall()
print("\nRepeated bash commands (top 20):")
for r in results:
    cmd = (r[0] or "")[:200]
    count = r[1]
    print(f"  {count}x: {cmd}...")

conn.close()
