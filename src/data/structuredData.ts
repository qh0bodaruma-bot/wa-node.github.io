export const SITE_URL = "https://www.wa-node.com";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ServiceSchemaOptions = {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  priceFrom?: string;
};

type WebPageSchemaOptions = {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
};

type FAQItem = {
  question: string;
  answer: string;
};

type BlogPostingSchemaOptions = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  image?: string;
};

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).href;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "和-Node",
  alternateName: "wa-node",
  url: `${SITE_URL}/`,
  logo: absoluteUrl("/apple-touch-icon.png"),
  image: absoluteUrl("/images/ogp-service.png"),
  description:
    "和-Nodeは、心理学の知見を活かしたWeb制作・LP改善、AI・ICT活用、公開後の継続改善を支援する相談窓口です。",
  areaServed: "JP",
  founder: { "@id": `${SITE_URL}/about/#person` },
  knowsAbout: [
    "Web制作",
    "LP制作",
    "行動心理に基づく導線設計",
    "UX改善",
    "AI活用",
    "ICTコンサルティング",
    "アクセス解析",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["ja", "en", "fr"],
    url: absoluteUrl("/contact/"),
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "和-Node",
  inLanguage: "ja",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about/#person`,
  name: "高野 紘純",
  alternateName: "Hirozumi Takano",
  image: absoluteUrl("/images/avatar.webp"),
  jobTitle: "心理学に強いWeb制作者 / ICTコンサルタント",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  knowsAbout: [
    "Web制作",
    "ICT",
    "心理学",
    "産業カウンセリング",
    "AI活用",
    "アクセシビリティ",
  ],
  url: absoluteUrl("/about/"),
};

export function createWebPageSchema({
  name,
  description,
  path,
  type = "WebPage",
}: WebPageSchemaOptions) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "ja",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createServiceSchema({
  name,
  description,
  path,
  serviceType,
  priceFrom,
}: ServiceSchemaOptions) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url.includes("#") ? `${url}-service` : `${url}#service`,
    name,
    description,
    serviceType,
    url,
    areaServed: "JP",
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(priceFrom
      ? {
          offers: {
            "@type": "Offer",
            priceSpecification: {
            "@type": "PriceSpecification",
              priceCurrency: "JPY",
              minPrice: priceFrom,
            },
            url,
          },
        }
      : {}),
  };
}

export function createFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createBlogPostingSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
}: BlogPostingSchemaOptions) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@id": url },
    inLanguage: "ja",
    datePublished,
    dateModified,
    ...(image ? { image: absoluteUrl(image) } : {}),
    author: { "@id": `${SITE_URL}/about/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
