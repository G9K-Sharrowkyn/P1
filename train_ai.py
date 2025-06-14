import os
import json
import random
import time
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'ai_data')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.json')
GAMES_PATH = os.path.join(MODEL_DIR, 'games.json')


def self_play_games(games=10):
    """Simulate self-play games and return mock records."""
    records = []
    for g in range(games):
        print(f'start game {g + 1}/{games}')
        time.sleep(0.1)  # simulate thinking
        record = {
            "id": f"{datetime.utcnow().isoformat()}_{g}",
            "winner": random.choice(["white", "black"]),
            "moves": [f"m{n}" for n in range(random.randint(4, 10))],
        }
        records.append(record)
        print(f'finished game {g + 1}/{games}')
    print('completed training step')
    return records


def load_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'r') as f:
            print('existing weights loaded')
            return json.load(f)
    return {}


def save_model(model):
    with open(MODEL_PATH, 'w') as f:
        json.dump(model, f)


if __name__ == '__main__':
    os.makedirs(MODEL_DIR, exist_ok=True)
    print('loading model...')
    model = load_model()
    model['last_trained'] = datetime.utcnow().isoformat()
    records = self_play_games(10)
    save_model(model)
    try:
        if os.path.exists(GAMES_PATH):
            with open(GAMES_PATH, 'r') as f:
                data = json.load(f)
        else:
            data = []
        data.extend(records)
        with open(GAMES_PATH, 'w') as f:
            json.dump(data, f)
    except Exception as e:
        print('failed to save games', e)
    print('model saved to', MODEL_PATH)
    print('training run complete')
