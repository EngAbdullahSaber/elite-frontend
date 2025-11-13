"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getFooterSettings } from "@/services/settings/footerSettings";
import { getSiteSettings } from "@/services/settings/siteSettings";

interface FooterSettings {
  id: number;
  twitterUrl?: string;
  instagramUrl?: string;
  snapchatUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  // Add other properties as needed
}

interface SocialLink {
  icon: any;
  href: string;
  platform: string;
}

export default function FooterLogoSection() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        setLoading(true);
        setError(null);

        const settings = await getSiteSettings();
        setFooterSettings(settings);
      } catch (err) {
        console.error("Error fetching footer settings:", err);
        setError("فشل في تحميل بيانات وسائل التواصل");
        setFooterSettings(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterSettings();
  }, []);

  // Static description (since it's not in the API response)
  const description =
    "مرحبًا بكر، عبر منصتنا يمكنك استكشاف وشراء وحدات عقارية بكل سهولة وشفافية، حيث نوفر لك عروضًا متنوعة تناسب احتياجاتك. كما نتيح لأصحاب العقارات فرصة عرض وحداتهم للبيع، وإدارتها من خلال نظام ذكي يضمن وصولها إلى المهتمين، مع دعم فريق متخصص لضمان جودة التجربة للطرفين.";

  // Generate social links from API data
  const getSocialLinks = (): SocialLink[] => {
    if (!footerSettings) {
      // Fallback social links
      return [
        {
          icon: FaSnapchat,
          href: "https://www.snapchat.com/@jeddahrepor2019",
          platform: "snapchat",
        },
        {
          icon: FaTwitter,
          href: "https://x.com/jeddah_reporter?s=09",
          platform: "twitter",
        },
        {
          icon: FaInstagram,
          href: "https://www.instagram.com/ali_n_albarakati",
          platform: "instagram",
        },
        {
          icon: FaYoutube,
          href: "https://www.youtube.com/@JeddahReporterAliAlbarakati",
          platform: "youtube",
        },
        {
          icon: FaTiktok,
          href: "https://www.tiktok.com/@ali.n.albarakati",
          platform: "tiktok",
        },
      ];
    }

    const links: SocialLink[] = [];

    // Add social links only if they exist in the API response
    if (footerSettings.twitterUrl) {
      links.push({
        icon: FaTwitter,
        href: footerSettings.twitterUrl,
        platform: "twitter",
      });
    }
    if (footerSettings.instagramUrl) {
      links.push({
        icon: FaInstagram,
        href: footerSettings.instagramUrl,
        platform: "instagram",
      });
    }
    if (footerSettings.snapchatUrl) {
      links.push({
        icon: FaSnapchat,
        href: footerSettings.snapchatUrl,
        platform: "snapchat",
      });
    }
    if (footerSettings.tiktokUrl) {
      links.push({
        icon: FaTiktok,
        href: footerSettings.tiktokUrl,
        platform: "tiktok",
      });
    }
    if (footerSettings.youtubeUrl) {
      links.push({
        icon: FaYoutube,
        href: footerSettings.youtubeUrl,
        platform: "youtube",
      });
    }

    return links;
  };

  const socialLinks = getSocialLinks();
  // Loading state
  if (loading) {
    return (
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div className="flex justify-center">
          <div className="w-40 h-20 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
        <ul className="flex gap-3 flex-wrap">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item}>
              <div className="border border-[#3538ED] grid place-content-center p-[10px] rounded-full">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-3">
      <div className="flex justify-center">
        <Link href="/" className="inline-block mb-4">
          <Image
            src="/logo-white.png"
            alt="Logo"
            width={160}
            height={80}
            className="mr-auto"
          />
        </Link>
      </div>

      {error && (
        <div className="mb-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <p className="text-neutral-300 mb-6 leading-relaxed">{description}</p>

      {socialLinks.length > 0 ? (
        <ul className="flex gap-3 flex-wrap">
          {socialLinks.map(({ icon: Icon, href, platform }, i) => (
            <li key={i}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#3538ED] hover:bg-[#3538ED] duration-300 grid place-content-center p-[10px] rounded-full transition-all hover:scale-110"
                title={platform}
              >
                <Icon className="text-xl" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-neutral-400 text-sm">
          لا توجد روابط وسائل تواصل متاحة
        </p>
      )}
    </div>
  );
}
