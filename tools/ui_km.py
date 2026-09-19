# -*- coding: utf-8 -*-
"""Translate Gauzy UI strings en -> km via Gemini (batched, cached, resumable).

- source : packages/ui-core/i18n/assets/i18n/en.json  (nested, ~5828 leaves)
- output : packages/ui-core/i18n/assets/i18n/km.json  (same structure)
- cache  : tools/ui_cache.km.json  (md5(value) -> km; only successful lines)
- rule   : {{placeholder}} tokens are PROTECTED (byte-identical).
           Values with no latin/CJK text pass through unchanged.
"""
import os, re, sys, json, time, hashlib, urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EN = os.path.join(BASE, "packages/ui-core/i18n/assets/i18n/en.json")
OUT = os.path.join(BASE, "packages/ui-core/i18n/assets/i18n/km.json")
CACHE = os.path.join(BASE, "tools/ui_cache.km.json")
KEYF = os.path.join(BASE, "tools/gem_key.txt")

GAP = float(os.environ.get("UI_GAP_GEM", "5.0"))   # seconds between API batches (stay under 20 RPM)
MODEL = os.environ.get("I18N_GEM_MODEL", "gemini-flash-latest")
BATCH = int(os.environ.get("UI_BATCH", "25"))
NUM = re.compile(r"^\s*(\d{1,4})[:.\)]\s?")
PLACE = re.compile(r"\{\{[^}]*\}\}")

def log(m):
    line = "[%s] %s" % (time.strftime("%m-%d %H:%M:%S"), m)
    print(line, flush=True)

def key():
    return open(KEYF, encoding="utf-8").read().strip()

def call_gemini(payload, tries=5):
    for a in range(tries):
        try:
            body = json.dumps({
                "contents": [{"parts": [{"text": payload}]}],
                "generationConfig": {"temperature": 0.2,
                                     "maxOutputTokens": 16000,
                                     "thinkingConfig": {"thinkingBudget": 0}}}).encode()
            req = urllib.request.Request(
                "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent",
                data=body, headers={"Content-Type": "application/json",
                                    "X-goog-api-key": key()})
            r = json.loads(urllib.request.urlopen(req, timeout=180).read().decode())
            c = r["candidates"][0]
            s = (c["content"]["parts"][0].get("text") or "").strip()
            if c.get("finishReason") == "MAX_TOKENS" or not s:
                raise RuntimeError("truncated/empty")
            return s
        except Exception as e:
            code = getattr(e, "code", None)
            if code == 429:
                wait = 75 * (a + 1)              # 75,150,225,300,375s
                log("  429 — waiting %ds" % wait)
                time.sleep(wait); continue
            log("  err %s — retry in 15s" % e)
            time.sleep(15)
    return None

def flatten(obj, prefix=""):
    for k, v in obj.items():
        p = prefix + "." + k if prefix else k
        if isinstance(v, dict):
            yield from flatten(v, p)
        else:
            yield p, v

def protect(v):
    spans = []
    def rep(m):
        spans.append(m.group(0))
        return "ZZ%dZZ" % (len(spans) - 1)
    return PLACE.sub(rep, v), spans

def restore(v, spans):
    def rep(m):
        i = int(m.group(1))
        return spans[i] if i < len(spans) else m.group(0)
    return re.sub(r"ZZ(\d+)ZZ", rep, v)

def batch(values):
    """values: list of masked strings; returns list of translated masked strings or None."""
    payload = ("Translate the following Simplified-English UI strings into Khmer (Cambodian). "
               "Return the SAME numbered list, one line each, format 'N: translation'. "
               "Keep ALL {{...}} placeholder tokens byte-identical, keep numbers and "
               "proper nouns as-is, keep tone short and natural for a business app UI. "
               "Output ONLY the numbered lines.\n"
               + "\n".join("%d: %s" % (i + 1, v) for i, v in enumerate(values)))
    got = call_gemini(payload)
    if got is None:
        return None
    parsed = {}
    for ln in got.split("\n"):
        m = NUM.match(ln)
        if m:
            n = int(m.group(1))
            if 1 <= n <= len(values):
                parsed.setdefault(n, []).append(ln[m.end():])
    out = []
    for i in range(len(values)):
        v = parsed.get(i + 1)
        if not v or len(v) != 1:
            return None
        out.append(v[0])
    # verify placeholders survived
    for orig, tr in zip(values, out):
        if sorted(re.findall(r"ZZ\d+ZZ", orig)) != sorted(re.findall(r"ZZ\d+ZZ", tr)):
            return None
    return out

def main():
    en = json.load(open(EN, encoding="utf-8"))
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    leaves = list(flatten(en))
    todo = []
    for p, v in leaves:
        if not isinstance(v, str) or not v.strip():
            continue
        k = hashlib.md5(v.encode("utf-8")).hexdigest()[:16]
        if k in cache:
            continue
        masked, spans = protect(v)
        if not re.search(r"[A-Za-z]", masked):   # nothing to translate
            cache[k] = v
            continue
        todo.append((p, v, k, masked, spans))
    log("%d leaves, %d cached, %d to translate" % (len(leaves), len(leaves) - len(todo), len(todo)))

    done = 0
    i = 0
    while i < len(todo):
        chunk = todo[i:i + BATCH]
        res = batch([c[3] for c in chunk])
        if res is None:
            log("batch at %d failed — sleeping 120s" % i)
            time.sleep(120)
            res = batch([c[3] for c in chunk])
            if res is None:
                log("giving up on this batch, moving on")
                i += 1   # try next single line
                continue
        for (p, v, k, masked, spans), tr in zip(chunk, res):
            final = restore(tr, spans)
            if "{{" in v and not re.search(r"\{\{[^}]*\}\}", final):
                cache[k] = v  # placeholder lost -> keep original, retry later
                continue
            cache[k] = final
            done += 1
        i += len(chunk)
        json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
        if i % 100 < BATCH:
            log("%d/%d translated" % (done, len(todo)))
        time.sleep(GAP)
    json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)

    # rebuild km.json
    def build(obj):
        out = {}
        for k, v in obj.items():
            if isinstance(v, dict):
                out[k] = build(v)
            else:
                ck = hashlib.md5(v.encode("utf-8")).hexdigest()[:16]
                out[k] = cache.get(ck, v)
        return out
    km = build(en)
    json.dump(km, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    kml = list(flatten(km))
    en_by_path = dict(leaves)
    untranslated = 0
    for p, v in kml:
        if p in en_by_path and v == en_by_path[p] and re.search(r"[A-Za-z]{4,}", v):
            untranslated += 1
    log("WROTE km.json (%d leaves, ~%d still-English)" % (len(kml), untranslated))

if __name__ == "__main__":
    main()
