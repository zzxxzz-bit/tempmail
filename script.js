/* ==========================================================
   SPLORTCH CLICKER — brainrot idle/clicker game
   Tout le state est sauvegardé dans localStorage.
   ========================================================== */

const SAVE_KEY = "splortch-clicker-save-v1";

/* ---------- Phrases brainrot pour le ticker + les floaters ---------- */
const TICKER_PHRASES = [
  "🧠 t'as le rizz d'un ohio final boss",
  "💀 skibidi toilet a validé ton grind",
  "🚨 fanum tax appliqué sur tes neurones",
  "😭 c'est tellement sigma ce que tu fais là",
  "🔥 gyatt niveau max détecté",
  "🌀 le brainrot monte, le QI descend",
  "🧃 hydrate-toi, même les NPC le font",
  "📉 ton IQ: -47 et ça continue de baisser",
  "🎭 only in ohio ce genre de move",
  "⚡ tu deviens littéralement une légende sigma",
  "🥶 trop froid, même le rizz gèle",
  "🚨 tu aimes les zommes",
  "🫠 splortch approuve ton grind sans limite",
];

/* ---------- Upgrades (id, nom, emoji, desc, coût de base, gain, type) ---------- */
const UPGRADES = [
  { id:"doigt",      name:"Doigt Turbo",            emoji:"👆", desc:"+1 par clic",              baseCost: 15,     type:"click", power: 1 },
  { id:"souris",     name:"Souris Sigma Edition",    emoji:"🖱️", desc:"+3 par clic",              baseCost: 100,    type:"click", power: 3 },
  { id:"ventilo",    name:"Ventilateur à Skibidi",   emoji:"🌀", desc:"+1 neurone/s",             baseCost: 25,     type:"auto",  power: 1 },
  { id:"toilette",   name:"Toilette Sigma",          emoji:"🚽", desc:"+4 neurones/s",            baseCost: 150,    type:"auto",  power: 4 },
  { id:"gyatt",      name:"Générateur de Gyatt",     emoji:"📈", desc:"+10 par clic",             baseCost: 800,    type:"click", power: 10 },
  { id:"ferme",      name:"Ferme de Tralala",        emoji:"🌾", desc:"+20 neurones/s",           baseCost: 1200,   type:"auto",  power: 20 },
  { id:"serveur",    name:"Serveur Discord 3h du mat", emoji:"💬", desc:"+90 neurones/s",         baseCost: 6000,   type:"auto",  power: 90 },
  { id:"ia",         name:"IA qui génère du brainrot", emoji:"🤖", desc:"+400 neurones/s",        baseCost: 30000,  type:"auto",  power: 400 },
  { id:"clone",      name:"Clone de toi-même",       emoji:"🫂", desc:"+120 par clic",            baseCost: 45000,  type:"click", power: 120 },
  { id:"portail",    name:"Portail Dimensionnel Ohio", emoji:"🌌", desc:"+2200 neurones/s",       baseCost: 200000, type:"auto",  power: 2200 },
  { id:"boss",       name:"Fanum Tax Corporation",   emoji:"🏢", desc:"+9000 neurones/s",         baseCost: 1200000,type:"auto",  power: 9000 },
  { id:"singularite",name:"Singularité Skibidi",     emoji:"🕳️", desc:"+3000 par clic",           baseCost: 5000000,type:"click", power: 3000 },
];

