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

    const model = "gemini-2.0-flash";

    const prompt = `
You are an expert at extracting shoe inventory data from warehouse invoices, packing slips, and delivery notes.
Documents are in German or Italian.

OUTPUT STRUCTURE:
Return ONLY valid JSON: { "items": [...] }

Each item:
{
  "label": "product description",
  "articleNumber": "article/SKU code",
  "storageLocation": "destination city",
  "supplier": "company name from header",
  "stock": [
    { "key": "size_or_unit", "quantity": number }
  ],
  "status": "OK" | "Low"
}

DOCUMENT TYPES YOU'LL ENCOUNTER:

TYPE 1 - DUCAL/PIO DUSINI (Italian):
- Header: "DOCUMENTO DI TRASPORTO", "ORTOPÄDIE - LEDER - ZUBEHÖR"
- Columns: CODICE E DESCRIZIONE ARTICOLO | CALZATE E QUANTITA | U.M. | QUANTITA' | PREZZO
- Size matrix in rows like: 35 36 37 38 39 40 41 42 (with quantities below)
- Destination: Look for "DESTINAZIONE" section (e.g., "SAN GIORGIO-BRUNICO")

TYPE 2 - SPANNRIT (German):
- Header: "Rechnung", "SPANNRIT GmbH"
- Columns: Artikel | Menge ME | Einzelpreis | Gesamtpreis
- Format: Article code, description, then "Paar / Größe" table showing sizes and quantities
- Destination: Address section (e.g., "39031 ST. GEORGEN")

TYPE 3 - ORTHOTECH (German):
- Header: "Rechnung Nr:", "ORTHOTECH GmbH"
- Columns: Pos. | Artikelnr. | Artikelbezeichnung | Größe | Menge | Einzelpreis | Betrag EUR
- Each size is a SEPARATE row (e.g., size 6, 1,00 Paar on one line)
- Destination: Customer address in header

EXTRACTION RULES:

Supplier:
- Document header company name
- Examples: "PIO DUSINI", "SPANNRIT", "DUCAL ORTHOPEDICS", "ORTHOTECH"

Destination (storageLocation):
- Italian docs: "DESTINAZIONE" field
- German docs: Shipping address or customer address
- Extract city only (e.g., "SAN GIORGIO-BRUNICO", "ST. GEORGEN", "Stockdorf")

Article Number:
- Code at start of product line or separate column
- Examples: "2503050000", "Z957800D2260", "059802", "M7135000084"

Label (Description):
- Full product description including color, material, specifications
- Examples:
  * "LUNASOFT SLW MM 20 C.09 BIANCO"
  * "Fo. 95 Lazr Memopur rot Cora black Pelotte eingeschäumt"
  * "Antistatik, schwarz, mit Bezug"
  * "Memopur weiß 1 mm Lappen: 33,5 cm x 12 cm"

STOCK EXTRACTION - 3 METHODS:

METHOD 1 - Size Matrix (DUCAL/PIO DUSINI style):
Look for horizontal size rows:
Row 1: 35  36  37  38  39  40  41  42
Row 2: 43  44  45  46  47  48  49  50
Below, find corresponding quantities.

Example:
Sizes:  35  36  37  38  39  40  41  42
Qtys:   -   -   -   -   5   -   -   -
Result: [{ "key": "39", "quantity": 5 }]

METHOD 2 - Size Table (SPANNRIT style):
Look for "Paar / Größe" or "Paar/Größe" table:
| 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 |
| 2  | 5  | 8  | 8  | 8  | 5  | 3  | 3  | 2  |

Extract each size-quantity pair where quantity > 0.

METHOD 3 - Separate Rows (ORTHOTECH style):
Each size is its own line item:
Pos.13: Artikelnr 059802, Größe 6, Menge 1,00 Paar
Pos.14: Artikelnr 059802, Größe 7, Menge 2,00 Paar

Same article number = same item, combine sizes into stock array.

METHOD 4 - Direct Quantity (No sizes):
If "Menge" shows quantity but no size breakdown:
- Use unit as key: "25 Paar" → [{ "key": "Paar", "quantity": 25 }]
- Or "1,00 NR" → [{ "key": "NR", "quantity": 1 }]

SIZE FORMATS:
- Regular: "36", "37", "38", etc. (21-50 range)
- Ranges: "25/26", "26/27", "27/28", "35/36", "37/38"
- Units: "Paar", "NR", "Stück" (when no size specified)

QUANTITY PARSING:
- European decimals: "1,00" = 1, "5,00" = 5
- Empty cells or "-" = skip (0 quantity)
- Only include sizes with quantity > 0

MERGING RULES:
- Same articleNumber + same label = ONE item
- Combine stock arrays, sum quantities for duplicate sizes
- Keep first occurrence of supplier, storageLocation

Status:
- Sum all quantities in stock array
- If total < 2: "Low"
- Otherwise: "OK"

EXAMPLES:

Example 1 (DUCAL):
{
  "label": "LUNASOFT SLW MM 20 C.09 BIANCO",
  "articleNumber": "2503050000",
  "storageLocation": "SAN GIORGIO-BRUNICO",
  "supplier": "PIO DUSINI",
  "stock": [{ "key": "NR", "quantity": 1 }],
  "status": "Low"
}

Example 2 (SPANNRIT):
{
  "label": "Fo. 95 Lazr Memopur rot Cora black Pelotte eingeschäumt",
  "articleNumber": "Z957800D2260",
  "storageLocation": "ST. GEORGEN",
  "supplier": "SPANNRIT",
  "stock": [
    { "key": "36", "quantity": 2 },
    { "key": "37", "quantity": 5 },
    { "key": "38", "quantity": 8 }
  ],
  "status": "OK"
}

Example 3 (ORTHOTECH - merged rows):
{
  "label": "Antistatik, schwarz, mit Bezug",
  "articleNumber": "059802",
  "storageLocation": "Stockdorf",
  "supplier": "ORTHOTECH",
  "stock": [
    { "key": "6", "quantity": 1 },
    { "key": "7", "quantity": 2 },
    { "key": "8", "quantity": 2 }
  ],
  "status": "OK"
}

CRITICAL REMINDERS:
- Scan ENTIRE document, extract ALL items
- Look carefully at table structure (horizontal matrix vs vertical rows)
- Parse European decimals correctly (comma = decimal point)
- Merge items with same article number
- Only include non-zero quantities
- Return valid JSON only, no markdown

Now analyze this document and extract all items. Return ONLY the JSON object.
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
                    .replace(/\n?```$/, "")
                    .trim();

                const data = JSON.parse(cleaned);
                console.log("===== EXTRACTED WAREHOUSE DATA =====");
                console.log(JSON.stringify(data.items, null, 2));
                console.log("====================================");

                return data.items as WarehouseData[];
            } catch (jsonError) {
                notify({
                    title: "Scanfehler",
                    message:
                        "Konnte Rechnung nicht analysieren. Bitte versuchen Sie es erneut.",
                    type: "error",
                });
                console.error("Failed to parse JSON:", jsonError);
                console.log("Raw response was:", text);
                return [];
            }
        }
    } catch (error) {
        notify({
            title: "Scanfehler",
            message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
            type: "error",
        });
        console.error("Error during Google GenAI call:", error);
        return [];
    }

    return [];
}
