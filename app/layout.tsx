import "./globals.css";

export const metadata = {
  title: "Anchor — A todo without a time is a wish",
  description: "The to-do list that watches what you missed and puts it on your calendar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
