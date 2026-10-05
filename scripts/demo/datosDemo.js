// Datos ficticios para la demo publica. Todas las cuentas usan la misma clave.
// Las comunas y rubros deben existir en src/data/comunas.json y src/data/rubros.json.
const CLAVE_DEMO = "Demo1234"
const DOMINIO = "demo.emplify.cl"

const admin = { user: "demo_admin", contrasena: CLAVE_DEMO }

// Perfiles de cliente: frecuente (con trabajos), nuevo (sin historial) y solicitantes
const clientes = [
    { clave: "valentina", nombres: "Valentina Isabel", apellidos: "Ríos Contreras", comuna: "Providencia", direccion: "Av. Providencia 1820, depto. 504", perfil: "Cliente frecuente: tiene trabajos en curso y terminados" },
    { clave: "tomas", nombres: "Tomás Ignacio", apellidos: "Vera Saavedra", comuna: "Maipú", direccion: "Av. Pajaritos 3150", perfil: "Cliente nuevo: sin historial, ideal para probar búsqueda y solicitud" },
    { clave: "francisca", nombres: "Francisca Andrea", apellidos: "Lagos Pizarro", comuna: "Ñuñoa", direccion: "Irarrázaval 4410", perfil: "Cliente con solicitudes pendientes" },
    { clave: "matias", nombres: "Matías Alonso", apellidos: "Herrera Bustos", comuna: "Las Condes", direccion: "Apoquindo 5600, of. 32", perfil: "Cliente con solicitudes pendientes" },
    { clave: "catalina", nombres: "Catalina Paz", apellidos: "Soto Navarro", comuna: "La Florida", direccion: "Vicuña Mackenna 7200", perfil: "Cliente de la zona sur" },
    { clave: "benjamin", nombres: "Benjamín Andrés", apellidos: "Morales Quiroz", comuna: "Viña del Mar", direccion: "Av. Libertad 1100", perfil: "Cliente de regiones" }
]

