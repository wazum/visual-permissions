import fe from "@typo3/backend/storage/persistent.js";
import Y from "@typo3/core/ajax/ajax-request.js";
import Er from "@typo3/backend/login-refresh.js";
import Oe from "@typo3/backend/notification.js";
import { sudoModeInterceptor as Cr } from "@typo3/backend/security/sudo-mode-interceptor.js";
import { LitElement as qr, html as R } from "lit";
import { ModuleStateStorage as yn } from "@typo3/backend/storage/module-state-storage.js";
import It from "@typo3/backend/modal.js";
import { FileStorageTree as Lr } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as Nr } from "@typo3/backend/tree/page-tree.js";
import Ke from "@typo3/backend/module-menu.js";
import ae from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as _r } from "@typo3/core/java-script-item-processor.js";
import Or from "@typo3/backend/viewport.js";
import tt, { ModifierKeys as kn } from "@typo3/backend/hotkeys.js";
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
  open: "data-vperm-open",
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
  tableGate: "vperm-table-gate",
  tableLevels: "vperm-table-levels",
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
function xr(e) {
  return e.body.hasAttribute(p.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function Pr(e) {
  e.body.setAttribute(p.handingOver, "");
}
function $n(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function An(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function Fr(e, t) {
  const n = ce(e);
  n !== null && e.addEventListener(
    "typo3-module-loaded",
    () => {
      n.setAttribute("endpoint", t);
    },
    { once: !0 }
  );
}
function gt(e) {
  return new URL(e.location.href).pathname.endsWith("/main") ? ce(e)?.getAttribute("endpoint") ?? "" : e.location.href;
}
function ce(e) {
  return e.querySelector("typo3-backend-module-router");
}
function vt(e) {
  const t = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(gt(e)));
  return t === null ? "" : t.slice(1).join(":");
}
function Mr(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(gt(e)));
}
function Sn(e) {
  const t = gt(e);
  if (t === "")
    return "";
  const n = new URL(t, e.location.origin), r = n.searchParams.get("returnUrl");
  if (r !== null) {
    const o = new URL(r, n.origin);
    return o.origin !== n.origin ? "" : (o.searchParams.delete("token"), o.href);
  }
  return n.searchParams.delete("token"), n.href;
}
let De = Promise.resolve();
function me(e, t) {
  const n = document;
  return De = De.then(async () => {
    xr(n) || await fe.set(e, t);
  }).catch(() => {
  }), De;
}
function Tr() {
  return De;
}
const En = "vperm.session", Cn = 1, ye = "modules", Ir = "fields", nt = /* @__PURE__ */ new Set();
let M = Ur();
document.addEventListener("typo3-module-loaded", () => {
  ze({ ...M, face: "preview" });
});
function y() {
  return M;
}
function L(e, t) {
  nt.add(e), t?.addEventListener("abort", () => nt.delete(e));
}
function qn() {
  const e = M.groupId !== null, t = e ? Ir : M.area;
  he({ ...M, active: e, open: M.open || e, area: t, picked: t });
}
function Rr() {
  he({ ...M, open: !0 });
}
function Dr() {
  he({ ...M, open: !1, active: !1 });
}
function bt() {
  he({ ...M, active: !1 });
}
function Ln(e) {
  he({ ...M, area: e, picked: e, face: "preview" });
}
function Br(e) {
  ze({ ...M, area: e });
}
function pe(e) {
  ze({ ...M, face: e });
}
function wt(e) {
  he({ ...M, groupId: e, active: M.active && e !== null });
}
function he(e) {
  me(En, {
    version: Cn,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), ze(e);
}
function ze(e) {
  M = e;
  for (const t of nt)
    try {
      t(M);
    } catch (n) {
      console.error(n);
    }
}
function Ur() {
  const e = fe.get(En);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: ye, picked: ye, face: "preview" };
  const t = e;
  if (String(t.version) !== String(Cn))
    return { open: !1, active: !1, groupId: null, area: ye, picked: ye, face: "preview" };
  const n = Number(t.groupId), r = Number.isInteger(n) && n > 0 ? n : null, o = typeof t.area == "string" && t.area !== "null" ? t.area : ye;
  return {
    open: String(t.open) === "true",
    active: String(t.active) === "true" && r !== null,
    groupId: r,
    area: o,
    picked: o,
    face: "preview"
  };
}
function jr(e) {
  const t = () => {
    Rt(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && Rt(n);
  };
  t(), L(t, e);
}
function Rt(e) {
  const t = y();
  if (e.toggleAttribute(p.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(p.active, t.active), !t.active) {
    e.removeAttribute(p.picked), e.removeAttribute(p.face);
    return;
  }
  e.setAttribute(p.picked, t.area), e.setAttribute(p.face, t.face);
}
const Wr = (e) => `${e}, .scaffold-modulemenu`;
function Nn(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Wr(".scaffold-sidebar"));
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
function Gr(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${p.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), Nn(e, r, t);
  const o = e.querySelector(`[${p.toolbar}]`), i = () => y().open || y().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), L(s, t), o?.addEventListener("click", () => {
    i() ? Dr() : Rr(), s();
  }, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
const F = {
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
function D(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
function g(e) {
  return TYPO3.lang[e] ?? "";
}
let rt = 0;
async function re(e, t, n = () => {
}) {
  return rt += 1, new Y(D(e)).addMiddleware(Cr).post(t).then(async (r) => {
    const o = Dt(r);
    return o === "taken" && r.raw().status === 200 && n(await r.resolve()), o;
  }, Dt).finally(() => {
    rt -= 1;
  });
}
function yt() {
  return rt > 0;
}
function Dt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (Er.checkActiveSession(), "loggedOut") : Kr(t.status);
  } catch {
    return "failed";
  }
}
function Kr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function Fe(e, t = []) {
  return ge(new Y(D(F.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
}
function kt() {
  let e = 0;
  return {
    inspect: async (t, n) => {
      const r = ++e, o = await Fe(t, n);
      return r === e ? o : null;
    },
    // Stryker disable next-line AssignmentOperator: counting down works as well, since only "is this still the newest" is asked
    drop: () => {
      e += 1;
    }
  };
}
async function On(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await ge(new Y(D(F.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()))?.url ?? "";
}
function zr(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
function xn(e) {
  let t = null;
  return async () => {
    const n = await new Y(D(e)).get(t === null ? {} : { headers: { "If-None-Match": t.tag } }).catch(zr), r = n.raw();
    if (r.status === 304)
      return t.value;
    const o = await n.resolve(), i = r.headers.get("ETag");
    return t = i === null ? null : { tag: i, value: o }, o;
  };
}
async function ge(e) {
  try {
    return await (await e).resolve();
  } catch {
    return Oe.error(g("platform.notRead")), null;
  }
}
function Ve(e) {
  return JSON.parse(e.querySelector(`[${p.groups}]`)?.getAttribute(p.groups) ?? "{}");
}
const Vr = xn(F.groups);
async function Pn(e) {
  const t = await Vr().catch(() => null);
  t !== null && e.querySelector(`[${p.groups}]`)?.setAttribute(p.groups, JSON.stringify(t));
}
function oe(e, t) {
  return Ve(e)[String(t)]?.title ?? null;
}
const Fn = 220, Hr = 1300;
function xe(e, t) {
  const n = e.ownerDocument, r = n.createElement("span");
  r.className = l.faceTally;
  const o = O(n, l.faceCounted, ""), i = O(n, l.faceWaiting, "");
  r.append(o, i);
  const s = te(n, g("platform.cancel"), `btn btn-default ${l.faceCancel}`, t.cancel), a = te(n, t.label, `btn btn-primary ${l.faceApply}`, t.apply);
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
function $t(e, t) {
  t !== "cancelled" && (e.state.textContent = g(`platform.${t}`));
}
function Mn(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = O(e, l.faceEyebrow, ""), o = O(e, l.faceSentence, ""), i = e.createElement("div");
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
        }, Hr));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function In(e, t, n) {
  L(() => {
    y().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function At(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !Yr(e) && r();
  }, { signal: t });
}
const Yr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
function te(e, t, n, r, o) {
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
function z(e, t, ...n) {
  return P(g(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function P(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, () => String(r)).replace("%s", () => String(r)),
    e
  );
}
const Bt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Jr(e, t, n, r) {
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
    const a = Jr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const jt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Qr = 70, Ye = 50;
class Xr extends qr {
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
    return this.hasAttribute(p.open) || this.matches(":popover-open");
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
    return this.matching.slice(0, Ye);
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
    return R`
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
      return R`
          ${this.headingBefore(n, t[r - 1])}
          <div role="option" id=${this.rowId(r)}
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
    return this.addNew === null ? "" : R`
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
    n.searchParams.set("returnUrl", ce(this.ownerDocument)?.getAttribute("endpoint") ?? ""), t.href = n.href, yn.update("web", 0, !0), bt(), this.hidePopover();
  }
  kept() {
    const t = fe.get(this.remembers);
    return typeof t == "string" ? t : "";
  }
  remember() {
    this.remembers !== "" && me(this.remembers, this.query);
  }
  nothingToShow(t) {
    return this.state === "loading" ? R`<p>${this.words.loading}</p>` : this.state === "failed" ? R`
        <p>${this.words.failed}</p>
        <button type="button" class="btn btn-default btn-sm"
                @click=${() => {
      this.dispatchEvent(new CustomEvent("vperm:retry"));
    }}>
          ${this.words.retry}
        </button>
      ` : t.length === 0 ? R`<p>${this.words.empty}</p>` : "";
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
    return t === void 0 ? R`` : R`
      <div class=${l.pickerDetail}>
        <div class=${l.pickerHead}>
          <strong>${t.title}</strong>
          <p>${t.detailHeading}</p>
        </div>
        <div role="listbox" tabindex="-1">
          ${t.detail.map((n, r) => R`
            <div role="option" id=${this.detailId(r)} class=${l.pickerRow}
                 aria-selected=${this.inPane && r === this.onDetail}
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
    }, Qr));
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
    return r === "" || r === n?.heading ? R`` : R`<p class="dropdown-header">${r}</p>`;
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
      return R`${n}`;
    const i = [];
    let s = 0;
    for (let a = 0; a < o.length; ) {
      let c = a;
      for (; c + 1 < o.length && o[c + 1] === (o[c] ?? 0) + 1; )
        c += 1;
      const u = o[a] ?? 0, d = (o[c] ?? 0) + 1;
      i.push(R`${n.slice(s, u)}<mark>${n.slice(u, d)}</mark>`), s = d, a = c + 1;
    }
    return R`${i}${n.slice(s)}`;
  }
}
customElements.get(le.picker) === void 0 && customElements.define(le.picker, Xr);
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
const Zr = "vperm.groupSearch", Dn = "vperm.recentGroups", eo = 3;
function to(e, t) {
  const n = e.querySelector(`[${p.group}]`);
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
  let o = no(e);
  r.entries = Je(e, o), r.remembers = Zr, r.placeholder = g("pickAGroup.search"), r.addNew = { label: g("pickAGroup.new"), url: n.getAttribute(p.newRecord) ?? "" }, e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n), Pn(e).then(() => {
      r.entries = Je(e, o);
    });
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = oe(e, y().groupId) ?? i;
  };
  s(), L(s, t), L(() => {
    const { groupId: u } = y();
    u !== null && o[0] !== u && (o = [u, ...o.filter((d) => d !== u)], me(Dn, o)), r.entries = Je(e, o);
  }, t);
  const c = (u) => {
    wt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function no(e) {
  const t = Ve(e);
  return [fe.get(Dn)].flat().map(String).filter((n) => n in t).map(Number);
}
function Je(e, t) {
  const n = Object.entries(Ve(e)), r = t.filter((s) => s !== y().groupId).slice(0, eo), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
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
    note: ro(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: g(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function ro(e) {
  return e === 0 ? "" : z("pickAGroup.inherits", e, e);
}
const Bn = (e) => `vperm:${e}`;
function X(e, t) {
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
function oo() {
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
const Un = oo();
function B(e, t) {
  Un.listen(e, t);
}
function Gt(e) {
  Un.tell(e);
}
const St = ["allowed", "allowedAndInherited", "inherited"], io = ["allowed", "denied"], Z = "allowed", ve = "denied", Et = "inherited", jn = "allowedAndInherited", Ue = "adminOnly";
function W(e) {
  return St.some((t) => t === e);
}
const so = [...St, ve];
function Ct(e) {
  return io.includes(e);
}
function je(e) {
  return e.substring(0, e.indexOf(":"));
}
function ao(e) {
  return e.substring(e.indexOf(":") + 1);
}
const ne = {};
function lo(e, t) {
  ne.tables = e, t.addEventListener("abort", () => {
    delete ne.tables;
  });
}
function co(e, t) {
  ne.fields = e, t.addEventListener("abort", () => {
    delete ne.fields;
  });
}
function uo(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${p.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(p.unseen);
  });
  const { active: n, area: r, face: o } = y();
  !n || r !== "fields" || (ne.tables?.hide(e, t, o), ne.fields?.hide(e, t, o), Kt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${p.verdict}]`)].some((a) => a.closest(`[${p.unseen}]`) === null) || Se(i);
  }), Kt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${p.unseen}])`) === null && (Se(i), Se(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), po(e), o === "preview" && fo(e, t));
}
function Se(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(p.unseen, "");
}
function Kt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${p.verdict}]`)?.querySelector(`[${p.verdict}]`) !== null);
}
function po(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(p.unseen) === !0 && e.querySelector(`.nav-item:not([${p.unseen}]) [data-typo3-tab]`)?.click();
}
function fo(e, { tables: t, named: n, reads: r }) {
  if (e.querySelector(`.form-section:not([${p.unseen}])`) !== null)
    return;
  const o = mo(e), i = t[o], a = (W(i) ? ne.fields : ne.tables)?.explain(e, o, i, n[o] ?? o, r[o]);
  a !== void 0 && (a.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(a));
}
function mo(e) {
  const n = e.querySelector(`[${p.token}][${p.inside}='']`)?.getAttribute(p.token) ?? "";
  return je(n);
}
function ho(e, t) {
  let n = null;
  const r = kt();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null, i = null;
  const s = () => {
    n !== null && uo(n.doc, {
      tables: o?.targets ?? {},
      named: o?.named ?? {},
      reads: i?.targets ?? {}
    });
  }, a = async () => {
    if (n === null)
      return;
    const { fields: u } = n, { active: d, groupId: m } = y();
    if (!d || m === null) {
      r.drop(), u.forEach(([w]) => {
        w.removeAttribute(p.verdict), w.removeAttribute(p.outOfReach);
      }), o = null, i = null, s();
      return;
    }
    const v = [...new Set(u.map(([, w]) => je(w)))], f = await r.inspect(m, v);
    if (f === null)
      return;
    const { scopes: b } = f;
    e.take(f), u.forEach(([w, k]) => {
      const E = b.fields.targets[k];
      E !== void 0 && w.setAttribute(p.verdict, E), w.toggleAttribute(p.outOfReach, !W(b.tablesModify.targets[je(k)]));
    }), o = b.tablesModify, i = b.tablesSelect, s(), X("fields-judged", {});
  };
  B(({ doc: u, fields: d }) => {
    r.drop(), u.body.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`);
    const m = d.flatMap((h) => {
      const v = h.getAttribute(p.token);
      return v === null ? [] : [[h, v]];
    });
    n = m.length === 0 ? null : { doc: u, fields: m }, o = null, a();
  }, t), J("permissions-written", () => void a(), t);
  let c = null;
  L(({ active: u, groupId: d }) => {
    const m = `${String(u)}:${String(d)}`;
    if (m === c) {
      s();
      return;
    }
    c = m, a();
  }, t);
}
function go() {
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
function vo() {
  let e = [], t = {};
  return {
    allowedBy: (n) => e.filter((r) => t[n]?.includes(r.groupId)),
    take: (n) => {
      e = n.chain, t = n.scopes.fields.allowedBy;
    }
  };
}
const Wn = (e) => e.map((t) => `[${p.verdict}='${t}']:not([${p.outOfReach}])`).join(","), bo = (e) => Wn(e === "pick" ? so : St), ot = (e) => Wn([e === "pick" ? ve : Z]), wo = `.${l.anchor}[${p.verdict}]`, yo = (e, t, n) => {
  const r = W(e.getAttribute(p.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(bo(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(ot(n)),
    waiting: t ? g(n === "pick" ? "platform.toAllow" : "allowFields.toDisallow") : ""
  };
}, ko = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function $o(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(p.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (ko(n), t.waiting === "") {
      n.removeAttribute(p.waiting);
      return;
    }
    n.setAttribute(p.waiting, t.waiting);
  }
}
function Ao(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = y();
    n.querySelectorAll(wo).forEach((a) => {
      $o(a, yo(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabAllow}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const d = () => [...c.querySelectorAll(`[${p.inside}='']`)].filter((h) => h.matches(ot(a)) && !e.has(h)), m = u ?? i(s, c, d);
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
  B((s) => {
    const a = s.doc === n;
    if (n = s.doc, r(), a)
      return;
    const c = (u) => {
      const d = u.target, m = d.closest(`.${l.mark}`) === null ? d.closest(ot(y().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), J("fields-judged", r, t), L(r, t);
}
async function So(e, t) {
  return re(F.allow_fields, { group: e, operations: [...t] });
}
const zt = 280;
function Ee(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, zt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, zt * 2);
}
const Vt = `[${p.verdict}]:not([${p.outOfReach}])`, Eo = [ve, Ue].map((e) => `:not([${p.verdict}='${e}'])`).join("");
function Co(e, t) {
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
    }), r = null, h && a.querySelector(Vt) !== null && m !== null && (r = { form: a, face: d, groupId: m, showCount: i(a, d === "pick", m) });
  }, i = (a, c, u) => {
    let d = null;
    const m = a.ownerDocument.createElement("div");
    m.className = l.faceFoot;
    const h = () => [...a.querySelectorAll(`[${p.token}]`)].filter((w) => e.has(w)), v = () => {
      if (!c) {
        pe("preview");
        return;
      }
      Ee(a.ownerDocument, () => {
        pe("preview");
      });
    }, f = xe(m, {
      label: g(c ? "platform.doAllow" : "platform.doDisallow"),
      cancel: () => {
        e.drop(), v();
      },
      apply: () => {
        const w = h().map((k) => ({ field: k.getAttribute(p.token) ?? "", allow: c }));
        yt() || So(u, w).then((k) => {
          if (y().groupId !== u) {
            k === "taken" && X("permissions-written", {});
            return;
          }
          if (k !== "taken") {
            $t(f, k), d = w.length;
            return;
          }
          e.drop(), v(), X("permissions-written", {});
        });
      }
    }), b = () => {
      const w = [...a.querySelectorAll(Vt)].filter((N) => N.closest(`.${l.otherKinds}`) === null), k = w.filter((N) => N.matches(Eo)), E = h().length;
      d !== E && (d = null, f.state.textContent = z("allowFields.tally", w.length, k.length, w.length), f.waiting.textContent = E === 0 ? "" : z(`allowFields.${c ? "waiting" : "going"}`, E, E), f.ready(E > 0, c || E > 0));
    };
    return b(), a.append(m), b;
  }, s = () => {
    r?.showCount();
  };
  B((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), J("fields-judged", o, t), L(o, t);
}
const qo = `.${l.anchor}[${p.verdict}]`, Lo = 350, No = 250, it = (e) => e.getAttribute(p.verdict) ?? "", _o = (e) => e.getAttribute(p.token) ?? "", Oo = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), st = (e) => g(`allowFields.mark.${e}.title`), xo = (e) => {
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
    c.type = "button", c.className = "btn btn-default btn-sm", c.textContent = g("allowFields.showGroup"), c.setAttribute("aria-label", P(g("allowFields.showGroupNamed"), s.title)), c.addEventListener("click", () => {
      e.hidePopover(), wt(s.groupId);
    });
    const u = n.createElement("li");
    return u.append(a, c), u;
  }));
  const i = n.createElement("section");
  return i.append(r, o), [i];
}
function Fo(e, t, n) {
  const r = e.ownerDocument, o = it(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = st(o);
  const a = r.createElement("p");
  a.textContent = g(`allowFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(u, ...Po(e, n));
  const d = xo(t);
  if (d !== "") {
    const m = r.createElement("footer");
    m.textContent = d, e.append(m);
  }
}
function Mo(e, t) {
  let n = document, r = 0, o = !1, i = null;
  const s = /* @__PURE__ */ new WeakMap(), a = (h) => {
    window.clearTimeout(r), r = window.setTimeout(() => {
      h.hidePopover();
    }, No);
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
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = h, h.style.setProperty("anchor-name", "--vperm-mark"), h.setAttribute("aria-expanded", "true"), Fo(f, v, e.allowedBy(_o(v))), f.showPopover();
  }, m = () => {
    n.querySelectorAll(qo).forEach((h) => {
      const v = Oo(h);
      if (v === null)
        return;
      const f = v.querySelector(`.${l.mark}`);
      if (f !== null) {
        f.setAttribute("aria-label", st(it(h)));
        return;
      }
      const b = v.ownerDocument.createElement("button");
      b.type = "button", b.className = l.mark, b.setAttribute("aria-label", st(it(h))), b.setAttribute("aria-haspopup", "dialog"), b.setAttribute("aria-controls", l.markCard), b.setAttribute("aria-expanded", "false"), b.addEventListener("click", (w) => {
        d(b, h), w.detail === 0 && u(b.ownerDocument).querySelector("button")?.focus();
      }), b.addEventListener("mouseenter", () => {
        if (window.clearTimeout(r), o) {
          d(b, h);
          return;
        }
        r = window.setTimeout(() => {
          d(b, h);
        }, Lo);
      }), b.addEventListener("mouseleave", () => {
        a(u(b.ownerDocument));
      }), b.addEventListener("focusout", (w) => {
        c(u(b.ownerDocument), w);
      }), v.append(b);
    });
  };
  B((h) => {
    n = h.doc;
  }, t), J("fields-judged", m, t);
}
function To(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      Io(r);
    });
  };
  B((r) => {
    t = r.doc, n();
  }, e), J("fields-judged", n, e);
}
function Io(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${p.token}]:not([${p.outOfReach}])`) === null);
}
const Ro = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Te = (e) => `${e}, ${Ro[e]}`, Gn = [
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
    t.classList.remove(l.frame), t.removeAttribute(p.area), t.removeAttribute(p.ground);
  });
}
function Kn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Do(e, t) {
  const n = (i) => {
    if ((i.active ? oe(e, i.groupId) : null) === null) {
      Ht(e);
      return;
    }
    const a = Gn.flatMap((c) => {
      const u = Kn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Ht(e), a.forEach(({ element: c, key: u, ground: d }) => {
      c.classList.add(l.frame), c.setAttribute(p.area, u), c.setAttribute(p.ground, d), Uo(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Bo(e) && n(y());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(y()), L(n, t);
}
function Bo(e) {
  return Gn.some((t) => {
    const n = Kn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(p.area) !== t.key);
  });
}
function Uo(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const jo = "typo3-backend-contextual-record-edit-trigger";
function Wo(e, t) {
  let n = null;
  const r = (d) => {
    const m = d.target.closest(jo);
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
  B((d) => {
    n = d.doc, n.addEventListener("submit", i, { capture: !0, signal: t }), n.addEventListener("click", s, { capture: !0, signal: t }), n.addEventListener("click", r, { capture: !0, signal: t }), u();
  }, t), L(u, t);
}
const Go = ".module-docheader-buttons .btn-toolbar", Ko = (e, t) => {
  e.location.assign(t);
};
function zo(e, t = Ko) {
  let n = null;
  const r = () => {
    if (n?.defaultView == null || y().active)
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
        const [f, b, w] = u.name.slice(5, -1).split("]["), k = new URL(i.URL), E = String(b).startsWith("NEW") ? `defVals[${String(f)}][${String(w)}]` : `vperm[value][${String(f)}][${String(b)}][${String(w)}]`;
        k.searchParams.set(E, v.value), t(i, k.toString());
      }), d.append(h, v), i.querySelector(Go)?.append(d);
    });
  };
  L(() => {
    r(), o();
  }, e), B(({ doc: i }) => {
    n = i, r(), o();
  }, e);
}
let Yt = null;
function qt(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  if (Yt?.isConnected === !0)
    return;
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), e.groups.forEach(({ label: h, values: v }) => {
    const f = document.createElement("section"), b = document.createElement("h2");
    b.textContent = h;
    const w = document.createElement("div");
    w.append(...v.map((k) => Ho(k, n.has(k.value), o.has(k.value)))), f.append(b, w), i.append(f);
  });
  const s = O(document, l.faceWaiting, ""), a = () => [...i.querySelectorAll("input")].filter((h) => h.checked !== n.has(h.value)).map((h) => ({ value: h.value, allow: h.checked })), c = {
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
    title: P(e.title, t),
    content: i,
    size: It.sizes.large,
    buttons: [c, u]
  });
  Yt = d;
  const m = () => {
    d.updateComplete.then(() => {
      d.querySelector('button[name="apply"]')?.toggleAttribute("disabled", a().length === 0);
    });
  };
  m(), d.updateComplete.then(() => {
    d.querySelector(".modal-footer")?.prepend(s);
  }), i.addEventListener("change", () => {
    const h = a(), v = h.filter(({ allow: f }) => f).length;
    s.textContent = Vo(v, h.length - v), m();
  });
}
function Vo(e, t) {
  return [
    ...e > 0 ? [P(g("platform.waiting"), e)] : [],
    ...t > 0 ? [P(g("platform.going"), t)] : []
  ].join(`
`);
}
function Ho({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function zn(e, t) {
  return re(F.allow_modules, { group: e, operations: [...t] }, (n) => {
    n.alsoAllowed.forEach((r) => {
      Oe.info(P(g("allowModules.alsoAllowed"), r));
    });
  });
}
async function Yo(e, t) {
  const n = await Fe(e);
  if (n === null)
    return;
  const r = await ge(new Y(D(F.modules_outside_menu)).get());
  if (r === null)
    return;
  const o = new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => W(i)).map(([i]) => i));
  qt(r, t, o, async (i) => await zn(e, i.map(({ value: a, allow: c }) => ({ module: a, allow: c }))) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => i === Et).map(([i]) => i)));
}
const Vn = "data-modulemenu-identifier", We = `[${Vn}]:not([aria-controls])`, Hn = ".modulemenu-group-container";
let ke = !1;
const at = /* @__PURE__ */ new WeakMap();
let de = null;
const $e = Tn(560);
function Jo(e, t, n) {
  const r = y().groupId, o = oe(e, r) ?? "", i = [...t.querySelectorAll(We)], s = i.filter(($) => W(Q($))), a = i.filter(($) => Q($) === Z), c = Jt(e, l.facePreview, g("platform.preview"), P(g("allowModules.previewFor"), o)), u = Jt(e, l.facePick, g("platform.pick"), P(g("allowModules.pickFor"), o)), m = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  m.className = l.coin, m.replaceChildren(c.sheet, u.sheet);
  const v = e.querySelector(`.${l.allowed}`) ?? e.createElement("div");
  v.className = l.allowed, m.parentElement !== v && v.replaceChildren(m);
  const f = Xo(e, t);
  v.parentElement !== f && f.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    f.classList.add(l.panelCardTurned);
  });
  const b = ($) => {
    ke = $, m.classList.toggle(l.coinTurned, $), c.sheet.toggleAttribute("inert", $), u.sheet.toggleAttribute("inert", !$);
  }, w = ($) => {
    const C = $.filter((x) => x.allow).map((x) => x.module);
    r !== null && y().groupId === r && (yt() || (C.forEach((x) => {
      $e.add(x);
    }), zn(r, $).then((x) => {
      if (x !== "taken") {
        C.forEach((G) => {
          $e.delete(G);
        }), $t(ke ? N : k, x);
        return;
      }
      b(!1), X("permissions-written", {});
    })));
  }, k = xe(c.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      Qe(c.scroll).forEach(($) => {
        $.classList.remove(l.faceMarked);
      }), _();
    },
    apply: () => {
      w(Qe(c.scroll).map(($) => ({ module: Ie($), allow: !1 })));
    }
  }), E = () => {
    Qt(u.scroll, t, _), _(), b(!1);
  }, N = xe(u.foot, {
    label: g("platform.doAllow"),
    cancel: E,
    apply: () => {
      const $ = Xt(u.scroll).filter((C) => Q(C) !== at.get(C));
      w($.map((C) => ({ module: Ie(C), allow: !0 })));
    }
  }), _ = () => {
    const $ = Xt(u.scroll), C = $.filter((I) => Q(I) !== at.get(I)), x = $.filter((I) => W(Q(I)) && !C.includes(I)).length, G = z("allowModules.tally", $.length, x, $.length);
    U.textContent = G;
    const K = Qe(c.scroll);
    k.state.textContent = K.length === 0 ? G : z("allowModules.marked", a.length, K.length, a.length);
    const A = K.map(Ie), q = n.filter(({ verdict: I, parent: ee }) => W(I) && A.includes(ee)).map(({ label: I }) => P(g("allowModules.alsoRemoved.name"), I));
    k.waiting.textContent = q.length === 0 ? "" : z("allowModules.alsoRemoved", q.length, q.join(", ")), k.ready(K.length > 0, K.length > 0), N.state.textContent = "", N.waiting.textContent = C.length === 0 ? "" : P(g("platform.waiting"), C.length), N.ready(C.length > 0, !0);
  };
  c.bar.append(
    te(e, g("allowModules.allow"), "btn btn-default", () => {
      b(!0);
    }),
    O(e, l.faceHint, g("allowModules.hint"))
  );
  const T = e.createElement("div");
  T.className = l.faceChoice;
  const U = O(e, l.faceCounted, "");
  T.append(U), T.append(te(e, g("allowModules.outside"), "btn btn-default", () => {
    r !== null && Yo(r, o);
  }));
  const S = n.filter(({ verdict: $ }) => W($)).length;
  T.append(O(e, l.faceCounted, z("allowModules.outside.tally", n.length, S, n.length))), u.sheet.insertBefore(T, u.foot), u.scroll.style.setProperty("--vperm-queued-note", `"${g("platform.toAllow")}"`), Zo(e, c.scroll, s, g("platform.from"), _), Qt(u.scroll, t, _), _(), b(ke), $e.start(() => {
    m.querySelectorAll(`.${l.facePreview} ${We}`).forEach(($) => {
      $.classList.toggle(l.justAdded, $e.isLit(Ie($)));
    });
  }), de?.abort(), de = new AbortController(), At(e, de.signal, () => ke, E), In(r, [k, N], de.signal);
}
function Qo(e, t) {
  de?.abort(), de = null, ke = !1, $e.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.allowed}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, Fn);
  }));
}
function Xo(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Jt(e, t, n, r) {
  const o = Mn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function Zo(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(Hn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(O(e, l.allowedGroup, a)));
    const c = ni(s);
    c.getAttribute(p.verdict) === Z ? Jn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(O(e, l.allowedFrom, r)), t.append(c);
  });
}
function Qt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(Hn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(We).forEach((r) => {
    Yn(r), at.set(r, Q(r)), W(Q(r)) && r.setAttribute("aria-disabled", "true"), Jn(r, () => {
      ti(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(O(r.ownerDocument, l.allowedGroup, r.getAttribute("title") ?? ""));
  });
}
function ei(e) {
  const t = Q(e);
  return e.getAttribute("aria-disabled") === "true" || !Ct(t) ? "" : W(t) ? "unpick" : "allow";
}
function ti(e) {
  const t = ei(e);
  t !== "" && e.setAttribute(p.verdict, t === "allow" ? Z : ve);
}
function Yn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function ni(e) {
  const t = e.cloneNode(!0);
  return Yn(t), t;
}
function Jn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function Qe(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function Xt(e) {
  return [...e.querySelectorAll(We)].filter((t) => Ct(Q(t)));
}
const Q = (e) => e.getAttribute(p.verdict) ?? "", Ie = (e) => e.getAttribute(Vn) ?? "", Xe = "#modulemenu", Qn = "data-modulemenu-identifier", ri = `[${Qn}]:not([aria-controls])`;
function oi(e, t) {
  const n = kt();
  let r = null, o = 0;
  const i = async () => {
    const u = ++o, { active: d, groupId: m, area: h } = y();
    if (!d || m === null || h !== "modules") {
      n.drop(), e.querySelectorAll(`${Xe} [${p.verdict}]`).forEach((E) => {
        E.removeAttribute(p.verdict);
      }), s(e);
      return;
    }
    const v = e.querySelector(Xe);
    if (v === null)
      return;
    const f = [...v.querySelectorAll(ri)];
    if (f.length === 0)
      return;
    const b = await n.inspect(m);
    if (b === null)
      return;
    const { scopes: w } = b;
    Object.entries(w.modules.targets).forEach(([E, N]) => {
      f.filter((_) => _.getAttribute(Qn) === E).forEach((_) => {
        _.setAttribute(p.verdict, N);
      });
    }), r ??= ge(new Y(D(F.modules_outside_menu)).get());
    const k = await r;
    if (k === null) {
      r = null;
      return;
    }
    u === o && Jo(e, v, k.groups.flatMap(({ values: E }) => E.map(({ value: N, label: _, parent: T }) => ({
      verdict: w.modules.targets[N],
      parent: T,
      label: _
    }))));
  }, s = (u) => {
    const d = u.querySelector(Xe);
    d !== null && Qo(u, d);
  };
  let a = null;
  const c = ({ active: u, groupId: d, area: m }) => {
    const h = `${String(u)}:${String(d)}:${m}`;
    h !== a && (a = h, i());
  };
  c(y()), J("permissions-written", () => void i(), t), L(c, t);
}
async function ii(e, t, n, r) {
  const o = await re(F.allow_tables, { group: e, operations: [{ table: t, select: n, modify: r }] });
  return o === "taken" && X("permissions-written", {}), o;
}
const si = ["none", "select", "modify"];
function Xn(e, { groupId: t, table: n, called: r, verdict: o, reads: i }) {
  const s = (h) => h === Et || h === jn, a = s(o) ? 2 : s(i) ? 1 : 0, c = Math.max(o === Z ? 2 : i === Z ? 1 : 0, a), u = e.createElement("div");
  u.className = `callout callout-notice callout-sm ${l.tableGate}`, u.append(O(e, l.tableName, r)), u.append(O(e, l.tableToken, n));
  const d = O(e, "callout-body", o === Ue ? g("allowTables.adminOnly") : "");
  if (u.append(d), o === Ue)
    return u;
  const m = e.createElement("div");
  return m.className = `btn-group btn-group-sm ${l.tableLevels}`, m.setAttribute("role", "radiogroup"), m.setAttribute("aria-label", r), m.append(...si.map((h, v) => {
    const f = e.createElement("button");
    return f.type = "button", f.className = "btn btn-default", f.setAttribute("role", "radio"), f.setAttribute("aria-checked", String(v === c)), f.textContent = (v === a && a > 0 ? "↳ " : "") + g(`be_groups.tables_modify.permissions.${h}`), f.disabled = v < a, f.title = v < a ? g("allowTables.inherited") : "", f.addEventListener("click", () => {
      if (v === c)
        return;
      const b = [...m.querySelectorAll("button")];
      b.forEach((w) => {
        w.disabled = !0;
      }), ii(t, n, v >= 1, v >= 2).then((w) => {
        b.forEach((k, E) => {
          k.disabled = E < a;
        }), w !== "taken" && w !== "cancelled" && (d.textContent = g(`platform.${w}`));
      });
    }), f;
  })), u.append(m), u;
}
const Zt = ".typo3-TCEforms";
function ai(e) {
  let t = null, n = 0;
  const r = async () => {
    if (t === null)
      return;
    const i = t, s = ++n, a = () => {
      i.querySelectorAll(`.${l.tableGate}:not(.${l.nothingTheirs})`).forEach((w) => {
        w.remove();
      });
    }, { active: c, area: u, face: d, groupId: m } = y();
    if (!c || u !== "fields" || d !== "pick" || m === null) {
      a();
      return;
    }
    const h = /* @__PURE__ */ new Map();
    i.querySelectorAll(`[${p.inside}]`).forEach((w) => {
      const k = w.getAttribute(p.inside) ?? "", E = k === "" ? w.closest(Zt) : i.querySelector(`[${p.field}='${k}']`), N = w.getAttribute(p.token) ?? "";
      E !== null && h.set(E, je(N));
    });
    const v = await Fe(m, [...new Set(h.values())]);
    if (s !== n || (a(), v === null))
      return;
    const { named: f, targets: b } = v.scopes.tablesModify;
    h.forEach((w, k) => {
      const E = b[w];
      if (![Z, Et, jn, ve].some((U) => U === E))
        return;
      const N = v.scopes.tablesSelect.targets[w], _ = Xn(i, { groupId: m, table: w, called: f[w] ?? w, verdict: E, reads: N }), T = k.matches(Zt) ? null : k.querySelector(".form-irre-object");
      if (T === null) {
        k.prepend(_);
        return;
      }
      T.before(_);
    });
  };
  B((i) => {
    t = i.doc, r();
  }, e), J("permissions-written", () => void r(), e);
  let o = null;
  L(({ active: i, groupId: s, area: a, face: c }) => {
    const u = `${String(i)}:${String(s)}:${a}:${c}`;
    u !== o && (o = u, r());
  }, e);
}
const li = ".form-group";
function Zn(e) {
  return e.closest(li);
}
function ci(e) {
  lo({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !W(s)).forEach(([s]) => {
        t.querySelectorAll(`[${p.token}^='${s}:']`).forEach((a) => {
          Se(a.closest(i) ?? Zn(a) ?? a);
        }), o === "preview" && ui(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o, i) => Xn(t, { groupId: y().groupId ?? 0, table: n, called: o, verdict: r, reads: i })
  }, e);
}
function ui(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${p.token}^='${t}:']:not([${p.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(p.inside) ?? "", s = e.querySelector(`[${p.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(O(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      P(g("allowTables.gone"), n)
    ));
  });
}
async function di(e, t, n) {
  return re(e === "pageTypes" ? F.allow_page_types : F.allow_values, {
    group: t,
    operations: [...n]
  });
}
function pi(e) {
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
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = g(`allowedValues.choose.${ao(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(p.choices) ?? "{}"), u = y().groupId ?? 0;
        Fe(u).then((d) => {
          if (d === null)
            return;
          const m = i.getAttribute(p.allows) === "pageTypes" ? "pageTypes" : "fieldValues", h = m === "pageTypes" ? "" : `${s}:`, v = new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => W(f)).map(([f]) => f.substring(h.length)));
          qt(c, oe(document, u) ?? "", v, async (f) => await di(m, u, f.map(({ value: w, allow: k }) => ({ value: `${h}${w}`, allow: k }))) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => W(f) && f !== Z).map(([f]) => f.substring(h.length))));
        });
      }), i.after(a);
    });
  };
  B((r) => {
    t = r.doc, n();
  }, e), L(n, e);
}
const fi = `[${p.verdict}='${ve}'], [${p.verdict}='${Ue}']`;
function mi(e) {
  co({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(fi).forEach((o) => {
        Se(Zn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        O(t, "callout-body", P(g("allowFields.recordNoFields"), o)),
        te(t, g("recordForm.add"), "btn btn-default btn-sm", () => {
          Ee(t, () => {
            pe("pick");
          });
        })
      ), i;
    }
  }, e);
}
async function hi(e, t) {
  const n = await Fe(e);
  if (n === null)
    return;
  const r = await ge(new Y(D(F.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  qt(r, t, o, async (i) => await re(F.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== Z).map(([i]) => i)));
}
const er = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: le.folderTree,
  base: Lr,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = D(F.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: D("filestorage_tree_rootline"),
      filterUrl: D("filestorage_tree_filter"),
      showIcons: !0
    };
  },
  write: async (e, t, n, r) => re(F.mount_folders, {
    group: e,
    operations: t.map((o) => ({
      folder: decodeURIComponent(o),
      mount: n,
      // A folder with an existing record needs no new title; the backend keeps the one it has
      title: r.get(o) ?? ""
    }))
  }),
  choice: (e, t) => te(
    e,
    g("mountBranches.folders.chooseOperations"),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    "btn btn-default",
    () => {
      hi(t, oe(e, t) ?? "");
    }
  )
}, tr = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: le.pageTree,
  base: Nr,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => ({ ...await (await new Y(D("page_tree_browser_configuration")).get()).resolve(), rootlineUrl: D("page_tree_rootline") }),
  write: async (e, t, n) => re(F.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function gi(e, t) {
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
function vi(e) {
  const t = /* @__PURE__ */ new Map();
  return nr(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function bi(e, t) {
  const n = nr(e);
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
const nr = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ce = Tn(520), j = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), H = /* @__PURE__ */ new Set(), Ge = /* @__PURE__ */ new Set(), lt = /* @__PURE__ */ new Set(), rr = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, or = (e) => H.has(e) && !Ge.has(e), ir = (e) => e.__parents ?? [], qe = (e) => ir(e).some((t) => H.has(t)), wi = (e, t) => t.some((n) => H.has(n.identifier) && ir(n).includes(e.identifier)), sr = (e) => e.detail;
function yi(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = sr(o);
    s === !1 || rr(i.identifier) || H.has(i.identifier) || qe(i) || (V.has(i.identifier) ? V.delete(i.identifier) : V.add(i.identifier), t(), Ze(Be(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Be(e);
    o !== null && (!Pe.has(o) || e.querySelector(".node[data-id='0']") !== null) && Ze(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), Ze(Be(e));
}
function ki(e) {
  const t = Be(e);
  if (t === null)
    return;
  const n = Pe.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), Pe.delete(t), t.requestUpdate());
}
function Ze(e) {
  if (e !== null) {
    if (en(e.nodes), !Pe.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      Pe.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => en(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return H.has(r.identifier) && o.push(l.mountAlready), V.has(r.identifier) && o.push(l.mountPicked), rr(r.identifier) && o.push(l.mountWhole), o;
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
const Pe = /* @__PURE__ */ new WeakMap(), Be = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let et = "", tn = () => {
};
async function $i(e, t, n, { groupId: r, kind: o, showCount: i }) {
  tn = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), et = s;
    return;
  }
  const a = o.tree;
  if (Ai(a, o.base), t.querySelector(a) !== null && et === s)
    return;
  let u;
  try {
    u = await o.rootedAt(r);
  } catch {
    Oe.error(g("platform.notRead"));
    return;
  }
  const d = e.createElement(a);
  d.addEventListener("mousedown", (h) => {
    const v = h.target instanceof Element ? h.target.closest(".node") : null;
    v !== null && (or(v.getAttribute("data-id") ?? "") || h.preventDefault());
  }), d.addEventListener("typo3:tree:node-selected", (h) => {
    h.stopPropagation();
    const { node: v, propagate: f } = sr(h);
    f !== !1 && (j.has(v.identifier) ? j.delete(v.identifier) : j.add(v.identifier), ct(e), tn());
  }), Object.assign(d, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(d), t.replaceChildren(m), et = s, Object.assign(d, { setup: u });
}
function ct(e) {
  e.querySelector(
    `.${l.facePreview} :is(${le.pageTree}, ${le.folderTree})`
  )?.requestUpdate();
}
function Ai(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return or(n.identifier);
    }
    // Core loads the first levels only, so a deeper mount needs the way down to it loaded
    async loadData() {
      await super.loadData();
      const n = [...H].filter((r) => !this.nodes.some((o) => o.identifier === r));
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
      !qe(n) && !H.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return qe(n) && r.push(l.mountInside), !qe(n) && !H.has(n.identifier) && r.push(l.mountContext), Ge.has(n.identifier) && r.push(l.mountInherited), j.has(n.identifier) && r.push(l.faceMarked), lt.has(n.identifier) && r.push(l.mountUnseen), Ce.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function nn(e) {
  return e.forEach((t) => {
    qe(t) || H.has(t.identifier) || (t.__expanded = !0, t.__hidden = !wi(t, e));
  }), e;
}
function Si(e, t, n, r) {
  const o = (u) => g(`${r}.${u}`);
  if (t.sheet.querySelector(`.${l.unseenPages}`)?.remove(), n.length === 0)
    return;
  const i = e.createElement("div");
  i.className = l.unseenPages;
  const s = e.createElement("b");
  s.textContent = z(`${r}.unseen`, n.length, n.length);
  const a = e.createElement("p");
  a.append(s, ` ${o("unseenWhy")}`);
  const c = e.createElement("ul");
  n.forEach(({ page: u, title: d, link: m }) => {
    const h = e.createElement("a");
    h.href = m, h.addEventListener("click", (f) => {
      f.preventDefault(), yn.update("web", u, !0), Ke.App.showModule("permissions_pages");
    }), h.setAttribute("aria-label", P(o("unseenLink"), d)), h.textContent = P(o("unseenPage"), d);
    const v = e.createElement("li");
    v.append(h), c.append(v);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let Ae = !1, ut = null, Le = null;
function Ei(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (S) => g(`${i}.${S}`), a = oe(e, r) ?? "", c = qi(e, t);
  ut !== r && (j.clear(), V.clear(), ut = r), Le?.abort(), Le = new AbortController();
  const { signal: u } = Le, d = rn(e, c, l.facePick), m = rn(e, c, l.facePreview);
  m.eyebrow.textContent = g("platform.preview"), m.sentence.textContent = P(s("previewFor"), a), d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = P(s("pickFor"), a);
  const h = n.order;
  H.clear(), Ge.clear(), Object.entries(n.targets).forEach(([S, $]) => {
    H.add(S), Ct($) || (Ge.add(S), j.delete(S));
  });
  const v = (S) => {
    m.sheet.toggleAttribute("inert", S), d.sheet.toggleAttribute("inert", !S);
  }, f = (S) => {
    Ae = S, c.classList.toggle(l.panelCardTurned, !S), v(S);
  };
  v(Ae);
  const b = () => {
    const S = z(`${i}.tally`, h.length, h.length);
    k.state.textContent = j.size === 0 ? S : z(`${i}.marked`, h.length, j.size, h.length), k.ready(j.size > 0, j.size > 0), U.state.textContent = S, U.waiting.textContent = V.size === 0 ? "" : P(g("mountBranches.waiting"), V.size), U.ready(V.size > 0, !0);
  }, w = (S, $) => {
    if (y().groupId !== r)
      return;
    const C = [...S];
    if (C.length === 0 || yt())
      return;
    const x = o.write(r, C, $, vi(d.sheet));
    $ && C.forEach((G) => {
      Ce.add(G);
    }), x.then((G) => {
      if (G !== "taken") {
        C.forEach((K) => {
          Ce.delete(K);
        }), $t($ ? U : k, G);
        return;
      }
      C.forEach((K) => S.delete(K)), N(), f(!1), X("permissions-written", {});
    });
  }, k = xe(m.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      j.clear(), ct(e), b();
    },
    apply: () => {
      w(j, !1);
    }
  }), E = new Set(Object.keys(n.named)), N = () => {
    d.sheet.querySelector(`.${l.naming}`)?.remove(), d.scroll.hidden = !1, d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = P(s("pickFor"), a);
  }, _ = () => {
    const S = [...V].filter((C) => !E.has(C)), $ = d.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && S.length > 0 && !$) {
      const C = gi(e, S);
      C.addEventListener("submit", (x) => {
        x.preventDefault(), _();
      }), C.addEventListener("input", () => {
        U.ready(T(), !0, !0);
      }), d.eyebrow.textContent = s("name"), d.sentence.textContent = s("nameFor"), d.scroll.hidden = !0, d.sheet.insertBefore(C, d.foot), C.querySelector("input")?.focus();
      return;
    }
    if ($ && !T()) {
      d.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    w(V, !0);
  }, T = () => bi(d.sheet, s("nameWhy")), U = xe(d.foot, {
    label: g("mountBranches.doAdd"),
    cancel: () => {
      V.clear(), N(), f(!1), b();
    },
    apply: _
  });
  if (d.scroll.style.setProperty("--vperm-queued-note", `"${g("mountBranches.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), lt.clear(), n.unseen.forEach(({ page: S }) => {
    lt.add(String(S));
  }), Si(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const S = e.createElement("div");
    S.className = l.faceChoice, S.append(o.choice(e, r)), m.sheet.insertBefore(S, m.foot);
  }
  $i(e, m.scroll, h, { groupId: r, kind: o, showCount: b }), yi(d.sheet, b, u), b(), Ce.start(() => {
    ct(e);
  }), At(e, u, () => Ae, () => {
    if (d.sheet.querySelector(`.${l.naming}`) !== null) {
      N();
      return;
    }
    f(!1);
  }), In(r, [k, U], u), m.bar.replaceChildren(
    m.eyebrow,
    m.sentence,
    te(e, s("add"), "btn btn-default", () => {
      f(!0);
    }),
    O(e, l.faceHint, s("hint"))
  ), window.requestAnimationFrame(() => {
    f(Ae);
  });
}
function Ci(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  Ae = !1, j.clear(), ut = null, Ce.stop(), Le?.abort(), Le = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), ki(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, Fn));
}
function qi(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function rn(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return Li(r);
  const o = Mn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function Li(e) {
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
const Ni = { pageMounts: tr, fileMounts: er };
function _i(e, t) {
  const n = kt();
  let r = 0, o = null;
  const i = async () => {
    o = null;
    const { active: a, groupId: c, area: u } = y(), d = Ni[u];
    if (!a || c === null || d === void 0) {
      n.drop(), Ci(e);
      return;
    }
    const h = e.querySelector(d.component);
    if (h === null)
      return;
    r += 1;
    const v = await n.inspect(c);
    if (r -= 1, v === null) {
      e.querySelector(`${d.component} > .${l.panelCard}`) === null && (o = c);
      return;
    }
    Ei(e, h, d.mounted(v.scopes), { groupId: c, kind: d });
  }, s = new MutationObserver(() => {
    r > 0 || y().groupId === o || [tr, er].every(({ component: a }) => e.querySelector(`${a} > .${l.panelCard}`) === null) && i();
  });
  s.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    s.disconnect();
  }), i(), J("permissions-written", () => void i(), t), L(() => void i(), t);
}
let dt = null;
function ar(e) {
  dt = e, Ke.App.showModule(e);
}
function Oi(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function xi(e) {
  const t = dt === e;
  return dt = null, t;
}
const Ne = "other", on = ["modules", "pageMounts", "fileMounts", "fields", Ne], Pi = 10, se = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Ne]: "module"
}, Fi = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function Mi(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", g("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(p.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const b = lr(e);
    if (b.forEach((A) => {
      v.observe(A);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = b.map((A) => ie(A)), k = [...on, ...w.filter((A) => !on.includes(A))], E = w.includes("fields") ? [Ne] : [], N = b.filter((A) => A.getBoundingClientRect().width !== 0).map(ie), _ = N.includes("fields") ? [...N, Ne] : N, [T] = _.includes("fields") ? ["fields"] : _, U = _.find((A) => se[A] !== void 0 && se[A] === se[f.picked]), S = _.includes(f.picked) ? f.picked : U ?? T;
    if (_.join() !== i && (i = _.join(), S !== void 0 && S !== f.area)) {
      Br(S);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap((A) => [zi(e, A), Ki(e, A)]),
      ...k.map((A) => Ii(e, A, g(`pickAnArea.${A}`)))
    )), n.parentElement === null && Ti(e).append(n);
    const $ = f.area === Ne ? "fields" : f.area;
    Bi(n, e), Ui(n, e, b.find((A) => ie(A) === $) ?? null);
    const C = f.area !== "fields";
    b.forEach((A) => {
      const q = ie(A), I = q === $, ee = C && !I && q !== "modules", ue = Re(n, q);
      ue?.setAttribute("aria-selected", String(q === f.area)), Ri(ue, A), A.toggleAttribute(p.armed, I), A.toggleAttribute("inert", ee), r.add(A), Vi(Yi(n, q), A, ee), ji(Ji(n, q), A, I, b);
    });
    let x = 0, G = null;
    k.forEach((A) => {
      const q = Re(n, A);
      if (q === null)
        return;
      const I = q.hidden ? 0 : q.getBoundingClientRect().width, ee = b.find((Sr) => ie(Sr) === A), ue = ee ?? Hi(A, b), He = Math.max(x, ue?.getBoundingClientRect().left ?? x);
      q.style.setProperty("--vperm-host-x", `${String(He)}px`);
      const Tt = ue?.getBoundingClientRect().right;
      Tt !== void 0 && q.style.setProperty("--vperm-tab-room", `${String(Tt - He)}px`), q.toggleAttribute(p.elsewhere, ee === void 0), ee === void 0 && (q.setAttribute("aria-selected", String(A === f.area)), Me(q, ue ?? G ?? q)), x = q.hidden ? x : He + I + Pi, G = q;
    });
    const K = Re(n, "fields");
    E.forEach((A) => {
      const q = Re(n, A);
      q === null || K === null || (q.setAttribute("aria-selected", String(A === f.area)), q.hidden = K.hidden);
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
    const b = f.detail.module ?? "", w = xi(b);
    if (!m) {
      m = !0;
      return;
    }
    !w && se[y().picked] === "tree" && Ln("fields");
  };
  e.addEventListener("typo3-module-loaded", h, { signal: t }), d.observe(e.body, { childList: !0, subtree: !0 });
  const v = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    d.disconnect(), v.disconnect(), window.cancelAnimationFrame(c);
  }), L(a, t), a(y());
}
const Ti = (e) => e.querySelector(".scaffold") ?? e.body;
function Ii(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(p.area, t), r.setAttribute(p.label, n), r.title = n, r.append(O(e, l.tabLabel, n)), r.addEventListener("click", () => {
    Ln(t);
    const o = Fi[t];
    o !== void 0 && lr(e).every((i) => ie(i) !== t) && ar(o);
  }), r;
}
function Ri(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, Me(e, t));
}
const Me = (e, t) => {
  e.setAttribute(p.ground, t.getAttribute(p.ground) ?? "");
}, Di = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Bi(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function Ui(e, t, n) {
  const r = Wi(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, Me(r, n), Lt(r, n);
}
function Lt(e, t) {
  const n = t.getBoundingClientRect(), r = Di(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function ji(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  Me(e, t), e.hidden = o.width === 0 || o.left === 0 || n || _n(t.ownerDocument) === 0 || Gi(o, r), Lt(e, t);
}
function Wi(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Gi(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function Ki(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(p.area, t), n;
}
function zi(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(p.area, t), n;
}
function Vi(e, t, n) {
  e !== null && (e.hidden = !n, n && (Me(e, t), Lt(e, t)));
}
const Hi = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  se[e] === void 0 ? void 0 : t.find((n) => se[ie(n)] === se[e])
), Re = (e, t) => e.querySelector(`.${l.tab}[${p.area}="${t}"]`), Yi = (e, t) => e.querySelector(`.${l.areaCover}[${p.area}="${t}"]`), Ji = (e, t) => e.querySelector(`.${l.tabSeam}[${p.area}="${t}"]`);
function lr(e) {
  return [...e.querySelectorAll(`.${l.frame}[${p.area}]`)];
}
const ie = (e) => e.getAttribute(p.area) ?? "", cr = "#modulemenu", Qi = `${cr} .modulemenu-group-container.collapse:not(.show)`, Xi = `${cr} [aria-controls]`, Zi = "typo3-backend-content-navigation[navigation-collapsed]", sn = "navigation-collapsed";
function es(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = y();
    o && ns(e, n), o && i === "modules" && ts(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    y().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), L(r, t);
}
function ts(e, t) {
  e.querySelectorAll(Qi).forEach((n) => {
    n.classList.add("show"), an(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), an(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Xi).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function ns(e, t) {
  e.querySelectorAll(Zi).forEach((n) => {
    n.toggleAttribute(sn, !1), t.push(() => {
      n.toggleAttribute(sn, !0);
    });
  });
}
function an(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const rs = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", ln = "scaffold-content-navigation-expanded";
function os(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(ln);
    }), n = y().active ? [...e.querySelectorAll(rs)] : [], n.forEach((o) => {
      o.classList.add(ln);
    });
  };
  r(), L(r, t);
}
const ur = (e) => [...e, "web_list"], _e = ur(["web_layout", "records", "media_management", "permissions_pages"]), dr = "vperm.module";
function is(e, t) {
  let n = null;
  const r = (i) => {
    cs(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || _e.includes(as(e))))
      return;
    const a = us() ?? _e[0] ?? "", c = vt(e);
    if ((c !== "" || Mr(e)) && i.area === "fields") {
      Oi(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        ss(e, c);
      },
      { once: !0, signal: t }
    ), ar(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    y().active && _e.includes(s) && me(dr, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), L(r, t);
}
async function ss(e, t) {
  const n = ce(e), r = await On(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function as(e) {
  return Ke.App.getCurrentModule() ?? ce(e)?.getAttribute("module") ?? "";
}
const pr = "[data-modulemenu-identifier]:not([aria-controls])", ls = `#modulemenu ${pr}`;
function cs(e, t) {
  e.querySelectorAll(ls).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !_e.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(pr)].every((r) => r.parentElement?.hidden === !0);
  });
}
function us() {
  const e = fe.get(dr);
  return typeof e == "string" && _e.includes(e) ? e : void 0;
}
function ds(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function ps(e) {
  B(({ doc: t }) => {
    t.querySelectorAll(".module-docheader-bar-navigation").forEach((n) => {
      n.classList.add("module-docheader-navigation");
    }), t.querySelectorAll(".module-docheader-bar-navigation > .module-docheader-bar-column-left").forEach((n) => {
      n.classList.add("module-docheader-column-breadcrumb");
    }), t.querySelectorAll(".module-docheader-bar-buttons").forEach((n) => {
      n.classList.add("module-docheader-buttons");
    });
  }, e);
}
function fs(e) {
  B(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const ms = "[data-object-id]";
function fr(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = y();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), hs(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), gs(a), mr(a, e));
    });
  };
  B((i) => {
    n = i.doc, o();
  }, t), L(o, t);
}
function hs(e, t) {
  e.querySelectorAll(ms).forEach((n) => {
    vs(n) && (bs(n), n.matches(t.shut) || mr(n, t));
  });
}
function mr(e, t) {
  e.querySelector(t.opener)?.click();
}
const Nt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function gs(e) {
  ae.set(Nt(e), "folded");
}
function vs(e) {
  return ae.isset(Nt(e));
}
function bs(e) {
  ae.unset(Nt(e));
}
function ws(e) {
  fr({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function ys(e, t) {
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
    re(F.write_other_permissions, v).then((f) => {
      if (u.setAttribute("identifier", "actions-document-save"), c.disabled = m !== d, f === "taken") {
        Oe.success(g("notification.record_saved.title.singular"));
        return;
      }
      f !== "cancelled" && Oe.error(g("editOtherPermissions.notSaved"));
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
    w !== d && (d = w, c.disabled = !0, s.textContent = oe(e, w) ?? "", ks(w).then((k) => {
      if (w === d) {
        if (k === null) {
          d = null, n.remove();
          return;
        }
        r.replaceChildren(e.createRange().createContextualFragment(k.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${p.area}="fields"]`)?.append(n), new _r().processItems([...k.scriptItems]);
      }
    }));
  };
  h(y()), L(h, t);
}
async function ks(e) {
  return ge(new Y(D(F.other_permissions)).withQueryArguments({ group: e }).get());
}
const _t = '.form-group:has(> select[name="_langSelector"])', pt = /* @__PURE__ */ new WeakMap();
function $s(e, t) {
  const n = e.querySelector(`.module-docheader ${_t}`);
  n !== null && (pt.has(n) || pt.set(n, n.parentElement), t.after(n));
}
function As(e) {
  const t = e.querySelector(`.module-docheader ${_t}`);
  t !== null && pt.get(t)?.append(t);
}
const Ss = (e) => `${e}, ${_t}`, Es = ".module-docheader-navigation > .module-docheader-column-breadcrumb", cn = ".module-docheader-buttons .btn-toolbar > *", Cs = ".t3js-editform-close", qs = Ss(`.${l.headButton}, .${l.showMenu}, .${l.typeSwitch}`), Ls = 'form[name="editform"] h1';
function Ns(e, t) {
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
    const a = i.querySelector(Cs), c = y().face === "preview" ? a : null;
    if (i.querySelectorAll(cn).forEach((f) => {
      f.toggleAttribute("hidden", s && !f.matches(qs) && !f.contains(c));
    }), i.querySelectorAll(Ls).forEach((f) => {
      f.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${p.token}][${p.inside}='']:not([${p.outOfReach}])`) !== null;
    if (!u && y().face === "pick") {
      Ee(i, () => {
        pe("preview");
      });
      return;
    }
    const d = y().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      O(i, l.faceEyebrow, g(d ? "platform.preview" : "platform.pick")),
      O(i, l.faceSentence, P(
        g(d ? "recordForm.previewFor" : "recordForm.pickFor"),
        oe(e, y().groupId) ?? ""
      ))
    ), i.querySelector(Es)?.append(m), !d || !u)
      return;
    const h = te(
      i,
      g("recordForm.add"),
      `btn btn-default btn-sm ${l.headButton}`,
      () => {
        Ee(i, () => {
          pe("pick");
        });
      },
      "actions-check-square"
    );
    [...i.querySelectorAll(cn)].find((f) => f.contains(a))?.after(h);
  };
  B((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && At(
      i.doc,
      t,
      () => y().face === "pick",
      () => {
        Ee(i.doc, () => {
          pe("preview");
        });
      }
    );
  }, t), J("fields-judged", o, t), L(o, t);
}
const un = `[${p.token}]`;
function _s(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(un)];
    Gt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(un)];
      Os(s, i) || (i = s, Gt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const Os = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function xs(e, t) {
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
  r(), L(r, t);
}
const Ps = ur(["records"]);
function Fs(e, t) {
  let n = y().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && Ps.includes(Ke.App.getCurrentModule() ?? "");
  L(({ active: o }) => {
    o !== n && Tr().then(() => {
      r() && Or.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function Ms(e, t) {
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
const Ts = ".module-docheader-buttons .btn-toolbar", dn = "vperm.show", pn = "vperm.identify", fn = (e, t, n) => {
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
function Is(e) {
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
      o.body.removeAttribute(p.show), As(o);
      return;
    }
    gn(o, ae.get(dn) === "list"), hn(o, ae.get(pn) === "said");
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(hr(o, "actions-filter"), ` ${g("recordForm.show")}`);
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
    ), i.append(s, a), o.querySelector(Ts)?.append(i), $s(o, i);
  };
  B((o) => {
    t = o.doc, r();
  }, e), J("fields-judged", r, e), L(r, e);
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
function hr(e, t) {
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
  s.className = "dropdown-item-status", i.append(s, hr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), mn(i, r());
  }), mn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function Rs(e) {
  return tt.normalizedCtrlModifierKey === kn.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function Ot(e, t, n, r = !1) {
  if (e !== "") {
    if (t !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = Rs(e), t.append(o);
    }
    tt.register(
      [tt.normalizedCtrlModifierKey, kn.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t ?? void 0 }
    );
  }
}
function Ds(e) {
  Ot(TYPO3.settings.visualPermissions?.toggleKey ?? "", e.querySelector(`[${p.toggle}]`), () => {
    if (y().active) {
      bt();
      return;
    }
    qn();
  }, !0);
}
function Bs(e, t) {
  const n = e.querySelector(`[${p.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(y()), n.addEventListener("click", () => {
    if (y().active) {
      bt();
      return;
    }
    qn();
  }, { signal: t }), L(r, t);
}
function Us(e) {
  fr({
    shut: "[data-object-id]:has(> .panel-heading .panel-button.collapsed)",
    opener: ":scope > .panel-heading .panel-button"
  }, e);
}
function be(e, t) {
  try {
    sessionStorage.setItem(e, t);
  } catch {
  }
}
function we(e) {
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
const gr = 600, js = 250, Ws = 2e3, Gs = 320, Pt = "vperm.arriving";
function Ks() {
  return TYPO3.settings.visualPermissions?.animation !== !1;
}
function vr(e, t, n) {
  if (!Ks()) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  be(Pt, t), e.body.setAttribute(p.leaving, t), e.body.addEventListener("animationend", (i) => {
    i.target === e.body && o();
  }), window.setTimeout(o, gr);
}
function zs(e) {
  e.body.setAttribute(p.settling, "");
}
function Vs(e) {
  const t = Hs();
  if (t === null)
    return;
  xt(Pt), e.body.setAttribute(p.settling, ""), e.body.setAttribute(p.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(p.settling), e.body.removeAttribute(p.arriving), e.body.setAttribute(p.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(p.unwrapping);
    }, Gs));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", (d) => {
    d.target === e.body && a();
  }), window.setTimeout(a, gr);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, js);
  }, { signal: i.signal }), window.setTimeout(c, Ws);
}
function Hs() {
  return we(Pt);
}
const br = "vperm.viewing", wr = "vperm.seen", yr = "vperm.room";
function Ys(e) {
  be(br, e);
}
function Js(e) {
  be(yr, String(e));
}
function Qs() {
  return we(yr);
}
function Xs(e) {
  const t = we(br);
  t !== null && be(wr, JSON.stringify({
    ...Ft(),
    [t]: { place: Sn(e), document: vt(e) }
  }));
}
function Zs(e) {
  return $n(Ft()[e]);
}
function ea(e) {
  return An(Ft()[e]);
}
function Ft() {
  const e = we(wr);
  return e === null ? {} : JSON.parse(e);
}
function ta(e, t) {
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
  const c = Qs();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), Nn(e, a, t), o.addEventListener("click", () => {
    Xs(e), vr(e, "up", () => {
    });
  }, { signal: t }), Ot(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Mt = "vperm.opening";
function kr(e, t) {
  e !== "" && be(Mt, JSON.stringify({ record: e, screen: t }));
}
function na(e) {
  const t = oa(), n = ce(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !ra(t.screen, n, e.location.href) || (xt(Mt), ia(e, n, t.record));
}
function ra(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function oa() {
  const e = we(Mt);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function ia(e, t, n) {
  const r = await On(n, t);
  r !== "" && Fr(e, r);
}
const $r = xn(F.viewable_users), sa = {
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
}, ft = "vperm.returnTo", mt = "vperm.returning", aa = "vperm.userSearch";
function la(e, t, n = sa) {
  const r = fe.get(ft), o = $n(r);
  return o !== "" && ca(o) ? (kr(An(r), o), me(ft, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (ua(e, t, n), !1);
}
function ca(e) {
  return we(mt) === e ? !1 : (be(mt, e), !0);
}
function ua(e, t, n) {
  const r = e.querySelector(`[${p.viewAs}]`);
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
  o.remembers = aa, o.placeholder = g("viewAsUser.search"), o.addNew = { label: g("viewAsUser.new"), url: r.getAttribute(p.newRecord) ?? "" }, e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    Ar(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    ht(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    wt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    ht(e, o), o.openedBy(r);
  }, { signal: t }), Ot(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    da(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function da(e, t, n, r) {
  const o = await $r().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    ht(e, r), r.openedBy(n);
    return;
  }
  await Ar(e, i, t);
}
async function ht(e, t) {
  t.state = "loading";
  const [n] = await Promise.all([$r().catch(() => null), Pn(e)]);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = Ve(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
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
    note: pa(r.length),
    detail: r,
    detailHeading: fa(r.length),
    heading: t
  };
}
function pa(e) {
  return e === 0 ? "" : z("viewAsUser.groups", e, e);
}
function fa(e) {
  return e === 0 ? g("viewAsUser.detail.none") : z("viewAsUser.detail", e, e);
}
async function Ar(e, t, n) {
  xt(mt), Ys(String(t)), Js(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await me(ft, { place: Sn(e), document: vt(e) });
  const r = Zs(String(t));
  kr(ea(String(t)), r), ma(t, n, r);
}
function ma(e, t, n) {
  Pr(document), vr(document, "down", () => {
    t.handOver(D(F.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function wn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  jr(e.signal), Gr(document, e.signal), Bs(document, e.signal), to(document, e.signal), fs(e.signal), ps(e.signal);
  const t = vo();
  ho(t, e.signal);
  const n = go();
  Ao(n, e.signal), Co(n, e.signal), Mo(t, e.signal), To(e.signal), oi(document, e.signal), _i(document, e.signal), ai(e.signal), ci(e.signal), pi(e.signal), mi(e.signal), es(document, e.signal), xs(document, e.signal), Fs(document, e.signal), os(document, e.signal), is(document, e.signal), Do(document, e.signal), Mi(document, e.signal), ys(document, e.signal), ds(document, e.signal), Wo(document, e.signal), zo(e.signal), Ms(document, e.signal), Ns(document, e.signal), Is(e.signal), Us(e.signal), ws(e.signal), _s(document, e.signal);
  const r = la(document, e.signal);
  ta(document, e.signal), r ? zs(document) : (na(document), Vs(document)), Ds(document);
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", wn, { once: !0 }) : wn();
//# sourceMappingURL=main.js.map
