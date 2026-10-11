'use strict';
// Finished neural recordings are shared by every device; no device speech is used.
(() => {
const AUDIO_CACHE='bangla-literature-audio-v1',KEY='bangla-literature-recorded-audio-v1';
let rate=1,autoTurn=true;try{const saved=JSON.parse(localStorage.getItem(KEY));if([.9,1,1.1].includes(saved?.rate))rate=saved.rate;if(typeof saved?.autoTurn==='boolean')autoTurn=saved.autoTurn}catch{}
let audio=null,card=null,story=null,mode='idle',generation=0,savedCount=0,statusMessage='',downloads=new Set();
let advance=null,turnTimer=null,pendingTurn=false,transition=false,prepared=false,removeAudioListeners=null;
const el=id=>document.getElementById(id),supportsCache='caches' in window&&window.isSecureContext;
const time=n=>`${Math.floor((n||0)/60)}:${String(Math.floor((n||0)%60)).padStart(2,'0')}`;
function persist(){try{localStorage.setItem(KEY,JSON.stringify({rate,autoTurn}))}catch{}}
function progress(){if(!el('narration-position'))return;const duration=Number.isFinite(audio?.duration)?audio.duration:card?.narration?.duration||0,current=audio?.currentTime||0;el('narration-position').value=String(duration?Math.round(current/duration*1000):0);el('narration-position').setAttribute('aria-valuetext',`${time(current)} of ${time(duration)}`);el('narration-time').textContent=`${time(current)} / ${time(duration)}`;el('narration-position').disabled=!card?.narration;}
function sync(){
 if(!el('listen-card'))return;
 const available=!!card?.narration;
 el('listen-card').disabled=!available||mode==='loading';el('listen-card').textContent=mode==='paused'?'▶ Resume English':mode==='playing'?'↺ Replay English':mode==='loading'?'Loading audio…':mode==='between'?'▶ Next card now':'▶ Listen in English';
 el('pause-card').hidden=!['playing','loading','between'].includes(mode);el('stop-card').hidden=!['playing','paused','loading','between'].includes(mode);
 el('narration-auto-turn').checked=autoTurn;
 const downloading=downloads.has(story?.id),allSaved=savedCount===12;
 el('save-narration').disabled=!available||!supportsCache||downloading||allSaved;
 el('save-narration').textContent=downloading?'Saving narration…':allSaved?'✓ Narration saved offline':'↓ Save story audio offline';
 el('narration-status').textContent=statusMessage||(mode==='playing'?'Recorded English narration · Heart voice':mode==='paused'?'Paused. Resume continues where you stopped.':mode==='loading'?'Loading the recorded narration…':'Natural English recording · Heart voice · gentle pace');
 el('audio-offline-status').textContent=supportsCache?`Offline audio: ${savedCount}/12 cards saved`:'Offline audio saving needs HTTPS or localhost.';
 progress();
}
async function refreshSaved(){
 const id=story?.id;if(!id||!supportsCache){savedCount=0;sync();return}
 try{const cache=await caches.open(AUDIO_CACHE),results=await Promise.all(story.cards.map(c=>c.narration?cache.match(new URL('./'+c.narration.asset,location.href).href):null));if(story?.id===id){savedCount=results.filter(Boolean).length;sync()}}catch{if(story?.id===id){savedCount=0;sync()}}
}
function cancelTurn(){clearTimeout(turnTimer);turnTimer=null;pendingTurn=false}
function stop(){generation++;cancelTurn();removeAudioListeners?.();removeAudioListeners=null;prepared=false;if(audio){audio.pause();audio.removeAttribute('src');audio.load()}audio=null;mode='idle';statusMessage='';sync()}
function dispose(){stop()}
function turnPage(){
 clearTimeout(turnTimer);turnTimer=null;
 if(!pendingTurn||!autoTurn)return;
 if(document.hidden){mode='paused';sync();return}
 pendingTurn=false;transition=true;let moved=false;
 try{moved=advance?.()===true}finally{transition=false}
 if(moved)listen();else{mode='idle';statusMessage='Story finished. Explore the author or try the quiz whenever you’re ready.';sync();refreshSaved()}
}
function prepareAudio(){
 if(prepared||!card?.narration)return;
 const token=generation;
 if(!audio)audio=new Audio();prepared=true;audio.preload='none';audio.src=new URL('./'+card.narration.asset,location.href).href;audio.playbackRate=rate;
 const valid=()=>token===generation;
 const player=audio,listeners=[];const on=(event,handler)=>{player.addEventListener(event,handler);listeners.push([event,handler])};
 removeAudioListeners=()=>listeners.forEach(([event,handler])=>player.removeEventListener(event,handler));
 on('playing',()=>{if(valid()){if(mode==='paused'){audio.pause();return}mode='playing';statusMessage='';sync();refreshSaved()}});
 on('timeupdate',()=>{if(valid())progress()});
 on('loadedmetadata',()=>{if(valid())progress()});
 on('ended',()=>{if(valid()&&mode==='playing'){
  if(autoTurn&&story?.cards.indexOf(card)<story.cards.length-1){pendingTurn=true;mode='between';statusMessage='Next card in a moment…';sync();turnTimer=setTimeout(turnPage,800)}
  else{mode='idle';statusMessage=autoTurn?'Story finished. Explore the author or try the quiz whenever you’re ready.':'Card finished. Listen again whenever you like.';sync()}
  refreshSaved();
 }});
 on('waiting',()=>{if(valid()&&mode==='playing'){statusMessage='Buffering the recorded narration…';sync()}});
 on('error',()=>{if(valid()){cancelTurn();mode='idle';statusMessage=navigator.onLine?'The recording could not load. Try again when the connection is ready.':'This card’s audio is not saved yet. Go online and choose Save story audio offline.';sync()}});
}
async function listen(){
 if(!card?.narration)return;
 if(pendingTurn){turnPage();return}
 if((mode==='playing'||mode==='idle')&&audio&&Number.isFinite(audio.duration))audio.currentTime=0;
 if(audio?.error)audio.load();
 prepareAudio();const token=generation;mode='loading';statusMessage='';sync();
 try{await audio.play();if(token===generation){if(mode==='paused')audio.pause();else if(mode==='loading')mode='playing';sync()}}catch(error){if(token===generation&&mode!=='paused'){mode='idle';statusMessage=error.name==='NotAllowedError'?'Tap Listen again to enable audio.':navigator.onLine?'The recording could not play. Tap Listen to try again.':'This audio is not saved yet. Go online to save the story narration.';sync()}}
}
function pause(){if(!audio||!['playing','loading','between'].includes(mode))return;clearTimeout(turnTimer);turnTimer=null;audio.pause();mode='paused';statusMessage=pendingTurn?'Paused before the next card. Resume when you’re ready.':'';sync()}
async function saveStoryAudio(){
 if(!supportsCache||!story||downloads.has(story.id))return;
 const target=story,id=target.id;downloads.add(id);statusMessage='Saving all 12 recordings for offline listening…';sync();
 let count=0;
 try{
  const cache=await caches.open(AUDIO_CACHE);
  for(let i=0;i<target.cards.length;i+=3){
   await Promise.all(target.cards.slice(i,i+3).map(async c=>{
    if(!c.narration)throw Error('Recording unavailable');
    const url=new URL('./'+c.narration.asset,location.href).href;
    if(!await cache.match(url)){const response=await fetch(url);if(!response.ok||response.status===206)throw Error('Download failed');await cache.put(url,response)}
    count++;
    if(story?.id===id){savedCount=count;statusMessage=`Saving narration: ${count}/12 cards…`;sync()}
   }));
  }
  if(story?.id===id)statusMessage='All 12 recordings saved. This story is ready for offline listening.';
 }catch{if(story?.id===id)statusMessage='Some audio could not be saved. Reconnect and try again; finished downloads are kept.'}
 finally{downloads.delete(id);if(story?.id===id){sync();await refreshSaved()}}
}
function markup(){return `<section class="narration" aria-label="Recorded English card narration"><div class="narration-actions"><button id="listen-card" type="button">▶ Listen in English</button><button id="pause-card" type="button" hidden>Ⅱ Pause</button><button id="stop-card" type="button" hidden>■ Stop</button></div><div class="audio-progress"><label class="sr-only" for="narration-position">Seek within this card’s narration</label><input id="narration-position" type="range" min="0" max="1000" step="1" value="0"><span id="narration-time">0:00</span></div><div class="audio-tools"><label for="narration-rate">Playback pace</label><select id="narration-rate"><option value="0.9">Slower</option><option value="1">Gentle original</option><option value="1.1">A little faster</option></select></div><label class="auto-turn"><input id="narration-auto-turn" type="checkbox" checked><span>Auto-turn after narration <span lang="bn">· স্বয়ংক্রিয় কার্ড বদল</span></span></label><p id="narration-status" class="note" role="status" aria-live="polite"></p><div class="audio-offline"><button id="save-narration" type="button">↓ Save story audio offline</button><span id="audio-offline-status" class="note"></span></div></section>`}
function mount(c,s,next){
 if(transition&&c&&story?.id===s?.id){generation++;cancelTurn();removeAudioListeners?.();removeAudioListeners=null;prepared=false;audio?.pause();mode='idle';statusMessage=''}else dispose();
 card=c;story=c?s:null;advance=next;savedCount=0;if(!c)return;el('narration-rate').value=String(rate);sync();refreshSaved();
}
document.addEventListener('click',e=>{const id=e.target.closest('button')?.id;if(id==='listen-card')listen();else if(id==='pause-card')pause();else if(id==='stop-card')stop();else if(id==='save-narration')saveStoryAudio()});
document.addEventListener('change',e=>{if(e.target.id==='narration-rate'){rate=Number(e.target.value);if(audio)audio.playbackRate=rate;persist()}else if(e.target.id==='narration-auto-turn'){autoTurn=e.target.checked;persist();if(!autoTurn&&pendingTurn){cancelTurn();mode='idle';statusMessage='Auto-turn off. Choose Next whenever you’re ready.'}sync()}});
document.addEventListener('input',e=>{if(e.target.id==='narration-position'&&audio&&Number.isFinite(audio.duration)){if(pendingTurn){cancelTurn();mode='paused';statusMessage='';sync()}audio.currentTime=Number(e.target.value)/1000*audio.duration;progress()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
window.addEventListener('pagehide',dispose);
window.CardNarration={markup,mount,stop};
})();
