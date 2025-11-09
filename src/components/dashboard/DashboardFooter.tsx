import { socialLinks } from "@/constants/general";
import Link from "next/link";
import FooterRights from "../shared/Footer/FooterRights";
import { useEffect, useState } from "react";
import { getSiteSettings } from "@/services/settings/siteSettings";
import {
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
const links = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "الشروط والأحكام", href: "/terms" },
];
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
export default function DashboardFooter() {
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
  const getSocialLinks = (): SocialLink[] => {
    console.log(footerSettings);
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
  return (
    <footer className="py-4 flex justify-between bg-white items-center flex-wrap px-3 gap-5 lg:px-6 w-full">
      <FooterRights />
      <ul className="flex gap-3 flex-wrap">
        {socialLinks.map(({ icon: Icon, href }, i) => (
          <li key={i}>
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-[#3538ED] hover:bg-[#3538ED] duration-300 grid place-content-center p-[10px] rounded-full"
            >
              <Icon className="text-xl text-primary group-hover:text-white" />
            </Link>
          </li>
        ))}
      </ul>

      <ul className="flex items-center flex-wrap gap-6 justify-center lg:justify-end">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="hover:text-secondary duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
