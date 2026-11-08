'use strict';
const CACHE="bangla-literature-c25fbd9b7bdc";
const BASE=self.registration.scope;
const SHELL=["./", "./index.html", "./styles.css", "./app.js", "./content.js", "./manifest.webmanifest", "./assets/icon.svg", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-maskable.png", "./assets/bangla.ttf", "./assets/OFL.txt", "./content/research-log.md", "./assets/illustrations/srikrishnakirtan.jpg", "./assets/illustrations/manasamangal.jpg", "./assets/illustrations/chandimangal.jpg", "./assets/illustrations/padmavati.jpg", "./assets/illustrations/mahua.jpg", "./assets/illustrations/meghnadbadh.jpg", "./assets/illustrations/nil-darpan.jpg", "./assets/illustrations/nakshi-kanthar-math.jpg", "./assets/illustrations/bishad-sindhu.jpg", "./assets/illustrations/postmaster.jpg", "./assets/illustrations/kabuliwallah.jpg", "./assets/illustrations/chhuti.jpg", "./assets/illustrations/shasti.jpg", "./assets/illustrations/dena-paona.jpg", "./assets/illustrations/samapti.jpg", "./assets/illustrations/streer-patra.jpg", "./assets/illustrations/jibita-o-mrita.jpg", "./assets/illustrations/gora.jpg", "./assets/illustrations/ghare-baire.jpg", "./assets/illustrations/chokher-bali.jpg", "./assets/illustrations/shesher-kobita.jpg", "./assets/illustrations/dakghar.jpg", "./assets/illustrations/raktakarabi.jpg", "./assets/illustrations/kapalkundala.jpg", "./assets/illustrations/mahesh.jpg", "./assets/illustrations/devdas.jpg", "./assets/illustrations/pather-panchali.jpg", "./assets/illustrations/chander-pahar.jpg", "./assets/illustrations/padma-nadir-majhi.jpg", "./assets/illustrations/putul-nacher-itikatha.jpg", "./assets/illustrations/lalsalu.jpg", "./assets/illustrations/surja-dighal-bari.jpg", "./assets/illustrations/arek-falgun.jpg", "./assets/illustrations/hajar-bachhar-dhare.jpg", "./assets/illustrations/aguner-poroshmoni.jpg", "./assets/illustrations/hangor-nodi-grenade.jpg", "./assets/illustrations/rifle-roti-aurat.jpg", "./assets/illustrations/sultanas-dream.jpg", "./assets/illustrations/charyapada.jpg", "./assets/illustrations/bidrohi.jpg", "./assets/illustrations/banalata-sen.jpg", "./assets/illustrations/panjeri.jpg", "./assets/illustrations/atharo-bachhor.jpg", "./assets/illustrations/swadhinata-tumi.jpg", "./content/illustration-prompts.json", "./assets/authors/bankim.jpg", "./assets/authors/bibhuti.jpg", "./assets/authors/dinabandhu.jpg", "./assets/authors/humayun.jpg", "./assets/authors/jasim.jpg", "./assets/authors/jibanananda.jpg", "./assets/authors/manik.jpg", "./assets/authors/manuscript.svg", "./assets/authors/michael.jpg", "./assets/authors/mir.jpg", "./assets/authors/nazrul.jpg", "./assets/authors/rokeya.jpg", "./assets/authors/sarat.jpg", "./assets/authors/selina.jpg", "./assets/authors/shamsur.jpg", "./assets/authors/sukanta.jpg", "./assets/authors/tagore.jpg", "./assets/authors/wali.jpg", "./assets/authors/zahir.jpg"].map(p=>new URL(p,BASE).href);
let offlineDisabled=false;
self.addEventListener('message',event=>{
 if(event.data?.type==='GET_APP_RELEASE'&&event.ports[0]){event.ports[0].postMessage({cacheVersion:CACHE});return;}
 if(event.data?.type==='RESTORE_OFFLINE_STORAGE'&&event.ports[0]){
  event.waitUntil((async()=>{const port=event.ports[0];try{offlineDisabled=false;await(await caches.open(CACHE)).addAll(SHELL);await self.clients.claim();port.postMessage({ok:true})}catch{offlineDisabled=true;port.postMessage({ok:false})}})());return;
 }
 if(event.data?.type!=='CLEAR_OFFLINE_STORAGE'||event.data.kind!=='all'||!event.ports[0])return;
 event.waitUntil((async()=>{
  const port=event.ports[0];offlineDisabled=true;
  try{const names=await caches.keys();await Promise.all(names.filter(name=>name.startsWith('bangla-literature-')).map(name=>caches.delete(name)));port.postMessage({ok:true})}
  catch{port.postMessage({ok:false})}finally{port.close()}
 })());
});
// Older workers ignore query strings; an equivalent encoded path avoids their stale entries.
function freshURL(asset){const url=new URL(asset.endsWith('/')?'./index.html':asset,BASE);url.searchParams.set('v',CACHE);url.searchParams.set('offline','off');const slash=url.pathname.lastIndexOf('/')+1;url.pathname=url.pathname.slice(0,slash)+'%'+url.pathname.charCodeAt(slash).toString(16)+url.pathname.slice(slash+1);return url.href}
async function downloadShell(){
 const cache=await caches.open(CACHE);let cursor=0;
 await Promise.all(Array.from({length:4},async()=>{while(cursor<SHELL.length){const asset=SHELL[cursor++];let saved=false;for(let attempt=0;attempt<3&&!saved;attempt++){try{const response=await fetch(freshURL(asset),{cache:'reload'});if(!response.ok)throw Error('Offline download failed');await cache.put(asset,response);saved=true}catch(error){if(attempt===2)throw error;await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)))}}}}));
}
self.addEventListener('install',event=>event.waitUntil(downloadShell().then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const names=await caches.keys();
 // Retire the old shell and recordings without touching local reading progress.
 const retired=names.filter(name=>name.startsWith('bangla-literature-')&&name!==CACHE);
 await Promise.all(retired.map(name=>caches.delete(name)));
 await self.clients.claim();
 if(retired.length){
  const windows=await self.clients.matchAll({type:'window'});
  windows.filter(client=>client.url.startsWith(BASE)).forEach(client=>client.navigate(new URL(client.url).href).catch(()=>{}));
 }
})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==new URL(BASE).origin||!url.href.startsWith(BASE))return;
 if(offlineDisabled||url.searchParams.get('offline')==='off')return;
 const requestedVersion=url.searchParams.get('v');url.search='';
 if(req.mode==='navigate'){
  event.respondWith((async()=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);try{const fresh=await fetch(freshURL('./index.html'),{signal:controller.signal,cache:'reload'});if(fresh.ok)return fresh;const saved=await caches.match(new URL('./index.html',BASE).href,{cacheName:CACHE});return saved||fresh}catch(error){const saved=await caches.match(new URL('./index.html',BASE).href,{cacheName:CACHE});if(saved)return saved;throw error}finally{clearTimeout(timer)}})());return;
 }
 if(requestedVersion&&requestedVersion!==CACHE){event.respondWith(fetch(req));return;}
 event.respondWith(caches.match(req,{cacheName:CACHE,ignoreSearch:true}).then(saved=>saved||fetch(req)));
});
