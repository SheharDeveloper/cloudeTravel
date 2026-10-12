/** Clients must be at least this old (the server checks the same). */
export const MIN_CLIENT_AGE = 18;

/** The latest date of birth for someone who is at least `years` old today: "YYYY-MM-DD". */
export function latestBirthDate(years = MIN_CLIENT_AGE): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The message for a date of birth under the minimum age, or null when it's fine (or empty). */
export function clientAgeError(dob: string | null | undefined, years = MIN_CLIENT_AGE): string | null {
    if (!dob) return null;
    return dob > latestBirthDate(years) ? `The client must be at least ${years} years old.` : null;
}
