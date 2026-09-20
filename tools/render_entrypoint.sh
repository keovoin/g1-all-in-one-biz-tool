#!/usr/bin/env bash
# Sastra Solution — Render container entrypoint (single service: web :$PORT w/ /api proxy -> API :3000)
set -u
cd /app

DATA_DIR=/data
DB_FILE=$DATA_DIR/gauzy.sqlite3
APP_DB=/app/apps/api/data/gauzy.sqlite3

# --- persistent-disk bootstrap -------------------------------------------------
if [ -f "$DB_FILE" ]; then
  echo "[entrypoint] persistent DB found — restoring into app dir"
  cp "$DB_FILE" "$APP_DB"
  rm -f "$APP_DB-wal" "$APP_DB-shm"
else
  echo "[entrypoint] first boot — image DB -> persistent disk"
  mkdir -p "$DATA_DIR"
  cp "$APP_DB" "$DB_FILE"
  rm -f "$DB_FILE-wal" "$DB_FILE-shm"
fi
mkdir -p "$DATA_DIR/uploads"

snapshot() {
  node -e "
    try {
      const db = require('better-sqlite3')('$APP_DB');
      db.pragma('wal_checkpoint(TRUNCATE)');
      db.close();
      require('fs').copyFileSync('$APP_DB', '$DB_FILE');
      console.log('[sync] snapshot OK');
    } catch (e) { console.error('[sync] ' + e.message); }
  " >/dev/null 2>&1 || true
}

sync_loop() { while true; do sleep 60; snapshot; done; }
sync_loop &
SYNC_PID=$!

# --- web first (serves / = static + /api proxy; survives API restarts) --------
node tools/serve_web_render.js > /tmp/web.log 2>&1 &
WEB_PID=$!

# --- API -----------------------------------------------------------------------
export NODE_OPTIONS=--max-old-space-size=384
node dist/apps/api/main.js > /tmp/api.log 2>&1 &
API_PID=$!

for i in $(seq 1 300); do
  if node -e "fetch('http://127.0.0.1:3000/api/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "[entrypoint] API healthy after ${i}s"
    break
  fi
  if ! kill -0 $API_PID 2>/dev/null; then
    echo "[entrypoint] API process DIED — last 100 log lines:"
    tail -n 100 /tmp/api.log
    exit 1
  fi
  sleep 1
done

# forward app logs to container stdout (Render runtime logs)
tail -n +1 -F /tmp/api.log 2>/dev/null | sed 's/^/[api] /' &
tail -n +1 -F /tmp/web.log 2>/dev/null | sed 's/^/[web] /' &

shutdown() {
  echo "[entrypoint] shutting down — final snapshot"
  kill $API_PID 2>/dev/null
  sleep 3
  kill $SYNC_PID 2>/dev/null
  snapshot
  kill $WEB_PID 2>/dev/null
  exit 0
}
trap shutdown TERM INT

wait $API_PID
