export const summarize = async (markdown: string, accountId: string, token: string) => {

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-2-7b-chat-fp16`;

    const response: {
        result: {
            response: string
        }
    } = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: "Generate a summary based on the given text. \nOutput only the summary.",
                },
                {
                    role: "user",
                    content: `# Given text\n \`\`\`\n${markdown}\n\`\`\` ¥n¥n # Summarise Text\n This is a summary of the given text.`,
                }
            ],
            stream: false,
            max_tokens: 3072
        })
    }).then((res) => res.json());

    console.log(response)
    if (!response.result.response) {
        throw new Error("failed to generate summary");
    }

    const translatedText = response.result.response;

    const summary = translatedText.split(":")[1];

    return summary;
}