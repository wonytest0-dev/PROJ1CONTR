const API = "https://raw.githubusercontent.com/wonpyu/testing/refs/heads/main/final.json";

let data;
let mode = "daily";
let category = "global";
let selected = "Song";
let selectedCountry = "All Countries";
let selectedAlbum = "All Albums";

const countryNames = {
  AR: "Argentina", AU: "Australia", AT: "Austria", BG: "Bulgaria", BO: "Bolivia", BY: "Belarus", CL: "Chile", CR: "Costa Rica", JP: "Japan", KR: "South Korea", LV: "Latvia",
  PH: "Philippines", SA: "Saudi Arabia", SG: "Singapore", TH: "Thailand", TW: "Taiwan", UA: "Ukraine", VE: "Venezuela", VN: "Vietnam", PY: "Paraguay",
  BE: "Belgium", BR: "Brazil", CA: "Canada", CY: "Cyprus", CZ: "Czech Republic", DK: "Denmark", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt", SV: "El Salvador",
  EE: "Estonia", FI: "Finland", FR: "France", DE: "Germany", GR: "Greece", GT: "Guatemala", HN: "Honduras", HK: "Hong Kong", HU: "Hungary", IS: "Iceland", ID: "Indonesia",
  IE: "Ireland", IL: "Israel", IT: "Italy", KZ: "Kazakhstan", LT: "Lithuania", IN: "India", LU: "Luxembourg", MX: "Mexico", MA: "Morocco", NL: "Netherlands",
  NZ: "New Zealand", NI: "Nicaragua", NG: "Nigeria", NO: "Norway", PK: "Pakistan", PA: "Panama", PE: "Peru", PL: "Poland", PT: "Portugal", RO: "Romania",
  SK: "Slovakia", ZA: "South Africa", ES: "Spain", SE: "Sweden", CH: "Switzerland", TR: "Turkey", AE: "UAE", GB: "United Kingdom", UY: "Uruguay",
  US: "USA", MY: "Malaysia", CO: "Colombia"
};

async function renderSpotifyChart() {
  const container = document.getElementById("chart-content");
  container.innerHTML = "<p style='padding:40px;color:white;text-align:center;'>Loading...</p>";

  try {
    // Menambahkan timestamp unik agar browser tidak mengambil cache rusak dari GitHub
    const cacheBuster = `?_=${new Date().getTime()}`;
    const res = await fetch(API + cacheBuster);

    if (!res.ok) {
      throw new Error(`Failed loading API (Status: ${res.status}) 😭`);
    }

    data = await res.json();
    render();

  } catch (err) {
    // Memberikan tombol Coba Lagi jika server GitHub sedang down sesaat
    container.innerHTML = `
      <div style="text-align:center; padding:40px; color:white;">
        <p style="color:#ff4d4d; margin-bottom:15px;">${err.message}</p>
        <button onclick="renderSpotifyChart()" style="padding:10px 20px; background:#1DB954; color:white; border:none; border-radius:99px; font-weight:bold; cursor:pointer;">
          Try Again ↺
        </button>
      </div>
    `;
    console.error(err);
  }
}


function getEntries() {
  if (!data) return [];

  // GLOBAL CHART
  if (category === "global") {
    return mode === "daily"
      ? data.global?.daily?.filter(x => x.country === "GLOBAL") || []
      : data.global?.weekly?.filter(x => x.country === "GLOBAL") || [];
  }

  // SONG
  if (category === "song") {
    const countryData = mode === "daily" ? (data.song?.daily || []) : (data.song?.weekly || []);
    const globalData = mode === "daily" ? (data.global?.daily || []) : (data.global?.weekly || []);
    return [...globalData, ...countryData];
  }

  // ARTIST
  if (category === "artist") {
    const artistData = mode === "daily" ? (data.artist?.daily || []) : (data.artist?.weekly || []);
    const globalArtist = artistData.filter(x => x.country === "GLOBAL");
    return [...globalArtist, ...artistData];
  }

  // ALBUM
  if (category === "album") {
    const albumData = data.album?.weekly || [];
    const globalAlbum = albumData.filter(x => x.country === "GLOBAL");
    return [...globalAlbum, ...albumData];
  }

  return [];
}

