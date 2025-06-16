import{d as Y,r as b,l as K,s as X,k as W,c as k,a as h,b as Q,e as A,w as E,f as L,y as T,j as F,h as R,o as C,g as Z}from"./index-yMFJ6_hg.js";import{C as ee}from"./ChatBot-BWCZwB6P.js";const te=""+new URL("listen_start-D2unHACn.wav",import.meta.url).href,N=""+new URL("speak_start-CPU6wXwn.mp3",import.meta.url).href;function I(){return I=Object.assign?Object.assign.bind():function(l){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var t in n)({}).hasOwnProperty.call(n,t)&&(l[t]=n[t])}return l},I.apply(null,arguments)}const z=new Uint8Array(0);class M{static getFullOptions(e){return I({clientTools:{},onConnect:()=>{},onDebug:()=>{},onDisconnect:()=>{},onError:()=>{},onMessage:()=>{},onAudio:()=>{},onModeChange:()=>{},onStatusChange:()=>{},onCanSendFeedbackChange:()=>{}},e)}constructor(e,n){var t=this;this.options=void 0,this.connection=void 0,this.lastInterruptTimestamp=0,this.mode="listening",this.status="connecting",this.volume=1,this.currentEventId=1,this.lastFeedbackEventId=1,this.canSendFeedback=!1,this.endSessionWithDetails=async function(a){t.status!=="connected"&&t.status!=="connecting"||(t.updateStatus("disconnecting"),await t.handleEndSession(),t.updateStatus("disconnected"),t.options.onDisconnect(a))},this.onMessage=async function(a){switch(a.type){case"interruption":return void t.handleInterruption(a);case"agent_response":return void t.handleAgentResponse(a);case"user_transcript":return void t.handleUserTranscript(a);case"internal_tentative_agent_response":return void t.handleTentativeAgentResponse(a);case"client_tool_call":return void await t.handleClientToolCall(a);case"audio":return void t.handleAudio(a);case"ping":return void t.connection.sendMessage({type:"pong",event_id:a.ping_event.event_id});default:return void t.options.onDebug(a)}},this.setVolume=({volume:a})=>{this.volume=a},this.options=e,this.connection=n,this.options.onConnect({conversationId:n.conversationId}),this.connection.onMessage(this.onMessage),this.connection.onDisconnect(this.endSessionWithDetails),this.updateStatus("connected")}endSession(){return this.endSessionWithDetails({reason:"user"})}async handleEndSession(){this.connection.close()}updateMode(e){e!==this.mode&&(this.mode=e,this.options.onModeChange({mode:e}))}updateStatus(e){e!==this.status&&(this.status=e,this.options.onStatusChange({status:e}))}updateCanSendFeedback(){const e=this.currentEventId!==this.lastFeedbackEventId;this.canSendFeedback!==e&&(this.canSendFeedback=e,this.options.onCanSendFeedbackChange({canSendFeedback:e}))}handleInterruption(e){e.interruption_event&&(this.lastInterruptTimestamp=e.interruption_event.event_id)}handleAgentResponse(e){this.options.onMessage({source:"ai",message:e.agent_response_event.agent_response})}handleUserTranscript(e){this.options.onMessage({source:"user",message:e.user_transcription_event.user_transcript})}handleTentativeAgentResponse(e){this.options.onDebug({type:"tentative_agent_response",response:e.tentative_agent_response_internal_event.tentative_agent_response})}async handleClientToolCall(e){if(this.options.clientTools.hasOwnProperty(e.client_tool_call.tool_name))try{var n;const t=(n=await this.options.clientTools[e.client_tool_call.tool_name](e.client_tool_call.parameters))!=null?n:"Client tool execution successful.",a=typeof t=="object"?JSON.stringify(t):String(t);this.connection.sendMessage({type:"client_tool_result",tool_call_id:e.client_tool_call.tool_call_id,result:a,is_error:!1})}catch(t){this.onError("Client tool execution failed with following error: "+(t==null?void 0:t.message),{clientToolName:e.client_tool_call.tool_name}),this.connection.sendMessage({type:"client_tool_result",tool_call_id:e.client_tool_call.tool_call_id,result:"Client tool execution failed: "+(t==null?void 0:t.message),is_error:!0})}else{if(this.options.onUnhandledClientToolCall)return void this.options.onUnhandledClientToolCall(e.client_tool_call);this.onError(`Client tool with name ${e.client_tool_call.tool_name} is not defined on client`,{clientToolName:e.client_tool_call.tool_name}),this.connection.sendMessage({type:"client_tool_result",tool_call_id:e.client_tool_call.tool_call_id,result:`Client tool with name ${e.client_tool_call.tool_name} is not defined on client`,is_error:!0})}}handleAudio(e){}onError(e,n){console.error(e,n),this.options.onError(e,n)}getId(){return this.connection.conversationId}isOpen(){return this.status==="connected"}setMicMuted(e){}getInputByteFrequencyData(){return z}getOutputByteFrequencyData(){return z}getInputVolume(){return 0}getOutputVolume(){return 0}sendFeedback(e){this.canSendFeedback?(this.connection.sendMessage({type:"feedback",score:e?"like":"dislike",event_id:this.currentEventId}),this.lastFeedbackEventId=this.currentEventId,this.updateCanSendFeedback()):console.warn(this.lastFeedbackEventId===0?"Cannot send feedback: the conversation has not started yet.":"Cannot send feedback: feedback has already been sent for the current response.")}sendContextualUpdate(e){this.connection.sendMessage({type:"contextual_update",text:e})}sendUserMessage(e){this.connection.sendMessage({type:"user_message",text:e})}sendUserActivity(){this.connection.sendMessage({type:"user_activity"})}sendMCPToolApprovalResult(e,n){this.connection.sendMessage({type:"mcp_tool_approval_result",tool_call_id:e,is_approved:n})}}function j(l){return!!l.type}class D{static async create(e){let n=null;try{var t;const s=(t=e.origin)!=null?t:"wss://api.elevenlabs.io",o=e.signedUrl?e.signedUrl:s+"/v1/convai/conversation?agent_id="+e.agentId,r=["convai"];e.authorization&&r.push(`bearer.${e.authorization}`),n=new WebSocket(o,r);const u=await new Promise((_,m)=>{n.addEventListener("open",()=>{var p;const g={type:"conversation_initiation_client_data"};var S,c,i,x,V;e.overrides&&(g.conversation_config_override={agent:{prompt:(S=e.overrides.agent)==null?void 0:S.prompt,first_message:(c=e.overrides.agent)==null?void 0:c.firstMessage,language:(i=e.overrides.agent)==null?void 0:i.language},tts:{voice_id:(x=e.overrides.tts)==null?void 0:x.voiceId},conversation:{text_only:(V=e.overrides.conversation)==null?void 0:V.textOnly}}),e.customLlmExtraBody&&(g.custom_llm_extra_body=e.customLlmExtraBody),e.dynamicVariables&&(g.dynamic_variables=e.dynamicVariables),(p=n)==null||p.send(JSON.stringify(g))},{once:!0}),n.addEventListener("error",p=>{setTimeout(()=>m(p),0)}),n.addEventListener("close",m),n.addEventListener("message",p=>{const g=JSON.parse(p.data);j(g)&&(g.type==="conversation_initiation_metadata"?_(g.conversation_initiation_metadata_event):console.warn("First received message is not conversation metadata."))},{once:!0})}),{conversation_id:v,agent_output_audio_format:f,user_input_audio_format:d}=u,w=$(d??"pcm_16000"),y=$(f);return new D(n,v,w,y)}catch(s){var a;throw(a=n)==null||a.close(),s}}constructor(e,n,t,a){this.socket=void 0,this.conversationId=void 0,this.inputFormat=void 0,this.outputFormat=void 0,this.queue=[],this.disconnectionDetails=null,this.onDisconnectCallback=null,this.onMessageCallback=null,this.socket=e,this.conversationId=n,this.inputFormat=t,this.outputFormat=a,this.socket.addEventListener("error",s=>{setTimeout(()=>this.disconnect({reason:"error",message:"The connection was closed due to a socket error.",context:s}),0)}),this.socket.addEventListener("close",s=>{this.disconnect(s.code===1e3?{reason:"agent",context:s}:{reason:"error",message:s.reason||"The connection was closed by the server.",context:s})}),this.socket.addEventListener("message",s=>{try{const o=JSON.parse(s.data);if(!j(o))return;this.onMessageCallback?this.onMessageCallback(o):this.queue.push(o)}catch{}})}close(){this.socket.close()}sendMessage(e){this.socket.send(JSON.stringify(e))}onMessage(e){this.onMessageCallback=e;const n=this.queue;this.queue=[],n.length>0&&queueMicrotask(()=>{n.forEach(e)})}onDisconnect(e){this.onDisconnectCallback=e;const n=this.disconnectionDetails;n&&queueMicrotask(()=>{e(n)})}disconnect(e){var n;this.disconnectionDetails||(this.disconnectionDetails=e,(n=this.onDisconnectCallback)==null||n.call(this,e))}}function $(l){const[e,n]=l.split("_");if(!["pcm","ulaw"].includes(e))throw new Error(`Invalid format: ${l}`);const t=parseInt(n);if(isNaN(t))throw new Error(`Invalid sample rate: ${n}`);return{format:e,sampleRate:t}}function H(){return["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document}async function J(l={default:0,android:3e3}){let e=l.default;var n;if(/android/i.test(navigator.userAgent))e=(n=l.android)!=null?n:e;else if(H()){var t;e=(t=l.ios)!=null?t:e}e>0&&await new Promise(a=>setTimeout(a,e))}class B extends M{static async startSession(e){const n=M.getFullOptions(e);n.onStatusChange({status:"connecting"}),n.onCanSendFeedbackChange({canSendFeedback:!1});let t=null;try{return await J(n.connectionDelay),t=await D.create(e),new B(n,t)}catch(s){var a;throw n.onStatusChange({status:"disconnected"}),(a=t)==null||a.close(),s}}}function ne(l){const e=new Uint8Array(l);return window.btoa(String.fromCharCode(...e))}function ae(l){const e=window.atob(l),n=e.length,t=new Uint8Array(n);for(let a=0;a<n;a++)t[a]=e.charCodeAt(a);return t.buffer}const q=new Map;function G(l,e){return async n=>{const t=q.get(l);if(t)return n.addModule(t);const a=new Blob([e],{type:"application/javascript"}),s=URL.createObjectURL(a);try{return await n.addModule(s),void q.set(l,s)}catch{URL.revokeObjectURL(s)}try{const o=`data:application/javascript;base64,${btoa(e)}`;await n.addModule(o),q.set(l,o)}catch{throw new Error(`Failed to load the ${l} worklet module. Make sure the browser supports AudioWorklets.`)}}}const se=G("raw-audio-processor",`
const BIAS = 0x84;
const CLIP = 32635;
const encodeTable = [
  0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,
  4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
  5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
  5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7
];

function encodeSample(sample) {
  let sign;
  let exponent;
  let mantissa;
  let muLawSample;
  sign = (sample >> 8) & 0x80;
  if (sign !== 0) sample = -sample;
  sample = sample + BIAS;
  if (sample > CLIP) sample = CLIP;
  exponent = encodeTable[(sample>>7) & 0xFF];
  mantissa = (sample >> (exponent+3)) & 0x0F;
  muLawSample = ~(sign | (exponent << 4) | mantissa);
  
  return muLawSample;
}

class RawAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
              
    this.port.onmessage = ({ data }) => {
      switch (data.type) {
        case "setFormat":
          this.isMuted = false;
          this.buffer = []; // Initialize an empty buffer
          this.bufferSize = data.sampleRate / 4;
          this.format = data.format;

          if (globalThis.LibSampleRate && sampleRate !== data.sampleRate) {
            globalThis.LibSampleRate.create(1, sampleRate, data.sampleRate).then(resampler => {
              this.resampler = resampler;
            });
          }
          break;
        case "setMuted":
          this.isMuted = data.isMuted;
          break;
      }
    };
  }
  process(inputs) {
    if (!this.buffer) {
      return true;
    }
    
    const input = inputs[0]; // Get the first input node
    if (input.length > 0) {
      let channelData = input[0]; // Get the first channel's data

      // Resample the audio if necessary
      if (this.resampler) {
        channelData = this.resampler.full(channelData);
      }

      // Add channel data to the buffer
      this.buffer.push(...channelData);
      // Get max volume 
      let sum = 0.0;
      for (let i = 0; i < channelData.length; i++) {
        sum += channelData[i] * channelData[i];
      }
      const maxVolume = Math.sqrt(sum / channelData.length);
      // Check if buffer size has reached or exceeded the threshold
      if (this.buffer.length >= this.bufferSize) {
        const float32Array = this.isMuted 
          ? new Float32Array(this.buffer.length)
          : new Float32Array(this.buffer);

        let encodedArray = this.format === "ulaw"
          ? new Uint8Array(float32Array.length)
          : new Int16Array(float32Array.length);

        // Iterate through the Float32Array and convert each sample to PCM16
        for (let i = 0; i < float32Array.length; i++) {
          // Clamp the value to the range [-1, 1]
          let sample = Math.max(-1, Math.min(1, float32Array[i]));

          // Scale the sample to the range [-32768, 32767]
          let value = sample < 0 ? sample * 32768 : sample * 32767;
          if (this.format === "ulaw") {
            value = encodeSample(Math.round(value));
          }

          encodedArray[i] = value;
        }

        // Send the buffered data to the main script
        this.port.postMessage([encodedArray, maxVolume]);

        // Clear the buffer after sending
        this.buffer = [];
      }
    }
    return true; // Continue processing
  }
}
registerProcessor("raw-audio-processor", RawAudioProcessor);
`);class U{static async create({sampleRate:e,format:n,preferHeadphonesForIosDevices:t}){let a=null,s=null;try{const u={sampleRate:{ideal:e},echoCancellation:{ideal:!0},noiseSuppression:{ideal:!0}};if(H()&&t){const y=(await window.navigator.mediaDevices.enumerateDevices()).find(_=>_.kind==="audioinput"&&["airpod","headphone","earphone"].find(m=>_.label.toLowerCase().includes(m)));y&&(u.deviceId={ideal:y.deviceId})}const v=navigator.mediaDevices.getSupportedConstraints().sampleRate;a=new window.AudioContext(v?{sampleRate:e}:{});const f=a.createAnalyser();v||await a.audioWorklet.addModule("https://cdn.jsdelivr.net/npm/@alexanderolsen/libsamplerate-js@2.1.2/dist/libsamplerate.worklet.js"),await se(a.audioWorklet),s=await navigator.mediaDevices.getUserMedia({audio:u});const d=a.createMediaStreamSource(s),w=new AudioWorkletNode(a,"raw-audio-processor");return w.port.postMessage({type:"setFormat",format:n,sampleRate:e}),d.connect(f),f.connect(w),await a.resume(),new U(a,f,w,s)}catch(u){var o,r;throw(o=s)==null||o.getTracks().forEach(v=>v.stop()),(r=a)==null||r.close(),u}}constructor(e,n,t,a){this.context=void 0,this.analyser=void 0,this.worklet=void 0,this.inputStream=void 0,this.context=e,this.analyser=n,this.worklet=t,this.inputStream=a}async close(){this.inputStream.getTracks().forEach(e=>e.stop()),await this.context.close()}setMuted(e){this.worklet.port.postMessage({type:"setMuted",isMuted:e})}}const oe=G("audio-concat-processor",`
const decodeTable = [0,132,396,924,1980,4092,8316,16764];

