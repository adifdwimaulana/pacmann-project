from flask import request, jsonify
from app.extension import db

from app.user import userBp
from app.models.user import Users
from app.models.task import Tasks

@userBp.route('/', methods=['GET'], strict_slashes = False)
def get_all_users():
    limit = request.args.get('limit', 10)
    
    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }), 400
    
    users = db.session.execute(db.select(Users).limit(limit)).scalars()

    print(users)

    result = []
    for user in users:
        result.append(user.serialize())

    return jsonify({
        "success": True,
        "data": result
    }), 200

@userBp.route('/', methods=['POST'], strict_slashes = False)
def create_user():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    if not name or not email or not password:
        return jsonify({
            'message': "Incomplete data"
        }), 422
    
    new_user = Users(name = name, email = email, password = password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "data": new_user.serialize()
    }), 200

@userBp.route('<int:id>', methods=['PUT'], strict_slashes = False)
def update_user(id):
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']


    user = Users.query.filter_by(id=id).first()

    if not user:
        return jsonify({
            "message": 'User Not Found!'
        }), 404
    
    if not name or not email or not password:
        return jsonify({
            'message': "Incomplete data"
        }), 422
    
    user.name = name
    user.email = email
    user.password = password
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User successfully updated"
    }), 200

@userBp.route('<int:id>', methods=['DELETE'], strict_slashes = False)
def delete_user(id):
    user = Users.query.filter_by(id=id).first()

    if not user:
        return jsonify({
            "message": 'User Not Found!'
        }), 404
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User successfully deleted!"
    }), 200

@userBp.route('<int:id>/tasks', methods=['GET'], strict_slashes = False)
def get_user_task(id):
    limit = request.args.get('limit', 10)
    
    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }), 400
    
    tasks = Tasks.query.filter_by(user_id = id).all()

    if not tasks:
        return jsonify({"message": "Tasks Not Found!"}), 404
    
    result = []
    for task in tasks:
        result.append(task.serialize())

    return jsonify({
        "success": True,
        "data": result
    }), 200