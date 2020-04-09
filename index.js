window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecognition();
// const icon = document.querySelector('i.fa.fa-microphone')
const icon = document.querySelector('#microphone');
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');


icon.addEventListener('click', () => {
    sound.play();
    dictate();
  });


const dictate = () => {
    console.log("RECOGNITION STARTED");
    recognition.start();
    document.getElementById("listen-tag").classList.remove('hidden');
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        paragraph.textContent = speechToText;
        document.getElementById("listen-tag").classList.add('hidden');
        console.log("RECOGNITION ENDED");
    }
}