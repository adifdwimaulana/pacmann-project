from flask import request, jsonify
from app.extension import db
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.task import taskBp
from app.models.task import Tasks

@taskBp.route('/', methods=['GET'], strict_slashes = False)
@jwt_required(locations=["headers"])
def get_all_tasks():
    limit = request.args.get('limit', 10)
    current_user_id = get_jwt_identity()
    
    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }), 400
    
    # tasks = db.session.execute(db.select(Tasks).limit(limit)).scalars()
    tasks = Tasks.query.filter_by(user_id=current_user_id)

    result = []
    for task in tasks:
        result.append(task.serialize())

    return jsonify({
        "success": True,
        "data": result
    }), 200

@taskBp.route('<int:id>', methods=['GET'], strict_slashes = False)
@jwt_required(locations=["headers"])
def get_task_by_id(id):
    task = Tasks.query.filter_by(id=id).first()

    if not task:
        return jsonify({"message": "Task Not Found!"}), 404
    
    task = task.serialize()

    return jsonify({
        "success": True,
        "data": task
    }), 200


@taskBp.route('/', methods=['POST'], strict_slashes = False)
@jwt_required(locations=["headers"])
def create_task():
    data = request.get_json()
    title = data['title']
    description = data['description']
    user_id = get_jwt_identity()

    if not title or not description or not user_id:
        return jsonify({"message": "Incomplete data"}), 422
    
    new_task = Tasks(title = title, description = description, user_id = user_id)

    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "success": True,
        "data": new_task.serialize()
    }), 200


@taskBp.route('<int:id>', methods=['PUT'], strict_slashes = False)
@jwt_required(locations=["headers"])
def update_task(id):
    current_user_id = get_jwt_identity()

    data = request.get_json()
    title = data['title']
    description = data['description']

    task = Tasks.query.filter_by(id=id).first()

    if not task:
        return jsonify({"message": "Task Not Found!"}), 404
    
    if not title or not description:
        return jsonify({"message": "Incomplete data"}), 422
    
    if current_user_id != task.user_id:
        return jsonify({"message": "Unauthorized action"}), 422
    
    task.title = title
    task.description = description

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Task successfully updated!"
    }), 200

@taskBp.route('/status/<int:id>', methods=["PUT"], strict_slashes = False)
@jwt_required(locations=["headers"])
def update_status(id):
    current_user_id = get_jwt_identity()

    task = Tasks.query.filter_by(id=id).first()

    if not task:
        return jsonify({"message": "Task Not Found!"}), 422
    
    data = request.get_json()
    status = data.get('status')

    task.status = status

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Status successfully updated!"
    }), 200


@taskBp.route('<int:id>', methods=['DELETE'], strict_slashes = False)
@jwt_required(locations=["headers"])
def delete_task(id):
    task = Tasks.query.filter_by(id=id).first()
    current_user_id = get_jwt_identity()

    if not task:
        return jsonify({"message": "Task Not Found!"}), 404
    
    if current_user_id != task.user_id:
        return jsonify({"message": "Unauthorized action"}), 422
    
    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Task successfully deleted!"
    })