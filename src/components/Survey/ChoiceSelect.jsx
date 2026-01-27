export default function ChoiceSelect({ text, isSelect, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        p-4
        h-[60px] sm:h-[72px]
        border border-button rounded-md
        transition-colors
        ${
          isSelect
            ? "bg-accent text-white"
            : "bg-white hover:bg-accent hover:text-white"
        }
      `}
    >
      <p className="font-medium text-sm text-center">
        {text}
      </p>
    </button>
  );
}
