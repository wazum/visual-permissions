import de from "@typo3/backend/storage/persistent.js";
import { LitElement as Ar, html as M } from "lit";
import { ModuleStateStorage as wn } from "@typo3/backend/storage/module-state-storage.js";
import H from "@typo3/core/ajax/ajax-request.js";
import $r from "@typo3/backend/login-refresh.js";
import De from "@typo3/backend/notification.js";
import { sudoModeInterceptor as Sr } from "@typo3/backend/security/sudo-mode-interceptor.js";
import Mt from "@typo3/backend/modal.js";
import { FileStorageTree as Er } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as Cr } from "@typo3/backend/tree/page-tree.js";
import je from "@typo3/backend/module-menu.js";
import ie from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as qr } from "@typo3/core/java-script-item-processor.js";
import Lr from "@typo3/backend/viewport.js";
import tt, { ModifierKeys as yn } from "@typo3/backend/hotkeys.js";
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
}, se = {
  folderTree: "vperm-folder-tree",
  pageTree: "vperm-page-tree",
  picker: "vperm-picker"
};
function Nr(e) {
  return e.body.hasAttribute(d.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function _r(e) {
  e.body.setAttribute(d.handingOver, "");
}
function kn(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function An(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function Or(e, t) {
  const n = ae(e);
  n !== null && e.addEventListener(
    "typo3-module-loaded",
    () => {
      n.setAttribute("endpoint", t);
    },
    { once: !0 }
  );
}
function vt(e) {
  return new URL(e.location.href).pathname.endsWith("/main") ? ae(e)?.getAttribute("endpoint") ?? "" : e.location.href;
}
function ae(e) {
  return e.querySelector("typo3-backend-module-router");
}
function bt(e) {
  const t = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(vt(e)));
  return t === null ? "" : t.slice(1).join(":");
}
function Pr(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(vt(e)));
}
function $n(e) {
  const t = vt(e);
  if (t === "")
    return "";
  const n = new URL(t, e.location.origin), r = n.searchParams.get("returnUrl");
  if (r !== null) {
    const o = new URL(r, n.origin);
    return o.origin !== n.origin ? "" : (o.searchParams.delete("token"), o.href);
  }
  return n.searchParams.delete("token"), n.href;
}
let nt = Promise.resolve();
function pe(e, t) {
  const n = document, r = nt.then(async () => {
    Nr(n) || await de.set(e, t);
  });
  return nt = r.catch(() => {
  }), r;
}
function xr() {
  return nt;
}
const Sn = "vperm.session", En = 1, we = "modules", Fr = "fields", rt = /* @__PURE__ */ new Set();
let T = Dr();
document.addEventListener("typo3-module-loaded", () => {
  We({ ...T, face: "preview" });
});
function y() {
  return T;
}
function C(e, t) {
  rt.add(e), t?.addEventListener("abort", () => rt.delete(e));
}
function Cn() {
  const e = T.groupId !== null, t = e ? Fr : T.area;
  fe({ ...T, active: e, open: T.open || e, area: t, picked: t });
}
function Tr() {
  fe({ ...T, open: !0 });
}
function Mr() {
  fe({ ...T, open: !1, active: !1 });
}
function qn() {
  fe({ ...T, active: !1 });
}
function Ln(e) {
  fe({ ...T, area: e, picked: e, face: "preview" });
}
function Ir(e) {
  We({ ...T, area: e });
}
function ue(e) {
  We({ ...T, face: e });
}
function wt(e) {
  fe({ ...T, groupId: e, active: T.active && e !== null });
}
function fe(e) {
  pe(Sn, {
    version: En,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), We(e);
}
function We(e) {
  T = e;
  for (const t of rt)
    t(T);
}
function Dr() {
  const e = de.get(Sn);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: we, picked: we, face: "preview" };
  const t = e;
  if (String(t.version) !== String(En))
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
function Rr(e) {
  const t = () => {
    It(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && It(n);
  };
  t(), C(t, e);
}
function It(e) {
  const t = y();
  if (e.toggleAttribute(d.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(d.active, t.active), !t.active) {
    e.removeAttribute(d.picked), e.removeAttribute(d.face);
    return;
  }
  e.setAttribute(d.picked, t.area), e.setAttribute(d.face, t.face);
}
const Br = (e) => `${e}, .scaffold-modulemenu`;
function Nn(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Br(".scaffold-sidebar"));
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
function Ur(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${d.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), Nn(e, r, t);
  const o = e.querySelector(`[${d.toolbar}]`), i = () => y().open || y().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), C(s, t), o?.addEventListener("click", () => {
    i() ? Mr() : Tr(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Ke(e) {
  return JSON.parse(e.querySelector(`[${d.groups}]`)?.getAttribute(d.groups) ?? "{}");
}
function te(e, t) {
  return Ke(e)[String(t)]?.title ?? null;
}
function g(e) {
  return TYPO3.lang[e] ?? "";
}
const On = 220, jr = 1300;
function _e(e, t) {
  const n = e.ownerDocument, r = n.createElement("span");
  r.className = l.faceTally;
  const o = L(n, l.faceCounted, ""), i = L(n, l.faceWaiting, "");
  r.append(o, i);
  const s = Q(n, g("platform.cancel"), `btn btn-default ${l.faceCancel}`, t.cancel), a = Q(n, t.label, `btn btn-primary ${l.faceApply}`, t.apply);
  return e.replaceChildren(r, s, a), {
    state: o,
    waiting: i,
    ready: (c, u) => {
      a.toggleAttribute("disabled", !c), s.toggleAttribute("disabled", !u);
    }
  };
}
function yt(e, t) {
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
function xn(e) {
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
        }, jr));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function Fn(e, t, n) {
  C(() => {
    y().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function kt(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !Wr(e) && r();
  }, { signal: t });
}
const Wr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
function Q(e, t, n, r, o) {
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
function G(e, t, ...n) {
  return _(g(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function _(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, String(r)).replace("%s", String(r)),
    e
  );
}
const Dt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Kr(e, t, n, r) {
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
function Rt(e, t) {
  if (e === "")
    return { score: 0, at: [] };
  const n = e.toLowerCase(), r = t.toLowerCase(), o = n.charAt(0);
  let i = null;
  for (let s = r.indexOf(o); s !== -1; s = r.indexOf(o, s + 1)) {
    const a = Kr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const Bt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Gr = 70, Ye = 50;
class zr extends Ar {
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
      score: Rt(this.query, Bt(n))?.score ?? -1
    })).filter((n) => n.score >= 0).sort((n, r) => n.band - r.band || r.score - n.score).map((n) => n.entry);
  }
  get found() {
    return this.matching.slice(0, Ye);
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
        ${this.addNewLink()}
      </div>
      <div class=${l.pickerPanes}>
      <div class=${l.pickerList} role="listbox" tabindex="-1">
        ${this.nothingToShow(t)}
        ${this.state !== "ready" ? "" : t.map((n, r) => {
      const o = Rt(this.query, Bt(n))?.at ?? [];
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
  addNewLink() {
    return this.addNew === null ? "" : M`
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
    n.searchParams.set("returnUrl", ae(this.ownerDocument)?.getAttribute("endpoint") ?? ""), t.href = n.href, wn.update("web", 0, !0), this.hidePopover();
  }
  kept() {
    const t = de.get(this.remembers);
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
    return t <= Ye ? (t === 1 ? this.words.totalOne : this.words.totalMany).replace("%d", String(t)) : this.words.countMany.replace("%d", String(Ye)).replace("%d", String(t));
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
    }, Gr));
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
customElements.get(se.picker) === void 0 && customElements.define(se.picker, zr);
function Tn(e, t) {
  const n = e.createElement(se.picker);
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
const Vr = "vperm.groupSearch", Mn = "vperm.recentGroups", Hr = 3;
function Yr(e, t) {
  const n = e.querySelector(`[${d.group}]`);
  if (n === null)
    return;
  const r = Tn(e, {
    totalOne: g("pickAGroup.total.one"),
    totalMany: g("pickAGroup.total.many"),
    take: g("pickAGroup.key.take"),
    detail: g("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  let o = Jr(e);
  r.entries = Ut(e, o), r.remembers = Vr, r.placeholder = g("pickAGroup.search"), r.addNew = { label: g("pickAGroup.new"), url: n.getAttribute(d.newRecord) ?? "" }, e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n);
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = te(e, y().groupId) ?? i;
  };
  s(), C(s, t), C(() => {
    const { groupId: u } = y();
    u !== null && o[0] !== u && (o = [u, ...o.filter((p) => p !== u)], pe(Mn, o)), r.entries = Ut(e, o);
  }, t);
  const c = (u) => {
    wt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function Jr(e) {
  const t = Ke(e);
  return [de.get(Mn)].flat().map(String).filter((n) => n in t).map(Number);
}
function Ut(e, t) {
  const n = Object.entries(Ke(e)), r = t.filter((s) => s !== y().groupId).slice(0, Hr), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
  return [
    ...o.map(([s, a]) => jt(s, a, g("pickAGroup.recent"))),
    ...i.map(([s, a]) => jt(s, a, g("pickAGroup.all")))
  ];
}
function jt(e, t, n) {
  return {
    id: e,
    heading: n,
    title: t.title,
    subtitle: t.disabled ? g("pickAGroup.disabled") : "",
    note: Qr(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: g(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function Qr(e) {
  return e === 0 ? "" : G("pickAGroup.inherits", e, e);
}
const In = (e) => `vperm:${e}`;
function X(e, t) {
  document.dispatchEvent(new CustomEvent(In(e), { detail: t }));
}
function Y(e, t, n) {
  document.addEventListener(
    In(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function Xr() {
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
const Dn = Xr();
function D(e, t) {
  Dn.listen(e, t);
}
function Wt(e) {
  Dn.tell(e);
}
function I(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
const O = {
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
let ot = 0;
async function ne(e, t, n = () => {
}) {
  return ot += 1, new H(I(e)).addMiddleware(Sr).post(t).then(async (r) => {
    const o = Kt(r);
    return o === "taken" && r.raw().status === 200 && n(await r.resolve()), o;
  }, Kt).finally(() => {
    ot -= 1;
  });
}
function At() {
  return ot > 0;
}
function Kt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? ($r.checkActiveSession(), "loggedOut") : Zr(t.status);
  } catch {
    return "failed";
  }
}
function Zr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function Ge(e, t = []) {
  return Pe(new H(I(O.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function ze() {
  let e = 0;
  return {
    inspect: async (t, n) => {
      const r = ++e, o = await Ge(t, n);
      return r === e ? o : null;
    },
    // Stryker disable next-line AssignmentOperator: counting down works as well, since only "is this still the newest" is asked
    drop: () => {
      e += 1;
    }
  };
}
async function Rn(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await (await new H(I(O.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()).resolve()).url ?? "";
}
async function Pe(e) {
  try {
    return await (await e).resolve();
  } catch {
    return De.error(g("platform.notRead")), null;
  }
}
const $t = ["allowed", "allowedAndInherited", "inherited"], eo = ["allowed", "denied"], Z = "allowed", me = "denied", Ve = "inherited", St = "allowedAndInherited", He = "adminOnly";
function U(e) {
  return $t.some((t) => t === e);
}
const to = [...$t, me];
function Et(e) {
  return eo.includes(e);
}
function Re(e) {
  return e.substring(0, e.indexOf(":"));
}
function no(e) {
  return e.substring(e.indexOf(":") + 1);
}
const ee = {};
function ro(e, t) {
  ee.tables = e, t.addEventListener("abort", () => {
    delete ee.tables;
  });
}
function oo(e, t) {
  ee.fields = e, t.addEventListener("abort", () => {
    delete ee.fields;
  });
}
function io(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${d.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(d.unseen);
  });
  const { active: n, area: r, face: o } = y();
  !n || r !== "fields" || (ee.tables?.hide(e, t, o), ee.fields?.hide(e, t, o), Gt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${d.verdict}]`)].some((a) => a.closest(`[${d.unseen}]`) === null) || $e(i);
  }), Gt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${d.unseen}])`) === null && ($e(i), $e(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), so(e), o === "preview" && ao(e, t));
}
function $e(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(d.unseen, "");
}
function Gt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${d.verdict}]`)?.querySelector(`[${d.verdict}]`) !== null);
}
function so(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(d.unseen) === !0 && e.querySelector(`.nav-item:not([${d.unseen}]) [data-typo3-tab]`)?.click();
}
function ao(e, { tables: t, named: n }) {
  if (e.querySelector(`.form-section:not([${d.unseen}])`) !== null)
    return;
  const r = lo(e), o = t[r], s = (U(o) ? ee.fields : ee.tables)?.explain(e, r, o, n[r] ?? r);
  s !== void 0 && (s.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(s));
}
function lo(e) {
  const n = e.querySelector(`[${d.token}][${d.inside}='']`)?.getAttribute(d.token) ?? "";
  return Re(n);
}
function co(e, t) {
  let n = null;
  const r = ze();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null;
  const i = () => {
    n !== null && io(n.doc, { tables: o?.targets ?? {}, named: o?.named ?? {} });
  }, s = async () => {
    if (n === null)
      return;
    const { fields: c } = n, { active: u, groupId: p } = y();
    if (!u || p === null) {
      r.drop(), c.forEach(([f]) => {
        f.removeAttribute(d.verdict), f.removeAttribute(d.outOfReach);
      }), o = null, i();
      return;
    }
    const m = [...new Set(c.map(([, f]) => Re(f)))], h = await r.inspect(p, m);
    if (h === null)
      return;
    const { scopes: v } = h;
    e.take(h), c.forEach(([f, b]) => {
      const w = v.fields.targets[b];
      w !== void 0 && f.setAttribute(d.verdict, w), f.toggleAttribute(d.outOfReach, !U(v.tablesModify.targets[Re(b)]));
    }), o = v.tablesModify, i(), X("fields-judged", {});
  };
  D(({ doc: c, fields: u }) => {
    r.drop(), c.body.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`);
    const p = u.flatMap((m) => {
      const h = m.getAttribute(d.token);
      return h === null ? [] : [[m, h]];
    });
    n = p.length === 0 ? null : { doc: c, fields: p }, o = null, s();
  }, t), Y("permissions-written", () => void s(), t);
  let a = null;
  C(({ active: c, groupId: u }) => {
    const p = `${String(c)}:${String(u)}`;
    if (p === a) {
      i();
      return;
    }
    a = p, s();
  }, t);
}
function uo() {
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
function po() {
  let e = [], t = {};
  return {
    allowedBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.allowedBy;
    }
  };
}
const Bn = (e) => e.map((t) => `[${d.verdict}='${t}']:not([${d.outOfReach}])`).join(","), fo = (e) => Bn(e === "pick" ? to : $t), it = (e) => Bn([e === "pick" ? me : Z]), mo = `.${l.anchor}[${d.verdict}]`, ho = (e, t, n) => {
  const r = U(e.getAttribute(d.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(fo(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(it(n)),
    waiting: t ? g(n === "pick" ? "platform.toAllow" : "allowFields.toDisallow") : ""
  };
}, go = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function vo(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(d.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (go(n), t.waiting === "") {
      n.removeAttribute(d.waiting);
      return;
    }
    n.setAttribute(d.waiting, t.waiting);
  }
}
function bo(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = y();
    n.querySelectorAll(mo).forEach((a) => {
      vo(a, ho(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabAllow}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const p = () => [...c.querySelectorAll(`[${d.inside}='']`)].filter((h) => h.matches(it(a)) && !e.has(h)), m = u ?? i(s, c, p);
      m.disabled = p().length === 0;
    });
  }, i = (s, a, c) => {
    const u = s.createElement("button");
    return u.type = "button", u.className = `btn btn-default btn-sm ${l.tabAllow}`, u.textContent = g("allowFields.allowTab"), u.addEventListener("click", () => {
      c().forEach((p) => {
        e.toggle(p);
      }), r();
    }), a.querySelector(":scope > .form-section")?.prepend(u), u;
  };
  D((s) => {
    const a = s.doc === n;
    if (n = s.doc, r(), a)
      return;
    const c = (u) => {
      const p = u.target, m = p.closest(`.${l.mark}`) === null ? p.closest(it(y().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), Y("fields-judged", r, t), C(r, t);
}
async function wo(e, t) {
  return ne(O.allow_fields, { group: e, operations: [...t] });
}
const zt = 280;
function Se(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, zt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, zt * 2);
}
const Vt = `[${d.verdict}]:not([${d.outOfReach}])`, yo = [me, He].map((e) => `:not([${d.verdict}='${e}'])`).join("");
function ko(e, t) {
  let n = null, r = null;
  const o = () => {
    if (n === null)
      return;
    const a = n.querySelector('form[name="editform"]');
    if (a === null)
      return;
    const { active: c, area: u, face: p, groupId: m } = y(), h = c && u === "fields";
    if (h && r?.form === a && r.face === p && r.groupId === m) {
      r.showCount();
      return;
    }
    n.querySelectorAll(`.${l.faceFoot}`).forEach((v) => {
      v.remove();
    }), r = null, h && a.querySelector(Vt) !== null && m !== null && (r = { form: a, face: p, groupId: m, showCount: i(a, p === "pick", m) });
  }, i = (a, c, u) => {
    let p = null;
    const m = a.ownerDocument.createElement("div");
    m.className = l.faceFoot;
    const h = () => [...a.querySelectorAll(`[${d.token}]`)].filter((w) => e.has(w)), v = () => {
      if (!c) {
        ue("preview");
        return;
      }
      Se(a.ownerDocument, () => {
        ue("preview");
      });
    }, f = _e(m, {
      label: g(c ? "platform.doAllow" : "platform.doDisallow"),
      cancel: () => {
        e.drop(), v();
      },
      apply: () => {
        const w = h().map(($) => ({ field: $.getAttribute(d.token) ?? "", allow: c }));
        At() || wo(u, w).then(($) => {
          if (y().groupId !== u) {
            $ === "taken" && X("permissions-written", {});
            return;
          }
          if ($ !== "taken") {
            yt(f, $), p = w.length;
            return;
          }
          e.drop(), v(), X("permissions-written", {});
        });
      }
    }), b = () => {
      const w = [...a.querySelectorAll(Vt)].filter((x) => x.closest(`.${l.otherKinds}`) === null), $ = w.filter((x) => x.matches(yo)), P = h().length;
      p !== P && (p = null, f.state.textContent = G("allowFields.tally", w.length, $.length, w.length), f.waiting.textContent = P === 0 ? "" : G(`allowFields.${c ? "waiting" : "going"}`, P, P), f.ready(P > 0, c || P > 0));
    };
    return b(), a.append(m), b;
  }, s = () => {
    r?.showCount();
  };
  D((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), Y("fields-judged", o, t), C(o, t);
}
const Ao = `.${l.anchor}[${d.verdict}]`, $o = 350, So = 250, st = (e) => e.getAttribute(d.verdict) ?? "", Eo = (e) => e.getAttribute(d.token) ?? "", Co = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), at = (e) => g(`allowFields.mark.${e}.title`), qo = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return y().face === "pick" ? g(t ? "allowFields.hint.leave" : "allowFields.hint.allow") : g(t ? "allowFields.hint.keep" : "allowFields.hint.disallow");
};
function Lo(e, t) {
  if (t.length === 0)
    return [];
  const n = e.ownerDocument, r = n.createElement("h3");
  r.textContent = g("allowFields.allowedBy");
  const o = n.createElement("ul");
  o.append(...t.map((s) => {
    const a = n.createElement("span");
    a.textContent = s.title;
    const c = n.createElement("button");
    c.type = "button", c.className = "btn btn-default btn-sm", c.textContent = g("allowFields.showGroup"), c.setAttribute("aria-label", _(g("allowFields.showGroupNamed"), s.title)), c.addEventListener("click", () => {
      e.hidePopover(), wt(s.groupId);
    });
    const u = n.createElement("li");
    return u.append(a, c), u;
  }));
  const i = n.createElement("section");
  return i.append(r, o), [i];
}
function No(e, t, n) {
  const r = e.ownerDocument, o = st(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = at(o);
  const a = r.createElement("p");
  a.textContent = g(`allowFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...Lo(e, n));
  const p = qo(t);
  if (p !== "") {
    const m = r.createElement("footer");
    m.textContent = p, e.append(m);
  }
}
function _o(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (h) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      h.hidePopover();
    }, So);
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
  }, p = (h, v) => {
    window.clearTimeout(r);
    const f = u(h.ownerDocument);
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = h, h.style.setProperty("anchor-name", "--vperm-mark"), h.setAttribute("aria-expanded", "true"), No(f, v, e.allowedBy(Eo(v))), f.showPopover();
  }, m = () => {
    n.querySelectorAll(Ao).forEach((h) => {
      const v = Co(h);
      if (v === null)
        return;
      const f = v.querySelector(`.${l.mark}`);
      if (f !== null) {
        f.setAttribute("aria-label", at(st(h)));
        return;
      }
      const b = v.ownerDocument.createElement("button");
      b.type = "button", b.className = l.mark, b.setAttribute("aria-label", at(st(h))), b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-controls", l.markCard), b.setAttribute("aria-expanded", "false"), b.addEventListener("click", (w) => {
        p(b, h), w.detail === 0 && u(b.ownerDocument).querySelector("button")?.focus();
      }), b.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          p(b, h);
          return;
        }
        r = window.setTimeout(() => {
          p(b, h);
        }, $o);
      }), b.addEventListener("mouseleave", () => {
        a(u(b.ownerDocument));
      }), b.addEventListener("focusout", (w) => {
        c(u(b.ownerDocument), w);
      }), v.append(b);
    });
  };
  D((h) => {
    n = h.doc;
  }, t), Y("fields-judged", m, t);
}
function Oo(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      Po(r);
    });
  };
  D((r) => {
    t = r.doc, n();
  }, e), Y("fields-judged", n, e);
}
function Po(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${d.token}]:not([${d.outOfReach}])`) === null);
}
const xo = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Fe = (e) => `${e}, ${xo[e]}`, Un = [
  { key: "modules", host: Fe(".scaffold-sidebar"), ground: "panel" },
  {
    key: "pageMounts",
    host: Fe("typo3-backend-navigation-component-pagetree"),
    showing: "typo3-backend-navigation-component-pagetree",
    ground: "tree"
  },
  {
    key: "fileMounts",
    host: Fe("typo3-backend-navigation-component-filestoragetree"),
    showing: "typo3-backend-navigation-component-filestoragetree",
    ground: "tree"
  },
  { key: "fields", host: Fe('[slot="content"]'), ground: "module" }
];
function Ht(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(d.area), t.removeAttribute(d.ground);
  });
}
function jn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Fo(e, t) {
  const n = (i) => {
    if ((i.active ? te(e, i.groupId) : null) === null) {
      Ht(e);
      return;
    }
    const a = Un.flatMap((c) => {
      const u = jn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Ht(e), a.forEach(({ element: c, key: u, ground: p }) => {
      c.classList.add(l.frame), c.setAttribute(d.area, u), c.setAttribute(d.ground, p), Mo(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      To(e) && n(y());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(y()), C(n, t);
}
function To(e) {
  return Un.some((t) => {
    const n = jn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(d.area) !== t.key);
  });
}
function Mo(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const Io = "typo3-backend-contextual-record-edit-trigger";
function Do(e, t) {
  let n = null;
  const r = (p) => {
    const m = p.target.closest(Io);
    !y().active || m === null || (p.preventDefault(), p.stopPropagation(), ae(e)?.setAttribute("endpoint", m.getAttribute("edit-url") ?? ""));
  };
  e.addEventListener("click", r, { capture: !0, signal: t });
  const o = () => {
    const { active: p, area: m } = y();
    return p && m === "fields";
  }, i = (p) => {
    o() && p.preventDefault();
  }, s = (p) => {
    p.target.closest(`.${l.anchor}`) !== null && i(p);
  }, a = `.${l.anchor} *:not(.${l.tableGate} *):not(.${l.mark})`, c = "a,input,select,textarea,button,[contenteditable]", u = () => {
    const p = o();
    n?.querySelectorAll(a).forEach((m) => {
      (m.matches(c) || m.shadowRoot !== null) && m.toggleAttribute("inert", p);
    });
  };
  D((p) => {
    n = p.doc, n.addEventListener("submit", i, { capture: !0, signal: t }), n.addEventListener("click", s, { capture: !0, signal: t }), n.addEventListener("click", r, { capture: !0, signal: t }), u();
  }, t), C(u, t);
}
const Ro = ".module-docheader-buttons .btn-toolbar", Bo = (e, t) => {
  e.location.assign(t);
};
function Uo(e, t = Bo) {
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
    !s || a !== "fields" || i.querySelectorAll(`[${d.switch}][${d.inside}='']`).forEach((c) => {
      const u = c.querySelector("select");
      if (u === null)
        return;
      const p = i.createElement("div");
      p.className = `input-group input-group-sm ${l.typeSwitch}`;
      const m = c.getAttribute(d.switch) ?? "", h = i.createElement("span");
      h.className = "input-group-text", h.textContent = m;
      const v = i.createElement("select");
      v.className = "form-select form-select-sm", v.setAttribute("aria-label", m), v.append(...[...u.children].map((f) => f.cloneNode(!0))), v.value = u.value, v.addEventListener("change", () => {
        const [f, b, w] = u.name.slice(5, -1).split("]["), $ = new URL(i.URL), P = String(b).startsWith("NEW") ? `defVals[${String(f)}][${String(w)}]` : `vperm[value][${String(f)}][${String(b)}][${String(w)}]`;
        $.searchParams.set(P, v.value), t(i, $.toString());
      }), p.append(h, v), i.querySelector(Ro)?.append(p);
    });
  };
  C(() => {
    r(), o();
  }, e), D(({ doc: i }) => {
    n = i, r(), o();
  }, e);
}
function Ct(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), e.groups.forEach(({ label: h, values: v }) => {
    const f = document.createElement("section"), b = document.createElement("h2");
    b.textContent = h;
    const w = document.createElement("div");
    w.append(...v.map(($) => Wo($, n.has($.value), o.has($.value)))), f.append(b, w), i.append(f);
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
  }, p = Mt.advanced({
    title: _(e.title, t),
    content: i,
    size: Mt.sizes.large,
    buttons: [c, u]
  }), m = () => {
    p.updateComplete.then(() => {
      p.querySelector('button[name="apply"]')?.toggleAttribute("disabled", a().length === 0);
    });
  };
  m(), p.updateComplete.then(() => {
    p.querySelector(".modal-footer")?.prepend(s);
  }), i.addEventListener("change", () => {
    const h = a(), v = h.filter(({ allow: f }) => f).length;
    s.textContent = jo(v, h.length - v), m();
  });
}
function jo(e, t) {
  return [
    ...e > 0 ? [_(g("platform.waiting"), e)] : [],
    ...t > 0 ? [_(g("platform.going"), t)] : []
  ].join(`
