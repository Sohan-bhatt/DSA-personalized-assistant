from sqlalchemy import Column, Integer, String, Text, DateTime, Float, UniqueConstraint
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    topic = Column(String, index=True)
    user_input = Column(Text)
    response = Column(Text)
    embedding = Column(Text)  # JSON list
    created_at = Column(DateTime, default=datetime.utcnow)


class UserMistake(Base):
    __tablename__ = "user_mistakes"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    topic = Column(String, index=True)
    mistake = Column(Text)
    frequency = Column(Integer, default=1)

    __table_args__ = (UniqueConstraint("user_id", "topic", "mistake", name="uq_user_topic_mistake"),)


class UserTopicStat(Base):
    __tablename__ = "user_topic_stats"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    topic = Column(String, index=True)
    confidence = Column(Float, default=0.5)
    last_updated = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id", "topic", name="uq_user_topic"),)
