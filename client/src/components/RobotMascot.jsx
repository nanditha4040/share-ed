export default function RobotMascot() {
  return (
    <div className="robot-container pointer-events-none">
      <svg
        width="260"
        height="260"
        viewBox="0 0 200 200"
        className="robot-svg"
      >
        {/* body */}
        <rect x="50" y="70" width="100" height="80" rx="20" fill="#EDE9FE" stroke="#5F4BB6" strokeWidth="3"/>

        {/* head */}
        <rect x="60" y="30" width="80" height="50" rx="12" fill="#F5F3FF" stroke="#5F4BB6" strokeWidth="3"/>

        {/* eyes */}
        <circle cx="85" cy="55" r="6" fill="#5F4BB6"/>
        <circle cx="115" cy="55" r="6" fill="#5F4BB6"/>

        {/* antenna */}
        <line x1="100" y1="30" x2="100" y2="18" stroke="#5F4BB6" strokeWidth="3"/>
        <circle cx="100" cy="15" r="4" fill="#6D5BD0"/>

        {/* left arm */}
        <line x1="50" y1="95" x2="30" y2="85" stroke="#5F4BB6" strokeWidth="4"/>

        {/* waving right arm */}
        <g className="robot-hand">
          <line x1="150" y1="95" x2="170" y2="75" stroke="#5F4BB6" strokeWidth="4"/>
        </g>

        {/* feet */}
        <rect x="70" y="150" width="20" height="10" rx="4" fill="#5F4BB6"/>
        <rect x="110" y="150" width="20" height="10" rx="4" fill="#5F4BB6"/>
      </svg>
    </div>
  );
}