/* ---------- Succès ---------- */
const ACHIEVEMENTS = [
  { id:"click10",   name:"10 clics",         emoji:"👆", check: s => s.totalClicks >= 10 },
  { id:"click500",  name:"500 clics",        emoji:"🔥", check: s => s.totalClicks >= 500 },
  { id:"click5000", name:"5000 clics",       emoji:"🖐️", check: s => s.totalClicks >= 5000 },
  { id:"score100",  name:"100 neurones",     emoji:"🧠", check: s => s.totalEarned >= 100 },
  { id:"score10k",  name:"10k neurones",     emoji:"💰", check: s => s.totalEarned >= 10000 },
  { id:"score1m",   name:"1M neurones",      emoji:"🤑", check: s => s.totalEarned >= 1000000 },
  { id:"score1b",   name:"1Md neurones",     emoji:"👑", check: s => s.totalEarned >= 1e9 },
  { id:"upg1",      name:"1er upgrade",      emoji:"🛒", check: s => Object.values(s.owned).some(n => n > 0) },
  { id:"upg50",     name:"50 upgrades",      emoji:"📦", check: s => Object.values(s.owned).reduce((a,b)=>a+b,0) >= 50 },
  { id:"crit1",     name:"1er coup critique",emoji:"💥", check: s => s.totalCrits >= 1 },
  { id:"crit100",   name:"100 critiques",    emoji:"⚡", check: s => s.totalCrits >= 100 },
  { id:"prestige1", name:"1er rebirth",      emoji:"💀", check: s => s.prestige >= 1 },
  { id:"prestige5", name:"5 rebirths",       emoji:"👻", check: s => s.prestige >= 5 },
  { id:"allupg",    name:"Tout débloqué",    emoji:"🏆", check: s => UPGRADES.every(u => s.owned[u.id] >= 1) },
];

/* ---------- State par défaut ---------- */
function defaultState(){
  return {
    score: 0,
    totalEarned: 0,
    totalClicks: 0,
    totalCrits: 0,
    clickPower: 1,
    perSecond: 0,
    owned: {},        // id -> quantité
    unlockedAch: {},   // id -> true
    prestige: 0,
    prestigeMult: 1,
  };
}

let state = loadState();

