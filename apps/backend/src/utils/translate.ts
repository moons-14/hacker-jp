export const translate = async (text: string, ApiKey: string, ApiSecret: string, loginName: string) => {

    const ApiBaseUrl = "https://mt-auto-minhon-mlt.ucri.jgn-x.jp";

    const getAccessTokenFormData = new FormData();
    getAccessTokenFormData.append('grant_type', 'client_credentials');
    getAccessTokenFormData.append('client_id', ApiKey);
    getAccessTokenFormData.append('client_secret', ApiSecret);
    getAccessTokenFormData.append('urlAccessToken', `${ApiBaseUrl}/oauth2/token.php`);

    const accessTokenResult: {
        access_token: string;
    } = await fetch(`${ApiBaseUrl}/oauth2/token.php`, {
        method: 'POST',
        body: getAccessTokenFormData
    }).then((res) => res.json())

    const accessToken = accessTokenResult.access_token;

    const translateFormData = new FormData();
    translateFormData.append('text', text);
    translateFormData.append('type', 'json');
    translateFormData.append('name', loginName);
    translateFormData.append('access_token', accessToken);
    translateFormData.append('key', ApiKey);
    translateFormData.append('api_name', 'mt');
    translateFormData.append('api_param', 'news_en_ja');

    const translatedTextResult: {
        resultset: {
            result: {
                text: string;
            }
        }
    } = await fetch(`${ApiBaseUrl}/api/`, {
        method: 'POST',
        body: translateFormData
    }).then((res) => res.json())

    console.log(translatedTextResult)

    const translatedText = translatedTextResult.resultset.result.text;

    return translatedText;
}