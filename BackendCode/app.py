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
        # This is the NEW, correct line that includes coords:
        locations = [{"name": node["name"], "coords": node["coords"]} for node in node_data["node"]]
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
        # Run backend path logic
        path_result = get_path(start_name, end_name)
        path_node_names = path_result[0]
        directions = path_result[1]  # <--- NEW

        if not path_node_names:
            return jsonify({"path": [], "names": [], "directions": []})

        # Load coords to map path
        with open("nodes.json", "r") as f:
            node_data = json.load(f)
        coord_map = {node["name"]: node["coords"] for node in node_data["node"]}
        path_coords = [coord_map[n] for n in path_node_names]

        return jsonify({
            "path": path_coords,
            "names": path_node_names,
            "directions": directions     # <--- SEND DIRECTIONS
        })
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred"}), 500


# ===== USER & FAVORITES ENDPOINTS =====

# --- Create a new user (with password) ---
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    
    # Validate required fields
    required_fields = ['username', 'email', 'name', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "username, email, name, and password are required"}), 400
    
    # Check if username already exists
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409
    
    # Check if email already exists
    existing_email = User.query.filter_by(email=data['email']).first()
    if existing_email:
        return jsonify({"error": "Email already exists"}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        name=data['name']
    )
    new_user.set_password(data['password'])  # Hash the password
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201

# --- Login endpoint ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    if not data.get('username') or not data.get('password'):
        return jsonify({"error": "username and password are required"}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    
    return jsonify({
        "message": "Login successful",
        "user": user.to_dict()
    }), 200

# --- Get user by username ---
@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())

# --- Save a favorite route ---
@app.route('/api/favorites', methods=['POST'])
def save_favorite():
    data = request.json
    
    required_fields = ['username', 'start_location', 'end_location', 'path_coordinates']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Verify user exists
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    favorite = FavoriteRoute(
        username=data['username'],
        nickname=data.get('nickname', ''),
        start_location=data['start_location'],
        end_location=data['end_location'],
        path_coordinates=json.dumps(data['path_coordinates'])
    )
    
    db.session.add(favorite)
    db.session.commit()
    
    return jsonify(favorite.to_dict()), 201

# --- Get all favorites for a user ---
@app.route('/api/users/<username>/favorites', methods=['GET'])
def get_user_favorites(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    favorites = FavoriteRoute.query.filter_by(username=username).all()
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
    app.run(debug=True, port=5001)