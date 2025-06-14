import sys, json, random, pathlib

# number of games to generate per batch ("concurrent")
num_games = int(sys.argv[1]) if len(sys.argv) > 1 else 1
# number of times to repeat that batch
num_repeats = int(sys.argv[2]) if len(sys.argv) > 2 else 1
root = pathlib.Path(__file__).resolve().parent
out_dir = root / 'ai_data'
out_dir.mkdir(exist_ok=True)
file_path = out_dir / 'games.json'

try:
    existing = json.load(file_path.open()) if file_path.exists() else []
except Exception:
    existing = []

total = num_games * num_repeats

for _ in range(num_repeats):
    for _ in range(num_games):
        move_count = random.randint(20, 60)
        moves = [f"m{i+1}" for i in range(move_count)]
        existing.append({
            'id': len(existing) + 1,
            'winner': random.choice(['white', 'black']),
            'moves': moves
        })

with file_path.open('w') as f:
    json.dump(existing, f)

print(f"saved {total} games")
