import sqlite3
import json
from datetime import datetime, timedelta

db_path = "C:/Users/indre/.local/share/mimocode/mimocode.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get sessions from the last 30 days
thirty_days_ago = int((datetime.now() - timedelta(days=30)).timestamp() * 1000)

# Query for repeated tool usage patterns
cursor.execute("""
    SELECT 
        json_extract(p.data, '$.tool') as tool,
        substr(json_extract(p.data, '$.state.input'), 1, 200) as input_preview,
        count(*) as n
    FROM message m
    JOIN part p ON p.message_id = m.id
    WHERE json_extract(m.data, '$.role') = 'assistant'
      AND json_extract(p.data, '$.type') = 'tool'
      AND m.time_created > ?
    GROUP BY tool, input_preview
    ORDER BY n DESC
    LIMIT 50
""", (thirty_days_ago,))

results = cursor.fetchall()
print("Repeated tool usage patterns (top 50):")
for r in results:
    tool = r[0] or "unknown"
    preview = (r[1] or "")[:100]
    count = r[2]
    if count > 1:  # Only show repeated patterns
        print(f"  {count}x: {tool} - {preview}...")

conn.close()
