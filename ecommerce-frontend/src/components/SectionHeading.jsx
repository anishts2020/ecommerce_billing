export default function SectionHeading({ small, big, underline }) {
  return (
    <div className="text-center mb-8 select-none">
      <p className="text-gray-500 italic text-sm">{small}</p>

      <h2 className="text-3xl font-semibold tracking-wide mt-1">
        {big}
      </h2>

      <div className="flex justify-center mt-2">
        <img
          src="/sell.webp"
          alt="decorative underline"
          className="w-32 opacity-80"
        />
      </div>
    </div>
  );
}
