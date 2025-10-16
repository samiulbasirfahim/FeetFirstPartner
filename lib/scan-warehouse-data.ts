import { WarehouseData } from "@/types/warehouse-data";
import { takePicture } from "./imagePicker";
import { GoogleGenAI, Modality } from "@google/genai";
import { notify } from "./notify";

const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY,
});

export async function scanWarehouseData() {
    const image = await takePicture();

    if (!image) {
        console.log("No image URL obtained.");
        return [];
    }

    notify({
        title: "Bildanalyse...",
        message: "Bitte warten Sie einige Sekunden",
        type: "info",
    });

    const model = "gemini-2.5-flash";

    const prompt = `
You are an expert at extracting shoe inventory data from warehouse shipping documents, invoices, and packing slips.
These documents are in German or Italian.
CRITICAL RULES:
1. Return ONLY a valid JSON object with an "items" key containing an array. No markdown, no explanations, no extra text.
2. Format: { "items": [...] }
3. Extract all line items from the document.
4. MERGE duplicate items: If the same label + articleNumber appears multiple times, combine them into ONE item with merged stock.
5. Each item MUST have this exact structure:
{
  "label": "full product description",
  "articleNumber": "product code/SKU",
  "storageLocation": "location from document",
  "supplier": "company name from document header",
  "stock": [
    { "key": "size", "quantity": number },
    { "key": "size", "quantity": number }
  ],
  "status": "OK" | "Low"
}
Stock Array Structure (SHOES ONLY):
- Stock is an array of objects with "key" (shoe size) and "quantity" properties
- Accept ALL numeric sizes, not just 36-44. Include smaller sizes: "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", etc.
- Use size ranges with "/" as single keys: "25/26", "26/27", "27/28", "35/36", "37/38", etc.
- If no sizes found, use empty array: []
- Example: [
    { "key": "21", "quantity": 2 },
    { "key": "25", "quantity": 5 },
    { "key": "36", "quantity": 8 },
    { "key": "44", "quantity": 3 }
  ]
- Example with ranges: [
    { "key": "25/26", "quantity": 1 },
    { "key": "26/27", "quantity": 2 },
    { "key": "27/28", "quantity": 1 }
  ]
SIZE HANDLING:
- If you see a size matrix (TAGLIA/Größe with shoe sizes and quantities), extract them as stock array entries
- Size ranges with "/" are single keys: "25/26", "26/27", "27/28"
- MERGE items with identical "label" AND "articleNumber":
  - Combine their stock arrays
  - Sum quantities if same size appears in multiple entries
Storage Location:
- Extract from destination/shipping address
- Look for: "DESTINAZIONE", city names, or warehouse codes
- Default: "" if not found
Status:
- "Low" if total quantity < 2 or explicitly marked as low
- "OK" otherwise
OUTPUT FORMAT - Return ONLY valid JSON, no extra text:
{
  "items": [
    {
      "label": "product name and color",
      "articleNumber": "SKU code",
      "storageLocation": "city or warehouse",
      "supplier": "company name",
      "stock": [
        { "key": "36", "quantity": 5 },
        { "key": "37", "quantity": 8 }
      ],
      "status": "OK"
    }
  ]
}
Now extract all shoe items from this OCR text. Return ONLY the JSON object.
`;

    const parts = [
        { text: prompt },
        { inlineData: { data: image, mimeType: "image/jpeg" } },
    ];

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: parts,
            },
            config: {
                responseModalities: [Modality.TEXT],
            },
        });

        if (!response.candidates || response.candidates.length === 0) {
            console.error("No candidates returned from Google GenAI.");
            return [];
        }

        if (!response.candidates[0].content) {
            console.error("No content in the first candidate.");
            return [];
        }

        if (
            !response.candidates[0].content.parts ||
            response.candidates[0].content.parts.length === 0
        ) {
            console.error("No parts in the content of the first candidate.");
            return [];
        }

        if (response.candidates[0].content?.parts[0]?.text) {
            const text = response.candidates[0].content.parts[0].text;

            try {
                let cleaned = text
                    .replace(/^```(?:json)?\n?/, "")
                    .replace(/\n?```$/, "");
                const data = JSON.parse(cleaned);
                console.log("Extracted Data:", data.items);
                return data.items as WarehouseData[];
            } catch (jsonError) {
                console.error("Failed to parse JSON:", jsonError);
            }
        }
    } catch (error) {
        console.error("Error during Google GenAI call:", error);
        return [];
    }
}
