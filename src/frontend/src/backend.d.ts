import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PhoneNumber = bigint;
export type Category = {
    __kind__: "joy";
    joy: null;
} | {
    __kind__: "perseverance";
    perseverance: null;
} | {
    __kind__: "deliverance";
    deliverance: null;
} | {
    __kind__: "thanksgiving";
    thanksgiving: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "hope";
    hope: null;
} | {
    __kind__: "love";
    love: null;
} | {
    __kind__: "education";
    education: null;
} | {
    __kind__: "salvation";
    salvation: null;
} | {
    __kind__: "wisdom";
    wisdom: null;
} | {
    __kind__: "forgiveness";
    forgiveness: null;
} | {
    __kind__: "healing";
    healing: null;
} | {
    __kind__: "marriage";
    marriage: null;
} | {
    __kind__: "career";
    career: null;
} | {
    __kind__: "peace";
    peace: null;
} | {
    __kind__: "guidance";
    guidance: null;
} | {
    __kind__: "patience";
    patience: null;
} | {
    __kind__: "family";
    family: null;
} | {
    __kind__: "testimony";
    testimony: null;
} | {
    __kind__: "finances";
    finances: null;
} | {
    __kind__: "faith";
    faith: null;
};
export type Time = bigint;
export interface PrayerRequest {
    id: bigint;
    status: Status;
    name: string;
    email?: Email;
    message: string;
    timestamp: Time;
    category: Category;
    phone?: PhoneNumber;
}
export interface UserProfile {
    name: string;
    email: string;
}
export type Email = string;
export enum Status {
    submitted = "submitted",
    answered = "answered",
    prayedFor = "prayedFor"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPrayerRequests(): Promise<Array<PrayerRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPrayerRequestsByCategory(category: Category): Promise<Array<PrayerRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitPrayerRequest(name: string, phone: PhoneNumber | null, email: Email | null, category: Category, message: string): Promise<bigint>;
    updatePrayerRequestStatus(id: bigint, status: Status): Promise<void>;
}
