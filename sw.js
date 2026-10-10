'use strict';
const CACHE="bangla-literature-8e3ea1576357";
const BASE=self.registration.scope;
const SHELL=["./", "./index.html", "./styles.css", "./app.js", "./content.js", "./manifest.webmanifest", "./assets/icon.svg", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-maskable.png", "./assets/bangla.ttf", "./assets/OFL.txt", "./content/research-log.md", "./assets/illustrations/srikrishnakirtan.jpg", "./assets/illustrations/manasamangal.jpg", "./assets/illustrations/chandimangal.jpg", "./assets/illustrations/padmavati.jpg", "./assets/illustrations/mahua.jpg", "./assets/illustrations/meghnadbadh.jpg", "./assets/illustrations/nil-darpan.jpg", "./assets/illustrations/nakshi-kanthar-math.jpg", "./assets/illustrations/bishad-sindhu.jpg", "./assets/illustrations/postmaster.jpg", "./assets/illustrations/kabuliwallah.jpg", "./assets/illustrations/chhuti.jpg", "./assets/illustrations/shasti.jpg", "./assets/illustrations/dena-paona.jpg", "./assets/illustrations/samapti.jpg", "./assets/illustrations/streer-patra.jpg", "./assets/illustrations/jibita-o-mrita.jpg", "./assets/illustrations/gora.jpg", "./assets/illustrations/ghare-baire.jpg", "./assets/illustrations/chokher-bali.jpg", "./assets/illustrations/shesher-kobita.jpg", "./assets/illustrations/dakghar.jpg", "./assets/illustrations/raktakarabi.jpg", "./assets/illustrations/kapalkundala.jpg", "./assets/illustrations/mahesh.jpg", "./assets/illustrations/devdas.jpg", "./assets/illustrations/pather-panchali.jpg", "./assets/illustrations/chander-pahar.jpg", "./assets/illustrations/padma-nadir-majhi.jpg", "./assets/illustrations/putul-nacher-itikatha.jpg", "./assets/illustrations/lalsalu.jpg", "./assets/illustrations/surja-dighal-bari.jpg", "./assets/illustrations/arek-falgun.jpg", "./assets/illustrations/hajar-bachhar-dhare.jpg", "./assets/illustrations/aguner-poroshmoni.jpg", "./assets/illustrations/hangor-nodi-grenade.jpg", "./assets/illustrations/rifle-roti-aurat.jpg", "./assets/illustrations/sultanas-dream.jpg", "./assets/illustrations/charyapada.jpg", "./assets/illustrations/bidrohi.jpg", "./assets/illustrations/banalata-sen.jpg", "./assets/illustrations/panjeri.jpg", "./assets/illustrations/atharo-bachhor.jpg", "./assets/illustrations/swadhinata-tumi.jpg", "./content/illustration-prompts.json"].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(n=>n.startsWith('bangla-literature-')&&n!==CACHE).map(n=>caches.delete(n)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==new URL(BASE).origin||!url.href.startsWith(BASE))return;
  if(req.mode==='navigate'){
    event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(new URL('./index.html',BASE).href))||fetch(req)));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(req,{ignoreSearch:true}))||fetch(req)));
});
