type Props = {
  className?: string;
  align?: "left" | "center";
};

export function StrideLogo({ className = "h-10 w-auto", align = "left" }: Props) {
  const isCentered = align === "center";

  return (
    <svg
      width="220"
      height="40"
      viewBox="0 0 620 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stride Payments"
      className={className}
    >
      <text
        x={isCentered ? "310" : "0"}
        y="84"
        fill="#5b8cff"
        fontFamily="Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="64"
        fontWeight="700"
        letterSpacing="-3"
        textAnchor={isCentered ? "middle" : "start"}
      >
        <tspan>s</tspan>
        <tspan dx="-2">t</tspan>
        <tspan>r</tspan>
        <tspan dx="-2">i</tspan>
        <tspan>d</tspan>
        <tspan dx="-2">e</tspan>
        <tspan dx="10">p</tspan>
        <tspan dx="-2">a</tspan>
        <tspan dx="-2">y</tspan>
        <tspan dx="-2">m</tspan>
        <tspan dx="-2">e</tspan>
        <tspan dx="-2">n</tspan>
        <tspan dx="-2">t</tspan>
        <tspan dx="-2">s</tspan>
      </text>
    </svg>
  );
}
