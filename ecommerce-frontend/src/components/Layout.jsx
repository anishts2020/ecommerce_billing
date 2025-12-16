import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}