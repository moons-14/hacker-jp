export const hfSummarize = async (
    text: string,
    token: string,
) => {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Falconsai/text_summarization",
        {
            headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            body: JSON.stringify({
                inputs: text
            }),
        }
    );
    const result: { summary_text: string }[] = await response.json();
    return result[0].summary_text;
}