import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import String,Numeric,ForeignKey,DateTime,Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base

class Transaction(Base):
    __tablename__="transactions"

    id:Mapped[uuid.UUID]=mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id:Mapped[uuid.UUID]=mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    stock_id:Mapped[uuid.UUID]=mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stocks.id"),
        nullable=False
    )

    transaction_type: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(18, 6),
        nullable=False
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False
    )

    transaction_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

