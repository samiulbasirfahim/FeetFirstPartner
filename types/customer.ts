export type Customer = {
    id?: number;
    fullName: string;
    dateOfBirth: string;
    lastOrderDate: string;
    contact: string;
    orderStatus: "ready" | "pending" | "completed";
};

export type CustomerFull = {
    id: number;
    gender: "man" | "woman";
    name: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    healthInsuranceProvider: string;
    healthInsuranceNumber: string;
    medicalDiagnosis: string;
    typeOfInsoles: string;
    validationOfPrescription: string;
};
