const BASE_URL = 'https://api.sleeper.app/v1';
const SERVER_BASE_URL = 'http://localhost:8000'
const AVATAR_URL = 'https://sleepercdn.com/avatars'
export const sleeper_apiGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}?ts=${Date.now()}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const serverGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`,
        { credentials: "include" }
    )

    return response.json() as Promise<T>
}
export const serverPost = async <T, U>(endpoint: string, data: U): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        }
    )
    return response.json() as Promise<T>
}
export const serverProtectedPost = async <T>(req: Request): Promise<T> => {

    const response = await fetch(req)
    if (response.status == 401) {
        const newTokenReq = await fetch("REFRESHROUTE")
        if (newTokenReq.status == 401) {
            throw new Error("Session Expired, Please Login Again")
        }
        const retryReq = await fetch(req)
        return retryReq.json() as Promise<T>
    }
    return response.json() as Promise<T>

}
export const sleeper_avatarGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${AVATAR_URL}${endpoint}`)


    return response.blob() as Promise<T>
}