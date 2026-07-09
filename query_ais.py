import sqlite3
import json
from datetime import datetime, timedelta

db_path = "C:/Users/indre/.local/share/mimocode/mimocode.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get sessions from the last 30 days for AIS System project
thirty_days_ago = int((datetime.now() - timedelta(days=30)).timestamp() * 1000)

cursor.execute("""
    SELECT id, title, directory, time_created
    FROM session
    WHERE time_created > ?
      AND directory LIKE '%AIS%'
    ORDER BY time_created DESC
""", (thirty_days_ago,))

sessions = cursor.fetchall()
print(f"AIS System sessions in last 30 days: {len(sessions)}")
for s in sessions:
    title = s[1] or "Untitled"
    print(f"  {s[0]}: {title}")

# Get tool usage patterns for AIS System sessions
session_ids = [s[0] for s in sessions]
if session_ids:
    placeholders = ','.join(['?' for _ in session_ids])
    cursor.execute(f"""
        SELECT 
            json_extract(p.data, '$.tool') as tool,
            substr(json_extract(p.data, '$.state.input'), 1, 300) as input_preview,
            count(*) as n
        FROM message m
        JOIN part p ON p.message_id = m.id
        WHERE json_extract(m.data, '$.role') = 'assistant'
          AND json_extract(p.data, '$.type') = 'tool'
          AND m.session_id IN ({placeholders})
        GROUP BY tool, input_preview
        ORDER BY n DESC
        LIMIT 30
    """, session_ids)
    
    results = cursor.fetchall()
    print("\nAIS System tool usage patterns:")
    for r in results:
        tool = r[0] or "unknown"
        preview = (r[1] or "")[:150]
        count = r[2]
        if count > 1:
            print(f"  {count}x: {tool} - {preview}...")

conn.close()
