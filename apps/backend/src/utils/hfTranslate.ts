export const hfTranslate = async (
    text: string,
    token: string,
) => {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-ja-en",
        {
            headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            body: JSON.stringify({
                inputs: text,
            }),
        }
    );
    const result = await response.json();
    return result;
}