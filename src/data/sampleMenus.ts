export interface SampleMenu {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  menuText: string;
}

export const SAMPLE_MENUS: SampleMenu[] = [
  {
    id: "osteria-bellini",
    name: "Osteria Bellini",
    cuisine: "Modern Tuscan & Handmade Pasta",
    description: "Rustic Italian trattoria highlighting wood-fired meats and artisanal pasta.",
    menuText: `Osteria Bellini - Autumn & Winter Menu

ANTIPASTI
Burrata di Puglia ($18)
Creamy pugliese burrata, roasted heirloom cherry tomatoes, cold-pressed Ligurian olive oil, 12-year aged balsamico di Modena, crispy basil leaves, grilled sourdough.

Carpaccio di Manzo ($22)
Paper-thin prime beef tenderloin, shaved Parmigiano-Reggiano 24 months, wild baby arugula, caper berries, white truffle oil drizzle.

PRIMI PIATTI
Tagliolini al Tartufo Nero ($32)
Handmade egg tagliolini, cultured Normandy butter, freshly shaved Umbrian black winter truffles, aged Parmigiano fonduta.

Pappardelle al Ragù di Cinghiale ($28)
Broad ribbon pasta, slow-braised wild boar ragù with juniper, rosemary, and Chianti Classico reduction, pecorino toscano.

SECONDI
Bistecca alla Fiorentina ($68)
Oak-charred 32oz dry-aged Porterhouse steak, sea salt flakes, charred lemon, rosemary infused olive oil, served with roasted baby potatoes.

Branzino al Cartoccio ($36)
Mediterranean sea bass baked in parchment with taggiasca olives, baby capers, heirloom cherry tomatoes, white wine, and fresh fennel fronds.

DOLCI
Tiramisù Tradizionale ($14)
Espresso-soaked Savoiardi ladyfingers, rich mascarpone mousse, bitter dark Valrhona cocoa powder dusting.

COCKTAILS
Smoked Rosemary Negroni ($16)
London dry gin, Campari, sweet vermouth, smoked with torched fresh rosemary sprig and flamed orange peel.`,
  },
  {
    id: "lumina-farm",
    name: "Lumina Farm & Hearth",
    cuisine: "California Farm-to-Table",
    description: "Bright, vegetable-forward fine dining focused on seasonal coastal ingredients.",
    menuText: `Lumina Farm & Hearth

STARTERS
Golden Beet & Citrus Tartare ($17)
Roasted yellow beets, blood orange segments, whipped goat cheese mousse, toasted pistachios, edible pansies, wild herb oil.

Pan-Seared Dayboat Scallops ($24)
Jumbo Maine scallops, sweet corn emulsion, crispy pancetta lardons, pickled chanterelles, micro chives.

MAINS
Crispy Skin Heritage Salmon ($34)
Pan-roasted King salmon fillet, braised baby leeks, celery root purée, caviar beurre blanc, dill sprigs.

Duck Breast & Roasted Figs ($38)
Spiced pan-seared duck breast with crispy skin, caramelized Black Mission figs, parsnip silk, port wine gastrique.

Charred Cauliflower Steak ($26)
Za'atar crusted purple cauliflower, roasted red pepper romesco sauce, pomegranate arils, toasted pine nuts, fresh mint.

DESSERTS
Honey Lavender Panna Cotta ($15)
Wildflower honey cream, blueberry compote, almond tuile, culinary lavender buds.`,
  },
  {
    id: "sora-ramen",
    name: "Sora Craft Ramen & Robata",
    cuisine: "Tokyo Izakaya & Robata Grill",
    description: "Vibrant Japanese street gastronomy with rich broth and skewered delicacies.",
    menuText: `Sora Craft Ramen & Robata - Tokyo Gastronomy

APPETIZERS
Crispy Furikake Karaage ($14)
Japanese fried chicken, roasted sesame kewpie mayo, nori flakes, shichimi togarashi, grilled lime cheek.

Wagyu Beef A5 Kushiyaki ($22)
Charcoal-grilled Miyazaki Wagyu skewers with tare glaze, wasabi stem relish, crispy garlic chips.

SIGNATURE RAMEN
Black Garlic Tonkotsu Ramen ($19)
24-hour pork bone broth, springy artisan noodles, torch-seared chashu pork belly, 6-minute ajitsuke tamago egg, menma bamboo shoots, wood ear mushrooms, house black garlic oil.

Spicy Sesame Miso Tantanmen ($18)
Rich roasted sesame broth, spicy chili minced pork, bok choy, scallions, chili thread ribbons, fragrant rayu oil.

DESSERT
Matcha Green Tea Lava Cake ($13)
Warm Uji matcha molten cake, black sesame gelato, gold leaf flake, matcha powder dust.`,
  },
  {
    id: "ember-smokehouse",
    name: "The Ember & Oak",
    cuisine: "Gourmet American Smokehouse & Burgers",
    description: "Hearty, smoky, indulgent comfort food with handcrafted sauces and prime cuts.",
    menuText: `The Ember & Oak Smokehouse

SMOKED PLATES
Prime Texas Brisket Platter ($29)
14-hour post oak smoked USDA Prime brisket with deep peppery bark, smoked pit beans, tangy pickled onions, jalapeño slices, house espresso BBQ sauce.

St. Louis Glazed Ribs ($27)
Slow-smoked pork ribs with apple cider bourbon glaze, toasted sesame, creamy apple-fennel slaw.

GOURMET BURGERS
The Smoked Truffle Burger ($21)
Double smashed dry-aged brisket patties, melted Gruyère, black truffle aioli, balsamic bacon jam, crispy shallots, brioche bun with glistening sheen.

SIDES & SWEETS
Cast Iron Jalapeño Cornbread ($10)
Warm skillet cornbread with honey butter drizzle and roasted corn kernels.

Skillet Peach Bourbon Crumble ($12)
Warm spiced Georgia peaches, brown sugar oat streusel, melting vanilla bean ice cream scoop.`,
  },
];
