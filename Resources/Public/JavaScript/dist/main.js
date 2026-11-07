import ue from "@typo3/backend/storage/persistent.js";
import { LitElement as yr, html as D } from "lit";
import X from "@typo3/core/ajax/ajax-request.js";
import kr from "@typo3/backend/login-refresh.js";
import Qe from "@typo3/backend/notification.js";
import { sudoModeInterceptor as Ar } from "@typo3/backend/security/sudo-mode-interceptor.js";
import Tt from "@typo3/backend/modal.js";
import { FileStorageTree as $r } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as Sr } from "@typo3/backend/tree/page-tree.js";
import Be from "@typo3/backend/module-menu.js";
import { ModuleStateStorage as Er } from "@typo3/backend/storage/module-state-storage.js";
import oe from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as qr } from "@typo3/core/java-script-item-processor.js";
import Cr from "@typo3/backend/viewport.js";
import Xe, { ModifierKeys as bn } from "@typo3/backend/hotkeys.js";
const p = {
  active: "data-vperm-active",
  allows: "data-vperm-allows",
  area: "data-vperm-area",
  armed: "data-vperm-armed",
  arriving: "data-vperm-arriving",
  byKey: "data-vperm-by-key",
  choices: "data-vperm-choices",
  controls: "data-vperm-controls",
  elsewhere: "data-vperm-elsewhere",
  face: "data-vperm-face",
  field: "data-vperm-field",
  ground: "data-vperm-ground",
  group: "data-vperm-group",
  groups: "data-vperm-groups",
  handingOver: "data-vperm-handing-over",
  identify: "data-vperm-identify",
  inside: "data-vperm-inside",
  label: "data-vperm-label",
  leaving: "data-vperm-leaving",
  outOfReach: "data-vperm-out-of-reach",
  picked: "data-vperm-picked",
  settling: "data-vperm-settling",
  show: "data-vperm-show",
  still: "data-vperm-still",
  switch: "data-vperm-switch",
  toggle: "data-vperm-toggle",
  token: "data-vperm-token",
  toolbar: "data-vperm-toolbar",
  unseen: "data-vperm-unseen",
  unwrapping: "data-vperm-unwrapping",
  verdict: "data-vperm-verdict",
  viewAs: "data-vperm-view-as",
  waiting: "data-vperm-waiting"
}, l = {
  allowChoices: "vperm-allow-choices",
  allowChoose: "vperm-allow-choose",
  allowValue: "vperm-allow-value",
  allowed: "vperm-allowed",
  allowedFrom: "vperm-allowed-from",
  allowedGroup: "vperm-allowed-group",
  anchor: "vperm-anchor",
  areaCover: "vperm-area-cover",
  coin: "vperm-coin",
  coinTurned: "vperm-coin-turned",
  controlsOpen: "vperm-controls-open",
  face: "vperm-face",
  faceApply: "vperm-face-apply",
  faceBar: "vperm-face-bar",
  faceCancel: "vperm-face-cancel",
  faceChoice: "vperm-face-choice",
  faceCounted: "vperm-face-counted",
  faceEyebrow: "vperm-face-eyebrow",
  faceFoot: "vperm-face-foot",
  faceHint: "vperm-face-hint",
  faceMarked: "vperm-face-marked",
  facePick: "vperm-face-pick",
  facePreview: "vperm-face-preview",
  faceScroll: "vperm-face-scroll",
  faceSentence: "vperm-face-sentence",
  faceTally: "vperm-face-tally",
  faceWaiting: "vperm-face-waiting",
  fieldName: "vperm-field-name",
  fieldToken: "vperm-field-token",
  frame: "vperm-frame",
  head: "vperm-head",
  headBar: "vperm-head-bar",
  headButton: "vperm-head-button",
  justAdded: "vperm-just-added",
  leaveRoom: "vperm-leave-room",
  leaveUser: "vperm-leave-user",
  mark: "vperm-mark",
  markCard: "vperm-mark-card",
  mountAlready: "vperm-mount-already",
  mountContext: "vperm-mount-context",
  mountInherited: "vperm-mount-inherited",
  mountInside: "vperm-mount-inside",
  mountPicked: "vperm-mount-picked",
  mountTree: "vperm-mount-tree",
  mountUnseen: "vperm-mount-unseen",
  mountWhole: "vperm-mount-whole",
  naming: "vperm-naming",
  namingPath: "vperm-naming-path",
  namingRow: "vperm-naming-row",
  namingWhy: "vperm-naming-why",
  nothingTheirs: "vperm-nothing-theirs",
  otherKinds: "vperm-other-kinds",
  panelCard: "vperm-panel-card",
  panelCardTurned: "vperm-panel-card-turned",
  pickerCount: "vperm-picker-count",
  pickerDetail: "vperm-picker-detail",
  pickerHead: "vperm-picker-head",
  pickerHints: "vperm-picker-hints",
  pickerList: "vperm-picker-list",
  pickerPanes: "vperm-picker-panes",
  pickerRow: "vperm-picker-row",
  pickerTally: "vperm-picker-tally",
  showMenu: "vperm-show-menu",
  tab: "vperm-tab",
  tabAllow: "vperm-tab-allow",
  tabBar: "vperm-tab-bar",
  tabCard: "vperm-tab-card",
  tabLabel: "vperm-tab-label",
  tabSeam: "vperm-tab-seam",
  tableAllow: "vperm-table-allow",
  tableDisallow: "vperm-table-disallow",
  tableGate: "vperm-table-gate",
  tableName: "vperm-table-name",
  tableNote: "vperm-table-note",
  tableToken: "vperm-table-token",
  turning: "vperm-turning",
  typeSwitch: "vperm-type-switch",
  unseenPages: "vperm-unseen-pages",
  viewAsControls: "vperm-view-as-controls"
}, ie = {
  folderTree: "vperm-folder-tree",
  pageTree: "vperm-page-tree",
  picker: "vperm-picker"
};
function Lr(e) {
  return e.body.hasAttribute(p.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function Or(e) {
  e.body.setAttribute(p.handingOver, "");
}
function wn(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function yn(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function Nr(e, t) {
  const n = de(e);
  n !== null && e.addEventListener(
    "typo3-module-loaded",
    () => {
      n.setAttribute("endpoint", t);
    },
    { once: !0 }
  );
}
function mt(e) {
  return new URL(e.location.href).pathname.endsWith("/main") ? de(e)?.getAttribute("endpoint") ?? "" : e.location.href;
}
function de(e) {
  return e.querySelector("typo3-backend-module-router");
}
function ht(e) {
  const t = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(mt(e)));
  return t === null ? "" : t.slice(1).join(":");
}
function _r(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(mt(e)));
}
function kn(e) {
  const t = mt(e);
  if (t === "")
    return "";
  const n = new URL(t, e.location.origin), r = n.searchParams.get("returnUrl");
  if (r !== null) {
    const o = new URL(r, n.origin);
    return o.origin !== n.origin ? "" : (o.searchParams.delete("token"), o.href);
  }
  return n.searchParams.delete("token"), n.href;
}
let Ze = Promise.resolve();
function pe(e, t) {
  const n = document, r = Ze.then(async () => {
    Lr(n) || await ue.set(e, t);
  });
  return Ze = r.catch(() => {
  }), r;
}
function xr() {
  return Ze;
}
const An = "vperm.session", $n = 1, we = "modules", Pr = "fields", et = /* @__PURE__ */ new Set();
let T = Mr();
document.addEventListener("typo3-module-loaded", () => {
  Ue({ ...T, face: "preview" });
});
function b() {
  return T;
}
function E(e, t) {
  et.add(e), t?.addEventListener("abort", () => et.delete(e));
}
function Sn() {
  const e = T.groupId !== null, t = e ? Pr : T.area;
  fe({ ...T, active: e, open: T.open || e, area: t, picked: t });
}
function Fr() {
  fe({ ...T, open: !0 });
}
function Tr() {
  fe({ ...T, open: !1, active: !1 });
}
function En() {
  fe({ ...T, active: !1 });
}
function qn(e) {
  fe({ ...T, area: e, picked: e, face: "preview" });
}
function Ir(e) {
  Ue({ ...T, area: e });
}
function ce(e) {
  Ue({ ...T, face: e });
}
function gt(e) {
  fe({ ...T, groupId: e, active: T.active && e !== null });
}
function fe(e) {
  pe(An, {
    version: $n,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), Ue(e);
}
function Ue(e) {
  T = e;
  for (const t of et)
    t(T);
}
function Mr() {
  const e = ue.get(An);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: we, picked: we, face: "preview" };
  const t = e;
  if (String(t.version) !== String($n))
    return { open: !1, active: !1, groupId: null, area: we, picked: we, face: "preview" };
  const n = Number(t.groupId), r = typeof t.area == "string" && t.area !== "null" ? t.area : we;
  return {
    open: String(t.open) === "true",
    active: String(t.active) === "true",
    groupId: Number.isInteger(n) && n > 0 ? n : null,
    area: r,
    picked: r,
    face: "preview"
  };
}
function Dr(e) {
  const t = () => {
    It(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && It(n);
  };
  t(), E(t, e);
}
function It(e) {
  const t = b();
  if (e.toggleAttribute(p.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(p.active, t.active), !t.active) {
    e.removeAttribute(p.picked), e.removeAttribute(p.face);
    return;
  }
  e.setAttribute(p.picked, t.area), e.setAttribute(p.face, t.face);
}
const Rr = (e) => `${e}, .scaffold-modulemenu`;
function Cn(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Rr(".scaffold-sidebar"));
  if (r == null || o === null)
    return;
  const i = () => {
    r.style.flexBasis = "";
    const a = Ln(e), c = Number.parseFloat(getComputedStyle(t).marginInlineStart), u = o.getBoundingClientRect().right - a - r.getBoundingClientRect().left - c;
    u > 0 && (r.style.flexBasis = `${String(u)}px`);
  };
  i();
  const s = new ResizeObserver(i);
  s.observe(o), n.addEventListener("abort", () => {
    s.disconnect();
  });
}
const Ln = (e) => Number.parseFloat(getComputedStyle(e.body).getPropertyValue("--vperm-divider")) || 0;
function Br(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${p.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), Cn(e, r, t);
  const o = e.querySelector(`[${p.toolbar}]`), i = () => b().open || b().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), E(s, t), o?.addEventListener("click", () => {
    i() ? Tr() : Fr(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function je(e) {
  return JSON.parse(e.querySelector(`[${p.groups}]`)?.getAttribute(p.groups) ?? "{}");
}
function Z(e, t) {
  return je(e)[String(t)]?.title ?? null;
}
function g(e) {
  return TYPO3.lang[e] ?? "";
}
const On = 220, Ur = 1300;
function Ne(e, t) {
  const n = e.ownerDocument, r = n.createElement("span");
  r.className = l.faceTally;
  const o = N(n, l.faceCounted, ""), i = N(n, l.faceWaiting, "");
  r.append(o, i);
  const s = Y(n, g("platform.cancel"), `btn btn-default ${l.faceCancel}`, t.cancel), a = Y(n, t.label, `btn btn-primary ${l.faceApply}`, t.apply);
  return e.replaceChildren(r, s, a), {
    state: o,
    waiting: i,
    ready: (c, u) => {
      a.toggleAttribute("disabled", !c), s.toggleAttribute("disabled", !u);
    }
  };
}
function vt(e, t) {
  t !== "cancelled" && (e.state.textContent = g(`platform.${t}`));
}
function Nn(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = N(e, l.faceEyebrow, ""), o = N(e, l.faceSentence, ""), i = e.createElement("div");
  i.className = l.faceBar, i.append(r, o);
  const s = e.createElement("div");
  s.className = l.faceScroll;
  const a = e.createElement("div");
  return a.className = l.faceFoot, n.append(i, s, a), { sheet: n, bar: i, eyebrow: r, sentence: o, scroll: s, foot: a };
}
function _n(e) {
  const t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  let r = [];
  const o = () => {
    r.forEach((i) => {
      window.clearTimeout(i);
    }), r = [], n.clear();
  };
  return {
    add: (i) => {
      t.add(i);
    },
    delete: (i) => {
      t.delete(i);
    },
    isLit: (i) => n.has(i),
    start: (i) => {
      if (t.size === 0)
        return;
      o();
      const s = [...t];
      t.clear(), r.push(window.setTimeout(() => {
        s.forEach((a) => {
          n.add(a);
        }), i(), r.push(window.setTimeout(() => {
          s.forEach((a) => {
            n.delete(a);
          }), i();
        }, Ur));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function xn(e, t, n) {
  E(() => {
    b().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function bt(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !jr(e) && r();
  }, { signal: t });
}
const jr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
function Y(e, t, n, r, o) {
  const i = e.createElement("button");
  if (i.type = "button", i.className = n, i.textContent = t, i.addEventListener("click", r), o !== void 0) {
    const s = e.createElement("typo3-backend-icon");
    s.setAttribute("identifier", o), s.setAttribute("size", "small"), i.prepend(s, " ");
  }
  return i;
}
function N(e, t, n) {
  const r = e.createElement("span");
  return r.className = t, r.textContent = n, r;
}
function W(e, t, ...n) {
  return x(g(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function x(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, String(r)).replace("%s", String(r)),
    e
  );
}
const Mt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Wr(e, t, n, r) {
  const o = [e];
  let i = Mt(r, e) ? 2 : 0, s = e + 1;
  for (let a = 1; a < t.length; a += 1) {
    const c = n.indexOf(t.charAt(a), s);
    if (c === -1)
      return null;
    c === s && (i += 4), Mt(r, c) && (i += 2), o.push(c), s = c + 1;
  }
  return { score: e === 0 ? i + 2 : i, at: o };
}
function Dt(e, t) {
  if (e === "")
    return { score: 0, at: [] };
  const n = e.toLowerCase(), r = t.toLowerCase(), o = n.charAt(0);
  let i = null;
  for (let s = r.indexOf(o); s !== -1; s = r.indexOf(o, s + 1)) {
    const a = Wr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const Rt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Kr = 70, Ge = 50;
class Gr extends yr {
  // Stryker disable ObjectLiteral,BooleanLiteral: callers set these as properties, never as attributes
  static properties = {
    entries: { attribute: !1 },
    words: { attribute: !1 },
    placeholder: { type: String },
    remembers: { type: String },
    query: { state: !0 },
    active: { state: !0 },
    onDetail: { state: !0 },
    inPane: { state: !0 },
    state: { attribute: !1 }
  };
  settling = 0;
  trigger = null;
  // Stryker disable next-line ArrayDeclaration: read only once the picker has opened, which fills it
  watched = [];
  constructor() {
    super(), this.entries = [], this.placeholder = "", this.remembers = "", this.query = "", this.active = 0, this.onDetail = 0, this.inPane = !1, this.state = "ready", this.words = {
      countMany: "",
      totalOne: "",
      totalMany: "",
      move: "",
      take: "",
      close: "",
      clear: "",
      detail: "",
      loading: "",
      failed: "",
      retry: "",
      empty: ""
    };
  }
  get isOpen() {
    return this.hasAttribute("data-open") || this.matches(":popover-open");
  }
  // Matched on what names an entry, never on the note, so a word standing in every note
  // cannot match everyone.
  get matching() {
    if (this.query === "")
      return this.entries;
    const t = [...new Set(this.entries.map((n) => n.heading ?? ""))];
    return this.entries.map((n) => ({
      entry: n,
      band: t.indexOf(n.heading ?? ""),
      score: Dt(this.query, Rt(n))?.score ?? -1
    })).filter((n) => n.score >= 0).sort((n, r) => n.band - r.band || r.score - n.score).map((n) => n.entry);
  }
  get found() {
    return this.matching.slice(0, Ge);
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("popover", "manual"), this.addEventListener("keydown", (t) => {
      this.steer(t);
    }), this.addEventListener("pointermove", () => {
      this.toggleAttribute(p.byKey, !1);
    }), this.addEventListener("toggle", () => {
      this.trigger?.setAttribute("aria-expanded", String(this.isOpen)), this.isOpen || (this.stopWatching(), this.remember());
    });
  }
  createRenderRoot() {
    return this;
  }
  openedBy(t) {
    if (this.isOpen) {
      this.close();
      return;
    }
    this.trigger = t, this.query === "" && (this.query = this.kept()), this.active = 0, this.onDetail = 0, this.inPane = !1;
    const n = t.getBoundingClientRect();
    this.showPopover(), this.watchForDismissal(), this.style.top = `${String(n.bottom + 6)}px`, this.style.left = `${String(Math.max(16, n.right - this.offsetWidth))}px`, this.querySelector("input")?.focus();
  }
  render() {
    const t = this.found;
    return D`
      <div class="input-group input-group-sm">
        <span class="input-group-text" aria-hidden="true">
          <typo3-backend-icon identifier="actions-search" size="small"></typo3-backend-icon>
        </span>
        <input type="search" class="form-control" autocomplete="off" .value=${this.query}
               placeholder=${this.placeholder} aria-label=${this.placeholder}
               aria-activedescendant=${this.activeId()}
               @input=${(n) => {
      this.query = n.target.value, this.inPane = !1, this.active = 0;
    }}>
      </div>
      <div class=${l.pickerPanes}>
      <div class=${l.pickerList} role="listbox" tabindex="-1">
        ${this.nothingToShow(t)}
        ${this.state !== "ready" ? "" : t.map((n, r) => {
      const o = Dt(this.query, Rt(n))?.at ?? [];
      return D`
          ${this.headingBefore(n, t[r - 1])}
          <div role="option" id=${this.rowId(r)} data-id=${n.id}
               aria-selected=${r === this.active}
               @mouseenter=${() => {
        this.settleOn(r);
      }}
               @mouseleave=${() => {
        this.stopSettling();
      }}
               @click=${() => {
        this.take(n.id);
      }}>
            <span>${this.marked(o, n.title, 0)}</span>
            <span>${this.marked(o, n.subtitle, n.title.length + 1)} ${n.note}</span>
          </div>
        `;
    })}
      </div>
      ${this.detailPane()}
      </div>
      <p class=${l.pickerCount}>
        <span class=${l.pickerHints}>
          <span><kbd>↑</kbd><kbd>↓</kbd> ${this.words.move}</span>
          <span><kbd>⇥</kbd> ${this.words.detail}</span>
          <span><kbd>↵</kbd> ${this.words.take}</span>
          <span><kbd>esc</kbd> ${this.query === "" ? this.words.close : this.words.clear}</span>
        </span>
        <span class=${l.pickerTally}>${this.counted()}</span>
      </p>
    `;
  }
  kept() {
    const t = ue.get(this.remembers);
    return typeof t == "string" ? t : "";
  }
  remember() {
    this.remembers !== "" && pe(this.remembers, this.query);
  }
  nothingToShow(t) {
    return this.state === "loading" ? D`<p>${this.words.loading}</p>` : this.state === "failed" ? D`
        <p>${this.words.failed}</p>
        <button type="button" class="btn btn-default btn-sm"
                @click=${() => {
      this.dispatchEvent(new CustomEvent("vperm:retry"));
    }}>
          ${this.words.retry}
        </button>
      ` : t.length === 0 ? D`<p>${this.words.empty}</p>` : "";
  }
  activeId() {
    return this.inPane ? this.detailId(this.onDetail) : this.rowId(this.active);
  }
  counted() {
    if (this.state !== "ready")
      return "";
    const t = this.matching.length;
    return t <= Ge ? (t === 1 ? this.words.totalOne : this.words.totalMany).replace("%d", String(t)) : this.words.countMany.replace("%d", String(Ge)).replace("%d", String(t));
  }
  detailPane() {
    const t = this.found[this.active];
    return t === void 0 ? D`` : D`
      <div class=${l.pickerDetail}>
        <div class=${l.pickerHead}>
          <strong>${t.title}</strong>
          <p>${t.detailHeading}</p>
        </div>
        <div role="listbox" tabindex="-1">
          ${t.detail.map((n, r) => D`
            <div role="option" id=${this.detailId(r)} class=${l.pickerRow}
                 data-id=${n.id} aria-selected=${this.inPane && r === this.onDetail}
                 style="--vperm-picker-depth: ${String(n.depth)}"
                 @click=${() => {
      this.takeDetail(n.id);
    }}>
              ${n.title}
            </div>
          `)}
        </div>
      </div>
    `;
  }
  // Stryker disable next-line BlockStatement: the row and the field read this name back off the same call
  detailId(t) {
    return `vperm-picker-detail-${String(t)}`;
  }
  settleOn(t) {
    this.hasAttribute(p.byKey) || (this.stopSettling(), this.settling = window.setTimeout(() => {
      this.active = t, this.inPane = !1;
    }, Kr));
  }
  stopSettling() {
    window.clearTimeout(this.settling);
  }
  steer(t) {
    const n = this.found[this.active]?.detail ?? [];
    if (t.key === "Tab" && !t.shiftKey && !this.inPane && n.length > 0) {
      t.preventDefault(), this.inPane = !0, this.onDetail = 0;
      return;
    }
    if (t.key === "Tab" && t.shiftKey && this.inPane) {
      t.preventDefault(), this.inPane = !1;
      return;
    }
    if (t.key === "Enter") {
      const o = this.inPane ? n[this.onDetail]?.id : this.found[this.active]?.id;
      o !== void 0 && (t.preventDefault(), this.inPane ? this.takeDetail(o) : this.take(o));
      return;
    }
    if (t.key !== "ArrowDown" && t.key !== "ArrowUp")
      return;
    t.preventDefault(), this.toggleAttribute(p.byKey, !0);
    const r = t.key === "ArrowDown" ? 1 : -1;
    this.inPane ? this.onDetail = Math.min(Math.max(this.onDetail + r, 0), n.length - 1) : this.active = Math.min(Math.max(this.active + r, 0), this.found.length - 1), this.updateComplete.then(() => {
      this.querySelector(`#${this.activeId()}`)?.scrollIntoView({ block: "nearest" });
    });
  }
  takeDetail(t) {
    this.close(), this.dispatchEvent(new CustomEvent("vperm:detail-picked", { detail: { id: t } }));
  }
  // The component holds the field; the slice never hears a keystroke: an entry carries its heading at all times
  headingBefore(t, n) {
    const r = t.heading ?? "";
    return r === "" || r === n?.heading ? D`` : D`<p class="dropdown-header">${r}</p>`;
  }
  rowId(t) {
    return `vperm-picker-row-${String(t)}`;
  }
  dismiss = (t) => {
    const n = t.target;
    n === null || this.contains(n) || this.trigger?.contains(n) === !0 || this.hidePopover();
  };
  escape = (t) => {
    if (t.key === "Escape") {
      if (t.preventDefault(), this.query === "") {
        this.close();
        return;
      }
      this.query = "", this.active = 0, this.inPane = !1;
    }
  };
  watchForDismissal() {
    this.watched = this.everyDocument();
    for (const t of this.watched)
      t.addEventListener("pointerdown", this.dismiss), t.addEventListener("keydown", this.escape);
  }
  everyDocument() {
    const t = [...this.ownerDocument.querySelectorAll("iframe")].map((n) => n.contentDocument).filter((n) => n !== null);
    return [this.ownerDocument, ...t];
  }
  // Stryker disable BlockStatement,StringLiteral,ArrayDeclaration: the picker is already closed; letting go of the listeners only frees the page
  stopWatching() {
    for (const t of this.watched)
      t.removeEventListener("pointerdown", this.dismiss), t.removeEventListener("keydown", this.escape);
    this.watched = [];
  }
  // Stryker restore BlockStatement,StringLiteral,ArrayDeclaration
  close() {
    this.hidePopover(), this.trigger?.focus();
  }
  take(t) {
    this.close(), this.dispatchEvent(new CustomEvent("vperm:picked", { detail: { id: t } }));
  }
  marked(t, n, r) {
    const o = t.filter((a) => a >= r && a < r + n.length).map((a) => a - r);
    if (o.length === 0)
      return D`${n}`;
    const i = [];
    let s = 0;
    for (let a = 0; a < o.length; ) {
      let c = a;
      for (; c + 1 < o.length && o[c + 1] === (o[c] ?? 0) + 1; )
        c += 1;
      const u = o[a] ?? 0, d = (o[c] ?? 0) + 1;
      i.push(D`${n.slice(s, u)}<mark>${n.slice(u, d)}</mark>`), s = d, a = c + 1;
    }
    return D`${i}${n.slice(s)}`;
  }
}
customElements.get(ie.picker) === void 0 && customElements.define(ie.picker, Gr);
function Pn(e, t) {
  const n = e.createElement(ie.picker);
  return n.words = {
    ...t,
    countMany: g("platform.picker.count"),
    move: g("platform.picker.key.move"),
    close: g("platform.picker.key.close"),
    clear: g("platform.picker.key.clear"),
    retry: g("platform.picker.retry"),
    empty: g("platform.picker.empty")
  }, n;
}
const zr = "vperm.groupSearch", Fn = "vperm.recentGroups", Vr = 3;
function Hr(e, t) {
  const n = e.querySelector(`[${p.group}]`);
  if (n === null)
    return;
  const r = Pn(e, {
    totalOne: g("pickAGroup.total.one"),
    totalMany: g("pickAGroup.total.many"),
    take: g("pickAGroup.key.take"),
    detail: g("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  let o = Yr(e);
  r.entries = Bt(e, o), r.remembers = zr, r.placeholder = g("pickAGroup.search"), e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n);
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = Z(e, b().groupId) ?? i;
  };
  s(), E(s, t), E(() => {
    const { groupId: u } = b();
    u !== null && o[0] !== u && (o = [u, ...o.filter((d) => d !== u)], pe(Fn, o)), r.entries = Bt(e, o);
  }, t);
  const c = (u) => {
    gt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Yr(e) {
  const t = je(e);
  return [ue.get(Fn)].flat().map(String).filter((n) => n in t).map(Number);
}
function Bt(e, t) {
  const n = Object.entries(je(e)), r = t.filter((s) => s !== b().groupId).slice(0, Vr), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
  return [
    ...o.map(([s, a]) => Ut(s, a, g("pickAGroup.recent"))),
    ...i.map(([s, a]) => Ut(s, a, g("pickAGroup.all")))
  ];
}
function Ut(e, t, n) {
  return {
    id: e,
    heading: n,
    title: t.title,
    subtitle: t.disabled ? g("pickAGroup.disabled") : "",
    note: Jr(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: g(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function Jr(e) {
  return e === 0 ? "" : W("pickAGroup.inherits", e, e);
}
const Tn = (e) => `vperm:${e}`;
function J(e, t) {
  document.dispatchEvent(new CustomEvent(Tn(e), { detail: t }));
}
function G(e, t, n) {
  document.addEventListener(
    Tn(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function Qr() {
  const e = /* @__PURE__ */ new Set();
  return {
    listen: (t, n) => {
      n.aborted || (e.add(t), n.addEventListener("abort", () => {
        e.delete(t);
      }));
    },
    tell: (t) => {
      e.forEach((n) => {
        n(t);
      });
    }
  };
}
const In = Qr();
function M(e, t) {
  In.listen(e, t);
}
function jt(e) {
  In.tell(e);
}
function B(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
const I = {
  allow_fields: "visual_permissions_allow_fields",
  allow_file_operations: "visual_permissions_allow_file_operations",
  allow_modules: "visual_permissions_allow_modules",
  allow_page_types: "visual_permissions_allow_page_types",
  allow_tables: "visual_permissions_allow_tables",
  allow_values: "visual_permissions_allow_values",
  file_operations: "visual_permissions_file_operations",
  folder_tree: "visual_permissions_folder_tree",
  inspect: "visual_permissions_inspect",
  mount_folders: "visual_permissions_mount_folders",
  mount_pages: "visual_permissions_mount_pages",
  open_document: "visual_permissions_open_document",
  other_permissions: "visual_permissions_other_permissions",
  view_as_user: "visual_permissions_view_as_user",
  viewable_users: "visual_permissions_viewable_users",
  write_other_permissions: "visual_permissions_write_other_permissions"
};
let tt = 0;
async function ee(e, t) {
  return tt += 1, new X(B(e)).addMiddleware(Ar).post(t).then(Wt, Wt).finally(() => {
    tt -= 1;
  });
}
function wt() {
  return tt > 0;
}
function Wt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (kr.checkActiveSession(), "loggedOut") : Xr(t.status);
  } catch {
    return "failed";
  }
}
function Xr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function yt(e, t = []) {
  return kt(new X(B(I.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function We() {
  let e = 0;
  return {
    inspect: async (t, n) => {
      const r = ++e, o = await yt(t, n);
      return r === e ? o : null;
    },
    // Stryker disable next-line AssignmentOperator: counting down works as well, since only "is this still the newest" is asked
    drop: () => {
      e += 1;
    }
  };
}
async function Mn(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await (await new X(B(I.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()).resolve()).url ?? "";
}
async function kt(e) {
  try {
    return await (await e).resolve();
  } catch {
    return Qe.error(g("platform.notRead")), null;
  }
}
const At = ["allowed", "allowedAndInherited", "inherited"], Zr = ["allowed", "denied"], V = "allowed", me = "denied", $t = "inherited", St = "allowedAndInherited", Ke = "adminOnly";
function K(e) {
  return At.some((t) => t === e);
}
const eo = [...At, me];
function Et(e) {
  return Zr.includes(e);
}
function Me(e) {
  return e.substring(0, e.indexOf(":"));
}
function to(e) {
  return e.substring(e.indexOf(":") + 1);
}
const Q = {};
function no(e, t) {
  Q.tables = e, t.addEventListener("abort", () => {
    delete Q.tables;
  });
}
function ro(e, t) {
  Q.fields = e, t.addEventListener("abort", () => {
    delete Q.fields;
  });
}
function oo(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${p.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(p.unseen);
  });
  const { active: n, area: r, face: o } = b();
  !n || r !== "fields" || (Q.tables?.hide(e, t, o), Q.fields?.hide(e, t, o), Kt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${p.verdict}]`)].some((a) => a.closest(`[${p.unseen}]`) === null) || $e(i);
  }), Kt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${p.unseen}])`) === null && ($e(i), $e(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), io(e), o === "preview" && so(e, t));
}
function $e(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(p.unseen, "");
}
function Kt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${p.verdict}]`)?.querySelector(`[${p.verdict}]`) !== null);
}
function io(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(p.unseen) === !0 && e.querySelector(`.nav-item:not([${p.unseen}]) [data-typo3-tab]`)?.click();
}
function so(e, { tables: t, named: n }) {
  if (e.querySelector(`.form-section:not([${p.unseen}])`) !== null)
    return;
  const r = ao(e), o = t[r], s = (K(o) ? Q.fields : Q.tables)?.explain(e, r, o, n[r] ?? r);
  s !== void 0 && (s.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(s));
}
function ao(e) {
  const n = e.querySelector(`[${p.token}][${p.inside}='']`)?.getAttribute(p.token) ?? "";
  return Me(n);
}
function lo(e, t) {
  let n = null;
  const r = We();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null;
  const i = () => {
    n !== null && oo(n.doc, { tables: o?.targets ?? {}, named: o?.named ?? {} });
  }, s = async () => {
    if (n === null)
      return;
    const { fields: c } = n, { active: u, groupId: d } = b();
    if (!u || d === null) {
      r.drop(), c.forEach(([f]) => {
        f.removeAttribute(p.verdict), f.removeAttribute(p.outOfReach);
      }), o = null, i();
      return;
    }
    const m = [...new Set(c.map(([, f]) => Me(f)))], v = await r.inspect(d, m);
    if (v === null)
      return;
    const { scopes: h } = v;
    e.take(v), c.forEach(([f, w]) => {
      const y = h.fields.targets[w];
      y !== void 0 && f.setAttribute(p.verdict, y), f.toggleAttribute(p.outOfReach, !K(h.tablesModify.targets[Me(w)]));
    }), o = h.tablesModify, i(), J("fields-judged", {});
  };
  M(({ doc: c, fields: u }) => {
    r.drop(), c.body.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`);
    const d = u.flatMap((m) => {
      const v = m.getAttribute(p.token);
      return v === null ? [] : [[m, v]];
    });
    n = d.length === 0 ? null : { doc: c, fields: d }, o = null, s();
  }, t), G("permissions-written", () => void s(), t);
  let a = null;
  E(({ active: c, groupId: u }) => {
    const d = `${String(c)}:${String(u)}`;
    if (d === a) {
      i();
      return;
    }
    a = d, s();
  }, t);
}
function co() {
  let e = null, t = /* @__PURE__ */ new WeakSet();
  const n = () => {
    const { groupId: r } = b();
    return r !== e && (t = /* @__PURE__ */ new WeakSet(), e = r), t;
  };
  return {
    has: (r) => n().has(r),
    toggle: (r) => {
      const o = n();
      if (o.has(r)) {
        o.delete(r);
        return;
      }
      o.add(r);
    },
    drop: () => {
      t = /* @__PURE__ */ new WeakSet();
    }
  };
}
function uo() {
  let e = [], t = {};
  return {
    allowedBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.allowedBy;
    }
  };
}
const Dn = (e) => e.map((t) => `[${p.verdict}='${t}']:not([${p.outOfReach}])`).join(","), po = (e) => Dn(e === "pick" ? eo : At), nt = (e) => Dn([e === "pick" ? me : V]), fo = `.${l.anchor}[${p.verdict}]`, mo = (e, t, n) => {
  const r = K(e.getAttribute(p.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(po(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(nt(n)),
    waiting: t ? g(n === "pick" ? "platform.toAllow" : "allowFields.toDisallow") : ""
  };
}, ho = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function go(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(p.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (ho(n), t.waiting === "") {
      n.removeAttribute(p.waiting);
      return;
    }
    n.setAttribute(p.waiting, t.waiting);
  }
}
function vo(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = b();
    n.querySelectorAll(fo).forEach((a) => {
      go(a, mo(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabAllow}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const d = () => [...c.querySelectorAll(`[${p.inside}='']`)].filter((v) => v.matches(nt(a)) && !e.has(v)), m = u ?? i(s, c, d);
      m.disabled = d().length === 0;
    });
  }, i = (s, a, c) => {
    const u = s.createElement("button");
    return u.type = "button", u.className = `btn btn-default btn-sm ${l.tabAllow}`, u.textContent = g("allowFields.allowTab"), u.addEventListener("click", () => {
      c().forEach((d) => {
        e.toggle(d);
      }), r();
    }), a.querySelector(":scope > .form-section")?.prepend(u), u;
  };
  M((s) => {
    const a = s.doc === n;
    if (n = s.doc, r(), a)
      return;
    const c = (u) => {
      const d = u.target, m = d.closest(`.${l.mark}`) === null ? d.closest(nt(b().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), G("fields-judged", r, t), E(r, t);
}
async function bo(e, t) {
  return ee(I.allow_fields, { group: e, operations: [...t] });
}
const Gt = 280;
function Se(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, Gt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, Gt * 2);
}
const zt = `[${p.verdict}]:not([${p.outOfReach}])`, wo = [me, Ke].map((e) => `:not([${p.verdict}='${e}'])`).join("");
function yo(e, t) {
  let n = null, r = null;
  const o = () => {
    if (n === null)
      return;
    const a = n.querySelector('form[name="editform"]');
    if (a === null)
      return;
    const { active: c, area: u, face: d, groupId: m } = b(), v = c && u === "fields";
    if (v && r?.form === a && r.face === d && r.groupId === m) {
      r.showCount();
      return;
    }
    n.querySelectorAll(`.${l.faceFoot}`).forEach((h) => {
      h.remove();
    }), r = null, v && a.querySelector(zt) !== null && m !== null && (r = { form: a, face: d, groupId: m, showCount: i(a, d === "pick", m) });
  }, i = (a, c, u) => {
    let d = null;
    const m = a.ownerDocument.createElement("div");
    m.className = l.faceFoot;
    const v = () => [...a.querySelectorAll(`[${p.token}]`)].filter((y) => e.has(y)), h = () => {
      if (!c) {
        ce("preview");
        return;
      }
      Se(a.ownerDocument, () => {
        ce("preview");
      });
    }, f = Ne(m, {
      label: g(c ? "platform.doAllow" : "platform.doDisallow"),
      cancel: () => {
        e.drop(), h();
      },
      apply: () => {
        const y = v().map(($) => ({ field: $.getAttribute(p.token) ?? "", allow: c }));
        wt() || bo(u, y).then(($) => {
          if (b().groupId !== u) {
            $ === "taken" && J("permissions-written", {});
            return;
          }
          if ($ !== "taken") {
            vt(f, $), d = y.length;
            return;
          }
          e.drop(), h(), J("permissions-written", {});
        });
      }
    }), w = () => {
      const y = [...a.querySelectorAll(zt)].filter((_) => _.closest(`.${l.otherKinds}`) === null), $ = y.filter((_) => _.matches(wo)), C = v().length;
      d !== C && (d = null, f.state.textContent = W("allowFields.tally", y.length, $.length, y.length), f.waiting.textContent = C === 0 ? "" : W(`allowFields.${c ? "waiting" : "going"}`, C, C), f.ready(C > 0, c || C > 0));
    };
    return w(), a.append(m), w;
  }, s = () => {
    r?.showCount();
  };
  M((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), G("fields-judged", o, t), E(o, t);
}
const ko = `.${l.anchor}[${p.verdict}]`, Ao = 350, $o = 250, rt = (e) => e.getAttribute(p.verdict) ?? "", So = (e) => e.getAttribute(p.token) ?? "", Eo = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), ot = (e) => g(`allowFields.mark.${e}.title`), qo = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return b().face === "pick" ? g(t ? "allowFields.hint.leave" : "allowFields.hint.allow") : g(t ? "allowFields.hint.keep" : "allowFields.hint.disallow");
};
function Co(e, t) {
  if (t.length === 0)
    return [];
  const n = e.ownerDocument, r = n.createElement("h3");
  r.textContent = g("allowFields.allowedBy");
  const o = n.createElement("ul");
  o.append(...t.map((s) => {
    const a = n.createElement("span");
    a.textContent = s.title;
    const c = n.createElement("button");
    c.type = "button", c.className = "btn btn-default btn-sm", c.textContent = g("allowFields.showGroup"), c.setAttribute("aria-label", x(g("allowFields.showGroupNamed"), s.title)), c.addEventListener("click", () => {
      e.hidePopover(), gt(s.groupId);
    });
    const u = n.createElement("li");
    return u.append(a, c), u;
  }));
  const i = n.createElement("section");
  return i.append(r, o), [i];
}
function Lo(e, t, n) {
  const r = e.ownerDocument, o = rt(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = ot(o);
  const a = r.createElement("p");
  a.textContent = g(`allowFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...Co(e, n));
  const d = qo(t);
  if (d !== "") {
    const m = r.createElement("footer");
    m.textContent = d, e.append(m);
  }
}
function Oo(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (m) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      m.hidePopover();
    }, $o);
  }, c = (m) => {
    const v = s.get(m);
    if (v !== void 0)
      return v;
    const h = m.createElement("div");
    return h.className = l.markCard, h.id = l.markCard, h.toggleAttribute("popover", !0), h.setAttribute("role", "dialog"), h.setAttribute("aria-labelledby", `${l.markCard}-title`), h.addEventListener("mouseenter", () => {
      window.clearTimeout(r);
    }), h.addEventListener("mouseleave", () => {
      a(h);
    }), h.addEventListener("beforetoggle", (f) => {
      o = f.newState === "open", !o && (i?.setAttribute("aria-expanded", "false"), h.contains(m.activeElement) && i?.focus());
    }), m.body.append(h), s.set(m, h), h;
  }, u = (m, v) => {
    window.clearTimeout(r);
    const h = c(m.ownerDocument);
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = m, m.style.setProperty("anchor-name", "--vperm-mark"), m.setAttribute("aria-expanded", "true"), Lo(h, v, e.allowedBy(So(v))), h.showPopover();
  }, d = () => {
    n.querySelectorAll(ko).forEach((m) => {
      const v = Eo(m);
      if (v === null)
        return;
      const h = v.querySelector(`.${l.mark}`);
      if (h !== null) {
        h.setAttribute("aria-label", ot(rt(m)));
        return;
      }
      const f = v.ownerDocument.createElement("button");
      f.type = "button", f.className = l.mark, f.setAttribute("aria-label", ot(rt(m))), f.setAttribute("aria-haspopup", "dialog"), f.setAttribute("aria-controls", l.markCard), f.setAttribute("aria-expanded", "false"), f.addEventListener("click", (w) => {
        u(f, m), w.detail === 0 && c(f.ownerDocument).querySelector("button")?.focus();
      }), f.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          u(f, m);
          return;
        }
        r = window.setTimeout(() => {
          u(f, m);
        }, Ao);
      }), f.addEventListener("mouseleave", () => {
        a(c(f.ownerDocument));
      }), v.append(f);
    });
  };
  M((m) => {
    n = m.doc;
  }, t), G("fields-judged", d, t);
}
function No(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      _o(r);
    });
  };
  M((r) => {
    t = r.doc, n();
  }, e), G("fields-judged", n, e);
}
function _o(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${p.token}]:not([${p.outOfReach}])`) === null);
}
const xo = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Pe = (e) => `${e}, ${xo[e]}`, Rn = [
  { key: "modules", host: Pe(".scaffold-sidebar"), ground: "panel" },
  {
    key: "pageMounts",
    host: Pe("typo3-backend-navigation-component-pagetree"),
    showing: "typo3-backend-navigation-component-pagetree",
    ground: "tree"
  },
  {
    key: "fileMounts",
    host: Pe("typo3-backend-navigation-component-filestoragetree"),
    showing: "typo3-backend-navigation-component-filestoragetree",
    ground: "tree"
  },
  { key: "fields", host: Pe('[slot="content"]'), ground: "module" }
];
function Vt(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(p.area), t.removeAttribute(p.ground);
  });
}
function Bn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Po(e, t) {
  const n = (i) => {
    if ((i.active ? Z(e, i.groupId) : null) === null) {
      Vt(e);
      return;
    }
    const a = Rn.flatMap((c) => {
      const u = Bn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Vt(e), a.forEach(({ element: c, key: u, ground: d }) => {
      c.classList.add(l.frame), c.setAttribute(p.area, u), c.setAttribute(p.ground, d), To(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Fo(e) && n(b());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(b()), E(n, t);
}
function Fo(e) {
  return Rn.some((t) => {
    const n = Bn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(p.area) !== t.key);
  });
}
function To(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const Io = "typo3-backend-contextual-record-edit-trigger";
function Mo(e, t) {
  let n = null;
  const r = (d) => {
    const m = d.target.closest(Io);
    !b().active || m === null || (d.preventDefault(), d.stopPropagation(), de(e)?.setAttribute("endpoint", m.getAttribute("edit-url") ?? ""));
  };
  e.addEventListener("click", r, { capture: !0, signal: t });
  const o = () => {
    const { active: d, area: m } = b();
    return d && m === "fields";
  }, i = (d) => {
    o() && d.preventDefault();
  }, s = (d) => {
    d.target.closest(`.${l.anchor}`) !== null && i(d);
  }, a = `.${l.anchor} *:not(.${l.tableGate} *):not(.${l.mark})`, c = "a,input,select,textarea,button,[contenteditable]", u = () => {
    const d = o();
    n?.querySelectorAll(a).forEach((m) => {
      (m.matches(c) || m.shadowRoot !== null) && m.toggleAttribute("inert", d);
    });
  };
  M((d) => {
    n = d.doc, n.addEventListener("submit", i, { capture: !0, signal: t }), n.addEventListener("click", s, { capture: !0, signal: t }), n.addEventListener("click", r, { capture: !0, signal: t }), u();
  }, t), E(u, t);
}
const Do = ".module-docheader-buttons .btn-toolbar", Ro = (e, t) => {
  e.location.assign(t);
};
function Bo(e, t = Ro) {
  let n = null;
  const r = () => {
    if (n === null || b().active)
      return;
    const i = new URL(n.URL), s = [...i.searchParams.keys()].filter((a) => a.startsWith("vperm[value]"));
    s.length !== 0 && (s.forEach((a) => {
      i.searchParams.delete(a);
    }), t(n, i.toString()));
  }, o = () => {
    if (n === null)
      return;
    const i = n;
    i.querySelectorAll(`.${l.typeSwitch}`).forEach((c) => {
      c.remove();
    });
    const { active: s, area: a } = b();
    !s || a !== "fields" || i.querySelectorAll(`[${p.switch}][${p.inside}='']`).forEach((c) => {
      const u = c.querySelector("select");
      if (u === null)
        return;
      const d = i.createElement("div");
      d.className = `input-group input-group-sm ${l.typeSwitch}`;
      const m = c.getAttribute(p.switch) ?? "", v = i.createElement("span");
      v.className = "input-group-text", v.textContent = m;
      const h = i.createElement("select");
      h.className = "form-select form-select-sm", h.setAttribute("aria-label", m), h.append(...[...u.children].map((f) => f.cloneNode(!0))), h.value = u.value, h.addEventListener("change", () => {
        const [f, w, y] = u.name.slice(5, -1).split("]["), $ = new URL(i.URL), C = String(w).startsWith("NEW") ? `defVals[${String(f)}][${String(y)}]` : `vperm[value][${String(f)}][${String(w)}][${String(y)}]`;
        $.searchParams.set(C, h.value), t(i, $.toString());
      }), d.append(v, h), i.querySelector(Do)?.append(d);
    });
  };
  E(() => {
    r(), o();
  }, e), M(({ doc: i }) => {
    n = i, r(), o();
  }, e);
}
async function Uo(e, t) {
  return ee(I.allow_modules, { group: e, operations: [...t] });
}
const Un = "data-modulemenu-identifier", De = `[${Un}]:not([aria-controls])`, jn = ".modulemenu-group-container";
let ye = !1;
const it = /* @__PURE__ */ new WeakMap();
let le = null;
const ke = _n(560);
function jo(e, t) {
  const n = b().groupId, r = Z(e, n) ?? "", o = [...t.querySelectorAll(De)], i = o.filter((A) => K(z(A))), s = o.filter((A) => z(A) === V), a = Ht(e, l.facePreview, g("platform.preview"), x(g("allowModules.previewFor"), r)), c = Ht(e, l.facePick, g("platform.pick"), x(g("allowModules.pickFor"), r)), d = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  d.className = l.coin, d.replaceChildren(a.sheet, c.sheet);
  const v = e.querySelector(`.${l.allowed}`) ?? e.createElement("div");
  v.className = l.allowed, d.parentElement !== v && v.replaceChildren(d);
  const h = Ko(e, t);
  v.parentElement !== h && h.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    h.classList.add(l.panelCardTurned);
  });
  const f = (A) => {
    ye = A, d.classList.toggle(l.coinTurned, A), a.sheet.toggleAttribute("inert", A), c.sheet.toggleAttribute("inert", !A);
  }, w = (A) => {
    const P = A.filter((O) => O.allow).map((O) => O.module);
    n !== null && b().groupId === n && (wt() || (P.forEach((O) => {
      ke.add(O);
    }), Uo(n, A).then((O) => {
      if (O !== "taken") {
        P.forEach((k) => {
          ke.delete(k);
        }), vt(ye ? C : y, O);
        return;
      }
      f(!1), J("permissions-written", {});
    })));
  }, y = Ne(a.foot, {
    label: g("platform.doDisallow"),
    cancel: () => {
      ze(a.scroll).forEach((A) => {
        A.classList.remove(l.faceMarked);
      }), _();
    },
    apply: () => {
      w(ze(a.scroll).map((A) => ({ module: Ve(A), allow: !1 })));
    }
  }), $ = () => {
    Yt(c.scroll, t, _), _(), f(!1);
  }, C = Ne(c.foot, {
    label: g("platform.doAllow"),
    cancel: $,
    apply: () => {
      const A = Jt(c.scroll).filter((P) => z(P) !== it.get(P));
      w(A.map((P) => ({ module: Ve(P), allow: !0 })));
    }
  }), _ = () => {
    const A = Jt(c.scroll), P = A.filter((L) => z(L) !== it.get(L)), O = A.filter((L) => K(z(L)) && !P.includes(L)), k = W("allowModules.tally", A.length, O.length, A.length), F = ze(a.scroll);
    y.state.textContent = F.length === 0 ? k : W("allowModules.marked", s.length, F.length, s.length), y.ready(F.length > 0, F.length > 0), C.state.textContent = k, C.waiting.textContent = P.length === 0 ? "" : x(g("platform.waiting"), P.length), C.ready(P.length > 0, !0);
  };
  a.bar.append(
    Y(e, g("allowModules.allow"), "btn btn-default", () => {
      f(!0);
    }),
    N(e, l.faceHint, g("allowModules.hint"))
  ), c.scroll.style.setProperty("--vperm-queued-note", `"${g("platform.toAllow")}"`), Go(e, a.scroll, i, g("platform.from"), _), Yt(c.scroll, t, _), _(), f(ye), ke.start(() => {
    d.querySelectorAll(`.${l.facePreview} ${De}`).forEach((A) => {
      A.classList.toggle(l.justAdded, ke.isLit(Ve(A)));
    });
  }), le?.abort(), le = new AbortController(), bt(e, le.signal, () => ye, $), xn(n, [y, C], le.signal);
}
function Wo(e, t) {
  le?.abort(), le = null, ye = !1, ke.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.allowed}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, On);
  }));
}
function Ko(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Ht(e, t, n, r) {
  const o = Nn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function Go(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(jn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(N(e, l.allowedGroup, a)));
    const c = Ho(s);
    c.getAttribute(p.verdict) === V ? Kn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(N(e, l.allowedFrom, r)), t.append(c);
  });
}
function Yt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(jn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(De).forEach((r) => {
    Wn(r), it.set(r, z(r)), K(z(r)) && r.setAttribute("aria-disabled", "true"), Kn(r, () => {
      Vo(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(N(r.ownerDocument, l.allowedGroup, r.getAttribute("title") ?? ""));
  });
}
function zo(e) {
  const t = z(e);
  return e.getAttribute("aria-disabled") === "true" || !Et(t) ? "" : K(t) ? "unpick" : "allow";
}
function Vo(e) {
  const t = zo(e);
  t !== "" && e.setAttribute(p.verdict, t === "allow" ? V : me);
}
function Wn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function Ho(e) {
  const t = e.cloneNode(!0);
  return Wn(t), t;
}
function Kn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function ze(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function Jt(e) {
  return [...e.querySelectorAll(De)].filter((t) => Et(z(t)));
}
const z = (e) => e.getAttribute(p.verdict) ?? "", Ve = (e) => e.getAttribute(Un) ?? "", He = "#modulemenu", Gn = "data-modulemenu-identifier", Yo = `[${Gn}]:not([aria-controls])`;
function Jo(e, t) {
  const n = We(), r = async () => {
    const { active: i, groupId: s, area: a } = b();
    if (!i || s === null || a !== "modules") {
      n.drop(), e.querySelectorAll(`${He} [${p.verdict}]`).forEach((v) => {
        v.removeAttribute(p.verdict);
      }), o(e);
      return;
    }
    const c = e.querySelector(He);
    if (c === null)
      return;
    const u = [...c.querySelectorAll(Yo)];
    if (u.length === 0)
      return;
    const d = await n.inspect(s);
    if (d === null)
      return;
    const { scopes: m } = d;
    Object.entries(m.modules.targets).forEach(([v, h]) => {
      u.filter((f) => f.getAttribute(Gn) === v).forEach((f) => {
        f.setAttribute(p.verdict, h);
      });
    }), jo(e, c);
  }, o = (i) => {
    const s = i.querySelector(He);
    s !== null && Wo(i, s);
  };
  r(), G("permissions-written", () => void r(), t), E(() => void r(), t);
}
async function Qo(e, t, n) {
  const r = await ee(I.allow_tables, { group: e, operations: [{ table: t, allow: n }] });
  return r === "taken" && J("permissions-written", {}), r;
}
function zn(e, { groupId: t, table: n, called: r, verdict: o }) {
  const i = o === V, s = o === $t || o === St, a = o === Ke, c = e.createElement("div");
  c.className = `callout callout-notice callout-sm ${l.tableGate}`, c.append(N(e, l.tableName, r)), c.append(N(e, l.tableToken, n));
  const u = N(e, "callout-body", g(Xo(o)));
  if (c.append(u), !s && !a) {
    const d = Y(
      e,
      x(g(i ? "allowTables.disallow" : "allowTables.allow"), r),
      `btn btn-default btn-sm ${i ? l.tableDisallow : l.tableAllow}`,
      () => {
        d.toggleAttribute("disabled", !0), Qo(t, n, !i).then((m) => {
          d.toggleAttribute("disabled", !1), m !== "taken" && m !== "cancelled" && (u.textContent = g(`platform.${m}`));
        });
      }
    );
    c.append(d);
  }
  return c;
}
function Xo(e) {
  return e === V ? "allowTables.theirs" : e === Ke ? "allowTables.adminOnly" : e === St ? "allowTables.alsoInherited" : e === $t ? "allowTables.inherited" : "allowTables.missing";
}
const Qt = ".typo3-TCEforms";
function Zo(e) {
  let t = null;
  const n = We(), r = async () => {
    if (t === null)
      return;
    const o = t;
    o.querySelectorAll(`.${l.tableGate}:not(.${l.nothingTheirs})`).forEach((h) => {
      h.remove();
    });
    const { active: i, area: s, face: a, groupId: c } = b();
    if (!i || s !== "fields" || a !== "pick" || c === null) {
      n.drop();
      return;
    }
    const u = /* @__PURE__ */ new Map();
    o.querySelectorAll(`[${p.inside}]`).forEach((h) => {
      const f = h.getAttribute(p.inside) ?? "", w = f === "" ? h.closest(Qt) : o.querySelector(`[${p.field}='${f}']`), y = h.getAttribute(p.token) ?? "";
      w !== null && u.set(w, Me(y));
    });
    const d = await n.inspect(c, [...new Set(u.values())]);
    if (d === null)
      return;
    const { named: m, targets: v } = d.scopes.tablesModify;
    u.forEach((h, f) => {
      const w = v[h];
      if (![V, $t, St, me].some((C) => C === w))
        return;
      const y = zn(o, { groupId: c, table: h, called: m[h] ?? h, verdict: w }), $ = f.matches(Qt) ? null : f.querySelector(".form-irre-object");
      if ($ === null) {
        f.prepend(y);
        return;
      }
      $.before(y);
    });
  };
  M((o) => {
    t = o.doc, r();
  }, e), G("permissions-written", () => void r(), e), E(() => void r(), e);
}
const ei = ".form-group";
function Vn(e) {
  return e.closest(ei);
}
function ti(e) {
  no({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !K(s)).forEach(([s]) => {
        t.querySelectorAll(`[${p.token}^='${s}:']`).forEach((a) => {
          $e(a.closest(i) ?? Vn(a) ?? a);
        }), o === "preview" && ni(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o) => zn(t, { groupId: b().groupId ?? 0, table: n, called: o, verdict: r })
  }, e);
}
function ni(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${p.token}^='${t}:']:not([${p.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(p.inside) ?? "", s = e.querySelector(`[${p.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(N(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      x(g("allowTables.gone"), n)
    ));
  });
}
function Hn(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), e.groups.forEach(({ label: v, values: h }) => {
    const f = document.createElement("section"), w = document.createElement("h2");
    w.textContent = v;
    const y = document.createElement("div");
    y.append(...h.map(($) => oi($, n.has($.value), o.has($.value)))), f.append(w, y), i.append(f);
  });
  const s = N(document, l.faceWaiting, ""), a = () => [...i.querySelectorAll("input")].filter((v) => v.checked !== n.has(v.value)).map((v) => ({ value: v.value, allow: v.checked })), c = {
    text: g("platform.cancel"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: "btn-default",
    name: "cancel",
    trigger: (v, h) => {
      h.hideModal();
    }
  }, u = {
    text: g("platform.doApply"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: "btn-primary",
    name: "apply",
    trigger: (v, h) => {
      h.querySelector('button[name="apply"]')?.toggleAttribute("disabled", !0), r(a()).then((f) => {
        if (f) {
          h.hideModal();
          return;
        }
        m();
      });
    }
  }, d = Tt.advanced({
    title: x(e.title, t),
    content: i,
    size: Tt.sizes.large,
    buttons: [c, u]
  }), m = () => {
    d.updateComplete.then(() => {
      d.querySelector('button[name="apply"]')?.toggleAttribute("disabled", a().length === 0);
    });
  };
  m(), d.updateComplete.then(() => {
    d.querySelector(".modal-footer")?.prepend(s);
  }), i.addEventListener("change", () => {
    const v = a(), h = v.filter(({ allow: f }) => f).length;
    s.textContent = ri(h, v.length - h), m();
  });
}
function ri(e, t) {
  return [
    ...e > 0 ? [x(g("platform.waiting"), e)] : [],
    ...t > 0 ? [x(g("platform.going"), t)] : []
  ].join(`
`);
}
function oi({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function ii(e, t, n) {
  return ee(e === "pageTypes" ? I.allow_page_types : I.allow_values, {
    group: t,
    operations: [...n]
  });
}
function si(e) {
  let t = null;
  const n = () => {
    if (t === null)
      return;
    const { active: r, face: o } = b();
    if (!r || o !== "pick") {
      t.querySelectorAll(`.${l.allowChoose}`).forEach((i) => {
        i.remove();
      });
      return;
    }
    t.querySelectorAll(`[${p.allows}]`).forEach((i) => {
      if (i.nextElementSibling?.classList.contains(l.allowChoose) === !0)
        return;
      const s = i.getAttribute(p.token) ?? "", a = i.ownerDocument.createElement("button");
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = g(`allowedValues.choose.${to(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(p.choices) ?? "{}"), u = b().groupId ?? 0;
        yt(u).then((d) => {
          if (d === null)
            return;
          const m = i.getAttribute(p.allows) === "pageTypes" ? "pageTypes" : "fieldValues", v = m === "pageTypes" ? "" : `${s}:`, h = new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => K(f)).map(([f]) => f.substring(v.length)));
          Hn(c, Z(document, u) ?? "", h, async (f) => await ii(m, u, f.map(({ value: y, allow: $ }) => ({ value: `${v}${y}`, allow: $ }))) !== "taken" ? !1 : (J("permissions-written", {}), !0), new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => K(f) && f !== V).map(([f]) => f.substring(v.length))));
        });
      }), i.after(a);
    });
  };
  M((r) => {
    t = r.doc, n();
  }, e), E(n, e);
}
const ai = `[${p.verdict}='${me}'], [${p.verdict}='${Ke}']`;
function li(e) {
  ro({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(ai).forEach((o) => {
        $e(Vn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        N(t, "callout-body", x(g("allowFields.recordNoFields"), o)),
        Y(t, g("recordForm.add"), "btn btn-default btn-sm", () => {
          Se(t, () => {
            ce("pick");
          });
        })
      ), i;
    }
  }, e);
}
async function ci(e, t) {
  const n = await yt(e);
  if (n === null)
    return;
  const r = await kt(new X(B(I.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  Hn(r, t, o, async (i) => await ee(I.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (J("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== V).map(([i]) => i)));
}
const Yn = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: ie.folderTree,
  base: $r,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = B(I.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: B("filestorage_tree_rootline"),
      filterUrl: B("filestorage_tree_filter"),
      showIcons: !0
    };
  },
  write: async (e, t, n, r) => ee(I.mount_folders, {
    group: e,
    operations: t.map((o) => ({
      folder: decodeURIComponent(o),
      mount: n,
      // A folder with an existing record needs no new title; the backend keeps the one it has
      title: r.get(o) ?? ""
    }))
  }),
  choice: (e, t) => Y(
    e,
    g("mountBranches.folders.chooseOperations"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    "btn btn-default",
    () => {
      ci(t, Z(e, t) ?? "");
    }
  )
}, Jn = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: ie.pageTree,
  base: Sr,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => ({ ...await (await new X(B("page_tree_browser_configuration")).get()).resolve(), rootlineUrl: B("page_tree_rootline") }),
  write: async (e, t, n) => ee(I.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function ui(e, t) {
  const n = e.createElement("form");
  return n.className = l.naming, n.append(...t.map((r, o) => {
    const i = decodeURIComponent(r), s = e.createElement("div");
    s.className = l.namingRow;
    const a = e.createElement("input");
    a.type = "text", a.className = "form-control", a.id = `${l.naming}-${String(o)}`, a.value = i.replace(/\/$/, "").split("/").pop() ?? "", a.dataset.folder = r;
    const c = e.createElement("label");
    return c.className = l.namingPath, c.htmlFor = a.id, c.textContent = i, s.append(c, a), s;
  })), n;
}
function di(e) {
  const t = /* @__PURE__ */ new Map();
  return Qn(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function pi(e, t) {
  const n = Qn(e);
  return n.forEach((r, o) => {
    const i = r.parentElement, s = i?.querySelector(`.${l.namingWhy}`) ?? null;
    if (r.value.trim() === "") {
      const a = s ?? N(e.ownerDocument, l.namingWhy, t);
      a.id = `${l.namingWhy}-${String(o)}`, i?.append(a), r.setAttribute("aria-invalid", "true"), r.setAttribute("aria-describedby", a.id);
      return;
    }
    s?.remove(), r.removeAttribute("aria-invalid"), r.removeAttribute("aria-describedby");
  }), n.every((r) => r.value.trim() !== "");
}
const Qn = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ee = _n(520), R = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set(), Re = /* @__PURE__ */ new Set(), st = /* @__PURE__ */ new Set(), Xn = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, Zn = (e) => j.has(e) && !Re.has(e), er = (e) => e.__parents ?? [], qe = (e) => er(e).some((t) => j.has(t)), fi = (e, t) => t.some((n) => j.has(n.identifier) && er(n).includes(e.identifier)), tr = (e) => e.detail;
function mi(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = tr(o);
    s === !1 || Xn(i.identifier) || j.has(i.identifier) || qe(i) || (U.has(i.identifier) ? U.delete(i.identifier) : U.add(i.identifier), t(), Ye(Ie(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Ie(e);
    o !== null && (!_e.has(o) || e.querySelector(".node[data-id='0']") !== null) && Ye(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), Ye(Ie(e));
}
function hi(e) {
  const t = Ie(e);
  if (t === null)
    return;
  const n = _e.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), _e.delete(t), t.requestUpdate());
}
function Ye(e) {
  if (e !== null) {
    if (Xt(e.nodes), !_e.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      _e.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => Xt(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return j.has(r.identifier) && o.push(l.mountAlready), U.has(r.identifier) && o.push(l.mountPicked), Xn(r.identifier) && o.push(l.mountWhole), o;
      };
    }
    e.requestUpdate();
  }
}
function Xt(e) {
  return e.filter((t) => Number(t.identifier) < 1).forEach((t) => {
    t.__hidden = !0;
  }), e;
}
const _e = /* @__PURE__ */ new WeakMap(), Ie = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let Je = "", Zt = () => {
};
async function gi(e, t, n, { groupId: r, kind: o, showCount: i }) {
  Zt = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), Je = s;
    return;
  }
  const a = o.tree;
  if (vi(a, o.base), t.querySelector(a) !== null && Je === s)
    return;
  const u = await o.rootedAt(r), d = e.createElement(a);
  d.addEventListener("mousedown", (v) => {
    const h = v.target instanceof Element ? v.target.closest(".node") : null;
    h !== null && (Zn(h.getAttribute("data-id") ?? "") || v.preventDefault());
  }), d.addEventListener("typo3:tree:node-selected", (v) => {
    v.stopPropagation();
    const { node: h, propagate: f } = tr(v);
    f !== !1 && (R.has(h.identifier) ? R.delete(h.identifier) : R.add(h.identifier), at(e), Zt());
  }), Object.assign(d, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(d), t.replaceChildren(m), Je = s, Object.assign(d, { setup: u });
}
function at(e) {
  e.querySelector(
    `.${l.facePreview} :is(${ie.pageTree}, ${ie.folderTree})`
  )?.requestUpdate();
}
function vi(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return Zn(n.identifier);
    }
    // Core loads the first levels only, so a deeper mount needs the way down to it loaded
    async loadData() {
      await super.loadData();
      const n = [...j].filter((r) => !this.nodes.some((o) => o.identifier === r));
      for (const r of n) {
        const o = await new X(this.settings.rootlineUrl ?? "").withQueryArguments({ identifier: r }).get().catch(() => null);
        if (o === null)
          continue;
        const { rootline: i } = await o.resolve();
        for (const s of i.slice(0, -1)) {
          const a = this.nodes.find((c) => c.identifier === s);
          a !== void 0 && a.loaded !== !0 && await this.loadChildren(a);
        }
      }
      en(this.nodes);
    }
    prepareNodes(n) {
      return en(super.prepareNodes(n));
    }
    hideChildren(n) {
      !qe(n) && !j.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return qe(n) && r.push(l.mountInside), !qe(n) && !j.has(n.identifier) && r.push(l.mountContext), Re.has(n.identifier) && r.push(l.mountInherited), R.has(n.identifier) && r.push(l.faceMarked), st.has(n.identifier) && r.push(l.mountUnseen), Ee.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function en(e) {
  return e.forEach((t) => {
    qe(t) || j.has(t.identifier) || (t.__expanded = !0, t.__hidden = !fi(t, e));
  }), e;
}
function bi(e, t, n, r) {
  const o = (u) => g(`${r}.${u}`);
  if (t.sheet.querySelector(`.${l.unseenPages}`)?.remove(), n.length === 0)
    return;
  const i = e.createElement("div");
  i.className = l.unseenPages;
  const s = e.createElement("b");
  s.textContent = W(`${r}.unseen`, n.length, n.length);
  const a = e.createElement("p");
  a.append(s, ` ${o("unseenWhy")}`);
  const c = e.createElement("ul");
  n.forEach(({ page: u, title: d, link: m }) => {
    const v = e.createElement("a");
    v.href = m, v.addEventListener("click", (f) => {
      f.preventDefault(), Er.update("web", u, !0), Be.App.showModule("permissions_pages");
    }), v.setAttribute("aria-label", x(o("unseenLink"), d)), v.textContent = x(o("unseenPage"), d);
    const h = e.createElement("li");
    h.append(v), c.append(h);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let Ae = !1, lt = null, Ce = null;
function wi(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (k) => g(`${i}.${k}`), a = Z(e, r) ?? "", c = ki(e, t);
  lt !== r && (R.clear(), U.clear(), lt = r), Ce?.abort(), Ce = new AbortController();
  const { signal: u } = Ce, d = tn(e, c, l.facePick), m = tn(e, c, l.facePreview);
  m.eyebrow.textContent = g("platform.preview"), m.sentence.textContent = x(s("previewFor"), a), d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = x(s("pickFor"), a);
  const v = n.order;
  j.clear(), Re.clear(), Object.entries(n.targets).forEach(([k, F]) => {
    j.add(k), Et(F) || (Re.add(k), R.delete(k));
  });
  const h = (k) => {
    m.sheet.toggleAttribute("inert", k), d.sheet.toggleAttribute("inert", !k);
  }, f = (k) => {
    Ae = k, c.classList.toggle(l.panelCardTurned, !k), h(k);
  };
  h(Ae);
  const w = () => {
    const k = W(`${i}.tally`, v.length, v.length);
    $.state.textContent = R.size === 0 ? k : W(`${i}.marked`, v.length, R.size, v.length), $.ready(R.size > 0, R.size > 0), O.state.textContent = k, O.waiting.textContent = U.size === 0 ? "" : x(g("mountBranches.waiting"), U.size), O.ready(U.size > 0, !0);
  }, y = (k, F) => {
    if (b().groupId !== r)
      return;
    const L = [...k];
    if (L.length === 0 || wt())
      return;
    const H = o.write(r, L, F, di(d.sheet));
    F && L.forEach((te) => {
      Ee.add(te);
    }), H.then((te) => {
      if (te !== "taken") {
        L.forEach((se) => {
          Ee.delete(se);
        }), vt(F ? O : $, te);
        return;
      }
      L.forEach((se) => k.delete(se)), _(), f(!1), J("permissions-written", {});
    });
  }, $ = Ne(m.foot, {
    label: g("mountBranches.doRemove"),
    cancel: () => {
      R.clear(), at(e), w();
    },
    apply: () => {
      y(R, !1);
    }
  }), C = new Set(Object.keys(n.named)), _ = () => {
    d.sheet.querySelector(`.${l.naming}`)?.remove(), d.scroll.hidden = !1, d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = x(s("pickFor"), a);
  }, A = () => {
    const k = [...U].filter((L) => !C.has(L)), F = d.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && k.length > 0 && !F) {
      const L = ui(e, k);
      L.addEventListener("submit", (H) => {
        H.preventDefault(), A();
      }), L.addEventListener("input", () => {
        O.ready(P(), !0);
      }), d.eyebrow.textContent = s("name"), d.sentence.textContent = s("nameFor"), d.scroll.hidden = !0, d.sheet.insertBefore(L, d.foot), L.querySelector("input")?.focus();
      return;
    }
    if (F && !P()) {
      d.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    y(U, !0);
  }, P = () => pi(d.sheet, s("nameWhy")), O = Ne(d.foot, {
    label: g("mountBranches.doAdd"),
    cancel: () => {
      U.clear(), _(), f(!1), w();
    },
    apply: A
  });
  if (d.scroll.style.setProperty("--vperm-queued-note", `"${g("mountBranches.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), st.clear(), n.unseen.forEach(({ page: k }) => {
    st.add(String(k));
  }), bi(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const k = e.createElement("div");
    k.className = l.faceChoice, k.append(o.choice(e, r)), m.sheet.insertBefore(k, m.foot);
  }
  gi(e, m.scroll, v, { groupId: r, kind: o, showCount: w }), mi(d.sheet, w, u), w(), Ee.start(() => {
    at(e);
  }), bt(e, u, () => Ae, () => {
    if (d.sheet.querySelector(`.${l.naming}`) !== null) {
      _();
      return;
    }
    f(!1);
  }), xn(r, [$, O], u), m.bar.replaceChildren(
    m.eyebrow,
    m.sentence,
    Y(e, s("add"), "btn btn-default", () => {
      f(!0);
    }),
    N(e, l.faceHint, s("hint"))
  ), window.requestAnimationFrame(() => {
    f(Ae);
  });
}
function yi(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  Ae = !1, R.clear(), lt = null, Ee.stop(), Ce?.abort(), Ce = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), hi(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, On));
}
function ki(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function tn(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return Ai(r);
  const o = Nn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function Ai(e) {
  const t = (n) => e.querySelector(`.${n}`) ?? e;
  return {
    sheet: e,
    bar: t(l.faceBar),
    eyebrow: t(l.faceEyebrow),
    sentence: t(l.faceSentence),
    scroll: t(l.faceScroll),
    foot: t(l.faceFoot)
  };
}
const $i = { pageMounts: Jn, fileMounts: Yn };
function Si(e, t) {
  const n = We();
  let r = !1;
  const o = async () => {
    const { active: s, groupId: a, area: c } = b(), u = $i[c];
    if (!s || a === null || u === void 0) {
      n.drop(), yi(e);
      return;
    }
    const d = e.querySelector(u.component);
    if (d === null)
      return;
    r = !0;
    const m = await n.inspect(a);
    r = !1, m !== null && wi(e, d, u.mounted(m.scopes), { groupId: a, kind: u });
  }, i = new MutationObserver(() => {
    !r && [Jn, Yn].every(({ component: s }) => e.querySelector(`${s} > .${l.panelCard}`) === null) && o();
  });
  i.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    i.disconnect();
  }), o(), G("permissions-written", () => void o(), t), E(() => void o(), t);
}
let ct = null;
function nr(e) {
  ct = e, Be.App.showModule(e);
}
function Ei(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function qi(e) {
  const t = ct === e;
  return ct = null, t;
}
const Le = "other", nn = ["modules", "pageMounts", "fileMounts", "fields", Le], Ci = 10, re = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Le]: "module"
}, Li = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function Oi(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", g("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(p.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const w = rr(e);
    if (w.forEach((S) => {
      h.observe(S);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const y = w.map((S) => ne(S)), $ = [...nn, ...y.filter((S) => !nn.includes(S))], C = y.includes("fields") ? [Le] : [], _ = w.filter((S) => S.getBoundingClientRect().width !== 0).map(ne), A = _.includes("fields") ? [..._, Le] : _, [P] = A.includes("fields") ? ["fields"] : A, O = A.find((S) => re[S] !== void 0 && re[S] === re[f.picked]), k = A.includes(f.picked) ? f.picked : O ?? P;
    if (A.join() !== i && (i = A.join(), k !== void 0 && k !== f.area)) {
      Ir(k);
      return;
    }
    y.join() !== s && (s = y.join(), n.replaceChildren(
      ...y.flatMap((S) => [Bi(e, S), Ri(e, S)]),
      ...$.map((S) => _i(e, S, g(`pickAnArea.${S}`)))
    )), n.parentElement === null && Ni(e).append(n);
    const F = f.area === Le ? "fields" : f.area;
    Fi(n, e), Ti(n, e, w.find((S) => ne(S) === F) ?? null);
    const L = f.area !== "fields";
    w.forEach((S) => {
      const q = ne(S), ve = q === F, ae = L && !ve && q !== "modules", be = Fe(n, q);
      be?.setAttribute("aria-selected", String(q === f.area)), xi(be, S), S.toggleAttribute(p.armed, ve), S.toggleAttribute("inert", ae), r.add(S), Ui(Wi(n, q), S, ae), Ii(Ki(n, q), S, ve, w);
    });
    let H = 0, te = null;
    $.forEach((S) => {
      const q = Fe(n, S);
      if (q === null)
        return;
      const ve = q.hidden ? 0 : q.getBoundingClientRect().width, ae = w.find((wr) => ne(wr) === S), be = ae ?? ji(S, w), Ft = Math.max(H, be?.getBoundingClientRect().left ?? H);
      q.style.setProperty("--vperm-host-x", `${String(Ft)}px`), q.toggleAttribute(p.elsewhere, ae === void 0), ae === void 0 && (q.setAttribute("aria-selected", String(S === f.area)), xe(q, be ?? te ?? q)), H = q.hidden ? H : Ft + ve + Ci, te = q;
    });
    const se = Fe(n, "fields");
    C.forEach((S) => {
      const q = Fe(n, S);
      q === null || se === null || (q.setAttribute("aria-selected", String(S === f.area)), q.hidden = se.hidden);
    });
  };
  let c = 0;
  const u = () => {
    window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
      a(b());
    });
  }, d = new MutationObserver((f) => {
    f.some((w) => !n.contains(w.target)) && u();
  });
  let m = !1;
  const v = (f) => {
    const w = f.detail.module ?? "", y = qi(w);
    if (!m) {
      m = !0;
      return;
    }
    !y && re[b().picked] === "tree" && qn("fields");
  };
  e.addEventListener("typo3-module-loaded", v, { signal: t }), d.observe(e.body, { childList: !0, subtree: !0 });
  const h = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    d.disconnect(), h.disconnect(), window.cancelAnimationFrame(c);
  }), E(a, t), a(b());
}
const Ni = (e) => e.querySelector(".scaffold") ?? e.body;
function _i(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(p.area, t), r.setAttribute(p.label, n), r.append(N(e, l.tabLabel, n)), r.addEventListener("click", () => {
    qn(t);
    const o = Li[t];
    o !== void 0 && rr(e).every((i) => ne(i) !== t) && nr(o);
  }), r;
}
function xi(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, xe(e, t));
}
const xe = (e, t) => {
  e.setAttribute(p.ground, t.getAttribute(p.ground) ?? "");
}, Pi = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Fi(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function Ti(e, t, n) {
  const r = Mi(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, xe(r, n), qt(r, n);
}
function qt(e, t) {
  const n = t.getBoundingClientRect(), r = Pi(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function Ii(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  xe(e, t), e.hidden = o.width === 0 || o.left === 0 || n || Ln(t.ownerDocument) === 0 || Di(o, r), qt(e, t);
}
function Mi(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Di(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Ri(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(p.area, t), n;
}
function Bi(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(p.area, t), n;
}
function Ui(e, t, n) {
  e !== null && (e.hidden = !n, n && (xe(e, t), qt(e, t)));
}
const ji = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  re[e] === void 0 ? void 0 : t.find((n) => re[ne(n)] === re[e])
), Fe = (e, t) => e.querySelector(`.${l.tab}[${p.area}="${t}"]`), Wi = (e, t) => e.querySelector(`.${l.areaCover}[${p.area}="${t}"]`), Ki = (e, t) => e.querySelector(`.${l.tabSeam}[${p.area}="${t}"]`);
function rr(e) {
  return [...e.querySelectorAll(`.${l.frame}[${p.area}]`)];
}
const ne = (e) => e.getAttribute(p.area) ?? "", or = "#modulemenu", Gi = `${or} .modulemenu-group-container.collapse:not(.show)`, zi = `${or} [aria-controls]`, Vi = "typo3-backend-content-navigation[navigation-collapsed]", rn = "navigation-collapsed";
function Hi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = b();
    o && Ji(e, n), o && i === "modules" && Yi(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    b().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), E(r, t);
}
function Yi(e, t) {
  e.querySelectorAll(Gi).forEach((n) => {
    n.classList.add("show"), on(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), on(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(zi).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function Ji(e, t) {
  e.querySelectorAll(Vi).forEach((n) => {
    n.toggleAttribute(rn, !1), t.push(() => {
      n.toggleAttribute(rn, !0);
    });
  });
}
function on(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const Qi = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", sn = "scaffold-content-navigation-expanded";
function Xi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(sn);
    }), n = b().active ? [...e.querySelectorAll(Qi)] : [], n.forEach((o) => {
      o.classList.add(sn);
    });
  };
  r(), E(r, t);
}
const ir = (e) => [...e, "web_list"], Oe = ir(["web_layout", "records", "media_management", "permissions_pages"]), sr = "vperm.module";
function Zi(e, t) {
  let n = null;
  const r = (i) => {
    rs(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || Oe.includes(ts(e))))
      return;
    const a = os() ?? Oe[0] ?? "", c = ht(e);
    if ((c !== "" || _r(e)) && i.area === "fields") {
      Ei(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        es(e, c);
      },
      { once: !0, signal: t }
    ), nr(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    b().active && Oe.includes(s) && pe(sr, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), E(r, t);
}
async function es(e, t) {
  const n = de(e), r = await Mn(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function ts(e) {
  return Be.App.getCurrentModule() ?? de(e)?.getAttribute("module") ?? "";
}
const ar = "[data-modulemenu-identifier]:not([aria-controls])", ns = `#modulemenu ${ar}`;
function rs(e, t) {
  e.querySelectorAll(ns).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !Oe.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(ar)].every((r) => r.parentElement?.hidden === !0);
  });
}
function os() {
  const e = ue.get(sr);
  return typeof e == "string" && Oe.includes(e) ? e : void 0;
}
function is(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function ss(e) {
  M(({ doc: t }) => {
    t.querySelectorAll(".module-docheader-bar-navigation").forEach((n) => {
      n.classList.add("module-docheader-navigation");
    }), t.querySelectorAll(".module-docheader-bar-navigation > .module-docheader-bar-column-left").forEach((n) => {
      n.classList.add("module-docheader-column-breadcrumb");
    }), t.querySelectorAll(".module-docheader-bar-buttons").forEach((n) => {
      n.classList.add("module-docheader-buttons");
    });
  }, e);
}
function as(e) {
  M(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const ls = "[data-object-id]";
function lr(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = b();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), cs(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), us(a), cr(a, e));
    });
  };
  M((i) => {
    n = i.doc, o();
  }, t), E(o, t);
}
function cs(e, t) {
  e.querySelectorAll(ls).forEach((n) => {
    ds(n) && (ps(n), n.matches(t.shut) || cr(n, t));
  });
}
function cr(e, t) {
  e.querySelector(t.opener)?.click();
}
const Ct = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function us(e) {
  oe.set(Ct(e), "folded");
}
function ds(e) {
  return oe.isset(Ct(e));
}
function ps(e) {
  oe.unset(Ct(e));
}
function fs(e) {
  lr({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function ms(e, t) {
  const n = e.createElement("div");
  n.className = l.face;
  const r = e.createElement("form");
  r.setAttribute("name", "editform"), r.className = "module-body";
  const o = e.createElement("div");
  o.className = "module-docheader module-docheader-buttons t3js-module-docheader-buttons";
  const i = e.createElement("div");
  i.className = l.head;
  const s = e.createElement("strong"), a = e.createElement("div");
  a.className = "btn-toolbar", a.setAttribute("role", "toolbar");
  const c = e.createElement("button");
  c.type = "button", c.className = "btn btn-sm btn-default";
  const u = e.createElement("typo3-backend-icon");
  u.setAttribute("identifier", "actions-document-save"), u.setAttribute("size", "small"), c.append(u, ` ${g("rm.saveDoc")}`), c.addEventListener("click", () => {
    c.disabled = !0, u.setAttribute("identifier", "spinner-circle");
    const h = { group: String(m) };
    for (const [f, w] of new FormData(r))
      typeof w == "string" && (h[f] = w);
    ee(I.write_other_permissions, h).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== d, f === "taken") {
        Qe.success(g("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && Qe.error(g("editOtherPermissions.notSaved"));
    });
  }), a.append(c), i.append(s, a), o.append(i), n.append(o, r);
  let d = null, m = null;
  const v = (h) => {
    const f = !h.active || h.area !== "other", w = h.groupId === null;
    if (f || w) {
      n.remove(), d = null, delete TYPO3.settings.FormEngine?.formName;
      return;
    }
    const y = h.groupId;
    y !== d && (d = y, c.disabled = !0, s.textContent = Z(e, y) ?? "", hs(y).then(($) => {
      $ === null || y !== d || (r.replaceChildren(e.createRange().createContextualFragment($.html)), m = y, c.disabled = !1, e.querySelector(`.${l.frame}[${p.area}="fields"]`)?.append(n), new qr().processItems([...$.scriptItems]));
    }));
  };
  v(b()), E(v, t);
}
async function hs(e) {
  return kt(new X(B(I.other_permissions)).withQueryArguments({ group: e }).get());
}
const Lt = '.form-group:has(> select[name="_langSelector"])', ut = /* @__PURE__ */ new WeakMap();
function gs(e, t) {
  const n = e.querySelector(`.module-docheader ${Lt}`);
  n !== null && (ut.has(n) || ut.set(n, n.parentElement), t.after(n));
}
function vs(e) {
  const t = e.querySelector(`.module-docheader ${Lt}`);
  t !== null && ut.get(t)?.append(t);
}
const bs = (e) => `${e}, ${Lt}`, ws = ".module-docheader-navigation > .module-docheader-column-breadcrumb", an = ".module-docheader-buttons .btn-toolbar > *", ys = ".t3js-editform-close", ks = bs(`.${l.headButton}, .${l.showMenu}, .${l.typeSwitch}`), As = 'form[name="editform"] h1';
function $s(e, t) {
  let n = null;
  const r = (i) => {
    const { active: s, area: a } = b();
    return s && a === "fields" && i.querySelector(`[${p.token}]`) !== null;
  }, o = () => {
    if (n === null)
      return;
    const i = n, s = r(i);
    i.querySelectorAll(`.${l.headBar}, .${l.headButton}`).forEach((f) => {
      f.remove();
    });
    const a = i.querySelector(ys), c = b().face === "preview" ? a : null;
    if (i.querySelectorAll(an).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches(ks) && !f.contains(c));
    }), i.querySelectorAll(As).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${p.token}][${p.inside}='']:not([${p.outOfReach}])`) !== null;
    if (!u && b().face === "pick") {
      Se(i, () => {
        ce("preview");
      });
      return;
    }
    const d = b().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      N(i, l.faceEyebrow, g(d ? "platform.preview" : "platform.pick")),
      N(i, l.faceSentence, x(
        g(d ? "recordForm.previewFor" : "recordForm.pickFor"),
        Z(e, b().groupId) ?? ""
      ))
    ), i.querySelector(ws)?.append(m), !d || !u)
      return;
    const v = Y(
      i,
      g("recordForm.add"),
      `btn btn-default btn-sm ${l.headButton}`,
      () => {
        Se(i, () => {
          ce("pick");
        });
      },
      "actions-check-square"
    );
    [...i.querySelectorAll(an)].find((f) => f.contains(a))?.after(v);
  };
  M((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && bt(
      i.doc,
      t,
      () => b().face === "pick",
      () => {
        Se(i.doc, () => {
          ce("preview");
        });
      }
    );
  }, t), G("fields-judged", o, t), E(o, t);
}
const ln = `[${p.token}]`;
function Ss(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(ln)];
    jt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(ln)];
      Es(s, i) || (i = s, jt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const Es = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function qs(e, t) {
  let n = [];
  const r = () => {
    if (n.forEach((i) => {
      i();
    }), n = [], !b().active)
      return;
    e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelectorAll("typo3-backend-new-content-element-wizard-button").forEach((i) => {
      const s = i.lastChild, a = s.textContent;
      s.textContent = g("readOnly.previewNewContent"), n.push(() => {
        s.textContent = a;
      });
    });
  };
  r(), E(r, t);
}
const Cs = ir(["records"]);
function Ls(e, t) {
  let n = b().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && Cs.includes(Be.App.getCurrentModule() ?? "");
  E(({ active: o }) => {
    o !== n && xr().then(() => {
      r() && Cr.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function Os(e, t) {
  const n = () => {
    const o = (e.querySelector("#typo3-contentIframe")?.contentWindow).TYPO3.FormEngine;
    if (o === void 0)
      return;
    const i = o.preventExitIfNotSaved.bind(o);
    o.preventExitIfNotSaved = (s) => {
      if (b().active) {
        s(!0);
        return;
      }
      i(s);
    };
  };
  e.addEventListener("typo3-module-loaded", n, { capture: !0, signal: t });
}
const Ns = ".module-docheader-buttons .btn-toolbar", cn = "vperm.show", un = "vperm.identify", dn = (e, t, n) => {
  if (n) {
    oe.set(e, t);
    return;
  }
  oe.unset(e);
}, pn = (e, t) => {
  if (e.setAttribute("aria-selected", String(t)), !t) {
    e.removeAttribute("data-dropdowntoggle-status");
    return;
  }
  e.setAttribute("data-dropdowntoggle-status", "active");
};
function _s(e) {
  let t = null;
  const n = (o) => {
    const { active: i, area: s } = b();
    return i && s === "fields" && o.querySelector(`[${p.token}]:not([${p.outOfReach}])`) !== null;
  }, r = () => {
    if (t === null)
      return;
    const o = t;
    if (o.querySelectorAll(`.${l.showMenu}`).forEach((c) => {
      c.remove();
    }), !n(o)) {
      o.body.removeAttribute(p.show), vs(o);
      return;
    }
    mn(o, oe.get(cn) === "list"), fn(o, oe.get(un) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(ur(o, "actions-filter"), ` ${g("recordForm.show")}`);
    const a = o.createElement("ul");
    a.className = "dropdown-menu", a.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      hn(o, g("recordForm.show.listOnly"), "actions-list", () => o.body.hasAttribute(p.show), (c) => {
        dn(cn, "list", c), mn(o, c);
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      hn(o, g("recordForm.show.identifiers"), "actions-tag", () => o.body.hasAttribute(p.identify), (c) => {
        dn(un, "said", c), fn(o, c);
      })
    ), i.append(s, a), o.querySelector(Ns)?.append(i), gs(o, i);
  };
  M((o) => {
    t = o.doc, r();
  }, e), G("fields-judged", r, e), E(r, e);
}
function fn(e, t) {
  e.querySelectorAll(`.${l.fieldToken}`).forEach((n) => {
    n.remove();
  }), e.body.toggleAttribute(p.identify, t), t && e.querySelectorAll(`.${l.anchor}[${p.token}]`).forEach((n) => {
    const r = n.querySelector(":scope > .form-label, :scope > fieldset > legend");
    if (r === null)
      return;
    const o = e.createElement("small");
    o.className = l.fieldToken, o.textContent = n.getAttribute(p.token), r.after(o);
  });
}
function ur(e, t) {
  const n = e.createElement("typo3-backend-icon");
  return n.setAttribute("identifier", t), n.setAttribute("size", "small"), n;
}
function mn(e, t) {
  if (!t) {
    e.body.removeAttribute(p.show);
    return;
  }
  e.body.setAttribute(p.show, "list");
}
function hn(e, t, n, r, o) {
  const i = e.createElement("button");
  i.type = "button", i.className = "dropdown-item dropdown-item-spaced";
  const s = e.createElement("span");
  s.className = "dropdown-item-status", i.append(s, ur(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), pn(i, r());
  }), pn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function xs(e) {
  return Xe.normalizedCtrlModifierKey === bn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function Ot(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = xs(e), t.append(o);
    }
    Xe.register(
      [Xe.normalizedCtrlModifierKey, bn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Ps(e) {
  Ot(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${p.toggle}]`), () => {
    if (b().active) {
      En();
      return;
    }
    Sn();
  }, !0);
}
function Fs(e, t) {
  const n = e.querySelector(`[${p.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(b()), n.addEventListener("click", () => {
    if (b().active) {
      En();
      return;
    }
    Sn();
  }, { signal: t }), E(r, t);
}
function Ts(e) {
  lr({
    shut: "[data-object-id]:has(.panel-button.collapsed)",
    opener: ".panel-button"
  }, e);
}
function he(e, t) {
  try {
    sessionStorage.setItem(e, t);
  } catch {
  }
}
function ge(e) {
  try {
    return sessionStorage.getItem(e);
  } catch {
    return null;
  }
}
function Nt(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {
  }
}
const dr = 600, Is = 250, Ms = 2e3, Ds = 320, _t = "vperm.arriving";
function Rs() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function pr(e, t, n) {
  if (!Rs()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  he(_t, t), e.body.setAttribute(p.leaving, t), e.body.addEventListener("animationend", o, { once: !0 }), window.setTimeout(o, dr);
}
function Bs(e) {
  e.body.setAttribute(p.settling, "");
}
function Us(e) {
  const t = js();
  if (t === null)
    return;
  Nt(_t), e.body.setAttribute(p.settling, ""), e.body.setAttribute(p.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(p.settling), e.body.removeAttribute(p.arriving), e.body.setAttribute(p.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(p.unwrapping);
    }, Ds));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, dr);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, Is);
  }, { signal: i.signal }), window.setTimeout(c, Ms);
}
function js() {
  return ge(_t);
}
const fr = "vperm.viewing", mr = "vperm.seen", hr = "vperm.room";
function Ws(e) {
  he(fr, e);
}
function Ks(e) {
  he(hr, String(e));
}
function Gs() {
  return ge(hr);
}
function zs(e) {
  const t = ge(fr);
  t !== null && he(mr, JSON.stringify({
    ...xt(),
    [t]: { place: kn(e), document: ht(e) }
  }));
}
function Vs(e) {
  return wn(xt()[e]);
}
function Hs(e) {
  return yn(xt()[e]);
}
function xt() {
  const e = ge(mr);
  return e === null ? {} : JSON.parse(e);
}
function Ys(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector('typo3-backend-switch-user[mode="exit"]');
  if (n === null || r === null)
    return;
  const o = r.cloneNode(!0);
  o.classList.remove("btn-sm"), o.classList.add(l.leaveUser);
  const {
    leave: i = "",
    switchUserKey: s = ""
  } = TYPO3.settings.visualPermissions ?? {};
  i !== "" && (o.textContent = i);
  const a = e.createElement("div");
  a.className = l.leaveRoom, a.append(o);
  const c = Gs();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), Cn(e, a, t), o.addEventListener("click", () => {
    zs(e), pr(e, "up", () => {
    });
  }, { signal: t }), Ot(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Pt = "vperm.opening";
function gr(e, t) {
  e !== "" && he(Pt, JSON.stringify({ record: e, screen: t }));
}
function Js(e) {
  const t = Xs(), n = de(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !Qs(t.screen, n, e.location.href) || (Nt(Pt), Zs(e, n, t.record));
}
function Qs(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function Xs() {
  const e = ge(Pt);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function Zs(e, t, n) {
  const r = await Mn(n, t);
  r !== "" && Nr(e, r);
}
let Te = null;
function ea(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
async function vr() {
  const e = await new X(B(I.viewable_users)).get(Te === null ? {} : { headers: { "If-None-Match": Te.tag } }).catch(ea), t = e.raw();
  if (t.status === 304)
    return Te.users;
  const n = await e.resolve(), r = t.headers.get("ETag");
  return Te = r === null ? null : { tag: r, users: n }, n;
}
const ta = {
  go: (e) => {
    window.location.href = e;
  },
  handOver: (e, t) => {
    const n = document.createElement("form");
    n.method = "post", n.action = e, Object.entries(t).forEach(([r, o]) => {
      const i = document.createElement("input");
      i.type = "hidden", i.name = r, i.value = o, n.append(i);
    }), document.body.append(n), n.submit();
  }
}, dt = "vperm.returnTo", pt = "vperm.returning", na = "vperm.userSearch";
function ra(e, t, n = ta) {
  const r = ue.get(dt), o = wn(r);
  return o !== "" && oa(o) ? (gr(yn(r), o), pe(dt, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (ia(e, t, n), !1);
}
function oa(e) {
  return ge(pt) === e ? !1 : (he(pt, e), !0);
}
function ia(e, t, n) {
  const r = e.querySelector(`[${p.viewAs}]`);
  if (r === null)
    return;
  const o = Pn(e, {
    totalOne: g("viewAsUser.total.one"),
    totalMany: g("viewAsUser.total.many"),
    take: g("viewAsUser.key.take"),
    detail: g("viewAsUser.key.detail"),
    loading: g("viewAsUser.loading"),
    failed: g("viewAsUser.failed")
  });
  o.remembers = na, o.placeholder = g("viewAsUser.search"), e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    br(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    ft(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    gt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    ft(e, o), o.openedBy(r);
  }, { signal: t }), Ot(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    sa(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function sa(e, t, n, r) {
  const o = await vr().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    ft(e, r), r.openedBy(n);
    return;
  }
  await br(e, i, t);
}
async function ft(e, t) {
  t.state = "loading";
  const n = await vr().catch(() => null);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = je(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
  t.entries = [
    ...a.map((u) => gn(u, g("viewAsUser.recent"), i)),
    ...c.map((u) => gn(u, g("viewAsUser.all"), i))
  ];
}
function gn(e, t, n) {
  const r = e.groups.map((o) => ({ id: String(o), title: n[String(o)]?.title ?? "", depth: 0 })).filter((o) => o.title !== "").sort((o, i) => o.title.localeCompare(i.title));
  return {
    id: String(e.id),
    title: e.realName === "" ? e.username : e.realName,
    subtitle: e.realName === "" ? "" : e.username,
    note: aa(r.length),
    detail: r,
    detailHeading: la(r.length),
    heading: t
  };
}
function aa(e) {
  return e === 0 ? "" : W("viewAsUser.groups", e, e);
}
function la(e) {
  return e === 0 ? g("viewAsUser.detail.none") : W("viewAsUser.detail", e, e);
}
async function br(e, t, n) {
  Nt(pt), Ws(String(t)), Ks(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await pe(dt, { place: kn(e), document: ht(e) });
  const r = Vs(String(t));
  gr(Hs(String(t)), r), ca(t, n, r);
}
function ca(e, t, n) {
  Or(document), pr(document, "down", () => {
    t.handOver(B(I.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function vn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Dr(e.signal), Br(document, e.signal), Fs(document, e.signal), Hr(document, e.signal), as(e.signal), ss(e.signal);
  const t = uo();
  lo(t, e.signal);
  const n = co();
  vo(n, e.signal), yo(n, e.signal), Oo(t, e.signal), No(e.signal), Jo(document, e.signal), Si(document, e.signal), Zo(e.signal), ti(e.signal), si(e.signal), li(e.signal), Hi(document, e.signal), qs(document, e.signal), Ls(document, e.signal), Xi(document, e.signal), Zi(document, e.signal), Po(document, e.signal), Oi(document, e.signal), ms(document, e.signal), is(document, e.signal), Mo(document, e.signal), Bo(e.signal), Os(document, e.signal), $s(document, e.signal), _s(e.signal), Ts(e.signal), fs(e.signal), Ss(document, e.signal);
  const r = ra(document, e.signal);
  Ys(document, e.signal), r ? Bs(document) : (Js(document), Us(document)), Ps(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", vn, { once: !0 }) : vn();
//# sourceMappingURL=main.js.map
