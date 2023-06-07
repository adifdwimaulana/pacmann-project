from flask import Flask, Blueprint, request, jsonify
import os
import json

user_bp = Blueprint("user", __name__)

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
user_file = os.path.join(__location__, '../data/user.json')

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



# Get All User
@user_bp.route('/', methods=['GET'], strict_slashes = False)
def get_all_user():
    users = read_json(user_file)

    return jsonify({
        "success": True,
        "data": users
    })

# Get User with Specific ID
@user_bp.route('/<int:id>', methods=['GET'], strict_slashes = False)
def get_user(id):
    users = read_json(user_file)
    user = [user for user in users['data'] if user['user_id'] == id]

    if not user:
        return jsonify({
            "message": "User not found!"
        })
    

    return jsonify({
        "success": True,
        "data": user
    })


# Create User
@user_bp.route('/', methods=['POST'], strict_slashes = False)
def create_user():
    data = request.get_json()

    current_users = read_json(user_file)
    
    new_user = {
        "user_id": id_generator(user_file),
        "name": data['name'],
        "email": data['email'],
        "password": data['password']
    }

    current_users['data'].append(new_user)

    write_json(user_file, current_users)

    return jsonify({
        "success": True,
        "message": "User successfully created!",
        "data": {
            "user_id": new_user['user_id']
        }
    })


# Update User with Specific ID
@user_bp.route('/<int:id>', methods=['PUT'], strict_slashes = False)
def update_user(id):
    data = request.get_json()
    current_users = read_json(user_file)

    for user in current_users['data']:
        if user['user_id'] == id:
            user['name'] = data['name']
            user['email'] = data['email']
            user['password'] = data['password']
            break

    write_json(user_file, current_users)

    return jsonify({
        "success": True,
        "message": "User successfully updated!"
    })

# Delete User with Specific ID
@user_bp.route('/<int:id>', methods=['DELETE'], strict_slashes = False)
def delete_user(id):
    current_users = read_json(user_file)

    for user in current_users['data']:
        if user['user_id'] == id:
            current_users['data'].remove(user)
            break

    write_json(user_file, current_users)

    return jsonify({
        "success": True,
        "message": "User successfully deleted!"
    })