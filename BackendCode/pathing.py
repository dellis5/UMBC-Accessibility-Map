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
    for i in data["node"]:#Ensures past searches dont mess up this search
        i["distance"] = 9999
        i["previous"] = ""

        if i["name"] == finish:
            finish_coords = i["coords"]
    
    
    for i in data["node"]:#Gets the distance from each node to the finish node
        i["gps_distance"] = ((i["coords"][0] - finish_coords[0]) ** 2 + (i["coords"][1] - finish_coords[1]) ** 2) ** .5
    




    queue = []
    final_path = []
    searched = []
    for i in data["node"]:#Ensures the start is at the begining of the queue
        if i["name"] == start:
            i["distance"] = 0
            i["combined_distance"] = i["gps_distance"]
            queue.append(i)
    for i in data["node"]:
        if i["name"] != start:
            i["combined_distance"] = i["gps_distance"] + i["distance"]
            queue.append(i)
    

    while len(queue) > 0:
    # for node in queue[0]:
        if queue[0]["name"] == finish:
            searched.append(queue[0])
            
            searched.reverse()
            last = queue[0]["previous"]
            for i in searched:#Traces back the path from the finish to the start
                if (i["name"] == last) or (i == searched[0]):
                    final_path.append(i)
                    last = i["previous"]

            final_path.reverse()
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
#path[0] contains the names of the nodes on the path
#path[1] contains the ids of the edges on the path
def get_path(start, finish):
    with open("nodes.json", "r") as f:
        node_list = json.load(f)
    with open("edges.json", "r") as f:
        edge_list = json.load(f)

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