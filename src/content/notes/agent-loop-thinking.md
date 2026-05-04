---
title: "把 Agent 当成一个 while 循环来理解"
description: "在被各种 framework 绕晕之前，先把 Agent 的本质拆成最朴素的循环。"
date: 2026-04-28
tags: ["Agent", "LLM", "工程"]
category: "Agent"
draft: false
---

每次看一个新的 Agent framework，我都习惯先把它在脑子里"折回去"——折回到那个最朴素的 while 循环。

## 最小骨架

```python
def run_agent(task: str, tools: list[Tool], llm: LLM, max_steps: int = 20) -> str:
    messages = [system_prompt(tools), {"role": "user", "content": task}]
    for step in range(max_steps):
        action = llm.next_action(messages)
        if action.kind == "final":
            return action.text
        result = invoke(tools, action.tool, action.args)
        messages.append({"role": "tool", "name": action.tool, "content": result})
    return "(reached max steps)"
```

抽掉 framework 之后，Agent 就是这五件事：

1. 维护一段对话历史。
2. 让模型基于历史决定下一步：要么"调工具"，要么"出最终答复"。
3. 调工具，把结果塞回历史。
4. 继续，直到模型说"我说完了"或步数用尽。
5. 中间出错就回退、重试或终止。

## 为什么这么看待

- **调试容易**：当 Agent 表现奇怪，先打印 messages，看模型每一步实际看到了什么。
- **抽象层次清晰**：framework 提供的所有花哨功能（planner、reflector、router、memory）都可以映射到"修改 messages"或"修改决策函数"。
- **可移植**：把 LLM 换掉、把 tool 换掉，循环骨架不变。

## 一些实用的提醒

> 不要相信"魔法"。如果一个 framework 让 Agent 看起来突然就会某项能力，
> 答案几乎一定藏在它默默注入的 system prompt 或 tool schema 里。

每次接手一个新 framework，第一件事是把那段 system prompt 找出来读完。
