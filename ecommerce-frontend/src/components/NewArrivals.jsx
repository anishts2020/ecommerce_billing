import NewArrivalsCard from "./NewArrivalsCard";

export default function NewArrivals({ products, onAddToCart, onWishlist }) {
  const newArrivals = products.filter(
    (product) => product.new_arrivals === 1
  );

  if (!newArrivals.length) return null;

  return (
    <section className="mt-14">
      <h2 className="text-xl font-semibold tracking-wide mb-6">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <NewArrivalsCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
          />
        ))}
      </div>
    </section>
  );
}
