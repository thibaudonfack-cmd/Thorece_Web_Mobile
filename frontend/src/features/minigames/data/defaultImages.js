// Bibliothèque d'images par défaut pour les mini-jeux
// Images SVG optimisées pour enfants avec rendu UI/UX excellent

export const defaultImages = [
    {
        id: 'cat',
        name: '🐱 Chat',
        category: 'Animaux',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="#FF9E80"/>
            <circle cx="70" cy="80" r="12" fill="#333"/>
            <circle cx="130" cy="80" r="12" fill="#333"/>
            <path d="M 70 110 Q 100 125 130 110" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="100" cy="105" r="8" fill="#FF6B6B"/>
            <polygon points="40,40 50,20 60,40" fill="#FF9E80"/>
            <polygon points="140,40 150,20 160,40" fill="#FF9E80"/>
            <circle cx="75" cy="82" r="4" fill="#FFF"/>
            <circle cx="135" cy="82" r="4" fill="#FFF"/>
        </svg>`,
    },
    {
        id: 'dog',
        name: '🐶 Chien',
        category: 'Animaux',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="#A0826D"/>
            <ellipse cx="50" cy="70" rx="25" ry="35" fill="#A0826D"/>
            <ellipse cx="150" cy="70" rx="25" ry="35" fill="#A0826D"/>
            <circle cx="75" cy="85" r="12" fill="#333"/>
            <circle cx="125" cy="85" r="12" fill="#333"/>
            <circle cx="100" cy="110" r="10" fill="#333"/>
            <path d="M 100 120 L 90 140" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            <path d="M 100 120 L 110 140" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            <circle cx="78" cy="87" r="4" fill="#FFF"/>
            <circle cx="128" cy="87" r="4" fill="#FFF"/>
        </svg>`,
    },
    {
        id: 'bear',
        name: '🐻 Ours',
        category: 'Animaux',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle cx="50" cy="50" r="30" fill="#8B6F47"/>
            <circle cx="150" cy="50" r="30" fill="#8B6F47"/>
            <circle cx="100" cy="100" r="75" fill="#A0826D"/>
            <ellipse cx="100" cy="120" rx="45" ry="35" fill="#D4A574"/>
            <circle cx="80" cy="90" r="10" fill="#333"/>
            <circle cx="120" cy="90" r="10" fill="#333"/>
            <ellipse cx="100" cy="115" rx="8" ry="12" fill="#333"/>
            <path d="M 75 130 Q 100 140 125 130" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`,
    },
    {
        id: 'rabbit',
        name: '🐰 Lapin',
        category: 'Animaux',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <ellipse cx="80" cy="60" rx="20" ry="50" fill="#FFF" transform="rotate(-20 80 60)"/>
            <ellipse cx="120" cy="60" rx="20" ry="50" fill="#FFF" transform="rotate(20 120 60)"/>
            <ellipse cx="85" cy="70" rx="12" ry="35" fill="#FFB6C1" transform="rotate(-20 85 70)"/>
            <ellipse cx="115" cy="70" rx="12" ry="35" fill="#FFB6C1" transform="rotate(20 115 70)"/>
            <circle cx="100" cy="110" r="70" fill="#FFF"/>
            <circle cx="85" cy="100" r="10" fill="#333"/>
            <circle cx="115" cy="100" r="10" fill="#333"/>
            <circle cx="100" cy="120" r="6" fill="#FFB6C1"/>
            <path d="M 85 135 Q 100 145 115 135" stroke="#333" stroke-width="2" fill="none"/>
        </svg>`,
    },
    {
        id: 'elephant',
        name: '🐘 Éléphant',
        category: 'Animaux',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <ellipse cx="100" cy="100" rx="85" ry="70" fill="#9E9E9E"/>
            <ellipse cx="30" cy="100" rx="25" ry="60" fill="#9E9E9E"/>
            <circle cx="50" cy="70" r="20" fill="#B0B0B0"/>
            <circle cx="150" cy="70" r="20" fill="#B0B0B0"/>
            <circle cx="80" cy="85" r="10" fill="#333"/>
            <circle cx="120" cy="85" r="10" fill="#333"/>
            <path d="M 30 100 Q 20 160 40 170" stroke="#9E9E9E" stroke-width="25" fill="none" stroke-linecap="round"/>
        </svg>`,
    },
    {
        id: 'apple',
        name: '🍎 Pomme',
        category: 'Fruits',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <ellipse cx="100" cy="110" rx="70" ry="75" fill="#FF5252"/>
            <ellipse cx="90" cy="100" rx="60" ry="65" fill="#FF6B6B"/>
            <rect x="95" y="30" width="10" height="30" fill="#8B4513" rx="5"/>
            <ellipse cx="120" cy="40" rx="20" ry="10" fill="#4CAF50" transform="rotate(30 120 40)"/>
            <ellipse cx="70" cy="90" rx="20" ry="30" fill="#FF8A80" opacity="0.5"/>
        </svg>`,
    },
    {
        id: 'banana',
        name: '🍌 Banane',
        category: 'Fruits',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path d="M 50 100 Q 80 40 120 50 Q 160 60 150 120 Q 140 150 100 160 Q 60 150 50 100" fill="#FFD54F"/>
            <path d="M 50 100 Q 80 45 120 55 Q 155 65 145 115" fill="#FFF9C4" opacity="0.6"/>
            <ellipse cx="120" cy="55" rx="15" ry="8" fill="#C6A700"/>
            <path d="M 55 105 L 60 160" stroke="#C6A700" stroke-width="3" fill="none"/>
        </svg>`,
    },
    {
        id: 'orange',
        name: '🍊 Orange',
        category: 'Fruits',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="75" fill="#FF9800"/>
            <circle cx="100" cy="100" r="70" fill="#FFA726"/>
            <ellipse cx="80" cy="80" rx="25" ry="35" fill="#FFB74D" opacity="0.5"/>
            <rect x="95" y="25" width="10" height="20" fill="#8B4513" rx="5"/>
            <ellipse cx="100" cy="30" rx="15" ry="8" fill="#4CAF50"/>
            <g transform="translate(100, 100)">
                ${[0,45,90,135,180,225,270,315].map(angle =>
                    `<line x1="0" y1="0" x2="${60*Math.cos(angle*Math.PI/180)}" y2="${60*Math.sin(angle*Math.PI/180)}" stroke="#FF8F00" stroke-width="1" opacity="0.3"/>`
                ).join('')}
            </g>
        </svg>`,
    },
    {
        id: 'strawberry',
        name: '🍓 Fraise',
        category: 'Fruits',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path d="M 100 160 Q 60 140 50 100 Q 45 70 70 50 Q 100 40 130 50 Q 155 70 150 100 Q 140 140 100 160" fill="#F44336"/>
            <path d="M 70 50 Q 60 40 50 45 Q 55 35 65 38 Q 70 25 80 30 Q 85 20 95 25 Q 100 15 110 20 Q 115 15 120 20 Q 128 18 130 25 Q 138 22 142 30 L 130 50" fill="#4CAF50"/>
            ${[...Array(20)].map((_, i) => {
                const x = 70 + Math.random() * 60;
                const y = 70 + Math.random() * 70;
                return `<circle cx="${x}" cy="${y}" r="2" fill="#FFE57F"/>`;
            }).join('')}
        </svg>`,
    },
    {
        id: 'car',
        name: '🚗 Voiture',
        category: 'Véhicules',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <rect x="40" y="90" width="120" height="50" fill="#2196F3" rx="10"/>
            <path d="M 60 90 L 70 60 L 130 60 L 140 90" fill="#42A5F5"/>
            <rect x="75" y="65" width="20" height="20" fill="#90CAF9" rx="2"/>
            <rect x="105" y="65" width="20" height="20" fill="#90CAF9" rx="2"/>
            <circle cx="65" cy="140" r="18" fill="#333"/>
            <circle cx="65" cy="140" r="10" fill="#666"/>
            <circle cx="135" cy="140" r="18" fill="#333"/>
            <circle cx="135" cy="140" r="10" fill="#666"/>
            <rect x="145" y="105" width="10" height="8" fill="#FFD54F" rx="2"/>
            <rect x="155" y="105" width="10" height="8" fill="#FF5252" rx="2"/>
        </svg>`,
    },
    {
        id: 'star',
        name: '⭐ Étoile',
        category: 'Formes',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#FFA000;stop-opacity:1" />
                </linearGradient>
            </defs>
            <polygon points="100,20 120,80 180,80 130,115 150,175 100,140 50,175 70,115 20,80 80,80" fill="url(#starGradient)" stroke="#FF8F00" stroke-width="3"/>
            <polygon points="100,40 112,75 145,75 118,95 130,130 100,110 70,130 82,95 55,75 88,75" fill="#FFECB3" opacity="0.7"/>
        </svg>`,
    },
    {
        id: 'heart',
        name: '❤️ Cœur',
        category: 'Formes',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF6B9D;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#C2185B;stop-opacity:1" />
                </linearGradient>
            </defs>
            <path d="M 100 170 Q 30 110 30 70 Q 30 30 60 30 Q 80 30 100 50 Q 120 30 140 30 Q 170 30 170 70 Q 170 110 100 170" fill="url(#heartGradient)"/>
            <ellipse cx="75" cy="60" rx="20" ry="25" fill="#FFB6C1" opacity="0.5"/>
        </svg>`,
    },
];

// Convertir SVG en Data URL pour utilisation directe
export const defaultImagesWithDataURL = defaultImages.map(img => ({
    ...img,
    dataUrl: `data:image/svg+xml;base64,${btoa(img.svg)}`,
    url: `data:image/svg+xml;base64,${btoa(img.svg)}`, // Alias pour compatibilité
}));

// Grouper par catégorie
export const imagesByCategory = defaultImagesWithDataURL.reduce((acc, img) => {
    if (!acc[img.category]) {
        acc[img.category] = [];
    }
    acc[img.category].push(img);
    return acc;
}, {});

export default defaultImagesWithDataURL;
