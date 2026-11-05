import _e from "@typo3/backend/storage/persistent.js";
import { LitElement as gr, html as I } from "lit";
import ie from "@typo3/core/ajax/ajax-request.js";
import vr from "@typo3/backend/login-refresh.js";
import Je from "@typo3/backend/notification.js";
import { sudoModeInterceptor as br } from "@typo3/backend/security/sudo-mode-interceptor.js";
import Ft from "@typo3/backend/modal.js";
import { FileStorageTree as yr } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as wr } from "@typo3/backend/tree/page-tree.js";
import Be from "@typo3/backend/module-menu.js";
import { ModuleStateStorage as kr } from "@typo3/backend/storage/module-state-storage.js";
import re from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as Ar } from "@typo3/core/java-script-item-processor.js";
import $r from "@typo3/backend/viewport.js";
import Qe, { ModifierKeys as hn } from "@typo3/backend/hotkeys.js";
const d = {
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
  granted: "vperm-granted",
  grantedFrom: "vperm-granted-from",
  grantedGroup: "vperm-granted-group",
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
  tabBar: "vperm-tab-bar",
  tabCard: "vperm-tab-card",
  tabGive: "vperm-tab-give",
  tabLabel: "vperm-tab-label",
  tabSeam: "vperm-tab-seam",
  tableGate: "vperm-table-gate",
  tableGive: "vperm-table-give",
  tableName: "vperm-table-name",
  tableNote: "vperm-table-note",
  tableTake: "vperm-table-take",
  tableToken: "vperm-table-token",
  turning: "vperm-turning",
  unseenPages: "vperm-unseen-pages",
  viewAsControls: "vperm-view-as-controls"
}, oe = {
  folderTree: "vperm-folder-tree",
  pageTree: "vperm-page-tree",
  picker: "vperm-picker"
};
function Sr(e) {
  return e.body.hasAttribute(d.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function Er(e) {
  e.body.setAttribute(d.handingOver, "");
}
function gn(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function vn(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function Cr(e, t) {
  const n = ue(e);
  n !== null && e.addEventListener(
    "typo3-module-loaded",
    () => {
      n.setAttribute("endpoint", t);
    },
    { once: !0 }
  );
}
function ft(e) {
  return new URL(e.location.href).pathname.endsWith("/main") ? ue(e)?.getAttribute("endpoint") ?? "" : e.location.href;
}
function ue(e) {
  return e.querySelector("typo3-backend-module-router");
}
function mt(e) {
  const t = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(ft(e)));
  return t === null ? "" : t.slice(1).join(":");
}
function qr(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(ft(e)));
}
function bn(e) {
  const t = ft(e);
  if (t === "")
    return "";
  const n = new URL(t, e.location.origin), r = n.searchParams.get("returnUrl");
  if (r !== null) {
    const o = new URL(r, n.origin);
    return o.origin !== n.origin ? "" : (o.searchParams.delete("token"), o.href);
  }
  return n.searchParams.delete("token"), n.href;
}
let Xe = Promise.resolve();
function Ne(e, t) {
  const n = document, r = Xe.then(async () => {
    Sr(n) || await _e.set(e, t);
  });
  return Xe = r.catch(() => {
  }), r;
}
function Lr() {
  return Xe;
}
const yn = "vperm.session", wn = 1, ve = "modules", Or = "fields", Ze = /* @__PURE__ */ new Set();
let F = Pr();
document.addEventListener("typo3-module-loaded", () => {
  je({ ...F, face: "preview" });
});
function b() {
  return F;
}
function E(e, t) {
  Ze.add(e), t?.addEventListener("abort", () => Ze.delete(e));
}
function kn() {
  const e = F.groupId !== null, t = e ? Or : F.area;
  de({ ...F, active: e, open: F.open || e, area: t, picked: t });
}
function _r() {
  de({ ...F, open: !0 });
}
function Nr() {
  de({ ...F, open: !1, active: !1 });
}
function An() {
  de({ ...F, active: !1 });
}
function $n(e) {
  de({ ...F, area: e, picked: e, face: "preview" });
}
function xr(e) {
  je({ ...F, area: e });
}
function ce(e) {
  je({ ...F, face: e });
}
function ht(e) {
  de({ ...F, groupId: e, active: F.active && e !== null });
}
function de(e) {
  Ne(yn, {
    version: wn,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), je(e);
}
function je(e) {
  F = e;
  for (const t of Ze)
    t(F);
}
function Pr() {
  const e = _e.get(yn);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: ve, picked: ve, face: "preview" };
  const t = e;
  if (String(t.version) !== String(wn))
    return { open: !1, active: !1, groupId: null, area: ve, picked: ve, face: "preview" };
  const n = Number(t.groupId), r = typeof t.area == "string" && t.area !== "null" ? t.area : ve;
  return {
    open: String(t.open) === "true",
    active: String(t.active) === "true",
    groupId: Number.isInteger(n) && n > 0 ? n : null,
    area: r,
    picked: r,
    face: "preview"
  };
}
function Tr(e) {
  const t = () => {
    Mt(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && Mt(n);
  };
  t(), E(t, e);
}
function Mt(e) {
  const t = b();
  if (e.toggleAttribute(d.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(d.active, t.active), !t.active) {
    e.removeAttribute(d.picked), e.removeAttribute(d.face);
    return;
  }
  e.setAttribute(d.picked, t.area), e.setAttribute(d.face, t.face);
}
const Fr = (e) => `${e}, .scaffold-modulemenu`;
function Sn(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Fr(".scaffold-sidebar"));
  if (r == null || o === null)
    return;
  const i = () => {
    r.style.flexBasis = "";
    const a = En(e), c = Number.parseFloat(getComputedStyle(t).marginInlineStart), u = o.getBoundingClientRect().right - a - r.getBoundingClientRect().left - c;
    u > 0 && (r.style.flexBasis = `${String(u)}px`);
  };
  i();
  const s = new ResizeObserver(i);
  s.observe(o), n.addEventListener("abort", () => {
    s.disconnect();
  });
}
const En = (e) => Number.parseFloat(getComputedStyle(e.body).getPropertyValue("--vperm-divider")) || 0;
function Mr(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${d.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), Sn(e, r, t);
  const o = e.querySelector(`[${d.toolbar}]`), i = () => b().open || b().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), E(s, t), o?.addEventListener("click", () => {
    i() ? Nr() : _r(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function gt(e) {
  return JSON.parse(e.querySelector(`[${d.groups}]`)?.getAttribute(d.groups) ?? "{}");
}
function X(e, t) {
  return gt(e)[String(t)]?.title ?? null;
}
function h(e) {
  return TYPO3.lang[e] ?? "";
}
const Cn = 220, Ir = 1300;
function Le(e, t) {
  const n = e.ownerDocument, r = n.createElement("span");
  r.className = l.faceTally;
  const o = O(n, l.faceCounted, ""), i = O(n, l.faceWaiting, "");
  r.append(o, i);
  const s = Y(n, h("platform.cancel"), `btn btn-default ${l.faceCancel}`, t.cancel), a = Y(n, t.label, `btn btn-primary ${l.faceApply}`, t.apply);
  return e.replaceChildren(r, s, a), {
    state: o,
    waiting: i,
    ready: (c, u) => {
      a.toggleAttribute("disabled", !c), s.toggleAttribute("disabled", !u);
    }
  };
}
function vt(e, t) {
  t !== "cancelled" && (e.state.textContent = h(`platform.${t}`));
}
function qn(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = O(e, l.faceEyebrow, ""), o = O(e, l.faceSentence, ""), i = e.createElement("div");
  i.className = l.faceBar, i.append(r, o);
  const s = e.createElement("div");
  s.className = l.faceScroll;
  const a = e.createElement("div");
  return a.className = l.faceFoot, n.append(i, s, a), { sheet: n, bar: i, eyebrow: r, sentence: o, scroll: s, foot: a };
}
function Ln(e) {
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
        }, Ir));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function On(e, t, n) {
  E(() => {
    b().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function bt(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !Dr(e) && r();
  }, { signal: t });
}
const Dr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
function Y(e, t, n, r, o) {
  const i = e.createElement("button");
  if (i.type = "button", i.className = n, i.textContent = t, i.addEventListener("click", r), o !== void 0) {
    const s = e.createElement("typo3-backend-icon");
    s.setAttribute("identifier", o), s.setAttribute("size", "small"), i.prepend(s, " ");
  }
  return i;
}
function O(e, t, n) {
  const r = e.createElement("span");
  return r.className = t, r.textContent = n, r;
}
function W(e, t, ...n) {
  return x(h(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function x(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, String(r)).replace("%s", String(r)),
    e
  );
}
const It = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Rr(e, t, n, r) {
  const o = [e];
  let i = It(r, e) ? 2 : 0, s = e + 1;
  for (let a = 1; a < t.length; a += 1) {
    const c = n.indexOf(t.charAt(a), s);
    if (c === -1)
      return null;
    c === s && (i += 4), It(r, c) && (i += 2), o.push(c), s = c + 1;
  }
  return { score: e === 0 ? i + 2 : i, at: o };
}
function Dt(e, t) {
  if (e === "")
    return { score: 0, at: [] };
  const n = e.toLowerCase(), r = t.toLowerCase(), o = n.charAt(0);
  let i = null;
  for (let s = r.indexOf(o); s !== -1; s = r.indexOf(o, s + 1)) {
    const a = Rr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const Rt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Br = 70, Ge = 50;
class jr extends gr {
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
      this.toggleAttribute(d.byKey, !1);
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
    return I`
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
      return I`
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
    const t = _e.get(this.remembers);
    return typeof t == "string" ? t : "";
  }
  remember() {
    this.remembers !== "" && Ne(this.remembers, this.query);
  }
  nothingToShow(t) {
    return this.state === "loading" ? I`<p>${this.words.loading}</p>` : this.state === "failed" ? I`
        <p>${this.words.failed}</p>
        <button type="button" class="btn btn-default btn-sm"
                @click=${() => {
      this.dispatchEvent(new CustomEvent("vperm:retry"));
    }}>
          ${this.words.retry}
        </button>
      ` : t.length === 0 ? I`<p>${this.words.empty}</p>` : "";
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
    return t === void 0 ? I`` : I`
      <div class=${l.pickerDetail}>
        <div class=${l.pickerHead}>
          <strong>${t.title}</strong>
          <p>${t.detailHeading}</p>
        </div>
        <div role="listbox" tabindex="-1">
          ${t.detail.map((n, r) => I`
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
    this.hasAttribute(d.byKey) || (this.stopSettling(), this.settling = window.setTimeout(() => {
      this.active = t, this.inPane = !1;
    }, Br));
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
    t.preventDefault(), this.toggleAttribute(d.byKey, !0);
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
    return r === "" || r === n?.heading ? I`` : I`<p class="dropdown-header">${r}</p>`;
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
      return I`${n}`;
    const i = [];
    let s = 0;
    for (let a = 0; a < o.length; ) {
      let c = a;
      for (; c + 1 < o.length && o[c + 1] === (o[c] ?? 0) + 1; )
        c += 1;
      const u = o[a] ?? 0, p = (o[c] ?? 0) + 1;
      i.push(I`${n.slice(s, u)}<mark>${n.slice(u, p)}</mark>`), s = p, a = c + 1;
    }
    return I`${i}${n.slice(s)}`;
  }
}
customElements.get(oe.picker) === void 0 && customElements.define(oe.picker, jr);
function _n(e, t) {
  const n = e.createElement(oe.picker);
  return n.words = {
    ...t,
    countMany: h("platform.picker.count"),
    move: h("platform.picker.key.move"),
    close: h("platform.picker.key.close"),
    clear: h("platform.picker.key.clear"),
    retry: h("platform.picker.retry"),
    empty: h("platform.picker.empty")
  }, n;
}
const Ur = "vperm.groupSearch";
function Wr(e, t) {
  const n = e.querySelector(`[${d.group}]`);
  if (n === null)
    return;
  const r = _n(e, {
    totalOne: h("pickAGroup.total.one"),
    totalMany: h("pickAGroup.total.many"),
    take: h("pickAGroup.key.take"),
    detail: h("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  r.entries = Gr(e), r.remembers = Ur, r.placeholder = h("pickAGroup.search"), e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n);
  }, { signal: t });
  const o = n.textContent, i = () => {
    n.textContent = X(e, b().groupId) ?? o;
  };
  i(), E(i, t);
  const s = (a) => {
    ht(Number(a.detail.id));
  };
  r.addEventListener("vperm:picked", s, { signal: t }), r.addEventListener("vperm:detail-picked", s, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Gr(e) {
  return Object.entries(gt(e)).sort(([, t], [, n]) => t.title.localeCompare(n.title)).map(([t, n]) => ({
    id: t,
    title: n.title,
    subtitle: n.disabled ? h("pickAGroup.disabled") : "",
    note: Kr(n.inherits.length),
    detail: n.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: h(n.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  }));
}
function Kr(e) {
  return e === 0 ? "" : W("pickAGroup.inherits", e, e);
}
const Nn = (e) => `vperm:${e}`;
function J(e, t) {
  document.dispatchEvent(new CustomEvent(Nn(e), { detail: t }));
}
function K(e, t, n) {
  document.addEventListener(
    Nn(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function zr() {
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
const xn = zr();
function R(e, t) {
  xn.listen(e, t);
}
function Bt(e) {
  xn.tell(e);
}
function j(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
const M = {
  allow_file_operations: "visual_permissions_allow_file_operations",
  allow_page_types: "visual_permissions_allow_page_types",
  allow_values: "visual_permissions_allow_values",
  file_operations: "visual_permissions_file_operations",
  folder_tree: "visual_permissions_folder_tree",
  grant_fields: "visual_permissions_grant_fields",
  grant_modules: "visual_permissions_grant_modules",
  grant_tables: "visual_permissions_grant_tables",
  inspect: "visual_permissions_inspect",
  mount_folders: "visual_permissions_mount_folders",
  mount_pages: "visual_permissions_mount_pages",
  open_document: "visual_permissions_open_document",
  other_permissions: "visual_permissions_other_permissions",
  view_as_user: "visual_permissions_view_as_user",
  viewable_users: "visual_permissions_viewable_users",
  write_other_permissions: "visual_permissions_write_other_permissions"
};
let et = 0;
async function Z(e, t) {
  return et += 1, new ie(j(e)).addMiddleware(br).post(t).then(jt, jt).finally(() => {
    et -= 1;
  });
}
function yt() {
  return et > 0;
}
function jt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (vr.checkActiveSession(), "loggedOut") : Hr(t.status);
  } catch {
    return "failed";
  }
}
function Hr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function wt(e, t = []) {
  return kt(new ie(j(M.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function Ue() {
  let e = 0;
  return {
    inspect: async (t, n) => {
      const r = ++e, o = await wt(t, n);
      return r === e ? o : null;
    },
    // Stryker disable next-line AssignmentOperator: counting down works as well, since only "is this still the newest" is asked
    drop: () => {
      e += 1;
    }
  };
}
async function Pn(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await (await new ie(j(M.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()).resolve()).url ?? "";
}
async function kt(e) {
  try {
    return await (await e).resolve();
  } catch {
    return Je.error(h("platform.notRead")), null;
  }
}
const At = ["allowed", "allowedAndInherited", "inherited"], Vr = ["allowed", "denied"], H = "allowed", pe = "denied", $t = "inherited", St = "allowedAndInherited", We = "adminOnly";
function G(e) {
  return At.some((t) => t === e);
}
const Yr = [...At, pe];
function Et(e) {
  return Vr.includes(e);
}
function Ie(e) {
  return e.substring(0, e.indexOf(":"));
}
function Jr(e) {
  return e.substring(e.indexOf(":") + 1);
}
const Q = {};
function Qr(e, t) {
  Q.tables = e, t.addEventListener("abort", () => {
    delete Q.tables;
  });
}
function Xr(e, t) {
  Q.fields = e, t.addEventListener("abort", () => {
    delete Q.fields;
  });
}
function Zr(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${d.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(d.unseen);
  });
  const { active: n, area: r, face: o } = b();
  !n || r !== "fields" || (Q.tables?.hide(e, t, o), Q.fields?.hide(e, t, o), Ut(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${d.verdict}]`)].some((a) => a.closest(`[${d.unseen}]`) === null) || Ae(i);
  }), Ut(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${d.unseen}])`) === null && (Ae(i), Ae(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), eo(e), o === "preview" && to(e, t));
}
function Ae(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(d.unseen, "");
}
function Ut(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${d.verdict}]`)?.querySelector(`[${d.verdict}]`) !== null);
}
function eo(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(d.unseen) === !0 && e.querySelector(`.nav-item:not([${d.unseen}]) [data-typo3-tab]`)?.click();
}
function to(e, { tables: t, named: n }) {
  if (e.querySelector(`.form-section:not([${d.unseen}])`) !== null)
    return;
  const r = no(e), o = t[r], s = (G(o) ? Q.fields : Q.tables)?.explain(e, r, o, n[r] ?? r);
  s !== void 0 && (s.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(s));
}
function no(e) {
  const n = e.querySelector(`[${d.token}][${d.inside}='']`)?.getAttribute(d.token) ?? "";
  return Ie(n);
}
function ro(e, t) {
  let n = null;
  const r = Ue();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null;
  const i = () => {
    n !== null && Zr(n.doc, { tables: o?.targets ?? {}, named: o?.named ?? {} });
  }, s = async () => {
    if (n === null)
      return;
    const { fields: c } = n, { active: u, groupId: p } = b();
    if (!u || p === null) {
      r.drop(), c.forEach(([f]) => {
        f.removeAttribute(d.verdict), f.removeAttribute(d.outOfReach);
      }), o = null, i();
      return;
    }
    const m = [...new Set(c.map(([, f]) => Ie(f)))], v = await r.inspect(p, m);
    if (v === null)
      return;
    const { scopes: g } = v;
    e.take(v), c.forEach(([f, y]) => {
      const w = g.fields.targets[y];
      w !== void 0 && f.setAttribute(d.verdict, w), f.toggleAttribute(d.outOfReach, !G(g.tablesModify.targets[Ie(y)]));
    }), o = g.tablesModify, i(), J("fields-judged", {});
  };
  R(({ doc: c, fields: u }) => {
    r.drop(), c.body.style.setProperty("--vperm-inherited-note", `"${h("platform.from")}"`);
    const p = u.flatMap((m) => {
      const v = m.getAttribute(d.token);
      return v === null ? [] : [[m, v]];
    });
    n = p.length === 0 ? null : { doc: c, fields: p }, o = null, s();
  }, t), K("permissions-written", () => void s(), t);
  let a = null;
  E(({ active: c, groupId: u }) => {
    const p = `${String(c)}:${String(u)}`;
    if (p === a) {
      i();
      return;
    }
    a = p, s();
  }, t);
}
function oo() {
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
function io() {
  let e = [], t = {};
  return {
    givenBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.givenBy;
    }
  };
}
const Tn = (e) => e.map((t) => `[${d.verdict}='${t}']:not([${d.outOfReach}])`).join(","), so = (e) => Tn(e === "pick" ? Yr : At), tt = (e) => Tn([e === "pick" ? pe : H]), ao = `.${l.anchor}[${d.verdict}]`, lo = (e, t, n) => {
  const r = G(e.getAttribute(d.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(so(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(tt(n)),
    waiting: t ? h(n === "pick" ? "platform.toAdd" : "grantFields.toTakeAway") : ""
  };
}, co = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function uo(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(d.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (co(n), t.waiting === "") {
      n.removeAttribute(d.waiting);
      return;
    }
    n.setAttribute(d.waiting, t.waiting);
  }
}
function po(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = b();
    n.querySelectorAll(ao).forEach((a) => {
      uo(a, lo(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabGive}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const p = () => [...c.querySelectorAll(`[${d.inside}='']`)].filter((v) => v.matches(tt(a)) && !e.has(v)), m = u ?? i(s, c, p);
      m.disabled = p().length === 0;
    });
  }, i = (s, a, c) => {
    const u = s.createElement("button");
    return u.type = "button", u.className = `btn btn-default btn-sm ${l.tabGive}`, u.textContent = h("grantFields.grantTab"), u.addEventListener("click", () => {
      c().forEach((p) => {
        e.toggle(p);
      }), r();
    }), a.querySelector(":scope > .form-section")?.prepend(u), u;
  };
  R((s) => {
    const a = s.doc === n;
    if (n = s.doc, r(), a)
      return;
    const c = (u) => {
      const p = u.target, m = p.closest(`.${l.mark}`) === null ? p.closest(tt(b().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), K("fields-judged", r, t), E(r, t);
}
async function fo(e, t) {
  return Z(M.grant_fields, { group: e, operations: [...t] });
}
const Wt = 280;
function $e(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, Wt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, Wt * 2);
}
const Gt = `[${d.verdict}]:not([${d.outOfReach}])`, mo = [pe, We].map((e) => `:not([${d.verdict}='${e}'])`).join("");
function ho(e, t) {
  let n = null, r = null;
  const o = () => {
    if (n === null)
      return;
    const a = n.querySelector('form[name="editform"]');
    if (a === null)
      return;
    const { active: c, area: u, face: p, groupId: m } = b(), v = c && u === "fields";
    if (v && r?.form === a && r.face === p && r.groupId === m) {
      r.showCount();
      return;
    }
    n.querySelectorAll(`.${l.faceFoot}`).forEach((g) => {
      g.remove();
    }), r = null, v && a.querySelector(Gt) !== null && m !== null && (r = { form: a, face: p, groupId: m, showCount: i(a, p === "pick", m) });
  }, i = (a, c, u) => {
    let p = null;
    const m = a.ownerDocument.createElement("div");
    m.className = l.faceFoot;
    const v = () => [...a.querySelectorAll(`[${d.token}]`)].filter((w) => e.has(w)), g = () => {
      if (!c) {
        ce("preview");
        return;
      }
      $e(a.ownerDocument, () => {
        ce("preview");
      });
    }, f = Le(m, {
      label: h(c ? "platform.doAdd" : "platform.doRemove"),
      cancel: () => {
        e.drop(), g();
      },
      apply: () => {
        const w = v().map((S) => ({ field: S.getAttribute(d.token) ?? "", grant: c }));
        yt() || fo(u, w).then((S) => {
          if (b().groupId !== u) {
            S === "taken" && J("permissions-written", {});
            return;
          }
          if (S !== "taken") {
            vt(f, S), p = w.length;
            return;
          }
          e.drop(), g(), J("permissions-written", {});
        });
      }
    }), y = () => {
      const w = [...a.querySelectorAll(Gt)].filter((N) => N.closest(`.${l.otherKinds}`) === null), S = w.filter((N) => N.matches(mo)), _ = v().length;
      p !== _ && (p = null, f.state.textContent = W("grantFields.tally", w.length, S.length, w.length), f.waiting.textContent = _ === 0 ? "" : W(`grantFields.${c ? "waiting" : "going"}`, _, _), f.ready(_ > 0, c || _ > 0));
    };
    return y(), a.append(m), y;
  }, s = () => {
    r?.showCount();
  };
  R((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), K("fields-judged", o, t), E(o, t);
}
const go = `.${l.anchor}[${d.verdict}]`, vo = 350, bo = 250, nt = (e) => e.getAttribute(d.verdict) ?? "", yo = (e) => e.getAttribute(d.token) ?? "", wo = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), rt = (e) => h(`grantFields.mark.${e}.title`), ko = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return b().face === "pick" ? h(t ? "grantFields.hint.leave" : "grantFields.hint.give") : h(t ? "grantFields.hint.keep" : "grantFields.hint.take");
};
function Ao(e, t) {
  if (t.length === 0)
    return [];
  const n = e.ownerDocument, r = n.createElement("h3");
  r.textContent = h("grantFields.givenBy");
  const o = n.createElement("ul");
  o.append(...t.map((s) => {
    const a = n.createElement("span");
    a.textContent = s.title;
    const c = n.createElement("button");
    c.type = "button", c.className = "btn btn-default btn-sm", c.textContent = h("grantFields.showGroup"), c.setAttribute("aria-label", x(h("grantFields.showGroupNamed"), s.title)), c.addEventListener("click", () => {
      e.hidePopover(), ht(s.groupId);
    });
    const u = n.createElement("li");
    return u.append(a, c), u;
  }));
  const i = n.createElement("section");
  return i.append(r, o), [i];
}
function $o(e, t, n) {
  const r = e.ownerDocument, o = nt(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = rt(o);
  const a = r.createElement("p");
  a.textContent = h(`grantFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...Ao(e, n));
  const p = ko(t);
  if (p !== "") {
    const m = r.createElement("footer");
    m.textContent = p, e.append(m);
  }
}
function So(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (m) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      m.hidePopover();
    }, bo);
  }, c = (m) => {
    const v = s.get(m);
    if (v !== void 0)
      return v;
    const g = m.createElement("div");
    return g.className = l.markCard, g.id = l.markCard, g.toggleAttribute("popover", !0), g.setAttribute("role", "dialog"), g.setAttribute("aria-labelledby", `${l.markCard}-title`), g.addEventListener("mouseenter", () => {
      window.clearTimeout(r);
    }), g.addEventListener("mouseleave", () => {
      a(g);
    }), g.addEventListener("beforetoggle", (f) => {
      o = f.newState === "open", !o && (i?.setAttribute("aria-expanded", "false"), g.contains(m.activeElement) && i?.focus());
    }), m.body.append(g), s.set(m, g), g;
  }, u = (m, v) => {
    window.clearTimeout(r);
    const g = c(m.ownerDocument);
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = m, m.style.setProperty("anchor-name", "--vperm-mark"), m.setAttribute("aria-expanded", "true"), $o(g, v, e.givenBy(yo(v))), g.showPopover();
  }, p = () => {
    n.querySelectorAll(go).forEach((m) => {
      const v = wo(m);
      if (v === null)
        return;
      const g = v.querySelector(`.${l.mark}`);
      if (g !== null) {
        g.setAttribute("aria-label", rt(nt(m)));
        return;
      }
      const f = v.ownerDocument.createElement("button");
      f.type = "button", f.className = l.mark, f.setAttribute("aria-label", rt(nt(m))), f.setAttribute("aria-haspopup", "dialog"), f.setAttribute("aria-controls", l.markCard), f.setAttribute("aria-expanded", "false"), f.addEventListener("click", (y) => {
        u(f, m), y.detail === 0 && c(f.ownerDocument).querySelector("button")?.focus();
      }), f.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          u(f, m);
          return;
        }
        r = window.setTimeout(() => {
          u(f, m);
        }, vo);
      }), f.addEventListener("mouseleave", () => {
        a(c(f.ownerDocument));
      }), v.append(f);
    });
  };
  R((m) => {
    n = m.doc;
  }, t), K("fields-judged", p, t);
}
function Eo(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      Co(r);
    });
  };
  R((r) => {
    t = r.doc, n();
  }, e), K("fields-judged", n, e);
}
function Co(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${d.token}]:not([${d.outOfReach}])`) === null);
}
const qo = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Pe = (e) => `${e}, ${qo[e]}`, Fn = [
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
function Kt(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(d.area), t.removeAttribute(d.ground);
  });
}
function Mn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Lo(e, t) {
  const n = (i) => {
    if ((i.active ? X(e, i.groupId) : null) === null) {
      Kt(e);
      return;
    }
    const a = Fn.flatMap((c) => {
      const u = Mn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Kt(e), a.forEach(({ element: c, key: u, ground: p }) => {
      c.classList.add(l.frame), c.setAttribute(d.area, u), c.setAttribute(d.ground, p), _o(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Oo(e) && n(b());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(b()), E(n, t);
}
function Oo(e) {
  return Fn.some((t) => {
    const n = Mn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(d.area) !== t.key);
  });
}
function _o(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const No = "typo3-backend-contextual-record-edit-trigger";
function xo(e, t) {
  let n = null;
  const r = (u) => {
    const p = u.target.closest(No);
    !b().active || p === null || (u.preventDefault(), u.stopPropagation(), ue(e)?.setAttribute("endpoint", p.getAttribute("edit-url") ?? ""));
  };
  e.addEventListener("click", r, { capture: !0, signal: t });
  const o = () => {
    const { active: u, area: p } = b();
    return u && p === "fields";
  }, i = (u) => {
    o() && u.preventDefault();
  }, s = (u) => {
    u.target.closest(`.${l.anchor}`) !== null && i(u);
  }, a = `.${l.anchor} :is(input,select,textarea,button,[contenteditable]):not(.${l.tableGate} *):not(.${l.mark})`, c = () => {
    const u = o();
    n?.querySelectorAll(a).forEach((p) => {
      p.toggleAttribute("inert", u);
    });
  };
  R((u) => {
    n = u.doc, n.addEventListener("submit", i, { capture: !0, signal: t }), n.addEventListener("click", s, { capture: !0, signal: t }), n.addEventListener("click", r, { capture: !0, signal: t }), c();
  }, t), E(c, t);
}
async function Po(e, t) {
  return Z(M.grant_modules, { group: e, operations: [...t] });
}
const In = "data-modulemenu-identifier", De = `[${In}]:not([aria-controls])`, Dn = ".modulemenu-group-container";
let be = !1;
const ot = /* @__PURE__ */ new WeakMap();
let le = null;
const ye = Ln(560);
function To(e, t) {
  const n = b().groupId, r = X(e, n) ?? "", o = [...t.querySelectorAll(De)], i = o.filter((A) => G(z(A))), s = o.filter((A) => z(A) === H), a = zt(e, l.facePreview, h("platform.preview"), x(h("grantModules.previewFor"), r)), c = zt(e, l.facePick, h("platform.pick"), x(h("grantModules.pickFor"), r)), p = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  p.className = l.coin, p.replaceChildren(a.sheet, c.sheet);
  const v = e.querySelector(`.${l.granted}`) ?? e.createElement("div");
  v.className = l.granted, p.parentElement !== v && v.replaceChildren(p);
  const g = Mo(e, t);
  v.parentElement !== g && g.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    g.classList.add(l.panelCardTurned);
  });
  const f = (A) => {
    be = A, p.classList.toggle(l.coinTurned, A), a.sheet.toggleAttribute("inert", A), c.sheet.toggleAttribute("inert", !A);
  }, y = (A) => {
    const P = A.filter((L) => L.grant).map((L) => L.module);
    n !== null && b().groupId === n && (yt() || (P.forEach((L) => {
      ye.add(L);
    }), Po(n, A).then((L) => {
      if (L !== "taken") {
        P.forEach((k) => {
          ye.delete(k);
        }), vt(be ? _ : w, L);
        return;
      }
      f(!1), J("permissions-written", {});
    })));
  }, w = Le(a.foot, {
    label: h("platform.doRemove"),
    cancel: () => {
      Ke(a.scroll).forEach((A) => {
        A.classList.remove(l.faceMarked);
      }), N();
    },
    apply: () => {
      y(Ke(a.scroll).map((A) => ({ module: ze(A), grant: !1 })));
    }
  }), S = () => {
    Ht(c.scroll, t, N), N(), f(!1);
  }, _ = Le(c.foot, {
    label: h("platform.doAdd"),
    cancel: S,
    apply: () => {
      const A = Vt(c.scroll).filter((P) => z(P) !== ot.get(P));
      y(A.map((P) => ({ module: ze(P), grant: !0 })));
    }
  }), N = () => {
    const A = Vt(c.scroll), P = A.filter((q) => z(q) !== ot.get(q)), L = A.filter((q) => G(z(q)) && !P.includes(q)), k = W("grantModules.tally", A.length, L.length, A.length), T = Ke(a.scroll);
    w.state.textContent = T.length === 0 ? k : W("grantModules.marked", s.length, T.length, s.length), w.ready(T.length > 0, T.length > 0), _.state.textContent = k, _.waiting.textContent = P.length === 0 ? "" : x(h("platform.waiting"), P.length), _.ready(P.length > 0, !0);
  };
  a.bar.append(
    Y(e, h("grantModules.add"), "btn btn-default", () => {
      f(!0);
    }),
    O(e, l.faceHint, h("grantModules.hint"))
  ), c.scroll.style.setProperty("--vperm-queued-note", `"${h("platform.toAdd")}"`), Io(e, a.scroll, i, h("platform.from"), N), Ht(c.scroll, t, N), N(), f(be), ye.start(() => {
    p.querySelectorAll(`.${l.facePreview} ${De}`).forEach((A) => {
      A.classList.toggle(l.justAdded, ye.isLit(ze(A)));
    });
  }), le?.abort(), le = new AbortController(), bt(e, le.signal, () => be, S), On(n, [w, _], le.signal);
}
function Fo(e, t) {
  le?.abort(), le = null, be = !1, ye.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.granted}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, Cn);
  }));
}
function Mo(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function zt(e, t, n, r) {
  const o = qn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function Io(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(Dn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(O(e, l.grantedGroup, a)));
    const c = Bo(s);
    c.getAttribute(d.verdict) === H ? Bn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(O(e, l.grantedFrom, r)), t.append(c);
  });
}
function Ht(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(Dn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(De).forEach((r) => {
    Rn(r), ot.set(r, z(r)), G(z(r)) && r.setAttribute("aria-disabled", "true"), Bn(r, () => {
      Ro(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(O(r.ownerDocument, l.grantedGroup, r.getAttribute("title") ?? ""));
  });
}
function Do(e) {
  const t = z(e);
  return e.getAttribute("aria-disabled") === "true" || !Et(t) ? "" : G(t) ? "unpick" : "grant";
}
function Ro(e) {
  const t = Do(e);
  t !== "" && e.setAttribute(d.verdict, t === "grant" ? H : pe);
}
function Rn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function Bo(e) {
  const t = e.cloneNode(!0);
  return Rn(t), t;
}
function Bn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function Ke(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function Vt(e) {
  return [...e.querySelectorAll(De)].filter((t) => Et(z(t)));
}
const z = (e) => e.getAttribute(d.verdict) ?? "", ze = (e) => e.getAttribute(In) ?? "", He = "#modulemenu", jn = "data-modulemenu-identifier", jo = `[${jn}]:not([aria-controls])`;
function Uo(e, t) {
  const n = Ue(), r = async () => {
    const { active: i, groupId: s, area: a } = b();
    if (!i || s === null || a !== "modules") {
      n.drop(), e.querySelectorAll(`${He} [${d.verdict}]`).forEach((v) => {
        v.removeAttribute(d.verdict);
      }), o(e);
      return;
    }
    const c = e.querySelector(He);
    if (c === null)
      return;
    const u = [...c.querySelectorAll(jo)];
    if (u.length === 0)
      return;
    const p = await n.inspect(s);
    if (p === null)
      return;
    const { scopes: m } = p;
    Object.entries(m.modules.targets).forEach(([v, g]) => {
      u.filter((f) => f.getAttribute(jn) === v).forEach((f) => {
        f.setAttribute(d.verdict, g);
      });
    }), To(e, c);
  }, o = (i) => {
    const s = i.querySelector(He);
    s !== null && Fo(i, s);
  };
  r(), K("permissions-written", () => void r(), t), E(() => void r(), t);
}
async function Wo(e, t, n) {
  const r = await Z(M.grant_tables, { group: e, operations: [{ table: t, grant: n }] });
  return r === "taken" && J("permissions-written", {}), r;
}
function Un(e, { groupId: t, table: n, called: r, verdict: o }) {
  const i = o === H, s = o === $t || o === St, a = o === We, c = e.createElement("div");
  c.className = `callout callout-notice callout-sm ${l.tableGate}`, c.append(O(e, l.tableName, r)), c.append(O(e, l.tableToken, n));
  const u = O(e, "callout-body", h(Go(o)));
  if (c.append(u), !s && !a) {
    const p = Y(
      e,
      x(h(i ? "grantTables.take" : "grantTables.give"), r),
      `btn btn-default btn-sm ${i ? l.tableTake : l.tableGive}`,
      () => {
        p.toggleAttribute("disabled", !0), Wo(t, n, !i).then((m) => {
          p.toggleAttribute("disabled", !1), m !== "taken" && m !== "cancelled" && (u.textContent = h(`platform.${m}`));
        });
      }
    );
    c.append(p);
  }
  return c;
}
function Go(e) {
  return e === H ? "grantTables.theirs" : e === We ? "grantTables.adminOnly" : e === St ? "grantTables.alsoHandedDown" : e === $t ? "grantTables.handedDown" : "grantTables.missing";
}
const Yt = ".typo3-TCEforms";
function Ko(e) {
  let t = null;
  const n = Ue(), r = async () => {
    if (t === null)
      return;
    const o = t;
    o.querySelectorAll(`.${l.tableGate}:not(.${l.nothingTheirs})`).forEach((g) => {
      g.remove();
    });
    const { active: i, area: s, face: a, groupId: c } = b();
    if (!i || s !== "fields" || a !== "pick" || c === null) {
      n.drop();
      return;
    }
    const u = /* @__PURE__ */ new Map();
    o.querySelectorAll(`[${d.inside}]`).forEach((g) => {
      const f = g.getAttribute(d.inside) ?? "", y = f === "" ? g.closest(Yt) : o.querySelector(`[${d.field}='${f}']`), w = g.getAttribute(d.token) ?? "";
      y !== null && u.set(y, Ie(w));
    });
    const p = await n.inspect(c, [...new Set(u.values())]);
    if (p === null)
      return;
    const { named: m, targets: v } = p.scopes.tablesModify;
    u.forEach((g, f) => {
      const y = v[g];
      if (![H, $t, St, pe].some((_) => _ === y))
        return;
      const w = Un(o, { groupId: c, table: g, called: m[g] ?? g, verdict: y }), S = f.matches(Yt) ? null : f.querySelector(".form-irre-object");
      if (S === null) {
        f.prepend(w);
        return;
      }
      S.before(w);
    });
  };
  R((o) => {
    t = o.doc, r();
  }, e), K("permissions-written", () => void r(), e), E(() => void r(), e);
}
const zo = ".form-group";
function Wn(e) {
  return e.closest(zo);
}
function Ho(e) {
  Qr({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !G(s)).forEach(([s]) => {
        t.querySelectorAll(`[${d.token}^='${s}:']`).forEach((a) => {
          Ae(a.closest(i) ?? Wn(a) ?? a);
        }), o === "preview" && Vo(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o) => Un(t, { groupId: b().groupId ?? 0, table: n, called: o, verdict: r })
  }, e);
}
function Vo(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${d.token}^='${t}:']:not([${d.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(d.inside) ?? "", s = e.querySelector(`[${d.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(O(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      x(h("grantTables.gone"), n)
    ));
  });
}
function Gn(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${h("platform.from")}"`), e.groups.forEach(({ label: v, values: g }) => {
    const f = document.createElement("section"), y = document.createElement("h2");
    y.textContent = v;
    const w = document.createElement("div");
    w.append(...g.map((S) => Jo(S, n.has(S.value), o.has(S.value)))), f.append(y, w), i.append(f);
  });
  const s = O(document, l.faceWaiting, ""), a = () => [...i.querySelectorAll("input")].filter((v) => v.checked !== n.has(v.value)).map((v) => ({ value: v.value, grant: v.checked })), c = {
    text: h("platform.cancel"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: "btn-default",
    name: "cancel",
    trigger: (v, g) => {
      g.hideModal();
    }
  }, u = {
    text: h("platform.doApply"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: "btn-primary",
    name: "apply",
    trigger: (v, g) => {
      g.querySelector('button[name="apply"]')?.toggleAttribute("disabled", !0), r(a()).then((f) => {
        if (f) {
          g.hideModal();
          return;
        }
        m();
      });
    }
  }, p = Ft.advanced({
    title: x(e.title, t),
    content: i,
    size: Ft.sizes.large,
    buttons: [c, u]
  }), m = () => {
    p.updateComplete.then(() => {
      p.querySelector('button[name="apply"]')?.toggleAttribute("disabled", a().length === 0);
    });
  };
  m(), p.updateComplete.then(() => {
    p.querySelector(".modal-footer")?.prepend(s);
  }), i.addEventListener("change", () => {
    const v = a(), g = v.filter(({ grant: f }) => f).length;
    s.textContent = Yo(g, v.length - g), m();
  });
}
function Yo(e, t) {
  return [
    ...e > 0 ? [x(h("platform.waiting"), e)] : [],
    ...t > 0 ? [x(h("platform.going"), t)] : []
  ].join(`
`);
}
function Jo({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function Qo(e, t, n) {
  return Z(e === "pageTypes" ? M.allow_page_types : M.allow_values, {
    group: t,
    operations: [...n]
  });
}
function Xo(e) {
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
    t.querySelectorAll(`[${d.allows}]`).forEach((i) => {
      if (i.nextElementSibling?.classList.contains(l.allowChoose) === !0)
        return;
      const s = i.getAttribute(d.token) ?? "", a = i.ownerDocument.createElement("button");
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = h(`allowedValues.choose.${Jr(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(d.choices) ?? "{}"), u = b().groupId ?? 0;
        wt(u).then((p) => {
          if (p === null)
            return;
          const m = i.getAttribute(d.allows) === "pageTypes" ? "pageTypes" : "fieldValues", v = m === "pageTypes" ? "" : `${s}:`, g = new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => G(f)).map(([f]) => f.substring(v.length)));
          Gn(c, X(document, u) ?? "", g, async (f) => await Qo(m, u, f.map(({ value: w, grant: S }) => ({ value: `${v}${w}`, grant: S }))) !== "taken" ? !1 : (J("permissions-written", {}), !0), new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => G(f) && f !== H).map(([f]) => f.substring(v.length))));
        });
      }), i.after(a);
    });
  };
  R((r) => {
    t = r.doc, n();
  }, e), E(n, e);
}
const Zo = `[${d.verdict}='${pe}'], [${d.verdict}='${We}']`;
function ei(e) {
  Xr({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(Zo).forEach((o) => {
        Ae(Wn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        O(t, "callout-body", x(h("grantFields.recordNoFields"), o)),
        Y(t, h("recordForm.add"), "btn btn-default btn-sm", () => {
          $e(t, () => {
            ce("pick");
          });
        })
      ), i;
    }
  }, e);
}
async function ti(e, t) {
  const n = await wt(e);
  if (n === null)
    return;
  const r = await kt(new ie(j(M.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  Gn(r, t, o, async (i) => await Z(M.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (J("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== H).map(([i]) => i)));
}
const Kn = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: oe.folderTree,
  base: yr,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = j(M.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: j("filestorage_tree_rootline"),
      filterUrl: j("filestorage_tree_filter"),
      showIcons: !0
    };
  },
  write: async (e, t, n, r) => Z(M.mount_folders, {
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
    h("mountBranches.folders.chooseOperations"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    "btn btn-default",
    () => {
      ti(t, X(e, t) ?? "");
    }
  )
}, zn = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: oe.pageTree,
  base: wr,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => (await new ie(j("page_tree_browser_configuration")).get()).resolve(),
  write: async (e, t, n) => Z(M.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function ni(e, t) {
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
function ri(e) {
  const t = /* @__PURE__ */ new Map();
  return Hn(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function oi(e, t) {
  const n = Hn(e);
  return n.forEach((r, o) => {
    const i = r.parentElement, s = i?.querySelector(`.${l.namingWhy}`) ?? null;
    if (r.value.trim() === "") {
      const a = s ?? O(e.ownerDocument, l.namingWhy, t);
      a.id = `${l.namingWhy}-${String(o)}`, i?.append(a), r.setAttribute("aria-invalid", "true"), r.setAttribute("aria-describedby", a.id);
      return;
    }
    s?.remove(), r.removeAttribute("aria-invalid"), r.removeAttribute("aria-describedby");
  }), n.every((r) => r.value.trim() !== "");
}
const Hn = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Se = Ln(520), D = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set(), Re = /* @__PURE__ */ new Set(), it = /* @__PURE__ */ new Set(), Vn = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, Yn = (e) => U.has(e) && !Re.has(e), Jn = (e) => e.__parents ?? [], we = (e) => Jn(e).some((t) => U.has(t)), ii = (e, t) => t.some((n) => U.has(n.identifier) && Jn(n).includes(e.identifier)), Qn = (e) => e.detail;
function si(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = Qn(o);
    s === !1 || Vn(i.identifier) || U.has(i.identifier) || we(i) || (B.has(i.identifier) ? B.delete(i.identifier) : B.add(i.identifier), t(), Ve(Me(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Me(e);
    o !== null && (!Oe.has(o) || e.querySelector(".node[data-id='0']") !== null) && Ve(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), Ve(Me(e));
}
function ai(e) {
  const t = Me(e);
  if (t === null)
    return;
  const n = Oe.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), Oe.delete(t), t.requestUpdate());
}
function Ve(e) {
  if (e !== null) {
    if (Jt(e.nodes), !Oe.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      Oe.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => Jt(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return U.has(r.identifier) && o.push(l.mountAlready), B.has(r.identifier) && o.push(l.mountPicked), Vn(r.identifier) && o.push(l.mountWhole), o;
      };
    }
    e.requestUpdate();
  }
}
function Jt(e) {
  return e.filter((t) => Number(t.identifier) < 1).forEach((t) => {
    t.__hidden = !0;
  }), e;
}
const Oe = /* @__PURE__ */ new WeakMap(), Me = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let Ye = "", Qt = () => {
};
async function li(e, t, n, { groupId: r, kind: o, showCount: i }) {
  Qt = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), Ye = s;
    return;
  }
  const a = o.tree;
  if (ci(a, o.base), t.querySelector(a) !== null && Ye === s)
    return;
  const u = await o.rootedAt(r), p = e.createElement(a);
  p.addEventListener("mousedown", (v) => {
    const g = v.target instanceof Element ? v.target.closest(".node") : null;
    g !== null && (Yn(g.getAttribute("data-id") ?? "") || v.preventDefault());
  }), p.addEventListener("typo3:tree:node-selected", (v) => {
    v.stopPropagation();
    const { node: g, propagate: f } = Qn(v);
    f !== !1 && (D.has(g.identifier) ? D.delete(g.identifier) : D.add(g.identifier), st(e), Qt());
  }), Object.assign(p, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(p), t.replaceChildren(m), Ye = s, Object.assign(p, { setup: u });
}
function st(e) {
  e.querySelector(
    `.${l.facePreview} :is(${oe.pageTree}, ${oe.folderTree})`
  )?.requestUpdate();
}
function ci(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return Yn(n.identifier);
    }
    // Closed row hides mount; ensure rows are open before drawing mounts
    prepareNodes(n) {
      const r = super.prepareNodes(n);
      return r.forEach((o) => {
        we(o) || U.has(o.identifier) || (o.__expanded = !0, o.__hidden = !ii(o, r));
      }), r;
    }
    hideChildren(n) {
      !we(n) && !U.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return we(n) && r.push(l.mountInside), !we(n) && !U.has(n.identifier) && r.push(l.mountContext), Re.has(n.identifier) && r.push(l.mountInherited), D.has(n.identifier) && r.push(l.faceMarked), it.has(n.identifier) && r.push(l.mountUnseen), Se.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function ui(e, t, n, r) {
  const o = (u) => h(`${r}.${u}`);
  if (t.sheet.querySelector(`.${l.unseenPages}`)?.remove(), n.length === 0)
    return;
  const i = e.createElement("div");
  i.className = l.unseenPages;
  const s = e.createElement("b");
  s.textContent = W(`${r}.unseen`, n.length, n.length);
  const a = e.createElement("p");
  a.append(s, ` ${o("unseenWhy")}`);
  const c = e.createElement("ul");
  n.forEach(({ page: u, title: p, link: m }) => {
    const v = e.createElement("a");
    v.href = m, v.addEventListener("click", (f) => {
      f.preventDefault(), kr.update("web", u, !0), Be.App.showModule("permissions_pages");
    }), v.setAttribute("aria-label", x(o("unseenLink"), p)), v.textContent = x(o("unseenPage"), p);
    const g = e.createElement("li");
    g.append(v), c.append(g);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let ke = !1, at = null, Ee = null;
function di(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (k) => h(`${i}.${k}`), a = X(e, r) ?? "", c = fi(e, t);
  at !== r && (D.clear(), B.clear(), at = r), Ee?.abort(), Ee = new AbortController();
  const { signal: u } = Ee, p = Xt(e, c, l.facePick), m = Xt(e, c, l.facePreview);
  m.eyebrow.textContent = h("platform.preview"), m.sentence.textContent = x(s("previewFor"), a), p.eyebrow.textContent = h("platform.pick"), p.sentence.textContent = x(s("pickFor"), a);
  const v = n.order;
  U.clear(), Re.clear(), Object.entries(n.targets).forEach(([k, T]) => {
    U.add(k), Et(T) || (Re.add(k), D.delete(k));
  });
  const g = (k) => {
    m.sheet.toggleAttribute("inert", k), p.sheet.toggleAttribute("inert", !k);
  }, f = (k) => {
    ke = k, c.classList.toggle(l.panelCardTurned, !k), g(k);
  };
  g(ke);
  const y = () => {
    const k = W(`${i}.tally`, v.length, v.length);
    S.state.textContent = D.size === 0 ? k : W(`${i}.marked`, v.length, D.size, v.length), S.ready(D.size > 0, D.size > 0), L.state.textContent = k, L.waiting.textContent = B.size === 0 ? "" : x(h("platform.waiting"), B.size), L.ready(B.size > 0, !0);
  }, w = (k, T) => {
    if (b().groupId !== r)
      return;
    const q = [...k];
    if (q.length === 0 || yt())
      return;
    const V = o.write(r, q, T, ri(p.sheet));
    T && q.forEach((ee) => {
      Se.add(ee);
    }), V.then((ee) => {
      if (ee !== "taken") {
        q.forEach((se) => {
          Se.delete(se);
        }), vt(T ? L : S, ee);
        return;
      }
      q.forEach((se) => k.delete(se)), N(), f(!1), J("permissions-written", {});
    });
  }, S = Le(m.foot, {
    label: h("platform.doRemove"),
    cancel: () => {
      D.clear(), st(e), y();
    },
    apply: () => {
      w(D, !1);
    }
  }), _ = new Set(Object.keys(n.named)), N = () => {
    p.sheet.querySelector(`.${l.naming}`)?.remove(), p.scroll.hidden = !1, p.eyebrow.textContent = h("platform.pick"), p.sentence.textContent = x(s("pickFor"), a);
  }, A = () => {
    const k = [...B].filter((q) => !_.has(q)), T = p.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && k.length > 0 && !T) {
      const q = ni(e, k);
      q.addEventListener("submit", (V) => {
        V.preventDefault(), A();
      }), q.addEventListener("input", () => {
        L.ready(P(), !0);
      }), p.eyebrow.textContent = s("name"), p.sentence.textContent = s("nameFor"), p.scroll.hidden = !0, p.sheet.insertBefore(q, p.foot), q.querySelector("input")?.focus();
      return;
    }
    if (T && !P()) {
      p.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    w(B, !0);
  }, P = () => oi(p.sheet, s("nameWhy")), L = Le(p.foot, {
    label: h("platform.doAdd"),
    cancel: () => {
      B.clear(), N(), f(!1), y();
    },
    apply: A
  });
  if (p.scroll.style.setProperty("--vperm-queued-note", `"${h("platform.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${h("platform.from")}"`), it.clear(), n.unseen.forEach(({ page: k }) => {
    it.add(String(k));
  }), ui(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const k = e.createElement("div");
    k.className = l.faceChoice, k.append(o.choice(e, r)), m.sheet.insertBefore(k, m.foot);
  }
  li(e, m.scroll, v, { groupId: r, kind: o, showCount: y }), si(p.sheet, y, u), y(), Se.start(() => {
    st(e);
  }), bt(e, u, () => ke, () => {
    if (p.sheet.querySelector(`.${l.naming}`) !== null) {
      N();
      return;
    }
    f(!1);
  }), On(r, [S, L], u), m.bar.replaceChildren(
    m.eyebrow,
    m.sentence,
    Y(e, s("add"), "btn btn-default", () => {
      f(!0);
    }),
    O(e, l.faceHint, s("hint"))
  ), window.requestAnimationFrame(() => {
    f(ke);
  });
}
function pi(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  ke = !1, D.clear(), at = null, Se.stop(), Ee?.abort(), Ee = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), ai(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, Cn));
}
function fi(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function Xt(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return mi(r);
  const o = qn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function mi(e) {
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
const hi = { pageMounts: zn, fileMounts: Kn };
function gi(e, t) {
  const n = Ue();
  let r = !1;
  const o = async () => {
    const { active: s, groupId: a, area: c } = b(), u = hi[c];
    if (!s || a === null || u === void 0) {
      n.drop(), pi(e);
      return;
    }
    const p = e.querySelector(u.component);
    if (p === null)
      return;
    r = !0;
    const m = await n.inspect(a);
    r = !1, m !== null && di(e, p, u.mounted(m.scopes), { groupId: a, kind: u });
  }, i = new MutationObserver(() => {
    !r && [zn, Kn].every(({ component: s }) => e.querySelector(`${s} > .${l.panelCard}`) === null) && o();
  });
  i.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    i.disconnect();
  }), o(), K("permissions-written", () => void o(), t), E(() => void o(), t);
}
let lt = null;
function Xn(e) {
  lt = e, Be.App.showModule(e);
}
function vi(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function bi(e) {
  const t = lt === e;
  return lt = null, t;
}
const Ce = "other", Zt = ["modules", "pageMounts", "fileMounts", "fields", Ce], yi = 10, ne = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Ce]: "module"
}, wi = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function ki(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", h("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(d.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const y = Zn(e);
    if (y.forEach(($) => {
      g.observe($);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = y.map(($) => te($)), S = [...Zt, ...w.filter(($) => !Zt.includes($))], _ = w.includes("fields") ? [Ce] : [], N = y.filter(($) => $.getBoundingClientRect().width !== 0).map(te), A = N.includes("fields") ? [...N, Ce] : N, [P] = A.includes("fields") ? ["fields"] : A, L = A.find(($) => ne[$] !== void 0 && ne[$] === ne[f.picked]), k = A.includes(f.picked) ? f.picked : L ?? P;
    if (A.join() !== i && (i = A.join(), k !== void 0 && k !== f.area)) {
      xr(k);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap(($) => [xi(e, $), Ni(e, $)]),
      ...S.map(($) => $i(e, $, h(`pickAnArea.${$}`)))
    )), n.parentElement === null && Ai(e).append(n);
    const T = f.area === Ce ? "fields" : f.area;
    Ci(n, e), qi(n, e, y.find(($) => te($) === T) ?? null);
    const q = f.area !== "fields";
    y.forEach(($) => {
      const C = te($), he = C === T, ae = q && !he && C !== "modules", ge = Te(n, C);
      ge?.setAttribute("aria-selected", String(C === f.area)), Si(ge, $), $.toggleAttribute(d.armed, he), $.toggleAttribute("inert", ae), r.add($), Pi(Fi(n, C), $, ae), Li(Mi(n, C), $, he, y);
    });
    let V = 0, ee = null;
    S.forEach(($) => {
      const C = Te(n, $);
      if (C === null)
        return;
      const he = C.hidden ? 0 : C.getBoundingClientRect().width, ae = y.find((hr) => te(hr) === $), ge = ae ?? Ti($, y), Tt = Math.max(V, ge?.getBoundingClientRect().left ?? V);
      C.style.setProperty("--vperm-host-x", `${String(Tt)}px`), C.toggleAttribute(d.elsewhere, ae === void 0), ae === void 0 && (C.setAttribute("aria-selected", String($ === f.area)), xe(C, ge ?? ee ?? C)), V = C.hidden ? V : Tt + he + yi, ee = C;
    });
    const se = Te(n, "fields");
    _.forEach(($) => {
      const C = Te(n, $);
      C === null || se === null || (C.setAttribute("aria-selected", String($ === f.area)), C.hidden = se.hidden);
    });
  };
  let c = 0;
  const u = () => {
    window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
      a(b());
    });
  }, p = new MutationObserver((f) => {
    f.some((y) => !n.contains(y.target)) && u();
  });
  let m = !1;
  const v = (f) => {
    const y = f.detail.module ?? "", w = bi(y);
    if (!m) {
      m = !0;
      return;
    }
    !w && ne[b().picked] === "tree" && $n("fields");
  };
  e.addEventListener("typo3-module-loaded", v, { signal: t }), p.observe(e.body, { childList: !0, subtree: !0 });
  const g = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    p.disconnect(), g.disconnect(), window.cancelAnimationFrame(c);
  }), E(a, t), a(b());
}
const Ai = (e) => e.querySelector(".scaffold") ?? e.body;
function $i(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(d.area, t), r.setAttribute(d.label, n), r.append(O(e, l.tabLabel, n)), r.addEventListener("click", () => {
    $n(t);
    const o = wi[t];
    o !== void 0 && Zn(e).every((i) => te(i) !== t) && Xn(o);
  }), r;
}
function Si(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, xe(e, t));
}
const xe = (e, t) => {
  e.setAttribute(d.ground, t.getAttribute(d.ground) ?? "");
}, Ei = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Ci(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function qi(e, t, n) {
  const r = Oi(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, xe(r, n), Ct(r, n);
}
function Ct(e, t) {
  const n = t.getBoundingClientRect(), r = Ei(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function Li(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  xe(e, t), e.hidden = o.width === 0 || o.left === 0 || n || En(t.ownerDocument) === 0 || _i(o, r), Ct(e, t);
}
function Oi(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function _i(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Ni(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(d.area, t), n;
}
function xi(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(d.area, t), n;
}
function Pi(e, t, n) {
  e !== null && (e.hidden = !n, n && (xe(e, t), Ct(e, t)));
}
const Ti = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  ne[e] === void 0 ? void 0 : t.find((n) => ne[te(n)] === ne[e])
), Te = (e, t) => e.querySelector(`.${l.tab}[${d.area}="${t}"]`), Fi = (e, t) => e.querySelector(`.${l.areaCover}[${d.area}="${t}"]`), Mi = (e, t) => e.querySelector(`.${l.tabSeam}[${d.area}="${t}"]`);
function Zn(e) {
  return [...e.querySelectorAll(`.${l.frame}[${d.area}]`)];
}
const te = (e) => e.getAttribute(d.area) ?? "", er = "#modulemenu", Ii = `${er} .modulemenu-group-container.collapse:not(.show)`, Di = `${er} [aria-controls]`, Ri = "typo3-backend-content-navigation[navigation-collapsed]", en = "navigation-collapsed";
function Bi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = b();
    o && Ui(e, n), o && i === "modules" && ji(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    b().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), E(r, t);
}
function ji(e, t) {
  e.querySelectorAll(Ii).forEach((n) => {
    n.classList.add("show"), tn(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), tn(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Di).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function Ui(e, t) {
  e.querySelectorAll(Ri).forEach((n) => {
    n.toggleAttribute(en, !1), t.push(() => {
      n.toggleAttribute(en, !0);
    });
  });
}
function tn(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const Wi = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", nn = "scaffold-content-navigation-expanded";
function Gi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(nn);
    }), n = b().active ? [...e.querySelectorAll(Wi)] : [], n.forEach((o) => {
      o.classList.add(nn);
    });
  };
  r(), E(r, t);
}
const tr = (e) => [...e, "web_list"], qe = tr(["web_layout", "records", "media_management", "permissions_pages"]), nr = "vperm.module";
function Ki(e, t) {
  let n = null;
  const r = (i) => {
    Yi(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || qe.includes(Hi(e))))
      return;
    const a = Ji() ?? qe[0] ?? "", c = mt(e);
    if ((c !== "" || qr(e)) && i.area === "fields") {
      vi(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        zi(e, c);
      },
      { once: !0, signal: t }
    ), Xn(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    b().active && qe.includes(s) && Ne(nr, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), E(r, t);
}
async function zi(e, t) {
  const n = ue(e), r = await Pn(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function Hi(e) {
  return Be.App.getCurrentModule() ?? ue(e)?.getAttribute("module") ?? "";
}
const rr = "[data-modulemenu-identifier]:not([aria-controls])", Vi = `#modulemenu ${rr}`;
function Yi(e, t) {
  e.querySelectorAll(Vi).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !qe.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(rr)].every((r) => r.parentElement?.hidden === !0);
  });
}
function Ji() {
  const e = _e.get(nr);
  return typeof e == "string" && qe.includes(e) ? e : void 0;
}
function Qi(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function Xi(e) {
  R(({ doc: t }) => {
    t.querySelectorAll(".module-docheader-bar-navigation").forEach((n) => {
      n.classList.add("module-docheader-navigation");
    }), t.querySelectorAll(".module-docheader-bar-navigation > .module-docheader-bar-column-left").forEach((n) => {
      n.classList.add("module-docheader-column-breadcrumb");
    }), t.querySelectorAll(".module-docheader-bar-buttons").forEach((n) => {
      n.classList.add("module-docheader-buttons");
    });
  }, e);
}
function Zi(e) {
  R(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const es = "[data-object-id]";
function or(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = b();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), ts(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), ns(a), ir(a, e));
    });
  };
  R((i) => {
    n = i.doc, o();
  }, t), E(o, t);
}
function ts(e, t) {
  e.querySelectorAll(es).forEach((n) => {
    rs(n) && (os(n), n.matches(t.shut) || ir(n, t));
  });
}
function ir(e, t) {
  e.querySelector(t.opener)?.click();
}
const qt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function ns(e) {
  re.set(qt(e), "folded");
}
function rs(e) {
  return re.isset(qt(e));
}
function os(e) {
  re.unset(qt(e));
}
function is(e) {
  or({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function ss(e, t) {
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
  u.setAttribute("identifier", "actions-document-save"), u.setAttribute("size", "small"), c.append(u, ` ${h("rm.saveDoc")}`), c.addEventListener("click", () => {
    c.disabled = !0, u.setAttribute("identifier", "spinner-circle");
    const g = { group: String(m) };
    for (const [f, y] of new FormData(r))
      typeof y == "string" && (g[f] = y);
    Z(M.write_other_permissions, g).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== p, f === "taken") {
        Je.success(h("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && Je.error(h("editOtherPermissions.notSaved"));
    });
  }), a.append(c), i.append(s, a), o.append(i), n.append(o, r);
  let p = null, m = null;
  const v = (g) => {
    const f = !g.active || g.area !== "other", y = g.groupId === null;
    if (f || y) {
      n.remove(), p = null, delete TYPO3.settings.FormEngine?.formName;
      return;
    }
    const w = g.groupId;
    w !== p && (p = w, c.disabled = !0, s.textContent = X(e, w) ?? "", as(w).then((S) => {
      S === null || w !== p || (r.replaceChildren(e.createRange().createContextualFragment(S.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${d.area}="fields"]`)?.append(n), new Ar().processItems([...S.scriptItems]));
    }));
  };
  v(b()), E(v, t);
}
async function as(e) {
  return kt(new ie(j(M.other_permissions)).withQueryArguments({ group: e }).get());
}
const Lt = '.form-group:has(> select[name="_langSelector"])', ct = /* @__PURE__ */ new WeakMap();
function ls(e, t) {
  const n = e.querySelector(`.module-docheader ${Lt}`);
  n !== null && (ct.has(n) || ct.set(n, n.parentElement), t.after(n));
}
function cs(e) {
  const t = e.querySelector(`.module-docheader ${Lt}`);
  t !== null && ct.get(t)?.append(t);
}
const us = (e) => `${e}, ${Lt}`, ds = ".module-docheader-navigation > .module-docheader-column-breadcrumb", rn = ".module-docheader-buttons .btn-toolbar > *", ps = ".t3js-editform-close", fs = us(`.${l.headButton}, .${l.showMenu}`), ms = 'form[name="editform"] h1';
function hs(e, t) {
  let n = null;
  const r = (i) => {
    const { active: s, area: a } = b();
    return s && a === "fields" && i.querySelector(`[${d.token}]`) !== null;
  }, o = () => {
    if (n === null)
      return;
    const i = n, s = r(i);
    i.querySelectorAll(`.${l.headBar}, .${l.headButton}`).forEach((f) => {
      f.remove();
    });
    const a = i.querySelector(ps), c = b().face === "preview" ? a : null;
    if (i.querySelectorAll(rn).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches(fs) && !f.contains(c));
    }), i.querySelectorAll(ms).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${d.token}][${d.inside}='']:not([${d.outOfReach}])`) !== null;
    if (!u && b().face === "pick") {
      $e(i, () => {
        ce("preview");
      });
      return;
    }
    const p = b().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      O(i, l.faceEyebrow, h(p ? "platform.preview" : "platform.pick")),
      O(i, l.faceSentence, x(
        h(p ? "recordForm.previewFor" : "recordForm.pickFor"),
        X(e, b().groupId) ?? ""
      ))
    ), i.querySelector(ds)?.append(m), !p || !u)
      return;
    const v = Y(
      i,
      h("recordForm.add"),
      `btn btn-default btn-sm ${l.headButton}`,
      () => {
        $e(i, () => {
          ce("pick");
        });
      },
      "actions-check-square"
    );
    [...i.querySelectorAll(rn)].find((f) => f.contains(a))?.after(v);
  };
  R((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && bt(
      i.doc,
      t,
      () => b().face === "pick",
      () => {
        $e(i.doc, () => {
          ce("preview");
        });
      }
    );
  }, t), K("fields-judged", o, t), E(o, t);
}
const on = `[${d.token}]`;
function gs(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(on)];
    Bt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(on)];
      vs(s, i) || (i = s, Bt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const vs = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function bs(e, t) {
  let n = [];
  const r = () => {
    if (n.forEach((i) => {
      i();
    }), n = [], !b().active)
      return;
    e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelectorAll("typo3-backend-new-content-element-wizard-button").forEach((i) => {
      const s = i.lastChild, a = s.textContent;
      s.textContent = h("readOnly.previewNewContent"), n.push(() => {
        s.textContent = a;
      });
    });
  };
  r(), E(r, t);
}
const ys = tr(["records"]);
function ws(e, t) {
  let n = b().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && ys.includes(Be.App.getCurrentModule() ?? "");
  E(({ active: o }) => {
    o !== n && Lr().then(() => {
      r() && $r.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function ks(e, t) {
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
const As = ".module-docheader-buttons .btn-toolbar", sn = "vperm.show", an = "vperm.identify", ln = (e, t, n) => {
  if (n) {
    re.set(e, t);
    return;
  }
  re.unset(e);
}, cn = (e, t) => {
  if (e.setAttribute("aria-selected", String(t)), !t) {
    e.removeAttribute("data-dropdowntoggle-status");
    return;
  }
  e.setAttribute("data-dropdowntoggle-status", "active");
};
function $s(e) {
  let t = null;
  const n = (o) => {
    const { active: i, area: s } = b();
    return i && s === "fields" && o.querySelector(`[${d.token}]:not([${d.outOfReach}])`) !== null;
  }, r = () => {
    if (t === null)
      return;
    const o = t;
    if (o.querySelectorAll(`.${l.showMenu}`).forEach((c) => {
      c.remove();
    }), !n(o)) {
      o.body.removeAttribute(d.show), cs(o);
      return;
    }
    dn(o, re.get(sn) === "list"), un(o, re.get(an) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(sr(o, "actions-filter"), ` ${h("recordForm.show")}`);
    const a = o.createElement("ul");
    a.className = "dropdown-menu", a.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      pn(o, h("recordForm.show.listOnly"), "actions-list", () => o.body.hasAttribute(d.show), (c) => {
        ln(sn, "list", c), dn(o, c);
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      pn(o, h("recordForm.show.identifiers"), "actions-tag", () => o.body.hasAttribute(d.identify), (c) => {
        ln(an, "said", c), un(o, c);
      })
    ), i.append(s, a), o.querySelector(As)?.append(i), ls(o, i);
  };
  R((o) => {
    t = o.doc, r();
  }, e), K("fields-judged", r, e), E(r, e);
}
function un(e, t) {
  e.querySelectorAll(`.${l.fieldToken}`).forEach((n) => {
    n.remove();
  }), e.body.toggleAttribute(d.identify, t), t && e.querySelectorAll(`.${l.anchor}[${d.token}]`).forEach((n) => {
    const r = n.querySelector(":scope > .form-label, :scope > fieldset > legend");
    if (r === null)
      return;
    const o = e.createElement("small");
    o.className = l.fieldToken, o.textContent = n.getAttribute(d.token), r.after(o);
  });
}
function sr(e, t) {
  const n = e.createElement("typo3-backend-icon");
  return n.setAttribute("identifier", t), n.setAttribute("size", "small"), n;
}
function dn(e, t) {
  if (!t) {
    e.body.removeAttribute(d.show);
    return;
  }
  e.body.setAttribute(d.show, "list");
}
function pn(e, t, n, r, o) {
  const i = e.createElement("button");
  i.type = "button", i.className = "dropdown-item dropdown-item-spaced";
  const s = e.createElement("span");
  s.className = "dropdown-item-status", i.append(s, sr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), cn(i, r());
  }), cn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function Ss(e) {
  return Qe.normalizedCtrlModifierKey === hn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function Ot(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = Ss(e), t.append(o);
    }
    Qe.register(
      [Qe.normalizedCtrlModifierKey, hn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Es(e) {
  Ot(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${d.toggle}]`), () => {
    if (b().active) {
      An();
      return;
    }
    kn();
  }, !0);
}
function Cs(e, t) {
  const n = e.querySelector(`[${d.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(b()), n.addEventListener("click", () => {
    if (b().active) {
      An();
      return;
    }
    kn();
  }, { signal: t }), E(r, t);
}
function qs(e) {
  or({
    shut: "[data-object-id]:has(.panel-button.collapsed)",
    opener: ".panel-button"
  }, e);
}
function fe(e, t) {
  try {
    sessionStorage.setItem(e, t);
  } catch {
  }
}
function me(e) {
  try {
    return sessionStorage.getItem(e);
  } catch {
    return null;
  }
}
function _t(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {
  }
}
const ar = 600, Ls = 250, Os = 2e3, _s = 320, Nt = "vperm.arriving";
function Ns() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function lr(e, t, n) {
  if (!Ns()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  fe(Nt, t), e.body.setAttribute(d.leaving, t), e.body.addEventListener("animationend", o, { once: !0 }), window.setTimeout(o, ar);
}
function xs(e) {
  e.body.setAttribute(d.settling, "");
}
function Ps(e) {
  const t = Ts();
  if (t === null)
    return;
  _t(Nt), e.body.setAttribute(d.settling, ""), e.body.setAttribute(d.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(d.settling), e.body.removeAttribute(d.arriving), e.body.setAttribute(d.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(d.unwrapping);
    }, _s));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, ar);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, Ls);
  }, { signal: i.signal }), window.setTimeout(c, Os);
}
function Ts() {
  return me(Nt);
}
const cr = "vperm.viewing", ur = "vperm.seen", dr = "vperm.room";
function Fs(e) {
  fe(cr, e);
}
function Ms(e) {
  fe(dr, String(e));
}
function Is() {
  return me(dr);
}
function Ds(e) {
  const t = me(cr);
  t !== null && fe(ur, JSON.stringify({
    ...xt(),
    [t]: { place: bn(e), document: mt(e) }
  }));
}
function Rs(e) {
  return gn(xt()[e]);
}
function Bs(e) {
  return vn(xt()[e]);
}
function xt() {
  const e = me(ur);
  return e === null ? {} : JSON.parse(e);
}
function js(e, t) {
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
  const c = Is();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), Sn(e, a, t), o.addEventListener("click", () => {
    Ds(e), lr(e, "up", () => {
    });
  }, { signal: t }), Ot(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Pt = "vperm.opening";
function pr(e, t) {
  e !== "" && fe(Pt, JSON.stringify({ record: e, screen: t }));
}
function Us(e) {
  const t = Gs(), n = ue(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !Ws(t.screen, n, e.location.href) || (_t(Pt), Ks(e, n, t.record));
}
function Ws(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function Gs() {
  const e = me(Pt);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function Ks(e, t, n) {
  const r = await Pn(n, t);
  r !== "" && Cr(e, r);
}
let Fe = null;
function zs(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
async function fr() {
  const e = await new ie(j(M.viewable_users)).get(Fe === null ? {} : { headers: { "If-None-Match": Fe.tag } }).catch(zs), t = e.raw();
  if (t.status === 304)
    return Fe.users;
  const n = await e.resolve(), r = t.headers.get("ETag");
  return Fe = r === null ? null : { tag: r, users: n }, n;
}
const Hs = {
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
}, ut = "vperm.returnTo", dt = "vperm.returning", Vs = "vperm.userSearch";
function Ys(e, t, n = Hs) {
  const r = _e.get(ut), o = gn(r);
  return o !== "" && Js(o) ? (pr(vn(r), o), Ne(ut, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (Qs(e, t, n), !1);
}
function Js(e) {
  return me(dt) === e ? !1 : (fe(dt, e), !0);
}
function Qs(e, t, n) {
  const r = e.querySelector(`[${d.viewAs}]`);
  if (r === null)
    return;
  const o = _n(e, {
    totalOne: h("viewAsUser.total.one"),
    totalMany: h("viewAsUser.total.many"),
    take: h("viewAsUser.key.take"),
    detail: h("viewAsUser.key.detail"),
    loading: h("viewAsUser.loading"),
    failed: h("viewAsUser.failed")
  });
  o.remembers = Vs, o.placeholder = h("viewAsUser.search"), e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    mr(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    pt(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    ht(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    pt(e, o), o.openedBy(r);
  }, { signal: t }), Ot(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    Xs(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function Xs(e, t, n, r) {
  const o = await fr().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    pt(e, r), r.openedBy(n);
    return;
  }
  await mr(e, i, t);
}
async function pt(e, t) {
  t.state = "loading";
  const n = await fr().catch(() => null);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = gt(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
  t.entries = [
    ...a.map((u) => fn(u, h("viewAsUser.recent"), i)),
    ...c.map((u) => fn(u, h("viewAsUser.all"), i))
  ];
}
function fn(e, t, n) {
  const r = e.groups.map((o) => ({ id: String(o), title: n[String(o)]?.title ?? "", depth: 0 })).filter((o) => o.title !== "").sort((o, i) => o.title.localeCompare(i.title));
  return {
    id: String(e.id),
    title: e.realName === "" ? e.username : e.realName,
    subtitle: e.realName === "" ? "" : e.username,
    note: Zs(r.length),
    detail: r,
    detailHeading: ea(r.length),
    heading: t
  };
}
function Zs(e) {
  return e === 0 ? "" : W("viewAsUser.groups", e, e);
}
function ea(e) {
  return e === 0 ? h("viewAsUser.detail.none") : W("viewAsUser.detail", e, e);
}
async function mr(e, t, n) {
  _t(dt), Fs(String(t)), Ms(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await Ne(ut, { place: bn(e), document: mt(e) });
  const r = Rs(String(t));
  pr(Bs(String(t)), r), ta(t, n, r);
}
function ta(e, t, n) {
  Er(document), lr(document, "down", () => {
    t.handOver(j(M.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function mn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Tr(e.signal), Mr(document, e.signal), Cs(document, e.signal), Wr(document, e.signal), Zi(e.signal), Xi(e.signal);
  const t = io();
  ro(t, e.signal);
  const n = oo();
  po(n, e.signal), ho(n, e.signal), So(t, e.signal), Eo(e.signal), Uo(document, e.signal), gi(document, e.signal), Ko(e.signal), Ho(e.signal), Xo(e.signal), ei(e.signal), Bi(document, e.signal), bs(document, e.signal), ws(document, e.signal), Gi(document, e.signal), Ki(document, e.signal), Lo(document, e.signal), ki(document, e.signal), ss(document, e.signal), Qi(document, e.signal), xo(document, e.signal), ks(document, e.signal), hs(document, e.signal), $s(e.signal), qs(e.signal), is(e.signal), gs(document, e.signal);
  const r = Ys(document, e.signal);
  js(document, e.signal), r ? xs(document) : (Us(document), Ps(document)), Es(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mn, { once: !0 }) : mn();
//# sourceMappingURL=main.js.map
