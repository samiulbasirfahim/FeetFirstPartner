import { createWorker, Worker, PSM } from 'tesseract.js';

export interface OCRResult {
    text: string;
    confidence: number;
    words: Array<{
        text: string;
        confidence: number;
        bbox: {
            x0: number;
            y0: number;
            x1: number;
            y1: number;
        };
    }>;
}

export class GermanOCRWorker {
    private worker: Worker | null = null;
    private isInitialized = false;

    /**
     * Initialize the OCR worker with German language support
     */
    async initialize(): Promise<void> {
        if (this.isInitialized && this.worker) {
            return;
        }

        try {
            console.log('Initializing German OCR worker...');
            
            // Create worker with German language
            this.worker = await createWorker('deu', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            });

            // Set OCR parameters for better German text recognition
            await this.worker.setParameters({
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzäöüÄÖÜß0123456789.,:-/ ',
                preserve_interword_spaces: '1',
            });

            this.isInitialized = true;
            console.log('German OCR worker initialized successfully');
        } catch (error) {
            console.error('Failed to initialize OCR worker:', error);
            throw new Error('OCR initialization failed');
        }
    }

    /**
     * Recognize text from image URI with German language support
     */
    async recognizeText(imageUri: string): Promise<OCRResult> {
        if (!this.worker || !this.isInitialized) {
            await this.initialize();
        }

        if (!this.worker) {
            throw new Error('OCR worker not available');
        }

        try {
            console.log('Starting German text recognition...');
            
            const result = await this.worker.recognize(imageUri);
            
            const ocrResult: OCRResult = {
                text: result.data.text.trim(),
                confidence: result.data.confidence,
                words: result.data.words?.map((word: any) => ({
                    text: word.text,
                    confidence: word.confidence,
                    bbox: word.bbox
                })) || []
            };

            console.log(`OCR completed with ${ocrResult.confidence}% confidence`);
            console.log('Extracted text:', ocrResult.text);

            return ocrResult;
        } catch (error) {
            console.error('OCR recognition failed:', error);
            throw new Error('Text recognition failed');
        }
    }

    /**
     * Extract structured warehouse data from German text
     */
    extractWarehouseInfo(text: string): {
        labels: string[];
        locations: string[];
        suppliers: string[];
        articleNumbers: string[];
        quantities: Array<{ size: string; quantity: number }>;
        status: string | null;
    } {
        const result = {
            labels: [] as string[],
            locations: [] as string[],
            suppliers: [] as string[],
            articleNumbers: [] as string[],
            quantities: [] as Array<{ size: string; quantity: number }>,
            status: null as string | null
        };

        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        for (const line of lines) {
            // German warehouse patterns
            if (this.matchesPattern(line, /lager|warehouse|depot|halle/i)) {
                result.labels.push(line);
            }
            
            if (this.matchesPattern(line, /regal|shelf|fach|platz|standort/i)) {
                result.locations.push(line);
            }
            
            if (this.matchesPattern(line, /lieferant|supplier|hersteller|firma/i)) {
                result.suppliers.push(line);
            }
            
            if (this.matchesPattern(line, /artikel|art\.?nr|item|sku/i)) {
                result.articleNumbers.push(line);
            }

            // Extract quantities with German size patterns
            const quantityMatches = line.match(/(\d+)\s*(stück|stk|pcs|pieces|x)?\s*(größe|size|gr\.?)?\s*(\d{2,3})/gi);
            if (quantityMatches) {
                quantityMatches.forEach(match => {
                    const numbers = match.match(/\d+/g);
                    if (numbers && numbers.length >= 2) {
                        const quantity = parseInt(numbers[0]);
                        const size = numbers[1];
                        result.quantities.push({ size, quantity });
                    }
                });
            }

            // German status patterns
            if (this.matchesPattern(line, /vorrätig|auf lager|verfügbar|in stock/i)) {
                result.status = 'In Stock';
            } else if (this.matchesPattern(line, /wenig|niedrig|low|knapp/i)) {
                result.status = 'Low';
            } else if (this.matchesPattern(line, /ausverkauft|nicht verfügbar|out of stock|leer/i)) {
                result.status = 'Out of Stock';
            }
        }

        return result;
    }

    private matchesPattern(text: string, pattern: RegExp): boolean {
        return pattern.test(text);
    }

    /**
     * Clean up the OCR worker
     */
    async terminate(): Promise<void> {
        if (this.worker) {
            try {
                await this.worker.terminate();
                console.log('OCR worker terminated');
            } catch (error) {
                console.error('Error terminating OCR worker:', error);
            } finally {
                this.worker = null;
                this.isInitialized = false;
            }
        }
    }
}

// Singleton instance for reuse
let ocrWorkerInstance: GermanOCRWorker | null = null;

/**
 * Get the singleton OCR worker instance
 */
export function getGermanOCRWorker(): GermanOCRWorker {
    if (!ocrWorkerInstance) {
        ocrWorkerInstance = new GermanOCRWorker();
    }
    return ocrWorkerInstance;
}

/**
 * Hook for using German OCR functionality
 */
export function useGermanOCR() {
    const worker = getGermanOCRWorker();

    const recognizeGermanText = async (imageUri: string): Promise<OCRResult> => {
        return await worker.recognizeText(imageUri);
    };

    const extractWarehouseData = (text: string) => {
        return worker.extractWarehouseInfo(text);
    };

    const cleanup = async () => {
        await worker.terminate();
    };

    return {
        recognizeGermanText,
        extractWarehouseData,
        cleanup
    };
}