`);
}
function Wo({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function Wn(e, t) {
  return ne(O.allow_modules, { group: e, operations: [...t] }, (n) => {
    n.alsoAllowed.forEach((r) => {
      De.info(_(g("allowModules.alsoAllowed"), r));
    });
  });
}
async function Ko(e, t) {
  const n = await Ge(e);
  if (n === null)
    return;
  const r = await Pe(new H(I(O.modules_outside_menu)).get());
  if (r === null)
    return;
  const o = new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => U(i)).map(([i]) => i));
  Ct(r, t, o, async (i) => await Wn(e, i.map(({ value: a, allow: c }) => ({ module: a, allow: c }))) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => i === Ve).map(([i]) => i)));
}
const Kn = "data-modulemenu-identifier", Be = `[${Kn}]:not([aria-controls])`, Gn = ".modulemenu-group-container";
let ye = !1;
const lt = /* @__PURE__ */ new WeakMap();
let ce = null;
const ke = xn(560);
function Go(e, t, n) {
  const r = y().groupId, o = te(e, r) ?? "", i = [...t.querySelectorAll(Be)], s = i.filter((A) => U(J(A))), a = i.filter((A) => J(A) === Z), c = Yt(e, l.facePreview, g("platform.preview"), _(g("allowModules.previewFor"), o)), u = Yt(e, l.facePick, g("platform.pick"), _(g("allowModules.pickFor"), o)), m = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  m.className = l.coin, m.replaceChildren(c.sheet, u.sheet);
  const v = e.querySelector(`.${l.allowed}`) ?? e.createElement("div");
  v.className = l.allowed, m.parentElement !== v && v.replaceChildren(m);
  const f = Vo(e, t);
  v.parentElement !== f && f.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    f.classList.add(l.panelCardTurned);
  });
  const b = (A) => {
    ye = A, m.classList.toggle(l.coinTurned, A), c.sheet.toggleAttribute("inert", A), u.sheet.toggleAttribute("inert", !A);
  }, w = (A) => {
    const E = A.filter((N) => N.allow).map((N) => N.module);
    r !== null && y().groupId === r && (At() || (E.forEach((N) => {
      ke.add(N);
    }), Wn(r, A).then((N) => {
      if (N !== "taken") {
        E.forEach((B) => {
          ke.delete(B);
        }), yt(ye ? x : $, N);
        return;
      }
      b(!1), X("permissions-written", {});
    })));
  }, $ = _e(c.foot, {
    label: g("platform.doDisallow"),
    cancel: () => {
      Je(c.scroll).forEach((A) => {
        A.classList.remove(l.faceMarked);
      }), F();
    },
    apply: () => {
      w(Je(c.scroll).map((A) => ({ module: Qe(A), allow: !1 })));
    }
  }), P = () => {
    Jt(u.scroll, t, F), F(), b(!1);
  }, x = _e(u.foot, {
    label: g("platform.doAllow"),
    cancel: P,
    apply: () => {
      const A = Qt(u.scroll).filter((E) => J(E) !== lt.get(E));
      w(A.map((E) => ({ module: Qe(E), allow: !0 })));
    }
  }), F = () => {
    const A = Qt(u.scroll), E = A.filter((k) => J(k) !== lt.get(k)), N = A.filter((k) => U(J(k)) && !E.includes(k)).length, B = G("allowModules.tally", A.length, N, A.length);
    j.textContent = B;
    const W = Je(c.scroll);
    $.state.textContent = W.length === 0 ? B : G("allowModules.marked", a.length, W.length, a.length), $.ready(W.length > 0, W.length > 0), x.state.textContent = "", x.waiting.textContent = E.length === 0 ? "" : _(g("platform.waiting"), E.length), x.ready(E.length > 0, !0);
  };
  c.bar.append(
    Q(e, g("allowModules.allow"), "btn btn-default", () => {
      b(!0);
    }),
    L(e, l.faceHint, g("allowModules.hint"))
  );
  const V = e.createElement("div");
  V.className = l.faceChoice;
  const j = L(e, l.faceCounted, "");
  V.append(j), V.append(Q(e, g("allowModules.outside"), "btn btn-default", () => {
    r !== null && Ko(r, o);
  }));
  const S = n.filter(U).length;
  V.append(L(e, l.faceCounted, G("allowModules.outside.tally", n.length, S, n.length))), u.sheet.insertBefore(V, u.foot), u.scroll.style.setProperty("--vperm-queued-note", `"${g("platform.toAllow")}"`), Ho(e, c.scroll, s, g("platform.from"), F), Jt(u.scroll, t, F), F(), b(ye), ke.start(() => {
    m.querySelectorAll(`.${l.facePreview} ${Be}`).forEach((A) => {
      A.classList.toggle(l.justAdded, ke.isLit(Qe(A)));
    });
  }), ce?.abort(), ce = new AbortController(), kt(e, ce.signal, () => ye, P), Fn(r, [$, x], ce.signal);
}
function zo(e, t) {
  ce?.abort(), ce = null, ye = !1, ke.stop();
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
function Vo(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Yt(e, t, n, r) {
  const o = Pn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function Ho(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(Gn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(L(e, l.allowedGroup, a)));
    const c = Qo(s);
    c.getAttribute(d.verdict) === Z ? Vn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(L(e, l.allowedFrom, r)), t.append(c);
  });
}
function Jt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(Gn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(Be).forEach((r) => {
    zn(r), lt.set(r, J(r)), U(J(r)) && r.setAttribute("aria-disabled", "true"), Vn(r, () => {
      Jo(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(L(r.ownerDocument, l.allowedGroup, r.getAttribute("title") ?? ""));
  });
}
function Yo(e) {
  const t = J(e);
  return e.getAttribute("aria-disabled") === "true" || !Et(t) ? "" : U(t) ? "unpick" : "allow";
}
function Jo(e) {
  const t = Yo(e);
  t !== "" && e.setAttribute(d.verdict, t === "allow" ? Z : me);
}
function zn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function Qo(e) {
  const t = e.cloneNode(!0);
  return zn(t), t;
}
function Vn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function Je(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function Qt(e) {
  return [...e.querySelectorAll(Be)].filter((t) => Et(J(t)));
}
const J = (e) => e.getAttribute(d.verdict) ?? "", Qe = (e) => e.getAttribute(Kn) ?? "", Xe = "#modulemenu", Hn = "data-modulemenu-identifier", Xo = `[${Hn}]:not([aria-controls])`;
function Zo(e, t) {
  const n = ze();
  let r = null;
  const o = async () => {
    const { active: s, groupId: a, area: c } = y();
    if (!s || a === null || c !== "modules") {
      n.drop(), e.querySelectorAll(`${Xe} [${d.verdict}]`).forEach((f) => {
        f.removeAttribute(d.verdict);
      }), i(e);
      return;
    }
    const u = e.querySelector(Xe);
    if (u === null)
      return;
    const p = [...u.querySelectorAll(Xo)];
    if (p.length === 0)
      return;
    const m = await n.inspect(a);
    if (m === null)
      return;
    const { scopes: h } = m;
    Object.entries(h.modules.targets).forEach(([f, b]) => {
      p.filter((w) => w.getAttribute(Hn) === f).forEach((w) => {
        w.setAttribute(d.verdict, b);
      });
    }), r ??= Pe(new H(I(O.modules_outside_menu)).get());
    const v = await r;
    if (v === null) {
      r = null;
      return;
    }
    Go(e, u, v.groups.flatMap(({ values: f }) => f.map(({ value: b }) => h.modules.targets[b])));
  }, i = (s) => {
    const a = s.querySelector(Xe);
    a !== null && zo(s, a);
  };
  o(), Y("permissions-written", () => void o(), t), C(() => void o(), t);
}
async function ei(e, t, n) {
  const r = await ne(O.allow_tables, { group: e, operations: [{ table: t, allow: n }] });
  return r === "taken" && X("permissions-written", {}), r;
}
function Yn(e, { groupId: t, table: n, called: r, verdict: o }) {
  const i = o === Z, s = o === Ve || o === St, a = o === He, c = e.createElement("div");
  c.className = `callout callout-notice callout-sm ${l.tableGate}`, c.append(L(e, l.tableName, r)), c.append(L(e, l.tableToken, n));
  const u = L(e, "callout-body", g(ti(o)));
  if (c.append(u), !s && !a) {
    const p = Q(
      e,
      _(g(i ? "allowTables.disallow" : "allowTables.allow"), r),
      `btn btn-default btn-sm ${i ? l.tableDisallow : l.tableAllow}`,
      () => {
        p.toggleAttribute("disabled", !0), ei(t, n, !i).then((m) => {
          p.toggleAttribute("disabled", !1), m !== "taken" && m !== "cancelled" && (u.textContent = g(`platform.${m}`));
        });
      }
    );
    c.append(p);
  }
  return c;
}
function ti(e) {
  return e === Z ? "allowTables.theirs" : e === He ? "allowTables.adminOnly" : e === St ? "allowTables.alsoInherited" : e === Ve ? "allowTables.inherited" : "allowTables.missing";
}
const Xt = ".typo3-TCEforms";
function ni(e) {
  let t = null;
  const n = ze(), r = async () => {
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
    o.querySelectorAll(`[${d.inside}]`).forEach((v) => {
      const f = v.getAttribute(d.inside) ?? "", b = f === "" ? v.closest(Xt) : o.querySelector(`[${d.field}='${f}']`), w = v.getAttribute(d.token) ?? "";
      b !== null && u.set(b, Re(w));
    });
    const p = await n.inspect(c, [...new Set(u.values())]);
    if (p === null)
      return;
    const { named: m, targets: h } = p.scopes.tablesModify;
    u.forEach((v, f) => {
      const b = h[v];
      if (![Z, Ve, St, me].some((P) => P === b))
        return;
      const w = Yn(o, { groupId: c, table: v, called: m[v] ?? v, verdict: b }), $ = f.matches(Xt) ? null : f.querySelector(".form-irre-object");
      if ($ === null) {
        f.prepend(w);
        return;
      }
      $.before(w);
    });
  };
  D((o) => {
    t = o.doc, r();
  }, e), Y("permissions-written", () => void r(), e), C(() => void r(), e);
}
const ri = ".form-group";
function Jn(e) {
  return e.closest(ri);
}
function oi(e) {
  ro({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !U(s)).forEach(([s]) => {
        t.querySelectorAll(`[${d.token}^='${s}:']`).forEach((a) => {
          $e(a.closest(i) ?? Jn(a) ?? a);
        }), o === "preview" && ii(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o) => Yn(t, { groupId: y().groupId ?? 0, table: n, called: o, verdict: r })
  }, e);
}
function ii(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${d.token}^='${t}:']:not([${d.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(d.inside) ?? "", s = e.querySelector(`[${d.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(L(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      _(g("allowTables.gone"), n)
    ));
  });
}
async function si(e, t, n) {
  return ne(e === "pageTypes" ? O.allow_page_types : O.allow_values, {
    group: t,
    operations: [...n]
  });
}
function ai(e) {
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
    t.querySelectorAll(`[${d.allows}]`).forEach((i) => {
      if (i.nextElementSibling?.classList.contains(l.allowChoose) === !0)
        return;
      const s = i.getAttribute(d.token) ?? "", a = i.ownerDocument.createElement("button");
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = g(`allowedValues.choose.${no(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(d.choices) ?? "{}"), u = y().groupId ?? 0;
        Ge(u).then((p) => {
          if (p === null)
            return;
          const m = i.getAttribute(d.allows) === "pageTypes" ? "pageTypes" : "fieldValues", h = m === "pageTypes" ? "" : `${s}:`, v = new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => U(f)).map(([f]) => f.substring(h.length)));
          Ct(c, te(document, u) ?? "", v, async (f) => await si(m, u, f.map(({ value: w, allow: $ }) => ({ value: `${h}${w}`, allow: $ }))) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => U(f) && f !== Z).map(([f]) => f.substring(h.length))));
        });
      }), i.after(a);
    });
  };
  D((r) => {
    t = r.doc, n();
  }, e), C(n, e);
}
const li = `[${d.verdict}='${me}'], [${d.verdict}='${He}']`;
function ci(e) {
  oo({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(li).forEach((o) => {
        $e(Jn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        L(t, "callout-body", _(g("allowFields.recordNoFields"), o)),
        Q(t, g("recordForm.add"), "btn btn-default btn-sm", () => {
          Se(t, () => {
            ue("pick");
          });
        })
      ), i;
    }
  }, e);
}
async function ui(e, t) {
  const n = await Ge(e);
  if (n === null)
    return;
  const r = await Pe(new H(I(O.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  Ct(r, t, o, async (i) => await ne(O.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== Z).map(([i]) => i)));
}
const Qn = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: se.folderTree,
  base: Er,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = I(O.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: I("filestorage_tree_rootline"),
      filterUrl: I("filestorage_tree_filter"),
      showIcons: !0
    };
  },
  write: async (e, t, n, r) => ne(O.mount_folders, {
    group: e,
    operations: t.map((o) => ({
      folder: decodeURIComponent(o),
      mount: n,
      // A folder with an existing record needs no new title; the backend keeps the one it has
      title: r.get(o) ?? ""
    }))
  }),
  choice: (e, t) => Q(
    e,
    g("mountBranches.folders.chooseOperations"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    "btn btn-default",
    () => {
      ui(t, te(e, t) ?? "");
    }
  )
}, Xn = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: se.pageTree,
  base: Cr,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => ({ ...await (await new H(I("page_tree_browser_configuration")).get()).resolve(), rootlineUrl: I("page_tree_rootline") }),
  write: async (e, t, n) => ne(O.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function di(e, t) {
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
function pi(e) {
  const t = /* @__PURE__ */ new Map();
  return Zn(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function fi(e, t) {
  const n = Zn(e);
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
const Zn = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ee = xn(520), R = /* @__PURE__ */ new Set(), K = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Set(), Ue = /* @__PURE__ */ new Set(), ct = /* @__PURE__ */ new Set(), er = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, tr = (e) => z.has(e) && !Ue.has(e), nr = (e) => e.__parents ?? [], Ce = (e) => nr(e).some((t) => z.has(t)), mi = (e, t) => t.some((n) => z.has(n.identifier) && nr(n).includes(e.identifier)), rr = (e) => e.detail;
function hi(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = rr(o);
    s === !1 || er(i.identifier) || z.has(i.identifier) || Ce(i) || (K.has(i.identifier) ? K.delete(i.identifier) : K.add(i.identifier), t(), Ze(Ie(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Ie(e);
    o !== null && (!Oe.has(o) || e.querySelector(".node[data-id='0']") !== null) && Ze(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), Ze(Ie(e));
}
function gi(e) {
  const t = Ie(e);
  if (t === null)
    return;
  const n = Oe.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), Oe.delete(t), t.requestUpdate());
}
function Ze(e) {
  if (e !== null) {
    if (Zt(e.nodes), !Oe.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      Oe.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => Zt(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return z.has(r.identifier) && o.push(l.mountAlready), K.has(r.identifier) && o.push(l.mountPicked), er(r.identifier) && o.push(l.mountWhole), o;
      };
    }
    e.requestUpdate();
  }
}
function Zt(e) {
  return e.filter((t) => Number(t.identifier) < 1).forEach((t) => {
    t.__hidden = !0;
  }), e;
}
const Oe = /* @__PURE__ */ new WeakMap(), Ie = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let et = "", en = () => {
};
async function vi(e, t, n, { groupId: r, kind: o, showCount: i }) {
  en = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), et = s;
    return;
  }
  const a = o.tree;
  if (bi(a, o.base), t.querySelector(a) !== null && et === s)
    return;
  const u = await o.rootedAt(r), p = e.createElement(a);
  p.addEventListener("mousedown", (h) => {
    const v = h.target instanceof Element ? h.target.closest(".node") : null;
    v !== null && (tr(v.getAttribute("data-id") ?? "") || h.preventDefault());
  }), p.addEventListener("typo3:tree:node-selected", (h) => {
    h.stopPropagation();
    const { node: v, propagate: f } = rr(h);
    f !== !1 && (R.has(v.identifier) ? R.delete(v.identifier) : R.add(v.identifier), ut(e), en());
  }), Object.assign(p, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(p), t.replaceChildren(m), et = s, Object.assign(p, { setup: u });
}
function ut(e) {
  e.querySelector(
    `.${l.facePreview} :is(${se.pageTree}, ${se.folderTree})`
  )?.requestUpdate();
}
function bi(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return tr(n.identifier);
    }
    // Core loads the first levels only, so a deeper mount needs the way down to it loaded
    async loadData() {
      await super.loadData();
      const n = [...z].filter((r) => !this.nodes.some((o) => o.identifier === r));
      for (const r of n) {
        const o = await new H(this.settings.rootlineUrl ?? "").withQueryArguments({ identifier: r }).get().catch(() => null);
        if (o === null)
          continue;
        const { rootline: i } = await o.resolve();
        for (const s of i.slice(0, -1)) {
          const a = this.nodes.find((c) => c.identifier === s);
          a !== void 0 && a.loaded !== !0 && await this.loadChildren(a);
        }
      }
      tn(this.nodes);
    }
    prepareNodes(n) {
      return tn(super.prepareNodes(n));
    }
    hideChildren(n) {
      !Ce(n) && !z.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return Ce(n) && r.push(l.mountInside), !Ce(n) && !z.has(n.identifier) && r.push(l.mountContext), Ue.has(n.identifier) && r.push(l.mountInherited), R.has(n.identifier) && r.push(l.faceMarked), ct.has(n.identifier) && r.push(l.mountUnseen), Ee.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function tn(e) {
  return e.forEach((t) => {
    Ce(t) || z.has(t.identifier) || (t.__expanded = !0, t.__hidden = !mi(t, e));
  }), e;
}
function wi(e, t, n, r) {
  const o = (u) => g(`${r}.${u}`);
  if (t.sheet.querySelector(`.${l.unseenPages}`)?.remove(), n.length === 0)
    return;
  const i = e.createElement("div");
  i.className = l.unseenPages;
  const s = e.createElement("b");
  s.textContent = G(`${r}.unseen`, n.length, n.length);
  const a = e.createElement("p");
  a.append(s, ` ${o("unseenWhy")}`);
  const c = e.createElement("ul");
  n.forEach(({ page: u, title: p, link: m }) => {
    const h = e.createElement("a");
    h.href = m, h.addEventListener("click", (f) => {
      f.preventDefault(), wn.update("web", u, !0), je.App.showModule("permissions_pages");
    }), h.setAttribute("aria-label", _(o("unseenLink"), p)), h.textContent = _(o("unseenPage"), p);
    const v = e.createElement("li");
    v.append(h), c.append(v);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let Ae = !1, dt = null, qe = null;
function yi(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (S) => g(`${i}.${S}`), a = te(e, r) ?? "", c = Ai(e, t);
  dt !== r && (R.clear(), K.clear(), dt = r), qe?.abort(), qe = new AbortController();
  const { signal: u } = qe, p = nn(e, c, l.facePick), m = nn(e, c, l.facePreview);
  m.eyebrow.textContent = g("platform.preview"), m.sentence.textContent = _(s("previewFor"), a), p.eyebrow.textContent = g("platform.pick"), p.sentence.textContent = _(s("pickFor"), a);
  const h = n.order;
  z.clear(), Ue.clear(), Object.entries(n.targets).forEach(([S, A]) => {
    z.add(S), Et(A) || (Ue.add(S), R.delete(S));
  });
  const v = (S) => {
    m.sheet.toggleAttribute("inert", S), p.sheet.toggleAttribute("inert", !S);
  }, f = (S) => {
    Ae = S, c.classList.toggle(l.panelCardTurned, !S), v(S);
  };
  v(Ae);
  const b = () => {
    const S = G(`${i}.tally`, h.length, h.length);
    $.state.textContent = R.size === 0 ? S : G(`${i}.marked`, h.length, R.size, h.length), $.ready(R.size > 0, R.size > 0), j.state.textContent = S, j.waiting.textContent = K.size === 0 ? "" : _(g("mountBranches.waiting"), K.size), j.ready(K.size > 0, !0);
  }, w = (S, A) => {
    if (y().groupId !== r)
      return;
    const E = [...S];
    if (E.length === 0 || At())
      return;
    const N = o.write(r, E, A, pi(p.sheet));
    A && E.forEach((B) => {
      Ee.add(B);
    }), N.then((B) => {
      if (B !== "taken") {
        E.forEach((W) => {
          Ee.delete(W);
        }), yt(A ? j : $, B);
        return;
      }
      E.forEach((W) => S.delete(W)), x(), f(!1), X("permissions-written", {});
    });
  }, $ = _e(m.foot, {
    label: g("mountBranches.doRemove"),
    cancel: () => {
      R.clear(), ut(e), b();
    },
    apply: () => {
      w(R, !1);
    }
  }), P = new Set(Object.keys(n.named)), x = () => {
    p.sheet.querySelector(`.${l.naming}`)?.remove(), p.scroll.hidden = !1, p.eyebrow.textContent = g("platform.pick"), p.sentence.textContent = _(s("pickFor"), a);
  }, F = () => {
    const S = [...K].filter((E) => !P.has(E)), A = p.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && S.length > 0 && !A) {
      const E = di(e, S);
      E.addEventListener("submit", (N) => {
        N.preventDefault(), F();
      }), E.addEventListener("input", () => {
        j.ready(V(), !0);
      }), p.eyebrow.textContent = s("name"), p.sentence.textContent = s("nameFor"), p.scroll.hidden = !0, p.sheet.insertBefore(E, p.foot), E.querySelector("input")?.focus();
      return;
    }
    if (A && !V()) {
      p.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    w(K, !0);
  }, V = () => fi(p.sheet, s("nameWhy")), j = _e(p.foot, {
    label: g("mountBranches.doAdd"),
    cancel: () => {
      K.clear(), x(), f(!1), b();
    },
    apply: F
  });
  if (p.scroll.style.setProperty("--vperm-queued-note", `"${g("mountBranches.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), ct.clear(), n.unseen.forEach(({ page: S }) => {
    ct.add(String(S));
  }), wi(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const S = e.createElement("div");
    S.className = l.faceChoice, S.append(o.choice(e, r)), m.sheet.insertBefore(S, m.foot);
  }
  vi(e, m.scroll, h, { groupId: r, kind: o, showCount: b }), hi(p.sheet, b, u), b(), Ee.start(() => {
    ut(e);
  }), kt(e, u, () => Ae, () => {
    if (p.sheet.querySelector(`.${l.naming}`) !== null) {
      x();
      return;
    }
    f(!1);
  }), Fn(r, [$, j], u), m.bar.replaceChildren(
    m.eyebrow,
    m.sentence,
    Q(e, s("add"), "btn btn-default", () => {
      f(!0);
    }),
    L(e, l.faceHint, s("hint"))
  ), window.requestAnimationFrame(() => {
    f(Ae);
  });
}
function ki(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  Ae = !1, R.clear(), dt = null, Ee.stop(), qe?.abort(), qe = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), gi(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, On));
}
function Ai(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function nn(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return $i(r);
  const o = Pn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function $i(e) {
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
const Si = { pageMounts: Xn, fileMounts: Qn };
function Ei(e, t) {
  const n = ze();
  let r = !1;
  const o = async () => {
    const { active: s, groupId: a, area: c } = y(), u = Si[c];
    if (!s || a === null || u === void 0) {
      n.drop(), ki(e);
      return;
    }
    const p = e.querySelector(u.component);
    if (p === null)
      return;
    r = !0;
    const m = await n.inspect(a);
    r = !1, m !== null && yi(e, p, u.mounted(m.scopes), { groupId: a, kind: u });
  }, i = new MutationObserver(() => {
    !r && [Xn, Qn].every(({ component: s }) => e.querySelector(`${s} > .${l.panelCard}`) === null) && o();
  });
  i.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    i.disconnect();
  }), o(), Y("permissions-written", () => void o(), t), C(() => void o(), t);
}
let pt = null;
function or(e) {
  pt = e, je.App.showModule(e);
}
function Ci(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function qi(e) {
  const t = pt === e;
  return pt = null, t;
}
const Le = "other", rn = ["modules", "pageMounts", "fileMounts", "fields", Le], Li = 10, oe = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Le]: "module"
}, Ni = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function _i(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", g("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(d.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const b = ir(e);
    if (b.forEach((k) => {
      v.observe(k);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = b.map((k) => re(k)), $ = [...rn, ...w.filter((k) => !rn.includes(k))], P = w.includes("fields") ? [Le] : [], x = b.filter((k) => k.getBoundingClientRect().width !== 0).map(re), F = x.includes("fields") ? [...x, Le] : x, [V] = F.includes("fields") ? ["fields"] : F, j = F.find((k) => oe[k] !== void 0 && oe[k] === oe[f.picked]), S = F.includes(f.picked) ? f.picked : j ?? V;
    if (F.join() !== i && (i = F.join(), S !== void 0 && S !== f.area)) {
      Ir(S);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap((k) => [Ui(e, k), Bi(e, k)]),
      ...$.map((k) => Pi(e, k, g(`pickAnArea.${k}`)))
    )), n.parentElement === null && Oi(e).append(n);
    const A = f.area === Le ? "fields" : f.area;
    Ti(n, e), Mi(n, e, b.find((k) => re(k) === A) ?? null);
    const E = f.area !== "fields";
    b.forEach((k) => {
      const q = re(k), ve = q === A, le = E && !ve && q !== "modules", be = Te(n, q);
      be?.setAttribute("aria-selected", String(q === f.area)), xi(be, k), k.toggleAttribute(d.armed, ve), k.toggleAttribute("inert", le), r.add(k), ji(Ki(n, q), k, le), Ii(Gi(n, q), k, ve, b);
    });
    let N = 0, B = null;
    $.forEach((k) => {
      const q = Te(n, k);
      if (q === null)
        return;
      const ve = q.hidden ? 0 : q.getBoundingClientRect().width, le = b.find((kr) => re(kr) === k), be = le ?? Wi(k, b), Tt = Math.max(N, be?.getBoundingClientRect().left ?? N);
      q.style.setProperty("--vperm-host-x", `${String(Tt)}px`), q.toggleAttribute(d.elsewhere, le === void 0), le === void 0 && (q.setAttribute("aria-selected", String(k === f.area)), xe(q, be ?? B ?? q)), N = q.hidden ? N : Tt + ve + Li, B = q;
    });
    const W = Te(n, "fields");
    P.forEach((k) => {
      const q = Te(n, k);
      q === null || W === null || (q.setAttribute("aria-selected", String(k === f.area)), q.hidden = W.hidden);
    });
  };
  let c = 0;
  const u = () => {
    window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
      a(y());
    });
  }, p = new MutationObserver((f) => {
    f.some((b) => !n.contains(b.target)) && u();
  });
  let m = !1;
  const h = (f) => {
    const b = f.detail.module ?? "", w = qi(b);
    if (!m) {
      m = !0;
      return;
    }
    !w && oe[y().picked] === "tree" && Ln("fields");
  };
  e.addEventListener("typo3-module-loaded", h, { signal: t }), p.observe(e.body, { childList: !0, subtree: !0 });
  const v = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    p.disconnect(), v.disconnect(), window.cancelAnimationFrame(c);
  }), C(a, t), a(y());
}
const Oi = (e) => e.querySelector(".scaffold") ?? e.body;
function Pi(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(d.area, t), r.setAttribute(d.label, n), r.append(L(e, l.tabLabel, n)), r.addEventListener("click", () => {
    Ln(t);
    const o = Ni[t];
    o !== void 0 && ir(e).every((i) => re(i) !== t) && or(o);
  }), r;
}
function xi(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, xe(e, t));
}
const xe = (e, t) => {
  e.setAttribute(d.ground, t.getAttribute(d.ground) ?? "");
}, Fi = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Ti(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function Mi(e, t, n) {
  const r = Di(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, xe(r, n), qt(r, n);
}
function qt(e, t) {
  const n = t.getBoundingClientRect(), r = Fi(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function Ii(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  xe(e, t), e.hidden = o.width === 0 || o.left === 0 || n || _n(t.ownerDocument) === 0 || Ri(o, r), qt(e, t);
}
function Di(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Ri(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Bi(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(d.area, t), n;
}
function Ui(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(d.area, t), n;
}
function ji(e, t, n) {
  e !== null && (e.hidden = !n, n && (xe(e, t), qt(e, t)));
}
const Wi = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  oe[e] === void 0 ? void 0 : t.find((n) => oe[re(n)] === oe[e])
), Te = (e, t) => e.querySelector(`.${l.tab}[${d.area}="${t}"]`), Ki = (e, t) => e.querySelector(`.${l.areaCover}[${d.area}="${t}"]`), Gi = (e, t) => e.querySelector(`.${l.tabSeam}[${d.area}="${t}"]`);
function ir(e) {
  return [...e.querySelectorAll(`.${l.frame}[${d.area}]`)];
}
const re = (e) => e.getAttribute(d.area) ?? "", sr = "#modulemenu", zi = `${sr} .modulemenu-group-container.collapse:not(.show)`, Vi = `${sr} [aria-controls]`, Hi = "typo3-backend-content-navigation[navigation-collapsed]", on = "navigation-collapsed";
function Yi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = y();
    o && Qi(e, n), o && i === "modules" && Ji(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    y().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), C(r, t);
}
function Ji(e, t) {
  e.querySelectorAll(zi).forEach((n) => {
    n.classList.add("show"), sn(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), sn(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Vi).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function Qi(e, t) {
  e.querySelectorAll(Hi).forEach((n) => {
    n.toggleAttribute(on, !1), t.push(() => {
      n.toggleAttribute(on, !0);
    });
  });
}
function sn(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const Xi = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", an = "scaffold-content-navigation-expanded";
function Zi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(an);
    }), n = y().active ? [...e.querySelectorAll(Xi)] : [], n.forEach((o) => {
      o.classList.add(an);
    });
  };
  r(), C(r, t);
}
const ar = (e) => [...e, "web_list"], Ne = ar(["web_layout", "records", "media_management", "permissions_pages"]), lr = "vperm.module";
function es(e, t) {
  let n = null;
  const r = (i) => {
    os(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || Ne.includes(ns(e))))
      return;
    const a = is() ?? Ne[0] ?? "", c = bt(e);
    if ((c !== "" || Pr(e)) && i.area === "fields") {
      Ci(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        ts(e, c);
      },
      { once: !0, signal: t }
    ), or(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    y().active && Ne.includes(s) && pe(lr, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), C(r, t);
}
async function ts(e, t) {
  const n = ae(e), r = await Rn(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function ns(e) {
  return je.App.getCurrentModule() ?? ae(e)?.getAttribute("module") ?? "";
}
const cr = "[data-modulemenu-identifier]:not([aria-controls])", rs = `#modulemenu ${cr}`;
function os(e, t) {
  e.querySelectorAll(rs).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !Ne.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(cr)].every((r) => r.parentElement?.hidden === !0);
  });
}
function is() {
  const e = de.get(lr);
  return typeof e == "string" && Ne.includes(e) ? e : void 0;
}
function ss(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function as(e) {
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
function ls(e) {
  D(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const cs = "[data-object-id]";
function ur(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = y();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), us(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), ds(a), dr(a, e));
    });
  };
  D((i) => {
    n = i.doc, o();
  }, t), C(o, t);
}
function us(e, t) {
  e.querySelectorAll(cs).forEach((n) => {
    ps(n) && (fs(n), n.matches(t.shut) || dr(n, t));
  });
}
function dr(e, t) {
  e.querySelector(t.opener)?.click();
}
const Lt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function ds(e) {
  ie.set(Lt(e), "folded");
}
function ps(e) {
  return ie.isset(Lt(e));
}
function fs(e) {
  ie.unset(Lt(e));
}
function ms(e) {
  ur({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function hs(e, t) {
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
    ne(O.write_other_permissions, v).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== p, f === "taken") {
        De.success(g("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && De.error(g("editOtherPermissions.notSaved"));
    });
  }), a.append(c), i.append(s, a), o.append(i), n.append(o, r);
  let p = null, m = null;
  const h = (v) => {
    const f = !v.active || v.area !== "other", b = v.groupId === null;
    if (f || b) {
      n.remove(), p = null, delete TYPO3.settings.FormEngine?.formName;
      return;
    }
    const w = v.groupId;
    w !== p && (p = w, c.disabled = !0, s.textContent = te(e, w) ?? "", gs(w).then(($) => {
      $ === null || w !== p || (r.replaceChildren(e.createRange().createContextualFragment($.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${d.area}="fields"]`)?.append(n), new qr().processItems([...$.scriptItems]));
    }));
  };
  h(y()), C(h, t);
}
async function gs(e) {
  return Pe(new H(I(O.other_permissions)).withQueryArguments({ group: e }).get());
}
const Nt = '.form-group:has(> select[name="_langSelector"])', ft = /* @__PURE__ */ new WeakMap();
function vs(e, t) {
  const n = e.querySelector(`.module-docheader ${Nt}`);
  n !== null && (ft.has(n) || ft.set(n, n.parentElement), t.after(n));
}
function bs(e) {
  const t = e.querySelector(`.module-docheader ${Nt}`);
  t !== null && ft.get(t)?.append(t);
}
const ws = (e) => `${e}, ${Nt}`, ys = ".module-docheader-navigation > .module-docheader-column-breadcrumb", ln = ".module-docheader-buttons .btn-toolbar > *", ks = ".t3js-editform-close", As = ws(`.${l.headButton}, .${l.showMenu}, .${l.typeSwitch}`), $s = 'form[name="editform"] h1';
function Ss(e, t) {
  let n = null;
  const r = (i) => {
    const { active: s, area: a } = y();
    return s && a === "fields" && i.querySelector(`[${d.token}]`) !== null;
  }, o = () => {
    if (n === null)
      return;
    const i = n, s = r(i);
    i.querySelectorAll(`.${l.headBar}, .${l.headButton}`).forEach((f) => {
      f.remove();
    });
    const a = i.querySelector(ks), c = y().face === "preview" ? a : null;
    if (i.querySelectorAll(ln).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches(As) && !f.contains(c));
    }), i.querySelectorAll($s).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${d.token}][${d.inside}='']:not([${d.outOfReach}])`) !== null;
    if (!u && y().face === "pick") {
      Se(i, () => {
        ue("preview");
      });
      return;
    }
    const p = y().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      L(i, l.faceEyebrow, g(p ? "platform.preview" : "platform.pick")),
      L(i, l.faceSentence, _(
        g(p ? "recordForm.previewFor" : "recordForm.pickFor"),
        te(e, y().groupId) ?? ""
      ))
    ), i.querySelector(ys)?.append(m), !p || !u)
      return;
    const h = Q(
      i,
      g("recordForm.add"),
      `btn btn-default btn-sm ${l.headButton}`,
      () => {
        Se(i, () => {
          ue("pick");
        });
      },
      "actions-check-square"
    );
    [...i.querySelectorAll(ln)].find((f) => f.contains(a))?.after(h);
  };
  D((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && kt(
      i.doc,
      t,
      () => y().face === "pick",
      () => {
        Se(i.doc, () => {
          ue("preview");
        });
      }
    );
  }, t), Y("fields-judged", o, t), C(o, t);
}
const cn = `[${d.token}]`;
function Es(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(cn)];
    Wt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(cn)];
      Cs(s, i) || (i = s, Wt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const Cs = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function qs(e, t) {
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
  r(), C(r, t);
}
const Ls = ar(["records"]);
function Ns(e, t) {
  let n = y().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && Ls.includes(je.App.getCurrentModule() ?? "");
  C(({ active: o }) => {
    o !== n && xr().then(() => {
      r() && Lr.ContentContainer.refresh();
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
const Os = ".module-docheader-buttons .btn-toolbar", un = "vperm.show", dn = "vperm.identify", pn = (e, t, n) => {
  if (n) {
    ie.set(e, t);
    return;
  }
  ie.unset(e);
}, fn = (e, t) => {
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
    return i && s === "fields" && o.querySelector(`[${d.token}]:not([${d.outOfReach}])`) !== null;
  }, r = () => {
    if (t === null)
      return;
    const o = t;
    if (o.querySelectorAll(`.${l.showMenu}`).forEach((c) => {
      c.remove();
    }), !n(o)) {
      o.body.removeAttribute(d.show), bs(o);
      return;
    }
    hn(o, ie.get(un) === "list"), mn(o, ie.get(dn) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(pr(o, "actions-filter"), ` ${g("recordForm.show")}`);
    const a = o.createElement("ul");
    a.className = "dropdown-menu", a.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      gn(o, g("recordForm.show.listOnly"), "actions-list", () => o.body.hasAttribute(d.show), (c) => {
        pn(un, "list", c), hn(o, c);
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      gn(o, g("recordForm.show.identifiers"), "actions-tag", () => o.body.hasAttribute(d.identify), (c) => {
        pn(dn, "said", c), mn(o, c);
      })
    ), i.append(s, a), o.querySelector(Os)?.append(i), vs(o, i);
  };
  D((o) => {
    t = o.doc, r();
  }, e), Y("fields-judged", r, e), C(r, e);
}
function mn(e, t) {
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
function pr(e, t) {
  const n = e.createElement("typo3-backend-icon");
  return n.setAttribute("identifier", t), n.setAttribute("size", "small"), n;
}
function hn(e, t) {
  if (!t) {
    e.body.removeAttribute(d.show);
    return;
  }
  e.body.setAttribute(d.show, "list");
}
function gn(e, t, n, r, o) {
  const i = e.createElement("button");
  i.type = "button", i.className = "dropdown-item dropdown-item-spaced";
  const s = e.createElement("span");
  s.className = "dropdown-item-status", i.append(s, pr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), fn(i, r());
  }), fn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function xs(e) {
  return tt.normalizedCtrlModifierKey === yn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function _t(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = xs(e), t.append(o);
    }
    tt.register(
      [tt.normalizedCtrlModifierKey, yn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Fs(e) {
  _t(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${d.toggle}]`), () => {
    if (y().active) {
      qn();
      return;
    }
    Cn();
  }, !0);
}
function Ts(e, t) {
  const n = e.querySelector(`[${d.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(y()), n.addEventListener("click", () => {
    if (y().active) {
      qn();
      return;
    }
    Cn();
  }, { signal: t }), C(r, t);
}
function Ms(e) {
  ur({
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
function Ot(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {
  }
}
const fr = 600, Is = 250, Ds = 2e3, Rs = 320, Pt = "vperm.arriving";
function Bs() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function mr(e, t, n) {
  if (!Bs()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  he(Pt, t), e.body.setAttribute(d.leaving, t), e.body.addEventListener("animationend", o, { once: !0 }), window.setTimeout(o, fr);
}
function Us(e) {
  e.body.setAttribute(d.settling, "");
}
function js(e) {
  const t = Ws();
  if (t === null)
    return;
  Ot(Pt), e.body.setAttribute(d.settling, ""), e.body.setAttribute(d.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(d.settling), e.body.removeAttribute(d.arriving), e.body.setAttribute(d.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(d.unwrapping);
    }, Rs));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, fr);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, Is);
  }, { signal: i.signal }), window.setTimeout(c, Ds);
}
function Ws() {
  return ge(Pt);
}
const hr = "vperm.viewing", gr = "vperm.seen", vr = "vperm.room";
function Ks(e) {
  he(hr, e);
}
function Gs(e) {
  he(vr, String(e));
}
function zs() {
  return ge(vr);
}
function Vs(e) {
  const t = ge(hr);
  t !== null && he(gr, JSON.stringify({
    ...xt(),
    [t]: { place: $n(e), document: bt(e) }
  }));
}
function Hs(e) {
  return kn(xt()[e]);
}
function Ys(e) {
  return An(xt()[e]);
}
function xt() {
  const e = ge(gr);
  return e === null ? {} : JSON.parse(e);
}
function Js(e, t) {
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
  const c = zs();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), Nn(e, a, t), o.addEventListener("click", () => {
    Vs(e), mr(e, "up", () => {
    });
  }, { signal: t }), _t(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Ft = "vperm.opening";
function br(e, t) {
  e !== "" && he(Ft, JSON.stringify({ record: e, screen: t }));
}
function Qs(e) {
  const t = Zs(), n = ae(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !Xs(t.screen, n, e.location.href) || (Ot(Ft), ea(e, n, t.record));
}
function Xs(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function Zs() {
  const e = ge(Ft);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function ea(e, t, n) {
  const r = await Rn(n, t);
  r !== "" && Or(e, r);
}
let Me = null;
function ta(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
async function wr() {
  const e = await new H(I(O.viewable_users)).get(Me === null ? {} : { headers: { "If-None-Match": Me.tag } }).catch(ta), t = e.raw();
  if (t.status === 304)
    return Me.users;
  const n = await e.resolve(), r = t.headers.get("ETag");
  return Me = r === null ? null : { tag: r, users: n }, n;
}
const na = {
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
}, mt = "vperm.returnTo", ht = "vperm.returning", ra = "vperm.userSearch";
function oa(e, t, n = na) {
  const r = de.get(mt), o = kn(r);
  return o !== "" && ia(o) ? (br(An(r), o), pe(mt, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (sa(e, t, n), !1);
}
function ia(e) {
  return ge(ht) === e ? !1 : (he(ht, e), !0);
}
function sa(e, t, n) {
  const r = e.querySelector(`[${d.viewAs}]`);
  if (r === null)
    return;
  const o = Tn(e, {
    totalOne: g("viewAsUser.total.one"),
    totalMany: g("viewAsUser.total.many"),
    take: g("viewAsUser.key.take"),
    detail: g("viewAsUser.key.detail"),
    loading: g("viewAsUser.loading"),
    failed: g("viewAsUser.failed")
  });
  o.remembers = ra, o.placeholder = g("viewAsUser.search"), o.addNew = { label: g("viewAsUser.new"), url: r.getAttribute(d.newRecord) ?? "" }, e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    yr(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    gt(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    wt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    gt(e, o), o.openedBy(r);
  }, { signal: t }), _t(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    aa(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function aa(e, t, n, r) {
  const o = await wr().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    gt(e, r), r.openedBy(n);
    return;
  }
  await yr(e, i, t);
}
async function gt(e, t) {
  t.state = "loading";
  const n = await wr().catch(() => null);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = Ke(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
  t.entries = [
    ...a.map((u) => vn(u, g("viewAsUser.recent"), i)),
    ...c.map((u) => vn(u, g("viewAsUser.all"), i))
  ];
}
function vn(e, t, n) {
  const r = e.groups.map((o) => ({ id: String(o), title: n[String(o)]?.title ?? "", depth: 0 })).filter((o) => o.title !== "").sort((o, i) => o.title.localeCompare(i.title));
  return {
    id: String(e.id),
    title: e.realName === "" ? e.username : e.realName,
    subtitle: e.realName === "" ? "" : e.username,
    note: la(r.length),
    detail: r,
    detailHeading: ca(r.length),
    heading: t
  };
}
function la(e) {
  return e === 0 ? "" : G("viewAsUser.groups", e, e);
}
function ca(e) {
  return e === 0 ? g("viewAsUser.detail.none") : G("viewAsUser.detail", e, e);
}
async function yr(e, t, n) {
  Ot(ht), Ks(String(t)), Gs(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await pe(mt, { place: $n(e), document: bt(e) });
  const r = Hs(String(t));
  br(Ys(String(t)), r), ua(t, n, r);
}
function ua(e, t, n) {
  _r(document), mr(document, "down", () => {
    t.handOver(I(O.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function bn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Rr(e.signal), Ur(document, e.signal), Ts(document, e.signal), Yr(document, e.signal), ls(e.signal), as(e.signal);
  const t = po();
  co(t, e.signal);
  const n = uo();
  bo(n, e.signal), ko(n, e.signal), _o(t, e.signal), Oo(e.signal), Zo(document, e.signal), Ei(document, e.signal), ni(e.signal), oi(e.signal), ai(e.signal), ci(e.signal), Yi(document, e.signal), qs(document, e.signal), Ns(document, e.signal), Zi(document, e.signal), es(document, e.signal), Fo(document, e.signal), _i(document, e.signal), hs(document, e.signal), ss(document, e.signal), Do(document, e.signal), Uo(e.signal), _s(document, e.signal), Ss(document, e.signal), Ps(e.signal), Ms(e.signal), ms(e.signal), Es(document, e.signal);
  const r = oa(document, e.signal);
  Js(document, e.signal), r ? Us(document) : (Qs(document), js(document)), Fs(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", bn, { once: !0 }) : bn();
//# sourceMappingURL=main.js.map
