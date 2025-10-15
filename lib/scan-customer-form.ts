import { CustomerFull } from "@/types/customer";
import { takePicture } from "./imagePicker";
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY,
});

export async function scanCustomerForm() {
    const image = await takePicture();

    if (!image) {
        console.log("No image URL obtained.");
        return [];
    }

    const model = "gemini-2.5-flash";

    const prompt = `
You are an expert at extracting customer and prescription data from medical documents, prescriptions, and patient forms.
These documents are in German or Italian.

CRITICAL RULES:
1. Return ONLY a valid JSON object with the structure below. No markdown, no explanations, no extra text.
2. Extract ALL available customer information from the document.
3. Return the object directly - do NOT wrap it in an "items" array or any other container.

REQUIRED OUTPUT STRUCTURE:
{
  "gender": "man" | "woman",
  "name": "first name",
  "lastName": "last name",
  "email": "email address",
  "dateOfBirth": "YYYY-MM-DD format",
  "healthInsuranceProvider": "insurance company name",
  "healthInsuranceNumber": "insurance policy/member number",
  "medicalDiagnosis": "diagnosis or medical condition",
  "typeOfInsoles": "type/description of prescribed insoles",
  "validationOfPrescription": "prescription validation date or reference"
}

FIELD EXTRACTION RULES:

Gender:
- Look for: "Herr"/"Mr" = "man", "Frau"/"Mrs"/"Ms" = "woman"
- German: "männlich" = "man", "weiblich" = "woman"
- Italian: "uomo"/"maschio" = "man", "donna"/"femmina" = "woman"
- If not found, use: ""

Name & Last Name:
- Extract from patient/customer name fields
- Look for: "Name", "Vorname", "Nachname", "Nome", "Cognome", "Patient"
- If not found, use: ""

Email:
- Extract email address if present
- Look for standard email format: user@domain.com
- If not found, use: ""

Date of Birth:
- Convert to YYYY-MM-DD format (e.g., "1985-03-15")
- Look for: "Geburtsdatum", "Geb.", "Data di nascita", "DOB"
- Accept formats: DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD
- If not found, use: ""

Health Insurance Provider:
- Look for: "Krankenkasse", "Versicherung", "Assicurazione sanitaria", "Insurance"
- Extract the insurance company name
- If not found, use: ""

Health Insurance Number:
- Look for: "Versicherungsnummer", "Mitgliedsnummer", "Numero di assicurazione"
- Extract policy or member ID number
- If not found, use: ""

Medical Diagnosis:
- Look for: "Diagnose", "Diagnosi", "Diagnosis", "ICD", "Befund"
- Extract the medical condition or diagnosis description
- If not found, use: ""

Type of Insoles:
- Look for: "Einlagen", "Schuheinlagen", "Plantari", "Insoles", "Versorgung"
- Extract the type/description of prescribed orthopedic insoles
- Common types: "sensomotorische Einlagen", "orthopädische Einlagen", "Sporteinlagen"
- If not found, use: ""

Validation of Prescription:
- Look for: "Gültig bis", "Verordnungsdatum", "Rezeptdatum", "Valido fino al", "Valid until"
- Extract prescription date or validation date
- Convert to YYYY-MM-DD format if possible
- If not found, use: ""

IMPORTANT: 
- All fields must be strings
- Use empty string "" if information is not found
- Do NOT use null or undefined
- Do NOT wrap the output in markdown code blocks
- Return ONLY the raw JSON object

Now extract customer information from this document. Return ONLY the JSON object.
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
            return {};
        }

        if (!response.candidates[0].content) {
            console.error("No content in the first candidate.");
            return {};
        }

        if (
            !response.candidates[0].content.parts ||
            response.candidates[0].content.parts.length === 0
        ) {
            console.error("No parts in the content of the first candidate.");
            return {};
        }

        if (response.candidates[0].content?.parts[0]?.text) {
            const text = response.candidates[0].content.parts[0].text;

            try {
                let cleaned = text
                    .replace(/^```(?:json)?\n?/, "")
                    .replace(/\n?```$/, "");
                const data = JSON.parse(cleaned);
                console.log("Extracted Data:", data);
                return data as CustomerFull;
            } catch (jsonError) {
                console.error("Failed to parse JSON:", jsonError);
            }
        }
    } catch (error) {
        console.error("Error during Google GenAI call:", error);
        return {};
    }
}
