
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function generateData(data: any): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/generate/zip`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("backend error", errorData);
        throw new Error(JSON.stringify(errorData));
    }

    return await response.blob();

}

export async function generateAISchema(prompt: string){
    const response = await fetch(`${API_BASE_URL}/generate/ai-schema`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({prompt}),
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }

    return await response.json();

}

