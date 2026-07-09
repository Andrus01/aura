import sqlite3, json, os

db_path = os.path.expanduser(r"~\.local\share\mimocode\mimocode.db")
db = sqlite3.connect(db_path)
db.row_factory = sqlite3.Row
cur = db.cursor()

# Get all aura sessions
cur.execute("SELECT id, directory, title, time_created FROM session WHERE directory = 'C:\\_AI\\aura' ORDER BY time_created DESC")
sessions = cur.fetchall()
print("=== AURA SESSIONS ===")
for s in sessions:
    print(f"  {s['id']} | {s['title'][:100]} | {s['time_created']}")

# Get messages for each session
for s in sessions:
    sid = s['id']
    print(f"\n=== SESSION {sid} ({s['title'][:60]}) ===")
    cur.execute("SELECT id, agent_id, data FROM message WHERE session_id = ? ORDER BY time_created", (sid,))
    msgs = cur.fetchall()
    print(f"  Total messages: {len(msgs)}")
    for m in msgs:
        d = json.loads(m['data'])
        role = d.get('role', '?')
        agent = m['agent_id'] or 'main'
        # Get first part preview
        cur.execute("SELECT data FROM part WHERE message_id = ? ORDER BY time_created LIMIT 1", (m['id'],))
        part = cur.fetchone()
        preview = ''
        if part:
            pd = json.loads(part['data'])
            if pd.get('type') == 'text':
                preview = pd.get('text', '')[:200]
            elif pd.get('type') == 'tool':
                preview = f"TOOL:{pd.get('tool','?')}"
            elif pd.get('type') == 'checkpoint':
                preview = 'CHECKPOINT'
        print(f"  [{role}] agent={agent}: {preview[:150]}")

db.close()
