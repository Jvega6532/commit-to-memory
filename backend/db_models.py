from sqlalchemy import ForiegnKey, Date
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import date

class Base(DeclarativeBase):
    pass

class DBEntries(Base):

    __tablename__ = "entries"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    date: Mapped[date] = mapped_column()
    title: Mapped[str] = mapped_column()
    content: Mapped[str]= mapped_column()

class DBToDos(Base):
        
    __tablename__ = "to_dos"
    to_do_id:Mapped[int] = mapped_column(primary_key=True, index=True)
    entry_id:Mapped[int] = mapped_column(ForiegnKey("entries.id"))
    task:Mapped[str] = mapped_column()
    is_completed:Mapped[bool] = mapped_column()

