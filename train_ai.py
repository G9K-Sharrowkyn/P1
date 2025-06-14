import os
import json
import random
from datetime import datetime
import torch
import torch.nn as nn
import torch.nn.functional as F

MODEL_DIR = 'ai_data'
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pt')
GAMES_PATH = os.path.join(MODEL_DIR, 'games.json')

class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        residual = x
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.bn2(self.conv2(x))
        return F.relu(x + residual)

class HuangjunNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.input_channels = 14
        self.conv1 = nn.Conv2d(self.input_channels, 128, kernel_size=3, padding=1)
        self.res_blocks = nn.Sequential(*[ResidualBlock(128) for _ in range(10)])
        self.policy_conv = nn.Conv2d(128, 2, kernel_size=1)
        self.policy_fc = nn.Linear(2 * 9 * 9, 1000)
        self.value_conv = nn.Conv2d(128, 1, kernel_size=1)
        self.value_fc1 = nn.Linear(1 * 9 * 9, 256)
        self.value_fc2 = nn.Linear(256, 1)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = self.res_blocks(x)
        p = F.relu(self.policy_conv(x))
        p = p.view(-1, 2 * 9 * 9)
        p = self.policy_fc(p)
        v = F.relu(self.value_conv(x))
        v = v.view(-1, 1 * 9 * 9)
        v = F.relu(self.value_fc1(v))
        v = torch.tanh(self.value_fc2(v))
        return p, v

def self_play_games(net, games=10):
    """Run simple self-play and return mock game records."""
    optimizer = torch.optim.Adam(net.parameters(), lr=0.001)
    records = []
    for g in range(games):
        board = torch.randn(1, net.input_channels, 9, 9)
        policy_target = torch.randn(1, 1000)
        value_target = torch.randn(1, 1)
        policy_pred, value_pred = net(board)
        loss_p = F.mse_loss(policy_pred, policy_target)
        loss_v = F.mse_loss(value_pred, value_target)
        loss = loss_p + loss_v
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        record = {
            "id": f"{datetime.utcnow().isoformat()}_{g}",
            "winner": random.choice(["white", "black"]),
            "moves": [f"m{n}" for n in range(random.randint(4, 10))],
        }
        records.append(record)

    print('completed training step')
    return records

if __name__ == '__main__':
    os.makedirs(MODEL_DIR, exist_ok=True)
    model = HuangjunNet()
    if os.path.exists(MODEL_PATH):
        model.load_state_dict(torch.load(MODEL_PATH))
    records = self_play_games(model, games=10)
    torch.save(model.state_dict(), MODEL_PATH)
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
