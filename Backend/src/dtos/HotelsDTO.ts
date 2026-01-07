import { IHotelContact, IHotelLocation, IHotelReview, IHotelRoom } from "./locationDTO"

/**
 * Interface representing the detailed structure of a Hotel entity.
 * Includes relationships to location, contact, rooms, and reviews.
 */
export interface IHotel {
    hotel_name: string,
    description: string,
    category: Category
    starRating: number,
    location: IHotelLocation
    contact: IHotelContact
    images?: string[]
    amenities?: string[]
    checkInTime: string
    checkOutTime: string
    policies?: string[]
    rooms: IHotelRoom[]
    reviews: IHotelReview[]
}

/**
 * Enum for Hotel Categories.
 * Defines standard types of accommodation.
 */
enum Category {
    Hotel = "Hotel",
    Resort = "Resort",
    Apartment = "Apartment",
    Villa = "Villa",
    Hostel = "Hostel"
}
