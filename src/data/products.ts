import { Shield, Building2, Flame, Paintbrush, Droplet, Factory } from 'lucide-react'

// Import product images
import cuiImage from '../assets/Corrosion-Under-Insulation-Coating.jpg'
import metacareImage from '../assets/METACARE.jpg'
import pittCharImage from '../assets/PPG-PITT-CHAR NX.jpg'
import sustainableImage from '../assets/sustainable -Finish.jpg'
import tankLiningsImage from '../assets/TANK-LININGS.jpg'
import companyProfileImage from '../assets/Company-Profile.jpg'

export interface Product {
  id: number
  name: string
  icon: typeof Shield
  image: string
  features: string[]
}

export const products: Product[] = [
  {
    id: 1,
    name: "Corrosion Under Insulation (CUI) Coating",
    icon: Shield,
    image: cuiImage,
    features: [
      "Prevents corrosion under insulation in high-temperature environments",
      "Suitable for surfaces operating between -40°C to 250°C",
      "Provides long-term protection for pipelines, tanks, and equipment",
      "Reduces maintenance costs and extends asset life",
      "Compatible with various insulation materials",
      "Fast-curing formulation for quick project turnaround",
      "Excellent adhesion to steel substrates",
      "Resistant to moisture ingress and chemical exposure",
      "Compliant with international coating standards",
      "Available in multiple thickness options for varying service conditions"
    ]
  },
  {
    id: 2,
    name: "METACARE - Innovative Solution",
    icon: Building2,
    image: metacareImage,
    features: [
      "Advanced protective coating system for metal substrates",
      "Provides superior corrosion resistance in harsh industrial environments",
      "Suitable for refineries, petrochemical plants, and offshore structures",
      "High build coating with excellent surface tolerance",
      "UV resistant and color-stable formulation",
      "Low VOC and environmentally compliant",
      "Easy application with spray or brush methods",
      "Fast drying and recoatable in short intervals",
      "Excellent chemical and solvent resistance",
      "Long-lasting protection reducing lifecycle costs",
      "Compatible with existing coating systems",
      "Proven performance in C3 to C5-M corrosivity categories"
    ]
  },
  {
    id: 3,
    name: "PPG PITT-CHAR NX Fire Protection",
    icon: Flame,
    image: pittCharImage,
    features: [
      "Intumescent fire protection coating for steel structures",
      "Provides up to 120 minutes fire resistance rating",
      "Expands when exposed to heat, creating an insulating char layer",
      "Suitable for commercial buildings, industrial facilities, and infrastructure",
      "Thin film application reduces structural load",
      "Available in various colors for aesthetic finish",
      "Complies with international fire safety standards (UL, BS, ASTM)",
      "Can be applied on-site or off-site",
      "Durable topcoat options for interior and exterior use",
      "Minimal maintenance requirements",
      "Tested and certified for different steel profiles and fire scenarios",
      "Fast installation compared to traditional fire protection methods"
    ]
  },
  {
    id: 4,
    name: "Sustainable Finish Solutions",
    icon: Paintbrush,
    image: sustainableImage,
    features: [
      "Eco-friendly coating solutions with reduced environmental impact",
      "Low VOC and HAP-free formulations",
      "Water-based and solvent-free options available",
      "High-performance finishes for architectural and industrial applications",
      "Excellent durability and weather resistance",
      "Wide range of colors and gloss levels",
      "Suitable for interior and exterior surfaces",
      "Easy application and cleanup",
      "Compliant with green building certifications (LEED, Green Guard)",
      "Energy-efficient coatings with reflective properties",
      "Long service life reducing repainting frequency",
      "Recyclable and sustainable raw materials"
    ]
  },
  {
    id: 5,
    name: "Tank Linings",
    icon: Droplet,
    image: tankLiningsImage,
    features: [
      "Specialized coatings for potable water, wastewater, and chemical storage tanks",
      "Complies with NSF/ANSI 61 for drinking water applications",
      "High chemical resistance to acids, alkalis, and solvents",
      "Prevents contamination and corrosion of stored liquids",
      "Suitable for steel, concrete, and FRP tanks",
      "Smooth, non-porous surface for easy cleaning",
      "Long-term performance in immersed conditions",
      "Available in epoxy, polyurethane, and polyurea systems",
      "Fast cure options for quick return to service",
      "Temperature resistance from -40°C to 120°C",
      "Certified for food-grade and pharmaceutical applications",
      "Expert application support and inspection services available"
    ]
  },
  {
    id: 6,
    name: "Protective Coatings Solution",
    icon: Factory,
    image: companyProfileImage,
    features: [
      "Comprehensive range of industrial protective coatings",
      "Suitable for steel structures, machinery, and equipment",
      "High-performance epoxy, polyurethane, and acrylic systems",
      "Excellent corrosion and abrasion resistance",
      "Designed for extreme environments (marine, chemical, mining)",
      "Multi-coat systems including primers, intermediates, and topcoats",
      "Fast-drying and high-build formulations",
      "Compatible with various surface preparation methods",
      "UV stable and color-retentive finishes",
      "Wide temperature service range",
      "Certified to ISO 12944 and NORSOK standards",
      "Technical support and customized solutions available",
      "Proven track record in major industrial projects worldwide"
    ]
  }
]
