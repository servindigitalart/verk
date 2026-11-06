// VERK · los 10 sistemas (sección «Sistemas», doc 16). Portado de lab/f1/systems/data.mjs (verificado en F1) y de
// lab/f3-generative-experience/portfolio (logos optimizados y política de embebido). Nada inventado:
//   · UX Analyzer no tiene logo → placa tipográfica «Logo pendiente ⏳»
//   · Los Fibos: estado «Operativo ⏳», contenido pendiente de aprobación, sin vista en vivo ni enlace activo
//   · DocLink: sin enlace (URL pública pendiente)
//   · Capturas de producto: ninguna disponible ni autorizada → placeholder visible
export const STATES = {"op":"Operativo","evo":"En Evolución","inv":"Investigación","dev":"Desarrollo Activo"};

// Embebido: comprobado el 2026-11-05 con una petición por sitio (curl -sS -L -D -, sin cookies), leyendo
// X-Frame-Options y Content-Security-Policy (frame-ancestors) de la respuesta final. No se evaden políticas.
export const EMBED_CHECKED = '2026-11-05';
export const EMBED = {
  'https://sonoro-six.vercel.app/': { embeddable: true, header: 'sin X-Frame-Options ni CSP frame-ancestors' },
  'https://prisma-site-eight.vercel.app/': { embeddable: false, header: 'X-Frame-Options: DENY' },
  'https://cleansolaraus.com/': { embeddable: false, header: 'X-Frame-Options: SAMEORIGIN' },
  'https://losfibos.com/': { embeddable: true, header: 'sin X-Frame-Options ni CSP frame-ancestors (redirige a www.losfibos.com)', hold: 'Contenido pendiente de aprobación: no se embebe ni se captura' },
  'https://waterlu.com.mx/': { embeddable: false, header: 'X-Frame-Options: DENY' },
};

// Capturas reales de las páginas públicas (autorizadas el 2026-11-05; scripts/qa/capture-systems.mjs): primera y segunda
// pantalla. Solo de los sitios que bloquean el embebido. Se presentan como imágenes del proyecto, nunca como vista en vivo
// (el panel no ofrece «En vivo» para ellos: solo «Sitio», con enlace externo).
export const CAPTURES_DATE = '2026-11-05';
const CAPTURES = { 'SIS-03': '/systems/sis-03-site.webp', 'SIS-05': '/systems/sis-05-site.webp', 'SIS-10': '/systems/sis-10-site.webp' };

