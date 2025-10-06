export interface IHotelLocation {
    address: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
    geo: IGeo
}

export interface IHotelReview {
    userId: string
    userName: string
    rating: number
    comment: string
}

enum RoomType {
    Standard = "Standard",
    Deluxe = "Deluxe",
    Suite = "Suite",
    Family = "Family",
    Penthouse = "Penthouse"
}

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

interface IGeo {
    type?: string,
    coordinates: [number, number]
}

export interface IHotelContact {
    phoneNumber: string;
    email: string
}
