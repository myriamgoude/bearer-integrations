export type Forms = {
    id: string;
    title: string;
    last_updated_at: string;
    self: {
        href: string;
    },
    _links: {
        display: string;
    }
}

export type TAuthSavedPayload = {
    authId: string
}
