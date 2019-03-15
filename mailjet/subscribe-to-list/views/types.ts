export type ContactList = {
    IsDeleted: boolean;
    Name: string;
    Address: string;
    CreatedAt: Date | string;
    ID: number;
    SubscriberCount: number;
}

export type Contact = {
    ContactID: number;
    Email: string;
    Action: string;
    Name: string;
}

export type NavigationItem = ContactList
