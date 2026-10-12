export const formatText = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const normalizeDate = (dateStr: string | undefined | null): string | null => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
        return null;
    }

    const trimmed = dateStr.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }

    const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (usMatch) {
        const [, month, day, year] = usMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const cleaned = trimmed.replace(/(\d)(st|nd|rd|th)/gi, '$1');
    const parsed = new Date(cleaned);

    if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const day = String(parsed.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return null;
}
