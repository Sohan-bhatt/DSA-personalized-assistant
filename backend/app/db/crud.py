from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import UserMistake, UserTopicStat


def log_mistake(db: Session, user_id: str, topic: str, mistake: str) -> bool:
    """
    Returns True if mistake already existed (repeated), else False.
    """
    rec = (
        db.query(UserMistake)
        .filter(UserMistake.user_id == user_id, UserMistake.topic == topic, UserMistake.mistake == mistake)
        .first()
    )
    if rec:
        rec.frequency += 1
        db.commit()
        return True
    else:
        db.add(UserMistake(user_id=user_id, topic=topic, mistake=mistake, frequency=1))
        db.commit()
        return False


def get_or_create_topic_stat(db: Session, user_id: str, topic: str) -> UserTopicStat:
    stat = (
        db.query(UserTopicStat)
        .filter(UserTopicStat.user_id == user_id, UserTopicStat.topic == topic)
        .first()
    )
    if stat:
        return stat
    stat = UserTopicStat(user_id=user_id, topic=topic, confidence=0.5, last_updated=datetime.utcnow())
    db.add(stat)
    db.commit()
    db.refresh(stat)
    return stat


def update_topic_confidence(db: Session, user_id: str, topic: str, new_conf: float):
    stat = get_or_create_topic_stat(db, user_id, topic)
    stat.confidence = new_conf
    stat.last_updated = datetime.utcnow()
    db.commit()