export const SYSTEMS = [
  {
    "id": "SIS-01",
    "name": "Sonoro",
    "state": "op",
    "cap": [
      "Sistemas distribuidos",
      "IA en producción"
    ],
    "glosa": "Convertir contenido extenso en audio no es narrar un texto. Es construir un pipeline que no falle.",
    "system": "Una plataforma que transforma documentos en audiolibros narrados con IA, de principio a fin.",
    "layers": [
      [
        "Presentation",
        "Astro, React Islands"
      ],
      [
        "Logic",
        "FastAPI"
      ],
      [
        "Processing",
        "Redis, async workers"
      ],
      [
        "Storage",
        "PostgreSQL, S3"
      ],
      [
        "Infrastructure",
        "Stripe billing"
      ],
      [
        "AI",
        "Google TTS"
      ]
    ],
    "tech": "Astro, React, TypeScript, Python, FastAPI, PostgreSQL, Redis, S3-compatible storage, Google Cloud Text-to-Speech, Google Books API, Open Library API, Stripe",
    "url": "https://sonoro-six.vercel.app/",
    "logo": {
      "src": "/project-logos/sonoro/favicon.svg",
      "w": 640,
      "h": 640,
      "kind": "icon",
      "plate": "#111110"
    }
  },
  {
    "id": "SIS-02",
    "name": "DocLink",
    "state": "evo",
    "cap": [
      "Plataforma"
    ],
    "glosa": "Las clínicas tienen potencial de crecimiento digital que nadie identifica ni convierte en clientes.",
    "system": "Un ecosistema que prospecta, califica y convierte clínicas en suscriptores, en una sola plataforma.",
    "layers": [
      [
        "Presentation",
        "Next.js, Astro"
      ],
      [
        "Logic",
        "FastAPI microservices"
      ],
      [
        "Automation",
        "automation engine"
      ],
      [
        "Storage",
        "PostgreSQL, Supabase"
      ],
      [
        "Infrastructure",
        "Railway, Clerk, Paddle"
      ],
      [
        "AI",
        "scoring & enrichment engines"
      ]
    ],
    "tech": "Python, FastAPI, Next.js, React, Clerk, Astro, Railway, Redis, PostgreSQL, Supabase, Paddle, Resend",
    "url": null,
    "urlNote": "URL pública pendiente ⏳ (la actual es un preview que expone un usuario)",
    "logo": {
      "src": "/project-logos/doclink/doclink-logo-dark.png",
      "w": 640,
      "h": 213,
      "kind": "wordmark",
      "plate": "#F0EEE9"
    }
  },
  {
    "id": "SIS-03",
    "name": "PRISMA",
    "state": "evo",
    "cap": [
      "Arquitectura de conocimiento"
    ],
    "glosa": "El cine siempre se organiza por género, director o país. Nunca por cómo se siente.",
    "system": "Una plataforma que explora cine a través de una taxonomía visual propia: color, ritmo, abstracción.",
    "layers": [
      [
        "Presentation",
        "Astro, SSR"
      ],
      [
        "Data",
        "Supabase auth & APIs"
      ],
      [
        "Enrichment",
        "Python pipeline + AI scoring"
      ],
      [
        "Storage",
        "PostgreSQL"
      ]
    ],
    "tech": "Astro, TypeScript, Supabase, PostgreSQL, Python, TMDB API, Vercel",
    "url": "https://prisma-site-eight.vercel.app/",
    "logo": {
      "src": "/systems/sis-03.webp",
      "w": 640,
      "h": 640,
      "kind": "cover",
      "plate": "#000000"
    }
  },
  {
    "id": "SIS-04",
    "name": "UX Analyzer",
    "state": "inv",
    "cap": [
      "Arquitectura de conocimiento"
    ],
    "glosa": "Diseñar por inspiración es subjetivo. Antes de construir, hay que entender cómo funcionan los sitios premium.",
    "system": "Una herramienta interna que analiza sitios existentes y convierte lo observado en datos estructurados.",
    "layers": [
      [
        "Automation",
        "Playwright"
      ],
      [
        "Analysis",
        "Gemini visual analysis"
      ],
      [
        "Output",
        "JSON, Markdown, screenshots"
      ]
    ],
    "tech": "Python, FastAPI, Playwright, Gemini",
    "url": null,
    "urlNote": "Herramienta interna: sin URL pública",
    "logo": null
  },
  {
    "id": "SIS-05",
    "name": "CleanSolarAus",
    "state": "op",
    "cap": [
      "IA en producción"
    ],
    "glosa": "Publicar suficiente contenido para ganar autoridad en un tema no es sostenible a mano.",
    "system": "Una operación de contenido programático que investiga, escribe, revisa y publica sola, todos los días.",
    "layers": [
      [
        "Research",
        "Python agents, Search Console"
      ],
      [
        "Writing",
        "Claude Sonnet 4.5"
      ],
      [
        "Deployment",
        "GitHub Actions → Cloudflare Pages"
      ]
    ],
    "tech": "Astro, Cloudflare Pages, Supabase, PostgreSQL, Python 3.11, Anthropic Claude Sonnet 4.5, GitHub Actions, Google Search Console",
    "url": "https://cleansolaraus.com/",
    "logo": {
      "src": "/project-logos/cleansolaraus/favicon.svg",
      "w": 640,
      "h": 640,
      "kind": "icon",
      "plate": "#1a6b3a",
      "preview": {
        "src": "/systems/sis-05-preview.webp",
        "w": 1200,
        "h": 630,
        "label": "Tarjeta Open Graph del sitio (recurso del proyecto)"
      }
    }
  },
  {
    "id": "SIS-06",
    "name": "Riot",
    "state": "evo",
    "cap": [
      "Producto a largo plazo"
    ],
    "glosa": "Las apps de eventos tratan cada evento como un anuncio, no como algo a lo que alguien te invita.",
    "system": "Una plataforma social para descubrir y organizar eventos reales, construida alrededor de comunidades.",
    "layers": [
      [
        "Presentation",
        "Flutter, feature-first"
      ],
      [
        "Realtime",
        "Firestore, Cloud Functions"
      ],
      [
        "Access Control",
        "Firebase Auth, Rules, QR check-in"
      ]
    ],
    "tech": "Flutter, Dart, Firebase (Firestore, Cloud Functions, Authentication, Cloud Messaging), Realtime Database",
    "url": null,
    "logo": {
      "src": "/systems/sis-06.webp",
      "w": 640,
      "h": 640,
      "kind": "cover",
      "plate": "#00060b"
    }
  },
  {
    "id": "SIS-07",
    "name": "Bufón",
    "state": "evo",
    "cap": [
      "Producto a largo plazo"
    ],
    "glosa": "Un juego de fiesta no sobrevive por sus funciones. Sobrevive por cómo se siente jugarlo.",
    "system": "Un juego social multijugador diseñado alrededor del ritmo emocional de una sesión en vivo.",
    "layers": [
      [
        "Presentation",
        "Flutter, Riverpod"
      ],
      [
        "Realtime",
        "Firestore: rooms, rounds, voting"
      ],
      [
        "Experience",
        "audio, haptics, timed reveal"
      ]
    ],
    "tech": "Flutter, Dart, Riverpod, Firebase (Firestore, Anonymous Authentication)",
    "url": null,
    "logo": {
      "src": "/systems/sis-07.webp",
      "w": 640,
      "h": 388,
      "kind": "cover",
      "plate": "#f8e867"
    }
  },
  {
    "id": "SIS-08",
    "name": "Los Fibos",
    "state": "op",
    "statePending": true,
    "cap": [
      "Plataforma"
    ],
    "pending": true,
    "title": "Una tienda propia. Un sistema completo de comercio.",
    "glosa": "Una banda necesita vender su mercancía con un sistema propio, no con un enlace a una plataforma ajena.",
    "system": "Una plataforma de ecommerce desarrollada a medida para una banda independiente. Desde el catálogo y el inventario hasta los pagos, pedidos y administración, cada componente forma parte de una infraestructura propia.",
    "layers": [
      [
        "Frontend",
        "Astro 5, React, TypeScript"
      ],
      [
        "Backend",
        "Astro API Routes, Netlify SSR"
      ],
      [
        "Payments",
        "Stripe Checkout, signed webhooks"
      ],
      [
        "Inventory",
        "SELECT … FOR UPDATE, reservations"
      ],
      [
        "Persistence",
        "Neon PostgreSQL, Drizzle ORM"
      ],
      [
        "Admin",
        "/admin, HttpOnly cookie"
      ]
    ],
    "tech": "Astro 5, React, TypeScript, Neon PostgreSQL, Drizzle ORM, Stripe, Resend, Netlify, GitHub",
    "url": "https://losfibos.com/",
    "urlNote": "URL a verificar antes del deploy ⏳",
    "logo": {
      "src": "/systems/sis-08.webp",
      "w": 622,
      "h": 640,
      "kind": "icon",
      "plate": "#F0EEE9"
    }
  },
  {
    "id": "SIS-09",
    "name": "Bloom Undies",
    "state": "dev",
    "cap": [
      "Producto a largo plazo"
    ],
    "glosa": "Las apps de salud femenina suelen optimizar el engagement, en una categoría que necesita privacidad.",
    "system": "Una app de seguimiento de ciclo y salud hormonal, local y privada por diseño.",
    "layers": [
      [
        "Presentation",
        "Flutter, Clean Architecture"
      ],
      [
        "Storage",
        "Hive, local, encrypted"
      ],
      [
        "Roadmap",
        "Firebase + Gemini moderation, planned"
      ]
    ],
    "tech": "Flutter, Dart, Riverpod, Hive, Firebase (planificado), Gemini (planificado)",
    "url": null,
    "logo": {
      "src": "/systems/sis-09.webp",
      "w": 640,
      "h": 310,
      "kind": "cover",
      "plate": "#fff2e1"
    }
  },
  {
    "id": "SIS-10",
    "name": "WATERLÜ",
    "state": "op",
    "cap": [
      "Ejecución real"
    ],
    "glosa": "Convencer a restaurantes de adoptar un sistema de filtración exige marca y conversión, para un negocio real.",
    "system": "Un sitio de adquisición B2B con identidad de marca completa, refinado en varias iteraciones.",
    "layers": [
      [
        "Presentation",
        "Astro, Tailwind, GSAP"
      ],
      [
        "Interaction",
        "Netlify Forms, scroll storytelling"
      ],
      [
        "Infrastructure",
        "Netlify, GitHub CI/CD"
      ]
    ],
    "tech": "Astro 4, Tailwind CSS, GSAP, Netlify Forms, Netlify, GitHub",
    "url": "https://waterlu.com.mx/",
    "logo": {
      "src": "/systems/sis-10.webp",
      "w": 640,
      "h": 312,
      "kind": "wordmark",
      "plate": "#F0EEE9"
    }
  }
].map((s) => ({ ...s, stateLabel: STATES[s.state], embed: s.url ? EMBED[s.url] ?? null : null,
  capture: CAPTURES[s.id] ? { src: CAPTURES[s.id], src2: CAPTURES[s.id].replace('.webp', '-2.webp'), w: 1280, h: 800, date: CAPTURES_DATE } : null }));
