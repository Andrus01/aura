import sqlite3, json, os

db_path = os.path.expanduser(r"~\.local\share\mimocode\mimocode.db")
db = sqlite3.connect(db_path)
db.row_factory = sqlite3.Row
cur = db.cursor()

# Get details for the main build session
sid = 'ses_0bd8edc69ffe9GD2Vb5gIRlrXk'
print(f"=== SESSION {sid} - Full parts ===")
cur.execute("SELECT id, message_id, data FROM part WHERE session_id = ? ORDER BY time_created", (sid,))
parts = cur.fetchall()
for p in parts:
    pd = json.loads(p['data'])
    ptype = pd.get('type', '?')
    if ptype == 'text':
        text = pd.get('text', '')
        print(f"\n[TEXT msg={p['message_id']}] ({len(text)} chars)")
        print(text[:2000])
        if len(text) > 2000:
            print(f"... ({len(text)} total chars)")
    elif ptype == 'tool':
        tool = pd.get('tool', '?')
        state = pd.get('state', {})
        inp = state.get('input', {})
        out = state.get('output', '')
        if isinstance(out, dict):
            out = json.dumps(out)[:500]
        elif isinstance(out, str):
            out = out[:500]
        print(f"\n[TOOL:{tool} msg={p['message_id']}]")
        if tool == 'write':
            print(f"  file: {inp.get('file_path', '?')}")
            content = inp.get('content', '')
            print(f"  content preview: {content[:300]}")
        elif tool == 'bash':
            print(f"  cmd: {str(inp.get('command', ''))[:200]}")
            print(f"  output: {str(out)[:300]}")
        elif tool == 'read':
            print(f"  file: {inp.get('file_path', '?')}")
        elif tool == 'edit':
            print(f"  file: {inp.get('file_path', '?')}")
        else:
            print(f"  input: {str(inp)[:300]}")
            print(f"  output preview: {str(out)[:300]}")
    elif ptype == 'step-start':
        print(f"\n[STEP-START msg={p['message_id']}]")
    elif ptype == 'step-finish':
        tokens = pd.get('tokens', '?')
        print(f"\n[STEP-FINISH msg={p['message_id']}] tokens={tokens}")
    elif ptype == 'checkpoint':
        print(f"\n[CHECKPOINT msg={p['message_id']}]")
    else:
        print(f"\n[{ptype} msg={p['message_id']}] preview={str(pd)[:200]}")

db.close()
