"""
FreelanceAI - Web Dev Client Acquisition Tool
Powered by Ollama (free, local)
"""
import sqlite3, json, re, csv, threading, shutil
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify, Response, stream_with_context, send_from_directory
import requests as req

BASE   = Path(__file__).parent
DATA   = BASE / "data"
STATIC = BASE / "static"
DATA.mkdir(exist_ok=True)
DB     = DATA / "app.db"

OLLAMA = "http://localhost:11434/api/generate"
MODEL  = "llama3"

app = Flask(__name__, static_folder=str(STATIC), static_url_path="")

# ── DB ─────────────────────────────────────────────────────────────────────
def init_db():
    c = sqlite3.connect(DB)
    c.executescript("""
        CREATE TABLE IF NOT EXISTS profile(key TEXT PRIMARY KEY, value TEXT);
        CREATE TABLE IF NOT EXISTS prospects(
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT,
            platform TEXT,
            bio      TEXT,
            score    INTEGER DEFAULT 0,
            signal   TEXT,
            niche    TEXT,
            pain     TEXT,
            status   TEXT DEFAULT 'new',
            notes    TEXT DEFAULT '',
            created  TEXT
        );
        CREATE TABLE IF NOT EXISTS emails(
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            prospect_id INTEGER,
            subject   TEXT,
            body      TEXT,
            style     TEXT,
            created   TEXT
        );
    """)
    c.commit(); c.close()

def qry(sql, params=(), one=False, write=False):
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    cur = c.execute(sql, params)
    if write: c.commit(); c.close(); return
    rows = cur.fetchone() if one else cur.fetchall()
    c.close()
    return dict(rows) if one and rows else ([dict(r) for r in rows] if not one else None)

# ── Ollama ──────────────────────────────────────────────────────────────────
def ollama_ok():
    try: return req.get("http://localhost:11434/api/tags", timeout=2).ok
    except: return False

def ai_stream(prompt, system=""):
    full = f"{system}\n\n{prompt}" if system else prompt
    try:
        with req.post(OLLAMA, json={"model":MODEL,"prompt":full,"stream":True},
                      stream=True, timeout=120) as r:
            for line in r.iter_lines():
                if not line: continue
                try:
                    d = json.loads(line)
                    t = d.get("response","")
                    if t: yield f"data:{json.dumps({'t':t})}\n\n"
                    if d.get("done"): break
                except: pass
    except Exception as e:
        yield f"data:{json.dumps({'t':f'[Ollama error: {e}]'})}\n\n"
    yield "data:[DONE]\n\n"

def ai_once(prompt, system=""):
    full = f"{system}\n\n{prompt}" if system else prompt
    try:
        r = req.post(OLLAMA, json={"model":MODEL,"prompt":full,"stream":False}, timeout=120)
        return r.json().get("response","").strip()
    except Exception as e:
        return f"[Error: {e}]"

