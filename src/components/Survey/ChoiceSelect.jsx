export default function ChoiceSelect({ text, isSelect, onClick, disabled }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled) onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full
        p-4
        h-[60px] sm:h-[72px]
        border rounded-md
        transition-colors
        select-none
        touch-manipulation
        ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : isSelect
            ? "bg-accent text-white border-button"
            : "bg-white hover:bg-accent hover:text-white border-button"
        }
      `}
    >
      <p className="font-medium text-sm text-center">
        {text}
      </p>
    </button>
  );
}
