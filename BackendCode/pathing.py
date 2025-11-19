import json


#init_nodes(dictionary of nodes from JSON file)
def init_nodes(data):#Changes node neighbors[0] from str to corresponding node dictionary
    for node in data["node"]:
        for neighbor in node["neighbors"]:
            for i in data["node"]:
                if i["name"] == neighbor[0]:
                    neighbor[0] = i

            if type(neighbor[0]) == str:
                print("JSON naming error at", node["name"], "neighbors", ">", neighbor[0], "<")

            


#find_path(Dictionary of node dictionaries, start node name (string), destination node name (string))
#Returns a list of the nodes on the path from start to finish
#Returns an empty list if no path is found
def find_path(data, start, finish):#Finds the shortest path, returns a list of the nodes on the path
    
    finish_coords = []
    for node in data["node"]:#Ensures past searches dont mess up this search
        node["distance"] = 9999
        node["previous"] = ""

        if node["name"] == finish:
            finish_coords = node["coords"]
    
    
    for node in data["node"]:#Gets the distance from each node to the finish node
        node["gps_distance"] = ((node["coords"][0] - finish_coords[0]) ** 2 + (node["coords"][1] - finish_coords[1]) ** 2) ** .5
    




    queue = []
    final_path = []
    searched = []
    for node in data["node"]:#Ensures the start is at the begining of the queue
        if node["name"] == start:
            node["distance"] = 0
            node["combined_distance"] = node["gps_distance"]
            queue.append(node)
    for node in data["node"]:
        if node["name"] != start:
            node["combined_distance"] = node["gps_distance"] + node["distance"]
            queue.append(node)
    

    while len(queue) > 0:
        if queue[0]["name"] == finish:
            searched.append(queue[0])
            
            searched.reverse()
            previous = queue[0]["previous"]
            for node in searched:#Traces back the path from the finish to the start
                if (node["name"] == previous) or (node == searched[0]):
                    final_path.append(node)
                    previous = node["previous"]

            final_path.reverse()
            if len(final_path) < 2:
                return []
            
            return final_path

        for neighbor in queue[0]["neighbors"]:
            if type(neighbor[0]) != str:#Prevents error when a neighbor's name is not the name of an existing node
                if neighbor[0]["distance"] > neighbor[1] + queue[0]["distance"] and neighbor[2]:#Checks if path is shorter and open
                    neighbor[0]["distance"] = neighbor[1] + queue[0]["distance"]
                    neighbor[0]["combined_distance"] = neighbor[0]["distance"] + neighbor[0]["gps_distance"]
                    neighbor[0]["previous"] = queue[0]["name"]


        searched.append(queue[0])
        del queue[0]
        queue.sort(key=lambda dict:dict["combined_distance"])

    return final_path

#Returns a list of size 2
#path contains the names of the nodes on the path
def get_path(start, finish):
    with open("nodes.json", "r") as f:
        node_list = json.load(f)

    init_nodes(node_list)
    path_nodes = find_path(node_list, start, finish)

    path = []
    for i in path_nodes:
        path.append(i["name"])
    
    return path


#testing and sample usage

# final_path = get_path("Performing Arts & Humanities Building Entrance 1", "Interdisciplinary Life Sciences Building Entrance 2")
# print("\n")
# for i in final_path[0]:
#     print(i, end=", ")
# print("\n")
# for i in final_path[1]:
#     print(i, end=", ")