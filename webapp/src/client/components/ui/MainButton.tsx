import Button from "./Button";

interface MainButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function MainButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: MainButtonProps) {
  return (
    <Button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        gap-[10px]
        w-[270px]
        h-[48px]
        px-6
        py-2
        bg-gradient-to-l
        from-[#BCECD3]
        to-[#64D8C6]
        border
        border-[#1F2937]
        rounded-[6px]
        text-[#1F2937]
        font-bold
        text-base
        leading-[1.5em]
        hover:opacity-90
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      style={{
        fontWeight: 700,
        fontSize: "16px",
      }}
    >
      {children}
    </Button>
  );
}
