import json


#init_nodes(dictionary of nodes from JSON file)
def init_nodes(data):#Changes node neighbors[0] from str to corresponding node dictionary
    for i in data["node"]:
        for j in i["neighbors"]:
            for k in data["node"]:
                if k["name"] == j[0]:
                    j[0] = k
        
        for j in i["neighbors"]:
            if type(j[0]) == str:
                print("JSON naming error at", i["name"], "neighbors", ">", j[0], "<")


#find_path(Dictionary of node dictionaries, start node name (string), destination node name (string))
#Returns a list of the nodes on the path from start to finish
#Returns an empty list if no path is found
def find_path(data, start, finish):#Finds the shortest path, returns a list of the nodes on the path
    for i in data["node"]:#Ensures past searches dont mess up this search
        i["distance"] = 9999
        i["previous"] = ""
    
    queue = []
    final_path = []
    searched = []
    for i in data["node"]:#Ensures the start is at the begining of the queue
        if i["name"] == start:
            i["distance"] = 0
            queue.append(i)
    for i in data["node"]:
        if i["name"] != start:
            queue.append(i)
    

    for i in queue:
        if i["name"] == finish:
            searched.append(i)
            
            searched.reverse()
            last = i["previous"]
            for j in searched:#Traces back the path from the finish to the start
                if (j["name"] == last) or (j == searched[0]):
                    final_path.append(j)
                    last = j["previous"]

            final_path.reverse()
            return final_path

        for j in i["neighbors"]:
            if type(j[0]) != str:#Prevents error when a neighbor's name is not the name of an existing node
                if j[0]["distance"] > j[1] + i["distance"] and j[2]:#Checks if path is shorter and open
                    j[0]["distance"] = j[1] + i["distance"]
                    j[0]["previous"] = i["name"]

        searched.append(i)
        queue.sort(key=lambda dict:dict["distance"])

    return final_path

#get_edge_ids(Dictionary of edges, list of node dictionaries that are on the path)
#Returns a list of the edge ids on the path
def get_edge_ids(edges, path):
    ids = []
    for i in path:
        for j in edges["edge"]:
            if (i["name"] == j["node 1"] or i["name"] == j["node 2"]) and (i["previous"] == j["node 1"] or i["previous"] == j["node 2"]):
                ids.append(j["id"])

    return ids

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
    path_edges = get_edge_ids(edge_list, path_nodes)

    path = [[], []]
    for i in path_nodes:
        path[0].append(i["name"])
    for i in path_edges:
        path[1].append(i)
    
    return path


#testing

# final_path = get_path("Performing Arts & Humanities Building Entrance 1", "Interdisciplinary Life Sciences Building Entrance 2")
# print("\n")
# for i in final_path[0]:
#     print(i, end=", ")
# print("\n")
# for i in final_path[1]:
#     print(i, end=", ")