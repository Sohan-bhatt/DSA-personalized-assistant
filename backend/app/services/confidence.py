def update_confidence(prev: float, mistake_repeated: bool) -> float:
    # simple but effective heuristic
    if mistake_repeated:
        return max(0.1, prev - 0.12)
    return min(1.0, prev + 0.06)
