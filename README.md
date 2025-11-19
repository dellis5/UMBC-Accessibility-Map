# UMBC-Accessibility-Map

BUILDING DOOR NODE NUMBERING SCHEME:
Building door nodes are numbered starting from the northmost point of the building (according to the orientation of the 2025 Accessible Routes Map, not actual North).
Building door nodes are incremented rotating clockwise around the building, starting from the point mentioned above.
The westmost door will take priority in case of multiple doors being on the northmost wall.


BRIDGE NODE NUMBERING SCHEME:
Same as building door node numbering scheme.


OMISSIONS:
Due to the middle of the three accessible entrances of the "Information Technology/Engineering Building", as according to the 2025 Accessible Routes Map, is only accessible via stairs, it has been omitted.
The bottom of the four accessible entrances of the "Engineering Building", as according to the 2025 Accessible Routes Map, has also been omitted due to it only leading to the omitted entrance stated above.

The eastern portion of Sherman Hall and surrounding paths have been omitted due to construction at the time of coding this project.

Floors that are not open to the public have been omitted.


NODE MEMBER VARIABLE TYPE SCHEME IN nodes.json:
{
	"name": string,
	"type": string,
	"coords": list of size 2 of doubles,
	"floor": string,
	"neighbors": list of lists (nested list is of size 3 in the format [string, int, bool]
}

"name" corresponds to the name of the node.
"type" corresponds to the type of the node (entrance, floor, intersection).
"coords" corresponds to the GPS coordinates of the node.
"floor" is an optional variable that corresponds to the floor of the building the node is on (b for basement, g for ground, m for mezzanine, l for lobby, numbered floors use a string of the floor number).
"neighbors" is a list of lists containing [neighboring node name, cost of travelling to that node, is the path to this node open].