/* ---------- Save / Load ---------- */
function loadState(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){
    console.warn("Save corrompue, reset.", e);
    return defaultState();
  }
}
function saveState(){
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

/* ---------- Helpers économie ---------- */
function costFor(upg){
  const owned = state.owned[upg.id] || 0;
  return Math.ceil(upg.baseCost * Math.pow(1.15, owned));
}
function fmt(n){
  if(n < 1000) return Math.floor(n).toString();
  const units = ["", "K", "M", "Md", "Bn", "Tn", "Qa", "Qi"];
  let unitIndex = 0;
  let val = n;
  while(val >= 1000 && unitIndex < units.length - 1){
    val /= 1000;
    unitIndex++;
  }
  return val.toFixed(val < 10 ? 2 : 1) + units[unitIndex];
}
function recalcPower(){
  let click = 1;
  let auto = 0;
  for(const upg of UPGRADES){
    const qty = state.owned[upg.id] || 0;
    if(qty <= 0) continue;
    if(upg.type === "click") click += upg.power * qty;
    else auto += upg.power * qty;
  }
  state.clickPower = Math.round(click * state.prestigeMult);
  state.perSecond = Math.round(auto * state.prestigeMult * 10) / 10;
}

/* ---------- DOM refs ---------- */
const scoreDisplay = document.getElementById("scoreDisplay");
const perSecDisplay = document.getElementById("perSecDisplay");
const prestigeDisplay = document.getElementById("prestigeDisplay");
const clickPowerDisplay = document.getElementById("clickPowerDisplay");
const critChanceDisplay = document.getElementById("critChanceDisplay");
const clicker = document.getElementById("clicker");
const shopList = document.getElementById("shopList");
const achGrid = document.getElementById("achGrid");
const achProgress = document.getElementById("achProgress");
const floaters = document.getElementById("floaters");
const comboBanner = document.getElementById("comboBanner");
const chaosBg = document.getElementById("chaosBg");
const prestigeBtn = document.getElementById("prestigeBtn");
const prestigeGainText = document.getElementById("prestigeGainText");
const tickerTrack = document.getElementById("tickerTrack");
const pupilL = document.getElementById("pupilL");
const pupilR = document.getElementById("pupilR");

const CRIT_CHANCE = 0.02;
critChanceDisplay.textContent = Math.round(CRIT_CHANCE * 100) + "%";

/* ---------- Ticker ---------- */
function buildTicker(){
  const doubled = [...TICKER_PHRASES, ...TICKER_PHRASES];
  tickerTrack.innerHTML = doubled.map(p => `<span>${p}</span>`).join("");
}
buildTicker();

/* ---------- Rendu du shop ---------- */
function renderShop(){
  shopList.innerHTML = "";
  for(const upg of UPGRADES){
    const owned = state.owned[upg.id] || 0;
    const cost = costFor(upg);
    const btn = document.createElement("button");
    btn.className = "shop-item";
    btn.disabled = state.score < cost;
    btn.innerHTML = `
      <span class="shop-emoji">${upg.emoji}</span>
      <span class="shop-info">
        <span class="shop-name">${upg.name}</span><br>
        <span class="shop-desc">${upg.desc}</span>
        <div class="shop-meta">
          <span class="owned">possédé: ${owned}</span>
          <span class="cost">coût: ${fmt(cost)}</span>
        </div>
      </span>
    `;
    btn.addEventListener("click", () => buyUpgrade(upg));
    shopList.appendChild(btn);
  }
}

function buyUpgrade(upg){
  const cost = costFor(upg);
  if(state.score < cost) return;
  state.score -= cost;
  state.owned[upg.id] = (state.owned[upg.id] || 0) + 1;
  recalcPower();
  renderAll();
  saveState();
}

/* ---------- Rendu des succès ---------- */
function renderAchievements(){
  achGrid.innerHTML = "";
  let unlockedCount = 0;
  for(const ach of ACHIEVEMENTS){
    const isUnlocked = !!state.unlockedAch[ach.id];
    if(isUnlocked) unlockedCount++;
    const div = document.createElement("div");
    div.className = "ach-badge" + (isUnlocked ? " unlocked" : "");
    div.textContent = ach.emoji;
    div.setAttribute("data-name", isUnlocked ? ach.name : "???");
    achGrid.appendChild(div);
  }
  achProgress.textContent = `${unlockedCount} / ${ACHIEVEMENTS.length} débloqués`;
}

function checkAchievements(){
  let newUnlock = null;
  for(const ach of ACHIEVEMENTS){
    if(!state.unlockedAch[ach.id] && ach.check(state)){
      state.unlockedAch[ach.id] = true;
      newUnlock = ach;
    }
  }
  if(newUnlock){
    showCombo(`🏆 succès débloqué : ${newUnlock.name}`);
    renderAchievements();
  }
}

/* ---------- Chaos visuel selon le score ---------- */
function updateChaosLevel(){
  chaosBg.className = "chaos-bg";
  if(state.totalEarned > 1e9) chaosBg.classList.add("lvl-4");
  else if(state.totalEarned > 1e6) chaosBg.classList.add("lvl-3");
  else if(state.totalEarned > 1e4) chaosBg.classList.add("lvl-2");
}

/* ---------- Combo banner ---------- */
let comboTimeout;
function showCombo(text){
  comboBanner.textContent = text;
  clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => { comboBanner.textContent = ""; }, 2200);
}

