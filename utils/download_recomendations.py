import json
import urllib
import urllib.request

###
# Download recomendations from EDHrec for each category, to create one giant file
###

base_url = "https://edhrec-json.s3.amazonaws.com/en"
categories = [
    "/top",
    "/top/w",
    "/top/u",
    "/top/b",
    "/top/r",
    "/top/g",
    "/top/colorless",
    "/top/multi",
    "/top/creatures",
    "/top/instants",
    "/top/sorceries",
    "/top/artifacts",
    "/top/equipment",
    "/top/utility-artifacts",
    "/top/mana-artifacts",
    "/top/enchantments",
    "/top/auras",
    "/top/planeswalkers",
    "/top/lands",
    "/top/utility-lands",
    "/top/color-fixing-lands",
]

card_set = set()

def query_edhrec(category):
    print('Querying %s '  % category)
    url = "%s%s.json" % (base_url, category)
    req = urllib.request.Request(url)
    response = urllib.request.urlopen(req)
    data = response.read()
    values= json.loads(data)
    
    for cardlist_item in values['container']['json_dict']['cardlists']:
        for cardview_items in cardlist_item['cardviews']:
            print(cardview_items['sanitized'])
            card_set.add(cardview_items['sanitized'])

print("Starting download...")

for c in categories: 
    query_edhrec(c)

with open('recomendations.txt','w') as my_text_file:
    sorted_cards = sorted(card_set)
    for s in sorted_cards:
        my_text_file.write(s + "\n")
print("Finished successfully!")
