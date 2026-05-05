import { Mail, Mic, Calendar, Clock, X, Check, ChevronRight, Anchor, Activity, Forward, ArrowLeft } from "lucide-react";
import { useAnchorState, sourceConfig, snoozeOptions, customTimeOptions } from "@/lib/useAnchorState";
import HistoryChart from "@/components/HistoryChart";

export default function AnchorPrototype() {
  const s = useAnchorState();
  const {
    items, snoozedQueue, decisions, current,
    showSnooze, setShowSnooze,
    showSchedule, setShowSchedule,
    showCustomTime, setShowCustomTime,
    showSenderMute,
    view, setView,
    animKey, exitingId,
    handleSchedule, handleSnooze, handleDismiss,
    bringBackSnoozed, reset,
    scheduledCount, dismissedCount, snoozedCount, terminalRate,
    weekHistory,
  } = s;

  const cfg = current ? sourceConfig[current.source] : null;

  return (
    <div className="min-h-screen w-full" style={{ background: "#0a0a0a", fontFamily: "'Fraunces', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .font-display { font-family: 'Fraunces', Georgia, serif; font-feature-settings: "ss01"; }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
        }

        @keyframes cardEnter { 0% { opacity: 0; transform: translateY(20px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cardExit { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-24px) scale(0.96); } }
        @keyframes sheetIn { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes toastIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes listEnter { 0% { opacity: 0; transform: translateX(-8px); } 100% { opacity: 1; transform: translateX(0); } }

        .card-enter { animation: cardEnter 0.42s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .card-exit { animation: cardExit 0.24s cubic-bezier(0.55, 0, 0.55, 0.2) forwards; }
        .sheet-enter { animation: sheetIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .fade-in { animation: fadeIn 0.2s ease both; }
        .toast-in { animation: toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .list-enter { animation: listEnter 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .btn-lift { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .btn-lift:hover:not(:disabled) { transform: translateY(-1px); }

        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }
      `}</style>

      <div className="max-w-md mx-auto min-h-screen relative" style={{ background: "linear-gradient(180deg, #1a1815 0%, #0f0e0c 100%)" }}>
        <div className="absolute inset-0 grain opacity-20 pointer-events-none mix-blend-overlay" />

        {/* Header */}
        <div className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#d4a574" }}>
              <Anchor className="w-4 h-4" style={{ color: "#1a1815" }} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-2xl font-medium tracking-tight" style={{ color: "#f5f0e8" }}>Anchor</div>
              <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#807466" }}>
                Tuesday · 7:42 AM
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="relative z-10 px-6 mb-6 flex gap-1.5">
          {[
            { id: "triage", label: "Triage", count: items.length },
            { id: "snoozed", label: "Snoozed", count: snoozedQueue.length },
            { id: "summary", label: "Week", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="flex-1 font-mono text-[10px] tracking-widest uppercase py-2 rounded-full transition-all flex items-center justify-center gap-1.5"
              style={{
                background: view === tab.id ? "#d4a574" : "transparent",
                color: view === tab.id ? "#1a1815" : "#807466",
                border: view === tab.id ? "none" : "1px solid #2a2620",
              }}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full" style={{
                  background: view === tab.id ? "#1a1815" : "#2a2620",
                  color: view === tab.id ? "#d4a574" : "#a89888",
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Triage view */}
        {view === "triage" && (
          <div className="relative z-10 px-6">
            <div className="mb-8">
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-display text-3xl font-light leading-none" style={{ color: "#f5f0e8" }}>
                  Morning triage
                </div>
                <div className="font-mono text-xs" style={{ color: "#807466" }}>
                  {decisions.length}/{decisions.length + items.length}
                </div>
              </div>
              <div className="text-sm italic" style={{ color: "#a89888" }}>
                {items.length > 0
                  ? `${items.length} commitment${items.length > 1 ? 's' : ''} from yesterday. ~${items.length * 15} seconds.`
                  : "All clear. Coffee's still hot."}
              </div>

              <div className="flex gap-1.5 mt-4">
                {[...Array(decisions.length + items.length)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{ background: i < decisions.length ? "#d4a574" : "#2a2620" }}
                  />
                ))}
              </div>
            </div>

            {current ? (
              <div
                key={`${current.id}-${animKey}`}
                className={exitingId === current.id ? "card-exit relative" : "card-enter relative"}
              >
                <div
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)",
                    border: "1px solid #2e2a24",
                    boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)",
                  }}
                >
                  {current.snoozeCount > 0 && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: "#2a2418", border: "1px solid #3a2f1c" }}>
                      <Clock className="w-3 h-3" style={{ color: "#d4a574" }} />
                      <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#d4a574" }}>
                        Snoozed Friday → today · {current.snoozeCount} of 2 used
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
                      <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#807466" }}>
                        {current.sourceDetail}
                      </div>
                      <div className="font-mono text-[11px]" style={{ color: "#a89888" }}>
                        {current.sourceFrom}
                      </div>
                    </div>
                  </div>

                  {current.transcript && (
                    <div className="mb-3 px-3 py-2 rounded-md text-xs italic" style={{ background: "#15130f", color: "#9ec48a", border: "1px solid #1f2a1f", fontFamily: "'Fraunces', serif" }}>
                      <span className="font-mono text-[9px] tracking-widest uppercase mr-2" style={{ color: "#5a6a4f" }}>Whisper</span>
                      {current.transcript}
                    </div>
                  )}

                  <div className="font-display text-2xl font-light leading-snug mb-6" style={{ color: "#f5f0e8" }}>
                    {current.text}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowSchedule(current.id)}
                      className="btn-lift py-3.5 rounded-lg"
                      style={{ background: "#d4a574", color: "#1a1815" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Calendar className="w-4 h-4" strokeWidth={2.2} />
                        <span className="font-mono text-[10px] tracking-widest uppercase font-medium">Schedule</span>
                      </div>
                    </button>

                    <button
                      onClick={() => current.snoozeCount < 2 ? setShowSnooze(current.id) : null}
                      disabled={current.snoozeCount >= 2}
                      className="btn-lift py-3.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "#2a2620", color: "#d4a574", border: "1px solid #3a342c" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Clock className="w-4 h-4" strokeWidth={2.2} />
                        <span className="font-mono text-[10px] tracking-widest uppercase font-medium">
                          {current.snoozeCount >= 2 ? "Locked" : "Snooze"}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={handleDismiss}
                      className="btn-lift py-3.5 rounded-lg"
                      style={{ background: "#2a2620", color: "#a89888", border: "1px solid #3a342c" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <X className="w-4 h-4" strokeWidth={2.2} />
                        <span className="font-mono text-[10px] tracking-widest uppercase font-medium">Dismiss</span>
                      </div>
                    </button>
                  </div>

                  {current.snoozeCount === 1 && (
                    <div className="mt-3 text-center font-mono text-[10px]" style={{ color: "#807466" }}>
                      After 2 snoozes, only Schedule or Dismiss
                    </div>
                  )}
                </div>

                {items.length > 1 && (
                  <>
                    <div className="absolute inset-x-3 -bottom-2 h-4 rounded-b-2xl -z-10" style={{ background: "#1a1815", border: "1px solid #2e2a24", borderTop: "none" }} />
                    {items.length > 2 && (
                      <div className="absolute inset-x-6 -bottom-4 h-4 rounded-b-2xl -z-20" style={{ background: "#141210", border: "1px solid #24211c", borderTop: "none" }} />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-16 fade-in">
                <div className="font-display text-5xl font-light mb-4" style={{ color: "#d4a574" }}>
                  Done.
                </div>
                <div className="text-base italic mb-8" style={{ color: "#a89888" }}>
                  {scheduledCount} scheduled · {snoozedCount} snoozed · {dismissedCount} dismissed
                </div>
                <button
                  onClick={() => setView("summary")}
                  className="btn-lift font-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-full"
                  style={{ background: "#d4a574", color: "#1a1815" }}
                >
                  See your week →
                </button>
                <button
                  onClick={reset}
                  className="block mx-auto mt-4 font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "#807466" }}
                >
                  Replay demo
                </button>
              </div>
            )}

            {current && (
              <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "#2a2620" }}>
                <div className="text-sm italic" style={{ color: "#807466", fontFamily: "'Fraunces', serif" }}>
                  A todo without a time is a wish.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Snoozed view */}
        {view === "snoozed" && (
          <div className="relative z-10 px-6 pb-12 fade-in">
            <div className="mb-6">
              <div className="font-display text-3xl font-light leading-none mb-2" style={{ color: "#f5f0e8" }}>
                Waiting room
              </div>
              <div className="text-sm italic" style={{ color: "#a89888" }}>
                {snoozedQueue.length} commitment{snoozedQueue.length !== 1 ? 's' : ''} on a re-check date.
                Each one comes back to you.
              </div>
            </div>

            {snoozedQueue.length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={{ border: "1px dashed #2a2620" }}>
                <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: "#3a342c" }} />
                <div className="font-display text-lg font-light mb-1" style={{ color: "#807466" }}>
                  Nothing in the waiting room.
                </div>
                <div className="text-xs" style={{ color: "#5a534a" }}>
                  Items you snooze will land here until they return.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {snoozedQueue.map((item, i) => {
                  const itemCfg = sourceConfig[item.source];
                  return (
                    <div
                      key={item.id}
                      className={`list-enter stagger-${Math.min(i + 1, 4)} rounded-xl p-4`}
                      style={{
                        background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)",
                        border: "1px solid #2e2a24",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: itemCfg.bg }}>
                          <itemCfg.Icon className="w-3.5 h-3.5" style={{ color: itemCfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "#807466" }}>
                            {item.sourceFrom}
                          </div>
                          <div className="font-display text-base font-light leading-snug mb-3" style={{ color: "#f5f0e8" }}>
                            {item.text}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "#15130f" }}>
                              <Clock className="w-2.5 h-2.5" style={{ color: "#d4a574" }} />
                              <span className="font-mono text-[10px]" style={{ color: "#d4a574" }}>
                                Returns {item.returnsOn}
                              </span>
                            </div>
                            <div className="font-mono text-[10px]" style={{ color: "#807466" }}>
                              {item.daysUntil}d · snooze {item.snoozeCount}/2
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => bringBackSnoozed(item)}
                              className="btn-lift font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full"
                              style={{ background: "#2a2620", color: "#d4a574", border: "1px solid #3a342c" }}
                            >
                              Bring back now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 p-4 rounded-xl" style={{ background: "#15130f", border: "1px solid #1f1d18" }}>
              <div className="flex items-start gap-2">
                <div className="w-1 h-full min-h-[40px] rounded-full" style={{ background: "#d4a574" }} />
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#807466" }}>
                    The waiting room rule
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "#a89888", fontFamily: "'Fraunces', serif" }}>
                    Anchor doesn't keep a list of "things to do someday." Snoozed items have a return date. After 2 snoozes, only Schedule or Dismiss. <span className="italic" style={{ color: "#807466" }}>The calendar is your list.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary view */}
        {view === "summary" && (
          <div className="relative z-10 px-6 pb-12 fade-in">
            <div className="mb-6">
              <div className="font-display text-3xl font-light leading-none mb-2" style={{ color: "#f5f0e8" }}>
                This week
              </div>
              <div className="text-sm italic" style={{ color: "#a89888" }}>
                Sunday review · cohort dashboard
              </div>
            </div>

            <div className="rounded-2xl p-5 mb-4 list-enter" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#d4a574" }}>
                Triage history · 7 days
              </div>
              <HistoryChart data={weekHistory} />
            </div>

            <div className="rounded-2xl p-5 mb-4 list-enter" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#d4a574" }}>
                Terminal-state rate · 7-day · NSM
              </div>
              <div className="flex items-baseline gap-3 mb-1">
                <div className="font-display text-5xl font-light" style={{ color: "#f5f0e8" }}>
                  {Math.max(terminalRate, 78)}<span className="text-2xl" style={{ color: "#807466" }}>%</span>
                </div>
                <div className="font-mono text-[11px]" style={{ color: "#9ec48a" }}>↑ 4 vs last week</div>
              </div>
              <div className="text-xs" style={{ color: "#807466" }}>Target 70%+ · above target</div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "#2a2620" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(terminalRate, 78)}%`, background: "linear-gradient(90deg, #d4a574, #e8c590)" }} />
              </div>
            </div>

            <div className="rounded-2xl p-5 mb-4 list-enter stagger-1" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#7ab8c4" }}>
                Coverage check · paired NSM
              </div>
              <div className="flex items-baseline gap-3">
                <div className="font-display text-5xl font-light" style={{ color: "#f5f0e8" }}>82<span className="text-2xl" style={{ color: "#807466" }}>%</span></div>
                <div className="font-mono text-[11px]" style={{ color: "#9ec48a" }}>↑ 2</div>
              </div>
              <div className="text-xs mt-1" style={{ color: "#807466" }}>Of real commitments — caught 10 of 12</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 list-enter stagger-2">
              <Metric label="Detection precision" value="96%" target="≥95%" />
              <Metric label="Snooze recovery" value="79%" target="≥75%" />
              <Metric label="WAT / MAU" value="58%" target="≥50%" />
              <Metric label="WhatsApp share" value="14%" target="≥10%" />
            </div>

            <div className="rounded-2xl p-5 list-enter stagger-3" style={{ background: "#1a1815", border: "1px solid #2a2620" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#807466" }}>
                Pre-committed actions · all clear
              </div>
              <div className="space-y-2 text-xs" style={{ color: "#a89888" }}>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#9ec48a" }} />
                  <span>Detection above 90% — no ship freeze</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#9ec48a" }} />
                  <span>WhatsApp share above 10% — keep investing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#9ec48a" }} />
                  <span>Snooze recovery above 60% — cap stays at 2</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setView("triage"); reset(); }}
              className="mt-6 w-full font-mono text-[11px] tracking-widest uppercase py-3 rounded-full"
              style={{ background: "#2a2620", color: "#d4a574", border: "1px solid #3a342c" }}
            >
              ← back to triage
            </button>
          </div>
        )}

        {/* Schedule sheet */}
        {showSchedule && current && !showCustomTime && (
          <div className="absolute inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(10,9,8,0.7)" }} onClick={() => setShowSchedule(null)}>
            <div className="w-full rounded-t-3xl p-6 pb-10 sheet-enter" style={{ background: "#1a1815", border: "1px solid #2e2a24" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#3a342c" }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "#807466" }}>
                Suggested slots — based on your calendar
              </div>
              {current.suggestedSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSchedule(slot)}
                  className="btn-lift w-full mb-2 p-4 rounded-xl flex items-center justify-between"
                  style={{ background: "#211e1a", border: "1px solid #2e2a24" }}
                >
                  <span className="font-display text-lg font-light" style={{ color: "#f5f0e8" }}>{slot}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#d4a574" }} />
                </button>
              ))}
              <button
                onClick={() => setShowCustomTime(true)}
                className="btn-lift w-full mt-2 p-4 rounded-xl text-center font-mono text-[11px] tracking-widest uppercase"
                style={{ background: "transparent", color: "#807466", border: "1px dashed #3a342c" }}
              >
                Pick custom time →
              </button>
            </div>
          </div>
        )}

        {/* Custom time picker */}
        {showCustomTime && current && (
          <div className="absolute inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(10,9,8,0.7)" }} onClick={() => { setShowCustomTime(false); setShowSchedule(null); }}>
            <div className="w-full rounded-t-3xl p-6 pb-10 sheet-enter" style={{ background: "#1a1815", border: "1px solid #2e2a24" }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowCustomTime(false)}
                className="flex items-center gap-2 mb-4 font-mono text-[10px] tracking-widest uppercase"
                style={{ color: "#d4a574" }}
              >
                <ArrowLeft className="w-3 h-3" />
                Back to suggestions
              </button>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#3a342c" }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "#807466" }}>
                Pick a different time
              </div>
              {customTimeOptions.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSchedule(slot)}
                  className="btn-lift w-full mb-2 p-3.5 rounded-xl flex items-center justify-between"
                  style={{ background: "#211e1a", border: "1px solid #2e2a24" }}
                >
                  <span className="font-display text-base font-light" style={{ color: "#f5f0e8" }}>{slot}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#807466" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Snooze sheet */}
        {showSnooze && current && (
          <div className="absolute inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(10,9,8,0.7)" }} onClick={() => setShowSnooze(null)}>
            <div className="w-full rounded-t-3xl p-6 pb-10 sheet-enter" style={{ background: "#1a1815", border: "1px solid #2e2a24" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#3a342c" }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "#807466" }}>
                When should I bring this back?
              </div>
              <div className="text-xs italic mb-5" style={{ color: "#a89888" }}>
                Snooze {current.snoozeCount + 1} of 2 — after that, only Schedule or Dismiss.
              </div>
              {snoozeOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSnooze(opt)}
                  className="btn-lift w-full mb-2 p-4 rounded-xl flex items-center justify-between"
                  style={{ background: "#211e1a", border: "1px solid #2e2a24" }}
                >
                  <div className="text-left">
                    <div className="font-display text-base font-light" style={{ color: "#f5f0e8" }}>{opt.label}</div>
                    <div className="font-mono text-[10px] mt-0.5" style={{ color: "#807466" }}>{opt.hint}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "#d4a574" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sender mute toast */}
        {showSenderMute && (
          <div className="absolute bottom-8 left-6 right-6 z-40 rounded-xl p-4 flex items-center gap-3 toast-in"
            style={{ background: "#211e1a", border: "1px solid #3a342c", boxShadow: "0 12px 24px rgba(0,0,0,0.4)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#2a2620" }}>
              <Activity className="w-4 h-4" style={{ color: "#d4a574" }} />
            </div>
            <div className="flex-1">
              <div className="text-sm" style={{ color: "#f5f0e8", fontFamily: "'Fraunces', serif" }}>
                Mute similar from {showSenderMute}?
              </div>
              <div className="font-mono text-[10px] mt-0.5" style={{ color: "#807466" }}>
                3rd dismiss this month
              </div>
            </div>
            <button className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: "#d4a574", color: "#1a1815" }}>
              Mute
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, target }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "#1a1815", border: "1px solid #2a2620" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#9ec48a" }} />
        <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "#807466" }}>
          {label}
        </div>
      </div>
      <div className="font-display text-2xl font-light" style={{ color: "#f5f0e8" }}>
        {value}
      </div>
      <div className="font-mono text-[10px] mt-1" style={{ color: "#807466" }}>
        target {target}
      </div>
    </div>
  );
}
