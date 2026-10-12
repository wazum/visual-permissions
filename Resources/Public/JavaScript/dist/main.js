import fe from "@typo3/backend/storage/persistent.js";
import Y from "@typo3/core/ajax/ajax-request.js";
import Sr from "@typo3/backend/login-refresh.js";
import Re from "@typo3/backend/notification.js";
import { sudoModeInterceptor as Er } from "@typo3/backend/security/sudo-mode-interceptor.js";
import { LitElement as Cr, html as I } from "lit";
import { ModuleStateStorage as wn } from "@typo3/backend/storage/module-state-storage.js";
import It from "@typo3/backend/modal.js";
import { FileStorageTree as qr } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as Lr } from "@typo3/backend/tree/page-tree.js";
import je from "@typo3/backend/module-menu.js";
import ae from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as Nr } from "@typo3/core/java-script-item-processor.js";
import Or from "@typo3/backend/viewport.js";
import nt, { ModifierKeys as yn } from "@typo3/backend/hotkeys.js";
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
}, le = {
  folderTree: "vperm-folder-tree",
  pageTree: "vperm-page-tree",
  picker: "vperm-picker"
};
function _r(e) {
  return e.body.hasAttribute(d.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function Pr(e) {
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
function Tr(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(bt(e)));
}
function $n(e) {
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
    _r(n) || await fe.set(e, t);
  });
  return rt = r.catch(() => {
  }), r;
}
function Fr() {
  return rt;
}
const Sn = "vperm.session", En = 1, we = "modules", Mr = "fields", ot = /* @__PURE__ */ new Set();
let F = Br();
document.addEventListener("typo3-module-loaded", () => {
  We({ ...F, face: "preview" });
});
function y() {
  return F;
}
function q(e, t) {
  ot.add(e), t?.addEventListener("abort", () => ot.delete(e));
}
function Cn() {
  const e = F.groupId !== null, t = e ? Mr : F.area;
  he({ ...F, active: e, open: F.open || e, area: t, picked: t });
}
function Ir() {
  he({ ...F, open: !0 });
}
function Rr() {
  he({ ...F, open: !1, active: !1 });
}
function qn() {
  he({ ...F, active: !1 });
}
function Ln(e) {
  he({ ...F, area: e, picked: e, face: "preview" });
}
function Dr(e) {
  We({ ...F, area: e });
}
function pe(e) {
  We({ ...F, face: e });
}
function yt(e) {
  he({ ...F, groupId: e, active: F.active && e !== null });
}
function he(e) {
  me(Sn, {
    version: En,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), We(e);
}
function We(e) {
  F = e;
  for (const t of ot)
    t(F);
}
function Br() {
  const e = fe.get(Sn);
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
function Ur(e) {
  const t = () => {
    Rt(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && Rt(n);
  };
  t(), q(t, e);
}
function Rt(e) {
  const t = y();
  if (e.toggleAttribute(d.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(d.active, t.active), !t.active) {
    e.removeAttribute(d.picked), e.removeAttribute(d.face);
    return;
  }
  e.setAttribute(d.picked, t.area), e.setAttribute(d.face, t.face);
}
const jr = (e) => `${e}, .scaffold-modulemenu`;
function Nn(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(jr(".scaffold-sidebar"));
  if (r == null || o === null)
    return;
  const i = () => {
    r.style.flexBasis = "";
    const a = On(e), c = Number.parseFloat(getComputedStyle(t).marginInlineStart), u = o.getBoundingClientRect().right - a - r.getBoundingClientRect().left - c;
    u > 0 && (r.style.flexBasis = `${String(u)}px`);
  };
  i();
  const s = new ResizeObserver(i);
  s.observe(o), n.addEventListener("abort", () => {
    s.disconnect();
  });
}
const On = (e) => Number.parseFloat(getComputedStyle(e.body).getPropertyValue("--vperm-divider")) || 0;
function Wr(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${d.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), Nn(e, r, t);
  const o = e.querySelector(`[${d.toolbar}]`), i = () => y().open || y().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), q(s, t), o?.addEventListener("click", () => {
    i() ? Rr() : Ir(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
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
  groups: "visual_permissions_groups",
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
function R(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
function g(e) {
  return TYPO3.lang[e] ?? "";
}
let it = 0;
async function re(e, t, n = () => {
}) {
  return it += 1, new Y(R(e)).addMiddleware(Er).post(t).then(async (r) => {
    const o = Dt(r);
    return o === "taken" && r.raw().status === 200 && n(await r.resolve()), o;
  }, Dt).finally(() => {
    it -= 1;
  });
}
function kt() {
  return it > 0;
}
function Dt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (Sr.checkActiveSession(), "loggedOut") : Gr(t.status);
  } catch {
    return "failed";
  }
}
function Gr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function Ge(e, t = []) {
  return Pe(new Y(R(_.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function Ke() {
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
async function _n(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await (await new Y(R(_.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()).resolve()).url ?? "";
}
function Kr(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
function Pn(e) {
  let t = null;
  return async () => {
    const n = await new Y(R(e)).get(t === null ? {} : { headers: { "If-None-Match": t.tag } }).catch(Kr), r = n.raw();
    if (r.status === 304)
      return t.value;
    const o = await n.resolve(), i = r.headers.get("ETag");
    return t = i === null ? null : { tag: i, value: o }, o;
  };
}
async function Pe(e) {
  try {
    return await (await e).resolve();
  } catch {
    return Re.error(g("platform.notRead")), null;
  }
}
function ze(e) {
  return JSON.parse(e.querySelector(`[${d.groups}]`)?.getAttribute(d.groups) ?? "{}");
}
const zr = Pn(_.groups);
async function xn(e) {
  const t = await zr().catch(() => null);
  t !== null && e.querySelector(`[${d.groups}]`)?.setAttribute(d.groups, JSON.stringify(t));
}
function oe(e, t) {
  return ze(e)[String(t)]?.title ?? null;
}
const Tn = 220, Vr = 1300;
function Oe(e, t) {
  const n = e.ownerDocument, r = n.createElement("span");
  r.className = l.faceTally;
  const o = L(n, l.faceCounted, ""), i = L(n, l.faceWaiting, "");
  r.append(o, i);
  const s = X(n, g("platform.cancel"), `btn btn-default ${l.faceCancel}`, t.cancel), a = X(n, t.label, `btn btn-primary ${l.faceApply}`, t.apply);
  return e.replaceChildren(r, s, a), {
    state: o,
    waiting: i,
    ready: (c, u, p = c) => {
      if (a.toggleAttribute("disabled", !c), s.toggleAttribute("disabled", !u), !u || p) {
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
function At(e, t) {
  t !== "cancelled" && (e.state.textContent = g(`platform.${t}`));
}
function Fn(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = L(e, l.faceEyebrow, ""), o = L(e, l.faceSentence, ""), i = e.createElement("div");
  i.className = l.faceBar, i.append(r, o);
  const s = e.createElement("div");
  s.className = l.faceScroll;
  const a = e.createElement("div");
  return a.className = l.faceFoot, n.append(i, s, a), { sheet: n, bar: i, eyebrow: r, sentence: o, scroll: s, foot: a };
}
function Mn(e) {
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
        }, Vr));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function In(e, t, n) {
  q(() => {
    y().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function $t(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !Hr(e) && r();
  }, { signal: t });
}
const Hr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
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
function G(e, t, ...n) {
  return N(g(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function N(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, String(r)).replace("%s", String(r)),
    e
  );
}
const Bt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Yr(e, t, n, r) {
  const o = [e];
  let i = Bt(r, e) ? 2 : 0, s = e + 1;
  for (let a = 1; a < t.length; a += 1) {
    const c = n.indexOf(t.charAt(a), s);
    if (c === -1)
      return null;
    c === s && (i += 4), Bt(r, c) && (i += 2), o.push(c), s = c + 1;
  }
  return { score: e === 0 ? i + 2 : i, at: o };
}
function Ut(e, t) {
  if (e === "")
    return { score: 0, at: [] };
  const n = e.toLowerCase(), r = t.toLowerCase(), o = n.charAt(0);
  let i = null;
  for (let s = r.indexOf(o); s !== -1; s = r.indexOf(o, s + 1)) {
    const a = Yr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const jt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Jr = 70, Je = 50;
class Qr extends Cr {
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
      score: Ut(this.query, jt(n))?.score ?? -1
    })).filter((n) => n.score >= 0).sort((n, r) => n.band - r.band || r.score - n.score).map((n) => n.entry);
  }
  get found() {
    return this.matching.slice(0, Je);
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
        ${this.addNewLink()}
      </div>
      <div class=${l.pickerPanes}>
      <div class=${l.pickerList} role="listbox" tabindex="-1">
        ${this.nothingToShow(t)}
        ${this.state !== "ready" ? "" : t.map((n, r) => {
      const o = Ut(this.query, jt(n))?.at ?? [];
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
    n.searchParams.set("returnUrl", ce(this.ownerDocument)?.getAttribute("endpoint") ?? ""), t.href = n.href, wn.update("web", 0, !0), this.hidePopover();
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
    return t <= Je ? (t === 1 ? this.words.totalOne : this.words.totalMany).replace("%d", String(t)) : this.words.countMany.replace("%d", String(Je)).replace("%d", String(t));
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
    }, Jr));
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
customElements.get(le.picker) === void 0 && customElements.define(le.picker, Qr);
function Rn(e, t) {
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
const Xr = "vperm.groupSearch", Dn = "vperm.recentGroups", Zr = 3;
function eo(e, t) {
  const n = e.querySelector(`[${d.group}]`);
  if (n === null)
    return;
  const r = Rn(e, {
    totalOne: g("pickAGroup.total.one"),
    totalMany: g("pickAGroup.total.many"),
    take: g("pickAGroup.key.take"),
    detail: g("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  let o = to(e);
  r.entries = Qe(e, o), r.remembers = Xr, r.placeholder = g("pickAGroup.search"), r.addNew = { label: g("pickAGroup.new"), url: n.getAttribute(d.newRecord) ?? "" }, e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n), xn(e).then(() => {
      r.entries = Qe(e, o);
    });
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = oe(e, y().groupId) ?? i;
  };
  s(), q(s, t), q(() => {
    const { groupId: u } = y();
    u !== null && o[0] !== u && (o = [u, ...o.filter((p) => p !== u)], me(Dn, o)), r.entries = Qe(e, o);
  }, t);
  const c = (u) => {
    yt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function to(e) {
  const t = ze(e);
  return [fe.get(Dn)].flat().map(String).filter((n) => n in t).map(Number);
}
function Qe(e, t) {
  const n = Object.entries(ze(e)), r = t.filter((s) => s !== y().groupId).slice(0, Zr), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
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
    note: no(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: g(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function no(e) {
  return e === 0 ? "" : G("pickAGroup.inherits", e, e);
}
const Bn = (e) => `vperm:${e}`;
function Z(e, t) {
  document.dispatchEvent(new CustomEvent(Bn(e), { detail: t }));
}
function J(e, t, n) {
  document.addEventListener(
    Bn(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function ro() {
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
const Un = ro();
function D(e, t) {
  Un.listen(e, t);
}
function Gt(e) {
  Un.tell(e);
}
const St = ["allowed", "allowedAndInherited", "inherited"], oo = ["allowed", "denied"], ee = "allowed", ge = "denied", Ve = "inherited", Et = "allowedAndInherited", He = "adminOnly";
function U(e) {
  return St.some((t) => t === e);
}
const io = [...St, ge];
function Ct(e) {
  return oo.includes(e);
}
function De(e) {
  return e.substring(0, e.indexOf(":"));
}
function so(e) {
  return e.substring(e.indexOf(":") + 1);
}
const ne = {};
function ao(e, t) {
  ne.tables = e, t.addEventListener("abort", () => {
    delete ne.tables;
  });
}
function lo(e, t) {
  ne.fields = e, t.addEventListener("abort", () => {
    delete ne.fields;
  });
}
function co(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${d.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(d.unseen);
  });
  const { active: n, area: r, face: o } = y();
  !n || r !== "fields" || (ne.tables?.hide(e, t, o), ne.fields?.hide(e, t, o), Kt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${d.verdict}]`)].some((a) => a.closest(`[${d.unseen}]`) === null) || $e(i);
  }), Kt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${d.unseen}])`) === null && ($e(i), $e(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), uo(e), o === "preview" && po(e, t));
}
function $e(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(d.unseen, "");
}
function Kt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${d.verdict}]`)?.querySelector(`[${d.verdict}]`) !== null);
}
function uo(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(d.unseen) === !0 && e.querySelector(`.nav-item:not([${d.unseen}]) [data-typo3-tab]`)?.click();
}
function po(e, { tables: t, named: n }) {
  if (e.querySelector(`.form-section:not([${d.unseen}])`) !== null)
    return;
  const r = fo(e), o = t[r], s = (U(o) ? ne.fields : ne.tables)?.explain(e, r, o, n[r] ?? r);
  s !== void 0 && (s.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(s));
}
function fo(e) {
  const n = e.querySelector(`[${d.token}][${d.inside}='']`)?.getAttribute(d.token) ?? "";
  return De(n);
}
function mo(e, t) {
  let n = null;
  const r = Ke();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null;
  const i = () => {
    n !== null && co(n.doc, { tables: o?.targets ?? {}, named: o?.named ?? {} });
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
    const m = [...new Set(c.map(([, f]) => De(f)))], h = await r.inspect(p, m);
    if (h === null)
      return;
    const { scopes: v } = h;
    e.take(h), c.forEach(([f, b]) => {
      const w = v.fields.targets[b];
      w !== void 0 && f.setAttribute(d.verdict, w), f.toggleAttribute(d.outOfReach, !U(v.tablesModify.targets[De(b)]));
    }), o = v.tablesModify, i(), Z("fields-judged", {});
  };
  D(({ doc: c, fields: u }) => {
    r.drop(), c.body.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`);
    const p = u.flatMap((m) => {
      const h = m.getAttribute(d.token);
      return h === null ? [] : [[m, h]];
    });
    n = p.length === 0 ? null : { doc: c, fields: p }, o = null, s();
  }, t), J("permissions-written", () => void s(), t);
  let a = null;
  q(({ active: c, groupId: u }) => {
    const p = `${String(c)}:${String(u)}`;
    if (p === a) {
      i();
      return;
    }
    a = p, s();
  }, t);
}
function ho() {
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
function go() {
  let e = [], t = {};
  return {
    allowedBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.allowedBy;
    }
  };
}
const jn = (e) => e.map((t) => `[${d.verdict}='${t}']:not([${d.outOfReach}])`).join(","), vo = (e) => jn(e === "pick" ? io : St), st = (e) => jn([e === "pick" ? ge : ee]), bo = `.${l.anchor}[${d.verdict}]`, wo = (e, t, n) => {
  const r = U(e.getAttribute(d.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(vo(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(st(n)),
    waiting: t ? g(n === "pick" ? "platform.toAllow" : "allowFields.toDisallow") : ""
  };
}, yo = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function ko(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(d.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (yo(n), t.waiting === "") {
      n.removeAttribute(d.waiting);
      return;
    }
    n.setAttribute(d.waiting, t.waiting);
  }
}
function Ao(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = y();
    n.querySelectorAll(bo).forEach((a) => {
      ko(a, wo(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabAllow}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const p = () => [...c.querySelectorAll(`[${d.inside}='']`)].filter((h) => h.matches(st(a)) && !e.has(h)), m = u ?? i(s, c, p);
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
      const p = u.target, m = p.closest(`.${l.mark}`) === null ? p.closest(st(y().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), J("fields-judged", r, t), q(r, t);
}
async function $o(e, t) {
  return re(_.allow_fields, { group: e, operations: [...t] });
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
const Vt = `[${d.verdict}]:not([${d.outOfReach}])`, So = [ge, He].map((e) => `:not([${d.verdict}='${e}'])`).join("");
function Eo(e, t) {
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
        const w = h().map((k) => ({ field: k.getAttribute(d.token) ?? "", allow: c }));
        kt() || $o(u, w).then((k) => {
          if (y().groupId !== u) {
            k === "taken" && Z("permissions-written", {});
            return;
          }
          if (k !== "taken") {
            At(f, k), p = w.length;
            return;
          }
          e.drop(), v(), Z("permissions-written", {});
        });
      }
    }), b = () => {
      const w = [...a.querySelectorAll(Vt)].filter((x) => x.closest(`.${l.otherKinds}`) === null), k = w.filter((x) => x.matches(So)), P = h().length;
      p !== P && (p = null, f.state.textContent = G("allowFields.tally", w.length, k.length, w.length), f.waiting.textContent = P === 0 ? "" : G(`allowFields.${c ? "waiting" : "going"}`, P, P), f.ready(P > 0, c || P > 0));
    };
    return b(), a.append(m), b;
  }, s = () => {
    r?.showCount();
  };
  D((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), J("fields-judged", o, t), q(o, t);
}
const Co = `.${l.anchor}[${d.verdict}]`, qo = 350, Lo = 250, at = (e) => e.getAttribute(d.verdict) ?? "", No = (e) => e.getAttribute(d.token) ?? "", Oo = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), lt = (e) => g(`allowFields.mark.${e}.title`), _o = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return y().face === "pick" ? g(t ? "allowFields.hint.leave" : "allowFields.hint.allow") : g(t ? "allowFields.hint.keep" : "allowFields.hint.disallow");
};
function Po(e, t) {
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
function xo(e, t, n) {
  const r = e.ownerDocument, o = at(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = lt(o);
  const a = r.createElement("p");
  a.textContent = g(`allowFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...Po(e, n));
  const p = _o(t);
  if (p !== "") {
    const m = r.createElement("footer");
    m.textContent = p, e.append(m);
  }
}
function To(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (h) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      h.hidePopover();
    }, Lo);
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
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = h, h.style.setProperty("anchor-name", "--vperm-mark"), h.setAttribute("aria-expanded", "true"), xo(f, v, e.allowedBy(No(v))), f.showPopover();
  }, m = () => {
    n.querySelectorAll(Co).forEach((h) => {
      const v = Oo(h);
      if (v === null)
        return;
      const f = v.querySelector(`.${l.mark}`);
      if (f !== null) {
        f.setAttribute("aria-label", lt(at(h)));
        return;
      }
      const b = v.ownerDocument.createElement("button");
      b.type = "button", b.className = l.mark, b.setAttribute("aria-label", lt(at(h))), b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-controls", l.markCard), b.setAttribute("aria-expanded", "false"), b.addEventListener("click", (w) => {
        p(b, h), w.detail === 0 && u(b.ownerDocument).querySelector("button")?.focus();
      }), b.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          p(b, h);
          return;
        }
        r = window.setTimeout(() => {
          p(b, h);
        }, qo);
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
function Fo(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      Mo(r);
    });
  };
  D((r) => {
    t = r.doc, n();
  }, e), J("fields-judged", n, e);
}
function Mo(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${d.token}]:not([${d.outOfReach}])`) === null);
}
const Io = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Te = (e) => `${e}, ${Io[e]}`, Wn = [
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
function Ht(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(d.area), t.removeAttribute(d.ground);
  });
}
function Gn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Ro(e, t) {
  const n = (i) => {
    if ((i.active ? oe(e, i.groupId) : null) === null) {
      Ht(e);
      return;
    }
    const a = Wn.flatMap((c) => {
      const u = Gn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Ht(e), a.forEach(({ element: c, key: u, ground: p }) => {
      c.classList.add(l.frame), c.setAttribute(d.area, u), c.setAttribute(d.ground, p), Bo(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Do(e) && n(y());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(y()), q(n, t);
}
function Do(e) {
  return Wn.some((t) => {
    const n = Gn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(d.area) !== t.key);
  });
}
function Bo(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const Uo = "typo3-backend-contextual-record-edit-trigger";
function jo(e, t) {
  let n = null;
  const r = (p) => {
    const m = p.target.closest(Uo);
    !y().active || m === null || (p.preventDefault(), p.stopPropagation(), ce(e)?.setAttribute("endpoint", m.getAttribute("edit-url") ?? ""));
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
  }, t), q(u, t);
}
const Wo = ".module-docheader-buttons .btn-toolbar", Go = (e, t) => {
  e.location.assign(t);
};
function Ko(e, t = Go) {
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
        const [f, b, w] = u.name.slice(5, -1).split("]["), k = new URL(i.URL), P = String(b).startsWith("NEW") ? `defVals[${String(f)}][${String(w)}]` : `vperm[value][${String(f)}][${String(b)}][${String(w)}]`;
        k.searchParams.set(P, v.value), t(i, k.toString());
      }), p.append(h, v), i.querySelector(Wo)?.append(p);
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
    w.append(...v.map((k) => Vo(k, n.has(k.value), o.has(k.value)))), f.append(b, w), i.append(f);
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
  }, p = It.advanced({
    title: N(e.title, t),
    content: i,
    size: It.sizes.large,
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
    s.textContent = zo(v, h.length - v), m();
  });
}
function zo(e, t) {
  return [
    ...e > 0 ? [N(g("platform.waiting"), e)] : [],
    ...t > 0 ? [N(g("platform.going"), t)] : []
  ].join(`
`);
}
function Vo({ value: e, label: t, icon: n }, r, o) {
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
  return re(_.allow_modules, { group: e, operations: [...t] }, (n) => {
    n.alsoAllowed.forEach((r) => {
      Re.info(N(g("allowModules.alsoAllowed"), r));
    });
  });
}
async function Ho(e, t) {
  const n = await Ge(e);
  if (n === null)
    return;
  const r = await Pe(new Y(R(_.modules_outside_menu)).get());
  if (r === null)
    return;
  const o = new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => U(i)).map(([i]) => i));
  qt(r, t, o, async (i) => await Kn(e, i.map(({ value: a, allow: c }) => ({ module: a, allow: c }))) !== "taken" ? !1 : (Z("permissions-written", {}), !0), new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => i === Ve).map(([i]) => i)));
}
const zn = "data-modulemenu-identifier", Be = `[${zn}]:not([aria-controls])`, Vn = ".modulemenu-group-container";
let ye = !1;
const ct = /* @__PURE__ */ new WeakMap();
let de = null;
const ke = Mn(560);
function Yo(e, t, n) {
  const r = y().groupId, o = oe(e, r) ?? "", i = [...t.querySelectorAll(Be)], s = i.filter((A) => U(Q(A))), a = i.filter((A) => Q(A) === ee), c = Yt(e, l.facePreview, g("platform.preview"), N(g("allowModules.previewFor"), o)), u = Yt(e, l.facePick, g("platform.pick"), N(g("allowModules.pickFor"), o)), m = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  m.className = l.coin, m.replaceChildren(c.sheet, u.sheet);
  const v = e.querySelector(`.${l.allowed}`) ?? e.createElement("div");
  v.className = l.allowed, m.parentElement !== v && v.replaceChildren(m);
  const f = Qo(e, t);
  v.parentElement !== f && f.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    f.classList.add(l.panelCardTurned);
  });
  const b = (A) => {
    ye = A, m.classList.toggle(l.coinTurned, A), c.sheet.toggleAttribute("inert", A), u.sheet.toggleAttribute("inert", !A);
  }, w = (A) => {
    const E = A.filter((O) => O.allow).map((O) => O.module);
    r !== null && y().groupId === r && (kt() || (E.forEach((O) => {
      ke.add(O);
    }), Kn(r, A).then((O) => {
      if (O !== "taken") {
        E.forEach((j) => {
          ke.delete(j);
        }), At(ye ? x : k, O);
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
  }), P = () => {
    Jt(u.scroll, t, T), T(), b(!1);
  }, x = Oe(u.foot, {
    label: g("platform.doAllow"),
    cancel: P,
    apply: () => {
      const A = Qt(u.scroll).filter((E) => Q(E) !== ct.get(E));
      w(A.map((E) => ({ module: Fe(E), allow: !0 })));
    }
  }), T = () => {
    const A = Qt(u.scroll), E = A.filter((M) => Q(M) !== ct.get(M)), O = A.filter((M) => U(Q(M)) && !E.includes(M)).length, j = G("allowModules.tally", A.length, O, A.length);
    K.textContent = j;
    const W = Xe(c.scroll);
    k.state.textContent = W.length === 0 ? j : G("allowModules.marked", a.length, W.length, a.length);
    const $ = W.map(Fe), C = n.filter(({ verdict: M, parent: te }) => U(M) && $.includes(te)).map(({ label: M }) => N(g("allowModules.alsoRemoved.name"), M));
    k.waiting.textContent = C.length === 0 ? "" : G("allowModules.alsoRemoved", C.length, C.join(", ")), k.ready(W.length > 0, W.length > 0), x.state.textContent = "", x.waiting.textContent = E.length === 0 ? "" : N(g("platform.waiting"), E.length), x.ready(E.length > 0, !0);
  };
  c.bar.append(
    X(e, g("allowModules.allow"), "btn btn-default", () => {
      b(!0);
    }),
    L(e, l.faceHint, g("allowModules.hint"))
  );
  const H = e.createElement("div");
  H.className = l.faceChoice;
  const K = L(e, l.faceCounted, "");
  H.append(K), H.append(X(e, g("allowModules.outside"), "btn btn-default", () => {
    r !== null && Ho(r, o);
  }));
  const S = n.filter(({ verdict: A }) => U(A)).length;
  H.append(L(e, l.faceCounted, G("allowModules.outside.tally", n.length, S, n.length))), u.sheet.insertBefore(H, u.foot), u.scroll.style.setProperty("--vperm-queued-note", `"${g("platform.toAllow")}"`), Xo(e, c.scroll, s, g("platform.from"), T), Jt(u.scroll, t, T), T(), b(ye), ke.start(() => {
    m.querySelectorAll(`.${l.facePreview} ${Be}`).forEach((A) => {
      A.classList.toggle(l.justAdded, ke.isLit(Fe(A)));
    });
  }), de?.abort(), de = new AbortController(), $t(e, de.signal, () => ye, P), In(r, [k, x], de.signal);
}
function Jo(e, t) {
  de?.abort(), de = null, ye = !1, ke.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.allowed}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, Tn);
  }));
}
function Qo(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Yt(e, t, n, r) {
  const o = Fn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function Xo(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(Vn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(L(e, l.allowedGroup, a)));
    const c = ti(s);
    c.getAttribute(d.verdict) === ee ? Yn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(L(e, l.allowedFrom, r)), t.append(c);
  });
}
function Jt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(Vn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(Be).forEach((r) => {
    Hn(r), ct.set(r, Q(r)), U(Q(r)) && r.setAttribute("aria-disabled", "true"), Yn(r, () => {
      ei(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(L(r.ownerDocument, l.allowedGroup, r.getAttribute("title") ?? ""));
  });
}
function Zo(e) {
  const t = Q(e);
  return e.getAttribute("aria-disabled") === "true" || !Ct(t) ? "" : U(t) ? "unpick" : "allow";
}
function ei(e) {
  const t = Zo(e);
  t !== "" && e.setAttribute(d.verdict, t === "allow" ? ee : ge);
}
function Hn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function ti(e) {
  const t = e.cloneNode(!0);
  return Hn(t), t;
}
function Yn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function Xe(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function Qt(e) {
  return [...e.querySelectorAll(Be)].filter((t) => Ct(Q(t)));
}
const Q = (e) => e.getAttribute(d.verdict) ?? "", Fe = (e) => e.getAttribute(zn) ?? "", Ze = "#modulemenu", Jn = "data-modulemenu-identifier", ni = `[${Jn}]:not([aria-controls])`;
function ri(e, t) {
  const n = Ke();
  let r = null;
  const o = async () => {
    const { active: s, groupId: a, area: c } = y();
    if (!s || a === null || c !== "modules") {
      n.drop(), e.querySelectorAll(`${Ze} [${d.verdict}]`).forEach((f) => {
        f.removeAttribute(d.verdict);
      }), i(e);
      return;
    }
    const u = e.querySelector(Ze);
    if (u === null)
      return;
    const p = [...u.querySelectorAll(ni)];
    if (p.length === 0)
      return;
    const m = await n.inspect(a);
    if (m === null)
      return;
    const { scopes: h } = m;
    Object.entries(h.modules.targets).forEach(([f, b]) => {
      p.filter((w) => w.getAttribute(Jn) === f).forEach((w) => {
        w.setAttribute(d.verdict, b);
      });
    }), r ??= Pe(new Y(R(_.modules_outside_menu)).get());
    const v = await r;
    if (v === null) {
      r = null;
      return;
    }
    Yo(e, u, v.groups.flatMap(({ values: f }) => f.map(({ value: b, label: w, parent: k }) => ({
      verdict: h.modules.targets[b],
      parent: k,
      label: w
    }))));
  }, i = (s) => {
    const a = s.querySelector(Ze);
    a !== null && Jo(s, a);
  };
  o(), J("permissions-written", () => void o(), t), q(() => void o(), t);
}
async function oi(e, t, n) {
  const r = await re(_.allow_tables, { group: e, operations: [{ table: t, allow: n }] });
  return r === "taken" && Z("permissions-written", {}), r;
}
function Qn(e, { groupId: t, table: n, called: r, verdict: o }) {
  const i = o === ee, s = o === Ve || o === Et, a = o === He, c = e.createElement("div");
  c.className = `callout callout-notice callout-sm ${l.tableGate}`, c.append(L(e, l.tableName, r)), c.append(L(e, l.tableToken, n));
  const u = L(e, "callout-body", g(ii(o)));
  if (c.append(u), !s && !a) {
    const p = X(
      e,
      N(g(i ? "allowTables.disallow" : "allowTables.allow"), r),
      `btn btn-default btn-sm ${i ? l.tableDisallow : l.tableAllow}`,
      () => {
        p.toggleAttribute("disabled", !0), oi(t, n, !i).then((m) => {
          p.toggleAttribute("disabled", !1), m !== "taken" && m !== "cancelled" && (u.textContent = g(`platform.${m}`));
        });
      }
    );
    c.append(p);
  }
  return c;
}
function ii(e) {
  return e === ee ? "allowTables.theirs" : e === He ? "allowTables.adminOnly" : e === Et ? "allowTables.alsoInherited" : e === Ve ? "allowTables.inherited" : "allowTables.missing";
}
const Xt = ".typo3-TCEforms";
function si(e) {
  let t = null;
  const n = Ke(), r = async () => {
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
      b !== null && u.set(b, De(w));
    });
    const p = await n.inspect(c, [...new Set(u.values())]);
    if (p === null)
      return;
    const { named: m, targets: h } = p.scopes.tablesModify;
    u.forEach((v, f) => {
      const b = h[v];
      if (![ee, Ve, Et, ge].some((P) => P === b))
        return;
      const w = Qn(o, { groupId: c, table: v, called: m[v] ?? v, verdict: b }), k = f.matches(Xt) ? null : f.querySelector(".form-irre-object");
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
const ai = ".form-group";
function Xn(e) {
  return e.closest(ai);
}
function li(e) {
  ao({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !U(s)).forEach(([s]) => {
        t.querySelectorAll(`[${d.token}^='${s}:']`).forEach((a) => {
          $e(a.closest(i) ?? Xn(a) ?? a);
        }), o === "preview" && ci(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o) => Qn(t, { groupId: y().groupId ?? 0, table: n, called: o, verdict: r })
  }, e);
}
function ci(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${d.token}^='${t}:']:not([${d.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(d.inside) ?? "", s = e.querySelector(`[${d.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(L(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      N(g("allowTables.gone"), n)
    ));
  });
}
async function ui(e, t, n) {
  return re(e === "pageTypes" ? _.allow_page_types : _.allow_values, {
    group: t,
    operations: [...n]
  });
}
function di(e) {
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
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = g(`allowedValues.choose.${so(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(d.choices) ?? "{}"), u = y().groupId ?? 0;
        Ge(u).then((p) => {
          if (p === null)
            return;
          const m = i.getAttribute(d.allows) === "pageTypes" ? "pageTypes" : "fieldValues", h = m === "pageTypes" ? "" : `${s}:`, v = new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => U(f)).map(([f]) => f.substring(h.length)));
          qt(c, oe(document, u) ?? "", v, async (f) => await ui(m, u, f.map(({ value: w, allow: k }) => ({ value: `${h}${w}`, allow: k }))) !== "taken" ? !1 : (Z("permissions-written", {}), !0), new Set(Object.entries(p.scopes[m].targets).filter(([, f]) => U(f) && f !== ee).map(([f]) => f.substring(h.length))));
        });
      }), i.after(a);
    });
  };
  D((r) => {
    t = r.doc, n();
  }, e), q(n, e);
}
const pi = `[${d.verdict}='${ge}'], [${d.verdict}='${He}']`;
function fi(e) {
  lo({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(pi).forEach((o) => {
        $e(Xn(o) ?? o);
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
async function mi(e, t) {
  const n = await Ge(e);
  if (n === null)
    return;
  const r = await Pe(new Y(R(_.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  qt(r, t, o, async (i) => await re(_.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (Z("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== ee).map(([i]) => i)));
}
const Zn = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: le.folderTree,
  base: qr,
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
  write: async (e, t, n, r) => re(_.mount_folders, {
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
      mi(t, oe(e, t) ?? "");
    }
  )
}, er = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: le.pageTree,
  base: Lr,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => ({ ...await (await new Y(R("page_tree_browser_configuration")).get()).resolve(), rootlineUrl: R("page_tree_rootline") }),
  write: async (e, t, n) => re(_.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function hi(e, t) {
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
function gi(e) {
  const t = /* @__PURE__ */ new Map();
  return tr(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function vi(e, t) {
  const n = tr(e);
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
const tr = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ee = Mn(520), B = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), Ue = /* @__PURE__ */ new Set(), ut = /* @__PURE__ */ new Set(), nr = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, rr = (e) => V.has(e) && !Ue.has(e), or = (e) => e.__parents ?? [], Ce = (e) => or(e).some((t) => V.has(t)), bi = (e, t) => t.some((n) => V.has(n.identifier) && or(n).includes(e.identifier)), ir = (e) => e.detail;
function wi(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = ir(o);
    s === !1 || nr(i.identifier) || V.has(i.identifier) || Ce(i) || (z.has(i.identifier) ? z.delete(i.identifier) : z.add(i.identifier), t(), et(Ie(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Ie(e);
    o !== null && (!_e.has(o) || e.querySelector(".node[data-id='0']") !== null) && et(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), et(Ie(e));
}
function yi(e) {
  const t = Ie(e);
  if (t === null)
    return;
  const n = _e.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), _e.delete(t), t.requestUpdate());
}
function et(e) {
  if (e !== null) {
    if (Zt(e.nodes), !_e.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      _e.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => Zt(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return V.has(r.identifier) && o.push(l.mountAlready), z.has(r.identifier) && o.push(l.mountPicked), nr(r.identifier) && o.push(l.mountWhole), o;
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
const _e = /* @__PURE__ */ new WeakMap(), Ie = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let tt = "", en = () => {
};
async function ki(e, t, n, { groupId: r, kind: o, showCount: i }) {
  en = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), tt = s;
    return;
  }
  const a = o.tree;
  if (Ai(a, o.base), t.querySelector(a) !== null && tt === s)
    return;
  const u = await o.rootedAt(r), p = e.createElement(a);
  p.addEventListener("mousedown", (h) => {
    const v = h.target instanceof Element ? h.target.closest(".node") : null;
    v !== null && (rr(v.getAttribute("data-id") ?? "") || h.preventDefault());
  }), p.addEventListener("typo3:tree:node-selected", (h) => {
    h.stopPropagation();
    const { node: v, propagate: f } = ir(h);
    f !== !1 && (B.has(v.identifier) ? B.delete(v.identifier) : B.add(v.identifier), dt(e), en());
  }), Object.assign(p, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(p), t.replaceChildren(m), tt = s, Object.assign(p, { setup: u });
}
function dt(e) {
  e.querySelector(
    `.${l.facePreview} :is(${le.pageTree}, ${le.folderTree})`
  )?.requestUpdate();
}
function Ai(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return rr(n.identifier);
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
      tn(this.nodes);
    }
    prepareNodes(n) {
      return tn(super.prepareNodes(n));
    }
    hideChildren(n) {
      !Ce(n) && !V.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return Ce(n) && r.push(l.mountInside), !Ce(n) && !V.has(n.identifier) && r.push(l.mountContext), Ue.has(n.identifier) && r.push(l.mountInherited), B.has(n.identifier) && r.push(l.faceMarked), ut.has(n.identifier) && r.push(l.mountUnseen), Ee.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function tn(e) {
  return e.forEach((t) => {
    Ce(t) || V.has(t.identifier) || (t.__expanded = !0, t.__hidden = !bi(t, e));
  }), e;
}
function $i(e, t, n, r) {
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
    }), h.setAttribute("aria-label", N(o("unseenLink"), p)), h.textContent = N(o("unseenPage"), p);
    const v = e.createElement("li");
    v.append(h), c.append(v);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let Ae = !1, pt = null, qe = null;
function Si(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (S) => g(`${i}.${S}`), a = oe(e, r) ?? "", c = Ci(e, t);
  pt !== r && (B.clear(), z.clear(), pt = r), qe?.abort(), qe = new AbortController();
  const { signal: u } = qe, p = nn(e, c, l.facePick), m = nn(e, c, l.facePreview);
  m.eyebrow.textContent = g("platform.preview"), m.sentence.textContent = N(s("previewFor"), a), p.eyebrow.textContent = g("platform.pick"), p.sentence.textContent = N(s("pickFor"), a);
  const h = n.order;
  V.clear(), Ue.clear(), Object.entries(n.targets).forEach(([S, A]) => {
    V.add(S), Ct(A) || (Ue.add(S), B.delete(S));
  });
  const v = (S) => {
    m.sheet.toggleAttribute("inert", S), p.sheet.toggleAttribute("inert", !S);
  }, f = (S) => {
    Ae = S, c.classList.toggle(l.panelCardTurned, !S), v(S);
  };
  v(Ae);
  const b = () => {
    const S = G(`${i}.tally`, h.length, h.length);
    k.state.textContent = B.size === 0 ? S : G(`${i}.marked`, h.length, B.size, h.length), k.ready(B.size > 0, B.size > 0), K.state.textContent = S, K.waiting.textContent = z.size === 0 ? "" : N(g("mountBranches.waiting"), z.size), K.ready(z.size > 0, !0);
  }, w = (S, A) => {
    if (y().groupId !== r)
      return;
    const E = [...S];
    if (E.length === 0 || kt())
      return;
    const O = o.write(r, E, A, gi(p.sheet));
    A && E.forEach((j) => {
      Ee.add(j);
    }), O.then((j) => {
      if (j !== "taken") {
        E.forEach((W) => {
          Ee.delete(W);
        }), At(A ? K : k, j);
        return;
      }
      E.forEach((W) => S.delete(W)), x(), f(!1), Z("permissions-written", {});
    });
  }, k = Oe(m.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      B.clear(), dt(e), b();
    },
    apply: () => {
      w(B, !1);
    }
  }), P = new Set(Object.keys(n.named)), x = () => {
    p.sheet.querySelector(`.${l.naming}`)?.remove(), p.scroll.hidden = !1, p.eyebrow.textContent = g("platform.pick"), p.sentence.textContent = N(s("pickFor"), a);
  }, T = () => {
    const S = [...z].filter((E) => !P.has(E)), A = p.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && S.length > 0 && !A) {
      const E = hi(e, S);
      E.addEventListener("submit", (O) => {
        O.preventDefault(), T();
      }), E.addEventListener("input", () => {
        K.ready(H(), !0, !0);
      }), p.eyebrow.textContent = s("name"), p.sentence.textContent = s("nameFor"), p.scroll.hidden = !0, p.sheet.insertBefore(E, p.foot), E.querySelector("input")?.focus();
      return;
    }
    if (A && !H()) {
      p.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    w(z, !0);
  }, H = () => vi(p.sheet, s("nameWhy")), K = Oe(p.foot, {
    label: g("mountBranches.doAdd"),
    cancel: () => {
      z.clear(), x(), f(!1), b();
    },
    apply: T
  });
  if (p.scroll.style.setProperty("--vperm-queued-note", `"${g("mountBranches.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), ut.clear(), n.unseen.forEach(({ page: S }) => {
    ut.add(String(S));
  }), $i(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const S = e.createElement("div");
    S.className = l.faceChoice, S.append(o.choice(e, r)), m.sheet.insertBefore(S, m.foot);
  }
  ki(e, m.scroll, h, { groupId: r, kind: o, showCount: b }), wi(p.sheet, b, u), b(), Ee.start(() => {
    dt(e);
  }), $t(e, u, () => Ae, () => {
    if (p.sheet.querySelector(`.${l.naming}`) !== null) {
      x();
      return;
    }
    f(!1);
  }), In(r, [k, K], u), m.bar.replaceChildren(
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
function Ei(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  Ae = !1, B.clear(), pt = null, Ee.stop(), qe?.abort(), qe = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), yi(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, Tn));
}
function Ci(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function nn(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return qi(r);
  const o = Fn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function qi(e) {
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
const Li = { pageMounts: er, fileMounts: Zn };
function Ni(e, t) {
  const n = Ke();
  let r = !1;
  const o = async () => {
    const { active: s, groupId: a, area: c } = y(), u = Li[c];
    if (!s || a === null || u === void 0) {
      n.drop(), Ei(e);
      return;
    }
    const p = e.querySelector(u.component);
    if (p === null)
      return;
    r = !0;
    const m = await n.inspect(a);
    r = !1, m !== null && Si(e, p, u.mounted(m.scopes), { groupId: a, kind: u });
  }, i = new MutationObserver(() => {
    !r && [er, Zn].every(({ component: s }) => e.querySelector(`${s} > .${l.panelCard}`) === null) && o();
  });
  i.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    i.disconnect();
  }), o(), J("permissions-written", () => void o(), t), q(() => void o(), t);
}
let ft = null;
function sr(e) {
  ft = e, je.App.showModule(e);
}
function Oi(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function _i(e) {
  const t = ft === e;
  return ft = null, t;
}
const Le = "other", rn = ["modules", "pageMounts", "fileMounts", "fields", Le], Pi = 10, se = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Le]: "module"
}, xi = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function Ti(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", g("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(d.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const b = ar(e);
    if (b.forEach(($) => {
      v.observe($);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = b.map(($) => ie($)), k = [...rn, ...w.filter(($) => !rn.includes($))], P = w.includes("fields") ? [Le] : [], x = b.filter(($) => $.getBoundingClientRect().width !== 0).map(ie), T = x.includes("fields") ? [...x, Le] : x, [H] = T.includes("fields") ? ["fields"] : T, K = T.find(($) => se[$] !== void 0 && se[$] === se[f.picked]), S = T.includes(f.picked) ? f.picked : K ?? H;
    if (T.join() !== i && (i = T.join(), S !== void 0 && S !== f.area)) {
      Dr(S);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap(($) => [Ki(e, $), Gi(e, $)]),
      ...k.map(($) => Mi(e, $, g(`pickAnArea.${$}`)))
    )), n.parentElement === null && Fi(e).append(n);
    const A = f.area === Le ? "fields" : f.area;
    Di(n, e), Bi(n, e, b.find(($) => ie($) === A) ?? null);
    const E = f.area !== "fields";
    b.forEach(($) => {
      const C = ie($), M = C === A, te = E && !M && C !== "modules", ue = Me(n, C);
      ue?.setAttribute("aria-selected", String(C === f.area)), Ii(ue, $), $.toggleAttribute(d.armed, M), $.toggleAttribute("inert", te), r.add($), zi(Hi(n, C), $, te), Ui(Yi(n, C), $, M, b);
    });
    let O = 0, j = null;
    k.forEach(($) => {
      const C = Me(n, $);
      if (C === null)
        return;
      const M = C.hidden ? 0 : C.getBoundingClientRect().width, te = b.find(($r) => ie($r) === $), ue = te ?? Vi($, b), Ye = Math.max(O, ue?.getBoundingClientRect().left ?? O);
      C.style.setProperty("--vperm-host-x", `${String(Ye)}px`);
      const Mt = ue?.getBoundingClientRect().right;
      Mt !== void 0 && C.style.setProperty("--vperm-tab-room", `${String(Mt - Ye)}px`), C.toggleAttribute(d.elsewhere, te === void 0), te === void 0 && (C.setAttribute("aria-selected", String($ === f.area)), xe(C, ue ?? j ?? C)), O = C.hidden ? O : Ye + M + Pi, j = C;
    });
    const W = Me(n, "fields");
    P.forEach(($) => {
      const C = Me(n, $);
      C === null || W === null || (C.setAttribute("aria-selected", String($ === f.area)), C.hidden = W.hidden);
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
    const b = f.detail.module ?? "", w = _i(b);
    if (!m) {
      m = !0;
      return;
    }
    !w && se[y().picked] === "tree" && Ln("fields");
  };
  e.addEventListener("typo3-module-loaded", h, { signal: t }), p.observe(e.body, { childList: !0, subtree: !0 });
  const v = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    p.disconnect(), v.disconnect(), window.cancelAnimationFrame(c);
  }), q(a, t), a(y());
}
const Fi = (e) => e.querySelector(".scaffold") ?? e.body;
function Mi(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(d.area, t), r.setAttribute(d.label, n), r.title = n, r.append(L(e, l.tabLabel, n)), r.addEventListener("click", () => {
    Ln(t);
    const o = xi[t];
    o !== void 0 && ar(e).every((i) => ie(i) !== t) && sr(o);
  }), r;
}
function Ii(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, xe(e, t));
}
const xe = (e, t) => {
  e.setAttribute(d.ground, t.getAttribute(d.ground) ?? "");
}, Ri = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Di(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function Bi(e, t, n) {
  const r = ji(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, xe(r, n), Lt(r, n);
}
function Lt(e, t) {
  const n = t.getBoundingClientRect(), r = Ri(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function Ui(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  xe(e, t), e.hidden = o.width === 0 || o.left === 0 || n || On(t.ownerDocument) === 0 || Wi(o, r), Lt(e, t);
}
function ji(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Wi(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Gi(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(d.area, t), n;
}
function Ki(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(d.area, t), n;
}
function zi(e, t, n) {
  e !== null && (e.hidden = !n, n && (xe(e, t), Lt(e, t)));
}
const Vi = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  se[e] === void 0 ? void 0 : t.find((n) => se[ie(n)] === se[e])
), Me = (e, t) => e.querySelector(`.${l.tab}[${d.area}="${t}"]`), Hi = (e, t) => e.querySelector(`.${l.areaCover}[${d.area}="${t}"]`), Yi = (e, t) => e.querySelector(`.${l.tabSeam}[${d.area}="${t}"]`);
function ar(e) {
  return [...e.querySelectorAll(`.${l.frame}[${d.area}]`)];
}
const ie = (e) => e.getAttribute(d.area) ?? "", lr = "#modulemenu", Ji = `${lr} .modulemenu-group-container.collapse:not(.show)`, Qi = `${lr} [aria-controls]`, Xi = "typo3-backend-content-navigation[navigation-collapsed]", on = "navigation-collapsed";
function Zi(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = y();
    o && ts(e, n), o && i === "modules" && es(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    y().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), q(r, t);
}
function es(e, t) {
  e.querySelectorAll(Ji).forEach((n) => {
    n.classList.add("show"), sn(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), sn(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Qi).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function ts(e, t) {
  e.querySelectorAll(Xi).forEach((n) => {
    n.toggleAttribute(on, !1), t.push(() => {
      n.toggleAttribute(on, !0);
    });
  });
}
function sn(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const ns = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", an = "scaffold-content-navigation-expanded";
function rs(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(an);
    }), n = y().active ? [...e.querySelectorAll(ns)] : [], n.forEach((o) => {
      o.classList.add(an);
    });
  };
  r(), q(r, t);
}
const cr = (e) => [...e, "web_list"], Ne = cr(["web_layout", "records", "media_management", "permissions_pages"]), ur = "vperm.module";
function os(e, t) {
  let n = null;
  const r = (i) => {
    ls(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || Ne.includes(ss(e))))
      return;
    const a = cs() ?? Ne[0] ?? "", c = wt(e);
    if ((c !== "" || Tr(e)) && i.area === "fields") {
      Oi(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        is(e, c);
      },
      { once: !0, signal: t }
    ), sr(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    y().active && Ne.includes(s) && me(ur, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), q(r, t);
}
async function is(e, t) {
  const n = ce(e), r = await _n(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function ss(e) {
  return je.App.getCurrentModule() ?? ce(e)?.getAttribute("module") ?? "";
}
const dr = "[data-modulemenu-identifier]:not([aria-controls])", as = `#modulemenu ${dr}`;
function ls(e, t) {
  e.querySelectorAll(as).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !Ne.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(dr)].every((r) => r.parentElement?.hidden === !0);
  });
}
function cs() {
  const e = fe.get(ur);
  return typeof e == "string" && Ne.includes(e) ? e : void 0;
}
function us(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function ds(e) {
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
function ps(e) {
  D(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const fs = "[data-object-id]";
function pr(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = y();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), ms(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), hs(a), fr(a, e));
    });
  };
  D((i) => {
    n = i.doc, o();
  }, t), q(o, t);
}
function ms(e, t) {
  e.querySelectorAll(fs).forEach((n) => {
    gs(n) && (vs(n), n.matches(t.shut) || fr(n, t));
  });
}
function fr(e, t) {
  e.querySelector(t.opener)?.click();
}
const Nt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function hs(e) {
  ae.set(Nt(e), "folded");
}
function gs(e) {
  return ae.isset(Nt(e));
}
function vs(e) {
  ae.unset(Nt(e));
}
function bs(e) {
  pr({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function ws(e, t) {
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
    re(_.write_other_permissions, v).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== p, f === "taken") {
        Re.success(g("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && Re.error(g("editOtherPermissions.notSaved"));
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
    w !== p && (p = w, c.disabled = !0, s.textContent = oe(e, w) ?? "", ys(w).then((k) => {
      k === null || w !== p || (r.replaceChildren(e.createRange().createContextualFragment(k.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${d.area}="fields"]`)?.append(n), new Nr().processItems([...k.scriptItems]));
    }));
  };
  h(y()), q(h, t);
}
async function ys(e) {
  return Pe(new Y(R(_.other_permissions)).withQueryArguments({ group: e }).get());
}
const Ot = '.form-group:has(> select[name="_langSelector"])', mt = /* @__PURE__ */ new WeakMap();
function ks(e, t) {
  const n = e.querySelector(`.module-docheader ${Ot}`);
  n !== null && (mt.has(n) || mt.set(n, n.parentElement), t.after(n));
}
function As(e) {
  const t = e.querySelector(`.module-docheader ${Ot}`);
  t !== null && mt.get(t)?.append(t);
}
const $s = (e) => `${e}, ${Ot}`, Ss = ".module-docheader-navigation > .module-docheader-column-breadcrumb", ln = ".module-docheader-buttons .btn-toolbar > *", Es = ".t3js-editform-close", Cs = $s(`.${l.headButton}, .${l.showMenu}, .${l.typeSwitch}`), qs = 'form[name="editform"] h1';
function Ls(e, t) {
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
    const a = i.querySelector(Es), c = y().face === "preview" ? a : null;
    if (i.querySelectorAll(ln).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches(Cs) && !f.contains(c));
    }), i.querySelectorAll(qs).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${d.token}][${d.inside}='']:not([${d.outOfReach}])`) !== null;
    if (!u && y().face === "pick") {
      Se(i, () => {
        pe("preview");
      });
      return;
    }
    const p = y().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      L(i, l.faceEyebrow, g(p ? "platform.preview" : "platform.pick")),
      L(i, l.faceSentence, N(
        g(p ? "recordForm.previewFor" : "recordForm.pickFor"),
        oe(e, y().groupId) ?? ""
      ))
    ), i.querySelector(Ss)?.append(m), !p || !u)
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
    [...i.querySelectorAll(ln)].find((f) => f.contains(a))?.after(h);
  };
  D((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && $t(
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
const cn = `[${d.token}]`;
function Ns(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(cn)];
    Gt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(cn)];
      Os(s, i) || (i = s, Gt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const Os = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function _s(e, t) {
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
const Ps = cr(["records"]);
function xs(e, t) {
  let n = y().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && Ps.includes(je.App.getCurrentModule() ?? "");
  q(({ active: o }) => {
    o !== n && Fr().then(() => {
      r() && Or.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function Ts(e, t) {
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
const Fs = ".module-docheader-buttons .btn-toolbar", un = "vperm.show", dn = "vperm.identify", pn = (e, t, n) => {
  if (n) {
    ae.set(e, t);
    return;
  }
  ae.unset(e);
}, fn = (e, t) => {
  if (e.setAttribute("aria-selected", String(t)), !t) {
    e.removeAttribute("data-dropdowntoggle-status");
    return;
  }
  e.setAttribute("data-dropdowntoggle-status", "active");
};
function Ms(e) {
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
      o.body.removeAttribute(d.show), As(o);
      return;
    }
    hn(o, ae.get(un) === "list"), mn(o, ae.get(dn) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(mr(o, "actions-filter"), ` ${g("recordForm.show")}`);
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
    ), i.append(s, a), o.querySelector(Fs)?.append(i), ks(o, i);
  };
  D((o) => {
    t = o.doc, r();
  }, e), J("fields-judged", r, e), q(r, e);
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
function mr(e, t) {
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
  s.className = "dropdown-item-status", i.append(s, mr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), fn(i, r());
  }), fn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function Is(e) {
  return nt.normalizedCtrlModifierKey === yn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function _t(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = Is(e), t.append(o);
    }
    nt.register(
      [nt.normalizedCtrlModifierKey, yn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Rs(e) {
  _t(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${d.toggle}]`), () => {
    if (y().active) {
      qn();
      return;
    }
    Cn();
  }, !0);
}
function Ds(e, t) {
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
  }, { signal: t }), q(r, t);
}
function Bs(e) {
  pr({
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
function Pt(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {
  }
}
const hr = 600, Us = 250, js = 2e3, Ws = 320, xt = "vperm.arriving";
function Gs() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function gr(e, t, n) {
  if (!Gs()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  ve(xt, t), e.body.setAttribute(d.leaving, t), e.body.addEventListener("animationend", o, { once: !0 }), window.setTimeout(o, hr);
}
function Ks(e) {
  e.body.setAttribute(d.settling, "");
}
function zs(e) {
  const t = Vs();
  if (t === null)
    return;
  Pt(xt), e.body.setAttribute(d.settling, ""), e.body.setAttribute(d.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(d.settling), e.body.removeAttribute(d.arriving), e.body.setAttribute(d.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(d.unwrapping);
    }, Ws));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, hr);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, Us);
  }, { signal: i.signal }), window.setTimeout(c, js);
}
function Vs() {
  return be(xt);
}
const vr = "vperm.viewing", br = "vperm.seen", wr = "vperm.room";
function Hs(e) {
  ve(vr, e);
}
function Ys(e) {
  ve(wr, String(e));
}
function Js() {
  return be(wr);
}
function Qs(e) {
  const t = be(vr);
  t !== null && ve(br, JSON.stringify({
    ...Tt(),
    [t]: { place: $n(e), document: wt(e) }
  }));
}
function Xs(e) {
  return kn(Tt()[e]);
}
function Zs(e) {
  return An(Tt()[e]);
}
function Tt() {
  const e = be(br);
  return e === null ? {} : JSON.parse(e);
}
function ea(e, t) {
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
  const c = Js();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), Nn(e, a, t), o.addEventListener("click", () => {
    Qs(e), gr(e, "up", () => {
    });
  }, { signal: t }), _t(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Ft = "vperm.opening";
function yr(e, t) {
  e !== "" && ve(Ft, JSON.stringify({ record: e, screen: t }));
}
function ta(e) {
  const t = ra(), n = ce(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !na(t.screen, n, e.location.href) || (Pt(Ft), oa(e, n, t.record));
}
function na(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function ra() {
  const e = be(Ft);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function oa(e, t, n) {
  const r = await _n(n, t);
  r !== "" && xr(e, r);
}
const kr = Pn(_.viewable_users), ia = {
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
}, ht = "vperm.returnTo", gt = "vperm.returning", sa = "vperm.userSearch";
function aa(e, t, n = ia) {
  const r = fe.get(ht), o = kn(r);
  return o !== "" && la(o) ? (yr(An(r), o), me(ht, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (ca(e, t, n), !1);
}
function la(e) {
  return be(gt) === e ? !1 : (ve(gt, e), !0);
}
function ca(e, t, n) {
  const r = e.querySelector(`[${d.viewAs}]`);
  if (r === null)
    return;
  const o = Rn(e, {
    totalOne: g("viewAsUser.total.one"),
    totalMany: g("viewAsUser.total.many"),
    take: g("viewAsUser.key.take"),
    detail: g("viewAsUser.key.detail"),
    loading: g("viewAsUser.loading"),
    failed: g("viewAsUser.failed")
  });
  o.remembers = sa, o.placeholder = g("viewAsUser.search"), o.addNew = { label: g("viewAsUser.new"), url: r.getAttribute(d.newRecord) ?? "" }, e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    Ar(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    vt(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    yt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    vt(e, o), o.openedBy(r);
  }, { signal: t }), _t(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    ua(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function ua(e, t, n, r) {
  const o = await kr().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    vt(e, r), r.openedBy(n);
    return;
  }
  await Ar(e, i, t);
}
async function vt(e, t) {
  t.state = "loading";
  const [n] = await Promise.all([kr().catch(() => null), xn(e)]);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = ze(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
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
    note: da(r.length),
    detail: r,
    detailHeading: pa(r.length),
    heading: t
  };
}
function da(e) {
  return e === 0 ? "" : G("viewAsUser.groups", e, e);
}
function pa(e) {
  return e === 0 ? g("viewAsUser.detail.none") : G("viewAsUser.detail", e, e);
}
async function Ar(e, t, n) {
  Pt(gt), Hs(String(t)), Ys(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await me(ht, { place: $n(e), document: wt(e) });
  const r = Xs(String(t));
  yr(Zs(String(t)), r), fa(t, n, r);
}
function fa(e, t, n) {
  Pr(document), gr(document, "down", () => {
    t.handOver(R(_.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function bn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Ur(e.signal), Wr(document, e.signal), Ds(document, e.signal), eo(document, e.signal), ps(e.signal), ds(e.signal);
  const t = go();
  mo(t, e.signal);
  const n = ho();
  Ao(n, e.signal), Eo(n, e.signal), To(t, e.signal), Fo(e.signal), ri(document, e.signal), Ni(document, e.signal), si(e.signal), li(e.signal), di(e.signal), fi(e.signal), Zi(document, e.signal), _s(document, e.signal), xs(document, e.signal), rs(document, e.signal), os(document, e.signal), Ro(document, e.signal), Ti(document, e.signal), ws(document, e.signal), us(document, e.signal), jo(document, e.signal), Ko(e.signal), Ts(document, e.signal), Ls(document, e.signal), Ms(e.signal), Bs(e.signal), bs(e.signal), Ns(document, e.signal);
  const r = aa(document, e.signal);
  ea(document, e.signal), r ? Ks(document) : (ta(document), zs(document)), Rs(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", bn, { once: !0 }) : bn();
//# sourceMappingURL=main.js.map
