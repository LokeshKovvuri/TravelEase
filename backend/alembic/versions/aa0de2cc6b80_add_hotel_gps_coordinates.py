"""add hotel gps coordinates

Revision ID: aa0de2cc6b80
Revises: 173f374ddbae
Create Date: 2026-08-29 02:03:41.567630

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "aa0de2cc6b80"
down_revision: Union[str, Sequence[str], None] = "173f374ddbae"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add GPS coordinates to hotels."""

    op.add_column(
        "hotels",
        sa.Column("latitude", sa.Float(), nullable=True),
    )

    op.add_column(
        "hotels",
        sa.Column("longitude", sa.Float(), nullable=True),
    )


def downgrade() -> None:
    """Remove GPS coordinates from hotels."""

    op.drop_column("hotels", "longitude")
    op.drop_column("hotels", "latitude")