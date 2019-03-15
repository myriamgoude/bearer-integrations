export type Calendar = {
  id: string
  kind: string
  summary: string
  etag: string
  timeZone?: string
}

export type GoogleEvent = {
  id?: string;
  kind?: string;
  etag?: string;
  summary: string;
  location: string;
  start: {
    dateTime: Date
  };
  end: {
    dateTime: Date
  };
  hangoutLink?: string;
  htmlLink?: string;
  attendees: Attendee[];
}

export type Attendee = {
  email: string;
  displayName?: string;
}

export type NavigationItem = Calendar

export type TAuthSavedPayload = {
  authId: string
}
