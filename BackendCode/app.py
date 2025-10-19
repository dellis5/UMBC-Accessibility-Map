from flask import Flask, jsonify, request
from flask_cors import CORS
import json
# Import the get_path function from your partner's file
from pathing import get_path

app = Flask(__name__)
# CORS is essential to allow your React app to communicate with this server
CORS(app)

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

if __name__ == '__main__':
    # Runs the server on http://127.0.0.1:5000
    app.run(debug=True, port=5000)
