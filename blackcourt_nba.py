import time
import requests
import json
from datetime import datetime

# ==========================================
# PROJECT BLACKCOURT: NBA SENTINEL
# ==========================================
# KEY RING (3 LIVE KEYS LOADED)
API_KEYS = [
    "f5def59507f697c7356a0ae066d5e0f7",
    "fc5edbb569c8e9d4d0c144bdcba8b2d1",
    "ffa4b016116d6e93d5bca65bc3aee564"
]
KEY_INDEX = 0

# TELEGRAM UPLINK
TELEGRAM_TOKEN = "7683647496:AAGul_zBFacqBNbrdRIS2Ob3DeURzhBsxRo"
TELEGRAM_CHAT_ID = "-1003680453283"

# THRESHOLDS (The "Blackcourt" Logic)
SPREAD_MOVE_ALERT = 1.5  # If spread shifts by 1.5 points
TOTAL_MOVE_ALERT = 2.5   # If total points shifts by 2.5 points

# MEMORY
OPENING_LINES = {}

print("\033[1;35m[PROJECT BLACKCOURT] INITIALIZING NBA DEEP SCAN...\033[0m")

def get_active_key():
    global KEY_INDEX
    return API_KEYS[KEY_INDEX]

def rotate_key():
    global KEY_INDEX
    KEY_INDEX = (KEY_INDEX + 1) % len(API_KEYS)
    print(f"\033[1;33m[SYSTEM] KEY EXHAUSTED. ROTATING TO INDEX {KEY_INDEX}...\033[0m")

def send_telegram(msg):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    try:
        requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "Markdown"})
    except: pass

def scan_nba():
    key = get_active_key()
    # We scan Spreads and Totals (The "Sharp" Markets)
    url = f"https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=spreads,totals&apiKey={key}"
    
    try:
        response = requests.get(url)
        
        # FAILOVER LOGIC
        if response.status_code == 401 or response.status_code == 429:
            rotate_key()
            return # Retry next cycle
            
        data = response.json()
        print(f"[{datetime.now().strftime('%H:%M')}] Analyzing {len(data)} NBA Fixtures...")

        for game in data:
            game_id = game['id']
            matchup = f"{game['home_team']} vs {game['away_team']}"
            
            if not game['bookmakers']: continue
            bookie = game['bookmakers'][0]
            
            current_spread = None
            current_total = None
            
            for market in bookie['markets']:
                if market['key'] == 'spreads':
                    current_spread = float(market['outcomes'][0]['point'])
                elif market['key'] == 'totals':
                    current_total = float(market['outcomes'][0]['point'])

            # MEMORY LOGIC
            if game_id not in OPENING_LINES:
                OPENING_LINES[game_id] = {'spread': current_spread, 'total': current_total}
                continue

            # ANALYSIS LOGIC
            old_spread = OPENING_LINES[game_id]['spread']
            old_total = OPENING_LINES[game_id]['total']

            # 1. CHECK SPREAD MOVEMENT
            if current_spread is not None and old_spread is not None:
                diff = abs(current_spread - old_spread)
                if diff >= SPREAD_MOVE_ALERT:
                    msg = f"👁️ *BLACKCOURT DETECTED: SPREAD SHIFT*\n🏀 {matchup}\n📉 Line Moved: {old_spread} ➔ {current_spread}\n⚠️ *Intel:* Heavy volume on one side."
                    send_telegram(msg)
                    print(f"\033[1;31m[ALERT] SPREAD SHIFT: {matchup}\033[0m")
                    OPENING_LINES[game_id]['spread'] = current_spread

            # 2. CHECK TOTAL MOVEMENT
            if current_total is not None and old_total is not None:
                diff = abs(current_total - old_total)
                if diff >= TOTAL_MOVE_ALERT:
                    direction = "DOWN" if current_total < old_total else "UP"
                    intel = "Star Player Likely OUT" if direction == "DOWN" else "Pace Up / Defense Out"
                    
                    msg = f"👁️ *BLACKCOURT DETECTED: TOTAL {direction}*\n🏀 {matchup}\n📉 Line Moved: {old_total} ➔ {current_total}\n⚠️ *Intel:* {intel}"
                    send_telegram(msg)
                    print(f"\033[1;31m[ALERT] TOTAL SHIFT: {matchup}\033[0m")
                    OPENING_LINES[game_id]['total'] = current_total

    except Exception as e:
        print(f"[ERROR] Scan Failed: {e}")

if __name__ == "__main__":
    send_telegram("👁️ *PROJECT BLACKCOURT: NBA SENTINEL ONLINE*")
    while True:
        scan_nba()
        time.sleep(120) # Scan every 2 minutes
