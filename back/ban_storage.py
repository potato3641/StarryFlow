import json
import os

BAN_LIST_FILE = "banned_ips.json"

def load_ban_list() -> set[str]:
    if os.path.exists(BAN_LIST_FILE):
        try:
            with open(BAN_LIST_FILE, "r") as f:
                return set(json.load(f))
        except json.JSONDecodeError:
            return set()
    return set()

def save_ban_list(banned_ips: set[str]):
    with open(BAN_LIST_FILE, "w") as f:
        json.dump(list(banned_ips), f)

banned_ips = load_ban_list()
