import "./globals.css";
import { Ysabeau } from "next/font/google";
import { Outfit } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DashboardLayout from "./dashboard/layout";
// FONT DECLARATION
const outfit = Ysabeau({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

// default metadata
export const metadata = {
  title: "Web3 Crowdfunding",
  description: "Crowdfunding Project app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body className={outfit.className}>
          <DashboardLayout>{children}</DashboardLayout>
        </body>
      </html>
    </>
  );
}
