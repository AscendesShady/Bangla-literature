'use strict';
// Short utterances avoid long-text cutoffs in mobile speech engines.
(() => {
const synth=window.speechSynthesis,supported=!!synth&&typeof window.SpeechSynthesisUtterance==='function';
const KEY='bangla-literature-voice';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let settings={voice:'',rate:.85};
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved){settings.voice=typeof saved.voice==='string'?saved.voice:'';if([.75,.85,1].includes(saved.rate))settings.rate=saved.rate}}catch{}
let voices=[],card=null,chunks=[],position=0,mode='idle',generation=0,utterance=null,startTimer=null;
const el=id=>document.getElementById(id);
function persist(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch{}}
function selectedVoice(){return voices.find(v=>v.voiceURI===settings.voice)||voices.find(v=>v.localService&&/samantha|serena|zira|hazel|karen|aria/i.test(v.name))||voices.find(v=>v.localService)||voices.find(v=>v.default)||voices[0]}
function sync(message){
 if(!el('listen-card'))return;
 const unavailable=!supported||(synth.getVoices().length>0&&!voices.length);
 el('listen-card').disabled=unavailable;el('listen-card').textContent=mode==='paused'?'▶ Resume English':mode==='speaking'?'↺ Restart English':'▶ Listen in English';
 el('pause-card').hidden=mode!=='speaking';el('stop-card').hidden=mode==='idle';
 const v=selectedVoice();
 el('narration-status').textContent=message||(unavailable?'English narration is unavailable on this device.':mode==='speaking'?'Reading this card in English…':mode==='paused'?'Paused. Resume continues from this sentence.':v&&!v.localService?'Gentle English voice · this voice may need internet.':'Gentle English voice · device voices can work offline.');
}
function refreshVoices(){
 if(!supported)return;
 voices=synth.getVoices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang)).sort((a,b)=>Number(b.localService)-Number(a.localService)||a.name.localeCompare(b.name));
 const select=el('narration-voice');if(select){select.innerHTML=voices.length?voices.map(v=>`<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)}) · ${v.localService?'device':'online'}</option>`).join(''):'<option value="">Default English voice</option>';select.value=selectedVoice()?.voiceURI||'';select.disabled=!voices.length;}
 sync();
}
function stop(){generation++;clearTimeout(startTimer);if(supported){synth.cancel();synth.resume()}utterance=null;mode='idle';position=0;sync()}
function speakChunk(token){
 if(token!==generation||mode!=='speaking')return;
 if(position>=chunks.length){utterance=null;mode='idle';position=0;sync('Card finished. Listen again whenever you like.');return}
 const v=selectedVoice();if(!navigator.onLine&&v&&!v.localService){stop();sync('This voice needs internet. Choose a device voice for offline listening.');return}
 utterance=new SpeechSynthesisUtterance(chunks[position]);utterance.lang=v?.lang||'en-US';if(v)utterance.voice=v;utterance.rate=settings.rate;utterance.pitch=1;utterance.volume=.85;
 utterance.onstart=()=>{if(token===generation)clearTimeout(startTimer)};
 utterance.onend=()=>{if(token!==generation)return;clearTimeout(startTimer);position++;speakChunk(token)};
 utterance.onerror=e=>{if(token!==generation)return;stop();sync(e.error==='not-allowed'?'Tap Listen again to enable audio.':'The voice could not play. Try another English voice on this device.')};
 clearTimeout(startTimer);startTimer=setTimeout(()=>{if(token===generation){stop();sync('The voice did not start. Try another English voice or tap Listen again.')}},12000);
 synth.speak(utterance);
}
function listen(){
 if(!supported||!card)return;
 if(mode!=='paused'){stop();chunks=(`${card.heading.en}. ${card.en}`).match(/[^.!?]+[.!?]+(?:[”"’']*)|[^.!?]+$/g)?.map(t=>t.trim()).filter(Boolean)||[card.en];position=0}
 mode='speaking';const token=++generation;synth.resume();sync();speakChunk(token);
}
function pause(){
 if(mode!=='speaking')return;
 // Cancel/resume at the current sentence works on engines without native pause.
 generation++;clearTimeout(startTimer);synth.cancel();utterance=null;mode='paused';sync();
}
function markup(){return `<section class="narration" aria-label="English card narration"><div class="narration-actions"><button id="listen-card" type="button">▶ Listen in English</button><button id="pause-card" type="button" hidden>Ⅱ Pause</button><button id="stop-card" type="button" hidden>■ Stop</button></div><details><summary>Voice &amp; pace</summary><div class="narration-settings"><label>English voice<select id="narration-voice"></select></label><label>Pace<select id="narration-rate"><option value="0.75">Unhurried</option><option value="0.85">Gentle</option><option value="1">Normal</option></select></label></div></details><p id="narration-status" class="note" role="status" aria-live="polite"></p></section>`}
function mount(c){stop();card=c;if(!c)return;el('narration-rate').value=String(settings.rate);refreshVoices();sync();if(!supported)el('narration-rate').disabled=true}
document.addEventListener('click',e=>{const id=e.target.closest('button')?.id;if(id==='listen-card')listen();else if(id==='pause-card')pause();else if(id==='stop-card')stop()});
document.addEventListener('change',e=>{if(e.target.id==='narration-voice'){stop();settings.voice=e.target.value;persist();sync()}else if(e.target.id==='narration-rate'){stop();settings.rate=Number(e.target.value);persist();sync()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
window.addEventListener('pagehide',stop);
if(supported){synth.addEventListener('voiceschanged',refreshVoices);refreshVoices()}
window.CardNarration={markup,mount,stop};
})();
