"""init schema

Revision ID: 491e6338f887
Revises:
Create Date: 2025-12-05 02:56:19.081875

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "491e6338f887"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ========= USERS =========
    op.create_table(
        "users",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("is_admin", sa.Boolean, nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # ========= ENTRIES =========
    op.create_table(
        "entries",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
            index=True,  # cria ix_entries_user_id automático
        ),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("value", sa.Numeric(12, 2), nullable=False),
        sa.Column("date", sa.Date, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # ========= EXPENSES =========
    op.create_table(
        "expenses",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
            index=True,  # ix_expenses_user_id automático
        ),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("payment_method", sa.String(length=30), nullable=False),
        sa.Column("value", sa.Numeric(12, 2), nullable=False),
        sa.Column("date", sa.Date, nullable=False),
        sa.Column("essential", sa.Boolean, nullable=False, server_default=sa.text("false")),
        # parcelas: "1/10", "2/10" etc.
        sa.Column("installments", sa.String(length=20), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # ========= SAVINGS =========
    op.create_table(
        "savings",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
            index=True,  # ix_savings_user_id automático
        ),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("saving_type", sa.String(length=80), nullable=False),
        sa.Column("value", sa.Numeric(12, 2), nullable=False),
        sa.Column("date", sa.Date, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # ========= ACCOUNT BILLS =========
    op.create_table(
        "account_bills",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
            index=True,  # ix_account_bills_user_id automático
        ),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("planned_value", sa.Numeric(12, 2), nullable=False),
        sa.Column("paid_value", sa.Numeric(12, 2), nullable=True),
        sa.Column("paid_date", sa.Date, nullable=True),
        sa.Column("is_paid", sa.Boolean, nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )


def downgrade() -> None:
    op.drop_table("account_bills")
    op.drop_table("savings")
    op.drop_table("expenses")
    op.drop_table("entries")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
