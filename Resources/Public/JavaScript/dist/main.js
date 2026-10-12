import fe from "@typo3/backend/storage/persistent.js";
import { LitElement as $r, html as I } from "lit";
import { ModuleStateStorage as yn } from "@typo3/backend/storage/module-state-storage.js";
import Y from "@typo3/core/ajax/ajax-request.js";
import Sr from "@typo3/backend/login-refresh.js";
import De from "@typo3/backend/notification.js";
import { sudoModeInterceptor as Er } from "@typo3/backend/security/sudo-mode-interceptor.js";
import It from "@typo3/backend/modal.js";
import { FileStorageTree as Cr } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as qr } from "@typo3/backend/tree/page-tree.js";
import We from "@typo3/backend/module-menu.js";
import ae from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as Lr } from "@typo3/core/java-script-item-processor.js";
import Nr from "@typo3/backend/viewport.js";
import nt, { ModifierKeys as kn } from "@typo3/backend/hotkeys.js";
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
  newRecord: "data-vperm-new-record",
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
}, le = {
  folderTree: "vperm-folder-tree",
  pageTree: "vperm-page-tree",
  picker: "vperm-picker"
};
function Or(e) {
  return e.body.hasAttribute(p.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function _r(e) {
  e.body.setAttribute(p.handingOver, "");
}
function An(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function $n(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function xr(e, t) {
  const n = ce(e);
  n !== null && e.addEventListener(
    "typo3-module-loaded",
    () => {
      n.setAttribute("endpoint", t);
    },
    { once: !0 }
  );
}
function bt(e) {
  return new URL(e.location.href).pathname.endsWith("/main") ? ce(e)?.getAttribute("endpoint") ?? "" : e.location.href;
}
function ce(e) {
  return e.querySelector("typo3-backend-module-router");
}
function wt(e) {
  const t = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(bt(e)));
  return t === null ? "" : t.slice(1).join(":");
}
function Pr(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(bt(e)));
}
function Sn(e) {
  const t = bt(e);
  if (t === "")
    return "";
  const n = new URL(t, e.location.origin), r = n.searchParams.get("returnUrl");
  if (r !== null) {
    const o = new URL(r, n.origin);
    return o.origin !== n.origin ? "" : (o.searchParams.delete("token"), o.href);
  }
  return n.searchParams.delete("token"), n.href;
}
let rt = Promise.resolve();
function me(e, t) {
  const n = document, r = rt.then(async () => {
    Or(n) || await fe.set(e, t);
  });
  return rt = r.catch(() => {
  }), r;
}
function Tr() {
  return rt;
}
const En = "vperm.session", Cn = 1, we = "modules", Fr = "fields", ot = /* @__PURE__ */ new Set();
let F = Dr();
document.addEventListener("typo3-module-loaded", () => {
  Ke({ ...F, face: "preview" });
});
function y() {
  return F;
}
function q(e, t) {
  ot.add(e), t?.addEventListener("abort", () => ot.delete(e));
}
function qn() {
  const e = F.groupId !== null, t = e ? Fr : F.area;
  he({ ...F, active: e, open: F.open || e, area: t, picked: t });
}
function Mr() {
  he({ ...F, open: !0 });
}
function Ir() {
  he({ ...F, open: !1, active: !1 });
}
function Ln() {
  he({ ...F, active: !1 });
}
function Nn(e) {
  he({ ...F, area: e, picked: e, face: "preview" });
}
function Rr(e) {
  Ke({ ...F, area: e });
}
function pe(e) {
  Ke({ ...F, face: e });
}
function yt(e) {
  he({ ...F, groupId: e, active: F.active && e !== null });
}
function he(e) {
  me(En, {
    version: Cn,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), Ke(e);
}
function Ke(e) {
  F = e;
  for (const t of ot)
    t(F);
}
function Dr() {
  const e = fe.get(En);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: we, picked: we, face: "preview" };
  const t = e;
  if (String(t.version) !== String(Cn))
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
function Br(e) {
  const t = () => {
    Rt(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && Rt(n);
  };
  t(), q(t, e);
}
function Rt(e) {
  const t = y();
  if (e.toggleAttribute(p.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(p.active, t.active), !t.active) {
    e.removeAttribute(p.picked), e.removeAttribute(p.face);
    return;
  }
  e.setAttribute(p.picked, t.area), e.setAttribute(p.face, t.face);
}
const Ur = (e) => `${e}, .scaffold-modulemenu`;
function On(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Ur(".scaffold-sidebar"));
  if (r == null || o === null)
    return;
  const i = () => {
    r.style.flexBasis = "";
    const a = _n(e), c = Number.parseFloat(getComputedStyle(t).marginInlineStart), u = o.getBoundingClientRect().right - a - r.getBoundingClientRect().left - c;
    u > 0 && (r.style.flexBasis = `${String(u)}px`);
  };
  i();
  const s = new ResizeObserver(i);
  s.observe(o), n.addEventListener("abort", () => {
    s.disconnect();
  });
}
const _n = (e) => Number.parseFloat(getComputedStyle(e.body).getPropertyValue("--vperm-divider")) || 0;
function jr(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${p.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), On(e, r, t);
  const o = e.querySelector(`[${p.toolbar}]`), i = () => y().open || y().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), q(s, t), o?.addEventListener("click", () => {
    i() ? Ir() : Mr(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Ge(e) {
  return JSON.parse(e.querySelector(`[${p.groups}]`)?.getAttribute(p.groups) ?? "{}");
}
function re(e, t) {
  return Ge(e)[String(t)]?.title ?? null;
}
function g(e) {
  return TYPO3.lang[e] ?? "";
}
const xn = 220, Wr = 1300;
function Oe(e, t) {
  const n = e.ownerDocument, r = n.createElement("span");
  r.className = l.faceTally;
  const o = L(n, l.faceCounted, ""), i = L(n, l.faceWaiting, "");
  r.append(o, i);
  const s = X(n, g("platform.cancel"), `btn btn-default ${l.faceCancel}`, t.cancel), a = X(n, t.label, `btn btn-primary ${l.faceApply}`, t.apply);
  return e.replaceChildren(r, s, a), {
    state: o,
    waiting: i,
    ready: (c, u, d = c) => {
      if (a.toggleAttribute("disabled", !c), s.toggleAttribute("disabled", !u), !u || d) {
        s.textContent = g("platform.cancel");
        return;
      }
      if (s.textContent = g("platform.back"), TYPO3.settings.visualPermissions?.keysOnButtons === !1)
        return;
      const m = n.createElement("kbd");
      m.textContent = "Esc", s.append(m);
    }
  };
}
function kt(e, t) {
  t !== "cancelled" && (e.state.textContent = g(`platform.${t}`));
}
function Pn(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = L(e, l.faceEyebrow, ""), o = L(e, l.faceSentence, ""), i = e.createElement("div");
  i.className = l.faceBar, i.append(r, o);
  const s = e.createElement("div");
  s.className = l.faceScroll;
  const a = e.createElement("div");
  return a.className = l.faceFoot, n.append(i, s, a), { sheet: n, bar: i, eyebrow: r, sentence: o, scroll: s, foot: a };
}
function Tn(e) {
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
        }, Wr));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function Fn(e, t, n) {
  q(() => {
    y().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function At(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !Kr(e) && r();
  }, { signal: t });
}
const Kr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
function X(e, t, n, r, o) {
  const i = e.createElement("button");
  if (i.type = "button", i.className = n, i.textContent = t, i.addEventListener("click", r), o !== void 0) {
    const s = e.createElement("typo3-backend-icon");
    s.setAttribute("identifier", o), s.setAttribute("size", "small"), i.prepend(s, " ");
  }
  return i;
}
function L(e, t, n) {
  const r = e.createElement("span");
  return r.className = t, r.textContent = n, r;
}
function K(e, t, ...n) {
  return N(g(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function N(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, String(r)).replace("%s", String(r)),
    e
  );
}
const Dt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Gr(e, t, n, r) {
  const o = [e];
  let i = Dt(r, e) ? 2 : 0, s = e + 1;
  for (let a = 1; a < t.length; a += 1) {
    const c = n.indexOf(t.charAt(a), s);
    if (c === -1)
      return null;
    c === s && (i += 4), Dt(r, c) && (i += 2), o.push(c), s = c + 1;
  }
  return { score: e === 0 ? i + 2 : i, at: o };
}
function Bt(e, t) {
  if (e === "")
    return { score: 0, at: [] };
  const n = e.toLowerCase(), r = t.toLowerCase(), o = n.charAt(0);
  let i = null;
  for (let s = r.indexOf(o); s !== -1; s = r.indexOf(o, s + 1)) {
    const a = Gr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const Ut = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, zr = 70, Qe = 50;
class Vr extends $r {
  // Stryker disable ObjectLiteral,BooleanLiteral: callers set these as properties, never as attributes
  static properties = {
    entries: { attribute: !1 },
    words: { attribute: !1 },
    addNew: { attribute: !1 },
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
    super(), this.entries = [], this.addNew = null, this.placeholder = "", this.remembers = "", this.query = "", this.active = 0, this.onDetail = 0, this.inPane = !1, this.state = "ready", this.words = {
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
      score: Bt(this.query, Ut(n))?.score ?? -1
    })).filter((n) => n.score >= 0).sort((n, r) => n.band - r.band || r.score - n.score).map((n) => n.entry);
  }
  get found() {
    return this.matching.slice(0, Qe);
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
        ${this.addNewLink()}
      </div>
      <div class=${l.pickerPanes}>
      <div class=${l.pickerList} role="listbox" tabindex="-1">
        ${this.nothingToShow(t)}
        ${this.state !== "ready" ? "" : t.map((n, r) => {
      const o = Bt(this.query, Ut(n))?.at ?? [];
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
  addNewLink() {
    return this.addNew === null ? "" : I`
      <a class="btn btn-default" href=${this.addNew.url} target="list_frame"
         @click=${(t) => {
      this.leaveForNew(t.currentTarget);
    }}>
        <typo3-backend-icon identifier="actions-plus" size="small"></typo3-backend-icon>
        ${this.addNew.label}
      </a>
    `;
  }
  leaveForNew(t) {
    const n = new URL(t.href);
    n.searchParams.set("returnUrl", ce(this.ownerDocument)?.getAttribute("endpoint") ?? ""), t.href = n.href, yn.update("web", 0, !0), this.hidePopover();
  }
  kept() {
    const t = fe.get(this.remembers);
    return typeof t == "string" ? t : "";
  }
  remember() {
    this.remembers !== "" && me(this.remembers, this.query);
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
    return t <= Qe ? (t === 1 ? this.words.totalOne : this.words.totalMany).replace("%d", String(t)) : this.words.countMany.replace("%d", String(Qe)).replace("%d", String(t));
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
    this.hasAttribute(p.byKey) || (this.stopSettling(), this.settling = window.setTimeout(() => {
      this.active = t, this.inPane = !1;
    }, zr));
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
      const u = o[a] ?? 0, d = (o[c] ?? 0) + 1;
      i.push(I`${n.slice(s, u)}<mark>${n.slice(u, d)}</mark>`), s = d, a = c + 1;
    }
    return I`${i}${n.slice(s)}`;
  }
}
customElements.get(le.picker) === void 0 && customElements.define(le.picker, Vr);
function Mn(e, t) {
  const n = e.createElement(le.picker);
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
const Hr = "vperm.groupSearch", In = "vperm.recentGroups", Yr = 3;
function Jr(e, t) {
  const n = e.querySelector(`[${p.group}]`);
  if (n === null)
    return;
  const r = Mn(e, {
    totalOne: g("pickAGroup.total.one"),
    totalMany: g("pickAGroup.total.many"),
    take: g("pickAGroup.key.take"),
    detail: g("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  let o = Qr(e);
  r.entries = jt(e, o), r.remembers = Hr, r.placeholder = g("pickAGroup.search"), r.addNew = { label: g("pickAGroup.new"), url: n.getAttribute(p.newRecord) ?? "" }, e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n);
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = re(e, y().groupId) ?? i;
  };
  s(), q(s, t), q(() => {
    const { groupId: u } = y();
    u !== null && o[0] !== u && (o = [u, ...o.filter((d) => d !== u)], me(In, o)), r.entries = jt(e, o);
  }, t);
  const c = (u) => {
    yt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Qr(e) {
  const t = Ge(e);
  return [fe.get(In)].flat().map(String).filter((n) => n in t).map(Number);
}
function jt(e, t) {
  const n = Object.entries(Ge(e)), r = t.filter((s) => s !== y().groupId).slice(0, Yr), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
  return [
    ...o.map(([s, a]) => Wt(s, a, g("pickAGroup.recent"))),
    ...i.map(([s, a]) => Wt(s, a, g("pickAGroup.all")))
  ];
}
function Wt(e, t, n) {
  return {
    id: e,
    heading: n,
    title: t.title,
    subtitle: t.disabled ? g("pickAGroup.disabled") : "",
    note: Xr(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: g(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function Xr(e) {
  return e === 0 ? "" : K("pickAGroup.inherits", e, e);
}
const Rn = (e) => `vperm:${e}`;
function Z(e, t) {
  document.dispatchEvent(new CustomEvent(Rn(e), { detail: t }));
}
function J(e, t, n) {
  document.addEventListener(
    Rn(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function Zr() {
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
const Dn = Zr();
function D(e, t) {
  Dn.listen(e, t);
}
function Kt(e) {
  Dn.tell(e);
}
function R(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
const _ = {
  allow_fields: "visual_permissions_allow_fields",
  allow_file_operations: "visual_permissions_allow_file_operations",
  allow_modules: "visual_permissions_allow_modules",
  allow_page_types: "visual_permissions_allow_page_types",
  allow_tables: "visual_permissions_allow_tables",
  allow_values: "visual_permissions_allow_values",
  file_operations: "visual_permissions_file_operations",
  folder_tree: "visual_permissions_folder_tree",
  inspect: "visual_permissions_inspect",
  modules_outside_menu: "visual_permissions_modules_outside_menu",
  mount_folders: "visual_permissions_mount_folders",
  mount_pages: "visual_permissions_mount_pages",
  open_document: "visual_permissions_open_document",
  other_permissions: "visual_permissions_other_permissions",
  view_as_user: "visual_permissions_view_as_user",
  viewable_users: "visual_permissions_viewable_users",
  write_other_permissions: "visual_permissions_write_other_permissions"
};
let it = 0;
async function oe(e, t, n = () => {
}) {
  return it += 1, new Y(R(e)).addMiddleware(Er).post(t).then(async (r) => {
    const o = Gt(r);
    return o === "taken" && r.raw().status === 200 && n(await r.resolve()), o;
  }, Gt).finally(() => {
    it -= 1;
  });
}
function $t() {
  return it > 0;
}
function Gt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (Sr.checkActiveSession(), "loggedOut") : eo(t.status);
  } catch {
    return "failed";
  }
}
function eo(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function ze(e, t = []) {
  return xe(new Y(R(_.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function Ve() {
  let e = 0;
  return {
    inspect: async (t, n) => {
      const r = ++e, o = await ze(t, n);
      return r === e ? o : null;
    },
    // Stryker disable next-line AssignmentOperator: counting down works as well, since only "is this still the newest" is asked
    drop: () => {
      e += 1;
    }
  };
}
async function Bn(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await (await new Y(R(_.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()).resolve()).url ?? "";
}
async function xe(e) {
  try {
    return await (await e).resolve();
  } catch {
    return De.error(g("platform.notRead")), null;
  }
}
const St = ["allowed", "allowedAndInherited", "inherited"], to = ["allowed", "denied"], ee = "allowed", ge = "denied", He = "inherited", Et = "allowedAndInherited", Ye = "adminOnly";
function U(e) {
  return St.some((t) => t === e);
}
const no = [...St, ge];
function Ct(e) {
  return to.includes(e);
}
function Be(e) {
  return e.substring(0, e.indexOf(":"));
}
function ro(e) {
  return e.substring(e.indexOf(":") + 1);
}
const ne = {};
function oo(e, t) {
  ne.tables = e, t.addEventListener("abort", () => {
    delete ne.tables;
  });
}
function io(e, t) {
  ne.fields = e, t.addEventListener("abort", () => {
    delete ne.fields;
  });
}
function so(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${p.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(p.unseen);
  });
  const { active: n, area: r, face: o } = y();
  !n || r !== "fields" || (ne.tables?.hide(e, t, o), ne.fields?.hide(e, t, o), zt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${p.verdict}]`)].some((a) => a.closest(`[${p.unseen}]`) === null) || $e(i);
  }), zt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${p.unseen}])`) === null && ($e(i), $e(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), ao(e), o === "preview" && lo(e, t));
}
function $e(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(p.unseen, "");
}
function zt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${p.verdict}]`)?.querySelector(`[${p.verdict}]`) !== null);
}
function ao(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(p.unseen) === !0 && e.querySelector(`.nav-item:not([${p.unseen}]) [data-typo3-tab]`)?.click();
}
function lo(e, { tables: t, named: n }) {
  if (e.querySelector(`.form-section:not([${p.unseen}])`) !== null)
    return;
  const r = co(e), o = t[r], s = (U(o) ? ne.fields : ne.tables)?.explain(e, r, o, n[r] ?? r);
  s !== void 0 && (s.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(s));
}
function co(e) {
  const n = e.querySelector(`[${p.token}][${p.inside}='']`)?.getAttribute(p.token) ?? "";
  return Be(n);
}
function uo(e, t) {
  let n = null;
  const r = Ve();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null;
  const i = () => {
    n !== null && so(n.doc, { tables: o?.targets ?? {}, named: o?.named ?? {} });
  }, s = async () => {
    if (n === null)
      return;
    const { fields: c } = n, { active: u, groupId: d } = y();
    if (!u || d === null) {
      r.drop(), c.forEach(([f]) => {
        f.removeAttribute(p.verdict), f.removeAttribute(p.outOfReach);
      }), o = null, i();
      return;
    }
    const m = [...new Set(c.map(([, f]) => Be(f)))], h = await r.inspect(d, m);
    if (h === null)
      return;
    const { scopes: v } = h;
    e.take(h), c.forEach(([f, b]) => {
      const w = v.fields.targets[b];
      w !== void 0 && f.setAttribute(p.verdict, w), f.toggleAttribute(p.outOfReach, !U(v.tablesModify.targets[Be(b)]));
    }), o = v.tablesModify, i(), Z("fields-judged", {});
  };
  D(({ doc: c, fields: u }) => {
    r.drop(), c.body.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`);
    const d = u.flatMap((m) => {
      const h = m.getAttribute(p.token);
      return h === null ? [] : [[m, h]];
    });
    n = d.length === 0 ? null : { doc: c, fields: d }, o = null, s();
  }, t), J("permissions-written", () => void s(), t);
  let a = null;
  q(({ active: c, groupId: u }) => {
    const d = `${String(c)}:${String(u)}`;
    if (d === a) {
      i();
      return;
    }
    a = d, s();
  }, t);
}
function po() {
  let e = null, t = /* @__PURE__ */ new WeakSet();
  const n = () => {
    const { groupId: r } = y();
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
function fo() {
  let e = [], t = {};
  return {
    allowedBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.allowedBy;
    }
  };
}
const Un = (e) => e.map((t) => `[${p.verdict}='${t}']:not([${p.outOfReach}])`).join(","), mo = (e) => Un(e === "pick" ? no : St), st = (e) => Un([e === "pick" ? ge : ee]), ho = `.${l.anchor}[${p.verdict}]`, go = (e, t, n) => {
  const r = U(e.getAttribute(p.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(mo(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(st(n)),
    waiting: t ? g(n === "pick" ? "platform.toAllow" : "allowFields.toDisallow") : ""
  };
}, vo = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function bo(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(p.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (vo(n), t.waiting === "") {
      n.removeAttribute(p.waiting);
      return;
    }
    n.setAttribute(p.waiting, t.waiting);
  }
}
function wo(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = y();
    n.querySelectorAll(ho).forEach((a) => {
      bo(a, go(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabAllow}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const d = () => [...c.querySelectorAll(`[${p.inside}='']`)].filter((h) => h.matches(st(a)) && !e.has(h)), m = u ?? i(s, c, d);
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
  D((s) => {
    const a = s.doc === n;
    if (n = s.doc, r(), a)
      return;
    const c = (u) => {
      const d = u.target, m = d.closest(`.${l.mark}`) === null ? d.closest(st(y().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), J("fields-judged", r, t), q(r, t);
}
async function yo(e, t) {
  return oe(_.allow_fields, { group: e, operations: [...t] });
}
const Vt = 280;
function Se(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, Vt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, Vt * 2);
}
const Ht = `[${p.verdict}]:not([${p.outOfReach}])`, ko = [ge, Ye].map((e) => `:not([${p.verdict}='${e}'])`).join("");
function Ao(e, t) {
  let n = null, r = null;
  const o = () => {
    if (n === null)
      return;
    const a = n.querySelector('form[name="editform"]');
    if (a === null)
      return;
    const { active: c, area: u, face: d, groupId: m } = y(), h = c && u === "fields";
    if (h && r?.form === a && r.face === d && r.groupId === m) {
      r.showCount();
      return;
    }
    n.querySelectorAll(`.${l.faceFoot}`).forEach((v) => {
      v.remove();
    }), r = null, h && a.querySelector(Ht) !== null && m !== null && (r = { form: a, face: d, groupId: m, showCount: i(a, d === "pick", m) });
  }, i = (a, c, u) => {
    let d = null;
    const m = a.ownerDocument.createElement("div");
    m.className = l.faceFoot;
    const h = () => [...a.querySelectorAll(`[${p.token}]`)].filter((w) => e.has(w)), v = () => {
      if (!c) {
        pe("preview");
        return;
      }
      Se(a.ownerDocument, () => {
        pe("preview");
      });
    }, f = Oe(m, {
      label: g(c ? "platform.doAllow" : "platform.doDisallow"),
      cancel: () => {
        e.drop(), v();
      },
      apply: () => {
        const w = h().map((k) => ({ field: k.getAttribute(p.token) ?? "", allow: c }));
        $t() || yo(u, w).then((k) => {
          if (y().groupId !== u) {
            k === "taken" && Z("permissions-written", {});
            return;
          }
          if (k !== "taken") {
            kt(f, k), d = w.length;
            return;
          }
          e.drop(), v(), Z("permissions-written", {});
        });
      }
    }), b = () => {
      const w = [...a.querySelectorAll(Ht)].filter((P) => P.closest(`.${l.otherKinds}`) === null), k = w.filter((P) => P.matches(ko)), x = h().length;
      d !== x && (d = null, f.state.textContent = K("allowFields.tally", w.length, k.length, w.length), f.waiting.textContent = x === 0 ? "" : K(`allowFields.${c ? "waiting" : "going"}`, x, x), f.ready(x > 0, c || x > 0));
    };
    return b(), a.append(m), b;
  }, s = () => {
    r?.showCount();
  };
  D((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), J("fields-judged", o, t), q(o, t);
}
const $o = `.${l.anchor}[${p.verdict}]`, So = 350, Eo = 250, at = (e) => e.getAttribute(p.verdict) ?? "", Co = (e) => e.getAttribute(p.token) ?? "", qo = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), lt = (e) => g(`allowFields.mark.${e}.title`), Lo = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return y().face === "pick" ? g(t ? "allowFields.hint.leave" : "allowFields.hint.allow") : g(t ? "allowFields.hint.keep" : "allowFields.hint.disallow");
};
function No(e, t) {
  if (t.length === 0)
    return [];
  const n = e.ownerDocument, r = n.createElement("h3");
  r.textContent = g("allowFields.allowedBy");
  const o = n.createElement("ul");
  o.append(...t.map((s) => {
    const a = n.createElement("span");
    a.textContent = s.title;
    const c = n.createElement("button");
    c.type = "button", c.className = "btn btn-default btn-sm", c.textContent = g("allowFields.showGroup"), c.setAttribute("aria-label", N(g("allowFields.showGroupNamed"), s.title)), c.addEventListener("click", () => {
      e.hidePopover(), yt(s.groupId);
    });
    const u = n.createElement("li");
    return u.append(a, c), u;
  }));
  const i = n.createElement("section");
  return i.append(r, o), [i];
}
function Oo(e, t, n) {
  const r = e.ownerDocument, o = at(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = lt(o);
  const a = r.createElement("p");
  a.textContent = g(`allowFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...No(e, n));
  const d = Lo(t);
  if (d !== "") {
    const m = r.createElement("footer");
    m.textContent = d, e.append(m);
  }
}
function _o(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (h) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      h.hidePopover();
    }, Eo);
  }, c = (h, v) => {
    h.contains(v.relatedTarget) || h.hidePopover();
  }, u = (h) => {
    const v = s.get(h);
    if (v !== void 0)
      return v;
    const f = h.createElement("div");
    return f.className = l.markCard, f.id = l.markCard, f.toggleAttribute("popover", !0), f.setAttribute("role", "dialog"), f.setAttribute("aria-labelledby", `${l.markCard}-title`), f.addEventListener("mouseenter", () => {
      window.clearTimeout(r);
    }), f.addEventListener("mouseleave", () => {
      a(f);
    }), f.addEventListener("focusout", (b) => {
      c(f, b);
    }), f.addEventListener("beforetoggle", (b) => {
      o = b.newState === "open", !o && (i?.setAttribute("aria-expanded", "false"), f.contains(h.activeElement) && i?.focus());
    }), h.body.append(f), s.set(h, f), f;
  }, d = (h, v) => {
    window.clearTimeout(r);
    const f = u(h.ownerDocument);
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = h, h.style.setProperty("anchor-name", "--vperm-mark"), h.setAttribute("aria-expanded", "true"), Oo(f, v, e.allowedBy(Co(v))), f.showPopover();
  }, m = () => {
    n.querySelectorAll($o).forEach((h) => {
      const v = qo(h);
      if (v === null)
        return;
      const f = v.querySelector(`.${l.mark}`);
      if (f !== null) {
        f.setAttribute("aria-label", lt(at(h)));
        return;
      }
      const b = v.ownerDocument.createElement("button");
      b.type = "button", b.className = l.mark, b.setAttribute("aria-label", lt(at(h))), b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-controls", l.markCard), b.setAttribute("aria-expanded", "false"), b.addEventListener("click", (w) => {
        d(b, h), w.detail === 0 && u(b.ownerDocument).querySelector("button")?.focus();
      }), b.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          d(b, h);
          return;
        }
        r = window.setTimeout(() => {
          d(b, h);
        }, So);
      }), b.addEventListener("mouseleave", () => {
        a(u(b.ownerDocument));
      }), b.addEventListener("focusout", (w) => {
        c(u(b.ownerDocument), w);
      }), v.append(b);
    });
  };
  D((h) => {
    n = h.doc;
  }, t), J("fields-judged", m, t);
}
function xo(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      Po(r);
    });
  };
  D((r) => {
    t = r.doc, n();
  }, e), J("fields-judged", n, e);
}
function Po(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${p.token}]:not([${p.outOfReach}])`) === null);
}
const To = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Te = (e) => `${e}, ${To[e]}`, jn = [
  { key: "modules", host: Te(".scaffold-sidebar"), ground: "panel" },
  {
    key: "pageMounts",
    host: Te("typo3-backend-navigation-component-pagetree"),
    showing: "typo3-backend-navigation-component-pagetree",
    ground: "tree"
  },
  {
    key: "fileMounts",
    host: Te("typo3-backend-navigation-component-filestoragetree"),
    showing: "typo3-backend-navigation-component-filestoragetree",
    ground: "tree"
  },
  { key: "fields", host: Te('[slot="content"]'), ground: "module" }
];
function Yt(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(p.area), t.removeAttribute(p.ground);
  });
}
function Wn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Fo(e, t) {
  const n = (i) => {
    if ((i.active ? re(e, i.groupId) : null) === null) {
      Yt(e);
      return;
    }
    const a = jn.flatMap((c) => {
      const u = Wn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Yt(e), a.forEach(({ element: c, key: u, ground: d }) => {
      c.classList.add(l.frame), c.setAttribute(p.area, u), c.setAttribute(p.ground, d), Io(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Mo(e) && n(y());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(y()), q(n, t);
}
function Mo(e) {
  return jn.some((t) => {
    const n = Wn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(p.area) !== t.key);
  });
}
function Io(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const Ro = "typo3-backend-contextual-record-edit-trigger";
function Do(e, t) {
  let n = null;
  const r = (d) => {
    const m = d.target.closest(Ro);
    !y().active || m === null || (d.preventDefault(), d.stopPropagation(), ce(e)?.setAttribute("endpoint", m.getAttribute("edit-url") ?? ""));
  };
  e.addEventListener("click", r, { capture: !0, signal: t });
  const o = () => {
    const { active: d, area: m } = y();
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
  D((d) => {
    n = d.doc, n.addEventListener("submit", i, { capture: !0, signal: t }), n.addEventListener("click", s, { capture: !0, signal: t }), n.addEventListener("click", r, { capture: !0, signal: t }), u();
  }, t), q(u, t);
}
const Bo = ".module-docheader-buttons .btn-toolbar", Uo = (e, t) => {
  e.location.assign(t);
};
function jo(e, t = Uo) {
  let n = null;
  const r = () => {
    if (n === null || y().active)
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
    const { active: s, area: a } = y();
    !s || a !== "fields" || i.querySelectorAll(`[${p.switch}][${p.inside}='']`).forEach((c) => {
      const u = c.querySelector("select");
      if (u === null)
        return;
      const d = i.createElement("div");
      d.className = `input-group input-group-sm ${l.typeSwitch}`;
      const m = c.getAttribute(p.switch) ?? "", h = i.createElement("span");
      h.className = "input-group-text", h.textContent = m;
      const v = i.createElement("select");
      v.className = "form-select form-select-sm", v.setAttribute("aria-label", m), v.append(...[...u.children].map((f) => f.cloneNode(!0))), v.value = u.value, v.addEventListener("change", () => {
        const [f, b, w] = u.name.slice(5, -1).split("]["), k = new URL(i.URL), x = String(b).startsWith("NEW") ? `defVals[${String(f)}][${String(w)}]` : `vperm[value][${String(f)}][${String(b)}][${String(w)}]`;
        k.searchParams.set(x, v.value), t(i, k.toString());
      }), d.append(h, v), i.querySelector(Bo)?.append(d);
    });
  };
  q(() => {
    r(), o();
  }, e), D(({ doc: i }) => {
    n = i, r(), o();
  }, e);
}
function qt(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), e.groups.forEach(({ label: h, values: v }) => {
    const f = document.createElement("section"), b = document.createElement("h2");
    b.textContent = h;
    const w = document.createElement("div");
    w.append(...v.map((k) => Ko(k, n.has(k.value), o.has(k.value)))), f.append(b, w), i.append(f);
  });
  const s = L(document, l.faceWaiting, ""), a = () => [...i.querySelectorAll("input")].filter((h) => h.checked !== n.has(h.value)).map((h) => ({ value: h.value, allow: h.checked })), c = {
    text: g("platform.cancel"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: "btn-default",
    name: "cancel",
    trigger: (h, v) => {
      v.hideModal();
    }
  }, u = {
    text: g("platform.doApply"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: "btn-primary",
    name: "apply",
    trigger: (h, v) => {
      v.querySelector('button[name="apply"]')?.toggleAttribute("disabled", !0), r(a()).then((f) => {
        if (f) {
          v.hideModal();
          return;
        }
        m();
      });
    }
  }, d = It.advanced({
    title: N(e.title, t),
    content: i,
    size: It.sizes.large,
    buttons: [c, u]
  }), m = () => {
    d.updateComplete.then(() => {
      d.querySelector('button[name="apply"]')?.toggleAttribute("disabled", a().length === 0);
    });
  };
  m(), d.updateComplete.then(() => {
    d.querySelector(".modal-footer")?.prepend(s);
  }), i.addEventListener("change", () => {
    const h = a(), v = h.filter(({ allow: f }) => f).length;
    s.textContent = Wo(v, h.length - v), m();
  });
}
function Wo(e, t) {
  return [
    ...e > 0 ? [N(g("platform.waiting"), e)] : [],
    ...t > 0 ? [N(g("platform.going"), t)] : []
  ].join(`
`);
}
function Ko({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function Kn(e, t) {
  return oe(_.allow_modules, { group: e, operations: [...t] }, (n) => {
    n.alsoAllowed.forEach((r) => {
      De.info(N(g("allowModules.alsoAllowed"), r));
    });
  });
}
async function Go(e, t) {
  const n = await ze(e);
  if (n === null)
    return;
  const r = await xe(new Y(R(_.modules_outside_menu)).get());
  if (r === null)
    return;
  const o = new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => U(i)).map(([i]) => i));
  qt(r, t, o, async (i) => await Kn(e, i.map(({ value: a, allow: c }) => ({ module: a, allow: c }))) !== "taken" ? !1 : (Z("permissions-written", {}), !0), new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => i === He).map(([i]) => i)));
}
const Gn = "data-modulemenu-identifier", Ue = `[${Gn}]:not([aria-controls])`, zn = ".modulemenu-group-container";
let ye = !1;
const ct = /* @__PURE__ */ new WeakMap();
let de = null;
const ke = Tn(560);
function zo(e, t, n) {
  const r = y().groupId, o = re(e, r) ?? "", i = [...t.querySelectorAll(Ue)], s = i.filter((A) => U(Q(A))), a = i.filter((A) => Q(A) === ee), c = Jt(e, l.facePreview, g("platform.preview"), N(g("allowModules.previewFor"), o)), u = Jt(e, l.facePick, g("platform.pick"), N(g("allowModules.pickFor"), o)), m = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  m.className = l.coin, m.replaceChildren(c.sheet, u.sheet);
  const v = e.querySelector(`.${l.allowed}`) ?? e.createElement("div");
  v.className = l.allowed, m.parentElement !== v && v.replaceChildren(m);
  const f = Ho(e, t);
  v.parentElement !== f && f.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    f.classList.add(l.panelCardTurned);
  });
  const b = (A) => {
    ye = A, m.classList.toggle(l.coinTurned, A), c.sheet.toggleAttribute("inert", A), u.sheet.toggleAttribute("inert", !A);
  }, w = (A) => {
    const E = A.filter((O) => O.allow).map((O) => O.module);
    r !== null && y().groupId === r && ($t() || (E.forEach((O) => {
      ke.add(O);
    }), Kn(r, A).then((O) => {
      if (O !== "taken") {
        E.forEach((j) => {
          ke.delete(j);
        }), kt(ye ? P : k, O);
        return;
      }
      b(!1), Z("permissions-written", {});
    })));
  }, k = Oe(c.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      Xe(c.scroll).forEach((A) => {
        A.classList.remove(l.faceMarked);
      }), T();
    },
    apply: () => {
      w(Xe(c.scroll).map((A) => ({ module: Fe(A), allow: !1 })));
    }
  }), x = () => {
    Qt(u.scroll, t, T), T(), b(!1);
  }, P = Oe(u.foot, {
    label: g("platform.doAllow"),
    cancel: x,
    apply: () => {
      const A = Xt(u.scroll).filter((E) => Q(E) !== ct.get(E));
      w(A.map((E) => ({ module: Fe(E), allow: !0 })));
    }
  }), T = () => {
    const A = Xt(u.scroll), E = A.filter((M) => Q(M) !== ct.get(M)), O = A.filter((M) => U(Q(M)) && !E.includes(M)).length, j = K("allowModules.tally", A.length, O, A.length);
    G.textContent = j;
    const W = Xe(c.scroll);
    k.state.textContent = W.length === 0 ? j : K("allowModules.marked", a.length, W.length, a.length);
    const $ = W.map(Fe), C = n.filter(({ verdict: M, parent: te }) => U(M) && $.includes(te)).map(({ label: M }) => N(g("allowModules.alsoRemoved.name"), M));
    k.waiting.textContent = C.length === 0 ? "" : K("allowModules.alsoRemoved", C.length, C.join(", ")), k.ready(W.length > 0, W.length > 0), P.state.textContent = "", P.waiting.textContent = E.length === 0 ? "" : N(g("platform.waiting"), E.length), P.ready(E.length > 0, !0);
  };
  c.bar.append(
    X(e, g("allowModules.allow"), "btn btn-default", () => {
      b(!0);
    }),
    L(e, l.faceHint, g("allowModules.hint"))
  );
  const H = e.createElement("div");
  H.className = l.faceChoice;
  const G = L(e, l.faceCounted, "");
  H.append(G), H.append(X(e, g("allowModules.outside"), "btn btn-default", () => {
    r !== null && Go(r, o);
  }));
  const S = n.filter(({ verdict: A }) => U(A)).length;
  H.append(L(e, l.faceCounted, K("allowModules.outside.tally", n.length, S, n.length))), u.sheet.insertBefore(H, u.foot), u.scroll.style.setProperty("--vperm-queued-note", `"${g("platform.toAllow")}"`), Yo(e, c.scroll, s, g("platform.from"), T), Qt(u.scroll, t, T), T(), b(ye), ke.start(() => {
    m.querySelectorAll(`.${l.facePreview} ${Ue}`).forEach((A) => {
      A.classList.toggle(l.justAdded, ke.isLit(Fe(A)));
    });
  }), de?.abort(), de = new AbortController(), At(e, de.signal, () => ye, x), Fn(r, [k, P], de.signal);
}
function Vo(e, t) {
  de?.abort(), de = null, ye = !1, ke.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.allowed}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, xn);
  }));
}
function Ho(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Jt(e, t, n, r) {
  const o = Pn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function Yo(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(zn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(L(e, l.allowedGroup, a)));
    const c = Xo(s);
    c.getAttribute(p.verdict) === ee ? Hn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(L(e, l.allowedFrom, r)), t.append(c);
  });
}
function Qt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(zn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(Ue).forEach((r) => {
    Vn(r), ct.set(r, Q(r)), U(Q(r)) && r.setAttribute("aria-disabled", "true"), Hn(r, () => {
      Qo(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(L(r.ownerDocument, l.allowedGroup, r.getAttribute("title") ?? ""));
  });
}
function Jo(e) {
  const t = Q(e);
  return e.getAttribute("aria-disabled") === "true" || !Ct(t) ? "" : U(t) ? "unpick" : "allow";
}
function Qo(e) {
  const t = Jo(e);
  t !== "" && e.setAttribute(p.verdict, t === "allow" ? ee : ge);
}
function Vn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function Xo(e) {
  const t = e.cloneNode(!0);
  return Vn(t), t;
}
function Hn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function Xe(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function Xt(e) {
  return [...e.querySelectorAll(Ue)].filter((t) => Ct(Q(t)));
}
const Q = (e) => e.getAttribute(p.verdict) ?? "", Fe = (e) => e.getAttribute(Gn) ?? "", Ze = "#modulemenu", Yn = "data-modulemenu-identifier", Zo = `[${Yn}]:not([aria-controls])`;
function ei(e, t) {
  const n = Ve();
  let r = null;
  const o = async () => {
    const { active: s, groupId: a, area: c } = y();
    if (!s || a === null || c !== "modules") {
      n.drop(), e.querySelectorAll(`${Ze} [${p.verdict}]`).forEach((f) => {
        f.removeAttribute(p.verdict);
      }), i(e);
      return;
    }
    const u = e.querySelector(Ze);
    if (u === null)
      return;
    const d = [...u.querySelectorAll(Zo)];
    if (d.length === 0)
      return;
    const m = await n.inspect(a);
    if (m === null)
      return;
    const { scopes: h } = m;
    Object.entries(h.modules.targets).forEach(([f, b]) => {
      d.filter((w) => w.getAttribute(Yn) === f).forEach((w) => {
        w.setAttribute(p.verdict, b);
      });
    }), r ??= xe(new Y(R(_.modules_outside_menu)).get());
    const v = await r;
    if (v === null) {
      r = null;
      return;
    }
    zo(e, u, v.groups.flatMap(({ values: f }) => f.map(({ value: b, label: w, parent: k }) => ({
      verdict: h.modules.targets[b],
      parent: k,
      label: w
    }))));
  }, i = (s) => {
    const a = s.querySelector(Ze);
    a !== null && Vo(s, a);
  };
  o(), J("permissions-written", () => void o(), t), q(() => void o(), t);
}
async function ti(e, t, n) {
  const r = await oe(_.allow_tables, { group: e, operations: [{ table: t, allow: n }] });
  return r === "taken" && Z("permissions-written", {}), r;
}
function Jn(e, { groupId: t, table: n, called: r, verdict: o }) {
  const i = o === ee, s = o === He || o === Et, a = o === Ye, c = e.createElement("div");
  c.className = `callout callout-notice callout-sm ${l.tableGate}`, c.append(L(e, l.tableName, r)), c.append(L(e, l.tableToken, n));
  const u = L(e, "callout-body", g(ni(o)));
  if (c.append(u), !s && !a) {
    const d = X(
      e,
      N(g(i ? "allowTables.disallow" : "allowTables.allow"), r),
      `btn btn-default btn-sm ${i ? l.tableDisallow : l.tableAllow}`,
      () => {
        d.toggleAttribute("disabled", !0), ti(t, n, !i).then((m) => {
          d.toggleAttribute("disabled", !1), m !== "taken" && m !== "cancelled" && (u.textContent = g(`platform.${m}`));
        });
      }
    );
    c.append(d);
  }
  return c;
}
function ni(e) {
  return e === ee ? "allowTables.theirs" : e === Ye ? "allowTables.adminOnly" : e === Et ? "allowTables.alsoInherited" : e === He ? "allowTables.inherited" : "allowTables.missing";
}
const Zt = ".typo3-TCEforms";
function ri(e) {
  let t = null;
  const n = Ve(), r = async () => {
    if (t === null)
      return;
    const o = t;
    o.querySelectorAll(`.${l.tableGate}:not(.${l.nothingTheirs})`).forEach((v) => {
      v.remove();
    });
    const { active: i, area: s, face: a, groupId: c } = y();
    if (!i || s !== "fields" || a !== "pick" || c === null) {
      n.drop();
      return;
    }
    const u = /* @__PURE__ */ new Map();
    o.querySelectorAll(`[${p.inside}]`).forEach((v) => {
      const f = v.getAttribute(p.inside) ?? "", b = f === "" ? v.closest(Zt) : o.querySelector(`[${p.field}='${f}']`), w = v.getAttribute(p.token) ?? "";
      b !== null && u.set(b, Be(w));
    });
    const d = await n.inspect(c, [...new Set(u.values())]);
    if (d === null)
      return;
    const { named: m, targets: h } = d.scopes.tablesModify;
    u.forEach((v, f) => {
      const b = h[v];
      if (![ee, He, Et, ge].some((x) => x === b))
        return;
      const w = Jn(o, { groupId: c, table: v, called: m[v] ?? v, verdict: b }), k = f.matches(Zt) ? null : f.querySelector(".form-irre-object");
      if (k === null) {
        f.prepend(w);
        return;
      }
      k.before(w);
    });
  };
  D((o) => {
    t = o.doc, r();
  }, e), J("permissions-written", () => void r(), e), q(() => void r(), e);
}
const oi = ".form-group";
function Qn(e) {
  return e.closest(oi);
}
function ii(e) {
  oo({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !U(s)).forEach(([s]) => {
        t.querySelectorAll(`[${p.token}^='${s}:']`).forEach((a) => {
          $e(a.closest(i) ?? Qn(a) ?? a);
        }), o === "preview" && si(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o) => Jn(t, { groupId: y().groupId ?? 0, table: n, called: o, verdict: r })
  }, e);
}
function si(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${p.token}^='${t}:']:not([${p.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(p.inside) ?? "", s = e.querySelector(`[${p.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(L(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      N(g("allowTables.gone"), n)
    ));
  });
}
async function ai(e, t, n) {
  return oe(e === "pageTypes" ? _.allow_page_types : _.allow_values, {
    group: t,
    operations: [...n]
  });
}
function li(e) {
  let t = null;
  const n = () => {
    if (t === null)
      return;
    const { active: r, face: o } = y();
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
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = g(`allowedValues.choose.${ro(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(p.choices) ?? "{}"), u = y().groupId ?? 0;
        ze(u).then((d) => {
          if (d === null)
            return;
          const m = i.getAttribute(p.allows) === "pageTypes" ? "pageTypes" : "fieldValues", h = m === "pageTypes" ? "" : `${s}:`, v = new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => U(f)).map(([f]) => f.substring(h.length)));
          qt(c, re(document, u) ?? "", v, async (f) => await ai(m, u, f.map(({ value: w, allow: k }) => ({ value: `${h}${w}`, allow: k }))) !== "taken" ? !1 : (Z("permissions-written", {}), !0), new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => U(f) && f !== ee).map(([f]) => f.substring(h.length))));
        });
      }), i.after(a);
    });
  };
  D((r) => {
    t = r.doc, n();
  }, e), q(n, e);
}
const ci = `[${p.verdict}='${ge}'], [${p.verdict}='${Ye}']`;
function ui(e) {
  io({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(ci).forEach((o) => {
        $e(Qn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        L(t, "callout-body", N(g("allowFields.recordNoFields"), o)),
        X(t, g("recordForm.add"), "btn btn-default btn-sm", () => {
          Se(t, () => {
            pe("pick");
          });
        })
      ), i;
    }
  }, e);
}
async function di(e, t) {
  const n = await ze(e);
  if (n === null)
    return;
  const r = await xe(new Y(R(_.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  qt(r, t, o, async (i) => await oe(_.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (Z("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== ee).map(([i]) => i)));
}
const Xn = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: le.folderTree,
  base: Cr,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = R(_.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: R("filestorage_tree_rootline"),
      filterUrl: R("filestorage_tree_filter"),
      showIcons: !0
    };
  },
  write: async (e, t, n, r) => oe(_.mount_folders, {
    group: e,
    operations: t.map((o) => ({
      folder: decodeURIComponent(o),
      mount: n,
      // A folder with an existing record needs no new title; the backend keeps the one it has
      title: r.get(o) ?? ""
    }))
  }),
  choice: (e, t) => X(
    e,
    g("mountBranches.folders.chooseOperations"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    "btn btn-default",
    () => {
      di(t, re(e, t) ?? "");
    }
  )
}, Zn = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: le.pageTree,
  base: qr,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => ({ ...await (await new Y(R("page_tree_browser_configuration")).get()).resolve(), rootlineUrl: R("page_tree_rootline") }),
  write: async (e, t, n) => oe(_.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function pi(e, t) {
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
function fi(e) {
  const t = /* @__PURE__ */ new Map();
  return er(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function mi(e, t) {
  const n = er(e);
  return n.forEach((r, o) => {
    const i = r.parentElement, s = i?.querySelector(`.${l.namingWhy}`) ?? null;
    if (r.value.trim() === "") {
      const a = s ?? L(e.ownerDocument, l.namingWhy, t);
      a.id = `${l.namingWhy}-${String(o)}`, i?.append(a), r.setAttribute("aria-invalid", "true"), r.setAttribute("aria-describedby", a.id);
      return;
    }
    s?.remove(), r.removeAttribute("aria-invalid"), r.removeAttribute("aria-describedby");
  }), n.every((r) => r.value.trim() !== "");
}
const er = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ee = Tn(520), B = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), je = /* @__PURE__ */ new Set(), ut = /* @__PURE__ */ new Set(), tr = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, nr = (e) => V.has(e) && !je.has(e), rr = (e) => e.__parents ?? [], Ce = (e) => rr(e).some((t) => V.has(t)), hi = (e, t) => t.some((n) => V.has(n.identifier) && rr(n).includes(e.identifier)), or = (e) => e.detail;
function gi(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = or(o);
    s === !1 || tr(i.identifier) || V.has(i.identifier) || Ce(i) || (z.has(i.identifier) ? z.delete(i.identifier) : z.add(i.identifier), t(), et(Re(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Re(e);
    o !== null && (!_e.has(o) || e.querySelector(".node[data-id='0']") !== null) && et(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), et(Re(e));
}
function vi(e) {
  const t = Re(e);
  if (t === null)
    return;
  const n = _e.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), _e.delete(t), t.requestUpdate());
}
function et(e) {
  if (e !== null) {
    if (en(e.nodes), !_e.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      _e.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => en(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return V.has(r.identifier) && o.push(l.mountAlready), z.has(r.identifier) && o.push(l.mountPicked), tr(r.identifier) && o.push(l.mountWhole), o;
      };
    }
    e.requestUpdate();
  }
}
function en(e) {
  return e.filter((t) => Number(t.identifier) < 1).forEach((t) => {
    t.__hidden = !0;
  }), e;
}
const _e = /* @__PURE__ */ new WeakMap(), Re = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let tt = "", tn = () => {
};
async function bi(e, t, n, { groupId: r, kind: o, showCount: i }) {
  tn = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), tt = s;
    return;
  }
  const a = o.tree;
  if (wi(a, o.base), t.querySelector(a) !== null && tt === s)
    return;
  const u = await o.rootedAt(r), d = e.createElement(a);
  d.addEventListener("mousedown", (h) => {
    const v = h.target instanceof Element ? h.target.closest(".node") : null;
    v !== null && (nr(v.getAttribute("data-id") ?? "") || h.preventDefault());
  }), d.addEventListener("typo3:tree:node-selected", (h) => {
    h.stopPropagation();
    const { node: v, propagate: f } = or(h);
    f !== !1 && (B.has(v.identifier) ? B.delete(v.identifier) : B.add(v.identifier), dt(e), tn());
  }), Object.assign(d, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(d), t.replaceChildren(m), tt = s, Object.assign(d, { setup: u });
}
function dt(e) {
  e.querySelector(
    `.${l.facePreview} :is(${le.pageTree}, ${le.folderTree})`
  )?.requestUpdate();
}
function wi(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return nr(n.identifier);
    }
    // Core loads the first levels only, so a deeper mount needs the way down to it loaded
    async loadData() {
      await super.loadData();
      const n = [...V].filter((r) => !this.nodes.some((o) => o.identifier === r));
      for (const r of n) {
        const o = await new Y(this.settings.rootlineUrl ?? "").withQueryArguments({ identifier: r }).get().catch(() => null);
        if (o === null)
          continue;
        const { rootline: i } = await o.resolve();
        for (const s of i.slice(0, -1)) {
          const a = this.nodes.find((c) => c.identifier === s);
          a !== void 0 && a.loaded !== !0 && await this.loadChildren(a);
        }
      }
      nn(this.nodes);
    }
    prepareNodes(n) {
      return nn(super.prepareNodes(n));
    }
    hideChildren(n) {
      !Ce(n) && !V.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return Ce(n) && r.push(l.mountInside), !Ce(n) && !V.has(n.identifier) && r.push(l.mountContext), je.has(n.identifier) && r.push(l.mountInherited), B.has(n.identifier) && r.push(l.faceMarked), ut.has(n.identifier) && r.push(l.mountUnseen), Ee.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function nn(e) {
  return e.forEach((t) => {
    Ce(t) || V.has(t.identifier) || (t.__expanded = !0, t.__hidden = !hi(t, e));
  }), e;
}
function yi(e, t, n, r) {
  const o = (u) => g(`${r}.${u}`);
  if (t.sheet.querySelector(`.${l.unseenPages}`)?.remove(), n.length === 0)
    return;
  const i = e.createElement("div");
  i.className = l.unseenPages;
  const s = e.createElement("b");
  s.textContent = K(`${r}.unseen`, n.length, n.length);
  const a = e.createElement("p");
  a.append(s, ` ${o("unseenWhy")}`);
  const c = e.createElement("ul");
  n.forEach(({ page: u, title: d, link: m }) => {
    const h = e.createElement("a");
    h.href = m, h.addEventListener("click", (f) => {
      f.preventDefault(), yn.update("web", u, !0), We.App.showModule("permissions_pages");
    }), h.setAttribute("aria-label", N(o("unseenLink"), d)), h.textContent = N(o("unseenPage"), d);
    const v = e.createElement("li");
    v.append(h), c.append(v);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let Ae = !1, pt = null, qe = null;
function ki(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (S) => g(`${i}.${S}`), a = re(e, r) ?? "", c = $i(e, t);
  pt !== r && (B.clear(), z.clear(), pt = r), qe?.abort(), qe = new AbortController();
  const { signal: u } = qe, d = rn(e, c, l.facePick), m = rn(e, c, l.facePreview);
  m.eyebrow.textContent = g("platform.preview"), m.sentence.textContent = N(s("previewFor"), a), d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = N(s("pickFor"), a);
  const h = n.order;
  V.clear(), je.clear(), Object.entries(n.targets).forEach(([S, A]) => {
    V.add(S), Ct(A) || (je.add(S), B.delete(S));
  });
  const v = (S) => {
    m.sheet.toggleAttribute("inert", S), d.sheet.toggleAttribute("inert", !S);
  }, f = (S) => {
    Ae = S, c.classList.toggle(l.panelCardTurned, !S), v(S);
  };
  v(Ae);
  const b = () => {
    const S = K(`${i}.tally`, h.length, h.length);
    k.state.textContent = B.size === 0 ? S : K(`${i}.marked`, h.length, B.size, h.length), k.ready(B.size > 0, B.size > 0), G.state.textContent = S, G.waiting.textContent = z.size === 0 ? "" : N(g("mountBranches.waiting"), z.size), G.ready(z.size > 0, !0);
  }, w = (S, A) => {
    if (y().groupId !== r)
      return;
    const E = [...S];
    if (E.length === 0 || $t())
      return;
    const O = o.write(r, E, A, fi(d.sheet));
    A && E.forEach((j) => {
      Ee.add(j);
    }), O.then((j) => {
      if (j !== "taken") {
        E.forEach((W) => {
          Ee.delete(W);
        }), kt(A ? G : k, j);
        return;
      }
      E.forEach((W) => S.delete(W)), P(), f(!1), Z("permissions-written", {});
    });
  }, k = Oe(m.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      B.clear(), dt(e), b();
    },
    apply: () => {
      w(B, !1);
    }
  }), x = new Set(Object.keys(n.named)), P = () => {
    d.sheet.querySelector(`.${l.naming}`)?.remove(), d.scroll.hidden = !1, d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = N(s("pickFor"), a);
  }, T = () => {
    const S = [...z].filter((E) => !x.has(E)), A = d.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && S.length > 0 && !A) {
      const E = pi(e, S);
      E.addEventListener("submit", (O) => {
        O.preventDefault(), T();
      }), E.addEventListener("input", () => {
        G.ready(H(), !0, !0);
      }), d.eyebrow.textContent = s("name"), d.sentence.textContent = s("nameFor"), d.scroll.hidden = !0, d.sheet.insertBefore(E, d.foot), E.querySelector("input")?.focus();
      return;
    }
    if (A && !H()) {
      d.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    w(z, !0);
  }, H = () => mi(d.sheet, s("nameWhy")), G = Oe(d.foot, {
    label: g("mountBranches.doAdd"),
    cancel: () => {
      z.clear(), P(), f(!1), b();
    },
    apply: T
  });
  if (d.scroll.style.setProperty("--vperm-queued-note", `"${g("mountBranches.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), ut.clear(), n.unseen.forEach(({ page: S }) => {
    ut.add(String(S));
  }), yi(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const S = e.createElement("div");
    S.className = l.faceChoice, S.append(o.choice(e, r)), m.sheet.insertBefore(S, m.foot);
  }
  bi(e, m.scroll, h, { groupId: r, kind: o, showCount: b }), gi(d.sheet, b, u), b(), Ee.start(() => {
    dt(e);
  }), At(e, u, () => Ae, () => {
    if (d.sheet.querySelector(`.${l.naming}`) !== null) {
      P();
      return;
    }
    f(!1);
  }), Fn(r, [k, G], u), m.bar.replaceChildren(
    m.eyebrow,
    m.sentence,
    X(e, s("add"), "btn btn-default", () => {
      f(!0);
    }),
    L(e, l.faceHint, s("hint"))
  ), window.requestAnimationFrame(() => {
    f(Ae);
  });
}
function Ai(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  Ae = !1, B.clear(), pt = null, Ee.stop(), qe?.abort(), qe = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), vi(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, xn));
}
function $i(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function rn(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return Si(r);
  const o = Pn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function Si(e) {
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
const Ei = { pageMounts: Zn, fileMounts: Xn };
function Ci(e, t) {
  const n = Ve();
  let r = !1;
  const o = async () => {
    const { active: s, groupId: a, area: c } = y(), u = Ei[c];
    if (!s || a === null || u === void 0) {
      n.drop(), Ai(e);
      return;
    }
    const d = e.querySelector(u.component);
    if (d === null)
      return;
    r = !0;
    const m = await n.inspect(a);
    r = !1, m !== null && ki(e, d, u.mounted(m.scopes), { groupId: a, kind: u });
  }, i = new MutationObserver(() => {
    !r && [Zn, Xn].every(({ component: s }) => e.querySelector(`${s} > .${l.panelCard}`) === null) && o();
  });
  i.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    i.disconnect();
  }), o(), J("permissions-written", () => void o(), t), q(() => void o(), t);
}
let ft = null;
function ir(e) {
  ft = e, We.App.showModule(e);
}
function qi(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function Li(e) {
  const t = ft === e;
  return ft = null, t;
}
const Le = "other", on = ["modules", "pageMounts", "fileMounts", "fields", Le], Ni = 10, se = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Le]: "module"
}, Oi = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function _i(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", g("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(p.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const b = sr(e);
    if (b.forEach(($) => {
      v.observe($);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = b.map(($) => ie($)), k = [...on, ...w.filter(($) => !on.includes($))], x = w.includes("fields") ? [Le] : [], P = b.filter(($) => $.getBoundingClientRect().width !== 0).map(ie), T = P.includes("fields") ? [...P, Le] : P, [H] = T.includes("fields") ? ["fields"] : T, G = T.find(($) => se[$] !== void 0 && se[$] === se[f.picked]), S = T.includes(f.picked) ? f.picked : G ?? H;
    if (T.join() !== i && (i = T.join(), S !== void 0 && S !== f.area)) {
      Rr(S);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap(($) => [ji(e, $), Ui(e, $)]),
      ...k.map(($) => Pi(e, $, g(`pickAnArea.${$}`)))
    )), n.parentElement === null && xi(e).append(n);
    const A = f.area === Le ? "fields" : f.area;
    Mi(n, e), Ii(n, e, b.find(($) => ie($) === A) ?? null);
    const E = f.area !== "fields";
    b.forEach(($) => {
      const C = ie($), M = C === A, te = E && !M && C !== "modules", ue = Me(n, C);
      ue?.setAttribute("aria-selected", String(C === f.area)), Ti(ue, $), $.toggleAttribute(p.armed, M), $.toggleAttribute("inert", te), r.add($), Wi(Gi(n, C), $, te), Ri(zi(n, C), $, M, b);
    });
    let O = 0, j = null;
    k.forEach(($) => {
      const C = Me(n, $);
      if (C === null)
        return;
      const M = C.hidden ? 0 : C.getBoundingClientRect().width, te = b.find((Ar) => ie(Ar) === $), ue = te ?? Ki($, b), Je = Math.max(O, ue?.getBoundingClientRect().left ?? O);
      C.style.setProperty("--vperm-host-x", `${String(Je)}px`);
      const Mt = ue?.getBoundingClientRect().right;
      Mt !== void 0 && C.style.setProperty("--vperm-tab-room", `${String(Mt - Je)}px`), C.toggleAttribute(p.elsewhere, te === void 0), te === void 0 && (C.setAttribute("aria-selected", String($ === f.area)), Pe(C, ue ?? j ?? C)), O = C.hidden ? O : Je + M + Ni, j = C;
    });
    const W = Me(n, "fields");
    x.forEach(($) => {
      const C = Me(n, $);
      C === null || W === null || (C.setAttribute("aria-selected", String($ === f.area)), C.hidden = W.hidden);
    });
  };
  let c = 0;
  const u = () => {
    window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
      a(y());
    });
  }, d = new MutationObserver((f) => {
    f.some((b) => !n.contains(b.target)) && u();
  });
  let m = !1;
  const h = (f) => {
    const b = f.detail.module ?? "", w = Li(b);
    if (!m) {
      m = !0;
      return;
    }
    !w && se[y().picked] === "tree" && Nn("fields");
  };
  e.addEventListener("typo3-module-loaded", h, { signal: t }), d.observe(e.body, { childList: !0, subtree: !0 });
  const v = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    d.disconnect(), v.disconnect(), window.cancelAnimationFrame(c);
  }), q(a, t), a(y());
}
const xi = (e) => e.querySelector(".scaffold") ?? e.body;
function Pi(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(p.area, t), r.setAttribute(p.label, n), r.title = n, r.append(L(e, l.tabLabel, n)), r.addEventListener("click", () => {
    Nn(t);
    const o = Oi[t];
    o !== void 0 && sr(e).every((i) => ie(i) !== t) && ir(o);
  }), r;
}
function Ti(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, Pe(e, t));
}
const Pe = (e, t) => {
  e.setAttribute(p.ground, t.getAttribute(p.ground) ?? "");
}, Fi = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Mi(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function Ii(e, t, n) {
  const r = Di(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, Pe(r, n), Lt(r, n);
}
function Lt(e, t) {
  const n = t.getBoundingClientRect(), r = Fi(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function Ri(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  Pe(e, t), e.hidden = o.width === 0 || o.left === 0 || n || _n(t.ownerDocument) === 0 || Bi(o, r), Lt(e, t);
}
function Di(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Bi(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Ui(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(p.area, t), n;
}
function ji(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(p.area, t), n;
}
function Wi(e, t, n) {
  e !== null && (e.hidden = !n, n && (Pe(e, t), Lt(e, t)));
}
const Ki = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  se[e] === void 0 ? void 0 : t.find((n) => se[ie(n)] === se[e])
), Me = (e, t) => e.querySelector(`.${l.tab}[${p.area}="${t}"]`), Gi = (e, t) => e.querySelector(`.${l.areaCover}[${p.area}="${t}"]`), zi = (e, t) => e.querySelector(`.${l.tabSeam}[${p.area}="${t}"]`);
function sr(e) {
  return [...e.querySelectorAll(`.${l.frame}[${p.area}]`)];
}
const ie = (e) => e.getAttribute(p.area) ?? "", ar = "#modulemenu", Vi = `${ar} .modulemenu-group-container.collapse:not(.show)`, Hi = `${ar} [aria-controls]`, Yi = "typo3-backend-content-navigation[navigation-collapsed]", sn = "navigation-collapsed";
function Ji(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = y();
    o && Xi(e, n), o && i === "modules" && Qi(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    y().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), q(r, t);
}
function Qi(e, t) {
  e.querySelectorAll(Vi).forEach((n) => {
    n.classList.add("show"), an(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), an(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Hi).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function Xi(e, t) {
  e.querySelectorAll(Yi).forEach((n) => {
    n.toggleAttribute(sn, !1), t.push(() => {
      n.toggleAttribute(sn, !0);
    });
  });
}
function an(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const Zi = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", ln = "scaffold-content-navigation-expanded";
function es(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(ln);
    }), n = y().active ? [...e.querySelectorAll(Zi)] : [], n.forEach((o) => {
      o.classList.add(ln);
    });
  };
  r(), q(r, t);
}
const lr = (e) => [...e, "web_list"], Ne = lr(["web_layout", "records", "media_management", "permissions_pages"]), cr = "vperm.module";
function ts(e, t) {
  let n = null;
  const r = (i) => {
    is(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || Ne.includes(rs(e))))
      return;
    const a = ss() ?? Ne[0] ?? "", c = wt(e);
    if ((c !== "" || Pr(e)) && i.area === "fields") {
      qi(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        ns(e, c);
      },
      { once: !0, signal: t }
    ), ir(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    y().active && Ne.includes(s) && me(cr, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), q(r, t);
}
async function ns(e, t) {
  const n = ce(e), r = await Bn(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function rs(e) {
  return We.App.getCurrentModule() ?? ce(e)?.getAttribute("module") ?? "";
}
const ur = "[data-modulemenu-identifier]:not([aria-controls])", os = `#modulemenu ${ur}`;
function is(e, t) {
  e.querySelectorAll(os).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !Ne.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(ur)].every((r) => r.parentElement?.hidden === !0);
  });
}
function ss() {
  const e = fe.get(cr);
  return typeof e == "string" && Ne.includes(e) ? e : void 0;
}
function as(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function ls(e) {
  D(({ doc: t }) => {
    t.querySelectorAll(".module-docheader-bar-navigation").forEach((n) => {
      n.classList.add("module-docheader-navigation");
    }), t.querySelectorAll(".module-docheader-bar-navigation > .module-docheader-bar-column-left").forEach((n) => {
      n.classList.add("module-docheader-column-breadcrumb");
    }), t.querySelectorAll(".module-docheader-bar-buttons").forEach((n) => {
      n.classList.add("module-docheader-buttons");
    });
  }, e);
}
function cs(e) {
  D(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const us = "[data-object-id]";
function dr(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = y();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), ds(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), ps(a), pr(a, e));
    });
  };
  D((i) => {
    n = i.doc, o();
  }, t), q(o, t);
}
function ds(e, t) {
  e.querySelectorAll(us).forEach((n) => {
    fs(n) && (ms(n), n.matches(t.shut) || pr(n, t));
  });
}
function pr(e, t) {
  e.querySelector(t.opener)?.click();
}
const Nt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function ps(e) {
  ae.set(Nt(e), "folded");
}
function fs(e) {
  return ae.isset(Nt(e));
}
function ms(e) {
  ae.unset(Nt(e));
}
function hs(e) {
  dr({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function gs(e, t) {
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
    const v = { group: String(m) };
    for (const [f, b] of new FormData(r))
      typeof b == "string" && (v[f] = b);
    oe(_.write_other_permissions, v).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== d, f === "taken") {
        De.success(g("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && De.error(g("editOtherPermissions.notSaved"));
    });
  }), a.append(c), i.append(s, a), o.append(i), n.append(o, r);
  let d = null, m = null;
  const h = (v) => {
    const f = !v.active || v.area !== "other", b = v.groupId === null;
    if (f || b) {
      n.remove(), d = null, delete TYPO3.settings.FormEngine?.formName;
      return;
    }
    const w = v.groupId;
    w !== d && (d = w, c.disabled = !0, s.textContent = re(e, w) ?? "", vs(w).then((k) => {
      k === null || w !== d || (r.replaceChildren(e.createRange().createContextualFragment(k.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${p.area}="fields"]`)?.append(n), new Lr().processItems([...k.scriptItems]));
    }));
  };
  h(y()), q(h, t);
}
async function vs(e) {
  return xe(new Y(R(_.other_permissions)).withQueryArguments({ group: e }).get());
}
const Ot = '.form-group:has(> select[name="_langSelector"])', mt = /* @__PURE__ */ new WeakMap();
function bs(e, t) {
  const n = e.querySelector(`.module-docheader ${Ot}`);
  n !== null && (mt.has(n) || mt.set(n, n.parentElement), t.after(n));
}
function ws(e) {
  const t = e.querySelector(`.module-docheader ${Ot}`);
  t !== null && mt.get(t)?.append(t);
}
const ys = (e) => `${e}, ${Ot}`, ks = ".module-docheader-navigation > .module-docheader-column-breadcrumb", cn = ".module-docheader-buttons .btn-toolbar > *", As = ".t3js-editform-close", $s = ys(`.${l.headButton}, .${l.showMenu}, .${l.typeSwitch}`), Ss = 'form[name="editform"] h1';
function Es(e, t) {
  let n = null;
  const r = (i) => {
    const { active: s, area: a } = y();
    return s && a === "fields" && i.querySelector(`[${p.token}]`) !== null;
  }, o = () => {
    if (n === null)
      return;
    const i = n, s = r(i);
    i.querySelectorAll(`.${l.headBar}, .${l.headButton}`).forEach((f) => {
      f.remove();
    });
    const a = i.querySelector(As), c = y().face === "preview" ? a : null;
    if (i.querySelectorAll(cn).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches($s) && !f.contains(c));
    }), i.querySelectorAll(Ss).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${p.token}][${p.inside}='']:not([${p.outOfReach}])`) !== null;
    if (!u && y().face === "pick") {
      Se(i, () => {
        pe("preview");
      });
      return;
    }
    const d = y().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      L(i, l.faceEyebrow, g(d ? "platform.preview" : "platform.pick")),
      L(i, l.faceSentence, N(
        g(d ? "recordForm.previewFor" : "recordForm.pickFor"),
        re(e, y().groupId) ?? ""
      ))
    ), i.querySelector(ks)?.append(m), !d || !u)
      return;
    const h = X(
      i,
      g("recordForm.add"),
      `btn btn-default btn-sm ${l.headButton}`,
      () => {
        Se(i, () => {
          pe("pick");
        });
      },
      "actions-check-square"
    );
    [...i.querySelectorAll(cn)].find((f) => f.contains(a))?.after(h);
  };
  D((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && At(
      i.doc,
      t,
      () => y().face === "pick",
      () => {
        Se(i.doc, () => {
          pe("preview");
        });
      }
    );
  }, t), J("fields-judged", o, t), q(o, t);
}
const un = `[${p.token}]`;
function Cs(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(un)];
    Kt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(un)];
      qs(s, i) || (i = s, Kt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const qs = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function Ls(e, t) {
  let n = [];
  const r = () => {
    if (n.forEach((i) => {
      i();
    }), n = [], !y().active)
      return;
    e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelectorAll("typo3-backend-new-content-element-wizard-button").forEach((i) => {
      const s = i.lastChild, a = s.textContent;
      s.textContent = g("readOnly.previewNewContent"), n.push(() => {
        s.textContent = a;
      });
    });
  };
  r(), q(r, t);
}
const Ns = lr(["records"]);
function Os(e, t) {
  let n = y().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && Ns.includes(We.App.getCurrentModule() ?? "");
  q(({ active: o }) => {
    o !== n && Tr().then(() => {
      r() && Nr.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function _s(e, t) {
  const n = () => {
    const o = (e.querySelector("#typo3-contentIframe")?.contentWindow).TYPO3.FormEngine;
    if (o === void 0)
      return;
    const i = o.preventExitIfNotSaved.bind(o);
    o.preventExitIfNotSaved = (s) => {
      if (y().active) {
        s(!0);
        return;
      }
      i(s);
    };
  };
  e.addEventListener("typo3-module-loaded", n, { capture: !0, signal: t });
}
const xs = ".module-docheader-buttons .btn-toolbar", dn = "vperm.show", pn = "vperm.identify", fn = (e, t, n) => {
  if (n) {
    ae.set(e, t);
    return;
  }
  ae.unset(e);
}, mn = (e, t) => {
  if (e.setAttribute("aria-selected", String(t)), !t) {
    e.removeAttribute("data-dropdowntoggle-status");
    return;
  }
  e.setAttribute("data-dropdowntoggle-status", "active");
};
function Ps(e) {
  let t = null;
  const n = (o) => {
    const { active: i, area: s } = y();
    return i && s === "fields" && o.querySelector(`[${p.token}]:not([${p.outOfReach}])`) !== null;
  }, r = () => {
    if (t === null)
      return;
    const o = t;
    if (o.querySelectorAll(`.${l.showMenu}`).forEach((c) => {
      c.remove();
    }), !n(o)) {
      o.body.removeAttribute(p.show), ws(o);
      return;
    }
    gn(o, ae.get(dn) === "list"), hn(o, ae.get(pn) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(fr(o, "actions-filter"), ` ${g("recordForm.show")}`);
    const a = o.createElement("ul");
    a.className = "dropdown-menu", a.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      vn(o, g("recordForm.show.listOnly"), "actions-list", () => o.body.hasAttribute(p.show), (c) => {
        fn(dn, "list", c), gn(o, c);
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      vn(o, g("recordForm.show.identifiers"), "actions-tag", () => o.body.hasAttribute(p.identify), (c) => {
        fn(pn, "said", c), hn(o, c);
      })
    ), i.append(s, a), o.querySelector(xs)?.append(i), bs(o, i);
  };
  D((o) => {
    t = o.doc, r();
  }, e), J("fields-judged", r, e), q(r, e);
}
function hn(e, t) {
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
function fr(e, t) {
  const n = e.createElement("typo3-backend-icon");
  return n.setAttribute("identifier", t), n.setAttribute("size", "small"), n;
}
function gn(e, t) {
  if (!t) {
    e.body.removeAttribute(p.show);
    return;
  }
  e.body.setAttribute(p.show, "list");
}
function vn(e, t, n, r, o) {
  const i = e.createElement("button");
  i.type = "button", i.className = "dropdown-item dropdown-item-spaced";
  const s = e.createElement("span");
  s.className = "dropdown-item-status", i.append(s, fr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), mn(i, r());
  }), mn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function Ts(e) {
  return nt.normalizedCtrlModifierKey === kn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function _t(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = Ts(e), t.append(o);
    }
    nt.register(
      [nt.normalizedCtrlModifierKey, kn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Fs(e) {
  _t(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${p.toggle}]`), () => {
    if (y().active) {
      Ln();
      return;
    }
    qn();
  }, !0);
}
function Ms(e, t) {
  const n = e.querySelector(`[${p.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(y()), n.addEventListener("click", () => {
    if (y().active) {
      Ln();
      return;
    }
    qn();
  }, { signal: t }), q(r, t);
}
function Is(e) {
  dr({
    shut: "[data-object-id]:has(.panel-button.collapsed)",
    opener: ".panel-button"
  }, e);
}
function ve(e, t) {
  try {
    sessionStorage.setItem(e, t);
  } catch {
  }
}
function be(e) {
  try {
    return sessionStorage.getItem(e);
  } catch {
    return null;
  }
}
function xt(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {
  }
}
const mr = 600, Rs = 250, Ds = 2e3, Bs = 320, Pt = "vperm.arriving";
function Us() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function hr(e, t, n) {
  if (!Us()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  ve(Pt, t), e.body.setAttribute(p.leaving, t), e.body.addEventListener("animationend", o, { once: !0 }), window.setTimeout(o, mr);
}
function js(e) {
  e.body.setAttribute(p.settling, "");
}
function Ws(e) {
  const t = Ks();
  if (t === null)
    return;
  xt(Pt), e.body.setAttribute(p.settling, ""), e.body.setAttribute(p.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(p.settling), e.body.removeAttribute(p.arriving), e.body.setAttribute(p.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(p.unwrapping);
    }, Bs));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, mr);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, Rs);
  }, { signal: i.signal }), window.setTimeout(c, Ds);
}
function Ks() {
  return be(Pt);
}
const gr = "vperm.viewing", vr = "vperm.seen", br = "vperm.room";
function Gs(e) {
  ve(gr, e);
}
function zs(e) {
  ve(br, String(e));
}
function Vs() {
  return be(br);
}
function Hs(e) {
  const t = be(gr);
  t !== null && ve(vr, JSON.stringify({
    ...Tt(),
    [t]: { place: Sn(e), document: wt(e) }
  }));
}
function Ys(e) {
  return An(Tt()[e]);
}
function Js(e) {
  return $n(Tt()[e]);
}
function Tt() {
  const e = be(vr);
  return e === null ? {} : JSON.parse(e);
}
function Qs(e, t) {
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
  const c = Vs();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), On(e, a, t), o.addEventListener("click", () => {
    Hs(e), hr(e, "up", () => {
    });
  }, { signal: t }), _t(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Ft = "vperm.opening";
function wr(e, t) {
  e !== "" && ve(Ft, JSON.stringify({ record: e, screen: t }));
}
function Xs(e) {
  const t = ea(), n = ce(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !Zs(t.screen, n, e.location.href) || (xt(Ft), ta(e, n, t.record));
}
function Zs(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function ea() {
  const e = be(Ft);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function ta(e, t, n) {
  const r = await Bn(n, t);
  r !== "" && xr(e, r);
}
let Ie = null;
function na(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
async function yr() {
  const e = await new Y(R(_.viewable_users)).get(Ie === null ? {} : { headers: { "If-None-Match": Ie.tag } }).catch(na), t = e.raw();
  if (t.status === 304)
    return Ie.users;
  const n = await e.resolve(), r = t.headers.get("ETag");
  return Ie = r === null ? null : { tag: r, users: n }, n;
}
const ra = {
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
}, ht = "vperm.returnTo", gt = "vperm.returning", oa = "vperm.userSearch";
function ia(e, t, n = ra) {
  const r = fe.get(ht), o = An(r);
  return o !== "" && sa(o) ? (wr($n(r), o), me(ht, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (aa(e, t, n), !1);
}
function sa(e) {
  return be(gt) === e ? !1 : (ve(gt, e), !0);
}
function aa(e, t, n) {
  const r = e.querySelector(`[${p.viewAs}]`);
  if (r === null)
    return;
  const o = Mn(e, {
    totalOne: g("viewAsUser.total.one"),
    totalMany: g("viewAsUser.total.many"),
    take: g("viewAsUser.key.take"),
    detail: g("viewAsUser.key.detail"),
    loading: g("viewAsUser.loading"),
    failed: g("viewAsUser.failed")
  });
  o.remembers = oa, o.placeholder = g("viewAsUser.search"), o.addNew = { label: g("viewAsUser.new"), url: r.getAttribute(p.newRecord) ?? "" }, e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    kr(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    vt(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    yt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    vt(e, o), o.openedBy(r);
  }, { signal: t }), _t(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    la(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function la(e, t, n, r) {
  const o = await yr().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    vt(e, r), r.openedBy(n);
    return;
  }
  await kr(e, i, t);
}
async function vt(e, t) {
  t.state = "loading";
  const n = await yr().catch(() => null);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = Ge(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
  t.entries = [
    ...a.map((u) => bn(u, g("viewAsUser.recent"), i)),
    ...c.map((u) => bn(u, g("viewAsUser.all"), i))
  ];
}
function bn(e, t, n) {
  const r = e.groups.map((o) => ({ id: String(o), title: n[String(o)]?.title ?? "", depth: 0 })).filter((o) => o.title !== "").sort((o, i) => o.title.localeCompare(i.title));
  return {
    id: String(e.id),
    title: e.realName === "" ? e.username : e.realName,
    subtitle: e.realName === "" ? "" : e.username,
    note: ca(r.length),
    detail: r,
    detailHeading: ua(r.length),
    heading: t
  };
}
function ca(e) {
  return e === 0 ? "" : K("viewAsUser.groups", e, e);
}
function ua(e) {
  return e === 0 ? g("viewAsUser.detail.none") : K("viewAsUser.detail", e, e);
}
async function kr(e, t, n) {
  xt(gt), Gs(String(t)), zs(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await me(ht, { place: Sn(e), document: wt(e) });
  const r = Ys(String(t));
  wr(Js(String(t)), r), da(t, n, r);
}
function da(e, t, n) {
  _r(document), hr(document, "down", () => {
    t.handOver(R(_.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function wn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Br(e.signal), jr(document, e.signal), Ms(document, e.signal), Jr(document, e.signal), cs(e.signal), ls(e.signal);
  const t = fo();
  uo(t, e.signal);
  const n = po();
  wo(n, e.signal), Ao(n, e.signal), _o(t, e.signal), xo(e.signal), ei(document, e.signal), Ci(document, e.signal), ri(e.signal), ii(e.signal), li(e.signal), ui(e.signal), Ji(document, e.signal), Ls(document, e.signal), Os(document, e.signal), es(document, e.signal), ts(document, e.signal), Fo(document, e.signal), _i(document, e.signal), gs(document, e.signal), as(document, e.signal), Do(document, e.signal), jo(e.signal), _s(document, e.signal), Es(document, e.signal), Ps(e.signal), Is(e.signal), hs(e.signal), Cs(document, e.signal);
  const r = ia(document, e.signal);
  Qs(document, e.signal), r ? js(document) : (Xs(document), Ws(document)), Fs(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", wn, { once: !0 }) : wn();
//# sourceMappingURL=main.js.map
