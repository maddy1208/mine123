import {
  Tractor,
  User,
  UserRound,
  Hotel,
  Factory,
  Ship,
  ShoppingCart,
  GraduationCap,
  ChefHat,
  Handshake,
  TrendingUp,
  Tag,
  BarChart3,
  Medal,
  Star,
  MapPin,
  Truck,
  PackageCheck,
  Package,
  Sprout,
  Wheat,
  Search,
  StickyNote,
  X,
  Check,
  Plus,
  Settings,
  Phone,
  CreditCard,
  LogOut,
  CircleUser,
  Lock,
  Share2,
} from "lucide-react";

const icons = [
  {
    group: "People & Roles",
    items: [
      { label: "FarmerIcon", comp: "Tractor", Icon: Tractor },
      { label: "BoyIcon", comp: "User", Icon: User },
      { label: "GirlIcon", comp: "UserRound", Icon: UserRound },
      { label: "HotelIcon", comp: "Hotel", Icon: Hotel },
      { label: "FoodFactoryIcon", comp: "Factory", Icon: Factory },
      { label: "ExportersIcon", comp: "Ship", Icon: Ship },
      { label: "RetailersIcon", comp: "ShoppingCart", Icon: ShoppingCart },
      { label: "SchoolIcon", comp: "GraduationCap", Icon: GraduationCap },
      { label: "CanteenIcon", comp: "ChefHat", Icon: ChefHat },
    ],
  },
  {
    group: "Trade & Commerce",
    items: [
      { label: "HandshakeIcon", comp: "Handshake", Icon: Handshake },
      { label: "PriceTrendIcon", comp: "TrendingUp", Icon: TrendingUp },
      { label: "PriceIcon", comp: "Tag", Icon: Tag },
      { label: "StockIcon", comp: "BarChart3", Icon: BarChart3 },
      { label: "MedalIcon", comp: "Medal", Icon: Medal },
      { label: "GradeIcon", comp: "Star", Icon: Star },
    ],
  },
  {
    group: "Logistics",
    items: [
      { label: "LocationIcon", comp: "MapPin", Icon: MapPin },
      { label: "OutForDeliveryIcon", comp: "Truck", Icon: Truck },
      {
        label: "SuccessDeliveryIcon",
        comp: "PackageCheck",
        Icon: PackageCheck,
      },
      { label: "DeliveryIcon", comp: "Package", Icon: Package },
    ],
  },
  {
    group: "Agriculture",
    items: [
      { label: "CropIcon", comp: "Sprout", Icon: Sprout },
      { label: "CropAltIcon", comp: "Wheat", Icon: Wheat },
    ],
  },
  {
    group: "UI & Actions",
    items: [
      { label: "SearchIcon", comp: "Search", Icon: Search },
      { label: "NotesIcon", comp: "StickyNote", Icon: StickyNote },
      { label: "WrongIcon", comp: "X", Icon: X },
      { label: "RightTickIcon", comp: "Check", Icon: Check },
      { label: "AddIcon", comp: "Plus", Icon: Plus },
      { label: "SettingsIcon", comp: "Settings", Icon: Settings },
      { label: "PhoneIcon", comp: "Phone", Icon: Phone },
      { label: "DebitCardIcon", comp: "CreditCard", Icon: CreditCard },
      { label: "SignOutIcon", comp: "LogOut", Icon: LogOut },
      { label: "ProfileIcon", comp: "CircleUser", Icon: CircleUser },
      { label: "PasswordIcon", comp: "Lock", Icon: Lock },
    ],
  },
  {
    group: "Social Media",
    items: [{ label: "SocialShareIcon", comp: "Share2", Icon: Share2 }],
  },
];

export default function AgriIcons() {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "24px",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "24px",
          color: "#111",
        }}
      >
        AgriIcons — Icon Reference
      </h1>

      {icons.map(({ group, items }) => (
        <div key={group} style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#888",
              borderBottom: "1px solid #eee",
              paddingBottom: "8px",
              marginBottom: "12px",
            }}
          >
            {group}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "10px",
            }}
          >
            {items.map(({ label, comp, Icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "16px 8px 12px",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  background: "#fafafa",
                  cursor: "default",
                }}
              >
                <Icon size={24} strokeWidth={1.8} color="#222" />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#444",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    color: "#aaa",
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  {"<"}
                  {comp}
                  {" />"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
