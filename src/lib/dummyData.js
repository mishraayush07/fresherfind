export const hostels = [
  {
    id: 1,
    name: "Student Haven",
    type: "hostel",
    location: "Near IIT Delhi, Hauz Khas",
    city: "Delhi",
    rating: 4.5,
    price: 8000,
    priceUnit: "month",
    capacity: "3 seater",
    gender: "male",
    amenities: ["WiFi", "Food", "Laundry", "AC", "Hot Water"],
    images: ["/hostels/hostel1.jpg", "/hostels/hostel1-room.jpg", "/hostels/hostel1-bathroom.jpg"],
    description: "A comfortable hostel designed for students with all facilities. Located just 5 minutes from IIT Delhi campus with easy access to metro station.",
    contact: "+91 9876543210",
    reviews: [
      { id: 101, user: "Rahul S.", rating: 4, comment: "Clean rooms and great food. WiFi could be better." },
      { id: 102, user: "Amit K.", rating: 5, comment: "Perfect location for IIT students. Highly recommended!" }
    ]
  },
  {
    id: 2,
    name: "Campus Comfort",
    type: "hostel",
    location: "Near DU North Campus, Kamla Nagar",
    city: "Delhi",
    rating: 4.3,
    price: 7500,
    priceUnit: "month",
    capacity: "2 seater",
    gender: "female",
    amenities: ["WiFi", "Food", "Gym", "CCTV", "Study Area"],
    images: ["/hostels/hostel2.jpg", "/hostels/hostel2-room.jpg", "/hostels/hostel2-study.jpg"],
    description: "Comfortable hostel for female students with secure environment and all basic amenities. Walking distance to Delhi University North Campus.",
    contact: "+91 9876543211",
    reviews: [
      { id: 201, user: "Priya M.", rating: 4, comment: "Very secure and clean. Food is good." },
      { id: 202, user: "Neha G.", rating: 5, comment: "The study area is excellent for preparing for exams." }
    ]
  },
  {
    id: 3,
    name: "Scholar's Nest",
    type: "hostel",
    location: "Near JNU, Vasant Kunj",
    city: "Delhi",
    rating: 4.7,
    price: 9000,
    priceUnit: "month",
    capacity: "Single Room",
    gender: "mixed",
    amenities: ["WiFi", "Food", "Study Room", "AC", "Laundry", "Library"],
    images: ["/hostels/hostel3.jpg", "/hostels/hostel3-room.jpg", "/hostels/hostel3-library.jpg"],
    description: "Premium hostel with private rooms for serious students. Includes quiet study spaces and a small library. Perfect for research scholars.",
    contact: "+91 9876543212",
    reviews: [
      { id: 301, user: "Vikram S.", rating: 5, comment: "The library and study spaces are perfect for my PhD research." },
      { id: 302, user: "Anjali R.", rating: 4, comment: "Peaceful environment, but slightly expensive." }
    ]
  },
  {
    id: 4,
    name: "Academic Abode",
    type: "hostel",
    location: "Near DTU, Rohini",
    city: "Delhi",
    rating: 4.4,
    price: 8500,
    priceUnit: "month",
    capacity: "4 seater",
    gender: "male",
    amenities: ["WiFi", "Food", "Library", "Games Room", "Hot Water"],
    images: ["/hostels/hostel4.jpg", "/hostels/hostel4-room.jpg", "/hostels/hostel4-common.jpg"],
    description: "Affordable hostel with spacious rooms and good facilities. Popular among engineering students with dedicated study areas.",
    contact: "+91 9876543213",
    reviews: [
      { id: 401, user: "Ravi P.", rating: 4, comment: "Great for DTU students. The games room is a nice stress reliever." },
      { id: 402, user: "Suresh L.", rating: 5, comment: "Clean and well-maintained. Food is excellent." }
    ]
  }
];

