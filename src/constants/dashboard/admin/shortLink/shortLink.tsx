import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import {
  ShortLinkRow,
  ShortLinkStatus,
  shortLinkStatusMap,
  shortLinkStatusColors,
  generateShortUrl,
  truncateUrl,
  formatClicks,
  getPlatformIcon,
  getPlatformName,
  getShortLinkPerformanceStatus,
  shortLinkPerformanceMap,
  shortLinkPerformanceColors,
} from "@/types/dashboard/shortLink";
import { formatDate } from "@/utils/date";

export const shortLinkStatusClassMap: Record<ShortLinkStatus, string> = {
  active: "bg-green-600 hover:bg-green-700",
  inactive: "bg-gray-500 hover:bg-gray-600",
};

export const shortLinkSortConfig: SortConfig = {
  sortFields: [
    { label: "الرابط المختصر", value: "slug" },
    { label: "الحالة", value: "status" },
    { label: "تاريخ الإنشاء", value: "createdAt" },
    { label: "عدد النقرات", value: "clicks" },
    { label: "معدل التحويل", value: "conversionRate" },
  ],
  defaultSort: "createdAt",
};

export const shortLinkFilters: FilterConfig[] = [
  {
    type: "select",
    label: "الحالة",
    key: "status",
    options: [
      { label: "الكل", value: "all" },
      { label: "نشط", value: "active" },
      { label: "غير نشط", value: "inactive" },
    ],
    default: "all",
  },
];

