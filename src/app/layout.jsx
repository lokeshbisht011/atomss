import "./globals.css";

export const metadata = {
  title: "Atom Arena",
  description: "Multiplayer top-down game where atoms grow and compete",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
