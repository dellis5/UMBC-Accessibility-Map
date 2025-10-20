from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
# Import the get_path function from your partner's file
from pathing import get_path
# Import database models
from models import db, User, FavoriteRoute

app = Flask(__name__)
# CORS is essential to allow your React app to communicate with this server
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///accessibility_map.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()

# --- API Endpoint to get all location names for the search bars ---
@app.route('/api/locations', methods=['GET'])
def get_locations():
    try:
        with open("nodes.json", "r") as f:
            node_data = json.load(f)
        # Create a list of location objects for the frontend
        locations = [{"id": node["id"], "name": node["name"]} for node in node_data["node"]]
        return jsonify(locations)
    except FileNotFoundError:
        return jsonify({"error": "nodes.json not found"}), 404

# --- API Endpoint to calculate the path ---
@app.route('/api/path', methods=['GET'])
def find_accessible_path():
    start_name = request.args.get('start')
    end_name = request.args.get('end')

    if not start_name or not end_name:
        return jsonify({"error": "start and end parameters are required"}), 400

    try:
        # 1. Run your partner's pathfinding code
        path_result = get_path(start_name, end_name)
        path_node_names = path_result[0]

        if not path_node_names:
            return jsonify({"path": []}) # Return an empty path if none is found

        # 2. Convert the list of node names into a list of coordinates for the frontend
        with open("nodes.json", "r") as f:
            node_data = json.load(f)
        
        # Create a quick lookup dictionary for coordinates
        coord_map = {node["name"]: node["coords"] for node in node_data["node"]}
        
        path_coords = [coord_map[name] for name in path_node_names if name in coord_map]

        # 3. Send the coordinates back to the frontend
        return jsonify({"path": path_coords})
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred"}), 500


# ===== NEW USER & FAVORITES ENDPOINTS =====

# --- Create a new user ---
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    
    if not data.get('email') or not data.get('name'):
        return jsonify({"error": "email and name are required"}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "User with this email already exists"}), 409
    
    new_user = User(email=data['email'], name=data['name'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201

# --- Get user by email ---
@app.route('/api/users/<email>', methods=['GET'])
def get_user(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())

# --- Save a favorite route ---
@app.route('/api/favorites', methods=['POST'])
def save_favorite():
    data = request.json
    
    required_fields = ['user_id', 'start_location', 'end_location', 'path_coordinates']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Verify user exists
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    favorite = FavoriteRoute(
        user_id=data['user_id'],
        nickname=data.get('nickname', ''),
        start_location=data['start_location'],
        end_location=data['end_location'],
        path_coordinates=json.dumps(data['path_coordinates'])
    )
    
    db.session.add(favorite)
    db.session.commit()
    
    return jsonify(favorite.to_dict()), 201

# --- Get all favorites for a user ---
@app.route('/api/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    favorites = FavoriteRoute.query.filter_by(user_id=user_id).all()
    return jsonify([fav.to_dict() for fav in favorites])

# --- Delete a favorite route ---
@app.route('/api/favorites/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    favorite = FavoriteRoute.query.get(favorite_id)
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404
    
    db.session.delete(favorite)
    db.session.commit()
    
    return jsonify({"message": "Favorite deleted successfully"}), 200


if __name__ == '__main__':
    # Runs the server on http://127.0.0.1:5000
    app.run(debug=True, port=5000)