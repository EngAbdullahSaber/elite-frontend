import {
  FaCalendarAlt,
  FaUserFriends,
  FaUserTie,
  FaUserPlus,
  FaMapMarkerAlt,
  FaVideo,
  FaAward,
  FaRegFileAlt,
  FaCity,
  FaProjectDiagram,
  FaRegListAlt,
  FaHome,
  FaUsers,
  FaUserShield,
  FaBullhorn,
  FaFileAlt,
  FaQuestionCircle,
  FaCalendarPlus,
  FaRegCalendarAlt,
  FaWallet,
  FaCalendarCheck,
  FaHeart,
  FaPlusCircle,
  FaEdit,
} from "react-icons/fa";
import {} from "react-icons/fa";
import {
  MdDashboard,
  MdSettings,
  MdOutlinePrivacyTip,
  MdDescription,
} from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { Role, SelectableItem } from "@/types/global";

export const adminDashboardItems: SelectableItem[] = [
  {
    label: "لوحة التحكم",
    icon: MdDashboard,
    href: "/dashboard/admin",
  },
  {
    label: "طلبات عرض العقار",
    icon: FaUserShield,
    children: [
      {
        label: "قائمة طلبات عرض العقار",
        icon: FaRegListAlt,
        href: "/dashboard/admin/property-submissions",
      },
      {
        label: "إضافة طلب عرض عقار",
        icon: FaPlusCircle,
        href: "/dashboard/admin/property-submissions/add",
      },
    ],
  },
  {
    label: "المواعيد",
    icon: FaCalendarAlt,
    children: [
      {
        label: "قائمة المواعيد",
        icon: FaRegListAlt,
        href: "/dashboard/admin/appointments",
      },
      {
        label: "إضافة موعد",
        icon: FaCalendarPlus,
        href: "/dashboard/admin/appointments/add",
      },
    ],
  },
  {
    label: "إدارة المستخدمين",
    icon: FaUsers,
    children: [
      {
        label: "العملاء",
        icon: FaUserFriends,
        children: [
          {
            label: "قائمة العملاء",
            icon: FaRegListAlt,
            href: "/dashboard/admin/clients",
          },
          {
            label: "إضافة عميل",
            icon: FaUserPlus,
            href: "/dashboard/admin/clients/add",
          },
        ],
      },
      {
        label: "الوسطاء",
        icon: FaUserTie,
        children: [
          {
            label: "قائمة الوسطاء",
            icon: FaRegListAlt,
            href: "/dashboard/admin/agents",
          },
          {
            label: "إضافة وسيط",
            icon: FaUserPlus,
            href: "/dashboard/admin/agents/add",
          },
        ],
      },

      // {
      //   label: "المروجين",
      //   icon: FaUserFriends,
      //   children: [
      //     {
      //       label: "قائمة المروجين",
      //       icon: FaRegListAlt,
      //       href: "/dashboard/admin/clients",
      //     },
      //     {
      //       label: "إضافة المروجين",
      //       icon: FaUserPlus,
      //       href: "/dashboard/admin/clients/add",
      //     },
      //   ],
      // },
    ],
  },
  {
    label: "إدارة المحتوى",
    icon: FaProjectDiagram,
    children: [
      {
        label: "المدن والمناطق",
        icon: FaCity,
        children: [
          {
            label: "قائمة المدن والمناطق",
            icon: FaRegListAlt,
            href: "/dashboard/admin/cities",
          },
          {
            label: "تعديل مدينة / منطقة",
            icon: FaUserPlus,
            href: "/dashboard/admin/cities/edit",
          },
        ],
      },
      {
        label: "العقارات",
        icon: FaProjectDiagram,
        children: [
          {
            label: "قائمة العقارات",
            icon: FaRegListAlt,
            href: "/dashboard/admin/properties",
          },
          {
            label: "إضافة عقار",
            icon: FaUserPlus,
            href: "/dashboard/admin/properties/add",
          },
        ],
      },
    ],
  },
  {
    label: "الحملات",
    icon: FaBullhorn,
    children: [
      {
        label: "قائمة الحملات",
        icon: FaRegListAlt,
        children: [
          {
            label: "قائمة الحملات",
            icon: FaRegListAlt,
            href: "/dashboard/admin/campaigns",
          },
          {
            label: "إنشاء حملة",
            icon: FaUserPlus,
            href: "/dashboard/admin/campaigns/add",
          },
        ],
      },
      {
        label: "المسوقين",
        icon: FaBullhorn,
        children: [
          {
            label: "قائمة المسوقين",
            icon: FaRegListAlt,
            href: "/dashboard/admin/marketers",
          },
          {
            label: "إضافة مسوق",
            icon: FaUserPlus,
            href: "/dashboard/admin/marketers/add",
          },
        ],
      },
      // {
      //   label: "روابط الحملات",
      //   icon: FaRegListAlt,
      //   children: [
      //     {
      //       label: "قائمة روابط الحملات",
      //       icon: FaRegListAlt,
      //       href: "/dashboard/admin/short-links",
      //     },
      //     {
      //       label: "إنشاء رابط حملة",
      //       icon: FaUserPlus,
      //       href: "/dashboard/admin/short-links/add",
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   label: "العقارات المفضلة",
  //   icon: FaHeart,
  //   href: "/dashboard/admin/favorites",
  // },
  {
    label: "الصفحات",
    icon: FaFileAlt,
    children: [
      { label: "الرئيسية", icon: FaHome, href: "/dashboard/admin/pages/home" },
      {
        label: "من نحن",
        icon: AiOutlineTeam,
        href: "/dashboard/admin/pages/about",
      },
      {
        label: "الأسئلة الشائعة",
        icon: FaQuestionCircle,
        href: "/dashboard/admin/pages/faq",
      },
      {
        label: "سياسة الخصوصية",
        icon: MdOutlinePrivacyTip,
        href: "/dashboard/admin/pages/privacy",
      },
      {
        label: "الشروط والأحكام",
        icon: MdDescription,
        href: "/dashboard/admin/pages/terms",
      },
    ],
  },

  {
    label: "الإعدادات العامة",
    icon: MdSettings,
    children: [
      {
        label: "الموقع",
        icon: FaMapMarkerAlt,
        href: "/dashboard/admin/settings/location",
      },
      {
        label: "الفيديو التعريفي",
        icon: FaVideo,
        href: "/dashboard/admin/settings/intro-video",
      },
      {
        label: "معلومات التواصل و الإنجازات",
        icon: FaAward,
        href: "/dashboard/admin/settings/info",
      },
      {
        label: "الفوتر",
        icon: FaRegFileAlt,
        href: "/dashboard/admin/settings/footer",
      },
    ],
  },
];

export const agentDashboardItems: SelectableItem[] = [
  {
    label: "لوحة التحكم",
    icon: MdDashboard,
    href: "/dashboard/agent",
  },
  {
    label: "المواعيد",
    icon: FaCalendarAlt,
    children: [
      {
        label: "قائمة المواعيد",
        icon: FaRegListAlt,
        href: "/dashboard/agent/appointments",
      },
      {
        label: "إضافة موعد",
        icon: FaCalendarPlus,
        href: "/dashboard/agent/appointments/add",
      },
      {
        label: "طلبات المواعيد",
        icon: FaCalendarCheck,
        href: "/dashboard/agent/appointment-requests",
      },
    ],
  },
  // {
  //   label: "وقت العمل",
  //   icon: FaRegCalendarAlt,
  //   href: "/dashboard/agent/schedule",
  // },
  // {
  //   label: "المحفظة والمدفوعات",
  //   icon: FaWallet,
  //   href: "/dashboard/agent/payments",
  // },
];

export const marketerDashboardItems: SelectableItem[] = [
  {
    label: "لوحة التحكم",
    icon: MdDashboard,
    href: "/dashboard/marketer",
  },
  {
    label: "الحملات",
    icon: FaBullhorn,
    children: [
      {
        label: "قائمة الحملات",
        icon: FaRegListAlt,
        href: "/dashboard/marketer/campaigns",
      },
      {
        label: "إنشاء حملة",
        icon: FaPlusCircle,
        href: "/dashboard/marketer/campaigns/add",
      },
    ],
  },
  {
    label: "المحفظة والمدفوعات",
    icon: FaWallet,
    href: "/dashboard/marketer/payments",
  },
];

export const dashboardItems: Record<Role, SelectableItem[]> = {
  admin: adminDashboardItems,
  marketer: marketerDashboardItems,
  agent: agentDashboardItems,
};
