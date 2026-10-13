// Literature release: bangla-literature-6356e0288755
'use strict';
// One persistent story player. Finished recordings contain only the story text.
(() => {
const AUDIO_CACHE='bangla-literature-audio-v1',KEY='bangla-literature-recorded-audio-v1';
const STORAGE_KEY='bangla-literature-offline-storage-v1';
let storageState=readStorageState(),storageBusy=false,clearKind='',storageMessage='';
const downloadTasks=new Set(),storyControllers=new Set();
function readStorageState(){try{const state=JSON.parse(localStorage.getItem(STORAGE_KEY))||{epoch:0,disabled:false,clearing:false};if(state.clearing&&Date.now()-(state.startedAt||0)>30000)return{...state,clearing:false};return state}catch{return{epoch:0,disabled:false,clearing:false}}}
function storageBlocked(){const state=readStorageState();return storageBusy||state.disabled||state.clearing}
function maySave(epoch){const state=readStorageState();return !state.disabled&&!state.clearing&&state.epoch===epoch}
function setStorageState(next){storageState=next;localStorage.setItem(STORAGE_KEY,JSON.stringify(next));window.dispatchEvent(new Event('offline-storage-change'))}
function runDownload(task){const pending=task();downloadTasks.add(pending);pending.finally(()=>downloadTasks.delete(pending))}
let rate=1;try{const saved=JSON.parse(localStorage.getItem(KEY));if([.9,1,1.1].includes(saved?.rate))rate=saved.rate}catch{}
let audio=null,card=null,story=null,navigate=null,mode='idle',generation=0,savedCount=0,statusMessage='';
let turnTimer=null,pendingTurn=false,transition=false,prepared=false,removeListeners=null,seekTo=null;
const downloads=new Set(),el=id=>document.getElementById(id),supportsCache='caches' in window&&window.isSecureContext;
const libraryAssets=window.LITERATURE.stories.flatMap(s=>s.cards.map(c=>new URL('./'+c.narration.asset,location.href).href)),libraryURLs=new Set(libraryAssets);
let librarySaving=false,librarySaved=new Set(),libraryMessage='',libraryController=null,libraryCancelled=false;
const time=n=>`${Math.floor((n||0)/60)}:${String(Math.floor((n||0)%60)).padStart(2,'0')}`;
const index=()=>story?.cards.indexOf(card)??0;
const total=()=>story?.cards.reduce((n,c)=>n+(c.narration?.duration||0),0)||0;
const offset=()=>story?.cards.slice(0,index()).reduce((n,c)=>n+(c.narration?.duration||0),0)||0;
const active=()=>['loading','playing','paused','between'].includes(mode);
function persist(){try{localStorage.setItem(KEY,JSON.stringify({rate}))}catch{}}
function progress(){
 if(!el('narration-position'))return;
 const duration=total(),current=mode==='finished'?duration:offset()+(audio?.currentTime||0);
 el('narration-position').value=String(duration?Math.round(current/duration*1000):0);
 el('narration-position').setAttribute('aria-valuetext',`${time(current)} of ${time(duration)}, card ${index()+1} of 12`);
 el('narration-time').textContent=`${time(current)} / ${time(duration)}`;
}
function sync(){
 if(!el('listen-story'))return;
 el('listen-story').disabled=!card?.narration;
 el('listen-story').textContent=mode==='paused'?'▶ Resume':['playing','loading','between'].includes(mode)?'Ⅱ Pause':'▶ Play story';
 el('listen-current').disabled=!card?.narration;
 el('listen-current').textContent=active()?'■ Stop':'Play from here';
 el('listen-current').setAttribute('aria-label',active()?'Stop story narration':'Play narration from the current card');
 el('story-player-progress').hidden=!active()&&mode!=='finished';
 el('narration-status').textContent=statusMessage||(['playing','loading','between'].includes(mode)?`Card ${index()+1} / 12${mode==='loading'?' · Loading…':''}`:mode==='paused'?`Paused · Card ${index()+1} / 12`:'All 12 cards · English');
 const downloading=downloads.has(story?.id)||librarySaving,allSaved=savedCount===12;
 el('save-narration').disabled=!card?.narration||!supportsCache||downloading||allSaved||storageBlocked();
 el('save-narration').textContent=librarySaving?'Library download running…':downloading?'Saving…':allSaved?'✓ Audio saved':'↓ Save audio offline';
 el('audio-offline-status').textContent=readStorageState().disabled?'Offline saving is off. Enable it on the home screen.':supportsCache?`${savedCount}/12 recordings saved`:'Offline saving needs HTTPS or localhost.';
 progress();
}
async function refreshSaved(){
 const target=story;if(!target||!supportsCache){savedCount=0;sync();return}
 try{if(storageBlocked()||!(await caches.keys()).includes(AUDIO_CACHE)){savedCount=0;sync();return}const cache=await caches.open(AUDIO_CACHE),results=await Promise.all(target.cards.map(c=>c.narration?cache.match(new URL('./'+c.narration.asset,location.href).href):null));if(story===target&&!storageBlocked()){savedCount=results.filter(Boolean).length;results.forEach((saved,i)=>{if(saved)librarySaved.add(new URL('./'+target.cards[i].narration.asset,location.href).href)});sync();syncLibrary()}}catch{if(story===target){savedCount=0;sync()}}
}
function cancelTurn(){clearTimeout(turnTimer);turnTimer=null;pendingTurn=false}
function resetAudio(reuse=false){
 generation++;cancelTurn();seekTo=null;removeListeners?.();removeListeners=null;prepared=false;
 if(audio){audio.pause();if(!reuse){audio.removeAttribute('src');audio.load();audio=null}}
 mode='idle';statusMessage='';
}
function stop(){resetAudio();sync()}
function goTo(i){transition=true;let moved=false;try{moved=navigate?.(i)===true}finally{transition=false}return moved}
function turnPage(){
 clearTimeout(turnTimer);turnTimer=null;if(!pendingTurn)return;
 if(document.hidden){mode='paused';sync();return}
 const next=index()+1;pendingTurn=false;if(goTo(next))listen();
}
function failed(error){
 cancelTurn();mode='idle';statusMessage=error?.name==='NotAllowedError'?'Tap Play from here to continue.':navigator.onLine?'Audio unavailable. Try Play from here again.':'Audio not saved. Open ⋯ to save this story when online.';sync();
}
function prepareAudio(){
 if(prepared||!card?.narration)return;
 if(!audio)audio=new Audio();prepared=true;audio.preload='metadata';const source=new URL('./'+card.narration.asset,location.href);if(readStorageState().disabled)source.searchParams.set('offline','off');audio.src=source.href;audio.playbackRate=rate;
 const token=generation,player=audio,listeners=[],valid=()=>token===generation;
 const on=(event,handler)=>{player.addEventListener(event,handler);listeners.push([event,handler])};
 removeListeners=()=>listeners.forEach(([event,handler])=>player.removeEventListener(event,handler));
 const applySeek=()=>{if(seekTo!==null&&Number.isFinite(player.duration)&&player.readyState>=3&&player.seekable.length){const position=seekTo;seekTo=null;player.currentTime=Math.min(position,Math.max(0,player.duration-.01))}};
 on('playing',()=>{if(valid()){applySeek();if(mode==='paused'){player.pause();return}mode='playing';statusMessage='';sync();refreshSaved()}});
 on('timeupdate',()=>{if(valid())progress()});
 on('loadedmetadata',()=>{if(valid())progress()});
 on('canplay',()=>{if(valid()){applySeek();progress()}});
 on('ended',()=>{if(valid()&&mode==='playing'){
  if(index()<story.cards.length-1){pendingTurn=true;mode='between';sync();turnTimer=setTimeout(turnPage,800)}
  else{mode='finished';statusMessage='Story finished';sync()}
  refreshSaved();
 }});
 on('waiting',()=>{if(valid()&&mode==='playing'){statusMessage=`Card ${index()+1} / 12 · Buffering…`;sync()}});
 on('error',()=>{if(valid())failed()});
}
async function listen(){
 if(!card?.narration)return;
 if(pendingTurn){turnPage();return}
 if(audio?.error)audio.load();prepareAudio();const token=generation;mode='loading';statusMessage='';sync();
 try{await audio.play();if(token===generation){if(mode==='paused')audio.pause();else if(mode==='loading')mode='playing';sync()}}
 catch(error){if(token===generation&&mode!=='paused')failed(error)}
}
function startAt(i){stop();if(goTo(i))listen()}
function pause(){if(!audio||!['playing','loading','between'].includes(mode))return;clearTimeout(turnTimer);turnTimer=null;audio.pause();mode='paused';statusMessage='';sync()}
function seek(value){
 if(!story)return;
 const wasPlaying=['playing','loading','between'].includes(mode);let remaining=Math.min(Number(value)/1000*total(),total()-.02),target=0;
 while(target<story.cards.length-1&&remaining>=story.cards[target].narration.duration){remaining-=story.cards[target].narration.duration;target++}
 cancelTurn();
 if(target!==index()){if(!goTo(target))return;seekTo=remaining;prepareAudio()}
 else{if(!audio)prepareAudio();if(Number.isFinite(audio.duration))audio.currentTime=remaining;else seekTo=remaining}
 mode='paused';statusMessage='';sync();if(wasPlaying)listen();
}
async function saveStoryAudio(){
 if(!supportsCache||!story||downloads.has(story.id)||librarySaving||storageBlocked())return;
 const target=story,epoch=readStorageState().epoch,controller=new AbortController();storyControllers.add(controller);downloads.add(target.id);sync();let count=0;
 try{
  const cache=await caches.open(AUDIO_CACHE);
  for(let i=0;i<target.cards.length;i+=3){if(!maySave(epoch)||controller.signal.aborted)break;await Promise.allSettled(target.cards.slice(i,i+3).map(async c=>{
   if(!c.narration)throw Error('Recording unavailable');const url=new URL('./'+c.narration.asset,location.href).href;
   if(!await cache.match(url)){const response=await fetch(url,{signal:controller.signal});if(!response.ok||response.status===206)throw Error('Download failed');if(!maySave(epoch)||controller.signal.aborted)return;await cache.put(url,response)}
   count++;if(story===target){savedCount=count;sync()}
  })).then(results=>{if(results.some(r=>r.status==='rejected'))throw Error('Download failed')})}
 }catch{if(story===target&&maySave(epoch)&&!controller.signal.aborted){statusMessage='Some audio could not be saved. Reconnect and retry.';sync()}}
 finally{storyControllers.delete(controller);downloads.delete(target.id);if(story===target){sync();await refreshSaved()}if(!librarySaving)await refreshLibrarySaved()}
}
function syncLibrary(){
 const button=el('download-all-narration');if(!button)return;
 const count=librarySaved.size,all=count===libraryAssets.length,mb=(window.LITERATURE.narrationLibrary?.bytes/1000000).toFixed(1);
 el('narration-library-size').textContent=`All ${window.LITERATURE.stories.length} stories · ${libraryAssets.length} recordings${Number.isFinite(Number(mb))?' · '+mb+' MB':''}`;
 button.disabled=!supportsCache||storageBlocked()||(!librarySaving&&all);
 button.textContent=readStorageState().disabled?'Offline downloads are off':librarySaving?'Cancel download':all?'✓ All narration saved':count?'↓ Resume narration download':'↓ Download all narration';
 el('narration-library-progress').hidden=count===0&&!librarySaving&&!libraryMessage;
 el('narration-download-meter').max=libraryAssets.length;el('narration-download-meter').value=count;
 el('narration-download-status').textContent=all?'All stories are ready for offline listening.':libraryMessage?`${count}/${libraryAssets.length} saved · ${libraryMessage}`:librarySaving?`Saving ${count}/${libraryAssets.length} recordings…`:count?`${count}/${libraryAssets.length} recordings saved. Continue whenever you like.`:'';
 syncStorage();
}
async function refreshLibrarySaved(){
 if(!supportsCache){libraryMessage='Offline saving needs HTTPS or localhost.';syncLibrary();return}
 try{if(storageBlocked()||!(await caches.keys()).includes(AUDIO_CACHE)){librarySaved.clear();syncLibrary();return}const cache=await caches.open(AUDIO_CACHE),keys=await cache.keys();if(!storageBlocked())librarySaved=new Set(keys.map(r=>r.url).filter(url=>libraryURLs.has(url)));syncLibrary()}catch{libraryMessage='Could not check saved audio. Try again.';syncLibrary()}
}
async function saveLibraryAudio(){
 if(librarySaving){libraryCancelled=true;libraryController?.abort();return}
 if(!supportsCache||storageBlocked())return;
 const epoch=readStorageState().epoch;
 librarySaving=true;libraryCancelled=false;libraryMessage='';libraryController=new AbortController();const controller=libraryController;let failed=false;
 syncLibrary();sync();
 try{
  await refreshLibrarySaved();const cache=await caches.open(AUDIO_CACHE);let cursor=0;
  await Promise.all(Array.from({length:3},async()=>{
   while(cursor<libraryAssets.length&&!controller.signal.aborted&&maySave(epoch)){
    const url=libraryAssets[cursor++];if(librarySaved.has(url))continue;
    try{
     if(!await cache.match(url)){const response=await fetch(url,{signal:controller.signal});if(!response.ok||response.status!==200)throw Error('Download failed');if(!maySave(epoch)||controller.signal.aborted)return;await cache.put(url,response)}
     librarySaved.add(url);syncLibrary();
    }catch{if(!controller.signal.aborted){failed=true;controller.abort()}return}
   }
  }));
 }catch{failed=true}
 finally{
  librarySaving=false;libraryController=null;await refreshLibrarySaved();
  libraryMessage=!maySave(epoch)||librarySaved.size===libraryAssets.length?'':libraryCancelled?'Download cancelled. Resume anytime.':failed?'Download paused. Reconnect and resume.':'';
  syncLibrary();sync();await refreshSaved();
 }
}
function syncStorage(){
 if(!el('clear-narration'))return;
 const state=readStorageState(),busy=storageBusy||state.clearing;
 el('clear-narration').disabled=!supportsCache||busy;
 el('clear-app-cache').disabled=!supportsCache||busy;
 el('enable-offline').hidden=!state.disabled;el('enable-offline').disabled=busy||!navigator.onLine;
 el('storage-status').textContent=storageMessage||(state.disabled?'Offline files cleared. Connect to the internet to use the app; enable offline access when you need it again.':'');
}
function abortDownloads(){stop();libraryCancelled=true;libraryController?.abort();storyControllers.forEach(c=>c.abort())}
function requestStorageClear(kind){
 if(!supportsCache||storageBusy)return;clearKind=kind;
 el('clear-storage-title').textContent=kind==='audio'?'Clear downloaded narration?':'Clear app cache?';
 el('clear-storage-description').textContent=kind==='audio'?'Remove all saved narration recordings to free space. Downloads and playback will stop. The reading library stays available offline; saved stories and progress stay. You can download narration again anytime.':'Remove this app’s offline stories, images, fonts and narration. Offline saving will stay off until you enable it again. You will need internet after closing the app. Your saved stories and reading progress stay. This does not uninstall the app.';
 el('confirm-clear-storage').textContent=kind==='audio'?'Clear narration':'Clear app cache';el('clear-storage-dialog').showModal();
}
async function clearStorage(){
 if(storageBusy)return;const kind=clearKind;el('clear-storage-dialog').close();storageBusy=true;storageMessage='Clearing offline files…';
 try{
  const previous=readStorageState();setStorageState({epoch:(previous.epoch||0)+1,disabled:kind==='all'||previous.disabled,clearing:true,startedAt:Date.now()});abortDownloads();sync();syncLibrary();
  await Promise.allSettled([...downloadTasks]);
  const scope=new URL('./',location.href).href,registrations='serviceWorker'in navigator?(await navigator.serviceWorker.getRegistrations()).filter(r=>r.scope===scope):[];
  for(const registration of registrations){const worker=registration.active;if(worker)await new Promise((resolve,reject)=>{
   const channel=new MessageChannel(),timeout=setTimeout(()=>{channel.port1.close();reject(Error('Close other app tabs and retry.'))},10000);
   channel.port1.onmessage=e=>{clearTimeout(timeout);channel.port1.close();e.data?.ok?resolve():reject(Error('Could not clear offline files. Try again.'))};
   worker.postMessage({type:'CLEAR_OFFLINE_STORAGE',kind},[channel.port2]);
  });if(kind==='all')registration.unregister().catch(()=>{})}
  const names=await caches.keys();await Promise.all(names.filter(name=>kind==='audio'?name===AUDIO_CACHE:name.startsWith('bangla-literature-')).map(name=>caches.delete(name)));
  librarySaved.clear();savedCount=0;libraryMessage='';storageMessage=kind==='audio'?'Downloaded narration cleared. You can download it again anytime.':'App cache cleared. Saved stories and reading progress kept. Offline access is now off.';
 }catch(error){storageMessage=`${error.message||'Could not clear all files.'} Your reading progress is kept.`}
 finally{storageBusy=false;const state=readStorageState();try{setStorageState({...state,clearing:false})}catch{}sync();syncLibrary();await refreshLibrarySaved();await refreshSaved()}
}
async function restoreOffline(){
 if(storageBusy||!navigator.onLine)return;storageBusy=true;storageMessage='Preparing offline library…';syncStorage();
 try{
  const scope=new URL('./',location.href).href;
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Reconnect and try again.')),15000);navigator.serviceWorker.getRegistrations().then(list=>Promise.all(list.filter(r=>r.scope===scope).map(r=>r.unregister()))).then(()=>{clearTimeout(timer);resolve()},error=>{clearTimeout(timer);reject(error)})});
  const state=readStorageState();setStorageState({...state,disabled:false,clearing:false});await window.enableLiteratureOffline();storageMessage='Offline reading is ready. Download narration whenever you like.';
 }
 catch{setStorageState({...readStorageState(),disabled:true});storageMessage='Could not restore offline access. Reconnect and try again.'}
 finally{storageBusy=false;sync();syncLibrary()}
}
window.OfflineStorage={disabled:()=>readStorageState().disabled||readStorageState().clearing};
window.addEventListener('storage',e=>{if(e.key!==STORAGE_KEY)return;const previous=storageState;storageState=readStorageState();if(storageState.epoch!==previous.epoch||storageState.disabled||storageState.clearing){abortDownloads();librarySaved.clear();savedCount=0;libraryMessage='';storageMessage=storageState.disabled?'App cache cleared in another window. Offline access is off.':'Downloaded narration cleared in another window.'}sync();syncLibrary();window.dispatchEvent(new Event('offline-storage-change'))});
window.addEventListener('online',syncStorage);window.addEventListener('offline',syncStorage);
function markup(){return `<div class="story-player-main"><div class="story-player-caption"><strong>English narration</strong><span id="narration-status" role="status" aria-live="polite">All 12 cards · English</span></div><div class="story-player-actions"><button id="listen-story" type="button" class="primary">▶ Play story</button><button id="listen-current" type="button" aria-label="Play narration from the current card">Play from here</button><details id="narration-options"><summary aria-label="Narration options">⋯</summary><div class="story-player-options"><label for="narration-rate">Playback pace</label><select id="narration-rate"><option value="0.9">Slower</option><option value="1">Gentle original</option><option value="1.1">A little faster</option></select><p>Cards turn as the story plays. Pause anytime.</p><button id="save-narration" type="button">↓ Save audio offline</button><span id="audio-offline-status"></span></div></details></div></div><div id="story-player-progress" hidden><label class="sr-only" for="narration-position">Seek within the whole story narration</label><input id="narration-position" type="range" min="0" max="1000" step="1" value="0"><span id="narration-time">0:00</span></div>`}
function mount(c,s,jump){
 const host=el('story-player');if(!host)return;
 if(!host.firstElementChild)host.innerHTML=markup();
 const same=story?.id===s?.id;resetAudio(transition&&same&&!!c);
 if(!same){savedCount=0;el('narration-options').open=false}
 card=c;story=c?s:null;navigate=jump;host.hidden=!c;if(!c)return;
 el('narration-rate').value=String(rate);sync();refreshSaved();
}
document.addEventListener('click',e=>{const id=e.target.closest('button')?.id;
 if(id==='listen-story'){if(['playing','loading','between'].includes(mode))pause();else if(mode==='paused')listen();else startAt(0)}
 else if(id==='listen-current'){if(active())stop();else startAt(index())}
 else if(id==='save-narration')runDownload(saveStoryAudio);
 else if(id==='download-all-narration')runDownload(saveLibraryAudio);
 else if(id==='clear-narration')requestStorageClear('audio');
 else if(id==='clear-app-cache')requestStorageClear('all');
 else if(id==='cancel-clear-storage')el('clear-storage-dialog').close();
 else if(id==='confirm-clear-storage')clearStorage();
 else if(id==='enable-offline')restoreOffline();
});
document.addEventListener('change',e=>{if(e.target.id==='narration-rate'){rate=Number(e.target.value);if(audio)audio.playbackRate=rate;persist()}});
document.addEventListener('input',e=>{if(e.target.id==='narration-position')seek(e.target.value)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el('narration-options')?.open){el('narration-options').open=false;e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('click',e=>{const options=el('narration-options');if(options?.open&&!options.contains(e.target))options.open=false});
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',()=>{if(!librarySaving)refreshLibrarySaved()});
window.addEventListener('appinstalled',()=>{if(!librarySaving)refreshLibrarySaved()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!librarySaving)refreshLibrarySaved()});
refreshLibrarySaved();
if(storageState.clearing)setTimeout(()=>{sync();syncLibrary()},Math.max(0,30001-(Date.now()-(storageState.startedAt||0))));
window.CardNarration={mount,stop};
})();
