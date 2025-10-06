import { IHotelContact, IHotelLocation, IHotelReview, IHotelRoom } from "./locationDTO"

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

enum Category {
    Hotel = "Hotel",
    Resort = "Resort",
    Apartment = "Apartment",
    Villa = "Villa",
    Hostel = "Hostel"
}
