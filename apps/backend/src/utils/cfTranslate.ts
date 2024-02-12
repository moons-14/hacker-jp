export const cfTranslate = async (text: string, accountId: string, token: string) => {

    const textArray = text.split(".");
    const translatedTextArray: string[] = [];

    for (const text of textArray) {
        if (text === "") continue;

        const translated = await cfTranslateRequest(text, accountId, token);
        translatedTextArray.push(translated);
    }

    return translatedTextArray.join(" ");
}

const cfTranslateRequest = async (text: string, accountId: string, token: string) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/m2m100-1.2b`;

    const response: {
        result: { translated_text: string; }
    } = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: text,
            source_lang: "english", // defaults to english
            target_lang: "japanese"
        })
    }).then((res) => res.json());

    console.log(response)

    if (!response.result.translated_text) {
        throw new Error("failed to translate text");
    }

    return response.result.translated_text;
}