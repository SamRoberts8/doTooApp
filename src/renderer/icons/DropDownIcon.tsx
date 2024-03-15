function DropDownIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.707107"
        y1="1.29289"
        x2="7.70711"
        y2="8.29289"
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1="6.29289"
        y1="8.29289"
        x2="13.2929"
        y2="1.29289"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

export default DropDownIcon;
