interface SvgProps {
  fillColor?: string; // Optional fillColor prop
  strokeColor?: string; // Optional strokeColor prop
}

const barSvg = ({ fillColor = "none", strokeColor = "#12efc8" }: SvgProps) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill={fillColor} // Use fillColor prop
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 10V17"
        stroke={strokeColor} // Use strokeColor prop
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7V17"
        stroke={strokeColor} // Use strokeColor prop
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke={strokeColor} // Use strokeColor prop
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13L8 17"
        stroke={strokeColor} // Use strokeColor prop
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const areaChartSvg = ({ fillColor = "#12efc8" }: SvgProps) => {
  return (
    <svg
      fill={fillColor} // Use fillColor prop
      width="24px"
      height="24px"
      viewBox="0 -4 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m32 22v2h-32v-24h2v22zm-6-16 4 14h-26v-9l7-9 9 9z" />
    </svg>
  );
};

const Svgs = {
  barSvg,
  areaChartSvg,
};

export default Svgs;