// [clave, nombres, apellidos, comuna, rubro, profesion, antiguedad, experiencia, servicios, opciones]
// servicios: [[nombre, precio], ...]; opciones: { disponibilidad, plan, sinPerfil }
const especialistas = [
    // Providencia
    ["rodrigo", "Rodrigo Esteban", "Fuentes Araya", "Providencia", "Electricidad", "Electricista autorizado SEC", 9,
        "Instalaciones eléctricas domiciliarias y comerciales, certificaciones TE1 y reparación de tableros.",
        [["Revisión de tablero eléctrico", 30000], ["Instalación de enchufes", 18000], ["Certificación TE1", 120000]], { plan: "Premium" }],
    ["javiera", "Javiera Antonia", "Castro Peña", "Providencia", "Gasfitería", "Gasfíter certificada", 6,
        "Detección de filtraciones, mantención de calefont y cambio de grifería.",
        [["Mantención de calefont", 35000], ["Cambio de llave monomando", 25000], ["Detección de filtraciones", 40000]]],
    ["felipe", "Felipe Andrés", "Rojas Molina", "Providencia", "Informática", "Técnico en redes y soporte", 5,
        "Soporte a domicilio, configuración de redes WiFi, respaldo de datos y formateo de equipos.",
        [["Configuración de red WiFi", 25000], ["Formateo e instalación", 30000], ["Soporte remoto (hora)", 15000]]],
    ["claudio", "Claudio Patricio", "Díaz Valenzuela", "Providencia", "Cerrajería", "Cerrajero", 12,
        "Aperturas sin daño 24/7, cambio de cilindros y cerraduras de seguridad.",
        [["Apertura de puerta", 30000], ["Cambio de cilindro", 22000], ["Instalación de cerradura de seguridad", 55000]], { plan: "Premium" }],

    // Las Condes
    ["carolina", "Carolina Andrea", "Muñoz Tapia", "Las Condes", "Informática", "Ingeniera en informática", 7,
        "Soporte para hogares y pymes: redes, impresoras, correo corporativo y seguridad.",
        [["Visita técnica", 30000], ["Instalación de impresora", 20000], ["Configuración de correo", 25000]], { plan: "Premium" }],
    ["andres", "Andrés Felipe", "Olivares Reyes", "Las Condes", "Climatización", "Técnico en climatización", 8,
        "Instalación y mantención de equipos split, carga de gas y diagnóstico.",
        [["Mantención de split", 40000], ["Instalación de split", 130000], ["Carga de gas", 45000]]],
    ["daniela", "Daniela Fernanda", "Vergara Silva", "Las Condes", "Pintura", "Pintora de interiores", 4,
        "Pintura de departamentos, empaste, papel mural y terminaciones finas.",
        [["Pintura de habitación", 90000], ["Empaste por m²", 6000], ["Instalación de papel mural", 70000]]],
    ["ignacio", "Ignacio Javier", "Pérez Lillo", "Las Condes", "Jardinería", "Paisajista", 10,
        "Diseño y mantención de jardines, poda de árboles y sistemas de riego automático.",
        [["Mantención mensual", 60000], ["Poda de árboles", 45000], ["Instalación de riego", 150000]], { disponibilidad: "No disponible" }],

    // Ñuñoa
    ["sebastian", "Sebastián Alejandro", "Gómez Fuentes", "Ñuñoa", "Carpintería", "Maestro carpintero", 15,
        "Muebles a medida, closets, cocinas y reparación de puertas.",
        [["Closet a medida", 350000], ["Ajuste de puertas", 25000], ["Repisas flotantes", 40000]], { plan: "Premium" }],
    ["paula", "Paula Constanza", "Araya Medina", "Ñuñoa", "Electricidad", "Electricista", 3,
        "Reparación de circuitos, instalación de luminarias y enchufes.",
        [["Instalación de lámpara", 15000], ["Reparación de circuito", 35000]]],
    ["nicolas", "Nicolás Esteban", "Cárdenas Rivas", "Ñuñoa", "Informática", "Desarrollador y soporte técnico", 2,
        "Armado de PC, mejora de equipos y soporte para estudiantes y teletrabajo.",
        [["Armado de PC", 40000], ["Limpieza y mantención", 25000]]],

    // Santiago Centro
    ["jorge", "Jorge Luis", "Sepúlveda Ortiz", "Santiago Centro", "Cerrajería", "Cerrajero automotriz y residencial", 20,
        "Copias de llaves codificadas, aperturas de vehículos y cajas fuertes.",
        [["Copia de llave codificada", 45000], ["Apertura de vehículo", 35000], ["Apertura de caja fuerte", 80000]]],
    ["camila", "Camila Belén", "Torres Núñez", "Santiago Centro", "Informática", "Técnica en soporte computacional", 4,
        "Reparación de notebooks, cambio de pantallas y recuperación de archivos.",
        [["Cambio de pantalla notebook", 85000], ["Recuperación de archivos", 50000]]],
    ["hector", "Héctor Manuel", "Salinas Cid", "Santiago Centro", "Electricidad", "Electricista industrial", 18,
        "Instalaciones trifásicas, empalmes y mantención eléctrica de edificios.",
        [["Cambio de empalme", 180000], ["Mantención de edificio (visita)", 60000]]],

    // Maipú
    ["cristian", "Cristián Eduardo", "Navarro Leiva", "Maipú", "Mecánica", "Mecánico automotriz", 11,
        "Mantenciones, frenos, embrague y diagnóstico computarizado a domicilio.",
        [["Cambio de aceite y filtros", 45000], ["Cambio de pastillas de freno", 50000], ["Escáner y diagnóstico", 25000]], { plan: "Premium" }],
    ["luis", "Luis Alberto", "Pizarro Castro", "Maipú", "Construcción", "Maestro albañil", 14,
        "Ampliaciones, radieres, cerámicas y remodelación de baños.",
        [["Instalación de cerámica por m²", 15000], ["Radier por m²", 25000], ["Remodelación de baño", 900000]]],
    ["marcela", "Marcela Ivonne", "Godoy Fernández", "Maipú", "Gasfitería", "Gasfíter", 6,
        "Destapes, cambio de WC, instalación de lavaplatos y calefont.",
        [["Destape de cañería", 30000], ["Instalación de WC", 40000]]],
    ["diego", "Diego Ignacio", "Espinoza Mora", "Maipú", "Electricidad", "Electricista", 5,
        "Instalaciones domiciliarias, automáticos y luces LED.",
        [["Cambio de automático", 25000], ["Instalación de focos LED", 20000]]],

    // Puente Alto
    ["victor", "Víctor Hugo", "Riquelme Soto", "Puente Alto", "Construcción", "Contratista", 22,
        "Construcción de ampliaciones, techumbres y cierres perimetrales.",
        [["Techumbre por m²", 35000], ["Cierre perimetral por metro", 28000]]],
    ["alejandra", "Alejandra Soledad", "Cortés Vidal", "Puente Alto", "Mecánica", "Mecánica automotriz", 7,
        "Mantención preventiva, cambio de correa y revisión técnica.",
        [["Preparación revisión técnica", 35000], ["Cambio de correa de distribución", 160000]]],
    ["mauricio", "Mauricio Andrés", "Bravo Jara", "Puente Alto", "Cerrajería", "Cerrajero", 9,
        "Cambio de chapas, rejas de seguridad y aperturas.",
        [["Cambio de chapa", 25000], ["Apertura de puerta", 28000]], { disponibilidad: "No disponible" }],

    // La Florida
    ["patricio", "Patricio Javier", "Valdés Ramos", "La Florida", "Electricidad", "Electricista autorizado SEC", 13,
        "Proyectos eléctricos, certificaciones y reparación de cortocircuitos.",
        [["Reparación de cortocircuito", 40000], ["Proyecto eléctrico", 250000]]],
    ["constanza", "Constanza María", "Figueroa Lara", "La Florida", "Pintura", "Pintora", 5,
        "Pintura de casas, fachadas y protección de maderas.",
        [["Pintura de fachada", 280000], ["Barniz de terraza", 90000]]],
    ["gonzalo", "Gonzalo Antonio", "Miranda Cáceres", "La Florida", "Climatización", "Técnico en refrigeración", 9,
        "Climatización residencial, estufas a pellet y mantención de equipos.",
        [["Mantención de estufa a pellet", 45000], ["Instalación de split", 125000]]],
    ["veronica", "Verónica Alejandra", "Ibáñez Ruiz", "La Florida", "Gasfitería", "Gasfíter", 8,
        "Instalaciones de agua y gas, certificación de redes de gas.",
        [["Certificación de gas", 70000], ["Cambio de flexibles", 20000]]],

    // Vitacura y Lo Barnechea
    ["martina", "Martina Josefa", "Ruiz Tagle", "Vitacura", "Jardinería", "Jardinera y paisajista", 6,
        "Jardines de bajo consumo hídrico, huertos urbanos y mantención.",
        [["Diseño de jardín", 180000], ["Mantención quincenal", 45000]]],
    ["tomasclima", "Tomás Eduardo", "Larraín Vial", "Vitacura", "Climatización", "Ingeniero en climatización", 12,
        "Sistemas VRF, calefacción central y eficiencia energética.",
        [["Diagnóstico de calefacción central", 60000], ["Mantención de caldera", 85000]], { plan: "Premium" }],
    ["raul", "Raúl Ernesto", "Venegas Soto", "Lo Barnechea", "Jardinería", "Jardinero", 16,
        "Poda en altura, extracción de árboles y limpieza de terrenos.",
        [["Poda en altura", 120000], ["Limpieza de terreno", 90000]]],
    ["ricardo", "Ricardo Alfonso", "Ossa Montt", "Lo Barnechea", "Construcción", "Constructor civil", 19,
        "Remodelaciones completas, quinchos y terrazas.",
        [["Construcción de quincho", 1500000], ["Terraza de madera por m²", 75000]]],

    // San Miguel, Macul, Peñalolén, La Reina, Estación Central, Quilicura
    ["fernando", "Fernando José", "Aguilera Paredes", "San Miguel", "Carpintería", "Carpintero", 8,
        "Cocinas a medida, reparación de muebles y pisos flotantes.",
        [["Instalación de piso flotante por m²", 9000], ["Mueble de cocina", 600000]]],
    ["karina", "Karina Elizabeth", "Toro Gallardo", "Macul", "Informática", "Técnica en computación", 3,
        "Soporte técnico, instalación de software y configuración de cámaras de seguridad.",
        [["Instalación de cámaras (4)", 160000], ["Instalación de software", 15000]]],
    ["esteban", "Esteban Rodrigo", "Campos Muñoz", "Macul", "Pintura", "Maestro pintor", 10,
        "Pintura de interiores, reparación de grietas y humedad.",
        [["Tratamiento de humedad", 80000], ["Pintura de departamento", 350000]]],
    ["rocio", "Rocío Valentina", "Henríquez Leal", "Peñalolén", "Gasfitería", "Gasfíter", 4,
        "Mantención de calefont, termos y reparación de filtraciones.",
        [["Mantención de termo eléctrico", 30000], ["Reparación de filtración", 35000]]],
    ["pablo", "Pablo Emilio", "Zúñiga Rojas", "Peñalolén", "Construcción", "Maestro en terminaciones", 9,
        "Tabiquería, cielos falsos y terminaciones en yeso.",
        [["Tabique por m²", 22000], ["Cielo falso por m²", 18000]]],
    ["soledad", "Soledad Andrea", "Moya Carrasco", "La Reina", "Jardinería", "Jardinera", 5,
        "Mantención de jardines, césped en rollo y control de plagas.",
        [["Instalación de césped por m²", 7000], ["Control de plagas", 40000]]],
    ["oscar", "Óscar Iván", "Flores Ahumada", "Estación Central", "Mecánica", "Mecánico", 17,
        "Reparación de motores, suspensión y frenos.",
        [["Cambio de amortiguadores", 120000], ["Ajuste de motor", 250000]]],
    ["daniel", "Daniel Alonso", "Muñoz Vera", "Quilicura", "Electricidad", "Técnico eléctrico", 0,
        "", [], { sinPerfil: true }],

    // Regiones
    ["loreto", "Loreto Cecilia", "Bastías Ulloa", "Viña del Mar", "Gasfitería", "Gasfíter", 7,
        "Gasfitería general y certificación de instalaciones de gas.",
        [["Certificación de gas", 65000], ["Destape", 28000]]],
    ["mario", "Mario Antonio", "Vidal Ferrada", "Valparaíso", "Pintura", "Pintor", 12,
        "Pintura de fachadas en altura y casas antiguas.",
        [["Pintura de fachada en altura", 450000], ["Pintura de reja", 60000]]],
    ["eduardo", "Eduardo Ramón", "Sanhueza Parra", "Concepción", "Electricidad", "Electricista", 10,
        "Instalaciones domiciliarias y mantención eléctrica.",
        [["Revisión eléctrica", 30000], ["Instalación de enchufe", 16000]]],
    ["gabriela", "Gabriela Ignacia", "Mella Rebolledo", "Concepción", "Construcción", "Constructora", 6,
        "Ampliaciones y remodelaciones de viviendas.",
        [["Ampliación por m²", 450000], ["Remodelación de cocina", 1200000]]],
    ["jaime", "Jaime Arturo", "Rivera Olivares", "Antofagasta", "Climatización", "Técnico en climatización", 9,
        "Instalación y mantención de aire acondicionado en clima desértico.",
        [["Mantención de split", 42000], ["Instalación de split", 135000]]],
    ["hugo", "Hugo Alberto", "Painemal Huenchullán", "Temuco", "Carpintería", "Carpintero", 21,
        "Carpintería en madera nativa, muebles rústicos y cabañas.",
        [["Mueble rústico", 280000], ["Reparación de ventanas", 45000]]],
    ["antonia", "Antonia Belén", "Carvajal Rojas", "La Serena", "Informática", "Analista programadora", 4,
        "Páginas web para emprendedores y soporte técnico.",
        [["Página web básica", 250000], ["Soporte técnico (hora)", 15000]]]
]

const quitarTildes = texto => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ñ/gi, "n")

// rodrigo.fuentes@demo.emplify.cl
const emailDe = (nombres, apellidos) =>
    `${quitarTildes(nombres.split(" ")[0])}.${quitarTildes(apellidos.split(" ")[0])}@${DOMINIO}`.toLowerCase()

module.exports = { CLAVE_DEMO, DOMINIO, admin, clientes, especialistas, emailDe }
