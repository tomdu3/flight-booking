# Database ERD (Entity Relationship Diagram)

This is a simplified Entity-Relationship Diagram (ERD) representation for the Flight Booking and Reservation System in a non relational database - MongoDB.

## Entities
- User
- Flight
- Booking
- Transaction
- Notification

### 1. Users Collection
```js
User {
    _id: ObjectId
    email: String
    password: String (hashed)
    firstName: String
    lastName: String
    phoneNumber: String
    address: {
        street: String
        city: String
        state: String
        country: String
        zipCode: String
    }
    preferences: {
        seatPreference: String
        mealPreference: String
        notificationPreferences: {
            email: Boolean
            sms: Boolean
            push: Boolean
        }
    }
    createdAt: DateTime
    updatedAt: DateTime
}
```
### 2. Flights Collection

```js
Flight {
    _id: ObjectId
    flightNumber: String
    airline: {
        code: String
        name: String
    }
    departure: {
        airport: String
        city: String
        terminal: String
        time: DateTime
    }
    arrival: {
        airport: String
        city: String
        terminal: String
        time: DateTime
    }
    duration: Number
    price: {
        economy: Number
        business: Number
        first: Number
    }
    seats: {
        economy: {
            total: Number
            available: Number
        }
        business: {
            total: Number
            available: Number
        }
        first: {
            total: Number
            available: Number
        }
    }
    status: String
    createdAt: DateTime
    updatedAt: DateTime
}
```

### 3. Bookings Collection

```js
Booking {
    _id: ObjectId
    userId: ObjectId
    flightId: ObjectId
    bookingReference: String
    status: String
    passengers: [{
        firstName: String
        lastName: String
        email: String
        phoneNumber: String
        seatNumber: String
        seatClass: String
        specialRequests: String
    }]
    payment: {
        amount: Number
        currency: String
        status: String
        transactionId: String
        paymentMethod: String
    }
    cancellation: {
        cancelled: Boolean
        reason: String
        refundAmount: Number
        refundStatus: String
    }
    createdAt: DateTime
    updatedAt: DateTime
}
```

### 4. Transactions Collection

```js
Transaction {
    _id: ObjectId
    bookingId: ObjectId
    userId: ObjectId
    amount: Number
    currency: String
    paymentMethod: String
    status: String
    paymentGatewayResponse: Object
    createdAt: DateTime
    updatedAt: DateTime
}
```

### 5. Notifications Collection

```js
Notification {
    _id: ObjectId
    userId: ObjectId
    bookingId: ObjectId
    type: String
    title: String
    message: String
    status: String
    read: Boolean
    createdAt: DateTime
    updatedAt: DateTime
}
```

## Relationships

1. User to Bookings: One-to-Many
   - A user can have multiple bookings
   - Each booking belongs to one user

2. Flight to Bookings: One-to-Many
   - A flight can have multiple bookings
   - Each booking is associated with one flight

3. Booking to Transactions: One-to-One
   - Each booking has one transaction
   - Each transaction belongs to one booking

4. User to Notifications: One-to-Many
   - A user can have multiple notifications
   - Each notification belongs to one user

5. Booking to Notifications: One-to-Many
   - A booking can have multiple notifications
   - Each notification is associated with one booking


## Diagram
```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER ||--o{ NOTIFICATION : receives
    FLIGHT ||--o{ BOOKING : has
    BOOKING ||--|| TRANSACTION : generates
    BOOKING ||--o{ NOTIFICATION : triggers

    USER {
        ObjectId _id
        string email
        string password
        string firstName
        string lastName
        string phoneNumber
        object address
        object preferences
        datetime createdAt
        datetime updatedAt
    }

    FLIGHT {
        ObjectId _id
        string flightNumber
        object airline
        object departure
        object arrival
        number duration
        object price
        object seats
        string status
        datetime createdAt
        datetime updatedAt
    }

    BOOKING {
        ObjectId _id
        ObjectId userId
        ObjectId flightId
        string bookingReference
        string status
        array passengers
        object payment
        object cancellation
        datetime createdAt
        datetime updatedAt
    }

    TRANSACTION {
        ObjectId _id
        ObjectId bookingId
        ObjectId userId
        number amount
        string currency
        string paymentMethod
        string status
        object paymentGatewayResponse
        datetime createdAt
        datetime updatedAt
    }

    NOTIFICATION {
        ObjectId _id
        ObjectId userId
        ObjectId bookingId
        string type
        string title
        string message
        string status
        boolean read
        datetime createdAt
        datetime updatedAt
    }
```