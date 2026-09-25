import { Dish, GenerationSettings, ImageSize, AspectRatio, PhotoStyle, CameraAngle, GenModel } from "../types";

export interface ParseMenuResponse {
  success: boolean;
  data: {
    restaurantName: string;
    cuisineType: string;
    dishes: {
      name: string;
      category: string;
      description: string;
      price?: string;
      keyIngredients: string[];
      suggestedPlating: string;
      visualHighlights: string;
      recommendedAngle?: string;
    }[];
  };
}

export async function parseMenuApi(menuText: string): Promise<ParseMenuResponse> {
  const res = await fetch("/api/parse-menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuText }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to parse menu (${res.status})`);
  }

  return res.json();
}

export interface GenerateFoodPhotoParams {
  dishName: string;
  description?: string;
  category?: string;
  keyIngredients?: string[];
  suggestedPlating?: string;
  visualHighlights?: string;
  style: PhotoStyle;
  angle?: CameraAngle;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  customStylePrompt?: string;
  restaurantCuisine?: string;
  model: GenModel;
}

export interface GenerateFoodPhotoResponse {
  success: boolean;
  imageUrl: string;
  promptUsed: string;
  modelUsed: string;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  style: PhotoStyle;
}

export async function generateFoodPhotoApi(params: GenerateFoodPhotoParams): Promise<GenerateFoodPhotoResponse> {
  const res = await fetch("/api/generate-food-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate food photo (${res.status})`);
  }

  return res.json();
}

export interface EditFoodPhotoParams {
  base64Image: string;
  editPrompt: string;
  dishName?: string;
  model?: GenModel;
}

export interface EditFoodPhotoResponse {
  success: boolean;
  imageUrl: string;
  feedbackText?: string;
  modelUsed: string;
  editPrompt: string;
}

export async function editFoodPhotoApi(params: EditFoodPhotoParams): Promise<EditFoodPhotoResponse> {
  const res = await fetch("/api/edit-food-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to edit food photo (${res.status})`);
  }

  return res.json();
}
