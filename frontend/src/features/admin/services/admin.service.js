import { IMAGES } from '../../../constants/images';

const INITIAL_USERS = [
  {
    id: 1,
    name: "Angel",
    role: "Enfant",
    email: "Angel.young@example.com",
    avatar: IMAGES.userAvatar1,
    joinDate: "9 Sep, 2020",
    joinDateSort: new Date("2020-09-09"),
    isVerified: false,
    isPending: false,
    stats: {
      booksRead: 8,
      reportsCount: 2,
      seniority: "0 ans"
    }
  },
  {
    id: 2,
    name: "Ethanis",
    role: "Auteur",
    email: "bill.sanders@example.com",
    avatar: IMAGES.userAvatar1,
    joinDate: "8 Sep, 2020",
    joinDateSort: new Date("2020-09-08"),
    isVerified: false,
    isPending: false,
    stats: {
      booksPublished: 34,
      reportsCount: 0,
      seniority: "15 ans"
    }
  },
  {
    id: 3,
    name: "Biffco Enterprises Ltd.",
    role: "Éditeur",
    email: "tranthuy.nute@gmail.com",
    avatar: IMAGES.userAvatar2,
    joinDate: "8 Nov, 2020",
    joinDateSort: new Date("2020-11-08"),
    isVerified: true,
    isPending: false,
    stats: {
      collectionsPublished: 3,
      reportsCount: 0,
      seniority: "15 ans"
    }
  },
  {
    id: 4,
    name: "Abstergo Ltd.",
    role: "Éditeur",
    email: "vuhaithuongnute@gmail.com",
    avatar: IMAGES.userAvatar3,
    joinDate: "7 Nov, 2017",
    joinDateSort: new Date("2017-11-07"),
    isVerified: false,
    isPending: true,
    stats: {
      collectionsPublished: 134,
      reportsCount: 21,
      seniority: "15 ans"
    }
  }
];

const INITIAL_BOOKS = [
  {
    id: 1,
    title: "World Children's Day",
    cover: IMAGES.bookCover,
    pages: 120,
    author: "Luther Queen",
    reads: "4.5K",
    reports: 3
  },
  {
    id: 2,
    title: "World Children's Day",
    cover: IMAGES.bookCover,
    pages: 120,
    author: "Luther Queen",
    reads: "4.5K",
    reports: 3
  },
  {
    id: 3,
    title: "World Children's Day",
    cover: IMAGES.bookCover,
    pages: 120,
    author: "Luther Queen",
    reads: "4.5K",
    reports: 3
  },
  {
    id: 4,
    title: "World Children's Day",
    cover: IMAGES.bookCover,
    pages: 120,
    author: "Luther Queen",
    reads: "4.5K",
    reports: 3
  },
  {
    id: 5,
    title: "World Children's Day",
    cover: IMAGES.bookCover,
    pages: 120,
    author: "Luther Queen",
    reads: "4.5K",
    reports: 3
  },
  {
    id: 6,
    title: "World Children's Day",
    cover: IMAGES.bookCover,
    pages: 120,
    author: "Luther Queen",
    reads: "4.5K",
    reports: 3
  }
];

const INITIAL_REPORTS = [
  {
    id: 1,
    user: {
      name: "Soham",
      avatar: IMAGES.userAvatar
    },
    book: "The Count of Monte Cristo",
    type: "Violence",
    description: "Ratou Maui kia haere ngatahi ai ko ona tuakana ki te hii ika. I te hokinga mai o ona tuakana Kivi...",
    date: "November 28, 2025",
    status: "Lu"
  },
  {
    id: 2,
    user: {
      name: "Colleen",
      avatar: IMAGES.userAvatar
    },
    book: "The Girl with the Dragon Tattoo",
    type: "Violence",
    description: "Whakamanahia Maui ki te hii-ika, kii Katia Matu...",
    date: "October 25, 2025",
    status: "Lu"
  },
  {
    id: 3,
    user: {
      name: "Ronald",
      avatar: IMAGES.userAvatar
    },
    book: "The Little Prince",
    type: "Violence",
    description: "ka puta mai a Maui, aue te ohorere o ona tuakana.!",
    date: "December 19, 2025",
    status: "Lu"
  },
  {
    id: 4,
    user: {
      name: "Emma",
      avatar: IMAGES.userAvatar
    },
    book: "1984",
    type: "Contenu inapproprié",
    description: "Contenu politique trop complexe pour des enfants.",
    date: "January 5, 2025",
    status: "Non traité"
  },
  {
    id: 5,
    user: {
      name: "Lucas",
      avatar: IMAGES.userAvatar
    },
    book: "Harry Potter",
    type: "Langage inapproprié",
    description: "Certains passages contiennent un langage inadapté.",
    date: "February 12, 2025",
    status: "Non traité"
  },
  {
    id: 6,
    user: {
      name: "Sophie",
      avatar: IMAGES.userAvatar
    },
    book: "Les Misérables",
    type: "Violence",
    description: "Scènes de violence trop explicites pour jeunes lecteurs.",
    date: "March 8, 2025",
    status: "Lu"
  }
];

export const adminService = {
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return INITIAL_USERS;
  },
  getAdminBooks: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return INITIAL_BOOKS;
  },
  getReports: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return INITIAL_REPORTS;
  }
};
