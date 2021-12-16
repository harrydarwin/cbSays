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
cbApp.emailKey = 'Iw8lmZn9NOIqhSCGon5rvw';
cbApp.myEmail = 'cecilica@vacationeer.com'

function sendMail(userEmail, userFeedback) {
  $.ajax({
    type: "POST",
    url: "https://mandrillapp.com/api/1.0/messages/send.json",
    data: {
      'key': cbApp.emailKey,
      'message': {
        'from_email': cbApp.myEmail,
        'to': [
          {
            'email': cbApp.myEmail,
            'name': ' ',
            'type': ' '
          }
        ],
        'subject': 'New card feedback ',
        'html': 'User email: ' + userEmail + '<br> Feedback: ' + userFeedback 
      }
    }
  }).then(console.log('EMAIL SENT?!'));
}



cbApp.activateFeedbackForm = function() {
  $('#modalFeedback').on('shown.bs.modal', function (event) {
    console.log('modal up')
    $('#card-form-feedback').on('submit', function (e) {
      e.preventDefault();
console.log('form submit')
      const userEmail = $('#email-input-feedback').val();
      const userFeedback = $('#feedback-input').val();
      // const emailMessage = 'User email: ' + userEmail + '\n Message: ' + userFeedback;

      sendMail(userEmail, userFeedback);
      // mandrill._domainkey.ceciliabrush.com
// v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrLHiExVd55zd/IQ/J/mRwSRMAocV/hMB3jXwaHH36d9NaVynQFYV8NaWi69c1veUtRzGt7yAioXqLj7Z4TeEUoOLgrKsn8YnckGs9i3B3tVFB+Ch/4mPhXWiNfNdynHWBcPcbJ8kjEQ2U8y78dHZj1YeRXXVvWob2OaKynO8/lQIDAQAB;
    })
  })

}


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
        // cbApp.mediaList.push(downloadURL)
      });
    }
  );



}

cbApp.grabAndSetMedia = function (fileName, folder) {
  if (fileName === "CeciliaBrush_MC.mp4"){
    videojs('my_video_1');
  } else {
    
    console.log('grabbing and setting')
   let mediaRef; 
  
   // Create a reference to the file we want to download
    folder ? mediaRef = cbApp.storageRef.child(folder + '/' + fileName)
      : mediaRef = cbApp.storageRef.child('cbMedia/' + fileName);
      console.log(mediaRef)
    // Get the download URL
  
    mediaRef.getDownloadURL()
    // console.log(mediaRef.getMetadata())
      .then((url) => {
        console.log(url)
        const urlString = url.toString();
        console.log(urlString)
      //  setTimeout(function(){
         urlString.includes('jpg') || urlString.includes('jpeg') || urlString.includes('png')
           ? $('#picture-frame').html('<img src="' + url + '" alt="Disneyland castle lit up for the holidays">')
           : $('#picture-frame').html('<video-js id="my_video_1" class="vjs-default-skin" controls preload="auto" width="640" height="268"><source src = "' + url + '" type = "video/mp4"></video-js>');
          
          //  .html('<iframe class="wrapped-iframe cardVideo-html" src="' + url + '" gesture="media" allow="encrypted-media" allowfullscreen></iframe>')
          //  $('#picture-frame').html('<iframe id="cardVideo-html" src="' + url + '" frameborder="0" scrolling="no" webkitallowfullscreen="" mozallowfullscreen = "" allowfullscreen = "" allow = "autoplay; fullscreen"style = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" ></iframe >')
      //  }, 2000) 
           videojs('my_video_1');
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
  console.log('card page')
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
  cbApp.activateFeedbackForm();

}

cbApp.init = () => {

  
  // const data = { 'first name': 'George', 'last name': 'Jetson', 'age': 110 };
  // const querystring = cbApp.encodeQueryData(data);
  // console.log(querystring)
  // window.location.href == 'https://harrydarwin.github.io/cbSays/'
  // console.log(window.location.hash)
  window.location.href.includes('input') ?
    
  
  cbApp.initiateCardPage()
  :
  cbApp.authenticateUser();
  
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



//   Host name

// Type
// TTL
// Data
// ceciliabrush.com	MX	1 hour
// 1 aspmx.l.google.com.
// 5 alt1.aspmx.l.google.com.
// 5 alt2.aspmx.l.google.com.
// 10 alt3.aspmx.l.google.com.
// 10 alt4.aspmx.l.google.com.

//   ceciliabrush.com	SPF	1 hour
// "v=spf1 include:_spf.google.com ~all"

// ceciliabrush.com	TXT	1 hour
// "v=spf1 include:_spf.google.com ~all"

// google._domainkey.ceciliabrush.com	TXT	1 hour
// "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjkiDnblAh7R2lhMscEJZjUL2Gmo2bKLbS7bAN/onSumIvJ7qWu3vVig0EYrErVimGA063v473mV/VU86UsN/6xDWvSpSWEk1/RoBDCF8+k0GD8eT9UCjR7N69WFV8u09ZiCVD4ICm9tDAUy6aF53G7H5uJ50vCca/jx8IXI218n9tW7gv6WCylmhFGZquiUzq" "oWiXjOXDD+zJ/GiGyanpjqatBwD4TFeQVJ5YihjEa/O7I71vQbOmjH9MA/mc+ySUjl9DsMKLGlTFYpnjIaO7i2BxdVYqe7PxeLoT0KCxOsaXHX7ddkj61Vv6AZdQYCiil0ZlmrDV2OkiZ+L62jNbQIDAQAB" 