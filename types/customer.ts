export type Customer = {
    id?: number;
    fullName: string;
    dateOfBirth: string;
    lastOrderDate: string;
    contact: string;
    orderStatus: "ready" | "pending" | "completed";
};

// export type CustomerFull = {
//     id: number;
//     gender: "man" | "woman";
//     name: string;
//     lastName: string;
//     email: string;
//     dateOfBirth: string;
//     healthInsuranceProvider: string;
//     healthInsuranceNumber: string;
//     medicalDiagnosis: string;
//     typeOfInsoles: string;
//     validationOfPrescription: string;
// };

export type CustomerFull = {
    id: number;

    // personal info
    gender: "man" | "woman";
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    dateOfBirth: string;
    insuranceNumber: string;
    statusCode: string;
    dateOfPrescription: string;

    // insurance info
    healthInsuranceProvider: string;
    healthInsuranceProviderId: string;
    clinicId: string;
    prescribingDoctor: string;
    clinicAddress: string;
    physicianId: string;

    // medical info
    medicalDiagnosis: string;
    typeOfPrescription: string;
};