export function decodeSample(muLawSample) {
  let sign;
  let exponent;
  let mantissa;
  let sample;
  muLawSample = ~muLawSample;
  sign = (muLawSample & 0x80);
  exponent = (muLawSample >> 4) & 0x07;
  mantissa = muLawSample & 0x0F;
  sample = decodeTable[exponent] + (mantissa << (exponent+3));
  if (sign !== 0) sample = -sample;

  return sample;
}

class AudioConcatProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffers = []; // Initialize an empty buffer
    this.cursor = 0;
    this.currentBuffer = null;
    this.wasInterrupted = false;
    this.finished = false;
    
    this.port.onmessage = ({ data }) => {
      switch (data.type) {
        case "setFormat":
          this.format = data.format;
          break;
        case "buffer":
          this.wasInterrupted = false;
          this.buffers.push(
            this.format === "ulaw"
              ? new Uint8Array(data.buffer)
              : new Int16Array(data.buffer)
          );
          break;
        case "interrupt":
          this.wasInterrupted = true;
          break;
        case "clearInterrupted":
          if (this.wasInterrupted) {
            this.wasInterrupted = false;
            this.buffers = [];
            this.currentBuffer = null;
          }
      }
    };
  }
  process(_, outputs) {
    let finished = false;
    const output = outputs[0][0];
    for (let i = 0; i < output.length; i++) {
      if (!this.currentBuffer) {
        if (this.buffers.length === 0) {
          finished = true;
          break;
        }
        this.currentBuffer = this.buffers.shift();
        this.cursor = 0;
      }

      let value = this.currentBuffer[this.cursor];
      if (this.format === "ulaw") {
        value = decodeSample(value);
      }
      output[i] = value / 32768;
      this.cursor++;

      if (this.cursor >= this.currentBuffer.length) {
        this.currentBuffer = null;
      }
    }

    if (this.finished !== finished) {
      this.finished = finished;
      this.port.postMessage({ type: "process", finished });
    }

    return true; // Continue processing
  }
}

