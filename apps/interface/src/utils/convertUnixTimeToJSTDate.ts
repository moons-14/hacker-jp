export function convertUnixTimeToJSTDate(unixTime: number): Date {
    const offset = 0;
    const dateInJST = new Date(unixTime * 1000 + offset);
    return dateInJST;
}