from flask import jsonify


def common_response(success: bool, data=None, message: str = "", status_code: int | None = None):
    """
    Standard response format for all endpoints.

    {
      "success": true/false,
      "data": ... (optional),
      "message": "" or "some text"
    }
    """
    if status_code is None:
        status_code = 200 if success else 400

    payload = {
        "success": success,
        "message": message if message is not None else ""
    }
    if data is not None:
        payload["data"] = data

    return jsonify(payload), status_code
