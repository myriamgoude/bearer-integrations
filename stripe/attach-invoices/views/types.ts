export type Invoice = {
    id: string;
    total: number;
    date: number;
    email: string;
    legal_entity: {
        business_name: string;
        first_name: string;
        last_name: string;
    },
    number: string;
    status: string;
    invoice_pdf: string;
}

export type Customer = {
    id: string;
    email: string;
}

export type TAuthSavedPayload = {
    authId: string
}

export type NavigationItem = Customer
