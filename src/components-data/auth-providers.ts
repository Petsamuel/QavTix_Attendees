export type AuthProvider = {
    id: string;
    name: string;
    email?: string;
    status: "connected" | "disconnected" | "not_connected";
    icon: string;
}

export const INITIAL_PROVIDERS: AuthProvider[] = [
    {
        id: "google",
        name: "Google Account",
        email: "dominicevans@gmail.com",
        status: "connected",
        icon: "/images/vectors/google.svg",
    },
    {
        id: "facebook",
        name: "Facebook",
        email: "Dominic Evans Buchi",
        status: "disconnected",
        icon: "/images/vectors/facebook.svg",
    },
    {
        id: "apple",
        name: "Apple",
        status: "not_connected",
        icon: "/images/vectors/apple.svg",
    },
]