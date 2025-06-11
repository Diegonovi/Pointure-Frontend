import { Category, CategoryCode } from "../models/Category";

export const CATEGORIES: Category[] = [
  {
    id: CategoryCode.Drawing,
    name: 'Dibujo',
    description: 'Explora nuestra amplia gama de materiales de dibujo profesional, desde lápices de grafito hasta carboncillos y pasteles. Perfecto para artistas de todos los niveles.',
    route: 'drawing'
  },
  {
    id: CategoryCode.Painting,
    name: 'Pintura',
    description: 'Todo lo que necesitas para expresar tu creatividad: acrílicos, óleos, acuarelas y más. Pigmentos de alta calidad para resultados profesionales.',
    route: 'painting'
  },
  {
    id: CategoryCode.Surfaces,
    name: 'Superficies',
    description: 'Diversos soportes para tu arte: lienzos, papeles especializados, tablas y más. Encuentra la superficie perfecta para cada técnica.',
    route: 'surfaces'
  },
  {
    id: CategoryCode.Brushes,
    name: 'Pinceles',
    description: 'Pinceles profesionales de diferentes formas, tamaños y materiales. Desde sintéticos hasta pelo natural para cada tipo de pintura.',
    route: 'brushes'
  },
  {
    id: CategoryCode.Easels,
    name: 'Caballetes',
    description: 'Caballetes resistentes y ajustables para estudio o exterior. Soporte estable para trabajar con comodidad en tus proyectos artísticos.',
    route: 'easels'
  },
  {
    id: CategoryCode.Printmaking,
    name: 'Grabado',
    description: 'Materiales especializados para técnicas de grabado: gubias, tintas, rodillos y planchas. Herramientas para artistas gráficos.',
    route: 'printmaking'
  },
  {
    id: CategoryCode.Sculpting,
    name: 'Escultura',
    description: 'Arcillas, herramientas de tallado y materiales para modelado. Todo para dar forma a tus ideas tridimensionales.',
    route: 'sculpting'
  },
  {
    id: CategoryCode.KidsArt,
    name: 'Arte Infantil',
    description: 'Materiales seguros y divertidos para pequeños artistas. Kits educativos que fomentan la creatividad en los niños.',
    route: 'kids-art'
  },
  {
    id: CategoryCode.StudioSupplies,
    name: 'Suministros de Estudio',
    description: 'Organiza tu espacio creativo con paletas, contenedores, mesas de dibujo y todos los accesorios esenciales para tu taller.',
    route: 'studio-supplies'
  },
  {
    id: CategoryCode.Framing,
    name: 'Enmarcado',
    description: 'Materiales para preservar y exhibir tus obras: marcos, paspartús y herramientas de montaje profesional.',
    route: 'framing'
  },
  {
    id: CategoryCode.DigitalArt,
    name: 'Arte Digital',
    description: 'Tabletas gráficas, stylus y accesorios para creación digital. Tecnología para artistas contemporáneos.',
    route: 'digital-art'
  },
  {
    id: CategoryCode.Calligraphy,
    name: 'Caligrafía',
    description: 'Plumas, tintas y papeles especializados para el arte de la escritura. Herramientas para lettering y caligrafía artística.',
    route: 'calligraphy'
  },
  {
    id: CategoryCode.ArtSets,
    name: 'Kits de Arte',
    description: 'Sets completos para principiantes y profesionales. Todo en uno para explorar diferentes técnicas artísticas.',
    route: 'art-sets'
  },
  {
    id: CategoryCode.ArtBooks,
    name: 'Libros de Arte',
    description: 'Manuales, libros técnicos y de inspiración. Aprende nuevas técnicas y descubre grandes maestros del arte.',
    route: 'art-books'
  },
  {
    id: CategoryCode.ArtTools,
    name: 'Herramientas Artísticas',
    description: 'Instrumentos de precisión para artistas: reglas, compases, escalímetros y más. Precisión en cada detalle.',
    route: 'art-tools'
  },
  {
    id: CategoryCode.ArtAccessories,
    name: 'Accesorios de Arte',
    description: 'Complementos esenciales: fijadores, portaminas, sacapuntas profesionales y otros accesorios para artistas.',
    route: 'art-accessories'
  },
  {
    id: CategoryCode.ArtStorage,
    name: 'Almacenamiento de Arte',
    description: 'Soluciones para organizar y proteger tus materiales: maletines, cajas portátiles y organizadores de estudio.',
    route: 'art-storage'
  },
  {
    id: CategoryCode.Miscellaneous,
    name: 'Varios',
    description: 'Productos diversos que no encajan en otras categorías. Descubre artículos únicos para necesidades especiales.',
    route: 'miscellaneous'
  }
];
