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

  
const dictate = async() => {
    console.log("RECOGNITION STARTED");
    recognition.start();
    document.getElementById("listen-tag").classList.remove('hidden');
    recognition.onresult = async(event) => {
        const speechToText = event.results[0][0].transcript;
        paragraph.textContent = speechToText;
        document.getElementById("listen-tag").classList.add('hidden');
        console.log("RECOGNITION ENDED");

        //ml5
        // analyzeSentiment(speechToText);

        //tensorflow
        console.log("running prediction")
        const predictor = await new SentimentPredictor().init(HOSTED_URLS);
        console.log(predictor.predict(speechToText))
    }
}

//ml5
const analyzeSentiment = (text) => {
    // Create a new Sentiment method
    const sentiment = ml5.sentiment('movieReviews', modelReady);

    // When the model is loaded
    function modelReady() {
        // model is ready
        console.log('Model Loaded!');

        // make the prediction
        const prediction = sentiment.predict(text);
        console.log(`Sentiment for ${text}: `, prediction);
    } 
}




//tensor flow predictions. taken from : https://www.twilio.com/blog/how-positive-was-your-year-with-tensorflow-js-and-twilio
//sequence utils
const PAD_INDEX = 0;  // Index of the padding character.
const OOV_INDEX = 2;  // Index fo the OOV character.
function padSequences(
    sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) {
  // TODO(cais): This perhaps should be refined and moved into tfjs-preproc.
  return sequences.map(seq => {
    // Perform truncation.
    if (seq.length > maxLen) {
      if (truncating === 'pre') {
        seq.splice(0, seq.length - maxLen);
      } else {
        seq.splice(maxLen, seq.length - maxLen);
      }
    }

    // Perform padding.
    if (seq.length < maxLen) {
      const pad = [];
      for (let i = 0; i < maxLen - seq.length; ++i) {
        pad.push(value);
      }
      if (padding === 'pre') {
        seq = pad.concat(seq);
      } else {
        seq = seq.concat(pad);
      }
    }

    return seq;
  });
}

//loader
async function loadHostedMetadata(url) {
    try {
      const metadataJson = await fetch(url);
      const metadata = await metadataJson.json();
      return metadata;
    } catch (err) {
      console.error(err);
    }
  }

  async function loadHostedPretrainedModel(url) {
    try {
      const model = await tf.loadLayersModel(url);
      // We can't load a model twice due to
      // https://github.com/tensorflow/tfjs/issues/34
      // Therefore we remove the load buttons to avoid user confusion.
      return model;
    } catch (err) {
      console.error(err);
    }
  }

const HOSTED_URLS = {
    model:
        'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata:
        'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
  };
class SentimentPredictor {
    /**
     * Initializes the Sentiment demo.
     */
    async init(urls) {
      this.urls = urls;
      this.model = await loadHostedPretrainedModel(urls.model);
      await this.loadMetadata();
      return this;
    }
  
    async loadMetadata() {
      const sentimentMetadata =
          await loadHostedMetadata(this.urls.metadata);
      this.indexFrom = sentimentMetadata['index_from'];
      this.maxLen = sentimentMetadata['max_len'];
      console.log('indexFrom = ' + this.indexFrom);
      console.log('maxLen = ' + this.maxLen);
  
      this.wordIndex = sentimentMetadata['word_index'];
      this.vocabularySize = sentimentMetadata['vocabulary_size'];
      console.log('vocabularySize = ', this.vocabularySize);
    }
  
    predict(text) {
      // Convert to lower case and remove all punctuations.
      const inputText =
          text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
      // Convert the words to a sequence of word indices.
      const sequence = inputText.map(word => {
        let wordIndex = this.wordIndex[word] + this.indexFrom;
        if (wordIndex > this.vocabularySize) {
          wordIndex = OOV_INDEX;
        }
        return wordIndex;
      });
      // Perform truncation and padding.
      const paddedSequence = padSequences([sequence], this.maxLen);
      const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);
  
      const beginMs = performance.now();
      const predictOut = this.model.predict(input);
      const score = predictOut.dataSync()[0];
      predictOut.dispose();
      const endMs = performance.now();
  
      return {score: score, elapsed: (endMs - beginMs)};
    }
  };


  
