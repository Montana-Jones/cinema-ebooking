// app/data/dummyCustomer.js

const dummyCustomer = {
  id: "CUST001",
  firstName: "Emma",
  lastName: "Stone",
  email: "emma.stone@example.com",
  status: "ACTIVE",
  bookings: [
    { id: "B001", movieTitle: "Inception", date: "2025-08-01" },
    { id: "B002", movieTitle: "Interstellar", date: "2025-07-20" },
    { id: "B003", movieTitle: "Oppenheimer", date: "2025-05-12" },
    { id: "B004", movieTitle: "Dune 2", date: "2025-02-28" },
  ],
  paymentInfo: [
    { cardNumber: "**** **** **** 4242", cardHolder: "Emma Stone", expiry: "12/26" },
    { cardNumber: "**** **** **** 1111", cardHolder: "Emma Stone", expiry: "08/25" },
    { cardNumber: "**** **** **** 9999", cardHolder: "Emma Stone", expiry: "10/27" },
  ],
};

export default dummyCustomer;
