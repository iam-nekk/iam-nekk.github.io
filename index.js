let codeword_inp
let btn
let msg

document.addEventListener("DOMContentLoaded", async ()=>{
  codeword_inp = document.getElementById("codeword")
  btn = document.getElementById("btn")
  msg = document.getElementById("secretmessage")
  btn.addEventListener("click", findMessage)
  // console.log(store)
})

async function findMessage(){
  const textvalue = codeword_inp.value
  const codeword = await digestMessage(textvalue)
  const encryptedmsg = store[codeword]
  console.log(textvalue, codeword, encryptedmsg)
  if (!encryptedmsg) return
  const decryptedmsg = decrypt(encryptedmsg, textvalue)
  console.log("message found!", decryptedmsg)
  msg.innerHTML = decryptedmsg
}

function encrypt(text, key){
  return [...text].map((x, i) => 
  (x.codePointAt() ^ key.charCodeAt(i % key.length) % 255)
   .toString(16)
   .padStart(2,"0")
 ).join('')
}

function decrypt(text, key){
  return String.fromCharCode(...text.match(/.{1,2}/g)
   .map((e,i) => 
     parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255)
   )
}
// let enc = encrypt("My String", "Passphrase")
// let dec = decrypt(enc, "Passphrase")

// console.log(enc) // 1d185320041a1b0f14
// console.log(dec) // My String

// const text = "An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.";

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

const pw = "fruitful"
const txt = "<h1>Thats fucking football right there.</h1> None of that pansy ass dick tugging smile for the camera bullshit. Men puke, men poop on the field, men deliver their new born baby on the side lines. Fucking hard core dick in the ass butterball foosball fuck it chuck it game time shit. Football is back, baby"
console.log(pw, await digestMessage(pw),txt, await encrypt(txt,pw))

// digestMessage(text).then((digestHex) => console.log(digestHex));