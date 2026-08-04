def validate_rating(rating: int):

    if rating < 1 or rating > 5:
        raise ValueError(
            "Rating must be between 1 and 5."
        )