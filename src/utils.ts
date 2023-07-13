export const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\(retire\)/g, '')
        .replace(/[^a-zA-Z0-9\-\/\s]/g, '')
        .trim();
};
