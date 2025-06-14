import sys, json, random, pathlib

num_games = int(sys.argv[1]) if len(sys.argv) > 1 else 1
root = pathlib.Path(__file__).resolve().parent
out_dir = root / 'ai_data'
out_dir.mkdir(exist_ok=True)
file_path = out_dir / 'games.json'

try:
    existing = json.load(file_path.open()) if file_path.exists() else []
except Exception:
    existing = []

for i in range(num_games):
    # placeholder game with random winner
    existing.append({
        'id': len(existing) + 1,
        'winner': random.choice(['white', 'black']),
        'moves': random.randint(20, 60)
    })

with file_path.open('w') as f:
    json.dump(existing, f)

print(f"saved {num_games} games")
