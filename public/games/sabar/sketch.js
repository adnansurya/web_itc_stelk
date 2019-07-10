// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Voice Chatbot with p5.Speech
// Edited Video: https://youtu.be/iFTgphKCP9U
const db = firebase.database();



function setup() {
  noCanvas();
 //let speech = new p5.Speech('id-ID');
  let speechRec = new p5.SpeechRec('id-ID', gotSpeech);
  speechRec.onEnd = berhenti;
  let continuous = true;
  let interim = false;
 speechRec.start(continuous, interim);

  //let bot = new RiveScript();
  //bot.loadFile("brain.rive", brainReady, brainError);

  function brainReady() {
    console.log('Chatbot ready!');
    bot.sortReplies();
  }

  function brainError() {
    console.log('Chatbot error!')
  }

let infoTxt = select('#infoTxt');
let jawabTxt = select('#jawabTxt');
let inputTxt = select('#inputTxt');
let nomorTxt = select('#nomorTxt');

let soalnow;
let soallast;
let nama;






  infoTxt.html('Katakan \'Mulai\'');
  let ulang = 0;
  let jumlah_soal;
  let poin = 0;
  let mulai=false;
  let selesai = false;
  let error = false;
  let teks;
  
  var last = db.ref('games/sabar/question/').orderByKey().limitToLast(1);
  last.once('value').then(function(snapshot){
    var datakey = snapshot.key;
    var data = snapshot.val();
    var lastnum = Object.keys(data)[0];
    jumlah_soal = Number(lastnum) + 1;
    
    
    
    
  });

  function submitScore(){
     

    db.ref('games/sabar/result').push({
      nama : nama,
     // coba : percobaan,
      poin : poin
  
    }, function (error){
      if(error){
        alert('Terjadi Kesalahan : ' + error.message);
      }
    });
  }

  function gotSpeech() {
    if (speechRec.resultValue) {
      
      console.log(jumlah_soal + "soal");
      
      let input = speechRec.resultString;
      teks = input;
     
      refreshSoal();
      
      inputTxt.html("Kata Terakhir Terdeteksi : \'" + input + "\'");

      if(cariKata('mulai', input)){
        mulai = true;
       
      }
      console.log("Input : " + input);
      console.log("Ulang : " + ulang);
      if(mulai== true){
        
       
        
        if(ulang > 0){
          loadSoal(ulang-1);
        
          console.log(soalnow);

          if(soallast != undefined){
            if(cariKata(soallast.jawab, input)){
              console.log('tepat');
              poin++;
              status = 2;
           
            }else{
              status = 1;
              
              console.log('salah');
     
            }
            refresh();
          }
   
          viewSoal();
     
          
        }else{
          infoTxt.html('Sekarang, katakan \'Salah\'');
        }
        ulang++;
        
       
      }

      
    }else{
      infoTxt.html('Tunggu');
    }
  }

  function cariKata(kata, kalimat){
    var n = kalimat.indexOf(kata);
    if(n == -1){
      return false;
    }else{
      return true;
    }
  }

  function refreshSoal(){
    
    $('#quiz').fadeOut();
    setTimeout(function(){
      $('#quiz').show();
    },500);
   
  }
  function refresh(){
    if(selesai){
      jawabTxt.html('Permainan Selesai!');
      $('#jawabTxt').removeClass('text-success');
      $('#jawabTxt').removeClass('text-danger');
    }else{
      if(status == 1){
        jawabTxt.html('KURANG TEPAT!');
        $('#jawabTxt').addClass('text-danger');
        $('#jawabTxt').removeClass('text-success');
  
      }else if(status == 2){
        jawabTxt.html('TEPAT SEKALI!');
        $('#jawabTxt').addClass('text-success');
        $('#jawabTxt').removeClass('text-danger');
      }
    }
    if(error){
      errorHandler();
    }
    
    $('#jawabTxt').show();
    setTimeout(function(){
      $('#jawabTxt').fadeOut();
    },1000);

    
  }

  function errorHandler(){
    jawabTxt.html('Terjadi Kesalahan');
    infoTxt.html('Refresh Browser Klik Disini!')
    $("label.btn").on('click',function () {
      location.href="index.html";
    });

  }

  function viewSoal(){
    if(soalnow != soallast){
      if(soalnow != undefined && soalnow.tanya != null){
        infoTxt.html(String(soalnow.tanya));
        nomorTxt.html("Pertanyaan ke : " + String(ulang-1));
        soallast = soalnow;
        
      }else{
        infoTxt.html('Coba katakan lagi?');
        ulang--;
      }
      
    }else{
      if(ulang <= 2){
        infoTxt.html('Oke, selanjutnya katakan \'Benar\'');
      }else{
        infoTxt.html('Barusan kamu bilang \'' + teks + '\'?')
      }
    }
  }

  function loadSoal(nomor){

    
      var query = db.ref('games/sabar/question/' + String(nomor));
      query.once('value').then(function(snapshot){
        
        try {
            var key = snapshot.key;
            var values = snapshot.val();
    
            var tanya = values.tanya;
            var jawab = values.jawab;
            //console.log("nomor : " + nomor);
    
            pertanyaan = tanya;
            jawaban = jawab;
            soalnow = values;
          } catch (error) {
          
            
            if(ulang-3 == jumlah_soal){
              nama = window.prompt("Masukkan Nama Kamu : ");
              poin = Math.round(poin / jumlah_soal * 100);
              infoTxt.html('Selamat ' + nama + ', Skor Kamu : ' + poin);
              nomorTxt.html('Permainan Selesai');
              console.log('selesai');
              selesai = true;
              submitScore();
              
              
            }else if(ulang-2 == jumlah_soal){
              console.log('sisa1')
             
              
            
            }else{
              nomorTxt.html('');
              if(!ulang-3 > jumlah_soal){
                errorHandler();
              }
              
             
              
            }
            
            console.log(error.message);
            
          }
          
      
      });
    
    
  }

  function berhenti(){
    
    error = true;
    refresh();

    
  }

  

  

}
