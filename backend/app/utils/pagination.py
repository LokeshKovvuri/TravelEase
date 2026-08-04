def paginate(query, page: int = 1, limit: int = 10):
    return (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )