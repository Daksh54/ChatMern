from typing import List, Literal, Optional

from fastapi import FastAPI
from pydantic import BaseModel


POSITIVE_WORDS = {"great", "good", "awesome", "love", "nice", "perfect", "thanks", "thank you"}
NEGATIVE_WORDS = {"bad", "sad", "angry", "late", "issue", "problem", "hate", "sorry"}


class MessagePayload(BaseModel):
    message: str = ""
    senderId: Optional[str] = None
    receiverId: Optional[str] = None
    createdAt: Optional[str] = None


class AnalyzeRequest(BaseModel):
    messages: List[MessagePayload]


class SentimentPayload(BaseModel):
    label: Literal["positive", "neutral", "negative"]
    score: float


class AnalyzeResponse(BaseModel):
    sentiment: SentimentPayload
    smartReplies: List[str]


app = FastAPI(title="chatmern-nlp", version="1.0.0")


def build_smart_replies(latest_message: str) -> List[str]:
    normalized_message = latest_message.lower()

    if "?" in normalized_message:
        return [
            "Sure, I can help with that.",
            "Yes, that works for me.",
            "Let me confirm and get back to you.",
        ]

    if "thank" in normalized_message:
        return ["Happy to help.", "Anytime.", "You're welcome."]

    if "meeting" in normalized_message or "call" in normalized_message:
        return ["That time works for me.", "Can we shift it by 15 minutes?", "I'll be there."]

    return ["Sounds good.", "I'll take care of it.", "Let's do it."]


def score_sentiment(messages: List[MessagePayload]) -> SentimentPayload:
    text_blobs = [message.message.lower() for message in messages if message.message]
    positive_hits = sum(1 for blob in text_blobs for word in POSITIVE_WORDS if word in blob)
    negative_hits = sum(1 for blob in text_blobs for word in NEGATIVE_WORDS if word in blob)
    delta = positive_hits - negative_hits

    if delta > 0:
        return SentimentPayload(label="positive", score=min(1.0, delta / 5))
    if delta < 0:
        return SentimentPayload(label="negative", score=max(-1.0, delta / 5))

    return SentimentPayload(label="neutral", score=0.0)


@app.get("/healthz")
def healthcheck() -> dict:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    latest_message = request.messages[-1].message if request.messages else ""
    return AnalyzeResponse(
        sentiment=score_sentiment(request.messages),
        smartReplies=build_smart_replies(latest_message),
    )
