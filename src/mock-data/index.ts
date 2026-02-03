export const mockMyTicketsTableData = [
    {
      id: "1",
      event: {
          id: '101',
          title: "DevFest Lekki",
          category: "Tech Summit",
          image: "/images/demo-images/event-detail-img.png",
          location: "Lekki, Lagos",
          date: "Nov 14, 2025",
          time: "9:00 am",
      },
      paymentStatus: "pending",
      timelineStatus: "today",
      ticketsSold: 450,
      totalTickets: 500,
      revenue: 4500000,
    },
    {
      id: "2",
      event: {
          id: '102',
          title: "5ive Tour",
          category: "Music Festival",
          image: "/images/demo-images/event-detail-img.png",
          location: "Eko Hotel, Lagos",
          date: "Nov 15, 2025",
          time: "6:00 pm",
      },
      paymentStatus: "cancelled",
      timelineStatus: "tomorrow",
      ticketsSold: 0,
      totalTickets: 1000,
      revenue: 0,
  },
    {
      id: "3",
      event: {
          id: '103',
          title: "Bole Fest 2025",
          category: "Food Festival",
          image: "/images/demo-images/event-detail-img.png",
          location: "Port Harcourt, Nigeria",
          date: "Nov 17, 2025",
          time: "11:00 am",
      },
      paymentStatus: "confirmed",
      timelineStatus: "upcoming",
      ticketsSold: 1200,
      totalTickets: 2000,
      revenue: 6000000,
    }
]




export const eventsMock: IEvent[] = [
  {
    id: crypto.randomUUID(),
    image: "/images/demo-images/event-detail-img.png",
    status: "filling-fast",
    category: "Networking",
    host: "Qavdev",
    title: "Learn to create visually appealing and user friendly interfaces",
    date: "Tomorrow, March 22, 9AM WAT",
    location: "1234, Shima Road, Victoria Island, Lagos",
    price: "₦3,500",
    originalPrice: "₦5,500",
    href: "/ui-workshop",
    attendees: [
      {
        id: 1,
        name: "Ada Daniels",
        profile_img: "/images/demo-images/92572293e79392f138749e26843319d3c61da1ae.png",
        username: "adadaniels"
      },
      {
        id: 2,
        name: "Bola Kareem",
        profile_img: "",
        username: "bolak"
      },
      {
        id: 3,
        name: "Chinedu James",
        profile_img: "",
        username: "cjames"
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    image: "/images/demo-images/event-detail-img.png",
    status: "sold-out",
    originalPrice: "₦5,500",
    category: "Design",
    host: "UX Lagos",
    title: "Product Design Systems Masterclass",
    date: "Saturday, March 30, 10AM WAT",
    location: "Landmark Centre, Victoria Island, Lagos",
    price: "₦7,000",
    href: "/design-systems",
    attendees: [
      {
        id: 1,
        name: "Funmi Nelson",
        profile_img: "",
        username: "funmin"
      },
      {
        id: 2,
        name: "Grace Okafor",
        profile_img: "/images/demo-images/92572293e79392f138749e26843319d3c61da1ae.png",
        username: "graceo"
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    image: "/images/demo-images/event-detail-img.png",
    status: "near-capacity",
    originalPrice: "₦5,500",
    category: "Tech Meetup",
    host: "Frontend NG",
    title: "Modern Frontend Architecture Meetup",
    date: "Friday, April 5, 6PM WAT",
    location: "Radisson Blu, Ikeja, Lagos",
    price: "Free",
    href: "/frontend-meetup",
    attendees: [
      {
        id: 1,
        name: "Joshua Smith",
        profile_img: "",
        username: "joshsmith"
      },
      {
        id: 2,
        name: "Kemi Taiwo",
        profile_img: "/images/demo-images/92572293e79392f138749e26843319d3c61da1ae.png",
        username: "kemit"
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    image: "/images/demo-images/event-detail-img.png",
    status: "near-capacity",
    originalPrice: "₦5,500",
    category: "Tech Meetup",
    host: "Frontend NG",
    title: "Advanced Frontend Architecture Meetup",
    date: "Friday, April 5, 6PM WAT",
    location: "Radisson Blu, Ikeja, Lagos",
    price: "Free",
    href: "/advanced-meetup",
    attendees: [
      {
        id: 1,
        name: "Joshua Smith",
        profile_img: "",
        username: "joshsmith"
      },
      {
        id: 2,
        name: "Kemi Taiwo",
        profile_img: "/images/demo-images/92572293e79392f138749e26843319d3c61da1ae.png",
        username: "kemit"
      }
    ]
  }
]



export const mockAffiliateTableData = [
    {
        id: "1",
        date: "Nov 14, 2025",
        event: {
            title: "DevFest Lekki",
            category: "Tech Summit",
            image: "/images/demo-images/event-detail-img.png",
        },
        ticketsSold: 3,
        totalSale: 15000,
        commission: 1500,
        status: "pending",
    },
    {
        id: "2",
        date: "Nov 15, 2025",
        event: {
            title: "5ive Tour Concert",
            category: "Music Festival",
            image: "/images/demo-images/event-detail-img.png",
        },
        ticketsSold: 1,
        totalSale: 5000,
        commission: 500,
        status: "paid",
    },
    {
        id: "3",
        date: "Nov 17, 2025",
        event: {
            title: "Bole Fest 2025",
            category: "Food Festival",
            image: "/images/demo-images/event-detail-img.png",
        },
        ticketsSold: 2,
        totalSale: 9000,
        commission: 900,
        status: "paid",
    },
    {
        id: "4",
        date: "Nov 18, 2025",
        event: {
            title: "PS5 Gamers Clash",
            category: "Sports Event",
            image: "/images/demo-images/event-detail-img.png",
        },
        ticketsSold: 1,
        totalSale: 7200,
        commission: 720,
        status: "hold",
    }
]



export const mockWithdrawalData = [
    {
        id: "1",
        date: "Nov 14, 2025",
        amount: 7000,
        bank: {
            name: "Dominic Evans Onyebuchi",
            bankName: "First Bank Nigeria",
            logo: "/images/demo-images/bank-logo.png"
          },
        status: "processing"
    },
    {
        id: "2",
        date: "Nov 12, 2025",
        amount: 5000,
        bank: {
            name: "Buchi Johnson",
            bankName: "MoniePoint",
            logo: "/images/demo-images/bank-logo.png"
          },
        status: "completed"
    },
    {
        id: "3",
        date: "Nov 11, 2025",
        amount: 6200,
        bank: {
            name: "Evans Dominic Buchi",
            bankName: "Opay",
            logo: "/images/demo-images/bank-logo.png"
          },
        status: "completed"
    }
];



export const INITIAL_GROUPS: Group[] = [
    {
        id: "1",
        name: "Benefit Boys",
        members: [
            { id: "u1", full_name: "Dominic Evans", email: "d@test.com", phone: "090" },
            { id: "u2", full_name: "Buchi Johnson", email: "b@test.com", phone: "080" },
            { id: "u3", full_name: "Evans Dominic", email: "e@test.com", phone: "070" },
        ],
        contributionSplit: 100,
    },
    // Duplicate entries as seen in your screenshot
    { id: "2", name: "Benefit Boys", members: new Array(3).fill({}), contributionSplit: 100 },
    { id: "3", name: "Benefit Boys", members: new Array(3).fill({}), contributionSplit: 100 },
]