def sse(gen):
    return Response(stream_with_context(gen),
                    mimetype="text/event-stream",
                    headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

# ── Scoring (no AI needed, instant) ────────────────────────────────────────
WEB_KEYWORDS = ["website","site","landing page","web design","slow site","no website",
                "need a website","redesign","ecommerce","online store","seo","wordpress",
                "shopify","wix","squarespace","web developer","web dev","frontend","backend",
                "bad website","ugly website","not mobile","conversion","leads","traffic"]

RED_FLAGS = ["agency","big team","already have dev","in-house developer","not looking",
             "no budget","free","intern","student","doing it myself"]

def score_bio(bio, name=""):
    text = bio.lower()
    hits  = [k for k in WEB_KEYWORDS if k in text]
    red   = [k for k in RED_FLAGS    if k in text]
    score = 40
    score += min(40, len(hits)*8)
    score -= min(35, len(red)*12)
    has_contact = bool(re.search(r"[\w.+-]+@[\w-]+\.\w+|https?://\S+|\+\d[\d\s-]{8,}", text))
    if has_contact: score += 8
    if len(bio) > 300: score += 5
    score = max(5, min(99, score))
    signal = "GREEN" if score >= 65 else ("YELLOW" if score >= 40 else "RED")
    pain   = hits[0].title() if hits else "Unknown pain point"
    reason = f"Matched: {', '.join(hits[:3])}" if hits else "No clear web dev buying signal"
    if red: reason += f" | Red flags: {', '.join(red[:2])}"
    return {"score":score, "signal":signal, "pain":pain, "reason":reason,
            "hits":hits[:6], "red":red[:3]}

# ── Onboarding questions ────────────────────────────────────────────────────
QUESTIONS = [
    {"key":"name",         "q":"What's your name?",                                                           "type":"text",   "placeholder":"e.g. Madhan"},
    {"key":"experience",   "q":"How long have you been doing web development professionally?",                 "type":"choice", "opts":["0–3 months","3–6 months","6–12 months","1–2 years","2+ years"]},
    {"key":"clients",      "q":"How many paying clients do you currently have?",                               "type":"choice", "opts":["0","1","2–3","4–6","7–10","10+"]},
    {"key":"monthly_rev",  "q":"What's your current monthly income from freelancing?",                         "type":"choice", "opts":["₹0","₹1k–₹10k","₹10k–₹30k","₹30k–₹60k","₹60k–₹1L","₹1L+"]},
    {"key":"dream_client", "q":"Describe your dream client. Who do you want to work with?",                    "type":"text",   "placeholder":"e.g. small restaurants in Chennai with no website"},
    {"key":"price_range",  "q":"What do you charge per project (or want to charge)?",                          "type":"choice", "opts":["Under ₹5k","₹5k–₹15k","₹15k–₹30k","₹30k–₹60k","₹60k–₹1L","₹1L+"]},
    {"key":"goal_clients", "q":"How many new clients do you want per month?",                                  "type":"choice", "opts":["1","2–3","4–5","6–10","10+"]},
    {"key":"dream_income", "q":"What monthly income would make you feel genuinely successful?",                "type":"choice", "opts":["₹30k","₹50k","₹1L","₹2L","₹3L–5L","₹5L+"]},
    {"key":"fear",         "q":"What's your biggest fear when reaching out to new clients?",                   "type":"choice", "opts":["Getting ignored","Not being good enough","Don't know what to say","Pricing too high","Finding the right clients","Imposter syndrome"]},
    {"key":"portfolio",    "q":"What's your current portfolio / proof situation?",                             "type":"choice", "opts":["Nothing yet","Personal projects only","1–2 real client results","Good results, not documented","Strong case studies + testimonials"]},
    {"key":"outreach",     "q":"What outreach style feels most natural to you?",                               "type":"choice", "opts":["Instagram DM","LinkedIn message","Cold email","WhatsApp","Mix of all"]},
    {"key":"usp",          "q":"What makes you different from other web devs? (Even a rough guess is fine)",   "type":"text",   "placeholder":"e.g. I focus on speed and conversion for local businesses"},
    {"key":"platforms",    "q":"Where do you plan to find clients?",                                           "type":"choice", "opts":["Instagram","LinkedIn","Cold email","Local businesses","Referrals","All of the above"]},
    {"key":"hours_week",   "q":"How many hours per week can you dedicate to finding new clients?",             "type":"choice", "opts":["1–2 hrs","3–5 hrs","5–10 hrs","10–20 hrs","Full time"]},
]

# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/")
def root():
    return send_from_directory(str(STATIC), "index.html")

@app.route("/api/status")
def status():
    profile = {r["key"]:r["value"] for r in (qry("SELECT key,value FROM profile") or [])}
    return jsonify({
        "ollama": ollama_ok(),
        "onboarded": "name" in profile and "dream_client" in profile,
        "name": profile.get("name",""),
        "profile": profile
    })

# Onboarding
@app.route("/api/questions")
def questions():
    return jsonify(QUESTIONS)

@app.route("/api/profile/save", methods=["POST"])
def save_profile():
    for k,v in (request.json or {}).items():
        qry("INSERT OR REPLACE INTO profile VALUES(?,?)", (k,v), write=True)
    return jsonify({"ok":True})

@app.route("/api/profile/get")
def get_profile():
    rows = qry("SELECT key,value FROM profile") or []
    return jsonify({r["key"]:r["value"] for r in rows})

@app.route("/api/profile/reset", methods=["POST"])
def reset_profile():
    qry("DELETE FROM profile", write=True)
    return jsonify({"ok":True})

# Prospect
@app.route("/api/prospect/score", methods=["POST"])
def prospect_score():
    d = request.json or {}
    result = score_bio(d.get("bio",""), d.get("name",""))
    return jsonify(result)

@app.route("/api/prospect/save", methods=["POST"])
def prospect_save():
    d = request.json or {}
    qry("""INSERT INTO prospects(name,platform,bio,score,signal,niche,pain,status,created)
           VALUES(?,?,?,?,?,?,?,?,?)""",
        (d.get("name","?"), d.get("platform",""), d.get("bio",""),
         d.get("score",0), d.get("signal",""), "Web Developer",
         d.get("pain",""), d.get("status","new"), datetime.now().isoformat()),
        write=True)
    return jsonify({"ok":True})

@app.route("/api/prospects")
def get_prospects():
    rows = qry("SELECT * FROM prospects ORDER BY score DESC") or []
    return jsonify(rows)

@app.route("/api/prospect/update", methods=["POST"])
def update_prospect():
    d = request.json or {}
    qry(f"UPDATE prospects SET status=?, notes=? WHERE id=?",
        (d.get("status","new"), d.get("notes",""), d["id"]), write=True)
    return jsonify({"ok":True})

@app.route("/api/prospect/delete", methods=["POST"])
def delete_prospect():
    qry("DELETE FROM prospects WHERE id=?", (request.json["id"],), write=True)
    return jsonify({"ok":True})

# Website Audit
@app.route("/api/audit", methods=["POST"])
def audit():
    d = request.json or {}
    url = d.get("url","").strip()
    if not url: return jsonify({"error":"No URL"}), 400
    if "://" not in url: url = "https://" + url

    # Fetch the page
    content = ""
    try:
        headers = {"User-Agent":"Mozilla/5.0"}
        r = req.get(url, headers=headers, timeout=15)
        raw = r.text[:12000]
        # Strip HTML tags
        clean = re.sub(r"<script[^>]*>.*?</script>","",raw,flags=re.S)
        clean = re.sub(r"<style[^>]*>.*?</style>","",clean,flags=re.S)
        clean = re.sub(r"<[^>]+>"," ",clean)
        clean = re.sub(r"\s+"," ",clean).strip()
        content = clean[:6000]
    except Exception as e:
        content = f"Could not fetch page: {e}"

    profile = {r["key"]:r["value"] for r in (qry("SELECT key,value FROM profile") or [])}
    my_price = profile.get("price_range","competitive rate")
    my_usp   = profile.get("usp","quality web development")

    system = "You are a brutally honest web developer and conversion expert auditing a potential client's website."
    prompt = f"""Audit this website for a freelance web developer looking to pitch their services.

URL: {url}
Page content: {content}

Give a structured audit with these exact sections:

## OVERALL SCORE: X/10

## TOP 5 PROBLEMS (most impactful first)
- Problem 1
- Problem 2
...

## QUICK WINS (things they can fix fast)
- Quick win 1
...

## MY PITCH ANGLE
One paragraph: how should I (a web dev charging {my_price}) position my pitch to this prospect based on what I found? My USP: {my_usp}

## OPENING LINE
Write one natural, specific opening message I can send them referencing a real problem I found.

Be specific. Reference actual things found on their site. No fluff."""

    return sse(ai_stream(prompt, system))

# Email Writer
@app.route("/api/email", methods=["POST"])
def write_email():
    d = request.json or {}
    profile = {r["key"]:r["value"] for r in (qry("SELECT key,value FROM profile") or [])}

    system = "You are a world-class cold outreach writer for freelancers. Write concise, human, high-converting messages."
    prompt = f"""Write a cold outreach message for a web developer.

MY DETAILS:
- Name: {profile.get('name','me')}
- USP: {profile.get('usp','I build fast, conversion-focused websites')}
- Price range: {profile.get('price_range','competitive')}
- Outreach style: {d.get('style', profile.get('outreach','DM'))}

PROSPECT:
- Name: {d.get('name','them')}
- Platform: {d.get('platform','')}
- Their pain point: {d.get('pain','')}
- Their bio/info: {d.get('bio','')[:400]}

RULES:
- Never start with "I hope" or "My name is"
- Lead with THEIR problem, not my pitch
- Max 5 sentences
- End with a soft yes/no question CTA
- Sound human, not salesy
- Style: {d.get('style','DM')}

{"Write SUBJECT LINE first (Subject: ...) then body." if "email" in d.get('style','').lower() else "Write as a short DM."}"""

    return sse(ai_stream(prompt, system))

# Bulk Email Generator
@app.route("/api/bulk-email", methods=["POST"])
def bulk_email():
    d = request.json or {}
    prospects = d.get("prospects", [])  # list of {name, platform, pain, bio}
    style = d.get("style", "DM")
    profile = {r["key"]:r["value"] for r in (qry("SELECT key,value FROM profile") or [])}

    if not prospects:
        return jsonify({"error": "No prospects provided"}), 400

    system = "You are a cold outreach expert. Generate personalized messages. Return ONLY valid JSON."
    prompt = f"""Generate personalized cold outreach {style} messages for a web developer.

MY DETAILS:
Name: {profile.get('name','me')} | USP: {profile.get('usp','')} | Price: {profile.get('price_range','')}

PROSPECTS (generate one message per prospect):
{json.dumps(prospects, indent=2)}

Return ONLY a JSON array like:
[
  {{"name":"prospect name","subject":"subject if email else empty","message":"the outreach message"}},
  ...
]

Rules: Lead with their pain, max 5 sentences, human tone, soft CTA at end."""

    result = ai_once(prompt, system)

    # Parse JSON from response
    try:
        match = re.search(r'\[.*\]', result, re.S)
        if match:
            messages = json.loads(match.group())
            return jsonify({"ok":True, "messages":messages})
        return jsonify({"ok":False, "raw":result})
    except:
        return jsonify({"ok":False, "raw":result})

# Negotiation Scripts
OBJECTIONS = {
    "too_expensive":    ("I can't afford it / too expensive", "price"),
    "think_about_it":   ("I need to think about it",          "delay"),
    "have_someone":     ("I already have a developer",         "competition"),
    "no_guarantee":     ("What results can you guarantee?",    "risk"),
    "do_it_myself":     ("I'll just do it myself / use Wix",   "diy"),
    "send_portfolio":   ("Send me your portfolio first",        "proof"),
    "too_busy":         ("I'm too busy right now",             "timing"),
    "custom":           ("Custom objection",                    "custom"),
}

@app.route("/api/negotiate", methods=["POST"])
def negotiate():
    d = request.json or {}
    objection_text = d.get("objection","")
    context        = d.get("context","")
    profile = {r["key"]:r["value"] for r in (qry("SELECT key,value FROM profile") or [])}

    system = f"You are a sales coach for freelance web developers. Give practical, word-for-word scripts."
    prompt = f"""Client said: "{objection_text}"

My offer context: {context or profile.get('price_range','')}
My name: {profile.get('name','me')}
My USP: {profile.get('usp','')}

Give me:

### WORD-FOR-WORD RESPONSE
(exactly what to say/type back)

### WHY THIS WORKS
(brief psychology)

### IF THEY'RE STILL RESISTANT
(one follow-up message)

### WHAT NOT TO SAY
(2-3 mistakes to avoid)

Keep it practical and direct. No fluff."""

    return sse(ai_stream(prompt, system))

# ICP Generator
@app.route("/api/icp", methods=["POST"])
def gen_icp():
    profile = {r["key"]:r["value"] for r in (qry("SELECT key,value FROM profile") or [])}
    if not profile:
        return jsonify({"error":"Complete onboarding first"}), 400

    system = "You are a business strategy expert for freelancers."
    prompt = f"""Based on this web developer's profile, write their Ideal Client Profile (ICP):

{json.dumps(profile, indent=2)}

Write 3 short sections:
1. WHO THEY ARE (describe the perfect client in detail)
2. WHERE TO FIND THEM (specific platforms, search terms, hashtags)
3. RED FLAGS TO AVOID (types of clients to stay away from)

Be specific to the web dev niche. Use real examples."""

    return sse(ai_stream(prompt, system))

# Export CSV
@app.route("/api/export")
def export_csv():
    rows = qry("SELECT name,platform,score,signal,pain,status,notes,created FROM prospects ORDER BY score DESC") or []
    path = DATA / "prospects_export.csv"
    with open(path,"w",newline="") as f:
        w = csv.writer(f)
        w.writerow(["Name","Platform","Score","Signal","Pain Point","Status","Notes","Date"])
        for r in rows:
            w.writerow([r["name"],r["platform"],r["score"],r["signal"],r["pain"],r["status"],r["notes"],r["created"][:10]])
    from flask import send_file
    return send_file(str(path), as_attachment=True, download_name="prospects.csv")

if __name__ == "__main__":
    init_db()
    print("\n🚀 FreelanceAI starting at http://localhost:5000")
    print("   Make sure Ollama is running: ollama serve\n")
    app.run(host="0.0.0.0", port=5000, debug=False)
