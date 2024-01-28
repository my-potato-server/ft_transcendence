from ninja import Schema


class ErrorResponse(Schema):
	code: int = None
	message: str
