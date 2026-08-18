export function getNextId(prefix: string): number {
    const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(prefix));

    return keys.reduce((max, key) => {
        const id = Number(key.replace(prefix, ""));
        return Math.max(max, id);
    }, 0) + 1;
}

export function getAllByPrefix(prefix: string): any[] {

    const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(prefix));

    const list: any[] = [];

    for (const key of keys) {
        const item = localStorage.getItem(key);

        if (item) {
            list.push(JSON.parse(item));
        }
    }

    return list;
}