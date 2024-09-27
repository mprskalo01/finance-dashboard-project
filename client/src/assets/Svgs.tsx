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

const addSvg = ({ strokeColor = "#12efc8" }: SvgProps) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const editSvg = ({
  fillColor = "#12efc8",
  size = "16px",
}: SvgProps & { size?: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 -0.5 21 21"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>edit_fill [#1480]</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill={fillColor}
        fillRule="evenodd"
      >
        <g
          id="Dribbble-Light-Preview"
          transform="translate(-59.000000, -400.000000)"
          fill="#0ea5e9"
        >
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path
              d="M3,260 L24,260 L24,258.010742 L3,258.010742 L3,260 Z M13.3341,254.032226 L9.3,254.032226 L9.3,249.950269 L19.63095,240 L24,244.115775 L13.3341,254.032226 Z"
              id="edit_fill-[#1480]"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

const deleteSvg = ({ strokeColor = "#ef4444" }: SvgProps) => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 12V17"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 12V17"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7H20"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Svgs = {
  barSvg,
  areaChartSvg,
  editSvg,
  addSvg,
  deleteSvg,
};

export default Svgs;
