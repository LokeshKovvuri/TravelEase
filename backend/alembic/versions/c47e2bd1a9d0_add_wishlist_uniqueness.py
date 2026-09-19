"""enforce one saved hotel per user

Revision ID: c47e2bd1a9d0
Revises: b1f8ce6a9d21
Create Date: 2026-09-06
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c47e2bd1a9d0"
down_revision: Union[str, Sequence[str], None] = "b1f8ce6a9d21"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    tables = set(sa.inspect(bind).get_table_names())

    # Some early local databases were created from a model that used the
    # plural name. Rename it in place so saved data remains available.
    if "wishlist" not in tables and "wishlists" in tables:
        op.rename_table("wishlists", "wishlist")
        tables.remove("wishlists")
        tables.add("wishlist")

    # A database can have a recorded legacy revision without the table when
    # it was initialized manually. Create the current shape in that case.
    if "wishlist" not in tables:
        op.create_table(
            "wishlist",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("hotel_id", sa.Integer(), nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.ForeignKeyConstraint(["hotel_id"], ["hotels.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_wishlist_id", "wishlist", ["id"], unique=False)

    # Legacy development databases may contain duplicate saved rows from the
    # pre-constraint implementation. Preserve the earliest record per pair.
    op.execute(
        "DELETE FROM wishlist duplicate "
        "USING wishlist original "
        "WHERE duplicate.user_id = original.user_id "
        "AND duplicate.hotel_id = original.hotel_id "
        "AND duplicate.id > original.id"
    )
    unique_constraints = {
        constraint["name"]
        for constraint in sa.inspect(bind).get_unique_constraints("wishlist")
    }
    if "uq_wishlist_user_hotel" not in unique_constraints:
        op.create_unique_constraint(
            "uq_wishlist_user_hotel",
            "wishlist",
            ["user_id", "hotel_id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    if "wishlist" not in sa.inspect(bind).get_table_names():
        return
    unique_constraints = {
        constraint["name"]
        for constraint in sa.inspect(bind).get_unique_constraints("wishlist")
    }
    if "uq_wishlist_user_hotel" in unique_constraints:
        op.drop_constraint(
            "uq_wishlist_user_hotel",
            "wishlist",
            type_="unique",
        )
