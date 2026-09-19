"""add room inventory and payment gateway fields

Revision ID: b1f8ce6a9d21
Revises: 1163ba9ddd55
Create Date: 2026-09-06
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b1f8ce6a9d21"
down_revision: Union[str, Sequence[str], None] = "1163ba9ddd55"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    table_names = inspector.get_table_names()

    # Existing profile migrations left legacy users with a NULL is_active
    # value. Normalize them before access control starts enforcing it.
    user_columns = {
        column["name"] for column in inspector.get_columns("users")
    }
    if "is_active" in user_columns:
        op.execute("UPDATE users SET is_active = true WHERE is_active IS NULL")
        op.alter_column(
            "users",
            "is_active",
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        )

    # Reconcile early room-table migrations with the current model.  This is
    # conditional because some development databases were updated manually.
    room_columns = {
        column["name"] for column in inspector.get_columns("rooms")
    }
    if "price" in room_columns and "price_per_night" not in room_columns:
        op.alter_column(
            "rooms",
            "price",
            new_column_name="price_per_night",
            existing_type=sa.Float(),
        )
        room_columns.remove("price")
        room_columns.add("price_per_night")
    if "room_number" not in room_columns:
        op.add_column("rooms", sa.Column("room_number", sa.String(length=100)))
    if "status" not in room_columns:
        op.add_column("rooms", sa.Column("status", sa.String(length=50)))
    if "total_rooms" not in room_columns:
        op.add_column("rooms", sa.Column("total_rooms", sa.Integer(), nullable=True))
        op.execute(
            "UPDATE rooms SET total_rooms = GREATEST(COALESCE(available_rooms, 0), 1)"
        )
        op.alter_column(
            "rooms",
            "total_rooms",
            existing_type=sa.Integer(),
            nullable=False,
        )

    payment_columns = {
        column["name"] for column in inspector.get_columns("payments")
    }
    if "provider" not in payment_columns:
        op.add_column(
            "payments",
            sa.Column(
                "provider",
                sa.String(length=30),
                nullable=False,
                server_default="mock",
            ),
        )
    if "provider_payment_id" not in payment_columns:
        op.add_column(
            "payments",
            sa.Column("provider_payment_id", sa.String(length=255), nullable=True),
        )
    if "checkout_url" not in payment_columns:
        op.add_column(
            "payments",
            sa.Column("checkout_url", sa.String(length=1000), nullable=True),
        )

    if "trains" not in table_names:
        op.create_table(
            "trains",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("train_number", sa.String(length=50), nullable=False),
            sa.Column("train_name", sa.String(length=150), nullable=False),
            sa.Column("origin", sa.String(length=100), nullable=False),
            sa.Column("destination", sa.String(length=100), nullable=False),
            sa.Column("departure_time", sa.DateTime(), nullable=False),
            sa.Column("arrival_time", sa.DateTime(), nullable=False),
            sa.Column("journey_duration", sa.String(length=50), nullable=True),
            sa.Column("economy_price", sa.Float(), nullable=False),
            sa.Column("ac_price", sa.Float(), nullable=True),
            sa.Column("available_seats", sa.Integer(), nullable=False),
            sa.Column("total_seats", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=30), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("train_number"),
        )
        op.create_index("ix_trains_id", "trains", ["id"])
        op.create_index("ix_trains_origin", "trains", ["origin"])
        op.create_index("ix_trains_destination", "trains", ["destination"])

    if "buses" not in table_names:
        op.create_table(
            "buses",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("operator_name", sa.String(length=150), nullable=False),
            sa.Column("bus_number", sa.String(length=50), nullable=False),
            sa.Column("bus_type", sa.String(length=50), nullable=False),
            sa.Column("origin", sa.String(length=100), nullable=False),
            sa.Column("destination", sa.String(length=100), nullable=False),
            sa.Column("departure_time", sa.DateTime(), nullable=False),
            sa.Column("arrival_time", sa.DateTime(), nullable=False),
            sa.Column("journey_duration", sa.String(length=50), nullable=True),
            sa.Column("price", sa.Float(), nullable=False),
            sa.Column("available_seats", sa.Integer(), nullable=False),
            sa.Column("total_seats", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=30), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("bus_number"),
        )
        op.create_index("ix_buses_id", "buses", ["id"])
        op.create_index("ix_buses_origin", "buses", ["origin"])
        op.create_index("ix_buses_destination", "buses", ["destination"])

    if "cabs" not in table_names:
        op.create_table(
            "cabs",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("provider_name", sa.String(length=150), nullable=False),
            sa.Column("vehicle_number", sa.String(length=50), nullable=False),
            sa.Column("vehicle_type", sa.String(length=50), nullable=False),
            sa.Column("origin", sa.String(length=100), nullable=False),
            sa.Column("destination", sa.String(length=100), nullable=False),
            sa.Column("price_per_km", sa.Float(), nullable=False),
            sa.Column("base_fare", sa.Float(), nullable=False),
            sa.Column("available", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=30), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("vehicle_number"),
        )
        op.create_index("ix_cabs_id", "cabs", ["id"])
        op.create_index("ix_cabs_origin", "cabs", ["origin"])
        op.create_index("ix_cabs_destination", "cabs", ["destination"])


def downgrade() -> None:
    # Transport tables may have existed before this reconciliation migration,
    # so downgrading must not risk dropping user-owned data.
    op.drop_column("payments", "checkout_url")
    op.drop_column("payments", "provider_payment_id")
    op.drop_column("payments", "provider")
    op.drop_column("rooms", "total_rooms")