registerProcessor("audio-concat-processor", AudioConcatProcessor);
`);class O{static async create({sampleRate:e,format:n}){let t=null;try{t=new AudioContext({sampleRate:e});const s=t.createAnalyser(),o=t.createGain();o.connect(s),s.connect(t.destination),await oe(t.audioWorklet);const r=new AudioWorkletNode(t,"audio-concat-processor");return r.port.postMessage({type:"setFormat",format:n}),r.connect(o),await t.resume(),new O(t,s,o,r)}catch(s){var a;throw(a=t)==null||a.close(),s}}constructor(e,n,t,a){this.context=void 0,this.analyser=void 0,this.gain=void 0,this.worklet=void 0,this.context=e,this.analyser=n,this.gain=t,this.worklet=a}async close(){await this.context.close()}}class P extends M{static async startSession(e){var n;const t=M.getFullOptions(e);t.onStatusChange({status:"connecting"}),t.onCanSendFeedbackChange({canSendFeedback:!1});let a=null,s=null,o=null,r=null,u=null;if((n=e.useWakeLock)==null||n)try{u=await navigator.wakeLock.request("screen")}catch{}try{var v;return r=await navigator.mediaDevices.getUserMedia({audio:!0}),await J(t.connectionDelay),s=await D.create(e),[a,o]=await Promise.all([U.create(I({},s.inputFormat,{preferHeadphonesForIosDevices:e.preferHeadphonesForIosDevices})),O.create(s.outputFormat)]),(v=r)==null||v.getTracks().forEach(m=>m.stop()),r=null,new P(t,s,a,o,u)}catch(m){var f,d,w,y;t.onStatusChange({status:"disconnected"}),(f=r)==null||f.getTracks().forEach(p=>p.stop()),(d=s)==null||d.close(),await((w=a)==null?void 0:w.close()),await((y=o)==null?void 0:y.close());try{var _;await((_=u)==null?void 0:_.release()),u=null}catch{}throw m}}constructor(e,n,t,a,s){super(e,n),this.input=void 0,this.output=void 0,this.wakeLock=void 0,this.inputFrequencyData=void 0,this.outputFrequencyData=void 0,this.onInputWorkletMessage=o=>{this.status==="connected"&&this.connection.sendMessage({user_audio_chunk:ne(o.data[0].buffer)})},this.onOutputWorkletMessage=({data:o})=>{o.type==="process"&&this.updateMode(o.finished?"listening":"speaking")},this.addAudioBase64Chunk=o=>{this.output.gain.gain.value=this.volume,this.output.worklet.port.postMessage({type:"clearInterrupted"}),this.output.worklet.port.postMessage({type:"buffer",buffer:ae(o)})},this.fadeOutAudio=()=>{this.updateMode("listening"),this.output.worklet.port.postMessage({type:"interrupt"}),this.output.gain.gain.exponentialRampToValueAtTime(1e-4,this.output.context.currentTime+2),setTimeout(()=>{this.output.gain.gain.value=this.volume,this.output.worklet.port.postMessage({type:"clearInterrupted"})},2e3)},this.calculateVolume=o=>{if(o.length===0)return 0;let r=0;for(let u=0;u<o.length;u++)r+=o[u]/255;return r/=o.length,r<0?0:r>1?1:r},this.input=t,this.output=a,this.wakeLock=s,this.input.worklet.port.onmessage=this.onInputWorkletMessage,this.output.worklet.port.onmessage=this.onOutputWorkletMessage}async handleEndSession(){await super.handleEndSession();try{var e;await((e=this.wakeLock)==null?void 0:e.release()),this.wakeLock=null}catch{}await this.input.close(),await this.output.close()}handleInterruption(e){super.handleInterruption(e),this.fadeOutAudio()}handleAudio(e){this.lastInterruptTimestamp<=e.audio_event.event_id&&(this.options.onAudio(e.audio_event.audio_base_64),this.addAudioBase64Chunk(e.audio_event.audio_base_64),this.currentEventId=e.audio_event.event_id,this.updateCanSendFeedback(),this.updateMode("speaking"))}setMicMuted(e){this.input.setMuted(e)}getInputByteFrequencyData(){return this.inputFrequencyData!=null||(this.inputFrequencyData=new Uint8Array(this.input.analyser.frequencyBinCount)),this.input.analyser.getByteFrequencyData(this.inputFrequencyData),this.inputFrequencyData}getOutputByteFrequencyData(){return this.outputFrequencyData!=null||(this.outputFrequencyData=new Uint8Array(this.output.analyser.frequencyBinCount)),this.output.analyser.getByteFrequencyData(this.outputFrequencyData),this.outputFrequencyData}getInputVolume(){return this.calculateVolume(this.getInputByteFrequencyData())}getOutputVolume(){return this.calculateVolume(this.getOutputByteFrequencyData())}}class ie extends M{static startSession(e){return e.textOnly?B.startSession(e):P.startSession(e)}}const re={class:"voice-assistant-page"},le={class:"voice-assistant-container"},ce={key:0,class:"call-clara-label"},ue={width:"16",height:"16",viewBox:"0 0 22 22",fill:"none",style:{"margin-right":"6px"}},de={class:"voice-disc"},he=["disabled","aria-label"],pe={class:"voice-state-label",key:"state-label"},ve={key:0},fe={key:1},me=Y({__name:"VoiceAssistant",setup(l){const e=b(!1),n=b(!1),t=b(!1),a=b(!1),s=b(!1),o=b(""),r=b(!1),u=b(!1),v="sk_cbc6c812b915c65960160b25720a8a1bd2407de4a20fed24",f="agent_01jx663gpwe1at1yf8cg4ej5q7";let d=null;const w=()=>u.value?a.value?"Conectando...":r.value?"Finalizar conversación":n.value?"Escuchando...":t.value?"Clara está respondiendo":"Iniciar conversación":"Activar micrófono",y=async()=>{try{const c=await navigator.mediaDevices.getUserMedia({audio:!0});return u.value=!0,c.getTracks().forEach(i=>i.stop()),d=await ie.startSession({agentId:f,onConnect:()=>{console.log("Voice conversation connected"),n.value=!0,t.value=!1,a.value=!1},onDisconnect:()=>{console.log("Voice conversation disconnected"),n.value=!1,t.value=!1,a.value=!1},onError:i=>{console.error("Voice error:",i),g(i||"Error en la conversación de voz")},onModeChange:i=>{if(console.log("Mode changed:",i.mode),i.mode==="speaking"){t.value=!0,n.value=!1;const x=new Audio(N);x.volume=.5,x.play()}else t.value=!1,r.value&&(n.value=!0)}}),!0}catch(c){return console.error("Error initializing voice:",c),g("Error al inicializar el asistente de voz"),!1}},_=async()=>{if(!d){a.value=!0;const c=await y();if(a.value=!1,!c)return}r.value&&d?(await d.endSession(),d=null,r.value=!1,e.value=!1):(e.value=!0,r.value=!0)},m=()=>{!r.value&&!a.value&&(e.value=!0)},p=async()=>{!r.value&&!a.value&&e.value&&d&&(e.value=!1,await d.endSession(),d=null)},g=c=>{s.value=!0,o.value=c,a.value=!1,n.value=!1,t.value=!1,r.value=!1,e.value=!1,setTimeout(()=>{s.value=!1,o.value=""},3e3)};K(async()=>{try{const c=await navigator.mediaDevices.getUserMedia({audio:!0});u.value=!0,c.getTracks().forEach(i=>i.stop())}catch(c){console.error("Error checking microphone permissions:",c),u.value=!1}}),X(async()=>{d&&(await d.endSession(),d=null)});const S=c=>{const i=new Audio(c);i.volume=.7,i.play()};return W(n,(c,i)=>{console.log("isListening cambió:",i,"->",c),c&&!i&&S(te)}),W(t,(c,i)=>{c&&!i&&S(N)}),(c,i)=>(C(),k("div",re,[h("div",le,[A(T,{name:"fade-slide-down",appear:""},{default:E(()=>i[0]||(i[0]=[h("div",{class:"voice-assistant-title"},[h("h1",{class:"main-title"},"TruthLens Voice Agent"),h("p",{class:"subtitle"},[L("Chat with "),h("span",{class:"gradient-text"},"Clara"),L(". Your real-time multilingual AI from TruthLens.")])],-1)])),_:1,__:[0]}),A(T,{name:"scale-fade",appear:""},{default:E(()=>[h("div",{class:F(["voice-button-wrapper",{active:e.value,listening:n.value,speaking:t.value}])},[!n.value&&!t.value&&!a.value&&!r.value?(C(),k("div",ce,[(C(),k("svg",ue,i[1]||(i[1]=[h("rect",{x:"3",y:"10",width:"2",height:"4",rx:"1",fill:"#60a5fa"},null,-1),h("rect",{x:"7",y:"7",width:"2",height:"10",rx:"1",fill:"#60a5fa"},null,-1),h("rect",{x:"11",y:"5",width:"2",height:"14",rx:"1",fill:"#60a5fa"},null,-1),h("rect",{x:"15",y:"8",width:"2",height:"8",rx:"1",fill:"#60a5fa"},null,-1)]))),i[2]||(i[2]=L(" Call Clara "))])):R("",!0),h("div",de,[h("div",{class:F(["disc-gradient",n.value||t.value?"disc-gradient-bright":""])},null,2),i[3]||(i[3]=h("div",{class:"disc-shine"},null,-1))]),h("button",{onClick:_,onMousedown:m,onMouseup:p,onMouseleave:p,disabled:a.value,class:F(["voice-button",{listening:n.value,speaking:t.value,connecting:a.value,error:s.value}]),"aria-label":w()},[h("span",{class:F(["liquid-blob",n.value||t.value?"liquid-blob-active":""])},null,2)],42,he)],2)]),_:1}),A(T,{name:"state-fade-slide",mode:"out-in"},{default:E(()=>[n.value||t.value?(C(),k("div",pe,[n.value?(C(),k("span",ve,"Listening")):t.value?(C(),k("span",fe,"Responding")):R("",!0)])):R("",!0)]),_:1})]),i[4]||(i[4]=Q('<div class="mt-12 max-w-2xl mx-auto" data-v-f6d57d03><div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-8 mb-8 flex flex-col items-start" data-v-f6d57d03><div class="flex items-center mb-4" data-v-f6d57d03><svg class="w-7 h-7 text-cyan-300 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-f6d57d03><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3m13.07-6.93l-4.24 4.24m0 0l-4.24-4.24m8.48 8.48l-4.24 4.24m0 0l-4.24-4.24" stroke-linecap="round" data-v-f6d57d03></path></svg><h2 class="text-2xl font-bold text-white" data-v-f6d57d03>Clara, Your AI Assistant</h2></div><p class="text-slate-200 mb-3" data-v-f6d57d03>Meet Clara — your real-time AI companion for content verification. She can:</p><ul class="list-disc list-inside text-slate-300 mb-3" data-v-f6d57d03><li data-v-f6d57d03>Analyze text and image inputs</li><li data-v-f6d57d03>Highlight bias, detect emotional triggers, and evaluate source reliability</li><li data-v-f6d57d03>Support 50+ languages with real-time translation</li><li data-v-f6d57d03>Respond to voice commands with context awareness</li></ul><p class="text-slate-200" data-v-f6d57d03>Clara is available 24/7 to help you think critically.</p></div></div>',1)),A(ee)]))}}),ye=Z(me,[["__scopeId","data-v-f6d57d03"]]);export{ye as default};
