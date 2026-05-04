---
title: "PPO CartPole 复现笔记"
description: "用最小代码量复现 PPO 在 CartPole-v1 上的训练，并把每次踩坑都记录下来。"
date: 2026-05-02
tags: ["PPO", "强化学习", "PyTorch", "CartPole"]
category: "RL"
series: "PPO 实验"
seriesOrder: 1
draft: false
---

复现 PPO 不是为了刷分，而是为了搞清楚每一步在做什么。这一篇是系列的第一篇，先把骨架立起来。

## 目标

- 使用 PyTorch 在 `CartPole-v1` 上跑通 PPO。
- 训练曲线稳定，500 步以内 reward 收敛到 ~475。
- 代码总行数控制在 250 行以内（不含注释和测试）。

## 关键超参

| 名称 | 值 | 备注 |
| --- | --- | --- |
| `gamma` | 0.99 | 折扣因子 |
| `lambda` | 0.95 | GAE |
| `clip_eps` | 0.2 | 裁剪范围 |
| `lr` | 3e-4 | Adam |
| `epochs` | 10 | 每轮 update 重用次数 |

## 核心公式

PPO 的目标函数（clipped surrogate）：

$$
L^{CLIP}(\theta) = \mathbb{E}_t \left[ \min\left( r_t(\theta) \hat{A}_t,\; \mathrm{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t \right) \right]
$$

其中重要性比 \( r_t(\theta) = \dfrac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{\text{old}}}(a_t \mid s_t)} \)。

GAE 优势估计：

$$
\hat{A}_t = \sum_{l=0}^{T-t-1} (\gamma \lambda)^l \delta_{t+l}, \quad \delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)
$$

## 最小训练循环

```python
for update in range(num_updates):
    obs, actions, logp_old, returns, advantages = rollout(env, actor_critic, steps=2048)

    for _ in range(epochs):
        for batch in minibatches(obs, actions, logp_old, returns, advantages):
            logits, values = actor_critic(batch.obs)
            dist = Categorical(logits=logits)
            logp = dist.log_prob(batch.actions)
            ratio = (logp - batch.logp_old).exp()

            surrogate1 = ratio * batch.advantages
            surrogate2 = ratio.clamp(1 - clip_eps, 1 + clip_eps) * batch.advantages
            policy_loss = -torch.min(surrogate1, surrogate2).mean()
            value_loss = (values.squeeze(-1) - batch.returns).pow(2).mean()
            entropy_bonus = dist.entropy().mean()

            loss = policy_loss + 0.5 * value_loss - 0.01 * entropy_bonus
            optim.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(actor_critic.parameters(), 0.5)
            optim.step()
```

## 我踩过的坑

1. **优势没归一化**：reward 一直在 30-50 徘徊。加上 `(adv - adv.mean()) / (adv.std() + 1e-8)` 之后立刻起飞。
2. **value loss 系数过大**：早期 critic 主导梯度，policy 几乎不动。0.5 是合理起点。
3. **epoch 设过多导致策略漂移**：超过 15 次基本必崩。

## 下一步

- 加 KL 约束，对比 clipped 版本与 KL 版本的稳定性。
- 把 CartPole 换成 LunarLander，看看是否需要重新调参。
- 写一个最小可视化把 advantages、value、policy loss 画到一张图。
