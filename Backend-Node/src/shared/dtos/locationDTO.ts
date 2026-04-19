/**
 * Interface for Hotel Location Details including Geo-coordinates.
 */
export interface IHotelLocation {
    address: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
    geo: IGeo
}

/**
 * Interface for Hotel Reviews.
 * links review content to a user.
 */
export interface IHotelReview {
    userId: string
    userName: string
    rating: number
    comment: string
}

/**
 * Enum for Hotel Room Types.
 */
enum RoomType {
    Standard = "Standard",
    Deluxe = "Deluxe",
    Suite = "Suite",
    Family = "Family",
    Penthouse = "Penthouse"
}

/**
 * Interface for Hotel Room details.
 */
export interface IHotelRoom {
    roomType: RoomType
    description: string
    pricePerNight: number
    capacity: {
        adults: number
        children: number
    }
    amenities?: [string]
    bookedDates?: [{ from: string, to: string }]
    images?: [string]
}

/**
 * Interface for Geo-JSON compatible coordinates.
 */
interface IGeo {
    type?: string,
    coordinates: [number, number]
}

/**
 * Interface for Hotel Contact Information.
 */
export interface IHotelContact {
    phoneNumber: string;
    email: string
}
