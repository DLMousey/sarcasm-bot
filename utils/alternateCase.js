export function alternateCase(text) {
    return text.split('').map((char, idx) =>
        idx & 1 ? char.toLowerCase() : char.toUpperCase()
    ).join('')
}