/* ---------- Floaters (+N au clic) ---------- */
function spawnFloater(x, y, text, isCrit){
  const el = document.createElement("div");
  el.className = "floater" + (isCrit ? " crit" : "");
  el.textContent = text;
  el.style.left = (x + (Math.random() * 40 - 20)) + "px";
  el.style.top = y + "px";
  floaters.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

/* ---------- Yeux qui suivent le curseur (juste pour le fun) ---------- */
document.addEventListener("pointermove", (e) => {
  const rect = clicker.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = Math.max(-4, Math.min(4, (e.clientX - cx) / 40));
  const dy = Math.max(-4, Math.min(4, (e.clientY - cy) / 40));
  pupilL.setAttribute("cx", 75 + dx);
  pupilL.setAttribute("cy", 100 + dy);
  pupilR.setAttribute("cx", 131 + dx);
  pupilR.setAttribute("cy", 100 + dy);
});

/* ---------- Clic principal ---------- */
clicker.addEventListener("click", (e) => {
  const isCrit = Math.random() < CRIT_CHANCE;
  const gain = isCrit ? state.clickPower * 10 : state.clickPower;

  state.score += gain;
  state.totalEarned += gain;
  state.totalClicks += 1;
  if(isCrit) state.totalCrits += 1;

  const rect = clicker.getBoundingClientRect();
  spawnFloater(e.clientX, e.clientY, "+" + fmt(gain), isCrit);

  if(isCrit){
    clicker.classList.add("crit");
    setTimeout(() => clicker.classList.remove("crit"), 250);
    showCombo(TICKER_PHRASES[Math.floor(Math.random() * TICKER_PHRASES.length)]);
  }

  checkAchievements();
  renderTopStats();
  renderShop();
  updateChaosLevel();
});

/* ---------- Boucle passive (auto income) ---------- */
setInterval(() => {
  if(state.perSecond > 0){
    state.score += state.perSecond / 10;
    state.totalEarned += state.perSecond / 10;
    checkAchievements();
    renderTopStats();
    renderShop();
    updateChaosLevel();
  }
}, 100);

/* ---------- Sauvegarde auto ---------- */
setInterval(saveState, 5000);

/* ---------- Top stats ---------- */
function renderTopStats(){
  scoreDisplay.textContent = fmt(state.score);
  perSecDisplay.textContent = fmt(state.perSecond);
  prestigeDisplay.textContent = state.prestige;
  clickPowerDisplay.textContent = fmt(state.clickPower);
  const nextMult = prestigeGainOnRebirth();
  prestigeGainText.textContent = `+${nextMult.toFixed(2)}× en rebirth maintenant`;
  prestigeBtn.disabled = state.totalEarned < 100000;
}

/* ---------- Prestige ---------- */
function prestigeGainOnRebirth(){
  // gain basé sur le total gagné depuis le dernier rebirth (approx via totalEarned)
  return Math.sqrt(state.totalEarned / 100000) * 0.1;
}
prestigeBtn.addEventListener("click", () => {
  if(state.totalEarned < 100000) return;
  const gain = prestigeGainOnRebirth();
  if(!confirm(`Devenir NPC va réinitialiser ton score et tes upgrades, contre +${gain.toFixed(2)}× de multiplicateur permanent. Confirmer ?`)) return;

  state.prestigeMult += gain;
  state.prestige += 1;
  state.score = 0;
  state.owned = {};
  state.totalEarned = 0; // reset le compteur servant au prochain calcul de gain

  recalcPower();
  renderAll();
  saveState();
  showCombo("💀 tu es officiellement un NPC");
});

/* ---------- Export / Import ---------- */
document.getElementById("exportBtn").addEventListener("click", () => {
  saveState();
  const encoded = btoa(JSON.stringify(state));
  navigator.clipboard?.writeText(encoded).catch(()=>{});
  prompt("Copie ce code (déjà copié dans ton presse-papier si autorisé) :", encoded);
});

const importDialog = document.getElementById("importDialog");
document.getElementById("importBtn").addEventListener("click", () => importDialog.showModal());
document.getElementById("importCancel").addEventListener("click", () => importDialog.close());
document.getElementById("importConfirm").addEventListener("click", () => {
  const raw = document.getElementById("importText").value.trim();
  try{
    const parsed = JSON.parse(atob(raw));
    state = Object.assign(defaultState(), parsed);
    recalcPower();
    renderAll();
    saveState();
    importDialog.close();
  }catch(e){
    alert("Code de save invalide.");
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if(!confirm("Reset TOTAL de la partie (score, upgrades, succès, rebirths). Sûr ?")) return;
  state = defaultState();
  recalcPower();
  renderAll();
  saveState();
});

/* ---------- Menu mobile ---------- */
const shopPanel = document.getElementById("shopPanel");
const sidePanel = document.getElementById("sidePanel");
document.getElementById("menuToggle").addEventListener("click", () => {
  shopPanel.classList.toggle("open");
  sidePanel.classList.toggle("open");
});

/* ---------- Rendu global ---------- */
function renderAll(){
  renderTopStats();
  renderShop();
  renderAchievements();
  updateChaosLevel();
}

recalcPower();
renderAll();