export const pgs = [
  {
    id: 1,
    name: "Comfort Zone PG",
    type: "pg",
    location: "Koramangala, 5th Block",
    city: "Bangalore",
    rating: 4.6,
    price: 12000,
    priceUnit: "month",
    capacity: "Double Sharing",
    gender: "male",
    amenities: ["WiFi", "Food", "AC", "Washing Machine", "TV", "Power Backup"],
    images: ["/pgs/pg1.jpg", "/pgs/pg1-room.jpg", "/pgs/pg1-dining.jpg"],
    description: "Premium PG accommodation with homely food and all modern amenities. Located in the heart of Bangalore's tech hub with easy access to major IT parks.",
    contact: "+91 9876543214",
    reviews: [
      { id: 101, user: "Karthik N.", rating: 5, comment: "Great location, clean rooms, and tasty food. Perfect for working professionals." },
      { id: 102, user: "Vishal M.", rating: 4, comment: "Good amenities but can improve on food variety." }
    ]
  },
  {
    id: 2,
    name: "Home Away PG",
    type: "pg",
    location: "HSR Layout, Sector 1",
    city: "Bangalore",
    rating: 4.4,
    price: 10500,
    priceUnit: "month",
    capacity: "Triple Sharing",
    gender: "female",
    amenities: ["WiFi", "Food", "Laundry", "CCTV", "Security Guard", "Power Backup"],
    images: ["/pgs/pg2.jpg", "/pgs/pg2-room.jpg", "/pgs/pg2-common.jpg"],
    description: "Secure and comfortable PG for women with homely atmosphere. Strategically located with easy access to tech parks and shopping areas.",
    contact: "+91 9876543215",
    reviews: [
      { id: 201, user: "Divya S.", rating: 4, comment: "Very secure and well-maintained. The staff is helpful." },
      { id: 202, user: "Sneha R.", rating: 5, comment: "Feels like home. Food is delicious and rooms are clean." }
    ]
  },
  {
    id: 3,
    name: "Tech Valley PG",
    type: "pg",
    location: "Whitefield, ITPL Main Road",
    city: "Bangalore",
    rating: 4.2,
    price: 11000,
    priceUnit: "month",
    capacity: "Single Room",
    gender: "mixed",
    amenities: ["WiFi", "Food", "AC", "Gym", "Recreation Room", "Parking"],
    images: ["/pgs/pg3.jpg", "/pgs/pg3-room.jpg", "/pgs/pg3-gym.jpg"],
    description: "Modern PG with private rooms and premium facilities. Located near major IT companies with shuttle service to tech parks.",
    contact: "+91 9876543216",
    reviews: [
      { id: 301, user: "Arun K.", rating: 4, comment: "Great facilities and convenient location for IT professionals." },
      { id: 302, user: "Meera P.", rating: 4, comment: "Clean and modern. The gym is a nice addition." }
    ]
  },
  {
    id: 4,
    name: "Green View PG",
    type: "pg",
    location: "Indiranagar, 12th Main",
    city: "Bangalore",
    rating: 4.7,
    price: 13000,
    priceUnit: "month",
    capacity: "Double Sharing",
    gender: "female",
    amenities: ["WiFi", "Food", "AC", "Balcony", "Housekeeping", "Power Backup"],
    images: ["/pgs/pg4.jpg", "/pgs/pg4-room.jpg", "/pgs/pg4-balcony.jpg"],
    description: "Premium PG in the heart of Indiranagar with beautiful views and excellent facilities. Perfect for young professionals and students.",
    contact: "+91 9876543217",
    reviews: [
      { id: 401, user: "Pooja R.", rating: 5, comment: "Beautiful location with great amenities. Food is delicious." },
      { id: 402, user: "Sanjana K.", rating: 4, comment: "Clean and well-maintained. Staff is very helpful." }
    ]
  }
];

