// Centralized image URLs for the application
import hourglassWaiting from '../assets/images/hourglass-waiting.png';
import childReadingBook from '../assets/images/child-reading-book.png';
import userAvatarEditor from '../assets/images/user-avatar-editor.png';
import collectionBooksStack from '../assets/images/collection-books-stack.png';
import collectionLibrary from '../assets/images/collection-library.png';
import logo from '../assets/images/logo.png';
import childReading from '../assets/images/child-reading.png';
import featuresIcons from '../assets/images/features-icons.png';
import superheroLogin from '../assets/images/superhero-login.png';
import superheroGirl from '../assets/images/superhero-girl.png';
import roleEditor from '../assets/images/role-reader.png';
import roleChild from '../assets/images/role-child.png';
import roleAuthor from '../assets/images/role-author.png';
import bookCoverKidsPicnic from '../assets/images/book-cover-kids-picnic.png';
import bookCoverAdmin from '../assets/images/book-cover-admin.png';
import bookCoverAutumn from '../assets/images/book-cover-autumn.png';
import bookCoverSpring from '../assets/images/book-cover-spring.png';
import minigameQcm from '../assets/images/minigame-qcm.png';
import minigameCadenas from '../assets/images/minigame-cadenas.png';
import minigameMemoire from '../assets/images/minigame-memoire.png';
import badgeVerified from '../assets/images/badge-verified.png';
import badgePending from '../assets/images/badge-pending.png';
import userAvatar1 from '../assets/images/user-avatar-1.png';
import userAvatar2 from '../assets/images/user-avatar-2.png';
import userAvatar3 from '../assets/images/user-avatar-3.png';
import otpSecurityShield from '../assets/images/otp-security-shield.svg';
import successCheckmark from '../assets/images/success-checkmark.svg';
import passwordDot from '../assets/images/password-dot.svg';
import checkboxDefault from '../assets/images/checkbox-default.svg';
import searchIcon from '../assets/images/search-icon.svg'; // Souvent traité comme image si SVG complexe

// --- ICONS ---
import eyeIconView from '../assets/icons/eye-icon.png';
import iconEyeView from '../assets/icons/icon-eye-view.png';
import eyeOff from '../assets/images/eye-off.svg';
import iconInfo from '../assets/icons/icon-info.png';
import iconViewBook from '../assets/icons/icon-view-book.png';
import iconDelete from '../assets/icons/icon-delete.png';
import iconDeleteRed from '../assets/icons/icon-delete-red.png';
import iconEdit from '../assets/icons/icon-edit.png';
import iconPublish from '../assets/icons/icon-publish.png';
import iconAddToCollection from '../assets/icons/icon-add-to-collection.png';
import iconDashboard from '../assets/icons/icon-dashboard.png';
import iconUsers from '../assets/icons/icon-users.png';
import iconBooks from '../assets/icons/icon-books.png';
import iconCollections from '../assets/icons/icon-collections.png';
import iconSignalements from '../assets/icons/icon-signalements.png';
import iconLogout from '../assets/icons/icon-logout.png';
import iconNotification from '../assets/icons/icon-notification.png';
import iconStats from '../assets/icons/icon-stats.png';
import iconMenuAction from '../assets/icons/icon-menu-action.png';
import iconFilter from '../assets/icons/icon-filter.png';
import iconTrashRed from '../assets/icons/icon-trash-red.png';

export const IMAGES = {
  // Logos
  logo: logo,
  logoAlt: logo,

  // User avatars
  userAvatar: userAvatarEditor,
  userAvatarEditor: userAvatarEditor,
  userAvatar1: userAvatar1,
  userAvatar2: userAvatar2,
  userAvatar3: userAvatar3,

  // UI Icons
  search: searchIcon,
  searchIcon: searchIcon,
  eyeOff: eyeOff,
  eyeOffAlt: eyeOff,
  eyeIconView: eyeIconView,
  passwordDot: passwordDot,
  checkboxDefault: checkboxDefault,

  // Role icons
  roleEditor: roleEditor,
  roleChild: roleChild,
  roleAuthor: roleAuthor,

  // Collection images
  collection1: collectionBooksStack,
  collection2: collectionLibrary,
  collectionBooksStack: collectionBooksStack,
  collectionLibrary: collectionLibrary,

  // Book covers
  bookCover: bookCoverAdmin,
  bookCoverKidsPicnic: bookCoverKidsPicnic,
  bookCoverLibrary: bookCoverKidsPicnic,
  bookCoverAutumn: bookCoverAutumn,
  bookCoverSpring: bookCoverSpring,

  // Icons
  eyeIcon: iconEyeView,

  // Card icons
  viewIcon: iconViewBook,
  iconViewBook: iconViewBook,
  deleteIcon: iconDelete,
  iconDelete: iconDelete,
  iconDeleteRed: iconDeleteRed,
  iconEdit: iconEdit,
  iconPublish: iconPublish,
  infoIcon: iconInfo,
  iconInfo: iconInfo,
  addToCollectionIcon: iconAddToCollection,
  iconAddToCollection: iconAddToCollection,
  actionIcon: iconAddToCollection,

  // Admin menu icons
  dashboardIcon: iconDashboard,
  usersIcon: iconUsers,
  booksIcon: iconBooks,
  collectionsIcon: iconCollections,
  reportsIcon: iconSignalements,
  logoutIcon: iconLogout,

  // Admin dashboard icons
  demandesIcon: iconStats,
  signalementsIcon: iconStats,
  notificationIcon: iconNotification,

  // User page icons
  verifiedBadge: badgeVerified,
  pendingBadge: badgePending,
  filterIcon: iconFilter,
  menuActionIcon: iconMenuAction,
  trashIconRed: iconTrashRed,

  // Auth page illustrations
  heroSuperman: superheroLogin,
  heroGirlSticker: superheroGirl,
  heroGirlStickerAlt1: superheroGirl,
  featherIllustration: roleAuthor,
  hourglassIllustration: hourglassWaiting,
  childrenIllustration: childReading,
  dadaIllustration: featuresIcons,
  sasasasIllustration: childReadingBook,

  // OTP/Validation pages
  otpImage: otpSecurityShield,
  otpSecurityShield: otpSecurityShield,
  validationCheckmark: successCheckmark,
  successCheckmark: successCheckmark,
  waitingClock: hourglassWaiting,
  hourglassWaiting: hourglassWaiting,
  childReadingBook: childReadingBook,

  // Mini-games images
  minigameQcm: minigameQcm,
  minigameCadenas: minigameCadenas,
  minigameMemoire: minigameMemoire,
  minigameTexteATrous: minigameQcm,
};

export const MINI_GAMES_IMAGES = {
  'digital-lock': minigameCadenas,
  'fill-blanks': minigameQcm,
  'quiz': minigameQcm,
  'memory': minigameMemoire,
};

export const MINI_GAME_TYPES = [
  {
    id: 'digital-lock',
    label: 'Cadenas numérique',
    description: 'Entrez le code correct pour déverrouiller l\'objet.'
  },
  {
    id: 'fill-blanks',
    label: 'Texte à trous',
    description: 'Remplis les mots manquants pour compléter la phrase.'
  },
  {
    id: 'quiz',
    label: 'QCM',
    description: 'Choisis la bonne réponse parmi plusieurs propositions.'
  },
  {
    id: 'memory',
    label: 'Jeu de mémoire',
    description: 'Associe les paires de cartes identiques.'
  },
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Facile' },
  { id: 'medium', label: 'Moyen' },
  { id: 'hard', label: 'Difficile' }
];