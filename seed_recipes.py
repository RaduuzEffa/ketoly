import json
import random

# Seed data for Breakfast
breakfast_adjs = ["Avokádová", "Sýrová", "Slaninová", "Vaječná", "Nadýchaná", "Zapečená", "Míchaná", "Křupavá", "Máslová"]
breakfast_nouns = ["Omeleta", "Frittata", "Miska", "Závin", "Chaffle", "Palačinka bez mouky", "Muffin", "Keto-Kaše", "Vaječná sedlina"]
breakfast_ingredients = ["se slaninou a sýrem", "s čerstvým avokádem", "s uzeným lososem", "s krůtí šunkou", "s pažitkou a čedarem", "s chorizem", "s pečenými žampiony", "s mascarpone a ořechy", "na přepuštěném másle", "se špenátem a fetou"]

# Seed data for Mains
main_adjs = ["Šťavnatý", "Zapečený", "Grilovaný", "Keto", "Krémový", "Pikantní", "Bylinkový", "Česnekový", "Pečený", "Prémiový"]
main_nouns = ["Steak", "Losos", "Kuřecí plátek", "Hovězí burger bez bulky", "Vepřový bok", "Krůtí roláda", "Zeleninový nákyp", "Květákový řízek", "Tuňákový steak", "Hovězí krk"]
main_ingredients = ["s chřestem", "na bylinkovém másle", "s brokolicovým pyré", "se sýrovou omáčkou", "s grilovanou cuketou", "s parmezánovou krustou", "s avokádovou salsou", "na zeleném pepři", "s restovanými fazolkami", "s květákovou kaší"]

# Seed data for Smoothies
smoothie_adjs = ["Zelené", "Krémové", "Čokoládové", "Oříškové", "Avokádové", "Keto", "Borůvkové", "Kokosové", "Osvěžující", "Husté"]
smoothie_nouns = ["Smoothie", "Frapé", "Keto-Shake", "Proteinové Smoothie", "Latté", "Pyre"]
smoothie_ingredients = ["s mandlovým mlékem", "s chia semínky", "s MCT olejem", "s arašídovým máslem", "s mraženými malinami", "se špenátem a limetkou", "s kokosovým krémem", "s kolagenem", "s pekanovými ořechy"]

recipes = []
used_titles = set()

def generate_macro(category):
    if category == "Snídaně / Svačina":
        kcal = random.randint(350, 550)
        p = random.randint(18, 30)
        c = random.randint(2, 6)
        f = random.randint(30, 50)
    elif category == "Hlavní jídlo":
        kcal = random.randint(550, 850)
        p = random.randint(35, 55)
        c = random.randint(3, 9)
        f = random.randint(50, 75)
    else: # Smoothie
        kcal = random.randint(250, 450)
        p = random.randint(15, 25)
        c = random.randint(3, 8)
        f = random.randint(25, 45)
        
    return kcal, p, c, f

def generate(category, n, adjs, nouns, ingrs, img):
    attempts = 0
    generated = 0
    while generated < n and attempts < 1000:
        attempts += 1
        title = f"{random.choice(adjs)} {random.choice(nouns)} {random.choice(ingrs)}"
        if title in used_titles:
            continue
        used_titles.add(title)
        
        kcal, p, c, f = generate_macro(category)
        recipes.append({
            "title": title,
            "category": category,
            "kcal": kcal,
            "protein": p,
            "carbs": c,
            "fat": f,
            "image": img,
            "time": random.choice([10, 15, 20, 30, 40, 45]),
            "mode": "keto"
        })
        generated += 1

generate("Snídaně / Svačina", 15, breakfast_adjs, breakfast_nouns, breakfast_ingredients, "keto_breakfast.png")
generate("Hlavní jídlo", 45, main_adjs, main_nouns, main_ingredients, "keto_main.png")
generate("Smoothie", 15, smoothie_adjs, smoothie_nouns, smoothie_ingredients, "keto_smoothie.png")

with open("/Users/radimpernicky/Downloads/01_ROZPRACOVANE/2026_AI/ANTIGRAVITY/app/recipes.js", "w", encoding="utf-8") as f:
    f.write("window.ketoRecipes = " + json.dumps(recipes, indent=4, ensure_ascii=False) + ";\n")
    
print(f"Generated {len(recipes)} recipes successfully.")
