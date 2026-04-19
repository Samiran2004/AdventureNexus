import { randomBytes } from 'crypto';

/**
 * Generates a unique PNR number in the format: ANR-XXXXXXXXXX
 * (AdventureNexus Railway + 10 random alphanumeric chars)
 */
export function generatePNR(): string {
    const timestamp = Date.now().toString(36).toUpperCase(); // base36 timestamp
    const random = randomBytes(4).toString('hex').toUpperCase(); // 8 hex chars
    return `ANR${timestamp}${random}`.slice(0, 14); // e.g. ANR1K9X3FA2C
}

/**
 * Calculates fare based on class and distance
 */
export function calculateFare(
    seatClass: 'General' | 'Sleeper' | 'Second_AC' | 'Third_AC',
    distanceKm: number,
    passengersCount: number
): number {
    const baseRates: Record<string, number> = {
        General: 0.30,     // ₹0.30 per km
        Sleeper: 0.50,     // ₹0.50 per km
        Third_AC: 1.20,    // ₹1.20 per km
        Second_AC: 1.80    // ₹1.80 per km
    };

    const baseFare = Math.round(baseRates[seatClass] * Math.max(distanceKm, 100));
    const reservationCharge = seatClass !== 'General' ? 40 : 0;
    const superfastCharge = 45; // standard for express/rajdhani
    const totalPerPerson = baseFare + reservationCharge + superfastCharge;

    return Math.round(totalPerPerson * passengersCount);
}
