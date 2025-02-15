let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
        let blob = new Blob(audioChunks, { type: 'audio/wav' });
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            let base64Audio = reader.result;
            let response = await fetch('/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio: base64Audio })
            });
            let data = await response.json();
            document.getElementById('transcription').innerText = data.transcription;
            document.getElementById('audioPlayback').src = data.audio;
        };
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 6000);
}
