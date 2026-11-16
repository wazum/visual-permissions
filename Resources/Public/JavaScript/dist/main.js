import fe from "@typo3/backend/storage/persistent.js";
import Y from "@typo3/core/ajax/ajax-request.js";
import Cr from "@typo3/backend/login-refresh.js";
import Oe from "@typo3/backend/notification.js";
import { sudoModeInterceptor as qr } from "@typo3/backend/security/sudo-mode-interceptor.js";
import { LitElement as Lr, html as R } from "lit";
import { ModuleStateStorage as kn } from "@typo3/backend/storage/module-state-storage.js";
import It from "@typo3/backend/modal.js";
import { FileStorageTree as Nr } from "@typo3/backend/tree/file-storage-tree.js";
import { PageTree as _r } from "@typo3/backend/tree/page-tree.js";
import ze from "@typo3/backend/module-menu.js";
import ae from "@typo3/backend/storage/client.js";
import { JavaScriptItemProcessor as Or } from "@typo3/core/java-script-item-processor.js";
import xr from "@typo3/backend/viewport.js";
import nt, { ModifierKeys as $n } from "@typo3/backend/hotkeys.js";
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
function Pr(e) {
  return e.body.hasAttribute(p.handingOver) || e.querySelector('typo3-backend-switch-user[mode="exit"]') !== null;
}
function Fr(e) {
  e.body.setAttribute(p.handingOver, "");
}
function An(e) {
  const t = e ?? {};
  return typeof t.place == "string" ? t.place : "";
}
function Sn(e) {
  const t = e ?? {};
  return typeof t.document == "string" ? t.document : "";
}
function Mr(e, t) {
  const n = ce(e);
  n !== null && e.addEventListener(
    "typo3-module-loaded",
    () => {
      n.setAttribute("endpoint", t);
    },
    { once: !0 }
  );
}
function vt(e) {
  return new URL(e.location.href).pathname.endsWith("/main") ? ce(e)?.getAttribute("endpoint") ?? "" : e.location.href;
}
function ce(e) {
  return e.querySelector("typo3-backend-module-router");
}
function bt(e) {
  const t = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(vt(e)));
  return t === null ? "" : t.slice(1).join(":");
}
function Tr(e) {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(vt(e)));
}
function En(e) {
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
let Be = Promise.resolve();
function me(e, t) {
  const n = document;
  return Be = Be.then(async () => {
    Pr(n) || await fe.set(e, t);
  }).catch(() => {
  }), Be;
}
function Ir() {
  return Be;
}
const Cn = "vperm.session", qn = 1, ye = "modules", Rr = "fields", rt = /* @__PURE__ */ new Set();
let M = Wr();
document.addEventListener("typo3-module-loaded", () => {
  Ve({ ...M, face: "preview" });
});
function k() {
  return M;
}
function N(e, t) {
  rt.add(e), t?.addEventListener("abort", () => rt.delete(e));
}
function Dr() {
  const e = M.groupId !== null, t = e ? Rr : M.area;
  he({ ...M, active: e, open: M.open || e, area: t, picked: t });
}
function Br() {
  he({ ...M, open: !0 });
}
function Ur() {
  he({ ...M, open: !1, active: !1 });
}
function Ln() {
  he({ ...M, active: !1 });
}
function Nn(e) {
  he({ ...M, area: e, picked: e, face: "preview" });
}
function jr(e) {
  Ve({ ...M, area: e });
}
function pe(e) {
  Ve({ ...M, face: e });
}
function wt(e) {
  he({ ...M, groupId: e, active: M.active && e !== null });
}
function he(e) {
  me(Cn, {
    version: qn,
    open: e.open,
    active: e.active,
    groupId: e.groupId,
    area: e.picked
  }), Ve(e);
}
function Ve(e) {
  M = e;
  for (const t of rt)
    try {
      t(M);
    } catch (n) {
      console.error(n);
    }
}
function Wr() {
  const e = fe.get(Cn);
  if (e === null || typeof e != "object")
    return { open: !1, active: !1, groupId: null, area: ye, picked: ye, face: "preview" };
  const t = e;
  if (String(t.version) !== String(qn))
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
function Gr(e) {
  const t = () => {
    Rt(document.body);
    const n = document.querySelector("#typo3-contentIframe")?.contentDocument?.body ?? null;
    n !== null && Rt(n);
  };
  t(), N(t, e);
}
function Rt(e) {
  const t = k();
  if (e.toggleAttribute(p.still, TYPO3.settings.visualPermissions?.animation === !1), e.toggleAttribute(p.active, t.active), !t.active) {
    e.removeAttribute(p.picked), e.removeAttribute(p.face);
    return;
  }
  e.setAttribute(p.picked, t.area), e.setAttribute(p.face, t.face);
}
const Kr = (e) => `${e}, .scaffold-modulemenu`;
function _n(e, t, n) {
  const r = t.parentElement?.querySelector(".topbar-site"), o = e.querySelector(Kr(".scaffold-sidebar"));
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
function zr(e, t) {
  const n = e.querySelector(".topbar-site-container"), r = e.querySelector(`[${p.controls}]`);
  if (n === null || r === null)
    return;
  r.classList.add(l.viewAsControls), r.hidden = !1, n.append(r), _n(e, r, t);
  const o = e.querySelector(`[${p.toolbar}]`), i = () => k().open || k().active, s = () => {
    r.classList.toggle(l.controlsOpen, i()), o?.setAttribute("aria-pressed", String(i()));
  };
  s(), N(s, t), o?.addEventListener("click", () => {
    i() ? Ur() : Br();
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
function B(e) {
  return TYPO3.settings.ajaxUrls[e] ?? "";
}
function g(e) {
  return TYPO3.lang[e] ?? "";
}
let ot = 0;
async function re(e, t, n = () => {
}) {
  return ot += 1, new Y(B(e)).addMiddleware(qr).post(t).then(async (r) => {
    const o = Dt(r);
    return o === "taken" && r.raw().status === 200 && n(await r.resolve()), o;
  }, Dt).finally(() => {
    ot -= 1;
  });
}
function yt() {
  return ot > 0;
}
function Dt(e) {
  try {
    const t = e.raw();
    return t.redirected === !0 ? (Cr.checkActiveSession(), "loggedOut") : Vr(t.status);
  } catch {
    return "failed";
  }
}
function Vr(e) {
  return e < 300 ? "taken" : e === 422 ? "cancelled" : e === 409 ? "refused" : "failed";
}
async function Fe(e, t = []) {
  return ge(new Y(B(F.inspect)).withQueryArguments({ group: e, tables: [...t] }).get());
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
async function xn(e, t) {
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return (await ge(new Y(B(F.open_document)).withQueryArguments({ table: r, uids: o, returnUrl: t }).get()))?.url ?? "";
}
function Hr(e) {
  if (e.raw?.().status !== 304)
    throw e;
  return e;
}
function Pn(e) {
  let t = null;
  return async () => {
    const n = await new Y(B(e)).get(t === null ? {} : { headers: { "If-None-Match": t.tag } }).catch(Hr), r = n.raw();
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
function He(e) {
  return JSON.parse(e.querySelector(`[${p.groups}]`)?.getAttribute(p.groups) ?? "{}");
}
const Yr = Pn(F.groups);
async function Fn(e) {
  const t = await Yr().catch(() => null);
  t !== null && e.querySelector(`[${p.groups}]`)?.setAttribute(p.groups, JSON.stringify(t));
}
function oe(e, t) {
  return He(e)[String(t)]?.title ?? null;
}
function Me(e) {
  return getComputedStyle(e.body).getPropertyValue("--vperm-motion") === "0";
}
const Mn = 220, Jr = 1300;
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
      m.textContent = g("platform.key.escape"), s.append(m);
    }
  };
}
function $t(e, t) {
  t !== "cancelled" && (e.state.textContent = g(`platform.${t}`));
}
function Tn(e, t) {
  const n = e.createElement("div");
  n.className = `${l.face} ${t}`;
  const r = O(e, l.faceEyebrow, ""), o = O(e, l.faceSentence, ""), i = e.createElement("div");
  i.className = l.faceBar, i.append(r, o);
  const s = e.createElement("div");
  s.className = l.faceScroll;
  const a = e.createElement("div");
  return a.className = l.faceFoot, n.append(i, s, a), { sheet: n, bar: i, eyebrow: r, sentence: o, scroll: s, foot: a };
}
function In(e) {
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
      if (t.size === 0 || Me(document))
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
        }, Jr));
      }, e));
    },
    stop: () => {
      t.clear(), o();
    }
  };
}
function Rn(e, t, n) {
  N(() => {
    k().groupId !== e && t.forEach((r) => {
      r.ready(!1, !1);
    });
  }, n);
}
function At(e, t, n, r) {
  e.addEventListener("keydown", (o) => {
    o.key === "Escape" && n() && !Qr(e) && r();
  }, { signal: t });
}
const Qr = (e) => e.querySelector("typo3-backend-modal, :popover-open") !== null;
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
  return x(g(`${e}.${t === 1 ? "one" : "many"}`), ...n);
}
function x(e, ...t) {
  return t.reduce(
    (n, r, o) => n.replace(`%${String(o + 1)}$s`, () => String(r)).replace("%s", () => String(r)),
    e
  );
}
const Bt = (e, t) => t === 0 || /[\s\-_.]/.test(e.charAt(t - 1));
function Xr(e, t, n, r) {
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
    const a = Xr(s, n, r, t);
    a !== null && (i === null || a.score > i.score) && (i = a);
  }
  return i;
}
const jt = (e) => e.subtitle === "" ? e.title : `${e.title} ${e.subtitle}`, Zr = 70, Je = 50;
class eo extends Lr {
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
      escape: "",
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
    return this.matching.slice(0, Je);
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
          <span><kbd>${this.words.escape}</kbd> ${this.query === "" ? this.words.close : this.words.clear}</span>
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
    n.searchParams.set("returnUrl", ce(this.ownerDocument)?.getAttribute("endpoint") ?? ""), t.href = n.href, kn.update("web", 0, !0), Ln(), this.hidePopover();
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
    return t <= Je ? (t === 1 ? this.words.totalOne : this.words.totalMany).replace("%d", String(t)) : this.words.countMany.replace("%d", String(Je)).replace("%d", String(t));
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
    }, Zr));
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
customElements.get(le.picker) === void 0 && customElements.define(le.picker, eo);
function Dn(e, t) {
  const n = e.createElement(le.picker);
  return n.words = {
    ...t,
    countMany: g("platform.picker.count"),
    move: g("platform.picker.key.move"),
    close: g("platform.picker.key.close"),
    clear: g("platform.picker.key.clear"),
    escape: g("platform.key.escape"),
    retry: g("platform.picker.retry"),
    empty: g("platform.picker.empty")
  }, n;
}
const to = "vperm.groupSearch", Bn = "vperm.recentGroups", no = 3;
function ro(e, t) {
  const n = e.querySelector(`[${p.group}]`);
  if (n === null)
    return;
  const r = Dn(e, {
    totalOne: g("pickAGroup.total.one"),
    totalMany: g("pickAGroup.total.many"),
    take: g("pickAGroup.key.take"),
    detail: g("pickAGroup.key.detail"),
    loading: "",
    failed: ""
  });
  let o = oo(e);
  r.entries = Qe(e, o), r.remembers = to, r.placeholder = g("pickAGroup.search"), r.addNew = { label: g("pickAGroup.new"), url: n.getAttribute(p.newRecord) ?? "" }, e.body.append(r), n.addEventListener("click", () => {
    r.openedBy(n), Fn(e).then(() => {
      r.entries = Qe(e, o);
    });
  }, { signal: t });
  const i = n.textContent, s = () => {
    n.textContent = oe(e, k().groupId) ?? i;
  };
  s(), N(s, t), N(() => {
    const { groupId: u } = k();
    u !== null && o[0] !== u && (o = [u, ...o.filter((d) => d !== u)], me(Bn, o)), r.entries = Qe(e, o);
  }, t);
  const c = (u) => {
    wt(Number(u.detail.id));
  };
  r.addEventListener("vperm:picked", c, { signal: t }), r.addEventListener("vperm:detail-picked", c, { signal: t }), t.addEventListener("abort", () => {
    r.remove();
  });
}
function oo(e) {
  const t = He(e);
  return [fe.get(Bn)].flat().map(String).filter((n) => n in t).map(Number);
}
function Qe(e, t) {
  const n = Object.entries(He(e)), r = t.filter((s) => s !== k().groupId).slice(0, no), o = r.flatMap((s) => n.filter(([a]) => a === String(s))), i = n.filter(([s]) => !r.includes(Number(s))).sort(([, s], [, a]) => s.title.localeCompare(a.title));
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
    note: io(t.inherits.length),
    detail: t.inherits.map((r) => ({
      id: String(r.groupId),
      title: r.title,
      depth: r.depth - 1
    })),
    detailHeading: g(t.inherits.length === 0 ? "pickAGroup.detail.none" : "pickAGroup.detail")
  };
}
function io(e) {
  return e === 0 ? "" : z("pickAGroup.inherits", e, e);
}
function so() {
  let e = null, t = /* @__PURE__ */ new WeakSet();
  const n = () => {
    const { groupId: r } = k();
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
const Un = (e) => `vperm:${e}`;
function X(e, t) {
  document.dispatchEvent(new CustomEvent(Un(e), { detail: t }));
}
function J(e, t, n) {
  document.addEventListener(
    Un(e),
    (r) => {
      t(r.detail);
    },
    { signal: n }
  );
}
function ao() {
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
const jn = ao();
function U(e, t) {
  jn.listen(e, t);
}
function Gt(e) {
  jn.tell(e);
}
const St = ["allowed", "allowedAndInherited", "inherited"], lo = ["allowed", "denied"], Z = "allowed", ve = "denied", Et = "inherited", Wn = "allowedAndInherited", je = "adminOnly";
function D(e) {
  return St.some((t) => t === e);
}
const co = [...St, ve];
function Ct(e) {
  return lo.includes(e);
}
function We(e) {
  return e.substring(0, e.indexOf(":"));
}
function uo(e) {
  return e.substring(e.indexOf(":") + 1);
}
const ne = {};
function po(e, t) {
  ne.tables = e, t.addEventListener("abort", () => {
    delete ne.tables;
  });
}
function fo(e, t) {
  ne.fields = e, t.addEventListener("abort", () => {
    delete ne.fields;
  });
}
function mo(e, t) {
  e.querySelectorAll(`.${l.nothingTheirs}, .${l.tableNote}`).forEach((i) => {
    i.remove();
  }), e.querySelectorAll(`[${p.unseen}]`).forEach((i) => {
    i.removeAttribute("hidden"), i.removeAttribute(p.unseen);
  });
  const { active: n, area: r, face: o } = k();
  !n || r !== "fields" || (ne.tables?.hide(e, t, o), ne.fields?.hide(e, t, o), Kt(e, ".form-section").forEach((i) => {
    [...i.querySelectorAll(`[${p.verdict}]`)].some((a) => a.closest(`[${p.unseen}]`) === null) || Se(i);
  }), Kt(e, ".tab-pane").forEach((i) => {
    i.querySelector(`.form-section:not([${p.unseen}])`) === null && (Se(i), Se(e.querySelector(`[data-typo3-tab='#${i.id}']`)?.closest(".nav-item") ?? null));
  }), ho(e), o === "preview" && go(e, t));
}
function Se(e) {
  e?.toggleAttribute("hidden", !0), e?.setAttribute(p.unseen, "");
}
function Kt(e, t) {
  return [...e.querySelectorAll(t)].filter((n) => n.closest(`[${p.verdict}]`)?.querySelector(`[${p.verdict}]`) !== null);
}
function ho(e) {
  e.querySelector(".tab-pane.active")?.hasAttribute(p.unseen) === !0 && e.querySelector(`.nav-item:not([${p.unseen}]) [data-typo3-tab]`)?.click();
}
function go(e, { tables: t, named: n, reads: r }) {
  if (e.querySelector(`.form-section:not([${p.unseen}])`) !== null)
    return;
  const o = vo(e), i = t[o], a = (D(i) ? ne.fields : ne.tables)?.explain(e, o, i, n[o] ?? o, r[o]);
  a !== void 0 && (a.classList.add(l.nothingTheirs), e.querySelector(".typo3-TCEforms")?.append(a));
}
function vo(e) {
  const n = e.querySelector(`[${p.token}][${p.inside}='']`)?.getAttribute(p.token) ?? "";
  return We(n);
}
function bo(e, t) {
  let n = null;
  const r = kt();
  t.addEventListener("abort", () => {
    r.drop();
  });
  let o = null, i = null;
  const s = () => {
    n !== null && mo(n.doc, {
      tables: o?.targets ?? {},
      named: o?.named ?? {},
      reads: i?.targets ?? {}
    });
  }, a = async () => {
    if (n === null)
      return;
    const { fields: u } = n, { active: d, groupId: m } = k();
    if (!d || m === null) {
      r.drop(), u.forEach(([w]) => {
        w.removeAttribute(p.verdict), w.removeAttribute(p.outOfReach);
      }), o = null, i = null, s();
      return;
    }
    const v = [...new Set(u.map(([, w]) => We(w)))], f = await r.inspect(m, v);
    if (f === null)
      return;
    const { scopes: b } = f;
    e.take(f), u.forEach(([w, y]) => {
      const E = b.fields.targets[y];
      E !== void 0 && w.setAttribute(p.verdict, E), w.toggleAttribute(p.outOfReach, !D(b.tablesModify.targets[We(y)]));
    }), o = b.tablesModify, i = b.tablesSelect, s(), X("fields-judged", {});
  };
  U(({ doc: u, fields: d }) => {
    r.drop(), u.body.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`);
    const m = d.flatMap((h) => {
      const v = h.getAttribute(p.token);
      return v === null ? [] : [[h, v]];
    });
    n = m.length === 0 ? null : { doc: u, fields: m }, a();
  }, t), J("permissions-written", () => void a(), t);
  let c = null;
  N(({ active: u, groupId: d }) => {
    const m = `${String(u)}:${String(d)}`;
    if (m === c) {
      s();
      return;
    }
    c = m, a();
  }, t);
}
async function wo(e, t) {
  return re(F.allow_fields, { group: e, operations: [...t] });
}
const zt = 280;
function Ee(e, t) {
  const n = e.querySelector('form[name="editform"]');
  if (n === null || Me(e)) {
    t();
    return;
  }
  n.classList.add(l.turning), window.setTimeout(t, zt), window.setTimeout(() => {
    n.classList.remove(l.turning);
  }, zt * 2);
}
const Vt = `[${p.verdict}]:not([${p.outOfReach}])`, yo = [ve, je].map((e) => `:not([${p.verdict}='${e}'])`).join("");
function ko(e, t) {
  let n = null, r = null;
  const o = () => {
    if (n === null)
      return;
    const a = n.querySelector('form[name="editform"]');
    if (a === null)
      return;
    const { active: c, area: u, face: d, groupId: m } = k(), h = c && u === "fields";
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
        const w = h().map((y) => ({ field: y.getAttribute(p.token) ?? "", allow: c }));
        yt() || wo(u, w).then((y) => {
          if (k().groupId !== u) {
            y === "taken" && X("permissions-written", {});
            return;
          }
          if (y !== "taken") {
            $t(f, y), d = w.length;
            return;
          }
          e.drop(), v(), X("permissions-written", {});
        });
      }
    }), b = () => {
      const w = [...a.querySelectorAll(Vt)].filter((C) => C.closest(`.${l.otherKinds}`) === null), y = w.filter((C) => C.matches(yo)), E = h().length;
      d !== E && (d = null, f.state.textContent = z("allowFields.tally", w.length, y.length, w.length), f.waiting.textContent = E === 0 ? "" : z(`allowFields.${c ? "waiting" : "going"}`, E, E), f.ready(E > 0, c || E > 0));
    };
    return b(), a.append(m), b;
  }, s = () => {
    r?.showCount();
  };
  U((a) => {
    n = a.doc, o(), n.defaultView?.addEventListener("click", s, { signal: t }), n.defaultView?.addEventListener("keydown", s, { signal: t });
  }, t), J("fields-judged", o, t), N(o, t);
}
function $o() {
  let e = [], t = {}, n = {};
  return {
    allowedBy: (r) => e.filter((o) => t[r]?.includes(o.groupId)),
    allowedElsewhere: (r) => n[r] ?? [],
    take: (r) => {
      e = r.chain, t = r.scopes.fields.allowedBy, n = r.scopes.fields.allowedElsewhere;
    }
  };
}
const Ao = `.${l.anchor}[${p.verdict}]`, So = 350, Eo = 250, it = (e) => e.getAttribute(p.verdict) ?? "", Ht = (e) => e.getAttribute(p.token) ?? "", Co = (e) => e.querySelector(":scope > .form-label, :scope > fieldset > legend"), st = (e) => g(`allowFields.mark.${e}.title`), qo = (e) => {
  if (e.getAttribute("role") !== "switch" || e.getAttribute("aria-disabled") === "true")
    return "";
  const t = e.classList.contains(l.faceMarked);
  return k().face === "pick" ? g(t ? "allowFields.hint.leave" : "allowFields.hint.allow") : g(t ? "allowFields.hint.keep" : "allowFields.hint.disallow");
};
function Yt(e, t, n) {
  if (n.length === 0)
    return [];
  const r = e.ownerDocument, o = r.createElement("h3");
  o.id = `${l.markCard}-${t}`, o.textContent = g(`allowFields.${t}`);
  const i = r.createElement("ul");
  i.append(...n.map((a) => {
    const c = r.createElement("span");
    c.textContent = a.title;
    const u = r.createElement("li");
    if (u.append(c), "disabled" in a && a.disabled) {
      const m = r.createElement("small");
      m.textContent = g("pickAGroup.disabled"), u.append(m);
    }
    const d = r.createElement("button");
    return d.type = "button", d.className = "btn btn-default btn-sm", d.textContent = g("allowFields.showGroup"), d.setAttribute("aria-label", x(g("allowFields.showGroupNamed"), a.title)), d.addEventListener("click", () => {
      e.hidePopover(), wt(a.groupId);
    }), u.append(d), u;
  }));
  const s = r.createElement("section");
  return s.setAttribute("aria-labelledby", o.id), s.append(o, i), [s];
}
function Lo(e, t, n) {
  const r = e.ownerDocument, o = it(t), i = getComputedStyle(t);
  e.style.setProperty("--vperm-glyph", i.getPropertyValue("--vperm-glyph")), e.style.setProperty("--vperm-square-edge", i.getPropertyValue("--vperm-square-edge"));
  const s = r.createElement("h2");
  s.id = `${l.markCard}-title`, s.textContent = st(o);
  const a = r.createElement("p");
  a.textContent = g(`allowFields.mark.${o}.meaning`);
  const c = r.createElement("div");
  c.append(s, a);
  const u = r.createElement("header");
  u.append(c), e.replaceChildren(
    u,
    ...Yt(e, "allowedBy", n.allowedBy(Ht(t))),
    ...Yt(e, "allowedElsewhere", n.allowedElsewhere(Ht(t)))
  );
  const d = qo(t);
  if (d !== "") {
    const m = r.createElement("footer");
    m.textContent = d, e.append(m);
  }
}
function No(e, t) {
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
    i?.style.removeProperty("anchor-name"), i?.setAttribute("aria-expanded", "false"), i = h, h.style.setProperty("anchor-name", "--vperm-mark"), h.setAttribute("aria-expanded", "true"), Lo(f, v, e), f.showPopover();
  }, m = () => {
    n.querySelectorAll(Ao).forEach((h) => {
      const v = Co(h);
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
        }, So);
      }), b.addEventListener("mouseleave", () => {
        a(u(b.ownerDocument));
      }), b.addEventListener("focusout", (w) => {
        c(u(b.ownerDocument), w);
      }), v.append(b);
    });
  };
  U((h) => {
    n = h.doc;
  }, t), J("fields-judged", m, t);
}
function _o(e) {
  let t = document;
  const n = () => {
    t.querySelectorAll(`.${l.otherKinds}`).forEach((r) => {
      Oo(r);
    });
  };
  U((r) => {
    t = r.doc, n();
  }, e), J("fields-judged", n, e);
}
function Oo(e) {
  const t = e.parentElement?.closest(`.${l.anchor}`)?.querySelector(".panel-group");
  t?.lastElementChild !== e && t?.append(e), e.toggleAttribute("hidden", e.querySelector(`[${p.token}]:not([${p.outOfReach}])`) === null);
}
const Gn = (e) => e.map((t) => `[${p.verdict}='${t}']:not([${p.outOfReach}])`).join(","), xo = (e) => Gn(e === "pick" ? co : St), at = (e) => Gn([e === "pick" ? ve : Z]), Po = `.${l.anchor}[${p.verdict}]`, Fo = (e, t, n) => {
  const r = D(e.getAttribute(p.verdict) ?? "");
  return {
    marked: t,
    offered: e.matches(xo(n)),
    // The group has it after the change unless this side is about to take it away
    on: r !== t,
    operable: e.matches(at(n)),
    waiting: t ? g(n === "pick" ? "platform.toAllow" : "allowFields.toDisallow") : ""
  };
}, Mo = (e) => {
  if (e.querySelector(`.${l.fieldName}`) !== null)
    return;
  const t = e.querySelector(`:scope > .${l.mark}`), n = e.ownerDocument.createElement("span");
  n.className = l.fieldName, n.append(...e.childNodes), e.append(n, ...t === null ? [] : [t]);
};
function To(e, t) {
  const n = e.querySelector(":scope > .form-label, :scope > fieldset > legend");
  if (e.classList.toggle(l.faceMarked, t.marked), !t.offered) {
    e.removeAttribute("role"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("tabindex"), n?.removeAttribute(p.waiting);
    return;
  }
  if (e.setAttribute("tabindex", "0"), e.setAttribute("role", "switch"), e.setAttribute("aria-checked", String(t.on)), e.setAttribute("aria-disabled", String(!t.operable)), n !== null) {
    if (Mo(n), t.waiting === "") {
      n.removeAttribute(p.waiting);
      return;
    }
    n.setAttribute(p.waiting, t.waiting);
  }
}
function Io(e, t) {
  let n = null;
  const r = () => {
    if (n === null)
      return;
    const { face: s } = k();
    n.querySelectorAll(Po).forEach((a) => {
      To(a, Fo(a, e.has(a), s));
    }), o(n, s);
  }, o = (s, a) => {
    s.querySelectorAll(".tab-pane").forEach((c) => {
      const u = c.querySelector(`.${l.tabAllow}`);
      if (a !== "pick") {
        u?.remove();
        return;
      }
      const d = () => [...c.querySelectorAll(`[${p.inside}='']`)].filter((h) => h.matches(at(a)) && !e.has(h)), m = u ?? i(s, c, d);
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
  U((s) => {
    const a = s.doc === n;
    if (n = s.doc, r(), a)
      return;
    const c = (u) => {
      const d = u.target, m = d.closest(`.${l.mark}`) === null ? d.closest(at(k().face)) : null;
      return m === null ? !1 : (e.toggle(m), r(), !0);
    };
    s.doc.addEventListener("click", (u) => {
      c(u);
    }, { signal: t }), s.doc.addEventListener("keydown", (u) => {
      u.key !== "Enter" && u.key !== " " || c(u) && u.preventDefault();
    }, { signal: t });
  }, t), J("fields-judged", r, t), N(r, t);
}
const Ro = ".form-group";
function Kn(e) {
  return e.closest(Ro);
}
const Do = `[${p.verdict}='${ve}'], [${p.verdict}='${je}']`;
function Bo(e) {
  fo({
    hide: (t, n, r) => {
      r === "preview" && t.querySelectorAll(Do).forEach((o) => {
        Se(Kn(o) ?? o);
      });
    },
    explain: (t, n, r, o) => {
      const i = t.createElement("div");
      return i.className = "callout callout-notice", i.append(
        O(t, "callout-body", x(g("allowFields.recordNoFields"), o)),
        te(t, g("recordForm.add"), "btn btn-default btn-sm", () => {
          Ee(t, () => {
            pe("pick");
          });
        })
      ), i;
    }
  }, e);
}
function Uo(e) {
  const t = $o();
  bo(t, e), No(t, e);
  const n = so();
  Io(n, e), ko(n, e), _o(e), Bo(e);
}
const jo = {
  ".scaffold-sidebar": ".t3js-scaffold-modulemenu",
  "typo3-backend-navigation-component-pagetree": ".t3js-scaffold-content-navigation",
  "typo3-backend-navigation-component-filestoragetree": ".t3js-scaffold-content-navigation",
  '[slot="content"]': ".t3js-scaffold-content-module"
}, Ie = (e) => `${e}, ${jo[e]}`, zn = [
  { key: "modules", host: Ie(".scaffold-sidebar"), ground: "panel" },
  {
    key: "pageMounts",
    host: Ie("typo3-backend-navigation-component-pagetree"),
    showing: "typo3-backend-navigation-component-pagetree",
    ground: "tree"
  },
  {
    key: "fileMounts",
    host: Ie("typo3-backend-navigation-component-filestoragetree"),
    showing: "typo3-backend-navigation-component-filestoragetree",
    ground: "tree"
  },
  { key: "fields", host: Ie('[slot="content"]'), ground: "module" }
];
function Jt(e) {
  e.querySelectorAll(`.${l.frame}`).forEach((t) => {
    t.classList.remove(l.frame), t.removeAttribute(p.area), t.removeAttribute(p.ground);
  });
}
function Vn(e, t) {
  if (t.showing !== void 0) {
    const n = e.querySelector(t.showing);
    if (n === null || getComputedStyle(n).display === "none")
      return null;
  }
  return e.querySelector(t.host);
}
function Wo(e, t) {
  const n = (i) => {
    if ((i.active ? oe(e, i.groupId) : null) === null) {
      Jt(e);
      return;
    }
    const a = zn.flatMap((c) => {
      const u = Vn(e, c);
      return u === null ? [] : [{ ...c, element: u }];
    });
    Jt(e), a.forEach(({ element: c, key: u, ground: d }) => {
      c.classList.add(l.frame), c.setAttribute(p.area, u), c.setAttribute(p.ground, d), Ko(c);
    });
  };
  let r = 0;
  const o = new MutationObserver(() => {
    window.cancelAnimationFrame(r), r = window.requestAnimationFrame(() => {
      Go(e) && n(k());
    });
  });
  o.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    o.disconnect();
  }), n(k()), N(n, t);
}
function Go(e) {
  return zn.some((t) => {
    const n = Vn(e, t);
    return n !== null && (!n.classList.contains(l.frame) || n.getAttribute(p.area) !== t.key);
  });
}
function Ko(e) {
  for (let t = e; t !== null; t = t.parentElement) {
    const n = getComputedStyle(t).backgroundColor;
    if (n !== "rgba(0, 0, 0, 0)") {
      e.style.setProperty("--vperm-surface", n);
      return;
    }
  }
}
const zo = "typo3-backend-contextual-record-edit-trigger";
function Vo(e, t) {
  let n = null;
  const r = (d) => {
    const m = d.target.closest(zo);
    !k().active || m === null || (d.preventDefault(), d.stopPropagation(), ce(e)?.setAttribute("endpoint", m.getAttribute("edit-url") ?? ""));
  };
  e.addEventListener("click", r, { capture: !0, signal: t });
  const o = () => {
    const { active: d, area: m } = k();
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
  U((d) => {
    n = d.doc, n.addEventListener("submit", i, { capture: !0, signal: t }), n.addEventListener("click", s, { capture: !0, signal: t }), n.addEventListener("click", r, { capture: !0, signal: t }), u();
  }, t), N(u, t);
}
const Ho = ".module-docheader-buttons .btn-toolbar", Yo = (e, t) => {
  e.location.assign(t);
};
function Jo(e, t = Yo) {
  let n = null;
  const r = () => {
    if (n?.defaultView == null || k().active)
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
    const { active: s, area: a } = k();
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
        const [f, b, w] = u.name.slice(5, -1).split("]["), y = new URL(i.URL), E = String(b).startsWith("NEW") ? `defVals[${String(f)}][${String(w)}]` : `vperm[value][${String(f)}][${String(b)}][${String(w)}]`;
        y.searchParams.set(E, v.value), t(i, y.toString());
      }), d.append(h, v), i.querySelector(Ho)?.append(d);
    });
  };
  N(() => {
    r(), o();
  }, e), U(({ doc: i }) => {
    n = i, r(), o();
  }, e);
}
let Qt = null;
function qt(e, t, n, r, o = /* @__PURE__ */ new Set()) {
  if (Qt?.isConnected === !0)
    return;
  const i = document.createElement("div");
  i.className = l.allowChoices, i.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), e.groups.forEach(({ label: h, values: v }) => {
    const f = document.createElement("section"), b = document.createElement("h2");
    b.textContent = h;
    const w = document.createElement("div");
    w.append(...v.map((y) => Xo(y, n.has(y.value), o.has(y.value)))), f.append(b, w), i.append(f);
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
    title: x(e.title, t),
    content: i,
    size: It.sizes.large,
    buttons: [c, u]
  });
  Qt = d;
  const m = () => {
    d.updateComplete.then(() => {
      d.querySelector('button[name="apply"]')?.toggleAttribute("disabled", a().length === 0);
    });
  };
  m(), d.updateComplete.then(() => {
    d.querySelector(".modal-footer")?.prepend(s);
  }), i.addEventListener("change", () => {
    const h = a(), v = h.filter(({ allow: f }) => f).length;
    s.textContent = Qo(v, h.length - v), m();
  });
}
function Qo(e, t) {
  return [
    ...e > 0 ? [x(g("platform.waiting"), e)] : [],
    ...t > 0 ? [x(g("platform.going"), t)] : []
  ].join(`
`);
}
function Xo({ value: e, label: t, icon: n }, r, o) {
  const i = document.createElement("label");
  i.className = l.allowValue;
  const s = document.createElement("typo3-backend-icon");
  s.setAttribute("identifier", n), s.setAttribute("size", "small");
  const a = document.createElement("span");
  a.textContent = t;
  const c = document.createElement("input");
  return c.type = "checkbox", c.value = e, c.checked = r, c.disabled = o, i.append(s, a, c), i;
}
async function Hn(e, t) {
  return re(F.allow_modules, { group: e, operations: [...t] }, (n) => {
    n.alsoAllowed.forEach((r) => {
      Oe.info(x(g("allowModules.alsoAllowed"), r));
    });
  });
}
async function Zo(e, t) {
  const n = await Fe(e);
  if (n === null)
    return;
  const r = await ge(new Y(B(F.modules_outside_menu)).get());
  if (r === null)
    return;
  const o = new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => D(i)).map(([i]) => i));
  qt(r, t, o, async (i) => await Hn(e, i.map(({ value: a, allow: c }) => ({ module: a, allow: c }))) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(n.scopes.modules.targets).filter(([, i]) => i === Et).map(([i]) => i)));
}
const Yn = "data-modulemenu-identifier", Ge = `[${Yn}]:not([aria-controls])`, Jn = ".modulemenu-group-container";
let ke = !1;
const lt = /* @__PURE__ */ new WeakMap();
let de = null;
const $e = In(560);
function ei(e, t, n) {
  const r = k().groupId, o = oe(e, r) ?? "", i = [...t.querySelectorAll(Ge)], s = i.filter(($) => D(Q($))), a = i.filter(($) => Q($) === Z), c = Xt(e, l.facePreview, g("platform.preview"), x(g("allowModules.previewFor"), o)), u = Xt(e, l.facePick, g("platform.pick"), x(g("allowModules.pickFor"), o)), m = e.querySelector(`.${l.coin}`) ?? e.createElement("div");
  m.className = l.coin, m.replaceChildren(c.sheet, u.sheet);
  const v = e.querySelector(`.${l.allowed}`) ?? e.createElement("div");
  v.className = l.allowed, m.parentElement !== v && v.replaceChildren(m);
  const f = ni(e, t);
  v.parentElement !== f && f.append(v), t.toggleAttribute("inert", !0), window.requestAnimationFrame(() => {
    f.classList.add(l.panelCardTurned);
  });
  const b = ($) => {
    ke = $, m.classList.toggle(l.coinTurned, $), c.sheet.toggleAttribute("inert", $), u.sheet.toggleAttribute("inert", !$);
  }, w = ($) => {
    const q = $.filter((P) => P.allow).map((P) => P.module);
    r !== null && k().groupId === r && (yt() || (q.forEach((P) => {
      $e.add(P);
    }), Hn(r, $).then((P) => {
      if (P !== "taken") {
        q.forEach((G) => {
          $e.delete(G);
        }), $t(ke ? C : y, P);
        return;
      }
      b(!1), X("permissions-written", {});
    })));
  }, y = xe(c.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      Xe(c.scroll).forEach(($) => {
        $.classList.remove(l.faceMarked);
      }), _();
    },
    apply: () => {
      w(Xe(c.scroll).map(($) => ({ module: Re($), allow: !1 })));
    }
  }), E = () => {
    Zt(u.scroll, t, _), _(), b(!1);
  }, C = xe(u.foot, {
    label: g("platform.doAllow"),
    cancel: E,
    apply: () => {
      const $ = en(u.scroll).filter((q) => Q(q) !== lt.get(q));
      w($.map((q) => ({ module: Re(q), allow: !0 })));
    }
  }), _ = () => {
    const $ = en(u.scroll), q = $.filter((I) => Q(I) !== lt.get(I)), P = $.filter((I) => D(Q(I)) && !q.includes(I)).length, G = z("allowModules.tally", $.length, P, $.length);
    j.textContent = G;
    const K = Xe(c.scroll);
    y.state.textContent = K.length === 0 ? G : z("allowModules.marked", a.length, K.length, a.length);
    const A = K.map(Re), L = n.filter(({ verdict: I, parent: ee }) => D(I) && A.includes(ee)).map(({ label: I }) => x(g("allowModules.alsoRemoved.name"), I));
    y.waiting.textContent = L.length === 0 ? "" : z("allowModules.alsoRemoved", L.length, L.join(", ")), y.ready(K.length > 0, K.length > 0), C.state.textContent = "", C.waiting.textContent = q.length === 0 ? "" : x(g("platform.waiting"), q.length), C.ready(q.length > 0, !0);
  };
  c.bar.append(
    te(e, g("allowModules.allow"), "btn btn-default", () => {
      b(!0);
    }),
    O(e, l.faceHint, g("allowModules.hint"))
  );
  const T = e.createElement("div");
  T.className = l.faceChoice;
  const j = O(e, l.faceCounted, "");
  T.append(j), T.append(te(e, g("allowModules.outside"), "btn btn-default", () => {
    r !== null && Zo(r, o);
  }));
  const S = n.filter(({ verdict: $ }) => D($)).length;
  T.append(O(e, l.faceCounted, z("allowModules.outside.tally", n.length, S, n.length))), u.sheet.insertBefore(T, u.foot), u.scroll.style.setProperty("--vperm-queued-note", `"${g("platform.toAllow")}"`), ri(e, c.scroll, s, g("platform.from"), _), Zt(u.scroll, t, _), _(), b(ke), $e.start(() => {
    m.querySelectorAll(`.${l.facePreview} ${Ge}`).forEach(($) => {
      $.classList.toggle(l.justAdded, $e.isLit(Re($)));
    });
  }), de?.abort(), de = new AbortController(), At(e, de.signal, () => ke, E), Rn(r, [y, C], de.signal);
}
function ti(e, t) {
  de?.abort(), de = null, ke = !1, $e.stop();
  const n = e.querySelector(`.${l.panelCard}`);
  if (t.removeAttribute("inert"), n === null)
    return;
  const r = n.querySelector(`.${l.allowed}`);
  r !== null && (r.querySelector(`.${l.coin}`)?.classList.remove(l.coinTurned), window.requestAnimationFrame(() => {
    n.classList.remove(l.panelCardTurned), window.setTimeout(() => {
      t.hasAttribute("inert") || (r.remove(), n.replaceWith(t));
    }, Me(e) ? 0 : Mn);
  }));
}
function ni(e, t) {
  const n = t.parentElement;
  if (n?.classList.contains(l.panelCard) === !0)
    return n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.replaceWith(r), r.append(t), r;
}
function Xt(e, t, n, r) {
  const o = Tn(e, t);
  return o.eyebrow.textContent = n, o.sentence.textContent = r, o.scroll.classList.add("modulemenu"), o;
}
function ri(e, t, n, r, o) {
  let i = null;
  t.replaceChildren(), n.forEach((s) => {
    const a = s.closest(Jn)?.previousElementSibling?.getAttribute("title") ?? "";
    a !== i && a !== "" && (i = a, t.append(O(e, l.allowedGroup, a)));
    const c = si(s);
    c.getAttribute(p.verdict) === Z ? Xn(c, () => {
      c.classList.toggle(l.faceMarked), o();
    }) : c.append(O(e, l.allowedFrom, r)), t.append(c);
  });
}
function Zt(e, t, n) {
  e.replaceChildren(...[...t.children].map((r) => r.cloneNode(!0))), e.querySelectorAll(Jn).forEach((r) => {
    r.classList.add("show");
  }), e.querySelectorAll(Ge).forEach((r) => {
    Qn(r), lt.set(r, Q(r)), D(Q(r)) && r.setAttribute("aria-disabled", "true"), Xn(r, () => {
      ii(r), n();
    });
  }), e.querySelectorAll("[aria-controls]").forEach((r) => {
    r.replaceWith(O(r.ownerDocument, l.allowedGroup, r.getAttribute("title") ?? ""));
  });
}
function oi(e) {
  const t = Q(e);
  return e.getAttribute("aria-disabled") === "true" || !Ct(t) ? "" : D(t) ? "unpick" : "allow";
}
function ii(e) {
  const t = oi(e);
  t !== "" && e.setAttribute(p.verdict, t === "allow" ? Z : ve);
}
function Qn(e) {
  e.removeAttribute("href"), e.removeAttribute("aria-current"), e.classList.remove("modulemenu-action-active");
}
function si(e) {
  const t = e.cloneNode(!0);
  return Qn(t), t;
}
function Xn(e, t) {
  e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.addEventListener("click", (n) => {
    n.preventDefault(), t();
  }), e.addEventListener("keydown", (n) => {
    !(n instanceof KeyboardEvent) || n.key !== "Enter" && n.key !== " " || (n.preventDefault(), t());
  });
}
function Xe(e) {
  return [...e.querySelectorAll(`.${l.faceMarked}`)];
}
function en(e) {
  return [...e.querySelectorAll(Ge)].filter((t) => Ct(Q(t)));
}
const Q = (e) => e.getAttribute(p.verdict) ?? "", Re = (e) => e.getAttribute(Yn) ?? "", Ze = "#modulemenu", Zn = "data-modulemenu-identifier", ai = `[${Zn}]:not([aria-controls])`;
function li(e, t) {
  const n = kt();
  let r = null, o = 0;
  const i = async () => {
    const u = ++o, { active: d, groupId: m, area: h } = k();
    if (!d || m === null || h !== "modules") {
      n.drop(), e.querySelectorAll(`${Ze} [${p.verdict}]`).forEach((E) => {
        E.removeAttribute(p.verdict);
      }), s(e);
      return;
    }
    const v = e.querySelector(Ze);
    if (v === null)
      return;
    const f = [...v.querySelectorAll(ai)];
    if (f.length === 0)
      return;
    const b = await n.inspect(m);
    if (b === null)
      return;
    const { scopes: w } = b;
    Object.entries(w.modules.targets).forEach(([E, C]) => {
      f.filter((_) => _.getAttribute(Zn) === E).forEach((_) => {
        _.setAttribute(p.verdict, C);
      });
    }), r ??= ge(new Y(B(F.modules_outside_menu)).get());
    const y = await r;
    if (y === null) {
      r = null;
      return;
    }
    u === o && ei(e, v, y.groups.flatMap(({ values: E }) => E.map(({ value: C, label: _, parent: T }) => ({
      verdict: w.modules.targets[C],
      parent: T,
      label: _
    }))));
  }, s = (u) => {
    const d = u.querySelector(Ze);
    d !== null && ti(u, d);
  };
  let a = null;
  const c = ({ active: u, groupId: d, area: m }) => {
    const h = `${String(u)}:${String(d)}:${m}`;
    h !== a && (a = h, i());
  };
  c(k()), J("permissions-written", () => void i(), t), N(c, t);
}
async function ci(e, t, n, r) {
  const o = await re(F.allow_tables, { group: e, operations: [{ table: t, select: n, modify: r }] });
  return o === "taken" && X("permissions-written", {}), o;
}
const ui = ["none", "select", "modify"];
function er(e, { groupId: t, table: n, called: r, verdict: o, reads: i, says: s }) {
  const a = (v) => v === Et || v === Wn, c = a(o) ? 2 : a(i) ? 1 : 0, u = Math.max(o === Z ? 2 : i === Z ? 1 : 0, c), d = e.createElement("div");
  d.className = `callout callout-notice callout-sm ${l.tableGate}`, d.append(O(e, l.tableName, r)), d.append(O(e, l.tableToken, n));
  const m = O(e, "callout-body", o === je ? g("allowTables.adminOnly") : s);
  if (d.append(m), o === je)
    return d;
  const h = e.createElement("div");
  return h.className = `btn-group btn-group-sm ${l.tableLevels}`, h.setAttribute("role", "radiogroup"), h.setAttribute("aria-label", r), h.append(...ui.map((v, f) => {
    const b = e.createElement("button");
    return b.type = "button", b.className = "btn btn-default", b.setAttribute("role", "radio"), b.setAttribute("aria-checked", String(f === u)), b.textContent = (f === c && c > 0 ? "↳ " : "") + g(`be_groups.tables_modify.permissions.${v}`), b.disabled = f < c, b.title = f < c ? g("allowTables.inherited") : "", b.addEventListener("click", () => {
      if (f === u)
        return;
      const w = [...h.querySelectorAll("button")];
      w.forEach((y) => {
        y.disabled = !0;
      }), ci(t, n, f >= 1, f >= 2).then((y) => {
        w.forEach((E, C) => {
          E.disabled = C < c;
        }), y !== "taken" && y !== "cancelled" && (m.textContent = g(`platform.${y}`));
      });
    }), b;
  })), d.append(h), d;
}
const tn = ".typo3-TCEforms";
function di(e) {
  let t = null, n = 0;
  const r = async () => {
    if (t === null)
      return;
    const i = t, s = ++n, a = () => {
      i.querySelectorAll(`.${l.tableGate}:not(.${l.nothingTheirs})`).forEach((w) => {
        w.remove();
      });
    }, { active: c, area: u, face: d, groupId: m } = k();
    if (!c || u !== "fields" || d !== "pick" || m === null) {
      a();
      return;
    }
    const h = /* @__PURE__ */ new Map();
    i.querySelectorAll(`[${p.inside}]`).forEach((w) => {
      const y = w.getAttribute(p.inside) ?? "", E = y === "" ? w.closest(tn) : i.querySelector(`[${p.field}='${y}']`), C = w.getAttribute(p.token) ?? "";
      E !== null && h.set(E, We(C));
    });
    const v = await Fe(m, [...new Set(h.values())]);
    if (s !== n || (a(), v === null))
      return;
    const { named: f, targets: b } = v.scopes.tablesModify;
    h.forEach((w, y) => {
      const E = b[w];
      if (![Z, Et, Wn, ve].some((j) => j === E))
        return;
      const C = v.scopes.tablesSelect.targets[w], _ = er(i, { groupId: m, table: w, called: f[w] ?? w, verdict: E, reads: C, says: "" }), T = y.matches(tn) ? null : y.querySelector(".form-irre-object");
      if (T === null) {
        y.prepend(_);
        return;
      }
      T.before(_);
    });
  };
  U((i) => {
    t = i.doc, r();
  }, e), J("permissions-written", () => void r(), e);
  let o = null;
  N(({ active: i, groupId: s, area: a, face: c }) => {
    const u = `${String(i)}:${String(s)}:${a}:${c}`;
    u !== o && (o = u, r());
  }, e);
}
function pi(e) {
  po({
    hide: (t, { tables: n, named: r }, o) => {
      const i = o === "preview" ? ".form-irre-object" : ".form-group";
      Object.entries(n).filter(([, s]) => !D(s)).forEach(([s]) => {
        t.querySelectorAll(`[${p.token}^='${s}:']`).forEach((a) => {
          Se(a.closest(i) ?? Kn(a) ?? a);
        }), o === "preview" && fi(t, s, r[s] ?? s);
      });
    },
    explain: (t, n, r, o, i) => er(t, {
      groupId: k().groupId ?? 0,
      table: n,
      called: o,
      verdict: r,
      reads: i,
      // Core opens no form of a table the group may only read
      says: D(i) ? x(g("allowTables.readOnly"), o) : ""
    })
  }, e);
}
function fi(e, t, n) {
  const r = /* @__PURE__ */ new Set();
  e.querySelectorAll(`[${p.token}^='${t}:']:not([${p.inside}=''])`).forEach((o) => {
    const i = o.getAttribute(p.inside) ?? "", s = e.querySelector(`[${p.field}='${i}']`)?.closest(".form-group");
    s != null && r.add(s);
  }), r.forEach((o) => {
    o.append(O(
      e,
      `callout callout-notice callout-sm ${l.tableNote}`,
      x(g("allowTables.gone"), n)
    ));
  });
}
async function mi(e, t, n) {
  return re(e === "pageTypes" ? F.allow_page_types : F.allow_values, {
    group: t,
    operations: [...n]
  });
}
function hi(e) {
  let t = null;
  const n = () => {
    if (t === null)
      return;
    const { active: r, face: o } = k();
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
      a.type = "button", a.className = `btn btn-default btn-sm ${l.allowChoose}`, a.textContent = g(`allowedValues.choose.${uo(s)}`), a.addEventListener("click", () => {
        const c = JSON.parse(i.getAttribute(p.choices) ?? "{}"), u = k().groupId ?? 0;
        Fe(u).then((d) => {
          if (d === null)
            return;
          const m = i.getAttribute(p.allows) === "pageTypes" ? "pageTypes" : "fieldValues", h = m === "pageTypes" ? "" : `${s}:`, v = new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => D(f)).map(([f]) => f.substring(h.length)));
          qt(c, oe(document, u) ?? "", v, async (f) => await mi(m, u, f.map(({ value: w, allow: y }) => ({ value: `${h}${w}`, allow: y }))) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(d.scopes[m].targets).filter(([, f]) => D(f) && f !== Z).map(([f]) => f.substring(h.length))));
        });
      }), i.after(a);
    });
  };
  U((r) => {
    t = r.doc, n();
  }, e), N(n, e);
}
async function gi(e, t) {
  const n = await Fe(e);
  if (n === null)
    return;
  const r = await ge(new Y(B(F.file_operations)).get());
  if (r === null)
    return;
  const o = new Set(Object.keys(n.scopes.fileOperations.targets));
  qt(r, t, o, async (i) => await re(F.allow_file_operations, { group: e, operations: i }) !== "taken" ? !1 : (X("permissions-written", {}), !0), new Set(Object.entries(n.scopes.fileOperations.targets).filter(([, i]) => i !== Z).map(([i]) => i)));
}
const tr = {
  word: "folders",
  component: "typo3-backend-navigation-component-filestoragetree",
  tree: le.folderTree,
  base: Nr,
  namesFirst: !0,
  mounted: ({ fileMounts: e }) => {
    const t = (r) => Object.fromEntries(
      Object.entries(r).map(([o, i]) => [encodeURIComponent(o), i])
    ), n = t(e.targets);
    return { targets: n, order: Object.keys(n), named: t(e.named), unseen: [] };
  },
  rootedAt: (e) => {
    const t = B(F.folder_tree);
    return {
      dataUrl: `${t}${t.includes("?") ? "&" : "?"}group=${String(e)}`,
      rootlineUrl: B("filestorage_tree_rootline"),
      filterUrl: B("filestorage_tree_filter"),
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
      gi(t, oe(e, t) ?? "");
    }
  )
}, nr = {
  word: "pages",
  component: "typo3-backend-navigation-component-pagetree",
  tree: le.pageTree,
  base: _r,
  namesFirst: !1,
  mounted: ({ pageMounts: e }) => ({
    targets: e.targets,
    order: e.order.map(String),
    named: {},
    unseen: e.unseen
  }),
  rootedAt: async () => ({ ...await (await new Y(B("page_tree_browser_configuration")).get()).resolve(), rootlineUrl: B("page_tree_rootline") }),
  write: async (e, t, n) => re(F.mount_pages, {
    group: e,
    operations: t.map((r) => ({ page: Number(r), mount: n }))
  })
};
function vi(e, t) {
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
function bi(e) {
  const t = /* @__PURE__ */ new Map();
  return rr(e).forEach((n) => {
    t.set(n.dataset.folder ?? "", n.value);
  }), t;
}
function wi(e, t) {
  const n = rr(e);
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
const rr = (e) => [...e.querySelectorAll(`.${l.naming} input[data-folder]`)], Ce = In(520), W = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Set(), H = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), ct = /* @__PURE__ */ new Set(), or = (e) => decodeURIComponent(e).endsWith(":/") || Number(e) < 1, ir = (e) => H.has(e) && !Ke.has(e), sr = (e) => e.__parents ?? [], qe = (e) => sr(e).some((t) => H.has(t)), yi = (e, t) => t.some((n) => H.has(n.identifier) && sr(n).includes(e.identifier)), ar = (e) => e.detail;
function ki(e, t, n) {
  e.addEventListener("typo3:tree:node-selected", (o) => {
    o.stopPropagation();
    const { node: i, propagate: s } = ar(o);
    s === !1 || or(i.identifier) || H.has(i.identifier) || qe(i) || (V.has(i.identifier) ? V.delete(i.identifier) : V.add(i.identifier), t(), et(Ue(e)));
  }, { capture: !0, signal: n });
  const r = new MutationObserver(() => {
    const o = Ue(e);
    o !== null && (!Pe.has(o) || e.querySelector(".node[data-id='0']") !== null) && et(o);
  });
  r.observe(e, { childList: !0, subtree: !0 }), n.addEventListener("abort", () => {
    r.disconnect();
  }), et(Ue(e));
}
function $i(e) {
  const t = Ue(e);
  if (t === null)
    return;
  const n = Pe.get(t);
  n !== void 0 && (t.getNodeClasses = n.classes, t.prepareNodes = n.rows, t.nodes.filter((r) => Number(r.identifier) < 1).forEach((r) => {
    r.__hidden = !1;
  }), Pe.delete(t), t.requestUpdate());
}
function et(e) {
  if (e !== null) {
    if (nn(e.nodes), !Pe.has(e)) {
      const t = e.getNodeClasses.bind(e), n = e.prepareNodes.bind(e);
      Pe.set(e, { classes: t, rows: n }), e.prepareNodes = (r) => nn(n(r)), e.getNodeClasses = (r) => {
        const o = t(r).filter((i) => i !== "node-selected");
        return H.has(r.identifier) && o.push(l.mountAlready), V.has(r.identifier) && o.push(l.mountPicked), or(r.identifier) && o.push(l.mountWhole), o;
      };
    }
    e.requestUpdate();
  }
}
function nn(e) {
  return e.filter((t) => Number(t.identifier) < 1).forEach((t) => {
    t.__hidden = !0;
  }), e;
}
const Pe = /* @__PURE__ */ new WeakMap(), Ue = (e) => e.querySelector(
  "typo3-backend-navigation-component-pagetree-tree,typo3-backend-navigation-component-filestorage-tree"
);
let tt = "", rn = () => {
};
async function Ai(e, t, n, { groupId: r, kind: o, showCount: i }) {
  rn = i;
  const s = `${String(r)}:${n.join(",")}`;
  if (n.length === 0) {
    t.replaceChildren(), tt = s;
    return;
  }
  const a = o.tree;
  if (Si(a, o.base), t.querySelector(a) !== null && tt === s)
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
    v !== null && (ir(v.getAttribute("data-id") ?? "") || h.preventDefault());
  }), d.addEventListener("typo3:tree:node-selected", (h) => {
    h.stopPropagation();
    const { node: v, propagate: f } = ar(h);
    f !== !1 && (W.has(v.identifier) ? W.delete(v.identifier) : W.add(v.identifier), ut(e), rn());
  }), Object.assign(d, { allowNodeEdit: !1, allowNodeDrag: !1, allowNodeSorting: !1 });
  const m = e.createElement("div");
  m.className = l.mountTree, m.append(d), t.replaceChildren(m), tt = s, Object.assign(d, { setup: u });
}
function ut(e) {
  e.querySelector(
    `.${l.facePreview} :is(${le.pageTree}, ${le.folderTree})`
  )?.requestUpdate();
}
function Si(e, t) {
  window.customElements.get(e) === void 0 && window.customElements.define(e, class extends t {
    // A node never selected is never filled in and never spoken of
    isNodeSelectable(n) {
      return ir(n.identifier);
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
      on(this.nodes);
    }
    prepareNodes(n) {
      return on(super.prepareNodes(n));
    }
    hideChildren(n) {
      !qe(n) && !H.has(n.identifier) || super.hideChildren(n);
    }
    getNodeClasses(n) {
      const r = super.getNodeClasses(n).filter((o) => o !== "node-selected");
      return qe(n) && r.push(l.mountInside), !qe(n) && !H.has(n.identifier) && r.push(l.mountContext), Ke.has(n.identifier) && r.push(l.mountInherited), W.has(n.identifier) && r.push(l.faceMarked), ct.has(n.identifier) && r.push(l.mountUnseen), Ce.isLit(n.identifier) && r.push(l.justAdded), r;
    }
  });
}
function on(e) {
  return e.forEach((t) => {
    qe(t) || H.has(t.identifier) || (t.__expanded = !0, t.__hidden = !yi(t, e));
  }), e;
}
function Ei(e, t, n, r) {
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
      f.preventDefault(), kn.update("web", u, !0), ze.App.showModule("permissions_pages");
    }), h.setAttribute("aria-label", x(o("unseenLink"), d)), h.textContent = x(o("unseenPage"), d);
    const v = e.createElement("li");
    v.append(h), c.append(v);
  }), i.append(a, c), t.sheet.insertBefore(i, t.foot);
}
let Ae = !1, dt = null, Le = null;
function Ci(e, t, n, { groupId: r, kind: o }) {
  const i = `mountBranches.${o.word}`, s = (S) => g(`${i}.${S}`), a = oe(e, r) ?? "", c = Li(e, t);
  dt !== r && (W.clear(), V.clear(), dt = r), Le?.abort(), Le = new AbortController();
  const { signal: u } = Le, d = sn(e, c, l.facePick), m = sn(e, c, l.facePreview);
  m.eyebrow.textContent = g("platform.preview"), m.sentence.textContent = x(s("previewFor"), a), d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = x(s("pickFor"), a);
  const h = n.order;
  H.clear(), Ke.clear(), Object.entries(n.targets).forEach(([S, $]) => {
    H.add(S), Ct($) || (Ke.add(S), W.delete(S));
  });
  const v = (S) => {
    m.sheet.toggleAttribute("inert", S), d.sheet.toggleAttribute("inert", !S);
  }, f = (S) => {
    Ae = S, c.classList.toggle(l.panelCardTurned, !S), v(S);
  };
  v(Ae);
  const b = () => {
    const S = z(`${i}.tally`, h.length, h.length);
    y.state.textContent = W.size === 0 ? S : z(`${i}.marked`, h.length, W.size, h.length), y.ready(W.size > 0, W.size > 0), j.state.textContent = S, j.waiting.textContent = V.size === 0 ? "" : x(g("mountBranches.waiting"), V.size), j.ready(V.size > 0, !0);
  }, w = (S, $) => {
    if (k().groupId !== r)
      return;
    const q = [...S];
    if (q.length === 0 || yt())
      return;
    const P = o.write(r, q, $, bi(d.sheet));
    $ && q.forEach((G) => {
      Ce.add(G);
    }), P.then((G) => {
      if (G !== "taken") {
        q.forEach((K) => {
          Ce.delete(K);
        }), $t($ ? j : y, G);
        return;
      }
      q.forEach((K) => S.delete(K)), C(), f(!1), X("permissions-written", {});
    });
  }, y = xe(m.foot, {
    label: g("platform.doRemove"),
    cancel: () => {
      W.clear(), ut(e), b();
    },
    apply: () => {
      w(W, !1);
    }
  }), E = new Set(Object.keys(n.named)), C = () => {
    d.sheet.querySelector(`.${l.naming}`)?.remove(), d.scroll.hidden = !1, d.eyebrow.textContent = g("platform.pick"), d.sentence.textContent = x(s("pickFor"), a);
  }, _ = () => {
    const S = [...V].filter((q) => !E.has(q)), $ = d.sheet.querySelector(`.${l.naming}`) !== null;
    if (o.namesFirst && S.length > 0 && !$) {
      const q = vi(e, S);
      q.addEventListener("submit", (P) => {
        P.preventDefault(), _();
      }), q.addEventListener("input", () => {
        j.ready(T(), !0, !0);
      }), d.eyebrow.textContent = s("name"), d.sentence.textContent = s("nameFor"), d.scroll.hidden = !0, d.sheet.insertBefore(q, d.foot), q.querySelector("input")?.focus();
      return;
    }
    if ($ && !T()) {
      d.sheet.querySelector(`.${l.naming} input[aria-invalid]`)?.focus();
      return;
    }
    w(V, !0);
  }, T = () => wi(d.sheet, s("nameWhy")), j = xe(d.foot, {
    label: g("mountBranches.doAdd"),
    cancel: () => {
      V.clear(), C(), f(!1), b();
    },
    apply: _
  });
  if (d.scroll.style.setProperty("--vperm-queued-note", `"${g("mountBranches.toAdd")}"`), m.scroll.style.setProperty("--vperm-inherited-note", `"${g("platform.from")}"`), ct.clear(), n.unseen.forEach(({ page: S }) => {
    ct.add(String(S));
  }), Ei(e, m, n.unseen, i), m.sheet.querySelector(`.${l.faceChoice}`)?.remove(), o.choice !== void 0) {
    const S = e.createElement("div");
    S.className = l.faceChoice, S.append(o.choice(e, r)), m.sheet.insertBefore(S, m.foot);
  }
  Ai(e, m.scroll, h, { groupId: r, kind: o, showCount: b }), ki(d.sheet, b, u), b(), Ce.start(() => {
    ut(e);
  }), At(e, u, () => Ae, () => {
    if (d.sheet.querySelector(`.${l.naming}`) !== null) {
      C();
      return;
    }
    f(!1);
  }), Rn(r, [y, j], u), m.bar.replaceChildren(
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
function qi(e) {
  const t = e.querySelector(
    `typo3-backend-navigation-component-pagetree > .${l.panelCard},typo3-backend-navigation-component-filestoragetree > .${l.panelCard}`
  );
  if (t === null)
    return;
  Ae = !1, W.clear(), dt = null, Ce.stop(), Le?.abort(), Le = null;
  const n = t.querySelector(`.${l.facePick} > .${l.faceScroll}`), r = t.parentElement;
  n === null || r === null || (t.classList.remove(l.panelCardTurned), t.toggleAttribute("inert", !0), $i(n), window.setTimeout(() => {
    t.hasAttribute("inert") && (r.append(...n.childNodes), t.remove());
  }, Me(e) ? 0 : Mn));
}
function Li(e, t) {
  const n = t.querySelector(`:scope > .${l.panelCard}`);
  if (n !== null)
    return n.removeAttribute("inert"), n;
  const r = e.createElement("div");
  return r.className = l.panelCard, t.append(r), r;
}
function sn(e, t, n) {
  const r = t.querySelector(`:scope > .${n}`);
  if (r !== null)
    return Ni(r);
  const o = Tn(e, n);
  return n === l.facePick && o.scroll.append(...[...t.parentElement?.childNodes ?? []].filter((i) => i !== t)), t.append(o.sheet), o;
}
function Ni(e) {
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
const _i = { pageMounts: nr, fileMounts: tr };
function Oi(e, t) {
  const n = kt();
  let r = 0, o = null;
  const i = async () => {
    o = null;
    const { active: a, groupId: c, area: u } = k(), d = _i[u];
    if (!a || c === null || d === void 0) {
      n.drop(), qi(e);
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
    Ci(e, h, d.mounted(v.scopes), { groupId: c, kind: d });
  }, s = new MutationObserver(() => {
    r > 0 || k().groupId === o || [nr, tr].every(({ component: a }) => e.querySelector(`${a} > .${l.panelCard}`) === null) && i();
  });
  s.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    s.disconnect();
  }), i(), J("permissions-written", () => void i(), t), N(() => void i(), t);
}
let pt = null;
function lr(e) {
  pt = e, ze.App.showModule(e);
}
function xi(e) {
  document.dispatchEvent(new CustomEvent("typo3-module-load", { detail: { module: e } }));
}
function Pi(e) {
  const t = pt === e;
  return pt = null, t;
}
const Ne = "other", an = ["modules", "pageMounts", "fileMounts", "fields", Ne], Fi = 10, se = {
  pageMounts: "tree",
  fileMounts: "tree",
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: "module",
  // Stryker disable next-line StringLiteral: see above
  [Ne]: "module"
}, Mi = {
  pageMounts: "web_layout",
  fileMounts: "media_management"
};
function Ti(e, t) {
  const n = e.createElement("nav");
  n.className = l.tabBar, n.setAttribute("role", "tablist"), n.setAttribute("aria-label", g("pickAnArea.bar"));
  const r = /* @__PURE__ */ new Set(), o = () => {
    r.forEach((f) => {
      f.removeAttribute("inert"), f.removeAttribute(p.armed);
    }), r.clear();
  };
  let i = "", s = "";
  const a = (f) => {
    const b = cr(e);
    if (b.forEach((A) => {
      v.observe(A);
    }), !f.active) {
      n.remove(), o();
      return;
    }
    const w = b.map((A) => ie(A)), y = [...an, ...w.filter((A) => !an.includes(A))], E = w.includes("fields") ? [Ne] : [], C = b.filter((A) => A.getBoundingClientRect().width !== 0).map(ie), _ = C.includes("fields") ? [...C, Ne] : C, [T] = _.includes("fields") ? ["fields"] : _, j = _.find((A) => se[A] !== void 0 && se[A] === se[f.picked]), S = _.includes(f.picked) ? f.picked : j ?? T;
    if (_.join() !== i && (i = _.join(), S !== void 0 && S !== f.area)) {
      jr(S);
      return;
    }
    w.join() !== s && (s = w.join(), n.replaceChildren(
      ...w.flatMap((A) => [Vi(e, A), zi(e, A)]),
      ...y.map((A) => Ri(e, A, g(`pickAnArea.${A}`)))
    )), n.parentElement === null && Ii(e).append(n);
    const $ = f.area === Ne ? "fields" : f.area;
    Ui(n, e), ji(n, e, b.find((A) => ie(A) === $) ?? null);
    const q = f.area !== "fields";
    b.forEach((A) => {
      const L = ie(A), I = L === $, ee = q && !I && L !== "modules", ue = De(n, L);
      ue?.setAttribute("aria-selected", String(L === f.area)), Di(ue, A), A.toggleAttribute(p.armed, I), A.toggleAttribute("inert", ee), r.add(A), Hi(Ji(n, L), A, ee), Wi(Qi(n, L), A, I, b);
    });
    let P = 0, G = null;
    y.forEach((A) => {
      const L = De(n, A);
      if (L === null)
        return;
      const I = L.hidden ? 0 : L.getBoundingClientRect().width, ee = b.find((Er) => ie(Er) === A), ue = ee ?? Yi(A, b), Ye = Math.max(P, ue?.getBoundingClientRect().left ?? P);
      L.style.setProperty("--vperm-host-x", `${String(Ye)}px`);
      const Tt = ue?.getBoundingClientRect().right;
      Tt !== void 0 && L.style.setProperty("--vperm-tab-room", `${String(Tt - Ye)}px`), L.toggleAttribute(p.elsewhere, ee === void 0), ee === void 0 && (L.setAttribute("aria-selected", String(A === f.area)), Te(L, ue ?? G ?? L)), P = L.hidden ? P : Ye + I + Fi, G = L;
    });
    const K = De(n, "fields");
    E.forEach((A) => {
      const L = De(n, A);
      L === null || K === null || (L.setAttribute("aria-selected", String(A === f.area)), L.hidden = K.hidden);
    });
  };
  let c = 0;
  const u = () => {
    window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
      a(k());
    });
  }, d = new MutationObserver((f) => {
    f.some((b) => !n.contains(b.target)) && u();
  });
  let m = !1;
  const h = (f) => {
    const b = f.detail.module ?? "", w = Pi(b);
    if (!m) {
      m = !0;
      return;
    }
    !w && se[k().picked] === "tree" && Nn("fields");
  };
  e.addEventListener("typo3-module-loaded", h, { signal: t }), d.observe(e.body, { childList: !0, subtree: !0 });
  const v = new ResizeObserver(u);
  e.body.addEventListener("load", u, { capture: !0, signal: t }), window.addEventListener("resize", u, { signal: t }), e.body.addEventListener("transitionend", u, { signal: t }), t.addEventListener("abort", () => {
    d.disconnect(), v.disconnect(), window.cancelAnimationFrame(c);
  }), N(a, t), a(k());
}
const Ii = (e) => e.querySelector(".scaffold") ?? e.body;
function Ri(e, t, n) {
  const r = e.createElement("button");
  return r.type = "button", r.className = l.tab, r.setAttribute("role", "tab"), r.setAttribute(p.area, t), r.setAttribute(p.label, n), r.title = n, r.append(O(e, l.tabLabel, n)), r.addEventListener("click", () => {
    Nn(t);
    const o = Mi[t];
    o !== void 0 && cr(e).every((i) => ie(i) !== t) && lr(o);
  }), r;
}
function Di(e, t) {
  const n = t.getBoundingClientRect();
  e !== null && (e.hidden = n.width === 0, Te(e, t));
}
const Te = (e, t) => {
  e.setAttribute(p.ground, t.getAttribute(p.ground) ?? "");
}, Bi = (e) => Number.parseFloat(getComputedStyle(e).paddingBlockStart) || 0;
function Ui(e, t) {
  const n = t.querySelector(".scaffold-header")?.getBoundingClientRect();
  n !== void 0 && t.body.style.setProperty("--vperm-tab-top", `${String(n.bottom)}px`);
  const r = Math.ceil(e.querySelector(`.${l.tab}`)?.getBoundingClientRect().height ?? 0);
  r !== 0 && t.body.style.setProperty("--vperm-tab-tall", `${String(r)}px`);
}
function ji(e, t, n) {
  const r = Gi(e, l.tabCard, t);
  if (n === null) {
    r.hidden = !0;
    return;
  }
  r.hidden = n.getBoundingClientRect().width === 0, Te(r, n), Lt(r, n);
}
function Lt(e, t) {
  const n = t.getBoundingClientRect(), r = Bi(t);
  e.style.setProperty("--vperm-host-x", `${String(n.left)}px`), e.style.setProperty("--vperm-host-y", `${String(n.top + r)}px`), e.style.setProperty("--vperm-host-width", `${String(n.width)}px`), e.style.setProperty("--vperm-host-height", `${String(n.height - r)}px`);
}
function Wi(e, t, n, r) {
  if (e === null)
    return;
  const o = t.getBoundingClientRect();
  Te(e, t), e.hidden = o.width === 0 || o.left === 0 || n || On(t.ownerDocument) === 0 || Ki(o, r), Lt(e, t);
}
function Gi(e, t, n) {
  const r = e.querySelector(`.${t}`);
  if (r !== null)
    return r;
  const o = n.createElement("div");
  return o.className = t, e.append(o), o;
}
function Ki(e, t) {
  const n = t.find((r) => {
    const o = r.getBoundingClientRect();
    return o.width > 0 && Math.round(o.right) === Math.round(e.left);
  });
  return n === void 0 ? !1 : (Number.parseFloat(getComputedStyle(n).borderRightWidth) || 0) > 0;
}
function zi(e, t) {
  const n = e.createElement("div");
  return n.className = l.tabSeam, n.setAttribute(p.area, t), n;
}
function Vi(e, t) {
  const n = e.createElement("div");
  return n.className = l.areaCover, n.setAttribute(p.area, t), n;
}
function Hi(e, t, n) {
  e !== null && (e.hidden = !n, n && (Te(e, t), Lt(e, t)));
}
const Yi = (e, t) => (
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  se[e] === void 0 ? void 0 : t.find((n) => se[ie(n)] === se[e])
), De = (e, t) => e.querySelector(`.${l.tab}[${p.area}="${t}"]`), Ji = (e, t) => e.querySelector(`.${l.areaCover}[${p.area}="${t}"]`), Qi = (e, t) => e.querySelector(`.${l.tabSeam}[${p.area}="${t}"]`);
function cr(e) {
  return [...e.querySelectorAll(`.${l.frame}[${p.area}]`)];
}
const ie = (e) => e.getAttribute(p.area) ?? "", ur = "#modulemenu", Xi = `${ur} .modulemenu-group-container.collapse:not(.show)`, Zi = `${ur} [aria-controls]`, es = "typo3-backend-content-navigation[navigation-collapsed]", ln = "navigation-collapsed";
function ts(e, t) {
  let n = [];
  const r = () => {
    n.forEach((s) => {
      s();
    }), n = [];
    const { active: o, area: i } = k();
    o && rs(e, n), o && i === "modules" && ns(e, n);
  };
  e.addEventListener("dragstart", (o) => {
    k().active && (o.preventDefault(), o.stopPropagation());
  }, { capture: !0, signal: t }), r(), N(r, t);
}
function ns(e, t) {
  e.querySelectorAll(Xi).forEach((n) => {
    n.classList.add("show"), cn(e, n)?.setAttribute("aria-expanded", "true"), t.push(() => {
      n.classList.remove("show"), cn(e, n)?.setAttribute("aria-expanded", "false");
    });
  }), e.querySelectorAll(Zi).forEach((n) => {
    n.setAttribute("aria-disabled", "true"), t.push(() => {
      n.removeAttribute("aria-disabled");
    });
  });
}
function rs(e, t) {
  e.querySelectorAll(es).forEach((n) => {
    n.toggleAttribute(ln, !1), t.push(() => {
      n.toggleAttribute(ln, !0);
    });
  });
}
function cn(e, t) {
  return e.querySelector(`[aria-controls="${t.id}"]`);
}
const os = ".t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)", un = "scaffold-content-navigation-expanded";
function is(e, t) {
  let n = [];
  const r = () => {
    n.forEach((o) => {
      o.classList.remove(un);
    }), n = k().active ? [...e.querySelectorAll(os)] : [], n.forEach((o) => {
      o.classList.add(un);
    });
  };
  r(), N(r, t);
}
const dr = (e) => [...e, "web_list"], _e = dr(["web_layout", "records", "media_management", "permissions_pages"]), pr = "vperm.module";
function ss(e, t) {
  let n = null;
  const r = (i) => {
    us(e, i.active && i.area !== "modules");
    const s = `${String(i.active)} ${i.picked}`;
    if (s === n || (n = s, !i.active || _e.includes(ls(e))))
      return;
    const a = ds() ?? _e[0] ?? "", c = bt(e);
    if ((c !== "" || Tr(e)) && i.area === "fields") {
      xi(a);
      return;
    }
    c !== "" && e.addEventListener(
      "typo3-module-loaded",
      () => {
        as(e, c);
      },
      { once: !0, signal: t }
    ), lr(a);
  }, o = (i) => {
    const s = i.detail.module ?? "";
    k().active && _e.includes(s) && me(pr, s);
  };
  e.addEventListener("typo3-module-loaded", o, { signal: t }), N(r, t);
}
async function as(e, t) {
  const n = ce(e), r = await xn(t, n?.getAttribute("endpoint") ?? "");
  r !== "" && n?.setAttribute("endpoint", r);
}
function ls(e) {
  return ze.App.getCurrentModule() ?? ce(e)?.getAttribute("module") ?? "";
}
const fr = "[data-modulemenu-identifier]:not([aria-controls])", cs = `#modulemenu ${fr}`;
function us(e, t) {
  e.querySelectorAll(cs).forEach((n) => {
    const r = n.parentElement;
    r !== null && (r.hidden = t && !_e.includes(n.getAttribute("data-modulemenu-identifier") ?? ""));
  }), e.querySelectorAll("#modulemenu .modulemenu-group").forEach((n) => {
    n.hidden = [...n.querySelectorAll(fr)].every((r) => r.parentElement?.hidden === !0);
  });
}
function ds() {
  const e = fe.get(pr);
  return typeof e == "string" && _e.includes(e) ? e : void 0;
}
function ps(e, t) {
  const n = () => {
    e.querySelectorAll(".t3js-module-docheader-buttons").forEach((o) => {
      o.classList.add("t3js-module-docheader-bar-buttons");
    });
  }, r = new MutationObserver(n);
  r.observe(e.body, { childList: !0, subtree: !0 }), t.addEventListener("abort", () => {
    r.disconnect();
  }), n();
}
function fs(e) {
  U(({ doc: t }) => {
    t.querySelectorAll(".module-docheader-bar-navigation").forEach((n) => {
      n.classList.add("module-docheader-navigation");
    }), t.querySelectorAll(".module-docheader-bar-navigation > .module-docheader-bar-column-left").forEach((n) => {
      n.classList.add("module-docheader-column-breadcrumb");
    }), t.querySelectorAll(".module-docheader-bar-buttons").forEach((n) => {
      n.classList.add("module-docheader-buttons");
    }), t.querySelectorAll(".module-docheader-bar-buttons > .module-docheader-bar-column-left").forEach((n) => {
      n.classList.add("module-docheader-column-grow");
    });
  }, e);
}
function ms(e) {
  U(({ doc: t }) => {
    t.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])').forEach((n) => {
      n.setAttribute("data-typo3-tab", n.getAttribute("data-bs-target") ?? "");
    });
  }, e);
}
const hs = "[data-object-id]";
function mr(e, t) {
  let n = null, r = /* @__PURE__ */ new WeakSet();
  const o = () => {
    if (n === null)
      return;
    const { active: i, area: s } = k();
    if (!i || s !== "fields") {
      r = /* @__PURE__ */ new WeakSet(), gs(n, e);
      return;
    }
    n.querySelectorAll(e.shut).forEach((a) => {
      r.has(a) || (r.add(a), vs(a), hr(a, e));
    });
  };
  U((i) => {
    n = i.doc, o();
  }, t), N(o, t);
}
function gs(e, t) {
  e.querySelectorAll(hs).forEach((n) => {
    bs(n) && (ws(n), n.matches(t.shut) || hr(n, t));
  });
}
function hr(e, t) {
  e.querySelector(t.opener)?.click();
}
const Nt = (e) => (
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${e.getAttribute("data-object-id") ?? ""}`
);
function vs(e) {
  ae.set(Nt(e), "folded");
}
function bs(e) {
  return ae.isset(Nt(e));
}
function ws(e) {
  ae.unset(Nt(e));
}
function ys(e) {
  mr({
    shut: "[data-object-id].panel-collapsed",
    opener: "[data-bs-toggle] .form-irre-header-icon"
  }, e);
}
function ks(e, t) {
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
    w !== d && (d = w, c.disabled = !0, s.textContent = oe(e, w) ?? "", $s(w).then((y) => {
      if (w === d) {
        if (y === null) {
          d = null, n.remove();
          return;
        }
        r.replaceChildren(e.createRange().createContextualFragment(y.html)), m = w, c.disabled = !1, e.querySelector(`.${l.frame}[${p.area}="fields"]`)?.append(n), new Or().processItems([...y.scriptItems]);
      }
    }));
  };
  h(k()), N(h, t);
}
async function $s(e) {
  return ge(new Y(B(F.other_permissions)).withQueryArguments({ group: e }).get());
}
const _t = '.form-group:has(> select[name="_langSelector"])', ft = /* @__PURE__ */ new WeakMap();
function As(e, t) {
  const n = e.querySelector(`.module-docheader ${_t}`);
  n !== null && (ft.has(n) || ft.set(n, n.parentElement), t.after(n));
}
function Ss(e) {
  const t = e.querySelector(`.module-docheader ${_t}`);
  t !== null && ft.get(t)?.append(t);
}
const Es = (e) => `${e}, ${_t}`, Cs = ".module-docheader-navigation > .module-docheader-column-breadcrumb", qs = ".module-docheader-buttons .btn-toolbar > *", Ls = ".module-docheader-buttons > .module-docheader-column-grow", Ns = ".t3js-editform-close", _s = Es(`.${l.headButton}, .${l.showMenu}, .${l.typeSwitch}`), Os = 'form[name="editform"] h1';
function xs(e, t) {
  let n = null;
  const r = (i) => {
    const { active: s, area: a } = k();
    return s && a === "fields" && i.querySelector(`[${p.token}]`) !== null;
  }, o = () => {
    if (n === null)
      return;
    const i = n, s = r(i);
    i.querySelectorAll(`.${l.headBar}, .${l.headButton}, .${l.faceHint}`).forEach((v) => {
      v.remove();
    });
    const a = i.querySelector(Ns), c = k().face === "preview" ? a : null;
    if (i.querySelectorAll(qs).forEach((v) => {
      v.toggleAttribute("hidden", s && !v.matches(_s) && !v.contains(c));
    }), i.querySelectorAll(Os).forEach((v) => {
      v.toggleAttribute("hidden", s);
    }), !s)
      return;
    const u = i.querySelector(`[${p.token}][${p.inside}='']:not([${p.outOfReach}])`) !== null;
    if (!u && k().face === "pick") {
      Ee(i, () => {
        pe("preview");
      });
      return;
    }
    const d = k().face === "preview", m = i.createElement("div");
    if (m.className = l.headBar, m.append(
      O(i, l.faceEyebrow, g(d ? "platform.preview" : "platform.pick")),
      O(i, l.faceSentence, x(
        g(d ? "recordForm.previewFor" : "recordForm.pickFor"),
        oe(e, k().groupId) ?? ""
      ))
    ), i.querySelector(Cs)?.append(m), !d || !u)
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
    i.querySelector(Ls)?.append(h, O(i, l.faceHint, g("recordForm.hint")));
  };
  U((i) => {
    const s = i.doc === n;
    n = i.doc, o(), !s && At(
      i.doc,
      t,
      () => k().face === "pick",
      () => {
        Ee(i.doc, () => {
          pe("preview");
        });
      }
    );
  }, t), J("fields-judged", o, t), N(o, t);
}
const dn = `[${p.token}]`;
function Ps(e, t) {
  let n = null;
  const r = () => {
    const o = e.querySelector("#typo3-contentIframe")?.contentDocument ?? null;
    if (o?.body == null)
      return;
    let i = [...o.querySelectorAll(dn)];
    Gt({ doc: o, fields: i }), n?.disconnect(), n = new MutationObserver(() => {
      const s = [...o.querySelectorAll(dn)];
      Fs(s, i) || (i = s, Gt({ doc: o, fields: s }));
    }), n.observe(o.body, { childList: !0, subtree: !0 });
  };
  e.addEventListener("typo3-module-loaded", r, { signal: t }), t.addEventListener("abort", () => {
    n?.disconnect();
  }), r();
}
const Fs = (e, t) => e.length === t.length && e.every((n, r) => n === t[r]);
function Ms(e, t) {
  let n = [];
  const r = () => {
    if (n.forEach((i) => {
      i();
    }), n = [], !k().active)
      return;
    e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelectorAll("typo3-backend-new-content-element-wizard-button").forEach((i) => {
      const s = i.lastChild, a = s.textContent;
      s.textContent = g("readOnly.previewNewContent"), n.push(() => {
        s.textContent = a;
      });
    });
  };
  r(), N(r, t);
}
const Ts = dr(["records"]);
function Is(e, t) {
  let n = k().active;
  const r = () => !(e.querySelector("#typo3-contentIframe")?.contentDocument?.querySelector('form[name="editform"]') != null) && Ts.includes(ze.App.getCurrentModule() ?? "");
  N(({ active: o }) => {
    o !== n && Ir().then(() => {
      r() && xr.ContentContainer.refresh();
    }), n = o;
  }, t);
}
function Rs(e, t) {
  const n = () => {
    const o = (e.querySelector("#typo3-contentIframe")?.contentWindow).TYPO3.FormEngine;
    if (o === void 0)
      return;
    const i = o.preventExitIfNotSaved.bind(o);
    o.preventExitIfNotSaved = (s) => {
      if (k().active) {
        s(!0);
        return;
      }
      i(s);
    };
  };
  e.addEventListener("typo3-module-loaded", n, { capture: !0, signal: t });
}
const Ds = ".module-docheader-buttons .btn-toolbar", pn = "vperm.show", fn = "vperm.identify", mn = (e, t, n) => {
  if (n) {
    ae.set(e, t);
    return;
  }
  ae.unset(e);
}, hn = (e, t) => {
  if (e.setAttribute("aria-selected", String(t)), !t) {
    e.removeAttribute("data-dropdowntoggle-status");
    return;
  }
  e.setAttribute("data-dropdowntoggle-status", "active");
};
function Bs(e) {
  let t = null;
  const n = (o) => {
    const { active: i, area: s } = k();
    return i && s === "fields" && o.querySelector(`[${p.token}]:not([${p.outOfReach}])`) !== null;
  }, r = () => {
    if (t === null)
      return;
    const o = t;
    if (!n(o)) {
      o.querySelectorAll(`.${l.showMenu}`).forEach((c) => {
        c.remove();
      }), o.body.removeAttribute(p.show), Ss(o);
      return;
    }
    if (vn(o, ae.get(pn) === "list"), gn(o, ae.get(fn) === "said"), o.querySelector(`.${l.showMenu} .dropdown-menu.show`) !== null)
      return;
    o.querySelectorAll(`.${l.showMenu}`).forEach((c) => {
      c.remove();
    });
    const i = o.createElement("div");
    i.className = `btn-group ${l.showMenu}`;
    const s = o.createElement("button");
    s.type = "button", s.className = "btn btn-sm btn-default dropdown-toggle", s.setAttribute("data-bs-toggle", "dropdown"), s.setAttribute("aria-expanded", "false"), s.append(gr(o, "actions-filter"), ` ${g("recordForm.show")}`);
    const a = o.createElement("ul");
    a.className = "dropdown-menu", a.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      bn(o, g("recordForm.show.listOnly"), "actions-list", () => o.body.hasAttribute(p.show), (c) => {
        mn(pn, "list", c), vn(o, c);
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      bn(o, g("recordForm.show.identifiers"), "actions-tag", () => o.body.hasAttribute(p.identify), (c) => {
        mn(fn, "said", c), gn(o, c);
      })
    ), i.append(s, a), o.querySelector(Ds)?.append(i), As(o, i);
  };
  U((o) => {
    t = o.doc, r();
  }, e), J("fields-judged", r, e), N(r, e);
}
function gn(e, t) {
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
function gr(e, t) {
  const n = e.createElement("typo3-backend-icon");
  return n.setAttribute("identifier", t), n.setAttribute("size", "small"), n;
}
function vn(e, t) {
  if (!t) {
    e.body.removeAttribute(p.show);
    return;
  }
  e.body.setAttribute(p.show, "list");
}
function bn(e, t, n, r, o) {
  const i = e.createElement("button");
  i.type = "button", i.className = "dropdown-item dropdown-item-spaced";
  const s = e.createElement("span");
  s.className = "dropdown-item-status", i.append(s, gr(e, n), ` ${t}`), i.addEventListener("click", () => {
    o(!r()), hn(i, r());
  }), hn(i, r());
  const a = e.createElement("li");
  return a.append(i), a;
}
function Us(e) {
  return nt.normalizedCtrlModifierKey === $n.META ? `⌘⇧${e.toUpperCase()}` : `${TYPO3.settings.visualPermissions?.modifiers ?? ""}+${e.toUpperCase()}`;
}
function Ot(e, t, n, r = !1) {
  if (e !== "") {
    if (TYPO3.settings.visualPermissions?.keysOnButtons !== !1) {
      const o = t.ownerDocument.createElement("kbd");
      o.textContent = Us(e), t.append(o);
    }
    nt.register(
      [nt.normalizedCtrlModifierKey, $n.SHIFT, e],
      n,
      { allowOnEditables: r, bindElement: t }
    );
  }
}
function js(e, t) {
  const n = e.querySelector(`[${p.toggle}]`);
  if (n === null)
    return;
  const r = (o) => {
    n.setAttribute("aria-pressed", String(o.active)), n.disabled = o.groupId === null;
  };
  r(k()), n.addEventListener("click", () => {
    if (k().active) {
      Ln();
      return;
    }
    Dr();
  }, { signal: t }), Ot(TYPO3.settings.visualPermissions?.toggleKey ?? "", n, () => {
    n.click();
  }, !0), N(r, t);
}
function Ws(e) {
  mr({
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
const vr = 600, Gs = 250, Ks = 2e3, zs = 320, Pt = "vperm.arriving";
function br(e, t, n) {
  if (Me(e)) {
    n();
    return;
  }
  let r = !1;
  const o = () => {
    r || (r = !0, n());
  };
  be(Pt, t), e.body.setAttribute(p.leaving, t), e.body.addEventListener("animationend", (i) => {
    i.target === e.body && o();
  }), window.setTimeout(o, vr);
}
function Vs(e) {
  e.body.setAttribute(p.settling, "");
}
function Hs(e) {
  const t = Ys();
  if (t === null)
    return;
  xt(Pt), e.body.setAttribute(p.settling, ""), e.body.setAttribute(p.arriving, t);
  let n = !1, r = !1, o = !1;
  const i = new AbortController(), s = () => {
    !n || !r || o || (o = !0, i.abort(), e.body.removeAttribute(p.settling), e.body.removeAttribute(p.arriving), e.body.setAttribute(p.unwrapping, ""), window.setTimeout(() => {
      e.body.removeAttribute(p.unwrapping);
    }, zs));
  }, a = () => {
    n = !0, s();
  }, c = () => {
    r = !0, s();
  };
  e.body.addEventListener("animationend", (d) => {
    d.target === e.body && a();
  }), window.setTimeout(a, vr);
  let u = 0;
  e.addEventListener("typo3-module-loaded", () => {
    window.clearTimeout(u), u = window.setTimeout(c, Gs);
  }, { signal: i.signal }), window.setTimeout(c, Ks);
}
function Ys() {
  return we(Pt);
}
const wr = "vperm.viewing", yr = "vperm.seen", kr = "vperm.room";
function Js(e) {
  be(wr, e);
}
function Qs(e) {
  be(kr, String(e));
}
function Xs() {
  return we(kr);
}
function Zs(e) {
  const t = we(wr);
  t !== null && be(yr, JSON.stringify({
    ...Ft(),
    [t]: { place: En(e), document: bt(e) }
  }));
}
function ea(e) {
  return An(Ft()[e]);
}
function ta(e) {
  return Sn(Ft()[e]);
}
function Ft() {
  const e = we(yr);
  return e === null ? {} : JSON.parse(e);
}
function na(e, t) {
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
  const c = Xs();
  c !== null && a.style.setProperty("--vperm-room-width", `${c}px`), n.append(a), _n(e, a, t), o.addEventListener("click", () => {
    Zs(e), br(e, "up", () => {
    });
  }, { signal: t }), Ot(s, o, () => {
    o.click();
  }), t.addEventListener("abort", () => {
    a.remove();
  });
}
const Mt = "vperm.opening";
function $r(e, t) {
  e !== "" && be(Mt, JSON.stringify({ record: e, screen: t }));
}
function ra(e) {
  const t = ia(), n = ce(e)?.getAttribute("endpoint") ?? "";
  t === null || n === "" || !oa(t.screen, n, e.location.href) || (xt(Mt), sa(e, n, t.record));
}
function oa(e, t, n) {
  const r = new URL(e, n), o = new URL(t, n);
  return r.pathname === o.pathname && (r.searchParams.get("id") ?? "") === (o.searchParams.get("id") ?? "");
}
function ia() {
  const e = we(Mt);
  try {
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
async function sa(e, t, n) {
  const r = await xn(n, t);
  r !== "" && Mr(e, r);
}
const Ar = Pn(F.viewable_users), aa = {
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
}, mt = "vperm.returnTo", ht = "vperm.returning", la = "vperm.userSearch";
function ca(e, t, n = aa) {
  const r = fe.get(mt), o = An(r);
  return o !== "" && ua(o) ? ($r(Sn(r), o), me(mt, { place: "" }).then(() => {
    n.go(o);
  }), !0) : (da(e, t, n), !1);
}
function ua(e) {
  return we(ht) === e ? !1 : (be(ht, e), !0);
}
function da(e, t, n) {
  const r = e.querySelector(`[${p.viewAs}]`);
  if (r === null)
    return;
  const o = Dn(e, {
    totalOne: g("viewAsUser.total.one"),
    totalMany: g("viewAsUser.total.many"),
    take: g("viewAsUser.key.take"),
    detail: g("viewAsUser.key.detail"),
    loading: g("viewAsUser.loading"),
    failed: g("viewAsUser.failed")
  });
  o.remembers = la, o.placeholder = g("viewAsUser.search"), o.addNew = { label: g("viewAsUser.new"), url: r.getAttribute(p.newRecord) ?? "" }, e.body.append(o), o.addEventListener("vperm:picked", (i) => {
    Sr(e, Number(i.detail.id), n);
  }, { signal: t }), o.addEventListener("vperm:retry", () => {
    gt(e, o);
  }, { signal: t }), o.addEventListener("vperm:detail-picked", (i) => {
    wt(Number(i.detail.id));
  }, { signal: t }), r.addEventListener("click", () => {
    gt(e, o), o.openedBy(r);
  }, { signal: t }), Ot(TYPO3.settings.visualPermissions?.switchUserKey ?? "", r, () => {
    pa(e, n, r, o);
  }), t.addEventListener("abort", () => {
    o.remove();
  });
}
async function pa(e, t, n, r) {
  const o = await Ar().catch(() => null), i = o?.recent.find((s) => o.users.some((a) => a.id === s));
  if (i === void 0) {
    gt(e, r), r.openedBy(n);
    return;
  }
  await Sr(e, i, t);
}
async function gt(e, t) {
  t.state = "loading";
  const [n] = await Promise.all([Ar().catch(() => null), Fn(e)]);
  if (n === null) {
    t.state = "failed";
    return;
  }
  const { recent: r, users: o } = n;
  t.state = "ready";
  const i = He(e), s = new Map(o.map((u) => [u.id, u])), a = r.map((u) => s.get(u)).filter((u) => u !== void 0), c = o.filter((u) => !r.includes(u.id));
  t.entries = [
    ...a.map((u) => wn(u, g("viewAsUser.recent"), i)),
    ...c.map((u) => wn(u, g("viewAsUser.all"), i))
  ];
}
function wn(e, t, n) {
  const r = e.groups.map((o) => ({ id: String(o), title: n[String(o)]?.title ?? "", depth: 0 })).filter((o) => o.title !== "").sort((o, i) => o.title.localeCompare(i.title));
  return {
    id: String(e.id),
    title: e.realName === "" ? e.username : e.realName,
    subtitle: e.realName === "" ? "" : e.username,
    note: fa(r.length),
    detail: r,
    detailHeading: ma(r.length),
    heading: t
  };
}
function fa(e) {
  return e === 0 ? "" : z("viewAsUser.groups", e, e);
}
function ma(e) {
  return e === 0 ? g("viewAsUser.detail.none") : z("viewAsUser.detail", e, e);
}
async function Sr(e, t, n) {
  xt(ht), Js(String(t)), Qs(e.querySelector(`.${l.viewAsControls}`)?.getBoundingClientRect().width ?? 0), await me(mt, { place: En(e), document: bt(e) });
  const r = ea(String(t));
  $r(ta(String(t)), r), ha(t, n, r);
}
function ha(e, t, n) {
  Fr(document), br(document, "down", () => {
    t.handOver(B(F.view_as_user), {
      targetUser: String(e),
      screen: n
    });
  });
}
function yn() {
  if (window.top !== window)
    return;
  const e = new AbortController();
  Gr(e.signal), zr(document, e.signal), js(document, e.signal), ro(document, e.signal), ms(e.signal), fs(e.signal), Uo(e.signal), li(document, e.signal), Oi(document, e.signal), di(e.signal), pi(e.signal), hi(e.signal), ts(document, e.signal), Ms(document, e.signal), Is(document, e.signal), is(document, e.signal), ss(document, e.signal), Wo(document, e.signal), Ti(document, e.signal), ks(document, e.signal), ps(document, e.signal), Vo(document, e.signal), Jo(e.signal), Rs(document, e.signal), xs(document, e.signal), Bs(e.signal), Ws(e.signal), ys(e.signal), Ps(document, e.signal);
  const t = ca(document, e.signal);
  na(document, e.signal), t ? Vs(document) : (ra(document), Hs(document));
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", yn, { once: !0 }) : yn();
//# sourceMappingURL=main.js.map
