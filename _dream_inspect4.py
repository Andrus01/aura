import sqlite3, json, os

db_path = os.path.expanduser(r"~\.local\share\mimocode\mimocode.db")
db = sqlite3.connect(db_path)
db.row_factory = sqlite3.Row
cur = db.cursor()

# Check the project query session
sid = 'ses_0bd7fb2e4ffe4e1CMYuY9v7C52'
print(f"=== SESSION {sid} - Projekti küsimus ===")
cur.execute("SELECT id, agent_id, data FROM message WHERE session_id = ? ORDER BY time_created", (sid,))
msgs = cur.fetchall()
for m in msgs:
    d = json.loads(m['data'])
    role = d.get('role', '?')
    cur.execute("SELECT data FROM part WHERE message_id = ? ORDER BY time_created", (m['id'],))
    parts = cur.fetchall()
    for p in parts:
        pd = json.loads(p['data'])
        ptype = pd.get('type', '?')
        if ptype == 'text':
            text = pd.get('text', '')
            print(f"\n[{role}] TEXT ({len(text)} chars):")
            print(text[:3000])
        elif ptype == 'tool':
            tool = pd.get('tool', '?')
            state = pd.get('state', {})
            out = state.get('output', '')
            if isinstance(out, str):
                out = out[:1000]
            print(f"\n[{role}] TOOL:{tool}")
            print(f"  output: {out}")

# Check the distill session for patterns
sid2 = 'ses_0bd7fb27cffeTxjdRSpo1Uf611'
print(f"\n\n=== SESSION {sid2} - Auto Distill (last 5 assistant messages) ===")
cur.execute("SELECT id, agent_id, data FROM message WHERE session_id = ? AND json_extract(data, '$.role') = 'assistant' ORDER BY time_created DESC LIMIT 5", (sid2,))
msgs = cur.fetchall()
for m in reversed(msgs):
    cur.execute("SELECT data FROM part WHERE message_id = ? AND json_extract(data, '$.type') = 'text' ORDER BY time_created", (m['id'],))
    parts = cur.fetchall()
    for p in parts:
        pd = json.loads(p['data'])
        text = pd.get('text', '')
        if text.strip():
            print(f"\n[assistant] TEXT ({len(text)} chars):")
            print(text[:2000])

db.close()
