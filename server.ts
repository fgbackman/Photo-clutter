import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support high payload limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Google Gen AI client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Menu parsing endpoint using gemini-3.8-flash with structured JSON response
app.post("/api/parse-menu", async (req, res) => {
  try {
    const { menuText } = req.body;
    if (!menuText || typeof menuText !== "string" || !menuText.trim()) {
      res.status(400).json({ error: "Menu text is required" });
      return;
    }

    const systemInstruction = `You are a world-class culinary director and menu stylist for Michelin-starred and renowned restaurants.
Analyze the provided restaurant menu text. Extract every individual dish or drink item.
For each item, identify its name, category, price (if listed), key ingredients/components, and generate:
1. suggestedPlating: Expert description of how this dish should be physically plated, the vessel (e.g. hand-thrown charcoal ceramic bowl, polished copper skillet, pristine white porcelain), garnishes, and arrangement.
2. visualHighlights: What makes this dish mouthwatering (e.g. glossy glaze, golden-brown crust, melted cheese pull, delicate microgreens, vibrant color contrast).
3. recommendedAngle: Suggested camera angle: '45-degree', 'top-down-flat-lay', or 'close-up-macro'.
Keep the output structured according to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Extract all menu dishes from this menu:\n\n${menuText.slice(0, 15000)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurantName: {
              type: Type.STRING,
              description: "The name of the restaurant if detected or inferred, else 'Artisanal Kitchen'",
            },
            cuisineType: {
              type: Type.STRING,
              description: "The cuisine style (e.g. Modern Italian, New American, French Bistro, Japanese Izakaya, etc.)",
            },
            dishes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Dish name",
                  },
                  category: {
                    type: Type.STRING,
                    description: "Category (e.g., Starters, Mains, Pasta, Seafood, Steaks, Desserts, Beverages)",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Dish description or listed components",
                  },
                  price: {
                    type: Type.STRING,
                    description: "Price if present in the text, otherwise leave blank",
                  },
                  keyIngredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of key visible ingredients",
                  },
                  suggestedPlating: {
                    type: Type.STRING,
                    description: "Professional culinary plating description and tableware",
                  },
                  visualHighlights: {
                    type: Type.STRING,
                    description: "Key mouthwatering visual details",
                  },
                  recommendedAngle: {
                    type: Type.STRING,
                    description: "Best angle: 45-degree, top-down-flat-lay, or close-up-macro",
                  },
                },
                required: ["name", "category", "description", "keyIngredients", "suggestedPlating", "visualHighlights"],
              },
            },
          },
          required: ["dishes"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Error parsing menu:", error);
    res.status(500).json({ error: error?.message || "Failed to parse menu text" });
  }
});

// Helper function to build high-end food photography prompt
function buildFoodPhotoPrompt(params: {
  dishName: string;
  description?: string;
  category?: string;
  keyIngredients?: string[];
  suggestedPlating?: string;
  visualHighlights?: string;
  style: "rustic-dark" | "bright-modern" | "social-media" | "custom";
  angle?: "45-degree" | "top-down-flat-lay" | "close-up-macro";
  customStylePrompt?: string;
  restaurantCuisine?: string;
}): string {
  const {
    dishName,
    description = "",
    category = "Main",
    keyIngredients = [],
    suggestedPlating = "",
    visualHighlights = "",
    style,
    angle = "45-degree",
    customStylePrompt = "",
    restaurantCuisine = "",
  } = params;

  let angleDescription = "45-degree professional culinary hero angle, showcasing height and depth of the dish";
  if (angle === "top-down-flat-lay") {
    angleDescription = "Direct 90-degree overhead top-down flat lay view, geometric tabletop composition";
  } else if (angle === "close-up-macro") {
    angleDescription = "Macro close-up shot focusing on delicious texture, glistening glazes, and intricate culinary details";
  }

  let styleDescription = "";
  if (style === "rustic-dark") {
    styleDescription = `Atmospheric Rustic/Dark culinary aesthetic: Moody chiaroscuro illumination, warm directional side-lighting casting soft rich shadows. Weathered dark walnut wood or textured dark slate tabletop. Matte stoneware or hammered cast-iron plate. Garnished with scattered fresh aromatic herbs, coarse sea salt crystals, and a rustic natural linen napkin nearby. Editorial look reminiscent of Bon Appétit and high-end artisanal gastropubs.`;
  } else if (style === "bright-modern") {
    styleDescription = `Bright/Modern contemporary bistro aesthetic: High-key natural morning window light, crisp clean reflections, soft diffused shadows. Pristine white Italian Carrara marble or light terrazzo surface. Minimalist artisanal ceramic plate with generous negative space. Vibrant, fresh, punchy natural colors, microgreen garnish, delicate droplets of infused herb oil. Michelin-starred modern Nordic or California farm-to-table atmosphere.`;
  } else if (style === "social-media") {
    styleDescription = `Viral Social Media / Foodie aesthetic: Overhead top-down flat lay styling, vibrant, ultra-appealing colors, high contrast and razor-sharp clarity. Lifestyle tabletop arrangement including stylish matte brass or black cutlery, small ceramic ramekin of dipping sauce or olive oil, delicate cloth napkin fold, and subtle edge of a cocktail glass. Tailored for viral Instagram food feeds and premium delivery platform hero cards.`;
  } else if (style === "custom" && customStylePrompt) {
    styleDescription = `Bespoke restaurant ambiance: ${customStylePrompt}`;
  } else {
    styleDescription = `Professional commercial food photography with balanced studio lighting, rich colors, and appetizing presentation.`;
  }

  const ingredientsList = keyIngredients.length > 0 ? `Key visible ingredients: ${keyIngredients.join(", ")}.` : "";
  const platingDetails = suggestedPlating ? `Plating & Vessel: ${suggestedPlating}.` : "";
  const highlights = visualHighlights ? `Visual highlights: ${visualHighlights}.` : "";

  return `Commercial ultra-realistic, award-winning food photography of "${dishName}" (${category}${restaurantCuisine ? `, ${restaurantCuisine}` : ""}).
${description ? `Dish description: ${description}.` : ""}
${ingredientsList}
${platingDetails}
${highlights}
Camera & Composition: ${angleDescription}. Shot on Hasselblad H6D-100c with 120mm f/2.8 Macro lens, shallow depth of field, creamy natural bokeh, tack-sharp focus on the hero focal point of the food.
Aesthetic Style: ${styleDescription}
Authenticity & Quality: Real, freshly prepared food with authentic culinary textures—steaming hot, glistening emulsions, natural golden-brown sears, crispy edges, and fresh vibrant herbs. No plastic sheen, no artificial oversaturation, 100% edible gourmet reality.`;
}

// Generate High-Quality Food Photo using gemini-3-pro-image-preview
// With affordance for imageSize: 1K, 2K, 4K and aspect ratios
app.post("/api/generate-food-photo", async (req, res) => {
  try {
    const {
      dishName,
      description,
      category,
      keyIngredients,
      suggestedPlating,
      visualHighlights,
      style = "rustic-dark",
      angle = "45-degree",
      imageSize = "1K", // '1K' | '2K' | '4K'
      aspectRatio = "1:1", // '1:1' | '4:3' | '3:4' | '16:9' | '9:16'
      customStylePrompt,
      restaurantCuisine,
      model = "gemini-3-pro-image-preview",
    } = req.body;

    if (!dishName || typeof dishName !== "string") {
      res.status(400).json({ error: "Dish name is required" });
      return;
    }

    const prompt = buildFoodPhotoPrompt({
      dishName,
      description,
      category,
      keyIngredients,
      suggestedPlating,
      visualHighlights,
      style,
      angle,
      customStylePrompt,
      restaurantCuisine,
    });

    // Valid sizes for gemini-3-pro-image-preview: "1K", "2K", "4K"
    const validSizes = ["1K", "2K", "4K"];
    const targetSize = validSizes.includes(imageSize) ? imageSize : "1K";

    const validAspectRatios = ["1:1", "4:3", "3:4", "16:9", "9:16"];
    const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "1:1";

    const targetModel = model === "gemini-3.1-flash-image-preview" ? "gemini-3.1-flash-image-preview" : "gemini-3-pro-image-preview";

    console.log(`Generating food photo for "${dishName}" with model ${targetModel}, size ${targetSize}, ratio ${targetAspectRatio}, style ${style}`);

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio as any,
          imageSize: targetSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let descriptionText = "";

    const candidates = response.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      res.status(500).json({
        error: "No image was returned by the model. " + (descriptionText ? `Model note: ${descriptionText}` : "Please try adjusting the dish details."),
      });
      return;
    }

    res.json({
      success: true,
      imageUrl,
      promptUsed: prompt,
      modelUsed: targetModel,
      imageSize: targetSize,
      aspectRatio: targetAspectRatio,
      style,
    });
  } catch (error: any) {
    console.error("Error generating food photo:", error);
    res.status(500).json({ error: error?.message || "Failed to generate food photo" });
  }
});

// Edit Food Photo using gemini-3.1-flash-image-preview
// Takes base64 image and text prompt to edit or refine food photo
app.post("/api/edit-food-photo", async (req, res) => {
  try {
    const {
      base64Image,
      editPrompt,
      dishName = "food item",
      model = "gemini-3.1-flash-image-preview",
    } = req.body;

    if (!base64Image || typeof base64Image !== "string") {
      res.status(400).json({ error: "Base64 image is required for editing" });
      return;
    }

    if (!editPrompt || typeof editPrompt !== "string" || !editPrompt.trim()) {
      res.status(400).json({ error: "Edit prompt is required" });
      return;
    }

    // Extract raw base64 data and mime type
    let cleanBase64 = base64Image;
    let mimeType = "image/png";
    const dataUrlMatch = base64Image.match(/^data:([^;]+);base64,(.+)$/s);
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1];
      cleanBase64 = dataUrlMatch[2];
    }

    const editInstruction = `Culinary photo retoucher and food stylist:
Apply this refinement to the food photo of ${dishName}: ${editPrompt}.
Maintain photographic realism, correct physics of food texture, natural lighting, and delicious culinary appeal. Keep the plate and dish identity recognizable while executing the requested modifications with Michelin-star precision.`;

    const targetModel = model === "gemini-3-pro-image-preview" ? "gemini-3-pro-image-preview" : "gemini-3.1-flash-image-preview";

    console.log(`Editing food photo with model ${targetModel}: "${editPrompt}"`);

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: editInstruction,
          },
        ],
      },
    });

    let newImageUrl: string | null = null;
    let feedbackText = "";

    const candidates = response.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          newImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          feedbackText += part.text;
        }
      }
    }

    if (!newImageUrl) {
      res.status(500).json({
        error: "Failed to edit image: " + (feedbackText || "The model did not output a revised image. Please try a different editing instruction."),
      });
      return;
    }

    res.json({
      success: true,
      imageUrl: newImageUrl,
      feedbackText,
      modelUsed: targetModel,
      editPrompt,
    });
  } catch (error: any) {
    console.error("Error editing food photo:", error);
    res.status(500).json({ error: error?.message || "Failed to edit food photo" });
  }
});

// Vite & Static file handling
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Virtual Food Photographer server running at http://0.0.0.0:${PORT}`);
});
