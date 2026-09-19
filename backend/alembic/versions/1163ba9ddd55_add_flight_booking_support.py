"""add flight booking support

Revision ID: 1163ba9ddd55
Revises: aa0de2cc6b80
Create Date: 2026-09-01

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "1163ba9ddd55"

down_revision: Union[str, Sequence[str], None] = "aa0de2cc6b80"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add flight booking support."""

    # Flights were initially introduced in the application layer before a
    # migration existed. Create the backing table here so a clean database can
    # run the full migration chain as well as existing installations.
    bind = op.get_bind()
    existing_tables = sa.inspect(bind).get_table_names()
    if "flights" not in existing_tables:
        op.create_table(
            "flights",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("airline", sa.String(length=100), nullable=False),
            sa.Column("flight_number", sa.String(length=50), nullable=False),
            sa.Column("origin", sa.String(length=100), nullable=False),
            sa.Column("destination", sa.String(length=100), nullable=False),
            sa.Column("departure_time", sa.DateTime(), nullable=False),
            sa.Column("arrival_time", sa.DateTime(), nullable=False),
            sa.Column("economy_price", sa.Float(), nullable=False),
            sa.Column("business_price", sa.Float(), nullable=True),
            sa.Column("available_seats", sa.Integer(), nullable=False),
            sa.Column("total_seats", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=30), nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_flights_id", "flights", ["id"], unique=False)
        op.create_index(
            "ix_flights_flight_number",
            "flights",
            ["flight_number"],
            unique=False,
        )
        op.create_index("ix_flights_origin", "flights", ["origin"], unique=False)
        op.create_index(
            "ix_flights_destination",
            "flights",
            ["destination"],
            unique=False,
        )

    # Add flight reference to bookings
    op.add_column(
        "bookings",
        sa.Column(
            "flight_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    # Allow hotel-specific fields to be NULL
    # for flight bookings.
    op.alter_column(
        "bookings",
        "room_id",
        existing_type=sa.INTEGER(),
        nullable=True,
    )

    op.alter_column(
        "bookings",
        "check_in",
        existing_type=sa.DATE(),
        nullable=True,
    )

    op.alter_column(
        "bookings",
        "check_out",
        existing_type=sa.DATE(),
        nullable=True,
    )

    # Link flight_id -> flights.id
    op.create_foreign_key(
        "fk_bookings_flight_id_flights",
        "bookings",
        "flights",
        ["flight_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Remove flight booking support."""

    op.drop_constraint(
        "fk_bookings_flight_id_flights",
        "bookings",
        type_="foreignkey",
    )

    op.alter_column(
        "bookings",
        "check_out",
        existing_type=sa.DATE(),
        nullable=False,
    )

    op.alter_column(
        "bookings",
        "check_in",
        existing_type=sa.DATE(),
        nullable=False,
    )

    op.alter_column(
        "bookings",
        "room_id",
        existing_type=sa.INTEGER(),
        nullable=False,
    )

    op.drop_column(
        "bookings",
        "flight_id",
    )
