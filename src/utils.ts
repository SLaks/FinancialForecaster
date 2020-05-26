export function deserializeWithDates(json: string): unknown {
    return JSON.parse(json,
        (key, value) => key.endsWith('Date')
            ? value && new Date(value) : value);
}