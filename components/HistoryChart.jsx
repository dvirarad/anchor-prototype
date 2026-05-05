export default function HistoryChart({ data, height = 140 }) {
  const max = Math.max(
    1,
    ...data.map(d => d.scheduled + d.snoozed + d.dismissed)
  );
  const width = 320;
  const padTop = 18;
  const padBottom = 28;
  const padX = 8;
  const innerH = height - padTop - padBottom;
  const innerW = width - padX * 2;
  const barW = innerW / data.length * 0.6;
  const step = innerW / data.length;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={padX}
            x2={width - padX}
            y1={padTop + innerH * (1 - t)}
            y2={padTop + innerH * (1 - t)}
            stroke="#2a2620"
            strokeWidth="0.5"
            strokeDasharray={t === 1 ? "0" : "2 3"}
          />
        ))}
        {data.map((d, i) => {
          const total = d.scheduled + d.snoozed + d.dismissed;
          const cx = padX + step * i + step / 2;
          const x = cx - barW / 2;
          const sH = (d.scheduled / max) * innerH;
          const zH = (d.snoozed / max) * innerH;
          const xH = (d.dismissed / max) * innerH;
          const baseY = padTop + innerH;
          const yDismissed = baseY - xH;
          const ySnoozed = yDismissed - zH;
          const yScheduled = ySnoozed - sH;
          return (
            <g key={i}>
              {xH > 0 && (
                <rect x={x} y={yDismissed} width={barW} height={xH}
                  fill="#3a342c" rx="1.5" />
              )}
              {zH > 0 && (
                <rect x={x} y={ySnoozed} width={barW} height={zH}
                  fill="#7a5a3a" rx="1.5" />
              )}
              {sH > 0 && (
                <rect x={x} y={yScheduled} width={barW} height={sH}
                  fill="#d4a574" rx="1.5" />
              )}
              {d.isToday && (
                <circle cx={cx} cy={padTop + innerH + 12} r="1.5" fill="#d4a574" />
              )}
              <text
                x={cx}
                y={padTop + innerH + 16}
                textAnchor="middle"
                fontSize="8"
                fill={d.isToday ? "#d4a574" : "#807466"}
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                {d.day}
              </text>
              <text
                x={cx}
                y={padTop + innerH + 25}
                textAnchor="middle"
                fontSize="7.5"
                fill="#5a534a"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
              >
                {total}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-4 mt-2 font-mono text-[9px] tracking-widest uppercase" style={{ color: "#807466" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm" style={{ background: "#d4a574" }} />
          Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm" style={{ background: "#7a5a3a" }} />
          Snoozed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm" style={{ background: "#3a342c" }} />
          Dismissed
        </span>
      </div>
    </div>
  );
}
