import productPaleta from "@/assets/product-paleta.jpg";
import productPelotas from "@/assets/product-pelotas.jpg";
import productBolso from "@/assets/product-bolso.jpg";
import productIndumentaria from "@/assets/product-indumentaria.jpg";

export interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    priceFormatted: string;
    originalPrice?: number;
    originalPriceFormatted?: string;
    image: string;
    images: string[];
    category: "Palas" | "Pelotas" | "Bolsos" | "Indumentaria" | "Accesorios";
    isNew?: boolean;
    discount?: string;
    level?: "Principiante" | "Intermedio" | "Avanzado" | "Profesional" | "Todos";
    type?: "Control" | "Potencia" | "Polivalente";
    description: string;
    isOffer?: boolean;
    discountPercentage?: number;
    salesCount: number;
    offerStartDate?: string;
    offerEndDate?: string;
    tag1?: string;
    tag2?: string;
    subcategory?: string;
}

const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export const products: Product[] = [
    {
        id: "1",
        slug: generateSlug("Paleta Pro Carbon Elite 2026"),
        name: "Paleta Pro Carbon Elite 2026",
        price: 189990,
        priceFormatted: "$189.990",
        originalPrice: 229990,
        originalPriceFormatted: "$229.990",
        image: productPaleta,
        images: [productPaleta, productPaleta, productPaleta, productPaleta, productPaleta],
        category: "Palas",
        isNew: true,
        discount: "-17%",
        type: "Potencia",
        level: "Avanzado",
        description: "La Paleta Pro Carbon Elite 2026 está diseñada para jugadores de nivel avanzado que buscan máxima potencia sin perder el control. Construida con carbono 12K de última generación.",
        isOffer: true,
        salesCount: 150,
    },
    {
        id: "2",
        slug: generateSlug("Tubo de Pelotas Championship x3"),
        name: "Tubo de Pelotas Championship x3",
        price: 9990,
        priceFormatted: "$9.990",
        originalPrice: 12990,
        originalPriceFormatted: "$12.990",
        image: productPelotas,
        images: [productPelotas, productPelotas, productPelotas],
        category: "Pelotas",
        discount: "-23%",
        description: "Pelotas de alta competición con mayor durabilidad y rebote consistente. Ideales para todo tipo de superficies.",
        isOffer: true,
        salesCount: 1200,
    },
    {
        id: "3",
        slug: generateSlug("Mochila Paletero Tour Pro"),
        name: "Mochila Paletero Tour Pro",
        price: 69990,
        priceFormatted: "$69.990",
        originalPrice: 109990,
        originalPriceFormatted: "$109.990",
        image: productBolso,
        images: [productBolso, productBolso, productBolso, productBolso],
        category: "Bolsos",
        discount: "-36%",
        description: "Mochila técnica con compartimento térmico para paletas y espacio ventilado para calzado. Diseño ergonómico y resistente.",
        isOffer: true,
        salesCount: 450,
        subcategory: "Mochilas",
    },
    {
        id: "4",
        slug: generateSlug("Remera Dry-Fit Performance"),
        name: "Remera Dry-Fit Performance",
        price: 34990,
        priceFormatted: "$34.990",
        image: productIndumentaria,
        images: [productIndumentaria, productIndumentaria],
        category: "Indumentaria",
        isNew: true,
        description: "Remera técnica con tecnología Dry-Fit que absorbe el sudor para mantenerte seco y cómodo durante el juego.",
        salesCount: 300,
        subcategory: "Remeras",
    },
    {
        id: "5",
        slug: generateSlug("Paleta Control Soft Touch"),
        name: "Paleta Control Soft Touch",
        price: 149900,
        priceFormatted: "$149.900",
        image: productPaleta,
        images: [productPaleta],
        category: "Palas",
        type: "Control",
        level: "Intermedio",
        description: "Ideal para jugadores que priorizan la precisión. Su núcleo de goma EVA Soft proporciona un tacto inigualable.",
        salesCount: 85,
    },
    {
        id: "6",
        slug: generateSlug("Kit Pelotas Presion x4"),
        name: "Kit Pelotas Presión x4",
        price: 15990,
        priceFormatted: "$15.990",
        originalPrice: 18990,
        originalPriceFormatted: "$18.990",
        image: productPelotas,
        images: [productPelotas],
        category: "Pelotas",
        discount: "-16%",
        description: "Pack ahorro de 4 pelotas con mantenimiento de presión prolongado.",
        isOffer: true,
        salesCount: 600,
    },
    {
        id: "7",
        slug: generateSlug("Bolso Deportivo Weekend XL"),
        name: "Bolso Deportivo Weekend XL",
        price: 74990,
        priceFormatted: "$74.990",
        image: productBolso,
        images: [productBolso],
        category: "Bolsos",
        isNew: true,
        description: "Bolso de gran capacidad para tus entrenamientos o escapadas de fin de semana.",
        salesCount: 120,
    },
    {
        id: "8",
        slug: generateSlug("Short Pro Training Mesh"),
        name: "Short Pro Training Mesh",
        price: 29990,
        priceFormatted: "$29.990",
        image: productIndumentaria,
        images: [productIndumentaria],
        category: "Indumentaria",
        level: "Todos",
        description: "Short ligero con paneles de malla para una ventilación óptima.",
        salesCount: 210,
    },
    {
        id: "9",
        slug: generateSlug("Paleta Potencia Thunder X"),
        name: "Paleta Potencia Thunder X",
        price: 210000,
        priceFormatted: "$210.000",
        image: productPaleta,
        images: [productPaleta],
        category: "Palas",
        type: "Potencia",
        level: "Avanzado",
        description: "Máxima explosividad en cada golpe. Forma de diamante para atacantes agresivos.",
        salesCount: 45,
    },
    {
        id: "10",
        slug: generateSlug("Muñequera Pro Absorb"),
        name: "Muñequera Pro Absorb",
        price: 5990,
        priceFormatted: "$5.990",
        image: productIndumentaria, // Usando indumentaria como placeholder
        images: [productIndumentaria],
        category: "Accesorios",
        description: "Alta absorción de sudor para un agarre firme en todo momento.",
        salesCount: 900,
    },
    {
        id: "11",
        slug: generateSlug("Cubre Grip Premium Pack x3"),
        name: "Cubre Grip Premium Pack x3",
        price: 8500,
        priceFormatted: "$8.500",
        image: productPaleta, // Usando paleta como placeholder
        images: [productPaleta],
        category: "Accesorios",
        description: "Máximo agarre y confort. Pack de 3 unidades en colores variados.",
        salesCount: 1500,
    }
];
