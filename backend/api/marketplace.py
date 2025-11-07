from flask import request, jsonify
from flask_jwt_extended import jwt_required
from backend.api import api_bp


@api_bp.get("/marketplace")
def marketplace_list():
    items = [
        {"id": "1", "name": "Contributor Badge", "price": 5},
        {"id": "2", "name": "Pro Tier", "price": 20},
    ]
    return jsonify(items)


@api_bp.post("/marketplace/purchase")
@jwt_required()
def marketplace_purchase():
    data = request.get_json() or {}
    return jsonify({"status": "ok", "itemId": data.get("itemId"), "txHash": "0xmock"})


