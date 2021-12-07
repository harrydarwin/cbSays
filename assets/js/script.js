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
const imagePlaceholderURl = 'https://firebasestorage.googleapis.com/v0/b/cbsays-6bb73.appspot.com/o/cbMedia%2Fdisneylandplaceholder.jpg?alt=media&token=a775b233-096a-4fa3-88c2-5021db30861a';

cbApp.currentUploadUrl = '';
cbApp.mediaList = [];
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
cbApp.getFileType = function(file) {
  let fileName, fileExtension;
  fileName = file;
  fileExtension = fileName.replace(/^.*\./, '');
  return fileExtension;
}

cbApp.storage = firebase.storage();
cbApp.storageRef = cbApp.storage.ref();
cbApp.cbMedia = cbApp.storageRef.child('cbMedia');
console.log(cbApp.cbMedia)


cbApp.addNewMedia = function(file) {
  const mediaType = file.type;
  const mediaName = file.name;
  console.log(file, file.name)
  const metadata = {
    contentType: mediaType
  }

  // Upload file and metadata to the object 'images/mountains.jpg'
  const uploadTask = cbApp.storageRef.child('cbMedia/' + file.name).put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        cbApp.currentUploadUrl = downloadURL;
        cbApp.mediaList.push(downloadURL)
      });
    }
  );



}

cbApp.grabAndSetMedia = function (fileName, folder) {
 let mediaRef; 

 // Create a reference to the file we want to download
  folder ? mediaRef = cbApp.storageRef.child(folder + '/' + fileName)
    : mediaRef = cbApp.storageRef.child('cbMedia/' + fileName);
  // Get the download URL
  mediaRef.getDownloadURL()
    .then((url) => {
      console.log(url.toString())
      const urlString = url.toString();
    //  setTimeout(function(){
       urlString.includes('jpg') || urlString.includes('jpeg') || urlString.includes('png')
         ? $('#picture-frame').html('<img src="' + url + '" alt="Disneyland castle lit up for the holidays">')
         : $('#picture-frame').html('<iframe id="cardVideo-html" src="' + url + '" frameborder="0" scrolling="no" webkitallowfullscreen="" mozallowfullscreen = "" allowfullscreen = "" allow = "autoplay; fullscreen"style = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" ></iframe >')
    //  }, 2000) 
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
}
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

  transcript ? cbApp.paragraphBuilder(transcript, 'cardTranscript-html')
    : $('#cardTranscript').hide();
  message ? cbApp.paragraphBuilder(message, 'cardMessage-html')
    : $('#cardMessage').hide();

        console.log('hello time')
        if (video) {
          console.log(video)
          cbApp.grabAndSetMedia(video)
        } else {
          $('#picture-frame').html('<img src="' + imagePlaceholderURl + '" alt="Disneyland castle lit up for the holidays">');
        }
     
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
  let mediaToLoad = {};
  // capture file on upload
  $('#media-input').on('change', function () {
    console.log(this.files);
    mediaToLoad = {
      file: this.files[0],
      name: this.files[0].name,
      type: this.files[0].type
    }
  })

  $('#card-form').on('submit', function (e) {
    e.preventDefault();
    $('#qr').empty();
    let urlParams = '';
    let paramsArray = [];

    if(mediaToLoad != {}){
      const mediaObject = {
        'media-input': mediaToLoad.name
      }
      cbApp.allInputs.push(mediaObject);
      cbApp.addNewMedia(mediaToLoad.file)

    }

    console.log($(this).find(':input'));
    const inputArray = $(this).find(':input.user-input:not(#media-input)');
   
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
    cardVideo = cbApp.getUrlParameter('media-input'),
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