function render() {
  const container = document.getElementById("chart-content");
  const entries = getEntries();

  if (!selected) {
    selected = getDefaultSelection(entries);
  }

  const filtered = filterEntries(entries);
  const options = getOptions(entries);
  const globalOptions = ["Song", "Album", "Artist"];

  // Styling dropdown versi tombol (Pill Shape)
  const selectStyle = `
    padding: 10px 18px;
    padding-right: 36px;
    border-radius: 99px;
    background: #2a2a38; 
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  `;

  container.innerHTML = `
<div style="
padding:22px;
border-radius:34px;
background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
border:1px solid rgba(255,255,255,.08);
backdrop-filter: blur(20px);
overflow:hidden;
margin-bottom:18px;
">

<div style="display:flex; align-items:center; gap:14px;">
<img src="https://i.scdn.co/image/ab67616100005174cf3a9c35db52ba44f3b921e3" style="width:58px; height:58px; border-radius:999px; object-fit:cover; border:1px solid rgba(255,255,255,.12); flex-shrink:0;" />
<div>
<div style="font-size:23px; font-weight:800; color:white; letter-spacing:-.4px;">JIMIN</div>
<div style="font-size:13px; color:#9d9d9d; margin-top:2px;">Spotify Chart Update</div>
<div style="font-size:12px; color:#888; margin-top:5px;">Updated • ${getDate()}</div>
</div>
</div>

<div style="height:1px; background: rgba(255,255,255,.08); margin:18px 0;"></div>

<div style="display:flex; gap:42px; align-items:center; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling: touch; padding-bottom:2px;">
<button onclick="changeMode('daily')" style="border:none; background:none; padding:0; font-size:15px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; color: ${mode === "daily" ? "#ffffff" : "rgba(255,255,255,.42)"};">DAILY</button>
<button onclick="changeMode('weekly')" style="border:none; background:none; padding:0; font-size:15px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; color: ${mode === "weekly" ? "#ffffff" : "rgba(255,255,255,.42)"};">WEEKLY</button>
</div>

<div style="height:1px; background: rgba(255,255,255,.08); margin:18px 0;"></div>

<div style="display:flex; gap:22px; align-items:center; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling: touch; padding-bottom:2px;">
<button onclick="changeCategory('global')" style="border:none; background:none; padding:0; font-size:15px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; color: ${category === "global" ? "#ffffff" : "rgba(255,255,255,.42)"};">GLOBAL CHART</button>
<button onclick="changeCategory('song')" style="border:none; background:none; padding:0; font-size:15px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; color: ${category === "song" ? "#ffffff" : "rgba(255,255,255,.42)"};">SONG</button>
<button onclick="changeCategory('artist')" style="border:none; background:none; padding:0; font-size:15px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; color: ${category === "artist" ? "#ffffff" : "rgba(255,255,255,.42)"};">ARTIST</button>
<button onclick="changeCategory('album')" style="border:none; background:none; padding:0; font-size:15px; font-weight:800; cursor:pointer; white-space:nowrap; flex-shrink:0; color: ${category === "album" ? "#ffffff" : "rgba(255,255,255,.42)"};">ALBUM</button>
</div>
</div>

<div class="chart-select-wrap" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
<select id="chartSelect" style="${selectStyle}">
${category === "global"
      ? globalOptions.map(item => `<option style="color:#000;" value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("")
      : options.map(item => `<option style="color:#000;" value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("")}
</select>

${category === "global" && selected === "Song" ? `
<select id="albumSelect" style="${selectStyle}">
<option style="color:#000;" value="All Albums">All Albums</option>
${[...new Set((mode === "daily" ? (data.global?.daily || []) : (data.global?.weekly || [])).filter(x => x.country === "GLOBAL" && x.songGroup).map(x => x.songGroup))].map(album => `
<option style="color:#000;" value="${album}" ${selectedAlbum === album ? "selected" : ""}>${album}</option>`).join("")}
</select>` : ""}

${category === "song" || category === "album" ? `
<select id="countrySelect" style="${selectStyle}">
<option style="color:#000;" value="All Countries">All Countries</option>
${(() => {
        const priorityCountries = ["GLOBAL", "USA", "Japan", "United Kingdom", "Germany", "France", "Brazil", "Canada", "Mexico", "South Korea"];
        const countries = [...new Set(entries.map(x => countryNames[x.country] || x.country))];
        return countries.sort((a, b) => {
          const aIndex = priorityCountries.indexOf(a);
          const bIndex = priorityCountries.indexOf(b);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.localeCompare(b);
        }).map(country => `<option style="color:#000;" value="${country}" ${country === selectedCountry ? "selected" : ""}>${country}</option>`).join("");
      })()}
</select>` : ""}
</div>

${category === "global" ? (
      selected === "Song" ? renderGlobalChart(mode === "daily" ? (data.global?.daily || []) : (data.global?.weekly || []), "song")
        : selected === "Album" ? renderGlobalChart(data.album?.weekly?.filter(x => x.country === "GLOBAL") || [], "album")
          : selected === "Artist" ? renderGlobalChart(mode === "daily" ? (data.artist?.daily?.filter(x => x.country === "GLOBAL") || []) : (data.artist?.weekly?.filter(x => x.country === "GLOBAL") || []), "artist") : ""
    ) : (selectedCountry === "All Countries" ? renderTop(filtered) + renderTable(filtered) : "")}

<div id="country-chart-container"></div>
`;

  document.getElementById("chartSelect").onchange = function () {
    selected = this.value;
    selectedCountry = "All Countries";
    const container = document.getElementById("country-chart-container");
    if (container) { container.innerHTML = ""; }
    render();
  };

  const albumSelect = document.getElementById("albumSelect");
  if (albumSelect) { albumSelect.onchange = function () { selectedAlbum = this.value; render(); }; }

  const countrySelect = document.getElementById("countrySelect");
  if (countrySelect) {
    countrySelect.onchange = function () {
      selectedCountry = this.value;
      render();
      setTimeout(() => { renderCountryChart(); }, 100);
    };
  }
}

function getOptions(entries) {
if (category === "song") {
  const count = {};

  entries.forEach(item => {
    count[item.track] = (count[item.track] || 0) + 1;
  });

  return Object.keys(count)
    .sort((a, b) => count[b] - count[a]);
}
  if (category === "album") { return [...new Set(entries.map(x => x.album))]; }
  
  if (category === "artist") {
    const countries = [...new Set(entries.map(x => countryNames[x.country] || x.country))].sort();
    const filteredCountries = countries.filter(c => c.toUpperCase() !== "GLOBAL" && c !== "All Countries");
    return ["All Countries", ...filteredCountries];
  }
  
  return [...new Set(entries.map(x => countryNames[x.country] || x.country))].sort();
}


function getDefaultSelection(entries) {
  if (category === "artist") { return "Global"; }
  const count = {};
  entries.forEach(item => { const key = category === "song" ? item.track : item.album; count[key] = (count[key] || 0) + 1; });
  return Object.keys(count).sort((a, b) => count[b] - count[a])[0];
}

function filterEntries(entries) {
  if (category === "song") {
    return entries.filter(x => x.track === selected).sort((a, b) => { if (a.country === "GLOBAL") return -1; if (b.country === "GLOBAL") return 1; return 0; });
  }
  if (category === "album") {
    return entries.filter(x => x.album === selected).sort((a, b) => { if (a.country === "GLOBAL") return -1; if (b.country === "GLOBAL") return 1; return 0; });
  }
  if (selected === "Global") {
    return [...entries].sort((a, b) => { if (a.country === "GLOBAL") return -1; if (b.country === "GLOBAL") return 1; return 0; });
  }
  return entries.filter(x => (countryNames[x.country] || x.country) === selected);
}
function renderTop(entries){
if(!entries.length)return"";
const item=entries[0];
return`
<div style="display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:10px; margin-bottom:0; background:linear-gradient(135deg,#1e1e2d,#14141f); border:1px solid rgba(255,255,255,0.08); border-bottom:none; padding:20px; border-radius:28px 28px 0 0; box-shadow:0 10px 30px rgba(0,0,0,.3);">
<div style="display:flex; align-items:center; gap:20px;">
<img src="${item.image}" style="width:90px;height:90px;border-radius:20px;object-fit:cover;">
<div>
<h2 style="color:white; margin:0; font-size: clamp(18px, 5vw, 24px); word-break: break-word;">${item.track||item.album||item.artist}</h2>
<p style="color:#aaa; margin:4px 0 0 0;">${item.artists?.join(", ")||item.artist}</p>
</div>
</div>
</div>
`;
}


function renderTable(entries){
const thirdColumn= category==="song" ?"Streams" :"Appearances";
return`
<div style="background:#14141f; border-radius:0 0 28px 28px; padding:18px; margin-top:0; border:1px solid rgba(255,255,255,0.08); border-top:none; box-shadow:0 10px 30px rgba(0,0,0,.3); overflow:hidden;">
<table style="width:100%; color:#fff; border-collapse:collapse; font-size:13px; line-height:1.3;">
<tr>
<th style="text-align:left; color:#a0aec0; padding:10px 6px;">Country</th>
<th style="text-align:left; color:#a0aec0; padding:10px 6px;">Rank</th>
<th style="text-align:left; color:#a0aec0; padding:10px 6px;">Peak</th>
<th style="text-align:right; color:#a0aec0; padding:10px 6px;">${thirdColumn}</th>
</tr>
${[...entries].sort((a,b)=>Number(b.streams||0)-Number(a.streams||0)).map(item=>`
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
<td style="padding:12px 6px; color:#ffffff;">${item.country==="GLOBAL" ?'<span style="font-weight:700; color:#00ffff;">GLOBAL</span>' :(countryNames[item.country]||item.country)}</td>
<td style="padding:12px 6px; font-weight:600; color:#ffffff;">
#${item.rank}
<span style="color:${item.entryStatus==="NEW_ENTRY" ?"#4DA6FF" :item.entryStatus==="RE_ENTRY" ?"#B266FF" :item.direction==="up" ?"#1DB954" :item.direction==="down" ?"#ff4d4d" :"#888"}; font-weight:700; margin-left:4px;">
${item.entryStatus==="NEW_ENTRY" ?"NEW" :item.entryStatus==="RE_ENTRY" ?"↺ RE" :item.direction==="up" ?`▲ ${Number(item.rankChange)||0}` :item.direction==="down" ?`▼ ${Number(item.rankChange)||0}` :"="}
</span>
</td>
<td style="padding:12px 6px;"><span style="background:#2b6cb0; color:white; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:800;">#${item.peakRank || 1}</span></td>
<td style="padding:12px 6px; text-align:right; font-weight:500; font-variant-numeric:tabular-nums; color:#ffffff;">
${category==="song" ?(item.streams ?`${Number(item.streams).toLocaleString()} ${item.streamChange !== undefined ? `<span style="color:${Number(item.streamChange) > 0 ? "#1DB954" : Number(item.streamChange) < 0 ? "#ff4d4d" : "#888"}; font-weight:700; font-size:11px; margin-left:4px; opacity:.9; white-space:nowrap;">(${Number(item.streamChange) > 0 ? "+" : ""}${Number(item.streamChange).toLocaleString()})</span>` : ""}` :"-" ) :(item.appearances?.toLocaleString() ||"-")}
</td>
</tr>`).join("")}
</table>
</div>
`;
}



function renderGlobalChart(entries, category="song"){
const cardColors=[
  "rgba(29,185,84,.12)",
  "rgba(173,140,255,.12)",
  "rgba(255,120,140,.12)",
  "rgba(255,220,120,.12)",
  "rgba(120,180,255,.12)"
];

// BY ALBUM MODE
if(category==="song" && selectedAlbum && selectedAlbum!=="All Albums" && selectedAlbum!=="By Album"){
const songs = (mode==="daily" ? (data.global?.daily || []) : (data.global?.weekly || [])).filter(x => x.country==="GLOBAL" && x.songGroup===selectedAlbum).sort((a,b)=>Number(b.streams||0)-Number(a.streams||0));
if(!songs.length){ return `<div style="padding:40px; text-align:center; color:white;">No album data 😭</div>`; }
const totalStreams= songs.reduce((sum,item)=>sum+Number(item.streams||0),0);

return `
<div style="margin-top:10px;">
<div style="display:flex; align-items:center; gap:18px; padding:20px; border-radius:28px 28px 0 0; background: linear-gradient(135deg, #1e1e2d, #14141f); border:1px solid rgba(255,255,255,0.08); border-bottom:none; box-shadow: 0 10px 30px rgba(0,0,0,.3);">
<img src="${songs[0]?.image}" style="width:90px; height:90px; border-radius:22px; object-fit:cover;" />
<div>
<h2 style="margin:0; font-size: clamp(18px, 5vw, 24px); font-weight:800; color:white; text-transform: uppercase; line-height:1.1;">${selectedAlbum} CHART</h2>
<p style="margin:6px 0 0; color:#ddd;">Jimin</p>
<p style="margin:4px 0 0; color:#fff; font-size:14px; font-weight:700;">${totalStreams.toLocaleString()} Streams</p>
</div>
</div>

<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:16px; padding:20px; background:#14141f; border-radius: 0 0 28px 28px; border:1px solid rgba(255,255,255,0.08); border-top:none;">
${songs.map((item,index)=>{
const peakRank = item.peakRank || 1;
const rankChangeColor = item.entryStatus==="NEW_ENTRY" ?"#63b3ed" :item.entryStatus==="RE_ENTRY" ?"#b794f4" :item.direction==="up" ?"#4ade80" :item.direction==="down" ?"#f87171" :"#a0aec0";
const rankChangeBg = item.entryStatus==="NEW_ENTRY" ?"rgba(49,130,206,0.15)" :item.entryStatus==="RE_ENTRY" ?"rgba(128,90,213,0.15)" :item.direction==="up" ?"rgba(22,163,74,0.15)" :item.direction==="down" ?"rgba(239,68,68,0.15)" :"rgba(255,255,255,0.08)";
const rankChangeText = item.entryStatus==="NEW_ENTRY" ?"NEW" :item.entryStatus==="RE_ENTRY" ?"↺ RE" :item.direction==="up" ?`+${item.rankChange}` :item.direction==="down" ?`-${item.rankChange}` :"=";

return `
<div style="background:${cardColors[index%5]}; border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:16px; box-shadow:0 4px 15px rgba(0,0,0,0.1); display:flex; flex-direction:column; gap:12px;">
<div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
  <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
    <div style="display:flex; flex-direction:column; align-items:center; min-width:44px;">
      <span style="font-size:22px; font-weight:800; color:#ffffff; line-height:1;">#${item.rank}</span>
      <span style="margin-top:4px; font-size:10px; font-weight:700; color:${rankChangeColor}; background:${rankChangeBg}; padding:2px 6px; border-radius:6px; white-space:nowrap;">${rankChangeText}</span>
    </div>
    <img src="${item.image}" style="width:52px; height:52px; border-radius:12px; object-fit:cover; flex-shrink:0; box-shadow:0 4px 8px rgba(0,0,0,0.2);" />
    <div style="flex:1; min-width:0;">
      <div style="font-weight:700; color:#ffffff; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.track}</div>
      <div style="font-size:12px; color:#a0aec0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">Jimin</div>
    </div>
  </div>
  <div style="display:flex; gap:18px; text-align:right; flex-shrink:0;">
    <div style="display:flex; flex-direction:column; align-items:flex-end;">
      <div style="background:#2b6cb0; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:30px; letter-spacing:0.5px; margin-bottom:6px;">PEAK: #${peakRank}</div>
      <span style="font-size:10px; color:#a0aec0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Streams</span>
      <span style="font-size:14px; font-weight:700; color:#ffffff; margin-top:2px;">${Number(item.streams||0).toLocaleString()}</span>
      ${item.streamChange !== undefined ? `<span style="font-size:11px; font-weight:700; color:${Number(item.streamChange)>=0?'#4ade80':'#f87171'}; margin-top:1px;">${Number(item.streamChange)>=0?'+':''}${Number(item.streamChange).toLocaleString()}</span>` : ''}
    </div>
  </div>
</div>
</div>`;
}).join("")}
</div>
</div>`;
}

if(!entries.length){
return `<div style="margin-top:20px; padding:40px 24px; border-radius:28px; background:linear-gradient(135deg, #111, #1b1b1b); border:1px solid rgba(255,255,255,.08); text-align:center;"><div style="font-size:20px; font-weight:800; color:white; margin-bottom:8px;">No Jimin on Global Chart‼️</div><div style="font-size:14px; color:#999;">Jimin is currently not charting globally 🚨🚨</div></div>`;
}

const topCharts = [...entries].sort((a,b)=>a.rank-b.rank).slice(0,30);

return `
<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:16px; margin-top:10px;">
${topCharts.map((item,index)=>{
const peakRank = item.peakRank || 1;
const rankChangeColor = item.entryStatus==="NEW_ENTRY" ?"#63b3ed" :item.entryStatus==="RE_ENTRY" ?"#b794f4" :item.direction==="up" ?"#4ade80" :item.direction==="down" ?"#f87171" :"#a0aec0";
const rankChangeBg = item.entryStatus==="NEW_ENTRY" ?"rgba(49,130,206,0.15)" :item.entryStatus==="RE_ENTRY" ?"rgba(128,90,213,0.15)" :item.direction==="up" ?"rgba(22,163,74,0.15)" :item.direction==="down" ?"rgba(239,68,68,0.15)" :"rgba(255,255,255,0.08)";
const rankChangeText = item.entryStatus==="NEW_ENTRY" ?"NEW" :item.entryStatus==="RE_ENTRY" ?"↺ RE" :item.direction==="up" ?`+${item.rankChange}` :item.direction==="down" ?`-${item.rankChange}` :"=";

return `
<div style="background:${cardColors[index%5]}; border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:16px; box-shadow:0 4px 15px rgba(0,0,0,0.1); display:flex; flex-direction:column; gap:12px;">
<div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
  <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
    <div style="display:flex; flex-direction:column; align-items:center; min-width:44px;">
      <span style="font-size:22px; font-weight:800; color:#ffffff; line-height:1;">#${item.rank}</span>
      <span style="margin-top:4px; font-size:10px; font-weight:700; color:${rankChangeColor}; background:${rankChangeBg}; padding:2px 6px; border-radius:6px; white-space:nowrap;">${rankChangeText}</span>
    </div>
    
  <img src="${item.image}" style="width:52px; height:52px; border-radius:12px; object-fit:cover; flex-shrink:0; box-shadow:0 4px 8px rgba(0,0,0,0.2);" />
    <div style="flex:1; min-width:0;">
      <div style="font-weight:700; color:#ffffff; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.track||item.album||item.artist}</div>
      <div style="font-size:12px; color:#a0aec0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">${item.artists?.join(", ")||item.artist||"-"}</div>
    </div>
  </div>
  <div style="display:flex; gap:18px; text-align:right; flex-shrink:0;">
    <div style="display:flex; flex-direction:column; align-items:flex-end;">
      <div style="background:#2b6cb0; color:#ffffff; font-size:9px; font-weight:800; padding:2px 8px; border-radius:30px; letter-spacing:0.5px; margin-bottom:6px;">PEAK: #${peakRank}</div>
      <span style="font-size:10px; color:#a0aec0; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${category==="song"?"Streams":"Appearances"}</span>
      <span style="font-size:14px; font-weight:700; color:#ffffff; margin-top:2px;">${category==="song" ? Number(item.streams).toLocaleString() : (item.appearances?.toLocaleString()||"-")}</span>
      ${category==="song" && item.streamChange !== undefined ? `<span style="font-size:11px; font-weight:700; color:${Number(item.streamChange)>0?"#4ade80":Number(item.streamChange)<0?"#f87171":"#a0aec0"}; margin-top:1px;">(${Number(item.streamChange)>0?"+":""}${Number(item.streamChange).toLocaleString()})</span>` : ""}
    </div>
  </div>
</div>
</div>`;
}).join("")}
</div>`;
}

function getDate(){

let rawDate;

if(category==="global"){
rawDate =
mode==="daily"
? data.global?.dailyLastUpdate
: data.global?.weeklyLastUpdate;
}

else if(category==="album"){
rawDate =
data.album?.weeklyLastUpdate;
}

else{
rawDate =
mode==="daily"
? data[category]?.dailyLastUpdate
: data[category]?.weeklyLastUpdate;
}

if(!rawDate) return "-";

return new Date(rawDate)
.toLocaleDateString(
"en-US",
{
month:"long",
day:"numeric",
year:"numeric",
timeZone:"UTC"
}
);

}

function changeMode(newMode){ mode=newMode; if(category!=="global"){ selected=null; } render(); }
function changeCategory(newCategory){ category=newCategory; selectedCountry="All Countries"; if(newCategory==="global"){ selected="Song"; }else{ selected=null; } render(); }

function renderCountryChart(){

if(
selectedCountry
===
"All Countries"
){
return;
}

const container =
document.getElementById(
"country-chart-container"
);

const entries =
getEntries();

const filtered =
entries
.filter(item=>{

const country =
countryNames[
item.country
]
||
item.country;

if(
category
===
"song"
){

return (
country
===
selectedCountry
&&
item.artists
?.join(" ")
.toLowerCase()
.includes(
"jimin"
)
);

}

if(
category
===
"album"
){

return (
country
===
selectedCountry
&&
(
item.artists
?.join(" ")
.toLowerCase()
.includes(
"jimin"
)
||
item.artist
?.toLowerCase()
.includes(
"jimin"
)
)
);

}

return false;

})
.sort(
(a,b)=>
a.rank
-
b.rank
);

if(
!filtered.length
){

container.innerHTML =
"";

return;

}

const cardColors = [
"rgba(29,185,84,.12)",
"rgba(173,140,255,.12)",
"rgba(255,120,140,.12)",
"rgba(255,220,120,.12)",
"rgba(120,180,255,.12)"
];

container.innerHTML =
`
<div style="
margin-top:20px;
">

<div style="
display:flex;
align-items:center;
gap:18px;
padding:20px;
border-radius:
28px 28px 0 0;
background:
linear-gradient(
135deg,
#1e1e2d,
#14141f
);
border:1px solid
rgba(
255,
255,
255,
0.08
);
border-bottom:none;
box-shadow:
0 10px 30px
rgba(
0,
0,
0,
.3
);
">

<img
src="${
filtered[0]
.image
}"
style="
width:90px;
height:90px;
border-radius:
22px;
object-fit:cover;
"
/>

<div>

<h2 style="
margin:0;
font-size:
clamp(
18px,
5vw,
24px
);
font-weight:800;
color:white;
text-transform:
uppercase;
line-height:1.15;
word-break:
break-word;
">
JIMIN CHART
${selectedCountry}
</h2>

<p style="
margin:6px 0 0;
color:#ddd;
">
Jimin
</p>

</div>
</div>

<div style="
display:grid;
grid-template-columns:
repeat(
auto-fill,
minmax(
320px,
1fr
)
);
gap:16px;
padding:18px;
background:#14141f;
border-radius:
0 0 28px 28px;
border:1px solid
rgba(
255,
255,
255,
0.08
);
border-top:none;
">

${filtered.map(
(item,index)=>{

const peakRank =
item.peakRank
||
item.rank
||
1;

const rankChangeColor =

item.entryStatus
===
"NEW_ENTRY"

? "#63b3ed"

: item.entryStatus
===
"RE_ENTRY"

? "#b794f4"

: item.direction
===
"up"

? "#4ade80"

: item.direction
===
"down"

? "#f87171"

: "#a0aec0";

const rankChangeBg =

item.entryStatus
===
"NEW_ENTRY"

? "rgba(49,130,206,0.15)"

: item.entryStatus
===
"RE_ENTRY"

? "rgba(128,90,213,0.15)"

: item.direction
===
"up"

? "rgba(22,163,74,0.15)"

: item.direction
===
"down"

? "rgba(239,68,68,0.15)"

: "rgba(255,255,255,0.08)";

const rankChangeText =

item.entryStatus
===
"NEW_ENTRY"

? "NEW"

: item.entryStatus
===
"RE_ENTRY"

? "↺ RE"

: item.direction
===
"up"

? `▲${item.rankChange}`

: item.direction
===
"down"

? `▼${item.rankChange}`

: "=";

return `

<div style="
background:
${
cardColors[
index % 5
]
};
border:1px solid
rgba(
255,
255,
255,
0.08
);
border-radius:
18px;
padding:16px;
box-shadow:
0 4px 15px
rgba(
0,
0,
0,
0.1
);
display:flex;
flex-direction:
column;
gap:12px;
">

<div style="
display:flex;
align-items:center;
justify-content:
space-between;
gap:12px;
">

<div style="
display:flex;
align-items:center;
gap:12px;
flex:1;
min-width:0;
">

<div style="
display:flex;
flex-direction:
column;
align-items:center;
min-width:44px;
">

<span style="
font-size:22px;
font-weight:800;
color:#ffffff;
line-height:1;
">
#${item.rank}
</span>

<span style="
margin-top:4px;
font-size:10px;
font-weight:700;
color:
${rankChangeColor};
background:
${rankChangeBg};
padding:2px 6px;
border-radius:6px;
white-space:
nowrap;
">
${rankChangeText}
</span>

</div>

<img
src="${
item.image
}"
style="
width:52px;
height:52px;
border-radius:
12px;
object-fit:cover;
flex-shrink:0;
"
/>

<div style="
flex:1;
min-width:0;
">

<div style="
font-weight:700;
color:#ffffff;
font-size:14px;
white-space:
nowrap;
overflow:hidden;
text-overflow:
ellipsis;
">
${
item.track
||
item.album
}
</div>

<div style="
font-size:12px;
color:#a0aec0;
margin-top:2px;
">
Jimin
</div>

</div>
</div>

<div style="
display:flex;
gap:18px;
text-align:right;
flex-shrink:0;
">

<div style="
display:flex;
flex-direction:
column;
align-items:flex-end;
">

<div style="
background:#2b6cb0;
color:#ffffff;
font-size:9px;
font-weight:800;
padding:2px 8px;
border-radius:30px;
margin-bottom:6px;
">
PEAK:
#${peakRank}
</div>

<span style="
font-size:10px;
color:#a0aec0;
font-weight:700;
text-transform:
uppercase;
">
${
category
===
"song"
? "Streams"
: "Appearances"
}
</span>

<span style="
font-size:14px;
font-weight:700;
color:#ffffff;
margin-top:2px;
">
${
category
===
"song"

? Number(
item.streams
||
0
).toLocaleString()

: (
item.appearances
?.toLocaleString()
||
"-"
)
}
</span>

${
category
===
"song"

? `
<span style="
font-size:11px;
font-weight:700;
color:
${
Number(
item.streamChange
)>0
? "#4ade80"
: Number(
item.streamChange
)<0
? "#f87171"
: "#a0aec0"
};
margin-top:1px;
">
(${
Number(
item.streamChange
)>0
? "+"
: ""
}${
Number(
item.streamChange
||
0
)
.toLocaleString()
})
</span>
`

: ""
}

</div>
</div>
</div>
</div>

`;

}).join("")}

</div>
</div>
`;

}


renderSpotifyChart();

