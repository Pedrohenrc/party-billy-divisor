export function getNextId(prefix: string): number {
    const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(prefix));

    return keys.reduce((max, key) => {
        const id = Number(key.replace(prefix, ""));
        return Math.max(max, id);
    }, 0) + 1;
}