export const shortLinkColumns: TableColumn<ShortLinkRow>[] = [
  {
    key: "id",
    label: "المعرف",
    cell: (val) => <span className="text-gray-500 text-sm">#{val}</span>,
  },
  {
    key: "slug",
    label: "الرابط المختصر",
    cell: (val, row) => (
      <div className="flex flex-col">
        <a
          href={row.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          /{val}
        </a>
        <span className="text-gray-500 text-xs">{row.shortUrl}</span>
      </div>
    ),
  },
  {
    key: "destination",
    label: "الرابط الوجهة",
    cell: (val) => (
      <div className="max-w-[200px]">
        <span
          className="text-gray-700 text-sm truncate block"
          title={val as string}
        >
          {truncateUrl(val as string, 40)}
        </span>
      </div>
    ),
  },
  {
    key: "influencerName",
    label: "المؤثر",
    cell: (val, row) => {
      if (!val) return <span className="text-gray-400 text-sm">لا يوجد</span>;

      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {getPlatformIcon(row.influencerPlatform)}
          </span>
          <div className="flex flex-col">
            <span className="text-gray-800 font-medium text-sm">{val}</span>
            {row.influencerHandle && (
              <span className="text-gray-500 text-xs">
                {row.influencerHandle}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "marketerReferralCode",
    label: "المسوق",
    cell: (val) =>
      val ? (
        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm font-medium">
          {val}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">لا يوجد</span>
      ),
  },
  {
    key: "campaignId",
    label: "الحملة",
    cell: (val) =>
      val ? (
        <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-sm">
          #{val}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">عام</span>
      ),
  },
  {
    key: "createdAt",
    label: "تاريخ الإنشاء",
    cell: (val) => (
      <span className="text-gray-600 text-sm">{formatDate(val)}</span>
    ),
  },
  {
    key: "totalClicks",
    label: "النقرات",
    cell: (val, row) => {
      const clicks = (val as number) || 0;
      const uniqueClicks = row.uniqueClicks || 0;

      return (
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium text-sm">
            {formatClicks(clicks)}
          </span>
          {uniqueClicks > 0 && (
            <span className="text-gray-500 text-xs">
              {formatClicks(uniqueClicks)} فريد
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "conversionRate",
    label: "معدل التحويل",
    cell: (val, row) => {
      const conversionRate = (val as number) || 0;
      const totalConversions = row.totalConversions || 0;
      const performanceStatus = getShortLinkPerformanceStatus(conversionRate);

      return (
        <div className="flex flex-col">
          <span
            className={`${shortLinkPerformanceColors[performanceStatus]} px-2 py-1 rounded text-sm font-medium text-center`}
          >
            {conversionRate > 0 ? `${conversionRate.toFixed(1)}%` : "0%"}
          </span>
          {totalConversions > 0 && (
            <span className="text-gray-500 text-xs text-center mt-1">
              {totalConversions} تحويل
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    label: "الحالة",
    cell: (val) => {
      const style = shortLinkStatusColors[val as ShortLinkStatus];

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm font-medium`}>
          {shortLinkStatusMap[val as ShortLinkStatus]}
        </span>
      );
    },
  },
  {
    key: "createdByName",
    label: "تم الإنشاء بواسطة",
    cell: (val, row) => (
      <div className="flex flex-col">
        <span className="text-gray-800 text-sm">{val}</span>
        <span className="text-gray-500 text-xs">{row.createdByEmail}</span>
      </div>
    ),
  },
];

// Mock data for development
export const mockedShortLinks: ShortLinkRow[] = [
  {
    id: "5",
    slug: "winter20253",
    destination: "https://fitness-front-iin2.vercel.app/",
    shortUrl: generateShortUrl("winter20253"),
    campaignId: "3",
    status: "active",
    createdAt: "2025-10-19T04:20:18.844Z",
    updatedAt: "2025-10-19T04:20:18.844Z",
    influencerName: "أحمد العتيبي",
    influencerHandle: "@ahmed_realestate",
    influencerPlatform: "instagram",
    marketerReferralCode: "REF1000",
    createdByName: "System Administrator",
    createdByEmail: "admin@gmail.com",
    totalClicks: 1250,
    uniqueClicks: 980,
    totalConversions: 45,
    conversionRate: 3.6,
  },
  {
    id: "4",
    slug: "winter20252",
    destination: "https://example.com/properties?campaign=winter",
    shortUrl: generateShortUrl("winter20252"),
    campaignId: "3",
    status: "active",
    createdAt: "2025-10-19T04:19:08.102Z",
    updatedAt: "2025-10-19T04:19:08.102Z",
    influencerName: "أحمد العتيبي",
    influencerHandle: "@ahmed_realestate",
    influencerPlatform: "instagram",
    marketerReferralCode: "REF1000",
    createdByName: "System Administrator",
    createdByEmail: "admin@gmail.com",
    totalClicks: 850,
    uniqueClicks: 720,
    totalConversions: 32,
    conversionRate: 3.8,
  },
  {
    id: "3",
    slug: "winter2025",
    destination: "https://example.com/properties?campaign=winter",
    shortUrl: generateShortUrl("winter2025"),
    campaignId: "3",
    status: "active",
    createdAt: "2025-10-18T17:46:21.716Z",
    updatedAt: "2025-10-18T17:46:21.716Z",
    influencerName: "أحمد العتيبي",
    influencerHandle: "@ahmed_realestate",
    influencerPlatform: "instagram",
    marketerReferralCode: "REF1000",
    createdByName: "System Administrator",
    createdByEmail: "admin@gmail.com",
    totalClicks: 2100,
    uniqueClicks: 1650,
    totalConversions: 95,
    conversionRate: 4.5,
  },
  {
    id: "1",
    slug: "winter24",
    destination: "https://realestate.com/properties?campaign=winter2024",
    shortUrl: generateShortUrl("winter24"),
    campaignId: null,
    status: "active",
    createdAt: "2025-10-18T13:11:13.037Z",
    updatedAt: "2025-10-18T13:11:13.037Z",
    influencerName: null,
    influencerHandle: null,
    influencerPlatform: null,
    marketerReferralCode: "REF1000",
    createdByName: "System Administrator",
    createdByEmail: "admin@gmail.com",
    totalClicks: 450,
    uniqueClicks: 380,
    totalConversions: 12,
    conversionRate: 2.7,
  },
  {
    id: "2",
    slug: "ahmedref",
    destination: "https://realestate.com/register?ref=ahmed01",
    shortUrl: generateShortUrl("ahmedref"),
    campaignId: null,
    status: "inactive",
    createdAt: "2025-10-18T13:11:13.037Z",
    updatedAt: "2025-10-18T13:11:13.037Z",
    influencerName: "أحمد العتيبي",
    influencerHandle: "@ahmed_realestate",
    influencerPlatform: "instagram",
    marketerReferralCode: null,
    createdByName: "System Administrator",
    createdByEmail: "admin@gmail.com",
    totalClicks: 320,
    uniqueClicks: 280,
    totalConversions: 8,
    conversionRate: 2.5,
  },
];

// Additional configuration for analytics view
export const analyticsColumns: TableColumn<ShortLinkRow>[] = [
  {
    key: "slug",
    label: "الرابط المختصر",
    cell: (val, row) => (
      <div className="flex flex-col">
        <span className="text-blue-600 font-medium">/{val}</span>
        <span className="text-gray-500 text-xs">
          {truncateUrl(row.destination, 30)}
        </span>
      </div>
    ),
  },
  {
    key: "totalClicks",
    label: "إجمالي النقرات",
    cell: (val) => (
      <span className="text-2xl font-bold text-blue-600">
        {formatClicks((val as number) || 0)}
      </span>
    ),
  },
  {
    key: "uniqueClicks",
    label: "النقرات الفريدة",
    cell: (val) => (
      <span className="text-lg text-gray-700">
        {formatClicks((val as number) || 0)}
      </span>
    ),
  },
  {
    key: "totalConversions",
    label: "التحويلات",
    cell: (val) => (
      <span className="text-2xl font-bold text-green-600">
        {(val as number) || 0}
      </span>
    ),
  },
  {
    key: "conversionRate",
    label: "معدل التحويل",
    cell: (val) => {
      const conversionRate = (val as number) || 0;
      const performanceStatus = getShortLinkPerformanceStatus(conversionRate);

      return (
        <span
          className={`${shortLinkPerformanceColors[performanceStatus]} px-3 py-2 rounded-lg text-lg font-bold`}
        >
          {conversionRate > 0 ? `${conversionRate.toFixed(1)}%` : "0%"}
        </span>
      );
    },
  },
];
