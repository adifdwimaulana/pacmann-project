from flask import Flask, Blueprint, request, jsonify
import os
import json

task_bp = Blueprint("task", __name__)

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
task_file = os.path.join(__location__, '../data/task.json')

def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    return data

def id_generator(file_path):
    json_file = read_json(file_path)

    # Increment ID
    id = len(json_file['data']) + 1 

    return id


def write_json(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)



# Get All Task
@task_bp.route('/', methods=['GET'], strict_slashes=False)
def get_all_task():
    tasks = read_json(task_file)

    return jsonify({
        "success": True,
        "data": tasks
    })


# Get Task with Specific ID
@task_bp.route('/<int:id>', methods=['GET'], strict_slashes=False)
def get_task(id):

    tasks = read_json(task_file)
    
    task = [task for task in tasks['data'] if task['_id'] == id] 

    if not task:
        return jsonify({
            "message": "Task not found!"
        })

    return jsonify({
        "success": True,
        "data": task
    })

# Insert Task
@task_bp.route('/', methods=['POST'], strict_slashes=False)
def create_task():
    data = request.get_json()

    new_task = {
        "_id": id_generator(task_file),
        "title": data['title'],
        "description": data['description']
    }

    current_tasks = read_json(task_file)
    current_tasks['data'].append(new_task)

    write_json(task_file, current_tasks)

    return jsonify({
        "success": True,
        "message": "New task successfully created!",
        "data": {
            "task_id": new_task['_id']
        }
    })


# Update Task with Specific ID
@task_bp.route('/<int:id>', methods=['PUT'], strict_slashes=False)
def update_task(id):
    data = request.get_json()

    current_tasks = read_json(task_file)

    for task in current_tasks['data']:
        if task['_id'] == id:
            task['title'] = data['title']
            task['description'] = data['description']
            break

    write_json(task_file, current_tasks)

    return jsonify({
        "success": True,
        "message": "Task successfully updated!"
    })

# Delete Task with Specific ID
@task_bp.route('/<int:id>', methods=['DELETE'], strict_slashes=False)
def delete_task(id):
    current_tasks = read_json(task_file)

    for task in current_tasks['data']:
        if task['_id'] == id:
            current_tasks['data'].remove(task)
            break

    write_json(task_file, current_tasks)
    
    return jsonify({
        "success": True,
        "message": "Task successfully deleted!"
    })