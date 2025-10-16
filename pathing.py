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
            if j[0]["distance"] > j[1] + i["distance"] and j[2]:#Checks if path is shorter and open
                j[0]["distance"] = j[1] + i["distance"]
                j[0]["previous"] = i["name"]

        searched.append(i)
        queue.sort(key=lambda dict:dict["distance"])

    return final_path




#testing

with open("nodes.json", "r") as f:
    data = json.load(f)



init_nodes(data)

start = "Performing Arts & Humanities Building Entrance 1"
finish = "Interdisciplinary Life Sciences Building Entrance 2"
path = find_path(data, start, finish)

print()
print(start, "->", finish)
if not path:
    print("No path")
for i in path:
    print(i["name"], i["distance"], end=", ")
