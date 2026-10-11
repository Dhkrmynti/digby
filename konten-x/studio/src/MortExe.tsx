import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const WIN = "#c9c2d6";
const WIN_DARK = "#6e6680";
const TITLE = "#3b1f5c";

type MortExeProps = { readonly burned: number; readonly goalPct: number; readonly graves: number };

const Bevel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; inset?: boolean }> = ({ children, style, inset }) => (
  <div
    style={{
      background: WIN,
      borderTop: `4px solid ${inset ? WIN_DARK : "#fff"}`,
      borderLeft: `4px solid ${inset ? WIN_DARK : "#fff"}`,
      borderBottom: `4px solid ${inset ? "#fff" : C.ink}`,
      borderRight: `4px solid ${inset ? "#fff" : C.ink}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ═════════ 48 · MORT.EXE: burying $GRAVE to 5% (1080×1350) ═════════ */
export const PostMortExe: React.FC<MortExeProps> = ({ burned, goalPct, graves }) => {
  const progress = Math.min(100, (burned / ((goalPct / 100) * 1e9)) * 100);
  const toGo = Math.max(0, (goalPct / 100) * 1e9 - burned);
  const blocks = 24;
  const filled = Math.floor((progress / 100) * blocks);
  return (
    <AbsoluteFill>
      <Night glow={0.7} />
      <Motes count={26} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 86, lineHeight: 1, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>Mort is installing</div>
        <div style={{ fontFamily: sign, fontSize: 86, lineHeight: 1.05, color: C.bulb, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>5% buried.</div>
      </div>

      {/* the dialog */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 330 }}>
        <Bevel style={{ padding: 8, boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9)" }}>
          <div style={{ background: `linear-gradient(90deg, ${TITLE}, #7a2a6e)`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <GraveMark size={34} />
              <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, color: "#fff" }}>MORT.EXE</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["_", "□", "×"].map((g) => (
                <Bevel key={g} style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.ink }}>
                  {g}
                </Bevel>
              ))}
            </div>
          </div>

          <div style={{ padding: "34px 36px 30px", color: C.ink }}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
              <Headstone width={110} height={130} shape={0} style={{ paddingTop: 40, flexShrink: 0 }}>
                <div style={{ fontFamily: display, fontSize: 14 }}>R.I.P.</div>
              </Headstone>
              <div>
                <div style={{ fontFamily: body, fontWeight: 700, fontSize: 38, lineHeight: 1.15 }}>Burying $GRAVE to {goalPct}%…</div>
                <div style={{ fontFamily: mono, fontSize: 26, marginTop: 14 }}>
                  {fmt(burned)} of {fmt((goalPct / 100) * 1e9)} buried
                </div>
                <div style={{ fontFamily: mono, fontSize: 26, marginTop: 6 }}>
                  Remaining: <b>{fmt(toGo)} $GRAVE</b>
                </div>
              </div>
            </div>

            {/* the progress bar */}
            <Bevel inset style={{ marginTop: 30, padding: 6, background: "#fff" }}>
              <div style={{ display: "flex", gap: 5, height: 52 }}>
                {Array.from({ length: blocks }).map((_, i) => (
                  <div key={i} style={{ flex: 1, background: i < filled ? C.sign : i === filled ? `linear-gradient(90deg, ${C.sign} 55%, transparent 55%)` : "transparent" }} />
                ))}
              </div>
            </Bevel>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontWeight: 700, fontSize: 30, marginTop: 14 }}>
              <span>{progress.toFixed(2)}%</span>
              <span>est. time remaining: one more scoop</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, marginTop: 30 }}>
              <Bevel style={{ padding: "12px 28px", fontFamily: mono, fontWeight: 700, fontSize: 26, color: WIN_DARK, textDecoration: "line-through" }}>Cancel</Bevel>
              <Bevel style={{ padding: "12px 28px", fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.ink, outline: `3px dashed ${C.ink}`, outlineOffset: -10 }}>Keep digging</Bevel>
            </div>
          </div>
        </Bevel>
      </div>

      {/* desktop icons */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 900, display: "flex", justifyContent: "space-between" }}>
        {[
          { label: "0x…dEaD", sub: `${fmt(burned)} items`, kind: "folder" },
          { label: "paper_hands.txt", sub: "0 KB", kind: "file" },
          { label: "Recycle Bin", sub: "empty. nothing comes back.", kind: "bin" },
        ].map((ic) => (
          <div key={ic.label} style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <svg width="96" height="80" viewBox="0 0 96 80">
              {ic.kind === "folder" ? (
                <>
                  <path d="M4 14 h30 l8 8 h50 v54 h-88 Z" fill={C.bulb} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
                  <path d="M38 40 v-8 a10 10 0 0 1 20 0 v28 h-20 Z" fill="#8f879a" stroke={C.ink} strokeWidth="3" />
                </>
              ) : ic.kind === "file" ? (
                <>
                  <path d="M24 4 h36 l14 14 v58 h-50 Z" fill="#f6eedd" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
                  <path d="M32 30 h30 M32 42 h30 M32 54 h20" stroke={C.ink} strokeWidth="3" />
                </>
              ) : (
                <>
                  <path d="M24 16 h48 l-6 60 h-36 Z" fill={WIN} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
                  <path d="M18 16 h60" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
                  <path d="M40 28 v40 M56 28 v40" stroke={C.ink} strokeWidth="3" />
                </>
              )}
            </svg>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.cream, marginTop: 8, background: "rgba(14,7,20,0.6)", padding: "2px 8px" }}>{ic.label}</div>
            <div style={{ fontFamily: mono, fontSize: 18, color: C.dust, marginTop: 4 }}>{ic.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 30, color: C.dust }}>
        burials can’t be cancelled. {graves} graves so far, every one on-chain.
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={46} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <MortEyes size={24} look={-0.4} />
      </div>
    </AbsoluteFill>
  );
};
