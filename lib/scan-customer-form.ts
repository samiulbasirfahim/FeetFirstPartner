import { CustomerFull } from "@/types/customer";
import { takePicture } from "./imagePicker";
import { GoogleGenAI, Modality } from "@google/genai";
import { notify } from "./notify";

const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY,
});

export async function scanCustomerForm(): Promise<CustomerFull | null> {
    const image = await takePicture();

    if (!image) {
        console.log("No image URL obtained.");
        return null;
    }

    notify({
        title: "Bildanalyse...",
        message: "Bitte warten Sie einige Sekunden",
        type: "info",
    });

    const model = "gemini-2.0-flash";

    const prompt = `
You are an expert at extracting customer and prescription data from medical documents, prescriptions, and patient forms.
These documents are in German or Italian.

CRITICAL RULES:
1. Return ONLY a valid JSON object with the structure below. No markdown, no explanations, no extra text.
2. Extract ALL available information from the document.
3. Return the object directly - do NOT wrap it in an array or container.

REQUIRED OUTPUT STRUCTURE:
{
  "gender": "man" | "woman",
  "firstName": "first name",
  "lastName": "last name",
  "email": "email address",
  "address": "full address",
  "dateOfBirth": "YYYY-MM-DD",
  "insuranceNumber": "Versichertennummer",
  "statusCode": "Status code",
  "dateOfPrescription": "YYYY-MM-DD",
  "healthInsuranceProvider": "insurance company name",
  "healthInsuranceProviderId": "Kostenträgerkennung",
  "clinicId": "Betriebsstätten-Nr / BSNR",
  "prescribingDoctor": "doctor name with title",
  "clinicAddress": "clinic/practice address",
  "physicianId": "Arzt-Nr / LANR",
  "medicalDiagnosis": "diagnosis description",
  "typeOfPrescription": "prescription/insole description",
  "importanceType": ["array", "of", "box", "numbers"]
}

FIELD EXTRACTION RULES:

PATIENTENDATEN (PATIENT DATA):

Gender:
- Look for: "Herr"/"Mr" = "man", "Frau"/"Mrs"/"Ms" = "woman"
- German: "männlich" = "man", "weiblich" = "woman"
- Italian: "uomo"/"maschio" = "man", "donna"/"femmina" = "woman"
- Default: ""

First Name (Vorname):
- Look for: "Vorname", "Name", "Nome", "First Name"
- Extract only the first/given name
- Default: ""

Last Name (Nachname):
- Look for: "Nachname", "Familienname", "Cognome", "Last Name", "Surname"
- Extract family name
- Default: ""

Email:
- Extract email address if present (user@domain.com format)
- Default: ""

Address (Adresse):
- Look for: "Adresse", "Straße", "Address", "Indirizzo"
- Extract full address including street, number, postal code, city
- Example format: "Gibtsnetallee 42, 89073 Ulm"
- Default: ""

Date of Birth (Geburtsdatum):
- Look for: "Geburtsdatum", "Geb.", "geb. am", "Data di nascita", "DOB"
- Accept formats: DD.MM.YY, DD.MM.YYYY, DD/MM/YYYY
- ALWAYS convert to YYYY-MM-DD format
- For 2-digit years: birth dates use 19xx (e.g., "64" = 1964)
- Example: "24.02.1942" → "1942-02-24"
- Default: ""

Insurance Number (Versichertennummer):
- Look for: "Versichertennummer", "Versicherten-Nr.", "Vers.-Nr.", "Insurance Number"
- Example: "0000042", "Z411008593"
- Default: ""

Status Code (Status):
- Look for: "Status", "Status Code"
- Usually a numeric code (e.g., "42", "100000")
- Default: ""

Date of Prescription (Datum der Verordnung):
- Look for: "Datum", "Datum der Verordnung", "Verordnungsdatum", "Rezeptdatum"
- Accept formats: DD.MM.YY, DD.MM.YYYY
- ALWAYS convert to YYYY-MM-DD format
- For 2-digit years: prescription dates use 20xx (e.g., "16" = 2016)
- Example: "24.02.2016" → "2016-02-24"
- Default: ""

VERSICHERUNGSDATEN (INSURANCE DATA):

Health Insurance Provider (Kostenträger / Krankenkasse):
- Look for: "Krankenkasse bzw. Kostenträger", "Kostenträger", "Krankenkasse", "Versicherung"
- Extract the insurance company name
- Examples: "AOK Hessen", "BARMER", "AOK Bayern", "AOK Musterbundesland", "TK"
- Default: ""

Health Insurance Provider ID (Kostenträgerkennung):
- Look for: "Kostenträgerkennung", "IK-Nummer", "Kassen-Nr.", "Provider ID"
- CRITICAL: This appears as "Kassen-Nr." on the left side of the form
- Also check top right corner in field labeled "Apotheken-Nummer / IK"
- This is a 7-9 digit number
- Examples: "4200042", "108380007", "1234567"
- DO NOT confuse with:
  * "Versicherten-Nr." (patient insurance number - different field)
  * "BVG" boxes numbered 6, 7, 8, 9 (these indicate prescription type categories, NOT provider ID)
  * "Betriebsstätten-Nr." (clinic ID - different field)
- Default: ""

Clinic ID (Betriebsstätten-Nr / BSNR):
- Look for: "Betriebsstätten-Nr", "Betriebsstätten-Nr.", "BSNR", "Clinic ID"
- Usually a 9-digit number with dash format: "42-000000"
- Example: "644417400", "42-000000"
- Default: ""

Prescribing Doctor (Verordnender Arzt):
- Look for: "Verordnender Arzt", "Arzt", "Doctor", "Dr.", doctor name on right side
- Include title and full name
- Examples: "Dr. med. Alexander Dittmar", "Dr. med Arthur Dent", "Dr. med. Hans-Georg Mustermann"
- Default: ""

Clinic Address (Praxisadresse):
- Look for: "Praxisadresse", "Clinic Address", "Practice Address", address near doctor name
- Extract full address
- Examples: "Vogonenstr. 42, 89073 Ulm", "Dorfstraße 1, 55555 Bad Musterdorf"
- Default: ""

Physician ID (Arzt-Nr / LANR):
- Look for: "Arzt-Nr", "Arzt-Nr.", "LANR", "Physician ID", "Arztnummer"
- Usually a 9-digit number or text "LANR"
- Examples: "732269410", "000000-42", "LANR"
- Default: ""

MEDIZINISCHE DATEN (MEDICAL DATA):

Medical Diagnosis (Ärztliche Diagnose):
- Look for: "Diagnose", "Diagnose:", "Ärztliche Diagnose", "Diagnosis", "ICD", "Befund"
- Extract complete diagnosis text
- Examples: 
  * "Spreizfuss bds. (beidseitig)"
  * "Knick-Senk-Spreizfuß bds., Achillodynie li."
  * "1 Paar Weichpolstereinlagen nach Formabdruck"
- Common abbreviations:
  * "bds." = beidseitig (bilateral/both sides)
  * "li." = links (left)
  * "re." = rechts (right)
- Default: ""

Type of Prescription (Art der Verordnung / Einlage):
- Look for: "Art der Verordnung", "Einlage", "Verordnung", "Rp.", prescription details
- Extract complete prescription description including quantity and specifications
- Examples:
  * "1 Paar Weichpolstereinlagen nach Formabdruck, lang mit durchgehender Weichbettung."
  * "2 Paar Weichpolsterbettungseinlagen + Fersenweichpolsterung 2x aus hygienischen Gründen nach Formabdruck; Quer & Längsgewölbeunterstützung bds."
- Include: quantity (Paar), type (Weichpolsterung, Einlagen), specifications, reasons
- Default: ""

Importance Type (BVG Boxes):
- CRITICAL: Look at the BVG boxes in the TOP RIGHT CORNER of the document
- Location: In the header section with label "BVG" next to "Spr.-St. Bedarf" and "Apotheken-Nummer / IK"
- Visual description: These are 4 small square boxes arranged in a row, each containing a number: 6, 7, 8, 9
- The boxes are located directly above the "Zuzahlung" and "Gesamt-Brutto" table
- Check which boxes are FILLED/HIGHLIGHTED with pink/red color or have visible emphasis
- A box is CHECKED if it has a colored background (pink/red/yellow) or the number inside is clearly emphasized
- MULTIPLE boxes can be checked - extract ALL checked boxes
- Box meanings:
  * "6" = "Hilfsmittel" (Medical aids/devices) - MOST COMMON for orthopedic insoles
  * "7" = "Impfstoff" (Vaccines)
  * "8" = "Sprechstundenbedarf" (Practice supplies)
  * "9" = "Begleit-Pflicht" (Accompanying obligation)
- Real examples from prescriptions:
  * Boxes 6 and 9 both highlighted → return "6,9" (very common combination)
  * Only box 6 highlighted → return "6"
  * Boxes 6, 7, and 9 highlighted → return "6,7,9"
  * All boxes 6, 7, 8, 9 highlighted → return "6,7,8,9"
  * Only box 9 highlighted → return "9"
- Look VERY CAREFULLY at the coloring/highlighting of EACH box
- Check all 4 boxes and report ALL that are highlighted
- Do NOT confuse with other numbers on the form (like Kassen-Nr., Versicherten-Nr., etc.)
- Return as comma-separated string: "6", "7", "8", "9", "6,9", "6,7", "6,7,8,9", etc.
- Order matters: always list in numerical order (6,7,8,9)
- Default: "6" (if completely unclear, assume Hilfsmittel for orthopedic prescriptions)

IMPORTANT NOTES:
- All fields must be strings
- Use empty string "" if information is not found - NEVER use null or undefined
- For dates: ALWAYS convert to YYYY-MM-DD format regardless of input format
- For 2-digit years: 
  * Birth dates (usually older) = 19xx (e.g., "42" = 1942, "64" = 1964)
  * Prescription dates (recent) = 20xx (e.g., "16" = 2016, "24" = 2024)
- Extract complete text for diagnosis and prescription fields
- Do NOT wrap output in markdown code blocks
- Return ONLY the raw JSON object

Now extract all information from this document. Return ONLY the JSON object.
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
            return null;
        }

        if (!response.candidates[0].content) {
            console.error("No content in the first candidate.");
            return null;
        }

        if (
            !response.candidates[0].content.parts ||
            response.candidates[0].content.parts.length === 0
        ) {
            console.error("No parts in the content of the first candidate.");
            return null;
        }

        if (response.candidates[0].content?.parts[0]?.text) {
            const text = response.candidates[0].content.parts[0].text;

            console.log("===== RAW RESPONSE =====");
            console.log(text);
            console.log("========================");

            try {
                // Remove markdown code blocks if present
                let cleaned = text
                    .replace(/^```(?:json)?\n?/, "")
                    .replace(/\n?```$/, "")
                    .trim();

                const data = JSON.parse(cleaned);
                console.log("===== EXTRACTED DATA =====");
                console.log(JSON.stringify(data, null, 2));
                console.log("==========================");

                return data as CustomerFull;
            } catch (jsonError) {
                console.error("Failed to parse JSON:", jsonError);
                console.log("Failed text was:", text);
                return null;
            }
        }
    } catch (error) {
        console.error("Error during Google GenAI call:", error);
        return null;
    }
    return null;
}
