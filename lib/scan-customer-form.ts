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
  "typeOfPrescription": "prescription/insole description"
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
- Example format: "Daitenhausener Str. 10, 85386 Eching"
- Default: ""

Date of Birth (Geburtsdatum):
- Look for: "Geburtsdatum", "Geb.", "Data di nascita", "DOB"
- Accept formats: DD.MM.YY, DD.MM.YYYY, DD/MM/YYYY
- ALWAYS convert to YYYY-MM-DD format
- Example: "22.07.64" → "1964-07-22" or "2064-07-22" (use context, usually 1900s)
- Default: ""

Insurance Number (Versichertennummer):
- Look for: "Versichertennummer", "Vers.-Nr.", "Insurance Number"
- Example: "Z411008593"
- Default: ""

Status Code (Status):
- Look for: "Status", "Status Code"
- Example: "100000"
- Default: ""

Date of Prescription (Datum der Verordnung):
- Look for: "Datum der Verordnung", "Verordnungsdatum", "Rezeptdatum", "Prescription Date"
- Accept formats: DD.MM.YY, DD.MM.YYYY
- ALWAYS convert to YYYY-MM-DD format
- Example: "07.10.25" → "2025-10-07"
- Default: ""

VERSICHERUNGSDATEN (INSURANCE DATA):

Health Insurance Provider (Kostenträger / Krankenkasse):
- Look for: "Kostenträger", "Krankenkasse", "Versicherung", "Insurance"
- Examples: "BARMER", "AOK Bayern", "TK", "DAK"
- Default: ""

Health Insurance Provider ID (Kostenträgerkennung):
- Look for: "Kostenträgerkennung", "IK-Nummer", "Kassen-Nr.", "Provider ID"
- CRITICAL: This may appear as "Kassen-Nr." on the left side of the form
- Also look in the top right corner in the field labeled "Apotheken-Nummer / IK"
- This is a 7-9 digit number (e.g., "4200042", "108380007")
- DO NOT confuse with Versicherten-Nr. (patient insurance number) or BVG boxes (6,7,8,9)
- The BVG boxes indicate prescription type, NOT the provider ID
- Default: ""

Clinic ID (Betriebsstätten-Nr / BSNR):
- Look for: "Betriebsstätten-Nr", "BSNR", "Clinic ID"
- Example: "644417400"
- 9-digit number
- Default: ""

Prescribing Doctor (Verordnender Arzt):
- Look for: "Verordnender Arzt", "Arzt", "Doctor", "Dr."
- Include title and full name
- Example: "Dr. med. Alexander Dittmar"
- Default: ""

Clinic Address (Praxisadresse):
- Look for: "Praxisadresse", "Clinic Address", "Practice Address"
- Extract full address
- Example: "Terminalstraße Mitte 18, 85356 München Flughafen"
- Default: ""

Physician ID (Arzt-Nr / LANR):
- Look for: "Arzt-Nr", "LANR", "Physician ID", "Arztnummer"
- Example: "732269410"
- 9-digit number
- Default: ""

⚕️ MEDIZINISCHE DATEN (MEDICAL DATA):

Medical Diagnosis (Ärztliche Diagnose):
- Look for: "Diagnose", "Ärztliche Diagnose", "Diagnosis", "ICD", "Befund"
- Extract complete diagnosis text
- Example: "Knick-Senk-Spreizfuß bds., Achillodynie li."
- Common terms: "bds." (beidseitig/bilateral), "li." (links/left), "re." (rechts/right)
- Default: ""

Type of Prescription (Art der Verordnung / Einlage):
- Look for: "Art der Verordnung", "Einlage", "Verordnung", "Type of Prescription"
- Extract complete prescription description including quantity and specifications
- Example: "2 Paar Weichpolsterbettungseinlagen + Fersenweichpolsterung 2x aus hygienischen Gründen nach Formabdruck; Quer & Längsgewölbeunterstützung bds."
- Include details about: quantity (Paar), type (Weichpolsterung, etc.), reasons, specifications
- Default: ""

IMPORTANT NOTES:
- All fields must be strings
- Use empty string "" if information is not found - NEVER use null or undefined
- For dates: ALWAYS convert to YYYY-MM-DD format regardless of input format
- For 2-digit years: use context (prescription dates are recent = 20xx, birth dates are older = 19xx)
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