export const mess = [
  {
    id: 1,
    name: "Shanti Mess Service",
    type: "mess",
    location: "Ameerpet, Near Metro Station",
    city: "Hyderabad",
    rating: 4.5,
    price: 3500,
    priceUnit: "month",
    mealType: "Veg & Non-Veg",
    timing: "Breakfast, Lunch, Dinner",
    speciality: "South Indian",
    images: ["/mess/mess1.jpg", "/mess/mess1-food.jpg", "/mess/mess1-dining.jpg"],
    description: "Authentic South Indian mess with homely food. Offers both vegetarian and non-vegetarian options with clean dining facilities.",
    contact: "+91 9876543218",
    reviews: [
      { id: 101, user: "Venkat R.", rating: 5, comment: "The South Indian food here is authentic and delicious." },
      { id: 102, user: "Deepak M.", rating: 4, comment: "Good quality food at reasonable prices." }
    ]
  },
  {
    id: 2,
    name: "Mom's Kitchen",
    type: "mess",
    location: "Madhapur, Near Hitech City",
    city: "Hyderabad",
    rating: 4.7,
    price: 4000,
    priceUnit: "month",
    mealType: "Veg",
    timing: "Lunch, Dinner",
    speciality: "North Indian",
    images: ["/mess/mess2.jpg", "/mess/mess2-food.jpg", "/mess/mess2-dining.jpg"],
    description: "Pure vegetarian mess serving North Indian cuisine. Known for its cleanliness and home-style cooking with fresh ingredients.",
    contact: "+91 9876543219",
    reviews: [
      { id: 201, user: "Amit S.", rating: 5, comment: "Perfect vegetarian food that reminds me of home." },
      { id: 202, user: "Neha G.", rating: 4, comment: "Clean environment and tasty food. Slightly expensive but worth it." }
    ]
  },
  {
    id: 3,
    name: "Foodie's Paradise",
    type: "mess",
    location: "Gachibowli, Near University",
    city: "Hyderabad",
    rating: 4.3,
    price: 3800,
    priceUnit: "month",
    mealType: "Veg & Non-Veg",
    timing: "All Meals",
    speciality: "Multi-Cuisine",
    images: ["/mess/mess3.jpg", "/mess/mess3-food.jpg", "/mess/mess3-dining.jpg"],
    description: "Student-friendly mess offering multi-cuisine options. Popular among university students with flexible meal plans and timings.",
    contact: "+91 9876543220",
    reviews: [
      { id: 301, user: "Rahul K.", rating: 4, comment: "Great variety in food. The flexible meal plans are very convenient." },
      { id: 302, user: "Priya M.", rating: 4, comment: "Good food at reasonable prices. Perfect for students." }
    ]
  },
  {
    id: 4,
    name: "Gharwali Thali",
    type: "mess",
    location: "Kondapur, Main Road",
    city: "Hyderabad",
    rating: 4.6,
    price: 4200,
    priceUnit: "month",
    mealType: "Veg",
    timing: "Lunch, Dinner",
    speciality: "Gujarati & Rajasthani",
    images: ["/mess/mess4.jpg", "/mess/mess4-food.jpg", "/mess/mess4-dining.jpg"],
    description: "Authentic Gujarati and Rajasthani thali service with unlimited servings. Known for its variety and authentic taste.",
    contact: "+91 9876543221",
    reviews: [
      { id: 401, user: "Rajesh G.", rating: 5, comment: "Amazing Gujarati food. The unlimited servings are a great deal." },
      { id: 402, user: "Sonal P.", rating: 4, comment: "Authentic taste that reminds me of home. Very good service." }
    ]
  }
];

export const services = [
  { id: "hostels", name: "Hostels", count: hostels.length },
  { id: "pgs", name: "PGs", count: pgs.length },
  { id: "mess", name: "Mess", count: mess.length },
  { id: "flats", name: "Flats", count: 15 },
  { id: "stationary", name: "Stationary", count: 8 },
  { id: "mentors", name: "Find Mentor", count: 12 },
  { id: "laundry", name: "Laundry", count: 10 },
  { id: "transport", name: "Transport", count: 7 },
  { id: "gym", name: "Gym", count: 9 },
  { id: "library", name: "Library", count: 6 },
  { id: "events", name: "Events", count: 14 },
  { id: "more", name: "More", count: 20 }
]; 