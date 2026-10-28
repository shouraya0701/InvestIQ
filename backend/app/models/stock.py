import uuid
from datetime import datetime

from sqlalchemy import String,DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base

class Stock(Base):
    __tablename__="stocks"

    id:Mapped[uuid.UUID]=mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    symbol:Mapped[str]=mapped_column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )

    company_name: Mapped[str]=mapped_column(
        String(255),
        nullable=False
    )

    exchange: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )