#test commit
class Node:
    def __init__(self, name):
        self.name = name
        self.connections = []#Connections is a list of tuples in the format: (node, Int distance), distance is calculate by the blue dashes on the accessible routes map
        self.open = True#Used when past building closing times
        self.distance = 9999#Used for calculating the best path
        self.previous = ""#Used for calculating the best path


#init_nodes(empty list)
def init_nodes(nodes):#Creates the nodes, adds them to the list of nodes
    #Building door nodes are numbered starting from the northmost side of the building
    #The westmost door will take priority in case of multiple doors being on the northmost wall
    #Building door nodes are incremented clockwise
    #Intersection nodes may overlap building door nodes

    #Building door nodes
    
    #Performing Arts & Humanities Bldg doors    
    for i in range(3):
        nodes.append(Node("performing" + str(i+1)))

    #Fine Arts Bldg doors    
    for i in range(4):
        nodes.append(Node("fine_arts" + str(i+1)))
    
    #Engineering Bldg doors    
    for i in range(4):
        nodes.append(Node("engineering" + str(i+1)))

    #Information Technology/Engineering Bldg doors    
    for i in range(3):
        nodes.append(Node("ite" + str(i+1)))

    #Meyerhoff Bldg doors    
    for i in range(6):
        nodes.append(Node("meyerhoff" + str(i+1)))

    #University Center doors    
    for i in range(4):
        nodes.append(Node("university" + str(i+1)))

    #Sherman Hall doors    
    for i in range(2):
        nodes.append(Node("sherman" + str(i+1)))

    #Biological Sciences Bldg doors    
    for i in range(4):
        nodes.append(Node("biological" + str(i+1)))

    #Math & Physchology Bldg doors    
    for i in range(3):
        nodes.append(Node("math" + str(i+1)))

    #Sondheim Hall doors    
    for i in range(2):
        nodes.append(Node("sondheim" + str(i+1)))

    #Administration Bldg doors    
    for i in range(2):
        nodes.append(Node("admin" + str(i+1)))

    #The Commons doors    
    for i in range(6):
        nodes.append(Node("commons" + str(i+1)))

    #Lecture Hall 1 doors    
    for i in range(1):
        nodes.append(Node("lecture" + str(i+1)))

    #Retriever Activities Center doors    
    for i in range(1):
        nodes.append(Node("rac" + str(i+1)))

    #Interdiciplinary Life Sciences Bldg doors    
    for i in range(2):
        nodes.append(Node("interdisciplinary" + str(i+1)))

    #Albin O. Kuhn Library & Gallery doors    
    for i in range(3):
        nodes.append(Node("library" + str(i+1)))

    #Physics Bldg doors    
    for i in range(2):
        nodes.append(Node("physics" + str(i+1)))

    # #Intersection nodes
    for i in range(63):
        nodes.append(Node("intersect" + str(i+1)))
    

#init_connections(list of nodes)
def init_connections(nodes):#Adds the connections between the nodes
    #All connections from inside a building (ex admin1 to admin2) currently have a placeholder cost of 20
    #Pathfinding should mostly prioritize outside paths
    for i in nodes:      
        match i.name:
            case "performing1":
                for j in nodes:
                    if j.name == "performing2":
                        i.connections.append((j, 20))
                    elif j.name == "performing3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect1":
                        i.connections.append((j, 8))
            case "performing2":
                for j in nodes:
                    if j.name == "performing1":
                        i.connections.append((j, 20))
                    elif j.name == "performing3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect3":
                        i.connections.append((j, 0))
            case "performing3":
                for j in nodes:
                    if j.name == "performing1":
                        i.connections.append((j, 20))
                    elif j.name == "performing2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect6":
                        i.connections.append((j, 0))
            

            case "fine_arts1":
                for j in nodes:
                    if j.name == "fine_arts2":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts3":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts4":
                        i.connections.append((j, 20))
                    elif j.name == "intersect9":
                        i.connections.append((j, 11))
            case "fine_arts2":
                for j in nodes:
                    if j.name == "fine_arts1":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts3":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts4":
                        i.connections.append((j, 20))
                    elif j.name == "intersect15":
                        i.connections.append((j, 2))
            case "fine_arts3":
                for j in nodes:
                    if j.name == "fine_arts1":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts2":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts3":
                        i.connections.append((j, 20))
                    elif j.name == "engineering1":
                        i.connections.append((j, 2))
            case "fine_arts4":
                for j in nodes:
                    if j.name == "fine_arts1":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts2":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect11":
                        i.connections.append((j, 5))
            

            case "engineering1":
                for j in nodes:
                    if j.name == "engineering2":
                        i.connections.append((j, 20))
                    elif j.name == "engineering3":
                        i.connections.append((j, 20))
                    elif j.name == "engineering4":
                        i.connections.append((j, 20))
                    elif j.name == "fine_arts3":
                        i.connections.append((j, 2))
            case "engineering2":
                for j in nodes:
                    if j.name == "engineering1":
                        i.connections.append((j, 20))
                    elif j.name == "engineering3":
                        i.connections.append((j, 20))
                    elif j.name == "engineering4":
                        i.connections.append((j, 20))
                    elif j.name == "intersect16":
                        i.connections.append((j, 0))
            case "engineering3":
                for j in nodes:
                    if j.name == "engineering1":
                        i.connections.append((j, 20))
                    elif j.name == "engineering2":
                        i.connections.append((j, 20))
                    elif j.name == "engineering3":
                        i.connections.append((j, 20))
                    elif j.name == "ite2":
                        i.connections.append((j, 2))
            case "engineering4":
                for j in nodes:
                    if j.name == "engineering1":
                        i.connections.append((j, 20))
                    elif j.name == "engineering2":
                        i.connections.append((j, 20))
                    elif j.name == "engineering3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect13":
                        i.connections.append((j, 7))
            

            case "ite1":
                for j in nodes:
                    if j.name == "ite2":
                        i.connections.append((j, 20))
                    elif j.name == "ite3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect14":
                        i.connections.append((j, 12))
            case "ite2":
                for j in nodes:
                    if j.name == "ite1":
                        i.connections.append((j, 20))
                    elif j.name == "ite3":
                        i.connections.append((j, 20))
                    elif j.name == "engineering3":
                        i.connections.append((j, 2))
            case "ite3":
                for j in nodes:
                    if j.name == "ite1":
                        i.connections.append((j, 20))
                    elif j.name == "ite2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect16":
                        i.connections.append((j, 12))
            

            case "meyerhoff1":
                for j in nodes:
                    if j.name == "meyerhoff3":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff4":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff5":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect21":
                        i.connections.append((j, 2))
            case "meyerhoff2":
                for j in nodes:
                    if j.name == "intersect22":
                        i.connections.append((j, 1))
            case "meyerhoff3":
                for j in nodes:
                    if j.name == "meyerhoff1":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff4":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff5":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect23":
                        i.connections.append((j, 2))
            case "meyerhoff4":
                for j in nodes:
                    if j.name == "meyerhoff1":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff3":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff5":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff6":
                        i.connections.append((j, 20))
                    elif j.name == "university1":
                        i.connections.append((j, 2))
            case "meyerhoff5":
                for j in nodes:
                    if j.name == "meyerhoff1":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff3":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff4":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect15":
                        i.connections.append((j, 2))
            case "meyerhoff6":
                for j in nodes:
                    if j.name == "meyerhoff1":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff3":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff4":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff5":
                        i.connections.append((j, 20))
                    elif j.name == "intersect15":
                        i.connections.append((j, 10))


            case "university1":
                for j in nodes:
                    if j.name == "university2":
                        i.connections.append((j, 20))
                    elif j.name == "university3":
                        i.connections.append((j, 20))
                    elif j.name == "university4":
                        i.connections.append((j, 20))
                    elif j.name == "meyerhoff4":
                        i.connections.append((j, 2))
            case "university2":
                for j in nodes:
                    if j.name == "university1":
                        i.connections.append((j, 20))
                    elif j.name == "university3":
                        i.connections.append((j, 20))
                    elif j.name == "university4":
                        i.connections.append((j, 20))
                    elif j.name == "intersect27":
                        i.connections.append((j, 3))
            case "university3":
                for j in nodes:
                    if j.name == "university1":
                        i.connections.append((j, 20))
                    elif j.name == "university2":
                        i.connections.append((j, 20))
                    elif j.name == "university4":
                        i.connections.append((j, 20))
                    elif j.name == "intersect28":
                        i.connections.append((j, 1))
            case "university4":
                for j in nodes:
                    if j.name == "university1":
                        i.connections.append((j, 20))
                    elif j.name == "university2":
                        i.connections.append((j, 20))
                    elif j.name == "university3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect16":
                        i.connections.append((j, 0))
            
            
            case "sherman1":
                for j in nodes:
                    if j.name == "intersect30":
                        i.connections.append((j, 1))
            case "sherman2":
                for j in nodes:
                    if j.name == "intersect31":
                        i.connections.append((j, 0))
            

            case "biological1":
                for j in nodes:
                    if j.name == "biological2":
                        i.connections.append((j, 20))
                    elif j.name == "biological3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect41":
                        i.connections.append((j, 4))
            case "biological2":
                for j in nodes:
                    if j.name == "biological1":
                        i.connections.append((j, 20))
                    elif j.name == "biological3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect24":
                        i.connections.append((j, 4))
            case "biological3":
                for j in nodes:
                    if j.name == "biological1":
                        i.connections.append((j, 20))
                    elif j.name == "biological2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect40":
                        i.connections.append((j, 0))
            case "biological4":
                for j in nodes:
                    if j.name == "intersect40":
                        i.connections.append((j, 0))
            

            case "math1":
                for j in nodes:
                    if j.name == "math2":
                        i.connections.append((j, 20))
                    elif j.name == "math3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect43":
                        i.connections.append((j, 6))
            case "math2":
                for j in nodes:
                    if j.name == "math1":
                        i.connections.append((j, 20))
                    elif j.name == "math3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect29":
                        i.connections.append((j, 6))
            case "math3":
                for j in nodes:
                    if j.name == "math1":
                        i.connections.append((j, 20))
                    elif j.name == "math2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect25":
                        i.connections.append((j, 4))
            

            case "sondheim1":
                for j in nodes:
                    if j.name == "sondheim2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect30":
                        i.connections.append((j, 2))
            case "sondheim2":
                for j in nodes:
                    if j.name == "sondheim1":
                        i.connections.append((j, 20))
                    elif j.name == "intersect31":
                        i.connections.append((j, 2))
            

            case "admin1":
                for j in nodes:
                    if j.name == "admin2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect32":
                        i.connections.append((j, 1))
            case "admin2":
                for j in nodes:
                    if j.name == "admin1":
                        i.connections.append((j, 20))
                    elif j.name == "intersect35":
                        i.connections.append((j, 0))
            

            case "commons1":
                for j in nodes:
                    if j.name == "commons2":
                        i.connections.append((j, 20))
                    elif j.name == "commons3":
                        i.connections.append((j, 20))
                    elif j.name == "commons4":
                        i.connections.append((j, 20))
                    elif j.name == "commons5":
                        i.connections.append((j, 20))
                    elif j.name == "commons6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect48":
                        i.connections.append((j, 0))
            case "commons2":
                for j in nodes:
                    if j.name == "commons1":
                        i.connections.append((j, 20))
                    elif j.name == "commons3":
                        i.connections.append((j, 20))
                    elif j.name == "commons4":
                        i.connections.append((j, 20))
                    elif j.name == "commons5":
                        i.connections.append((j, 20))
                    elif j.name == "commons6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect52":
                        i.connections.append((j, 0))
            case "commons3":
                for j in nodes:
                    if j.name == "commons1":
                        i.connections.append((j, 20))
                    elif j.name == "commons2":
                        i.connections.append((j, 20))
                    elif j.name == "commons4":
                        i.connections.append((j, 20))
                    elif j.name == "commons5":
                        i.connections.append((j, 20))
                    elif j.name == "commons6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect59":
                        i.connections.append((j, 18))
            case "commons4":
                for j in nodes:
                    if j.name == "commons1":
                        i.connections.append((j, 20))
                    elif j.name == "commons2":
                        i.connections.append((j, 20))
                    elif j.name == "commons3":
                        i.connections.append((j, 20))
                    elif j.name == "commons5":
                        i.connections.append((j, 20))
                    elif j.name == "commons6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect49":
                        i.connections.append((j, 5))
            case "commons5":
                for j in nodes:
                    if j.name == "commons1":
                        i.connections.append((j, 20))
                    elif j.name == "commons2":
                        i.connections.append((j, 20))
                    elif j.name == "commons3":
                        i.connections.append((j, 20))
                    elif j.name == "commons4":
                        i.connections.append((j, 20))
                    elif j.name == "commons6":
                        i.connections.append((j, 20))
                    elif j.name == "intersect46":
                        i.connections.append((j, 13))
            case "commons6":
                for j in nodes:
                    if j.name == "commons1":
                        i.connections.append((j, 20))
                    elif j.name == "commons2":
                        i.connections.append((j, 20))
                    elif j.name == "commons3":
                        i.connections.append((j, 20))
                    elif j.name == "commons4":
                        i.connections.append((j, 20))
                    elif j.name == "commons5":
                        i.connections.append((j, 20))
                    elif j.name == "intersect46":
                        i.connections.append((j, 3))
            

            case "lecture1":
                for j in nodes:
                    if j.name == "intersect42":
                        i.connections.append((j, 6))
            

            case "rac1":
                for j in nodes:
                    if j.name == "intersect32":
                        i.connections.append((j, 5))
            

            case "interdisciplinary1":
                for j in nodes:
                    if j.name == "interdisciplinary2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect55":
                        i.connections.append((j, 0))
            case "interdisciplinary2":
                for j in nodes:
                    if j.name == "interdisciplinary1":
                        i.connections.append((j, 20))
                    elif j.name == "intersect50":
                        i.connections.append((j, 5))
            

            case "library1":
                for j in nodes:
                    if j.name == "library2":
                        i.connections.append((j, 20))
                    elif j.name == "library3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect37":
                        i.connections.append((j, 0))
            case "library2":
                for j in nodes:
                    if j.name == "library1":
                        i.connections.append((j, 20))
                    elif j.name == "library3":
                        i.connections.append((j, 20))
                    elif j.name == "intersect63":
                        i.connections.append((j, 0))
            case "library3":
                for j in nodes:
                    if j.name == "library1":
                        i.connections.append((j, 20))
                    elif j.name == "library2":
                        i.connections.append((j, 20))
                    elif j.name == "intersect17":
                        i.connections.append((j, 0))
            

            case "physics1":
                for j in nodes:
                    if j.name == "intersect61":
                        i.connections.append((j, 3))
            case "physics2":
                for j in nodes:
                    if j.name == "intersect58":
                        i.connections.append((j, 6))
            

            case "intersect1":
                for j in nodes:
                    if j.name == "performing1":
                        i.connections.append((j, 8))
                    elif j.name == "intersect2":
                        i.connections.append((j, 18))
            case "intersect2":
                for j in nodes:
                    if j.name == "intersect1":
                        i.connections.append((j, 18))
                    elif j.name == "intersect3":
                        i.connections.append((j, 8))
                    elif j.name == "intersect4":
                        i.connections.append((j, 11))
            case "intersect3":
                for j in nodes:
                    if j.name == "performing2":
                        i.connections.append((j, 0))
                    elif j.name == "intersect2":
                        i.connections.append((j, 8))
                    elif j.name == "intersect5":
                        i.connections.append((j, 5))
            case "intersect4":
                for j in nodes:
                    if j.name == "intersect2":
                        i.connections.append((j, 11))
                    elif j.name == "intersect5":
                        i.connections.append((j, 10))
                    elif j.name == "intersect10":
                        i.connections.append((j, 3))
                    elif j.name == "intersect12":
                        i.connections.append((j, 11))
            case "intersect5":
                for j in nodes:
                    if j.name == "intersect3":
                        i.connections.append((j, 5))
                    elif j.name == "intersect4":
                        i.connections.append((j, 10))
                    elif j.name == "intersect6":
                        i.connections.append((j, 3))
            case "intersect6":
                for j in nodes:
                    if j.name == "performing3":
                        i.connections.append((j, 0))
                    elif j.name == "intersect5":
                        i.connections.append((j, 3))
                    elif j.name == "intersect7":
                        i.connections.append((j, 10))
            case "intersect7":
                for j in nodes:
                    if j.name == "intersect6":
                        i.connections.append((j, 10))
                    elif j.name == "intersect8":#North path
                        i.connections.append((j, 12))
                    elif j.name == "intersect14":
                        i.connections.append((j, 3))
            case "intersect8":
                for j in nodes:
                    if j.name == "intersect7":
                        i.connections.append((j, 12))#North path
            case "intersect9":
                for j in nodes:
                    if j.name == "fine_arts1":
                        i.connections.append((j, 11))
                    elif j.name == "intersect10":
                        i.connections.append((j, 10))
            

            case "intersect10":
                for j in nodes:
                    if j.name == "intersect4":
                        i.connections.append((j, 3))
                    elif j.name == "intersect9":
                        i.connections.append((j, 10))
                    elif j.name == "intersect11":
                        i.connections.append((j, 4))
            case "intersect11":
                for j in nodes:
                    if j.name == "fine_arts4":
                        i.connections.append((j, 5))
                    elif j.name == "intersect10":
                        i.connections.append((j, 4))
                    elif j.name == "intersect13":
                        i.connections.append((j, 7))
            case "intersect12":
                for j in nodes:
                    if j.name == "intersect4":
                        i.connections.append((j, 11))
                    elif j.name == "intersect13":
                        i.connections.append((j, 2))
                    elif j.name == "intersect14":
                        i.connections.append((j, 9))
            case "intersect13":
                for j in nodes:
                    if j.name == "engineering4":
                        i.connections.append((j, 7))
                    elif j.name == "intersect11":
                        i.connections.append((j, 7))
                    elif j.name == "intersect12":
                        i.connections.append((j, 2))
            case "intersect14":
                for j in nodes:
                    if j.name == "ite1":
                        i.connections.append((j, 12))
                    elif j.name == "intersect7":
                        i.connections.append((j, 3))
                    elif j.name == "intersect12":
                        i.connections.append((j, 9))
            case "intersect15":
                for j in nodes:
                    if j.name == "meyerhoff5":
                        i.connections.append((j, 1))
                    elif j.name == "meyerhoff6":
                        i.connections.append((j, 10))
                    elif j.name == "fine_arts2":
                        i.connections.append((j, 1))
                    elif j.name == "intersect16":
                        i.connections.append((j, 14))
            case "intersect16":
                for j in nodes:
                    if j.name == "university4":
                        i.connections.append((j, 0))
                    elif j.name == "engineering2":
                        i.connections.append((j, 0))
                    elif j.name == "ite3":
                        i.connections.append((j, 12))
                    elif j.name == "intersect15":
                        i.connections.append((j, 14))
            case "intersect17":
                for j in nodes:
                    if j.name == "library3":
                        i.connections.append((j, 0))
                    elif j.name == "intersect63":
                        i.connections.append((j, 11))
                    elif j.name == "intersect18":
                        i.connections.append((j, 11))
            case "intersect18":
                for j in nodes:
                    if j.name == "intersect17":
                        i.connections.append((j, 11))
                    elif j.name == "intersect20":
                        i.connections.append((j, 28))
            case "intersect19":
                for j in nodes:
                    if j.name == "intersect63":
                        i.connections.append((j, 17))
                    elif j.name == "intersect20":
                        i.connections.append((j, 11))
                    elif j.name == "intersect39":
                        i.connections.append((j, 9))
            

            case "intersect20":
                for j in nodes:
                    if j.name == "intersect18":
                        i.connections.append((j, 28))
                    elif j.name == "intersect19":
                        i.connections.append((j, 11))
                    elif j.name == "intersect21":
                        i.connections.append((j, 3))
                    elif j.name == "intersect40":
                        i.connections.append((j, 3))
            case "intersect21":
                for j in nodes:
                    if j.name == "meyerhoff1":
                        i.connections.append((j, 2))
                    elif j.name == "intersect20":
                        i.connections.append((j, 3))
                    elif j.name == "intersect22":
                        i.connections.append((j, 5))
            case "intersect22":
                for j in nodes:
                    if j.name == "meyerhoff2":
                        i.connections.append((j, 1))
                    elif j.name == "intersect21":
                        i.connections.append((j, 5))
                    elif j.name == "intersect23":
                        i.connections.append((j, 6))
            case "intersect23":
                for j in nodes:
                    if j.name == "meyerhoff3":
                        i.connections.append((j, 2))
                    elif j.name == "intersect22":
                        i.connections.append((j, 6))
                    elif j.name == "intersect24":
                        i.connections.append((j, 2))
            case "intersect24":
                for j in nodes:
                    if j.name == "biological2":
                        i.connections.append((j, 3))
                    elif j.name == "intersect23":
                        i.connections.append((j, 2))
                    elif j.name == "intersect25":
                        i.connections.append((j, 3))
            case "intersect25":
                for j in nodes:
                    if j.name == "math3":
                        i.connections.append((j, 3))
                    elif j.name == "intersect24":
                        i.connections.append((j, 3))
                    elif j.name == "intersect26":
                        i.connections.append((j, 2))
            case "intersect26":
                for j in nodes:
                    if j.name == "intersect25":
                        i.connections.append((j, 2))
                    elif j.name == "intersect27":
                        i.connections.append((j, 3))
                    elif j.name == "intersect29":
                        i.connections.append((j, 12))
            case "intersect27":
                for j in nodes:
                    if j.name == "university2":
                        i.connections.append((j, 3))
                    elif j.name == "intersect26":
                        i.connections.append((j, 3))
                    elif j.name == "intersect28":
                        i.connections.append((j, 8))
            case "intersect28":
                for j in nodes:
                    if j.name == "university3":
                        i.connections.append((j, 1))
                    elif j.name == "intersect27":
                        i.connections.append((j, 8))
                    elif j.name == "intersect29":
                        i.connections.append((j, 6))
            case "intersect29":
                for j in nodes:
                    if j.name == "math2":
                        i.connections.append((j, 6))
                    elif j.name == "intersect26":
                        i.connections.append((j, 12))
                    elif j.name == "intersect28":
                        i.connections.append((j, 6))
                    elif j.name == "intersect30":
                        i.connections.append((j, 3))
            

            case "intersect30":
                for j in nodes:
                    if j.name == "sherman1":
                        i.connections.append((j, 1))
                    elif j.name == "sondheim2":
                        i.connections.append((j, 2))
                    elif j.name == "intersect29":
                        i.connections.append((j, 3))
                    elif j.name == "intersect31":
                        i.connections.append((j, 12))
            case "intersect31":
                for j in nodes:
                    if j.name == "sherman2":
                        i.connections.append((j, 0))
                    elif j.name == "sondheim1":
                        i.connections.append((j, 2))
                    elif j.name == "intersect30":
                        i.connections.append((j, 12))
                    elif j.name == "intersect32":
                        i.connections.append((j, 9))
            case "intersect32":
                for j in nodes:
                    if j.name == "admin1":
                        i.connections.append((j, 1))
                    elif j.name == "rac1":
                        i.connections.append((j, 5))
                    elif j.name == "intersect31":
                        i.connections.append((j, 9))
                    elif j.name == "intersect33":
                        i.connections.append((j, 3))
            case "intersect33":
                for j in nodes:
                    if j.name == "intersect32":
                        i.connections.append((j, 3))
                    elif j.name == "intersect34":
                        i.connections.append((j, 2))
                    elif j.name == "intersect35":
                        i.connections.append((j, 4))
            case "intersect34":
                for j in nodes:
                    if j.name == "intersect33":
                        i.connections.append((j, 2))
                    elif j.name == "intersect36":
                        i.connections.append((j, 8))
            case "intersect35":
                for j in nodes:
                    if j.name == "admin2":
                        i.connections.append((j, 0))
                    elif j.name == "intersect33":
                        i.connections.append((j, 4))
            case "intersect36":
                for j in nodes:
                    if j.name == "intersect34":
                        i.connections.append((j, 8))
                    elif j.name == "intersect51":
                        i.connections.append((j, 20))
            case "intersect37":
                for j in nodes:
                    if j.name == "library1":
                        i.connections.append((j, 0))
                    elif j.name == "intersect38":
                        i.connections.append((j, 6))
            case "intersect38":
                for j in nodes:
                    if j.name == "intersect37":
                        i.connections.append((j, 6))
                    elif j.name == "intersect44":
                        i.connections.append((j, 7))
                    elif j.name == "intersect45":
                        i.connections.append((j, 9))
            case "intersect39":
                for j in nodes:
                    if j.name == "intersect19":
                        i.connections.append((j, 9))
                    elif j.name == "intersect41":
                        i.connections.append((j, 10))
                    elif j.name == "intersect48":
                        i.connections.append((j, 13))
            

            case "intersect40":
                for j in nodes:
                    if j.name == "biological3":
                        i.connections.append((j, 0))
                    elif j.name == "biological4":
                        i.connections.append((j, 0))
                    elif j.name == "intersect20":
                        i.connections.append((j, 3))
                    elif j.name == "intersect41":
                        i.connections.append((j, 6))
            case "intersect41":
                for j in nodes:
                    if j.name == "biological1":
                        i.connections.append((j, 5))
                    elif j.name == "intersect39":
                        i.connections.append((j, 10))
                    elif j.name == "intersect40":
                        i.connections.append((j, 6))
                    elif j.name == "intersect46":
                        i.connections.append((j, 3))
            case "intersect42":
                for j in nodes:
                    if j.name == "lecture1":
                        i.connections.append((j, 6))
                    elif j.name == "intersect43":
                        i.connections.append((j, 17))
                    elif j.name == "intersect47":
                        i.connections.append((j, 3))
            case "intersect43":
                for j in nodes:
                    if j.name == "math1":
                        i.connections.append((j, 6))
                    elif j.name == "intersect42":
                        i.connections.append((j, 17))
                    elif j.name == "intersect50":
                        i.connections.append((j, 22))
            case "intersect44":
                for j in nodes:
                    if j.name == "intersect38":
                        i.connections.append((j, 7))
                    elif j.name == "intersect45":
                        i.connections.append((j, 7))
                    elif j.name == "intersect53":
                        i.connections.append((j, 20))
            case "intersect45":
                for j in nodes:
                    if j.name == "intersect38":
                        i.connections.append((j, 9))
                    elif j.name == "intersect44":
                        i.connections.append((j, 7))
                    elif j.name == "intersect48":
                        i.connections.append((j, 12))
            case "intersect46":
                for j in nodes:
                    if j.name == "commons5":
                        i.connections.append((j, 13))
                    elif j.name == "commons6":
                        i.connections.append((j, 3))
                    elif j.name == "intersect41":
                        i.connections.append((j, 3))
                    elif j.name == "intersect47":
                        i.connections.append((j, 17))
            case "intersect47":
                for j in nodes:
                    if j.name == "intersect42":
                        i.connections.append((j, 3))
                    elif j.name == "intersect46":
                        i.connections.append((j, 17))
                    elif j.name == "intersect49":
                        i.connections.append((j, 10))
            case "intersect48":
                for j in nodes:
                    if j.name == "commons1":
                        i.connections.append((j, 0))
                    elif j.name == "intersect39":
                        i.connections.append((j, 13))
                    elif j.name == "intersect45":
                        i.connections.append((j, 12))
                    elif j.name == "intersect52":
                        i.connections.append((j, 7))
            case "intersect49":
                for j in nodes:
                    if j.name == "commons4":
                        i.connections.append((j, 5))
                    elif j.name == "intersect47":
                        i.connections.append((j, 10))
                    elif j.name == "intersect50":
                        i.connections.append((j, 3))
            

            case "intersect50":
                for j in nodes:
                    if j.name == "interdisciplinary2":
                        i.connections.append((j, 5))
                    elif j.name == "intersect43":
                        i.connections.append((j, 22))
                    elif j.name == "intersect49":
                        i.connections.append((j, 3))
                    elif j.name == "intersect51":
                        i.connections.append((j, 54))
                    elif j.name == "intersect55":
                        i.connections.append((j, 14))
            case "intersect51":
                for j in nodes:
                    if j.name == "intersect36":
                        i.connections.append((j, 20))
                    elif j.name == "intersect50":
                        i.connections.append((j, 54))
            case "intersect52":
                for j in nodes:
                    if j.name == "commons2":
                        i.connections.append((j, 0))
                    elif j.name == "intersect48":
                        i.connections.append((j, 7))
                    elif j.name == "intersect54":
                        i.connections.append((j, 17))
            case "intersect53":
                for j in nodes:
                    if j.name == "intersect44":
                        i.connections.append((j, 20))
                    elif j.name == "intersect54":
                        i.connections.append((j, 11))
            case "intersect54":
                for j in nodes:
                    if j.name == "intersect52":
                        i.connections.append((j, 17))
                    elif j.name == "intersect53":
                        i.connections.append((j, 11))
                    elif j.name == "intersect56":
                        i.connections.append((j, 4))
            case "intersect55":
                for j in nodes:
                    if j.name == "interdisciplinary1":
                        i.connections.append((j, 0))
                    elif j.name == "intersect50":
                        i.connections.append((j, 14))
                    elif j.name == "intersect60":
                        i.connections.append((j, 6))
            case "intersect56":
                for j in nodes:
                    if j.name == "intersect54":
                        i.connections.append((j, 4))
                    elif j.name == "intersect57":
                        i.connections.append((j, 3))
            case "intersect57":
                for j in nodes:
                    if j.name == "intersect56":
                        i.connections.append((j, 3))
                    elif j.name == "intersect58":
                        i.connections.append((j, 10))
                    elif j.name == "intersect61":
                        i.connections.append((j, 3))
            case "intersect58":
                for j in nodes:
                    if j.name == "physics2":
                        i.connections.append((j, 6))
                    elif j.name == "intersect57":
                        i.connections.append((j, 10))
                    elif j.name == "intersect59":
                        i.connections.append((j, 2))
            case "intersect59":
                for j in nodes:
                    if j.name == "commons3":
                        i.connections.append((j, 18))
                    elif j.name == "intersect58":
                        i.connections.append((j, 2))
                    elif j.name == "intersect62":
                        i.connections.append((j, 4))
            

            case "intersect60":
                for j in nodes:
                    if j.name == "intersect55":
                        i.connections.append((j, 6))
                    elif j.name == "intersect62":
                        i.connections.append((j, 4))
            case "intersect61":
                for j in nodes:
                    if j.name == "physics1":
                        i.connections.append((j, 3))
                    elif j.name == "intersect57":
                        i.connections.append((j, 3))
            case "intersect62":
                for j in nodes:
                    if j.name == "intersect59":
                        i.connections.append((j, 4))
                    elif j.name == "intersect60":
                        i.connections.append((j, 4))
            case "intersect63":
                for j in nodes:
                    if j.name == "library2":
                        i.connections.append((j, 0))
                    elif j.name == "intersect17":
                        i.connections.append((j, 11))
                    elif j.name == "intersect19":
                        i.connections.append((j, 17))
            case _:
                print("Invalid node name: ", i.name)


#find_path(list of nodes, start node name, destination node name)
#Returns a list of the nodes on the path from start to finish
#Returns an empty list if no path is found
def find_path(nodes, start, finish):#Finds the shortest path, returns a list of the nodes on the path
    for i in nodes:#Ensures past searches dont mess up this search
        i.distance = 9999
        i.previous = ""
    
    
    queue = []
    final_path = []
    completed = []
    for i in nodes:#Ensures the start is at the begining of the queue
        if i.name == start:
            i.distance = 0
            queue.append(i)

    for i in nodes:#Adds the rest of the nodes to the queue
        if i.name != start:
            queue.append(i)
    
    for i in queue:
        i = queue[0]#Corrects the index after a pop
        if i.name == finish:
            completed.append(queue.pop(0))
            queue.append(Node("placeholder"))#Prevents accessing beyond the list
            
            completed.reverse()
            last = i.previous
            for j in completed:#Traces back the path from the finish to the start
                if (j.name == last) or (j == completed[0]):
                    final_path.append(j)
                    last = j.previous

            final_path.reverse()
            return final_path

        for j in i.connections:
            if (j[0] in queue) and (j[0].distance > j[1] + i.distance):
                j[0].distance = j[1] + i.distance
                j[0].previous = i.name

        completed.append(queue.pop(0))
        queue.append(Node("placeholder"))#Prevents accessing beyond the list

        for j in range(len(queue)):
            for k in range(len(queue) - 1):
                if queue[k].distance > queue[k+1].distance:
                    queue[k], queue[k+1] = queue[k+1], queue[k]

    return final_path




#testing
nodes = []
init_nodes(nodes)
init_connections(nodes)
start = "performing1"
finish = "physics1"
path = find_path(nodes, start, finish)


print(start, "->", finish)
if not path:
    print("No path")
for i in path:
    print(i.name, i.distance, end=", ")
