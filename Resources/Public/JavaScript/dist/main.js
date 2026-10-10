import ue from "@typo3/backend/storage/persistent.js";
import { LitElement as yr, html as M } from "lit";
import ie from "@typo3/core/ajax/ajax-request.js";
import wr from "@typo3/backend/login-refresh.js";
import Qe from "@typo3/backend/notification.js";
import { sudoModeInterceptor as kr } from "@typo3/backend/security/sudo-mode-interceptor.js";
import Ft from "@typo3/backend/modal.js";
import { FileStorageTree as Ar } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as $r } from "@typo3/backend/tree/page-tree.js";
import Be from "@typo3/backend/module-menu.js";
import { ModuleStateStorage as Sr } from "@typo3/backend/storage/module-state-storage.js";
import re from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as Er } from "@typo3/core/java-script-item-processor.js";
import Cr from "@typo3/backend/viewport.js";
import Xe, { ModifierKeys as vn } from "@typo3/backend/hotkeys.js";
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
function qr(e) {
  return e.body.hasAttribute(d.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function Lr(e) {
  e.body.setAttribute(d.handingOver, "");
}
function bn(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function yn(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function Or(e, t) {
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
function wn(e) {
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
    qr(n) || await ue.set(e, t);
  });
  return Ze = r.catch(() => {
  }), r;
}
function Nr() {
  return Ze;
}
const kn = "vperm.session", An = 1, ye = "modules", xr = "fields", et = /* @__PURE__ */ new Set();
let F = Ir();
document.addEventListener("typo3-module-loaded", () => {
  je({ ...F, face: "preview" });
});
function b() {
  return F;
}
function E(e, t) {
  et.add(e), t?.addEventListener("abort", () => et.delete(e));
}
function $n() {
  const e = F.groupId !== null, t = e ? xr : F.area;
  fe({ ...F, active: e, open: F.open || e, area: t, picked: t });
}
function Pr() {
  fe({ ...F, open: !0 });
}
function Tr() {
  fe({ ...F, open: !1, active: !1 });
}
function Sn() {
  fe({ ...F, active: !1 });
}
function En(e) {
  fe({ ...F, area: e, picked: e, face: "preview" });
}
function Fr(e) {
  je({ ...F, area: e });
}
function ce(e) {
  je({ ...F, face: e });
}
function gt(e) {
  fe({ ...F, groupId: e, active: F.active && e !== null });
}
function fe(e) {
  pe(kn, {
    version: An,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), je(e);
}
function je(e) {
  F = e;
  for (const t of et)
    t(F);
}
function Ir() {
  const e = ue.get(kn);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: ye, picked: ye, face: "preview" };
  const t = e;
  if (String(t.version) !== String(An))
    return { open: !1, active: !1, groupId: null, area: ye, picked: ye, face: "preview" };
  const n = Number(t.groupId), r = typeof t.area == "string" && t.area !== "null" ? t.area : ye;
  return {
    open: String(t.open) === "true",
    active: String(t.active) === "true",
    groupId: Number.isInteger(n) && n > 0 ? n : null,
    area: r,
    picked: r,
    face: "preview"
  };
}
function Mr(e) {
  const t = () => {
    It(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && It(n);
  };
  t(), E(t, e);
}
function It(e) {
  const t = b();
  if (e.toggleAttribute(d.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(d.active, t.active), !t.active) {
    e.removeAttribute(d.picked), e.removeAttribute(d.face);
    return;
  }
  e.setAttribute(d.picked, t.area), e.setAttribute(d.face, t.face);
}
const Dr = (e) => `${e}, .scaffold-modulemenu`;
function Cn(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Dr(".scaffold-sidebar"));
  if (r == null || o === null)
    return;
  const i = () => {
    r.style.flexBasis = "";
    const a = qn(e), c = Number.parseFloat(getComputedStyle(t).marginInlineStart), u = o.getBoundingClientRect().right - a - r.getBoundingClientRect().left - c;
    u > 0 && (r.style.flexBasis = `${String(u)}px`);
  };
  i();
  const s = new ResizeObserver(i);
  s.observe(o), n.addEventListener("abort", () => {
    s.disconnect();
  });
}
const qn = (e) => Number.parseFloat(getComputedStyle(e.body).getPropertyValue("--vperm-divider")) || 0;
function Rr(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${d.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), Cn(e, r, t);
  const o = e.querySelector(`[${d.toolbar}]`), i = () => b().open || b().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), E(s, t), o?.addEventListener("click", () => {
    i() ? Tr() : Pr(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Ue(e) {
  return JSON.parse(e.querySelector(`[${d.groups}]`)?.getAttribute(d.groups) ?? "{}");
}
function X(e, t) {
  return Ue(e)[String(t)]?.title ?? null;
}
function h(e) {
  return TYPO3.lang[e] ?? "";
}
const Ln = 220, Br = 1300;
function _e(e, t) {
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
function On(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = O(e, l.faceEyebrow, ""), o = O(e, l.faceSentence, ""), i = e.createElement("div");
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
        }, Br));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function Nn(e, t, n) {
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
const Mt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Ur(e, t, n, r) {
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
    const a = Ur(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const Rt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Wr = 70, Ke = 50;
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
    return this.matching.slice(0, Ke);
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
    return M`
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
      return M`
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
    return this.state === "loading" ? M`<p>${this.words.loading}</p>` : this.state === "failed" ? M`
        <p>${this.words.failed}</p>
        <button type="button" class="btn btn-default btn-sm"
                @click=${() => {
      this.dispatchEvent(new CustomEvent("vperm:retry"));
    }}>
          ${this.words.retry}
        </button>
      ` : t.length === 0 ? M`<p>${this.words.empty}</p>` : "";
  }
  activeId() {
    return this.inPane ? this.detailId(this.onDetail) : this.rowId(this.active);
  }
  counted() {
    if (this.state !== "ready")
      return "";
    const t = this.matching.length;
    return t <= Ke ? (t === 1 ? this.words.totalOne : this.words.totalMany).replace("%d", String(t)) : this.words.countMany.replace("%d", String(Ke)).replace("%d", String(t));
  }
  detailPane() {
    const t = this.found[this.active];
    return t === void 0 ? M`` : M`
      <div class=${l.pickerDetail}>
        <div class=${l.pickerHead}>
          <strong>${t.title}</strong>
          <p>${t.detailHeading}</p>
        </div>
        <div role="listbox" tabindex="-1">
          ${t.detail.map((n, r) => M`
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
    }, Wr));
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
    return r === "" || r === n?.heading ? M`` : M`<p class="dropdown-header">${r}</p>`;
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
      return M`${n}`;
    const i = [];
    let s = 0;
    for (let a = 0; a < o.length; ) {
      let c = a;
      for (; c + 1 < o.length && o[c + 1] === (o[c] ?? 0) + 1; )
        c += 1;
      const u = o[a] ?? 0, p = (o[c] ?? 0) + 1;
      i.push(M`${n.slice(s, u)}<mark>${n.slice(u, p)}</mark>`), s = p, a = c + 1;
    }
    return M`${i}${n.slice(s)}`;
  }
}
customElements.get(oe.picker) === void 0 && customElements.define(oe.picker, Gr);
function xn(e, t) {
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
const Kr = "vperm.groupSearch", Pn = "vperm.recentGroups", zr = 3;
function Hr(e, t) {
  const n = e.querySelector(`[${d.group}]`);
  if (n === null)
    return;
  const r = xn(e, {
    totalOne: h("pickAGroup.total.one"),
    totalMany: h("pickAGroup.total.many"),
    take: h("pickAGroup.key.take"),
    detail: h("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  let o = Vr(e);
  r.entries = Bt(e, o), r.remembers = Kr, r.placeholder = h("pickAGroup.search"), e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n);
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = X(e, b().groupId) ?? i;
  };
  s(), E(s, t), E(() => {
    const { groupId: u } = b();
    u !== null && o[0] !== u && (o = [u, ...o.filter((p) => p !== u)], pe(Pn, o)), r.entries = Bt(e, o);
  }, t);
  const c = (u) => {
    gt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Vr(e) {
  const t = Ue(e);
  return [ue.get(Pn)].flat().map(String).filter((n) => n in t).map(Number);
}
function Bt(e, t) {
  const n = Object.entries(Ue(e)), r = t.filter((s) => s !== b().groupId).slice(0, zr), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
  return [
    ...o.map(([s, a]) => jt(s, a, h("pickAGroup.recent"))),
    ...i.map(([s, a]) => jt(s, a, h("pickAGroup.all")))
  ];
}
function jt(e, t, n) {
  return {
    id: e,
    heading: n,
    title: t.title,
    subtitle: t.disabled ? h("pickAGroup.disabled") : "",
    note: Yr(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: h(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function Yr(e) {
  return e === 0 ? "" : W("pickAGroup.inherits", e, e);
}
const Tn = (e) => `vperm:${e}`;
function J(e, t) {
  document.dispatchEvent(new CustomEvent(Tn(e), { detail: t }));
}
function K(e, t, n) {
  document.addEventListener(
    Tn(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function Jr() {
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
const Fn = Jr();
function R(e, t) {
  Fn.listen(e, t);
}
function Ut(e) {
  Fn.tell(e);
}
function j(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
const I = {
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
let tt = 0;
async function Z(e, t) {
  return tt += 1, new ie(j(e)).addMiddleware(kr).post(t).then(Wt, Wt).finally(() => {
    tt -= 1;
  });
}
function yt() {
  return tt > 0;
}
function Wt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (wr.checkActiveSession(), "loggedOut") : Qr(t.status);
  } catch {
    return "failed";
  }
}
function Qr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function wt(e, t = []) {
  return kt(new ie(j(I.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function We() {
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
async function In(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await (await new ie(j(I.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()).resolve()).url ?? "";
}
async function kt(e) {
  try {
    return await (await e).resolve();
  } catch {
    return Qe.error(h("platform.notRead")), null;
  }
}
const At = ["allowed", "allowedAndInherited", "inherited"], Xr = ["allowed", "denied"], H = "allowed", me = "denied", $t = "inherited", St = "allowedAndInherited", Ge = "adminOnly";
function G(e) {
  return At.some((t) => t === e);
}
const Zr = [...At, me];
function Et(e) {
  return Xr.includes(e);
}
function Me(e) {
  return e.substring(0, e.indexOf(":"));
}
function eo(e) {
  return e.substring(e.indexOf(":") + 1);
}
const Q = {};
function to(e, t) {
  Q.tables = e, t.addEventListener("abort", () => {
    delete Q.tables;
  });
}
function no(e, t) {
  Q.fields = e, t.addEventListener("abort", () => {
    delete Q.fields;
  });
}
function ro(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${d.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(d.unseen);
  });
  const { active: n, area: r, face: o } = b();
  !n || r !== "fields" || (Q.tables?.hide(e, t, o), Q.fields?.hide(e, t, o), Gt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${d.verdict}]`)].some((a) => a.closest(`[${d.unseen}]`) === null) || Se(i);
  }), Gt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${d.unseen}])`) === null && (Se(i), Se(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), oo(e), o === "preview" && io(e, t));
}
function Se(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(d.unseen, "");
}
function Gt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${d.verdict}]`)?.querySelector(`[${d.verdict}]`) !== null);
}
function oo(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(d.unseen) === !0 && e.querySelector(`.nav-item:not([${d.unseen}]) [data-typo3-tab]`)?.click();
}
function io(e, { tables: t, named: n }) {
  if (e.querySelector(`.form-section:not([${d.unseen}])`) !== null)
    return;
  const r = so(e), o = t[r], s = (G(o) ? Q.fields : Q.tables)?.explain(e, r, o, n[r] ?? r);
  s !== void 0 && (s.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(s));
}
function so(e) {
  const n = e.querySelector(`[${d.token}][${d.inside}='']`)?.getAttribute(d.token) ?? "";
  return Me(n);
}
function ao(e, t) {
  let n = null;
  const r = We();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null;
  const i = () => {
    n !== null && ro(n.doc, { tables: o?.targets ?? {}, named: o?.named ?? {} });
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
    const m = [...new Set(c.map(([, f]) => Me(f)))], v = await r.inspect(p, m);
    if (v === null)
      return;
    const { scopes: g } = v;
    e.take(v), c.forEach(([f, y]) => {
      const w = g.fields.targets[y];
      w !== void 0 && f.setAttribute(d.verdict, w), f.toggleAttribute(d.outOfReach, !G(g.tablesModify.targets[Me(y)]));
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
function lo() {
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
function co() {
  let e = [], t = {};
  return {
    givenBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.givenBy;
    }
  };
}
const Mn = (e) => e.map((t) => `[${d.verdict}='${t}']:not([${d.outOfReach}])`).join(","), uo = (e) => Mn(e === "pick" ? Zr : At), nt = (e) => Mn([e === "pick" ? me : H]), po = `.${l.anchor}[${d.verdict}]`, fo = (e, t, n) => {
  const r = G(e.getAttribute(d.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(uo(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(nt(n)),
    waiting: t ? h(n === "pick" ? "platform.toAdd" : "grantFields.toTakeAway") : ""
  };
}, mo = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function ho(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(d.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (mo(n), t.waiting === "") {
      n.removeAttribute(d.waiting);
      return;
    }
    n.setAttribute(d.waiting, t.waiting);
  }
}
function go(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = b();
    n.querySelectorAll(po).forEach((a) => {
      ho(a, fo(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabGive}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const p = () => [...c.querySelectorAll(`[${d.inside}='']`)].filter((v) => v.matches(nt(a)) && !e.has(v)), m = u ?? i(s, c, p);
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
      const p = u.target, m = p.closest(`.${l.mark}`) === null ? p.closest(nt(b().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), K("fields-judged", r, t), E(r, t);
}
async function vo(e, t) {
  return Z(I.grant_fields, { group: e, operations: [...t] });
}
const Kt = 280;
function Ee(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, Kt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, Kt * 2);
}
const zt = `[${d.verdict}]:not([${d.outOfReach}])`, bo = [me, Ge].map((e) => `:not([${d.verdict}='${e}'])`).join("");
function yo(e, t) {
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
    }), r = null, v && a.querySelector(zt) !== null && m !== null && (r = { form: a, face: p, groupId: m, showCount: i(a, p === "pick", m) });
  }, i = (a, c, u) => {
    let p = null;
    const m = a.ownerDocument.createElement("div");
    m.className = l.faceFoot;
    const v = () => [...a.querySelectorAll(`[${d.token}]`)].filter((w) => e.has(w)), g = () => {
      if (!c) {
        ce("preview");
        return;
      }
      Ee(a.ownerDocument, () => {
        ce("preview");
      });
    }, f = _e(m, {
      label: h(c ? "platform.doAdd" : "platform.doRemove"),
      cancel: () => {
        e.drop(), g();
      },
      apply: () => {
        const w = v().map((S) => ({ field: S.getAttribute(d.token) ?? "", grant: c }));
        yt() || vo(u, w).then((S) => {
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
      const w = [...a.querySelectorAll(zt)].filter((N) => N.closest(`.${l.otherKinds}`) === null), S = w.filter((N) => N.matches(bo)), _ = v().length;
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
const wo = `.${l.anchor}[${d.verdict}]`, ko = 350, Ao = 250, rt = (e) => e.getAttribute(d.verdict) ?? "", $o = (e) => e.getAttribute(d.token) ?? "", So = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), ot = (e) => h(`grantFields.mark.${e}.title`), Eo = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return b().face === "pick" ? h(t ? "grantFields.hint.leave" : "grantFields.hint.give") : h(t ? "grantFields.hint.keep" : "grantFields.hint.take");
};
function Co(e, t) {
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
      e.hidePopover(), gt(s.groupId);
    });
    const u = n.createElement("li");
    return u.append(a, c), u;
  }));
  const i = n.createElement("section");
  return i.append(r, o), [i];
}
function qo(e, t, n) {
  const r = e.ownerDocument, o = rt(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = ot(o);
  const a = r.createElement("p");
  a.textContent = h(`grantFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...Co(e, n));
  const p = Eo(t);
  if (p !== "") {
    const m = r.createElement("footer");
    m.textContent = p, e.append(m);
  }
}
function Lo(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (m) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      m.hidePopover();
    }, Ao);
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
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = m, m.style.setProperty("anchor-name", "--vperm-mark"), m.setAttribute("aria-expanded", "true"), qo(g, v, e.givenBy($o(v))), g.showPopover();
  }, p = () => {
    n.querySelectorAll(wo).forEach((m) => {
      const v = So(m);
      if (v === null)
        return;
      const g = v.querySelector(`.${l.mark}`);
      if (g !== null) {
        g.setAttribute("aria-label", ot(rt(m)));
        return;
      }
      const f = v.ownerDocument.createElement("button");
      f.type = "button", f.className = l.mark, f.setAttribute("aria-label", ot(rt(m))), f.setAttribute("aria-haspopup", "dialog"), f.setAttribute("aria-controls", l.markCard), f.setAttribute("aria-expanded", "false"), f.addEventListener("click", (y) => {
        u(f, m), y.detail === 0 && c(f.ownerDocument).querySelector("button")?.focus();
      }), f.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          u(f, m);
          return;
        }
        r = window.setTimeout(() => {
          u(f, m);
        }, ko);
      }), f.addEventListener("mouseleave", () => {
        a(c(f.ownerDocument));
      }), v.append(f);
    });
  };
  R((m) => {
    n = m.doc;
  }, t), K("fields-judged", p, t);
}
function Oo(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      _o(r);
    });
  };
  R((r) => {
    t = r.doc, n();
  }, e), K("fields-judged", n, e);
}
function _o(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${d.token}]:not([${d.outOfReach}])`) === null);
}
const No = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Pe = (e) => `${e}, ${No[e]}`, Dn = [
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
function Ht(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(d.area), t.removeAttribute(d.ground);
  });
}
function Rn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function xo(e, t) {
  const n = (i) => {
    if ((i.active ? X(e, i.groupId) : null) === null) {
      Ht(e);
      return;
    }
    const a = Dn.flatMap((c) => {
      const u = Rn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Ht(e), a.forEach(({ element: c, key: u, ground: p }) => {
      c.classList.add(l.frame), c.setAttribute(d.area, u), c.setAttribute(d.ground, p), To(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Po(e) && n(b());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(b()), E(n, t);
}
function Po(e) {
  return Dn.some((t) => {
    const n = Rn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(d.area) !== t.key);
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
const Fo = "typo3-backend-contextual-record-edit-trigger";
function Io(e, t) {
  let n = null;
  const r = (u) => {
    const p = u.target.closest(Fo);
    !b().active || p === null || (u.preventDefault(), u.stopPropagation(), de(e)?.setAttribute("endpoint", p.getAttribute("edit-url") ?? ""));
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
async function Mo(e, t) {
  return Z(I.grant_modules, { group: e, operations: [...t] });
}
const Bn = "data-modulemenu-identifier", De = `[${Bn}]:not([aria-controls])`, jn = ".modulemenu-group-container";
let we = !1;
const it = /* @__PURE__ */ new WeakMap();
let le = null;
const ke = _n(560);
function Do(e, t) {
  const n = b().groupId, r = X(e, n) ?? "", o = [...t.querySelectorAll(De)], i = o.filter((A) => G(z(A))), s = o.filter((A) => z(A) === H), a = Vt(e, l.facePreview, h("platform.preview"), x(h("grantModules.previewFor"), r)), c = Vt(e, l.facePick, h("platform.pick"), x(h("grantModules.pickFor"), r)), p = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  p.className = l.coin, p.replaceChildren(a.sheet, c.sheet);
  const v = e.querySelector(`.${l.granted}`) ?? e.createElement("div");
  v.className = l.granted, p.parentElement !== v && v.replaceChildren(p);
  const g = Bo(e, t);
  v.parentElement !== g && g.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    g.classList.add(l.panelCardTurned);
  });
  const f = (A) => {
    we = A, p.classList.toggle(l.coinTurned, A), a.sheet.toggleAttribute("inert", A), c.sheet.toggleAttribute("inert", !A);
  }, y = (A) => {
    const P = A.filter((L) => L.grant).map((L) => L.module);
    n !== null && b().groupId === n && (yt() || (P.forEach((L) => {
      ke.add(L);
    }), Mo(n, A).then((L) => {
      if (L !== "taken") {
        P.forEach((k) => {
          ke.delete(k);
        }), vt(we ? _ : w, L);
        return;
      }
      f(!1), J("permissions-written", {});
    })));
  }, w = _e(a.foot, {
    label: h("platform.doRemove"),
    cancel: () => {
      ze(a.scroll).forEach((A) => {
        A.classList.remove(l.faceMarked);
      }), N();
    },
    apply: () => {
      y(ze(a.scroll).map((A) => ({ module: He(A), grant: !1 })));
    }
  }), S = () => {
    Yt(c.scroll, t, N), N(), f(!1);
  }, _ = _e(c.foot, {
    label: h("platform.doAdd"),
    cancel: S,
    apply: () => {
      const A = Jt(c.scroll).filter((P) => z(P) !== it.get(P));
      y(A.map((P) => ({ module: He(P), grant: !0 })));
    }
  }), N = () => {
    const A = Jt(c.scroll), P = A.filter((q) => z(q) !== it.get(q)), L = A.filter((q) => G(z(q)) && !P.includes(q)), k = W("grantModules.tally", A.length, L.length, A.length), T = ze(a.scroll);
    w.state.textContent = T.length === 0 ? k : W("grantModules.marked", s.length, T.length, s.length), w.ready(T.length > 0, T.length > 0), _.state.textContent = k, _.waiting.textContent = P.length === 0 ? "" : x(h("platform.waiting"), P.length), _.ready(P.length > 0, !0);
  };
  a.bar.append(
    Y(e, h("grantModules.add"), "btn btn-default", () => {
      f(!0);
    }),
    O(e, l.faceHint, h("grantModules.hint"))
  ), c.scroll.style.setProperty("--vperm-queued-note", `"${h("platform.toAdd")}"`), jo(e, a.scroll, i, h("platform.from"), N), Yt(c.scroll, t, N), N(), f(we), ke.start(() => {
    p.querySelectorAll(`.${l.facePreview} ${De}`).forEach((A) => {
      A.classList.toggle(l.justAdded, ke.isLit(He(A)));
    });
  }), le?.abort(), le = new AbortController(), bt(e, le.signal, () => we, S), Nn(n, [w, _], le.signal);
}
function Ro(e, t) {
  le?.abort(), le = null, we = !1, ke.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.granted}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, Ln);
  }));
}
function Bo(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Vt(e, t, n, r) {
  const o = On(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function jo(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(jn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(O(e, l.grantedGroup, a)));
    const c = Go(s);
    c.getAttribute(d.verdict) === H ? Wn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(O(e, l.grantedFrom, r)), t.append(c);
  });
}
function Yt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(jn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(De).forEach((r) => {
    Un(r), it.set(r, z(r)), G(z(r)) && r.setAttribute("aria-disabled", "true"), Wn(r, () => {
      Wo(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(O(r.ownerDocument, l.grantedGroup, r.getAttribute("title") ?? ""));
  });
}
function Uo(e) {
  const t = z(e);
  return e.getAttribute("aria-disabled") === "true" || !Et(t) ? "" : G(t) ? "unpick" : "grant";
}
function Wo(e) {
  const t = Uo(e);
  t !== "" && e.setAttribute(d.verdict, t === "grant" ? H : me);
}
function Un(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function Go(e) {
  const t = e.cloneNode(!0);
  return Un(t), t;
}
function Wn(e, t) {
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
const z = (e) => e.getAttribute(d.verdict) ?? "", He = (e) => e.getAttribute(Bn) ?? "", Ve = "#modulemenu", Gn = "data-modulemenu-identifier", Ko = `[${Gn}]:not([aria-controls])`;
function zo(e, t) {
  const n = We(), r = async () => {
    const { active: i, groupId: s, area: a } = b();
    if (!i || s === null || a !== "modules") {
      n.drop(), e.querySelectorAll(`${Ve} [${d.verdict}]`).forEach((v) => {
        v.removeAttribute(d.verdict);
      }), o(e);
      return;
    }
    const c = e.querySelector(Ve);
    if (c === null)
      return;
    const u = [...c.querySelectorAll(Ko)];
    if (u.length === 0)
      return;
    const p = await n.inspect(s);
    if (p === null)
      return;
    const { scopes: m } = p;
    Object.entries(m.modules.targets).forEach(([v, g]) => {
      u.filter((f) => f.getAttribute(Gn) === v).forEach((f) => {
        f.setAttribute(d.verdict, g);
      });
    }), Do(e, c);
  }, o = (i) => {
    const s = i.querySelector(Ve);
    s !== null && Ro(i, s);
  };
  r(), K("permissions-written", () => void r(), t), E(() => void r(), t);
}
async function Ho(e, t, n) {
  const r = await Z(I.grant_tables, { group: e, operations: [{ table: t, grant: n }] });
  return r === "taken" && J("permissions-written", {}), r;
}
function Kn(e, { groupId: t, table: n, called: r, verdict: o }) {
  const i = o === H, s = o === $t || o === St, a = o === Ge, c = e.createElement("div");
  c.className = `callout callout-notice callout-sm ${l.tableGate}`, c.append(O(e, l.tableName, r)), c.append(O(e, l.tableToken, n));
  const u = O(e, "callout-body", h(Vo(o)));
  if (c.append(u), !s && !a) {
    const p = Y(
      e,
      x(h(i ? "grantTables.take" : "grantTables.give"), r),
      `btn btn-default btn-sm ${i ? l.tableTake : l.tableGive}`,
      () => {
        p.toggleAttribute("disabled", !0), Ho(t, n, !i).then((m) => {
          p.toggleAttribute("disabled", !1), m !== "taken" && m !== "cancelled" && (u.textContent = h(`platform.${m}`));
        });
      }
    );
    c.append(p);
  }
  return c;
}
function Vo(e) {
  return e === H ? "grantTables.theirs" : e === Ge ? "grantTables.adminOnly" : e === St ? "grantTables.alsoHandedDown" : e === $t ? "grantTables.handedDown" : "grantTables.missing";
}
const Qt = ".typo3-TCEforms";
function Yo(e) {
  let t = null;
  const n = We(), r = async () => {
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
      const f = g.getAttribute(d.inside) ?? "", y = f === "" ? g.closest(Qt) : o.querySelector(`[${d.field}='${f}']`), w = g.getAttribute(d.token) ?? "";
      y !== null && u.set(y, Me(w));
    });
    const p = await n.inspect(c, [...new Set(u.values())]);
    if (p === null)
      return;
    const { named: m, targets: v } = p.scopes.tablesModify;
    u.forEach((g, f) => {
      const y = v[g];
      if (![H, $t, St, me].some((_) => _ === y))
        return;
      const w = Kn(o, { groupId: c, table: g, called: m[g] ?? g, verdict: y }), S = f.matches(Qt) ? null : f.querySelector(".form-irre-object");
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
const Jo = ".form-group";
function zn(e) {
  return e.closest(Jo);
}
function Qo(e) {
  to({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !G(s)).forEach(([s]) => {
        t.querySelectorAll(`[${d.token}^='${s}:']`).forEach((a) => {
          Se(a.closest(i) ?? zn(a) ?? a);
        }), o === "preview" && Xo(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o) => Kn(t, { groupId: b().groupId ?? 0, table: n, called: o, verdict: r })
  }, e);
}
function Xo(e, t, n) {
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
function Hn(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${h("platform.from")}"`), e.groups.forEach(({ label: v, values: g }) => {
    const f = document.createElement("section"), y = document.createElement("h2");
    y.textContent = v;
    const w = document.createElement("div");
    w.append(...g.map((S) => ei(S, n.has(S.value), o.has(S.value)))), f.append(y, w), i.append(f);
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
    s.textContent = Zo(g, v.length - g), m();
  });
}
function Zo(e, t) {
  return [
    ...e > 0 ? [x(h("platform.waiting"), e)] : [],
    ...t > 0 ? [x(h("platform.going"), t)] : []
  ].join(`
`);
}
function ei({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function ti(e, t, n) {
  return Z(e === "pageTypes" ? I.allow_page_types : I.allow_values, {
    group: t,
    operations: [...n]
  });
}
function ni(e) {
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
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = h(`allowedValues.choose.${eo(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(d.choices) ?? "{}"), u = b().groupId ?? 0;
        wt(u).then((p) => {
          if (p === null)
            return;
          const m = i.getAttribute(d.allows) === "pageTypes" ? "pageTypes" : "fieldValues", v = m === "pageTypes" ? "" : `${s}:`, g = new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => G(f)).map(([f]) => f.substring(v.length)));
          Hn(c, X(document, u) ?? "", g, async (f) => await ti(m, u, f.map(({ value: w, grant: S }) => ({ value: `${v}${w}`, grant: S }))) !== "taken" ? !1 : (J("permissions-written", {}), !0), new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => G(f) && f !== H).map(([f]) => f.substring(v.length))));
        });
      }), i.after(a);
    });
  };
  R((r) => {
    t = r.doc, n();
  }, e), E(n, e);
}
const ri = `[${d.verdict}='${me}'], [${d.verdict}='${Ge}']`;
function oi(e) {
  no({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(ri).forEach((o) => {
        Se(zn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        O(t, "callout-body", x(h("grantFields.recordNoFields"), o)),
        Y(t, h("recordForm.add"), "btn btn-default btn-sm", () => {
          Ee(t, () => {
            ce("pick");
          });
        })
      ), i;
    }
  }, e);
}
async function ii(e, t) {
  const n = await wt(e);
  if (n === null)
    return;
  const r = await kt(new ie(j(I.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  Hn(r, t, o, async (i) => await Z(I.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (J("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== H).map(([i]) => i)));
}
const Vn = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: oe.folderTree,
  base: Ar,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = j(I.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: j("filestorage_tree_rootline"),
      filterUrl: j("filestorage_tree_filter"),
      showIcons: !0
    };
  },
  write: async (e, t, n, r) => Z(I.mount_folders, {
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
      ii(t, X(e, t) ?? "");
    }
  )
}, Yn = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: oe.pageTree,
  base: $r,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => (await new ie(j("page_tree_browser_configuration")).get()).resolve(),
  write: async (e, t, n) => Z(I.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function si(e, t) {
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
function ai(e) {
  const t = /* @__PURE__ */ new Map();
  return Jn(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function li(e, t) {
  const n = Jn(e);
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
const Jn = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ce = _n(520), D = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set(), Re = /* @__PURE__ */ new Set(), st = /* @__PURE__ */ new Set(), Qn = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, Xn = (e) => U.has(e) && !Re.has(e), Zn = (e) => e.__parents ?? [], Ae = (e) => Zn(e).some((t) => U.has(t)), ci = (e, t) => t.some((n) => U.has(n.identifier) && Zn(n).includes(e.identifier)), er = (e) => e.detail;
function ui(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = er(o);
    s === !1 || Qn(i.identifier) || U.has(i.identifier) || Ae(i) || (B.has(i.identifier) ? B.delete(i.identifier) : B.add(i.identifier), t(), Ye(Ie(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Ie(e);
    o !== null && (!Ne.has(o) || e.querySelector(".node[data-id='0']") !== null) && Ye(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), Ye(Ie(e));
}
function di(e) {
  const t = Ie(e);
  if (t === null)
    return;
  const n = Ne.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), Ne.delete(t), t.requestUpdate());
}
function Ye(e) {
  if (e !== null) {
    if (Xt(e.nodes), !Ne.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      Ne.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => Xt(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return U.has(r.identifier) && o.push(l.mountAlready), B.has(r.identifier) && o.push(l.mountPicked), Qn(r.identifier) && o.push(l.mountWhole), o;
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
const Ne = /* @__PURE__ */ new WeakMap(), Ie = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let Je = "", Zt = () => {
};
async function pi(e, t, n, { groupId: r, kind: o, showCount: i }) {
  Zt = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), Je = s;
    return;
  }
  const a = o.tree;
  if (fi(a, o.base), t.querySelector(a) !== null && Je === s)
    return;
  const u = await o.rootedAt(r), p = e.createElement(a);
  p.addEventListener("mousedown", (v) => {
    const g = v.target instanceof Element ? v.target.closest(".node") : null;
    g !== null && (Xn(g.getAttribute("data-id") ?? "") || v.preventDefault());
  }), p.addEventListener("typo3:tree:node-selected", (v) => {
    v.stopPropagation();
    const { node: g, propagate: f } = er(v);
    f !== !1 && (D.has(g.identifier) ? D.delete(g.identifier) : D.add(g.identifier), at(e), Zt());
  }), Object.assign(p, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(p), t.replaceChildren(m), Je = s, Object.assign(p, { setup: u });
}
function at(e) {
  e.querySelector(
    `.${l.facePreview} :is(${oe.pageTree}, ${oe.folderTree})`
  )?.requestUpdate();
}
function fi(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return Xn(n.identifier);
    }
    // Closed row hides mount; ensure rows are open before drawing mounts
    prepareNodes(n) {
      const r = super.prepareNodes(n);
      return r.forEach((o) => {
        Ae(o) || U.has(o.identifier) || (o.__expanded = !0, o.__hidden = !ci(o, r));
      }), r;
    }
    hideChildren(n) {
      !Ae(n) && !U.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return Ae(n) && r.push(l.mountInside), !Ae(n) && !U.has(n.identifier) && r.push(l.mountContext), Re.has(n.identifier) && r.push(l.mountInherited), D.has(n.identifier) && r.push(l.faceMarked), st.has(n.identifier) && r.push(l.mountUnseen), Ce.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function mi(e, t, n, r) {
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
      f.preventDefault(), Sr.update("web", u, !0), Be.App.showModule("permissions_pages");
    }), v.setAttribute("aria-label", x(o("unseenLink"), p)), v.textContent = x(o("unseenPage"), p);
    const g = e.createElement("li");
    g.append(v), c.append(g);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let $e = !1, lt = null, qe = null;
function hi(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (k) => h(`${i}.${k}`), a = X(e, r) ?? "", c = vi(e, t);
  lt !== r && (D.clear(), B.clear(), lt = r), qe?.abort(), qe = new AbortController();
  const { signal: u } = qe, p = en(e, c, l.facePick), m = en(e, c, l.facePreview);
  m.eyebrow.textContent = h("platform.preview"), m.sentence.textContent = x(s("previewFor"), a), p.eyebrow.textContent = h("platform.pick"), p.sentence.textContent = x(s("pickFor"), a);
  const v = n.order;
  U.clear(), Re.clear(), Object.entries(n.targets).forEach(([k, T]) => {
    U.add(k), Et(T) || (Re.add(k), D.delete(k));
  });
  const g = (k) => {
    m.sheet.toggleAttribute("inert", k), p.sheet.toggleAttribute("inert", !k);
  }, f = (k) => {
    $e = k, c.classList.toggle(l.panelCardTurned, !k), g(k);
  };
  g($e);
  const y = () => {
    const k = W(`${i}.tally`, v.length, v.length);
    S.state.textContent = D.size === 0 ? k : W(`${i}.marked`, v.length, D.size, v.length), S.ready(D.size > 0, D.size > 0), L.state.textContent = k, L.waiting.textContent = B.size === 0 ? "" : x(h("platform.waiting"), B.size), L.ready(B.size > 0, !0);
  }, w = (k, T) => {
    if (b().groupId !== r)
      return;
    const q = [...k];
    if (q.length === 0 || yt())
      return;
    const V = o.write(r, q, T, ai(p.sheet));
    T && q.forEach((ee) => {
      Ce.add(ee);
    }), V.then((ee) => {
      if (ee !== "taken") {
        q.forEach((se) => {
          Ce.delete(se);
        }), vt(T ? L : S, ee);
        return;
      }
      q.forEach((se) => k.delete(se)), N(), f(!1), J("permissions-written", {});
    });
  }, S = _e(m.foot, {
    label: h("platform.doRemove"),
    cancel: () => {
      D.clear(), at(e), y();
    },
    apply: () => {
      w(D, !1);
    }
  }), _ = new Set(Object.keys(n.named)), N = () => {
    p.sheet.querySelector(`.${l.naming}`)?.remove(), p.scroll.hidden = !1, p.eyebrow.textContent = h("platform.pick"), p.sentence.textContent = x(s("pickFor"), a);
  }, A = () => {
    const k = [...B].filter((q) => !_.has(q)), T = p.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && k.length > 0 && !T) {
      const q = si(e, k);
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
  }, P = () => li(p.sheet, s("nameWhy")), L = _e(p.foot, {
    label: h("platform.doAdd"),
    cancel: () => {
      B.clear(), N(), f(!1), y();
    },
    apply: A
  });
  if (p.scroll.style.setProperty("--vperm-queued-note", `"${h("platform.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${h("platform.from")}"`), st.clear(), n.unseen.forEach(({ page: k }) => {
    st.add(String(k));
  }), mi(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const k = e.createElement("div");
    k.className = l.faceChoice, k.append(o.choice(e, r)), m.sheet.insertBefore(k, m.foot);
  }
  pi(e, m.scroll, v, { groupId: r, kind: o, showCount: y }), ui(p.sheet, y, u), y(), Ce.start(() => {
    at(e);
  }), bt(e, u, () => $e, () => {
    if (p.sheet.querySelector(`.${l.naming}`) !== null) {
      N();
      return;
    }
    f(!1);
  }), Nn(r, [S, L], u), m.bar.replaceChildren(
    m.eyebrow,
    m.sentence,
    Y(e, s("add"), "btn btn-default", () => {
      f(!0);
    }),
    O(e, l.faceHint, s("hint"))
  ), window.requestAnimationFrame(() => {
    f($e);
  });
}
function gi(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  $e = !1, D.clear(), lt = null, Ce.stop(), qe?.abort(), qe = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), di(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, Ln));
}
function vi(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function en(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return bi(r);
  const o = On(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function bi(e) {
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
const yi = { pageMounts: Yn, fileMounts: Vn };
function wi(e, t) {
  const n = We();
  let r = !1;
  const o = async () => {
    const { active: s, groupId: a, area: c } = b(), u = yi[c];
    if (!s || a === null || u === void 0) {
      n.drop(), gi(e);
      return;
    }
    const p = e.querySelector(u.component);
    if (p === null)
      return;
    r = !0;
    const m = await n.inspect(a);
    r = !1, m !== null && hi(e, p, u.mounted(m.scopes), { groupId: a, kind: u });
  }, i = new MutationObserver(() => {
    !r && [Yn, Vn].every(({ component: s }) => e.querySelector(`${s} > .${l.panelCard}`) === null) && o();
  });
  i.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    i.disconnect();
  }), o(), K("permissions-written", () => void o(), t), E(() => void o(), t);
}
let ct = null;
function tr(e) {
  ct = e, Be.App.showModule(e);
}
function ki(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function Ai(e) {
  const t = ct === e;
  return ct = null, t;
}
const Le = "other", tn = ["modules", "pageMounts", "fileMounts", "fields", Le], $i = 10, ne = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Le]: "module"
}, Si = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function Ei(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", h("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(d.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const y = nr(e);
    if (y.forEach(($) => {
      g.observe($);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = y.map(($) => te($)), S = [...tn, ...w.filter(($) => !tn.includes($))], _ = w.includes("fields") ? [Le] : [], N = y.filter(($) => $.getBoundingClientRect().width !== 0).map(te), A = N.includes("fields") ? [...N, Le] : N, [P] = A.includes("fields") ? ["fields"] : A, L = A.find(($) => ne[$] !== void 0 && ne[$] === ne[f.picked]), k = A.includes(f.picked) ? f.picked : L ?? P;
    if (A.join() !== i && (i = A.join(), k !== void 0 && k !== f.area)) {
      Fr(k);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap(($) => [Ii(e, $), Fi(e, $)]),
      ...S.map(($) => qi(e, $, h(`pickAnArea.${$}`)))
    )), n.parentElement === null && Ci(e).append(n);
    const T = f.area === Le ? "fields" : f.area;
    _i(n, e), Ni(n, e, y.find(($) => te($) === T) ?? null);
    const q = f.area !== "fields";
    y.forEach(($) => {
      const C = te($), ve = C === T, ae = q && !ve && C !== "modules", be = Te(n, C);
      be?.setAttribute("aria-selected", String(C === f.area)), Li(be, $), $.toggleAttribute(d.armed, ve), $.toggleAttribute("inert", ae), r.add($), Mi(Ri(n, C), $, ae), xi(Bi(n, C), $, ve, y);
    });
    let V = 0, ee = null;
    S.forEach(($) => {
      const C = Te(n, $);
      if (C === null)
        return;
      const ve = C.hidden ? 0 : C.getBoundingClientRect().width, ae = y.find((br) => te(br) === $), be = ae ?? Di($, y), Tt = Math.max(V, be?.getBoundingClientRect().left ?? V);
      C.style.setProperty("--vperm-host-x", `${String(Tt)}px`), C.toggleAttribute(d.elsewhere, ae === void 0), ae === void 0 && (C.setAttribute("aria-selected", String($ === f.area)), xe(C, be ?? ee ?? C)), V = C.hidden ? V : Tt + ve + $i, ee = C;
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
    const y = f.detail.module ?? "", w = Ai(y);
    if (!m) {
      m = !0;
      return;
    }
    !w && ne[b().picked] === "tree" && En("fields");
  };
  e.addEventListener("typo3-module-loaded", v, { signal: t }), p.observe(e.body, { childList: !0, subtree: !0 });
  const g = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    p.disconnect(), g.disconnect(), window.cancelAnimationFrame(c);
  }), E(a, t), a(b());
}
const Ci = (e) => e.querySelector(".scaffold") ?? e.body;
function qi(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(d.area, t), r.setAttribute(d.label, n), r.append(O(e, l.tabLabel, n)), r.addEventListener("click", () => {
    En(t);
    const o = Si[t];
    o !== void 0 && nr(e).every((i) => te(i) !== t) && tr(o);
  }), r;
}
function Li(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, xe(e, t));
}
const xe = (e, t) => {
  e.setAttribute(d.ground, t.getAttribute(d.ground) ?? "");
}, Oi = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function _i(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function Ni(e, t, n) {
  const r = Pi(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, xe(r, n), Ct(r, n);
}
function Ct(e, t) {
  const n = t.getBoundingClientRect(), r = Oi(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function xi(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  xe(e, t), e.hidden = o.width === 0 || o.left === 0 || n || qn(t.ownerDocument) === 0 || Ti(o, r), Ct(e, t);
}
function Pi(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Ti(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Fi(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(d.area, t), n;
}
function Ii(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(d.area, t), n;
}
function Mi(e, t, n) {
  e !== null && (e.hidden = !n, n && (xe(e, t), Ct(e, t)));
}
const Di = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  ne[e] === void 0 ? void 0 : t.find((n) => ne[te(n)] === ne[e])
), Te = (e, t) => e.querySelector(`.${l.tab}[${d.area}="${t}"]`), Ri = (e, t) => e.querySelector(`.${l.areaCover}[${d.area}="${t}"]`), Bi = (e, t) => e.querySelector(`.${l.tabSeam}[${d.area}="${t}"]`);
function nr(e) {
  return [...e.querySelectorAll(`.${l.frame}[${d.area}]`)];
}
const te = (e) => e.getAttribute(d.area) ?? "", rr = "#modulemenu", ji = `${rr} .modulemenu-group-container.collapse:not(.show)`, Ui = `${rr} [aria-controls]`, Wi = "typo3-backend-content-navigation[navigation-collapsed]", nn = "navigation-collapsed";
function Gi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = b();
    o && zi(e, n), o && i === "modules" && Ki(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    b().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), E(r, t);
}
function Ki(e, t) {
  e.querySelectorAll(ji).forEach((n) => {
    n.classList.add("show"), rn(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), rn(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Ui).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function zi(e, t) {
  e.querySelectorAll(Wi).forEach((n) => {
    n.toggleAttribute(nn, !1), t.push(() => {
      n.toggleAttribute(nn, !0);
    });
  });
}
function rn(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const Hi = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", on = "scaffold-content-navigation-expanded";
function Vi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(on);
    }), n = b().active ? [...e.querySelectorAll(Hi)] : [], n.forEach((o) => {
      o.classList.add(on);
    });
  };
  r(), E(r, t);
}
const or = (e) => [...e, "web_list"], Oe = or(["web_layout", "records", "media_management", "permissions_pages"]), ir = "vperm.module";
function Yi(e, t) {
  let n = null;
  const r = (i) => {
    Zi(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || Oe.includes(Qi(e))))
      return;
    const a = es() ?? Oe[0] ?? "", c = ht(e);
    if ((c !== "" || _r(e)) && i.area === "fields") {
      ki(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        Ji(e, c);
      },
      { once: !0, signal: t }
    ), tr(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    b().active && Oe.includes(s) && pe(ir, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), E(r, t);
}
async function Ji(e, t) {
  const n = de(e), r = await In(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function Qi(e) {
  return Be.App.getCurrentModule() ?? de(e)?.getAttribute("module") ?? "";
}
const sr = "[data-modulemenu-identifier]:not([aria-controls])", Xi = `#modulemenu ${sr}`;
function Zi(e, t) {
  e.querySelectorAll(Xi).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !Oe.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(sr)].every((r) => r.parentElement?.hidden === !0);
  });
}
function es() {
  const e = ue.get(ir);
  return typeof e == "string" && Oe.includes(e) ? e : void 0;
}
function ts(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function ns(e) {
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
function rs(e) {
  R(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const os = "[data-object-id]";
function ar(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = b();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), is(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), ss(a), lr(a, e));
    });
  };
  R((i) => {
    n = i.doc, o();
  }, t), E(o, t);
}
function is(e, t) {
  e.querySelectorAll(os).forEach((n) => {
    as(n) && (ls(n), n.matches(t.shut) || lr(n, t));
  });
}
function lr(e, t) {
  e.querySelector(t.opener)?.click();
}
const qt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function ss(e) {
  re.set(qt(e), "folded");
}
function as(e) {
  return re.isset(qt(e));
}
function ls(e) {
  re.unset(qt(e));
}
function cs(e) {
  ar({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function us(e, t) {
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
    Z(I.write_other_permissions, g).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== p, f === "taken") {
        Qe.success(h("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && Qe.error(h("editOtherPermissions.notSaved"));
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
    w !== p && (p = w, c.disabled = !0, s.textContent = X(e, w) ?? "", ds(w).then((S) => {
      S === null || w !== p || (r.replaceChildren(e.createRange().createContextualFragment(S.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${d.area}="fields"]`)?.append(n), new Er().processItems([...S.scriptItems]));
    }));
  };
  v(b()), E(v, t);
}
async function ds(e) {
  return kt(new ie(j(I.other_permissions)).withQueryArguments({ group: e }).get());
}
const Lt = '.form-group:has(> select[name="_langSelector"])', ut = /* @__PURE__ */ new WeakMap();
function ps(e, t) {
  const n = e.querySelector(`.module-docheader ${Lt}`);
  n !== null && (ut.has(n) || ut.set(n, n.parentElement), t.after(n));
}
function fs(e) {
  const t = e.querySelector(`.module-docheader ${Lt}`);
  t !== null && ut.get(t)?.append(t);
}
const ms = (e) => `${e}, ${Lt}`, hs = ".module-docheader-navigation > .module-docheader-column-breadcrumb", sn = ".module-docheader-buttons .btn-toolbar > *", gs = ".t3js-editform-close", vs = ms(`.${l.headButton}, .${l.showMenu}`), bs = 'form[name="editform"] h1';
function ys(e, t) {
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
    const a = i.querySelector(gs), c = b().face === "preview" ? a : null;
    if (i.querySelectorAll(sn).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches(vs) && !f.contains(c));
    }), i.querySelectorAll(bs).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${d.token}][${d.inside}='']:not([${d.outOfReach}])`) !== null;
    if (!u && b().face === "pick") {
      Ee(i, () => {
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
    ), i.querySelector(hs)?.append(m), !p || !u)
      return;
    const v = Y(
      i,
      h("recordForm.add"),
      `btn btn-default btn-sm ${l.headButton}`,
      () => {
        Ee(i, () => {
          ce("pick");
        });
      },
      "actions-check-square"
    );
    [...i.querySelectorAll(sn)].find((f) => f.contains(a))?.after(v);
  };
  R((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && bt(
      i.doc,
      t,
      () => b().face === "pick",
      () => {
        Ee(i.doc, () => {
          ce("preview");
        });
      }
    );
  }, t), K("fields-judged", o, t), E(o, t);
}
const an = `[${d.token}]`;
function ws(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(an)];
    Ut({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(an)];
      ks(s, i) || (i = s, Ut({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const ks = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function As(e, t) {
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
const $s = or(["records"]);
function Ss(e, t) {
  let n = b().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && $s.includes(Be.App.getCurrentModule() ?? "");
  E(({ active: o }) => {
    o !== n && Nr().then(() => {
      r() && Cr.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function Es(e, t) {
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
const Cs = ".module-docheader-buttons .btn-toolbar", ln = "vperm.show", cn = "vperm.identify", un = (e, t, n) => {
  if (n) {
    re.set(e, t);
    return;
  }
  re.unset(e);
}, dn = (e, t) => {
  if (e.setAttribute("aria-selected", String(t)), !t) {
    e.removeAttribute("data-dropdowntoggle-status");
    return;
  }
  e.setAttribute("data-dropdowntoggle-status", "active");
};
function qs(e) {
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
      o.body.removeAttribute(d.show), fs(o);
      return;
    }
    fn(o, re.get(ln) === "list"), pn(o, re.get(cn) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(cr(o, "actions-filter"), ` ${h("recordForm.show")}`);
    const a = o.createElement("ul");
    a.className = "dropdown-menu", a.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      mn(o, h("recordForm.show.listOnly"), "actions-list", () => o.body.hasAttribute(d.show), (c) => {
        un(ln, "list", c), fn(o, c);
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      mn(o, h("recordForm.show.identifiers"), "actions-tag", () => o.body.hasAttribute(d.identify), (c) => {
        un(cn, "said", c), pn(o, c);
      })
    ), i.append(s, a), o.querySelector(Cs)?.append(i), ps(o, i);
  };
  R((o) => {
    t = o.doc, r();
  }, e), K("fields-judged", r, e), E(r, e);
}
function pn(e, t) {
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
function cr(e, t) {
  const n = e.createElement("typo3-backend-icon");
  return n.setAttribute("identifier", t), n.setAttribute("size", "small"), n;
}
function fn(e, t) {
  if (!t) {
    e.body.removeAttribute(d.show);
    return;
  }
  e.body.setAttribute(d.show, "list");
}
function mn(e, t, n, r, o) {
  const i = e.createElement("button");
  i.type = "button", i.className = "dropdown-item dropdown-item-spaced";
  const s = e.createElement("span");
  s.className = "dropdown-item-status", i.append(s, cr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), dn(i, r());
  }), dn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function Ls(e) {
  return Xe.normalizedCtrlModifierKey === vn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function Ot(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = Ls(e), t.append(o);
    }
    Xe.register(
      [Xe.normalizedCtrlModifierKey, vn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Os(e) {
  Ot(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${d.toggle}]`), () => {
    if (b().active) {
      Sn();
      return;
    }
    $n();
  }, !0);
}
function _s(e, t) {
  const n = e.querySelector(`[${d.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(b()), n.addEventListener("click", () => {
    if (b().active) {
      Sn();
      return;
    }
    $n();
  }, { signal: t }), E(r, t);
}
function Ns(e) {
  ar({
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
function _t(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {
  }
}
const ur = 600, xs = 250, Ps = 2e3, Ts = 320, Nt = "vperm.arriving";
function Fs() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function dr(e, t, n) {
  if (!Fs()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  he(Nt, t), e.body.setAttribute(d.leaving, t), e.body.addEventListener("animationend", o, { once: !0 }), window.setTimeout(o, ur);
}
function Is(e) {
  e.body.setAttribute(d.settling, "");
}
function Ms(e) {
  const t = Ds();
  if (t === null)
    return;
  _t(Nt), e.body.setAttribute(d.settling, ""), e.body.setAttribute(d.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(d.settling), e.body.removeAttribute(d.arriving), e.body.setAttribute(d.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(d.unwrapping);
    }, Ts));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, ur);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, xs);
  }, { signal: i.signal }), window.setTimeout(c, Ps);
}
function Ds() {
  return ge(Nt);
}
const pr = "vperm.viewing", fr = "vperm.seen", mr = "vperm.room";
function Rs(e) {
  he(pr, e);
}
function Bs(e) {
  he(mr, String(e));
}
function js() {
  return ge(mr);
}
function Us(e) {
  const t = ge(pr);
  t !== null && he(fr, JSON.stringify({
    ...xt(),
    [t]: { place: wn(e), document: ht(e) }
  }));
}
function Ws(e) {
  return bn(xt()[e]);
}
function Gs(e) {
  return yn(xt()[e]);
}
function xt() {
  const e = ge(fr);
  return e === null ? {} : JSON.parse(e);
}
function Ks(e, t) {
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
  const c = js();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), Cn(e, a, t), o.addEventListener("click", () => {
    Us(e), dr(e, "up", () => {
    });
  }, { signal: t }), Ot(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Pt = "vperm.opening";
function hr(e, t) {
  e !== "" && he(Pt, JSON.stringify({ record: e, screen: t }));
}
function zs(e) {
  const t = Vs(), n = de(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !Hs(t.screen, n, e.location.href) || (_t(Pt), Ys(e, n, t.record));
}
function Hs(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function Vs() {
  const e = ge(Pt);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function Ys(e, t, n) {
  const r = await In(n, t);
  r !== "" && Or(e, r);
}
let Fe = null;
function Js(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
async function gr() {
  const e = await new ie(j(I.viewable_users)).get(Fe === null ? {} : { headers: { "If-None-Match": Fe.tag } }).catch(Js), t = e.raw();
  if (t.status === 304)
    return Fe.users;
  const n = await e.resolve(), r = t.headers.get("ETag");
  return Fe = r === null ? null : { tag: r, users: n }, n;
}
const Qs = {
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
}, dt = "vperm.returnTo", pt = "vperm.returning", Xs = "vperm.userSearch";
function Zs(e, t, n = Qs) {
  const r = ue.get(dt), o = bn(r);
  return o !== "" && ea(o) ? (hr(yn(r), o), pe(dt, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (ta(e, t, n), !1);
}
function ea(e) {
  return ge(pt) === e ? !1 : (he(pt, e), !0);
}
function ta(e, t, n) {
  const r = e.querySelector(`[${d.viewAs}]`);
  if (r === null)
    return;
  const o = xn(e, {
    totalOne: h("viewAsUser.total.one"),
    totalMany: h("viewAsUser.total.many"),
    take: h("viewAsUser.key.take"),
    detail: h("viewAsUser.key.detail"),
    loading: h("viewAsUser.loading"),
    failed: h("viewAsUser.failed")
  });
  o.remembers = Xs, o.placeholder = h("viewAsUser.search"), e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    vr(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    ft(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    gt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    ft(e, o), o.openedBy(r);
  }, { signal: t }), Ot(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    na(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function na(e, t, n, r) {
  const o = await gr().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    ft(e, r), r.openedBy(n);
    return;
  }
  await vr(e, i, t);
}
async function ft(e, t) {
  t.state = "loading";
  const n = await gr().catch(() => null);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = Ue(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
  t.entries = [
    ...a.map((u) => hn(u, h("viewAsUser.recent"), i)),
    ...c.map((u) => hn(u, h("viewAsUser.all"), i))
  ];
}
function hn(e, t, n) {
  const r = e.groups.map((o) => ({ id: String(o), title: n[String(o)]?.title ?? "", depth: 0 })).filter((o) => o.title !== "").sort((o, i) => o.title.localeCompare(i.title));
  return {
    id: String(e.id),
    title: e.realName === "" ? e.username : e.realName,
    subtitle: e.realName === "" ? "" : e.username,
    note: ra(r.length),
    detail: r,
    detailHeading: oa(r.length),
    heading: t
  };
}
function ra(e) {
  return e === 0 ? "" : W("viewAsUser.groups", e, e);
}
function oa(e) {
  return e === 0 ? h("viewAsUser.detail.none") : W("viewAsUser.detail", e, e);
}
async function vr(e, t, n) {
  _t(pt), Rs(String(t)), Bs(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await pe(dt, { place: wn(e), document: ht(e) });
  const r = Ws(String(t));
  hr(Gs(String(t)), r), ia(t, n, r);
}
function ia(e, t, n) {
  Lr(document), dr(document, "down", () => {
    t.handOver(j(I.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function gn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Mr(e.signal), Rr(document, e.signal), _s(document, e.signal), Hr(document, e.signal), rs(e.signal), ns(e.signal);
  const t = co();
  ao(t, e.signal);
  const n = lo();
  go(n, e.signal), yo(n, e.signal), Lo(t, e.signal), Oo(e.signal), zo(document, e.signal), wi(document, e.signal), Yo(e.signal), Qo(e.signal), ni(e.signal), oi(e.signal), Gi(document, e.signal), As(document, e.signal), Ss(document, e.signal), Vi(document, e.signal), Yi(document, e.signal), xo(document, e.signal), Ei(document, e.signal), us(document, e.signal), ts(document, e.signal), Io(document, e.signal), Es(document, e.signal), ys(document, e.signal), qs(e.signal), Ns(e.signal), cs(e.signal), ws(document, e.signal);
  const r = Zs(document, e.signal);
  Ks(document, e.signal), r ? Is(document) : (zs(document), Ms(document)), Os(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", gn, { once: !0 }) : gn();
//# sourceMappingURL=main.js.map
