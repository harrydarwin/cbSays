const cbApp = {};
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU8sYvYLOO9CAWj7N95FxyHmYGvoK0bJI",
  authDomain: "cbsays-6bb73.firebaseapp.com",
  projectId: "cbsays-6bb73",
  storageBucket: "cbsays-6bb73.appspot.com",
  messagingSenderId: "222741539857",
  appId: "1:222741539857:web:db922c21433debb41d15b0",
  measurementId: "G-H29RR6Q4HK"
};

firebase.initializeApp(firebaseConfig);
// const cbApp = initializeApp(firebaseConfig);
console.log('connected')
// Import the functions you need from the SDKs you need

// cbApp.auth = getAuth();
// createUserWithEmailAndPassword(cbApp.auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });



// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


$.clearFormFields = function (area) {
  $(area).find('input[type="text"],input[type="email"],input[type="password"],textarea,select').val('');
};

cbApp.getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};

cbApp.encodeQueryData = function(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

cbApp.paragraphBuilder = function(string, id) {
  const newString = string.split('##');
  newString.forEach(function(p) {
    const paragraph = '<p>' + p + '</p>';
    console.log(paragraph)
    $('#' + id).append(paragraph);
  })
}

cbApp.cardCreator = function (title, subtitle, video, transcript, message) {
  $('#cardTitle-html').text(title);
  subtitle ? $('#cardSubtitle-html').text(subtitle)
    : $('#cardSubtitle-html').hide();
  video ? $('#cardVideo-html').attr('src', video)
    : $('#picture-frame').html('<img src="assets/media/disneylandplaceholder.jpg" alt="Disneyland castle lit up for the holidays">');
  transcript ? cbApp.paragraphBuilder(transcript, 'cardTranscript-html')
    : $('#cardTranscript').hide();
  message ? cbApp.paragraphBuilder(message, 'cardMessage-html')
    : $('#cardMessage').hide();
}

cbApp.authenticateUser = function() {
  $('#authForm').on('submit', function(e) {
    e.preventDefault();
    const userEmail = $('#inputEmail').val();
    const userPassword = $('#inputPassword1').val();
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        $('#userAuth').hide();
        $('#cb-form').toggleClass('hideSection');
        cbApp.createNewQrCode()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        $.clearFormFields($('#authForm'));
        $('#modalNoAccess').modal('show');
      });
  })
}


cbApp.createNewQrCode = function() {

  $('#card-form').on('submit', function (e) {
    e.preventDefault();
    $('#qr').empty();
    let urlParams = '';
    let paramsArray = [];
    console.log($(this).find(':input'));
    const inputArray = $(this).find(':input.user-input');

    for (let input in inputArray) {
      const inputId = inputArray[input].id;
      const inputValue = inputArray[input].value;

      const inputObject = {
        [inputId]: inputValue
      };

      inputId && inputValue ? cbApp.allInputs.push(inputObject) : null;
    }

    const inputNum = cbApp.allInputs.length - 1;

    cbApp.allInputs.forEach(function (input) {
      const queryString = cbApp.encodeQueryData(input);
      paramsArray.push(queryString)
    })

    urlParams = "?" + paramsArray.join('&');

    // const mySite = window.location.origin;
    const mySite = window.location.href;
    console.log(mySite)
    const newPage = new URL(urlParams, mySite);
    // THIS IS THE NEW URL FOR THE QR CODE TO BUILD THE NEW PAGE WITH!@!!!!
    console.log(newPage.href)

    $('#card-form').each(function () {
      this.reset();
    });

    $('#qr').qrcode({
      text: newPage.href,
      render: "canvas",  // 'canvas' or 'table'. Default value is 'canvas'
      background: "#ffffff",
      foreground: "#000000",
      width: 400,
      height: 400
    });

  })
}

cbApp.initiateCardPage = function () {
  $('#cb-card, #cardFooter, #userAuth').toggleClass('hideSection');
  // $('#cb-card').toggleClass('hideSection');
  // $('#cardFooter').toggleClass('hideSection')

  console.log('creating card!')
  const cardPage = window.location.href,
    cardUrl = cbApp.getUrlParameter('url-input'),
    cardTitle = cbApp.getUrlParameter('title-input'),
    cardSubtitle = cbApp.getUrlParameter('subtitle-input'),
    cardVideo = cbApp.getUrlParameter('video-input'),
    cardTranscript = cbApp.getUrlParameter('transcript-text-input'),
    cardMessage = cbApp.getUrlParameter('message-input');

  cbApp.cardCreator(cardTitle, cardSubtitle, cardVideo, cardTranscript, cardMessage);


}

cbApp.init = () => {

  
  // const data = { 'first name': 'George', 'last name': 'Jetson', 'age': 110 };
  // const querystring = cbApp.encodeQueryData(data);
  // console.log(querystring)
  // window.location.href == 'https://harrydarwin.github.io/cbSays/'
  window.location.href == 'file:///c:/Users/harry/OneDrive/Documents/sites/cbSays/index.html' ?
    
      cbApp.authenticateUser()
      
  :
      cbApp.initiateCardPage();
  
}



  cbApp.cardUrl = '',
  cbApp.cardVideo = '',
  cbApp.cardTranscriptTitle = '',
  cbApp.cardTranscriptText = '',
  cbApp.cardMessage = '';
  cbApp.allInputs = [];

  $(document).ready(function() {
    
    cbApp.init();


  });