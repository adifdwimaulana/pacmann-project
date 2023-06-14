from flask import request, jsonify
from app.extension import db

from app.task import taskBp
from app.models.task import Tasks

@taskBp.route('/', methods=['GET'], strict_slashes = False)
def get_all_tasks():
    limit = request.args.get('limit', 10)
    
    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }), 400
    
    tasks = db.session.execute(db.select(Tasks).limit(limit)).scalars()

    result = []
    for task in tasks:
        result.append(task.serialize())

    return jsonify({
        "success": True,
        "data": result
    }), 200


@taskBp.route('/', methods=['POST'], strict_slashes = False)
def create_task():
    data = request.get_json()
    title = data['title']
    description = data['description']
    user_id = data['user_id']

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
def update_task(id):
    data = request.get_json()
    title = data['title']
    description = data['description']
    user_id = data['user_id']

    task = Tasks.query.filter_by(id=id).first()

    if not task:
        return jsonify({"message": "Task Not Found!"}), 404
    
    if not title or not description or not user_id:
        return jsonify({"message": "Incomplete data"}), 422
    
    task.title = title
    task.description = description
    task.user_id = user_id

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Task successfully updated!"
    }), 200

@taskBp.route('<int:id>', methods=['DELETE'], strict_slashes = False)
def delete_task(id):
    task = Tasks.query.filter_by(id=id).first()

    if not task:
        return jsonify({"message": "Task Not Found!"}), 404
    
    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Task successfully deleted!"
    })