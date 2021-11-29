console.log('connected')

const cbApp = {};

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
  subtitle ? $('#cardTitle-html').text(subtitle)
           : $('#cardSubtitle-html').hide();
  video ? $('#cardVideo-html').attr('src', video)
        : $('#cardVideo').hide();
  transcript ? cbApp.paragraphBuilder(transcript, 'cardTranscript-html')
             : $('#cardTranscript').hide();
  message ? cbApp.paragraphBuilder(message, 'cardMessage-html')
          : $('#cardMessage').hide();
}

cbApp.initiateCardPage = function(){
  $('#cb-form').toggleClass('hideSection');
  $('#cb-card').toggleClass('hideSection');

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

  let urlParams = '';
  let paramsArray = [];
  // const data = { 'first name': 'George', 'last name': 'Jetson', 'age': 110 };
  // const querystring = cbApp.encodeQueryData(data);
  // console.log(querystring)
  window.location.href == 'file:///c:/Users/harry/OneDrive/Documents/sites/cbSays/index.html' ?
  
      $('#card-form').on('submit', function (e) {
        e.preventDefault();
        $('#qr').empty();
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
      

        console.log(cbApp.allInputs, urlParams);



        // const mySite = window.location.origin;
        const mySite = window.location.href;
        console.log(mySite)
        const newPage = new URL(urlParams, mySite);
        // THIS IS THE NEW URL FOR THE QR CODE TO BUILD THE NEW PAGE WITH!@!!!!
        console.log(newPage.href)

        $('#qr').qrcode({
          text: "https://moreonfew.com/generate-qr-code-using-jquery",
          render: "canvas",  // 'canvas' or 'table'. Default value is 'canvas'
          background: "#ffffff",
          foreground: "#000000",
          width: 150,
          height: 150
        });
        
        // .qrcode({
        //   size: 400,
        //   fill: '#000',
        //   text: newPage.href,
        //   mode: 1,
        //   fontcolor: '#BB2528'
        // });
      

      })
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