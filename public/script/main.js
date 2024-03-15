

function sha256(str, callback) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    // se mdn web docs
    crypto.subtle.digest("SHA-256", data)
    .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");       
        callback(hashHex)
    });
  }

  async function postTo(url, data) {
    const header = {
    
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const respon = await fetch(url, header);
    return respon;
}

function logout(){
    localStorage.clear();
    location.reload();
}