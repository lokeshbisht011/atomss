import "./globals.css";

export const metadata = {
  title: "Atomss.fun",
  description: "Multiplayer top-down game where atoms grow and compete",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
