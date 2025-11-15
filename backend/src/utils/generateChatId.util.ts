export default function generateChatId(a: string, b: string) {
    return a < b ? `${a}_${b}` : `${b}_${a}`;
}
