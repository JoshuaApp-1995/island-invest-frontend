export interface Municipality {
  name: string;
  parajes?: string[];
}

export interface Province {
  name: string;
  municipalities: string[];
}

export const DR_LOCATIONS: Province[] = [
  {
    name: "Distrito Nacional",
    municipalities: ["Santo Domingo (Centro)"]
  },
  {
    name: "Azua",
    municipalities: ["Azua de Compostela", "Estebanía", "Guayabal", "Las Charcas", "Las Yayas de Viajama", "Padre Las Casas", "Peralta", "Pueblo Viejo", "Sabana Yegua", "Tábara Arriba"]
  },
  {
    name: "Baoruco",
    municipalities: ["Neiba", "Galván", "Los Ríos", "Tamayo", "Villa Jaragua"]
  },
  {
    name: "Barahona",
    municipalities: ["Barahona", "Cabral", "El Peñón", "Enriquillo", "Fundación", "Jaquimeyes", "La Ciénaga", "Las Salinas", "Paraíso", "Polo", "Vicente Noble"]
  },
  {
    name: "Dajabón",
    municipalities: ["Dajabón", "El Pino", "Loma de Cabrera", "Partidó", "Restauración"]
  },
  {
    name: "Duarte",
    municipalities: ["San Francisco de Macorís", "Arenoso", "Castillo", "Hostos", "Las Guáranas", "Pimentel", "Villa Riva"]
  },
  {
    name: "El Seibo",
    municipalities: ["El Seibo", "Miches"]
  },
  {
    name: "Elías Piña",
    municipalities: ["Comendador", "Bánica", "El Llano", "Hondo Valle", "Juan Santiago", "Pedro Santana"]
  },
  {
    name: "Espaillat",
    municipalities: ["Moca", "Cayetano Germosén", "Gaspar Hernández", "Jamao al Norte"]
  },
  {
    name: "Hato Mayor",
    municipalities: ["Hato Mayor del Rey", "El Valle", "Sabana de la Mar"]
  },
  {
    name: "Hermanas Mirabal",
    municipalities: ["Salcedo", "Tenares", "Villa Tapia"]
  },
  {
    name: "Independencia",
    municipalities: ["Jimaní", "Cristóbal", "Duvergé", "La Descubierta", "Mella", "Postrer Río"]
  },
  {
    name: "La Altagracia",
    municipalities: ["Higüey", "Bávaro", "Punta Cana", "San Rafael del Yuma", "Bayahíbe", "Las Lagunas de Nisibón"]
  },
  {
    name: "La Romana",
    municipalities: ["La Romana", "Guaymate", "Villa Hermosa", "Casa de Campo"]
  },
  {
    name: "La Vega",
    municipalities: ["Concepción de La Vega", "Constanza", "Jarabacoa", "Jima Abajo"]
  },
  {
    name: "María Trinidad Sánchez",
    municipalities: ["Nagua", "Cabrera", "El Factor", "Río San Juan"]
  },
  {
    name: "Monseñor Nouel",
    municipalities: ["Bonao", "Maimón", "Piedra Blanca"]
  },
  {
    name: "Monte Cristi",
    municipalities: ["Monte Cristi", "Castañuelas", "Guayubín", "Las Matas de Santa Cruz", "Pepillo Salcedo", "Villa Vásquez"]
  },
  {
    name: "Monte Plata",
    municipalities: ["Monte Plata", "Bayaguana", "Peralvillo", "Sabana Grande de Boyá", "Yamasá"]
  },
  {
    name: "Pedernales",
    municipalities: ["Pedernales", "Oviedo"]
  },
  {
    name: "Peravia",
    municipalities: ["Baní", "Matanzas", "Nizao"]
  },
  {
    name: "Puerto Plata",
    municipalities: ["San Felipe de Puerto Plata", "Altamira", "Cabarete", "El Castillo", "Imbert", "Los Hidalgos", "Luperón", "Sosúa", "Villa Isabela", "Villa Montellano"]
  },
  {
    name: "Samaná",
    municipalities: ["Santa Bárbara de Samaná", "Las Terrenas", "Sánchez"]
  },
  {
    name: "San Cristóbal",
    municipalities: ["San Cristóbal", "Bajos de Haina", "Cambita Garabitos", "Los Cacaos", "Sabana Grande de Palenque", "San Gregorio de Nigua", "Villa Altagracia", "Yaguate"]
  },
  {
    name: "San José de Ocoa",
    municipalities: ["San José de Ocoa", "Rancho Arriba", "Sabana Larga"]
  },
  {
    name: "San Juan",
    municipalities: ["San Juan de la Maguana", "Bohechío", "El Cercado", "Juan de Herrera", "Las Matas de Farfán", "Vallejuelo"]
  },
  {
    name: "San Pedro de Macorís",
    municipalities: ["San Pedro de Macorís", "Consuelo", "Guayacanes", "Juan Dolio", "Quisqueya", "Ramón Santana", "San José de los Llanos"]
  },
  {
    name: "Sánchez Ramírez",
    municipalities: ["Cotuí", "Cevicos", "Fantino", "La Mata"]
  },
  {
    name: "Santiago",
    municipalities: ["Santiago de los Caballeros", "Baitoa", "Jánico", "Licey al Medio", "Puñal", "Sabana Iglesia", "San José de las Matas", "Tamboril", "Villa González", "Navarrete"]
  },
  {
    name: "Santiago Rodríguez",
    municipalities: ["Sabaneta", "Monción", "Villa Los Almácigos"]
  },
  {
    name: "Santo Domingo",
    municipalities: ["Santo Domingo Este", "Santo Domingo Oeste", "Santo Domingo Norte", "Boca Chica", "Los Alcarrizos", "Pedro Brand", "San Antonio de Guerra"]
  },
  {
    name: "Valverde",
    municipalities: ["Mao", "Esperanza", "Laguna Salada"]
  }
];
