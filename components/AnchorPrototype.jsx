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
    <div className="min-h-screen w-full" style={{ background: "#F8F4F0", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .font-display { font-family: 'Source Serif 4', Georgia, serif; }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");
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

      <div className="max-w-md mx-auto min-h-screen relative" style={{ background: "#F8F4F0" }}>
        <div className="absolute inset-0 grain opacity-50 pointer-events-none mix-blend-multiply" />

        {/* Header */}
        <div className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#136342" }}>
              <Anchor className="w-4 h-4" style={{ color: "#FCF9F7" }} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-3xl font-semibold tracking-tight" style={{ color: "#051714" }}>Anchor</div>
              <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#757575" }}>
                Tuesday Edition · 7:42 AM
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar — newspaper section heads */}
        <div className="relative z-10 px-6 mb-6 flex gap-6 border-b" style={{ borderColor: "#E4DED8" }}>
          {[
            { id: "triage", label: "Triage", count: items.length },
            { id: "snoozed", label: "Snoozed", count: snoozedQueue.length },
            { id: "summary", label: "Week", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="font-mono text-[10px] tracking-widest uppercase pb-2.5 pt-1 transition-all flex items-center gap-1.5 relative"
              style={{
                color: view === tab.id ? "#051714" : "#757575",
                borderBottom: view === tab.id ? "2px solid #136342" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{
                  background: view === tab.id ? "#136342" : "#E4DED8",
                  color: view === tab.id ? "#FCF9F7" : "#343434",
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
                <div className="font-display text-3xl font-light leading-none" style={{ color: "#051714" }}>
                  Morning triage
                </div>
                <div className="font-mono text-xs" style={{ color: "#757575" }}>
                  {decisions.length}/{decisions.length + items.length}
                </div>
              </div>
              <div className="text-sm italic" style={{ color: "#343434" }}>
                {items.length > 0
                  ? `${items.length} commitment${items.length > 1 ? 's' : ''} from yesterday. ~${items.length * 15} seconds.`
                  : "All clear. Coffee's still hot."}
              </div>

              <div className="flex gap-1.5 mt-4">
                {[...Array(decisions.length + items.length)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{ background: i < decisions.length ? "#136342" : "#E4DED8" }}
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
                    background: "#FCF9F7",
                    border: "1px solid #E4DED8",
                    boxShadow: "0 1px 2px rgba(5,23,20,0.06), 0 8px 24px rgba(5,23,20,0.08)",
                  }}
                >
                  {current.snoozeCount > 0 && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: "#dcefe5", border: "1px solid #136342" }}>
                      <Clock className="w-3 h-3" style={{ color: "#136342" }} />
                      <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#136342" }}>
                        Snoozed Friday → today · {current.snoozeCount} of 2 used
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
                      <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#757575" }}>
                        {current.sourceDetail}
                      </div>
                      <div className="font-mono text-[11px]" style={{ color: "#343434" }}>
                        {current.sourceFrom}
                      </div>
                    </div>
                  </div>

                  {current.transcript && (
                    <div className="mb-3 px-3 py-2 rounded-md text-xs italic" style={{ background: "#eef0e3", color: "#136342", border: "1px solid #a8d4be", fontFamily: "'Source Serif 4', serif" }}>
                      <span className="font-mono text-[9px] tracking-widest uppercase mr-2" style={{ color: "#15715f" }}>Whisper</span>
                      {current.transcript}
                    </div>
                  )}

                  <div className="font-display text-2xl font-light leading-snug mb-6" style={{ color: "#051714" }}>
                    {current.text}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowSchedule(current.id)}
                      className="btn-lift py-3.5 rounded-md"
                      style={{ background: "#136342", color: "#FCF9F7" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Calendar className="w-4 h-4" strokeWidth={2.2} />
                        <span className="font-mono text-[10px] tracking-widest uppercase font-medium">Schedule</span>
                      </div>
                    </button>

                    <button
                      onClick={() => current.snoozeCount < 2 ? setShowSnooze(current.id) : null}
                      disabled={current.snoozeCount >= 2}
                      className="btn-lift py-3.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "transparent", color: "#136342", border: "1px solid #bdb5ad" }}
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
                      className="btn-lift py-3.5 rounded-md"
                      style={{ background: "transparent", color: "#343434", border: "1px solid #bdb5ad" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <X className="w-4 h-4" strokeWidth={2.2} />
                        <span className="font-mono text-[10px] tracking-widest uppercase font-medium">Dismiss</span>
                      </div>
                    </button>
                  </div>

                  {current.snoozeCount === 1 && (
                    <div className="mt-3 text-center font-mono text-[10px]" style={{ color: "#757575" }}>
                      After 2 snoozes, only Schedule or Dismiss
                    </div>
                  )}
                </div>

                {items.length > 1 && (
                  <>
                    <div className="absolute inset-x-3 -bottom-2 h-4 rounded-b-2xl -z-10" style={{ background: "#FCF9F7", border: "1px solid #E4DED8", borderTop: "none" }} />
                    {items.length > 2 && (
                      <div className="absolute inset-x-6 -bottom-4 h-4 rounded-b-2xl -z-20" style={{ background: "#f0ebe4", border: "1px solid #E4DED8", borderTop: "none" }} />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-16 fade-in">
                <div className="font-display text-5xl font-light mb-4" style={{ color: "#136342" }}>
                  Done.
                </div>
                <div className="text-base italic mb-8" style={{ color: "#343434" }}>
                  {scheduledCount} scheduled · {snoozedCount} snoozed · {dismissedCount} dismissed
                </div>
                <button
                  onClick={() => setView("summary")}
                  className="btn-lift font-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-full"
                  style={{ background: "#136342", color: "#FCF9F7" }}
                >
                  See your week →
                </button>
                <button
                  onClick={reset}
                  className="block mx-auto mt-4 font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "#757575" }}
                >
                  Replay demo
                </button>
              </div>
            )}

            {current && (
              <div className="mt-10 py-6 border-y text-center relative" style={{ borderColor: "#bdb5ad" }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 font-mono text-[9px] tracking-widest uppercase" style={{ background: "#F8F4F0", color: "#757575" }}>
                  ¶
                </div>
                <div className="text-base italic leading-snug" style={{ color: "#343434", fontFamily: "'Source Serif 4', serif" }}>
                  &ldquo;A todo without a time is a wish.&rdquo;
                </div>
              </div>
            )}
          </div>
        )}

        {/* Snoozed view */}
        {view === "snoozed" && (
          <div className="relative z-10 px-6 pb-12 fade-in">
            <div className="mb-6">
              <div className="font-display text-3xl font-light leading-none mb-2" style={{ color: "#051714" }}>
                Waiting room
              </div>
              <div className="text-sm italic" style={{ color: "#343434" }}>
                {snoozedQueue.length} commitment{snoozedQueue.length !== 1 ? 's' : ''} on a re-check date.
                Each one comes back to you.
              </div>
            </div>

            {snoozedQueue.length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={{ border: "1px dashed #E4DED8" }}>
                <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: "#bdb5ad" }} />
                <div className="font-display text-lg font-light mb-1" style={{ color: "#757575" }}>
                  Nothing in the waiting room.
                </div>
                <div className="text-xs" style={{ color: "#757575" }}>
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
                        background: "#FCF9F7",
                        border: "1px solid #E4DED8",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: itemCfg.bg }}>
                          <itemCfg.Icon className="w-3.5 h-3.5" style={{ color: itemCfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "#757575" }}>
                            {item.sourceFrom}
                          </div>
                          <div className="font-display text-base font-light leading-snug mb-3" style={{ color: "#051714" }}>
                            {item.text}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "#ffffff" }}>
                              <Clock className="w-2.5 h-2.5" style={{ color: "#136342" }} />
                              <span className="font-mono text-[10px]" style={{ color: "#136342" }}>
                                Returns {item.returnsOn}
                              </span>
                            </div>
                            <div className="font-mono text-[10px]" style={{ color: "#757575" }}>
                              {item.daysUntil}d · snooze {item.snoozeCount}/2
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => bringBackSnoozed(item)}
                              className="btn-lift font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full"
                              style={{ background: "#E4DED8", color: "#136342", border: "1px solid #bdb5ad" }}
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

            <div className="mt-8 p-4 rounded-xl" style={{ background: "#ffffff", border: "1px solid #E4DED8" }}>
              <div className="flex items-start gap-2">
                <div className="w-1 h-full min-h-[40px] rounded-full" style={{ background: "#136342" }} />
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#757575" }}>
                    The waiting room rule
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "#343434", fontFamily: "'Source Serif 4', serif" }}>
                    Anchor doesn't keep a list of "things to do someday." Snoozed items have a return date. After 2 snoozes, only Schedule or Dismiss. <span className="italic" style={{ color: "#757575" }}>The calendar is your list.</span>
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
              <div className="font-display text-3xl font-light leading-none mb-2" style={{ color: "#051714" }}>
                This week
              </div>
              <div className="text-sm italic" style={{ color: "#343434" }}>
                Sunday review · cohort dashboard
              </div>
            </div>

            <div className="rounded-2xl p-5 mb-4 list-enter" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#136342" }}>
                Triage history · 7 days
              </div>
              <HistoryChart data={weekHistory} />
            </div>

            <div className="rounded-2xl p-5 mb-4 list-enter" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#136342" }}>
                Terminal-state rate · 7-day · NSM
              </div>
              <div className="flex items-baseline gap-3 mb-1">
                <div className="font-display text-5xl font-light" style={{ color: "#051714" }}>
                  {Math.max(terminalRate, 78)}<span className="text-2xl" style={{ color: "#757575" }}>%</span>
                </div>
                <div className="font-mono text-[11px]" style={{ color: "#15715f" }}>↑ 4 vs last week</div>
              </div>
              <div className="text-xs" style={{ color: "#757575" }}>Target 70%+ · above target</div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "#E4DED8" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(terminalRate, 78)}%`, background: "linear-gradient(90deg, #136342, #57B98E)" }} />
              </div>
            </div>

            <div className="rounded-2xl p-5 mb-4 list-enter stagger-1" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#136342" }}>
                Coverage check · paired NSM
              </div>
              <div className="flex items-baseline gap-3">
                <div className="font-display text-5xl font-light" style={{ color: "#051714" }}>82<span className="text-2xl" style={{ color: "#757575" }}>%</span></div>
                <div className="font-mono text-[11px]" style={{ color: "#15715f" }}>↑ 2</div>
              </div>
              <div className="text-xs mt-1" style={{ color: "#757575" }}>Of real commitments — caught 10 of 12</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 list-enter stagger-2">
              <Metric label="Detection precision" value="96%" target="≥95%" />
              <Metric label="Snooze recovery" value="79%" target="≥75%" />
              <Metric label="WAT / MAU" value="58%" target="≥50%" />
              <Metric label="WhatsApp share" value="14%" target="≥10%" />
            </div>

            <div className="rounded-2xl p-5 list-enter stagger-3" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#757575" }}>
                Pre-committed actions · all clear
              </div>
              <div className="space-y-2 text-xs" style={{ color: "#343434" }}>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#15715f" }} />
                  <span>Detection above 90% — no ship freeze</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#15715f" }} />
                  <span>WhatsApp share above 10% — keep investing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#15715f" }} />
                  <span>Snooze recovery above 60% — cap stays at 2</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setView("triage"); reset(); }}
              className="mt-6 w-full font-mono text-[11px] tracking-widest uppercase py-3 rounded-full"
              style={{ background: "#E4DED8", color: "#136342", border: "1px solid #bdb5ad" }}
            >
              ← back to triage
            </button>
          </div>
        )}

        {/* Schedule sheet */}
        {showSchedule && current && !showCustomTime && (
          <div className="absolute inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(5,23,20,0.4)" }} onClick={() => setShowSchedule(null)}>
            <div className="w-full rounded-t-3xl p-6 pb-10 sheet-enter" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#bdb5ad" }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "#757575" }}>
                Suggested slots — based on your calendar
              </div>
              {current.suggestedSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSchedule(slot)}
                  className="btn-lift w-full mb-2 p-4 rounded-xl flex items-center justify-between"
                  style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}
                >
                  <span className="font-display text-lg font-light" style={{ color: "#051714" }}>{slot}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#136342" }} />
                </button>
              ))}
              <button
                onClick={() => setShowCustomTime(true)}
                className="btn-lift w-full mt-2 p-4 rounded-xl text-center font-mono text-[11px] tracking-widest uppercase"
                style={{ background: "transparent", color: "#757575", border: "1px dashed #bdb5ad" }}
              >
                Pick custom time →
              </button>
            </div>
          </div>
        )}

        {/* Custom time picker */}
        {showCustomTime && current && (
          <div className="absolute inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(5,23,20,0.4)" }} onClick={() => { setShowCustomTime(false); setShowSchedule(null); }}>
            <div className="w-full rounded-t-3xl p-6 pb-10 sheet-enter" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowCustomTime(false)}
                className="flex items-center gap-2 mb-4 font-mono text-[10px] tracking-widest uppercase"
                style={{ color: "#136342" }}
              >
                <ArrowLeft className="w-3 h-3" />
                Back to suggestions
              </button>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#bdb5ad" }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "#757575" }}>
                Pick a different time
              </div>
              {customTimeOptions.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSchedule(slot)}
                  className="btn-lift w-full mb-2 p-3.5 rounded-xl flex items-center justify-between"
                  style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}
                >
                  <span className="font-display text-base font-light" style={{ color: "#051714" }}>{slot}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#757575" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Snooze sheet */}
        {showSnooze && current && (
          <div className="absolute inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(5,23,20,0.4)" }} onClick={() => setShowSnooze(null)}>
            <div className="w-full rounded-t-3xl p-6 pb-10 sheet-enter" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#bdb5ad" }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "#757575" }}>
                When should I bring this back?
              </div>
              <div className="text-xs italic mb-5" style={{ color: "#343434" }}>
                Snooze {current.snoozeCount + 1} of 2 — after that, only Schedule or Dismiss.
              </div>
              {snoozeOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSnooze(opt)}
                  className="btn-lift w-full mb-2 p-4 rounded-xl flex items-center justify-between"
                  style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}
                >
                  <div className="text-left">
                    <div className="font-display text-base font-light" style={{ color: "#051714" }}>{opt.label}</div>
                    <div className="font-mono text-[10px] mt-0.5" style={{ color: "#757575" }}>{opt.hint}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "#136342" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sender mute toast */}
        {showSenderMute && (
          <div className="absolute bottom-8 left-6 right-6 z-40 rounded-xl p-4 flex items-center gap-3 toast-in"
            style={{ background: "#FCF9F7", border: "1px solid #bdb5ad", boxShadow: "0 1px 2px rgba(5,23,20,0.06), 0 8px 20px rgba(5,23,20,0.1)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E4DED8" }}>
              <Activity className="w-4 h-4" style={{ color: "#136342" }} />
            </div>
            <div className="flex-1">
              <div className="text-sm" style={{ color: "#051714", fontFamily: "'Source Serif 4', serif" }}>
                Mute similar from {showSenderMute}?
              </div>
              <div className="font-mono text-[10px] mt-0.5" style={{ color: "#757575" }}>
                3rd dismiss this month
              </div>
            </div>
            <button className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: "#136342", color: "#FCF9F7" }}>
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
    <div className="rounded-xl p-4" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#15715f" }} />
        <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "#757575" }}>
          {label}
        </div>
      </div>
      <div className="font-display text-2xl font-light" style={{ color: "#051714" }}>
        {value}
      </div>
      <div className="font-mono text-[10px] mt-1" style={{ color: "#757575" }}>
        target {target}
      </div>
    </div>
  );
}
