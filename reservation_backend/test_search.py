import overpy

# Create Overpass API instance
api = overpy.Overpass()

# Define the query (get all nodes tagged as restaurants in San Francisco)
query = """
area["name"="San Francisco"]->.searchArea;
(
  node["amenity"="restaurant"](area.searchArea);
);
out body;
"""

# Run the query
result = api.query(query)
from zhipuai import ZhipuAI
# Print results

api_key = "b8e26e9205181b4f7c0e8ff966732c53.QIHFPpXiV9XMgokH"
client = ZhipuAI(api_key=api_key)

for node in result.nodes[:20]:  # limit to 10 for demo
    wb = node.tags
    print(wb)
    # if wb is not None:
    #     response = client.chat.completions.create(
    #     model="glm-4-flash",  
    #     messages=[
    #         {"role": "user", "content": f"Find a menu of thi restaurnats, According to its webpage: {wb}","tool_calls":["web_search"]}
    #     ],max_tokens=2048
    #     )
    #     print(response.choices[0].message.content)