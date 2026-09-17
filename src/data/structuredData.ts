export const SITE_URL = (import.meta.env.SITE || "https://www.wa-node.com").replace(/\/$/, "");

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
    "和-Nodeは、LINE公式アカウントとSalesforce・kintone・HubSpot・Googleスプレッドシートの連携構築を専門に、要件整理から公開まで支援します。iOS・Androidアプリ開発、Web・LP制作にも対応します。",
  areaServed: "JP",
  founder: { "@id": `${SITE_URL}/about/#person` },
  knowsAbout: [
    "LINE公式アカウント連携",
    "LINE Messaging API",
    "LIFF",
    "Salesforce連携",
    "kintone連携",
    "HubSpot連携",
    "Googleスプレッドシート連携",
    "業務の自動化",
    "iOS・Androidアプリ開発",
    "Web制作",
    "行動心理に基づく導線設計",
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
  jobTitle: "ITエンジニア（LINE・業務システム連携構築） / 産業カウンセラー",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  knowsAbout: [
    "LINE連携構築",
    "業務システム連携",
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
