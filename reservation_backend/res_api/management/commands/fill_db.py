
from res_api.models import Restaurant
from django.core.management.base import BaseCommand

data = [{
  "name": "Ultraviolet by Paul Pairet",
  "address": "No. 18 Zhongshan Dong Yi Lu, Shanghai, China",
  "description": "Conceived by Paul Pairet since 1996 and opened in May 2012, Ultraviolet is the first restaurant of its kind uniting food with multi-sensorial technologies A single table of ten seats only. A dining room of high-end technology. A 20-course Avant-Garde set menu. 3 Michelin stars. All guests sit together. The experience unfolds as a play. Food leads. Each course is enhanced with its own taste-tailored atmosphere: lights, sounds, music, scents, projection, images and imagination... And food.",
  "working_hours": { "Dinner": "Single seating at 7:00 PM (exact address disclosed upon booking)" },
  "menu": ["Chef’s tasting menu (themes vary)", "Wine pairing optional"],
  "tables": {
    "private_room": ["10-seat communal table with immersive projections"]
  },
  "supports_reservations": True,
  "contact_number": "+86 21 6323 9898",
  "notes": "World’s first “multi-sensory” restaurant; prix fixe only.",
  "img_url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/27/a8/77/uv-room-woods-autumn.jpg?w=1000&h=-1&s=1"
},
{
  "name": "The Eight",
  "address": "2/F, Grand Lisboa Hotel, Macau",
  "description": "The lavish interior sports goldfish motifs and the number eight to wish diners good fortune. The menu is traditional Cantonese starring crisply crafted quality ingredients. The head chef adds a new spin to familiar dishes with imported produce like Japanese chillies, Argentinian carabineros and Aussie lobster. At lunch, over 40 types of dim sum are available – try the steamed rice rolls filled with pickled Japanese cucumber and char siu Berkshire pork.",
  "working_hours": { 
    "Lunch": "11:00 AM – 2:30 PM", 
    "Dinner": "6:30 PM – 10:30 PM" 
  },
  "menu": ["Gold-leaf har gow", "Braised abalone", "Signature bird’s nest desserts"],
  "tables": {
    "private_rooms": ["VIP rooms for business/celebrations"]
  },
  "supports_reservations": True,
  "contact_number": "+853 8803 7788",
  "notes": "Dress code: smart casual; famous for weekend dim sum.",
  "img_url": "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/a8a98c9d6a3a4c79a8e9bf790ea4b0b2.jpeg?w=700&h=700&org_if_sml=1"
},
{
  "name": "Fu He Hui",
  "address": "1037 Yuyuan Road, Shanghai",
  "description": "Exuding Zen-inspired serenity, the rooms reflect a philosophy that veganism isn’t just about the food, but is a way of life. Only set menus are served and they change every season to make use of the best local ingredients. Masterfully crafted and plated courses include some authentically recreated recipes from the past. Tea is also closely related to Zen so do order from the extensive tea menu to complement the dishes.",
  "working_hours": { 
    "Lunch": "11:00 AM – 1:00 PM", 
    "Dinner": "5:30 PM – 9:00 PM" 
  },
  "menu": ["Seasonal tasting menus (e.g., 'mushroom forest' course)", "Tea pairings"],
  "tables": {
    "counter": ["Chef’s table"], 
    "main_dining": ["Minimalist wood tables"]
  },
  "supports_reservations": True,
  "contact_number": "+86 21 3980 9188",
  "notes": "Silent, meditative ambiance; no garlic/onion used.",
  "img_url": "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/397bc9125ab94d22b0b025c4c78a91b9.jpeg?w=700&h=700&org_if_sml=1"
},
{
  "name": "Dali Courtyard",
  "address": "67 Xiaojingchang Hutong, Beijing",
  "description": "A hidden Yunnanese eatery in a traditional *siheyuan* (courtyard house), known for rustic flavors.Dali Courtyard offers a unique dining experience with a romantic, lantern-lit ambiance and a monthly changing Yunnan menu featuring fresh herbs, sticky rice, and steamed fish, complemented by sweet rice wines and chilled Dali beer.",
  "working_hours": { "Dinner": "5:30 PM – 10:00 PM (closed Mondays)" },
  "menu": ["Steam pot chicken", "Wild mushroom hotpot", "Rose yogurt"],
  "tables": {
    "outdoor": ["Courtyard seating in summer"], 
    "indoor": ["Communal tables"]
  },
  "supports_reservations": True,
  "contact_number": "+86 10 8404 1430",
  "notes": "Casual; cash preferred. Seasonal ingredients.",
  "img_url": "https://www.thebeijinger.com/sites/default/files/thebeijinger/blog-images/100/dali_courtyard_3.jpg"
},
{
  "name": "Taian Table",
  "address": "No. 465 Zhenning Road, Shanghai",
  "description": "Founded in Shanghai in 2016, Taian Table is an intimate dining venue by Stefan Stiller, serving a multi-course tasting menu. A German native, Chef Stiller has led several Michelin-starred restaurants in Germany, before moving to Shanghai in 2004. Over the last 14 years, Chef Stiller founded and helmed multiple dining concepts in Shanghai, the most recent being Taian Table.",
  "working_hours": { "Dinner": "Two seatings (6:00 PM & 8:30 PM)" },
  "menu": ["12-course seasonal menu", "Optional wine pairing"],
  "tables": {
    "counter": ["Chef’s bar with open kitchen view"]
  },
  "supports_reservations": True,
  "notes": "No menu disclosed beforehand; dietary restrictions accommodated.",
  "contact_number": "+86 173 0160 5350",
  "img_url": "https://rachelgouk.com/wp-content/uploads/2019/04/taian-table-shanghai-michelin-restaurant-.jpg"
},
]

class Command(BaseCommand): 
  def handle(self, *args, **kwargs):
    for item in data:
        Restaurant.objects.create(
            name=item["name"],
            address=item["address"],
            description=item["description"],
            working_hours=item["working_hours"],
            contact_number=item["contact_number"],
            image_url=item["img_url"],
            menu=item["menu"],
            tables=item["tables"]
        )
    self.stdout.write(self.style.SUCCESS("Successfully filled database"))