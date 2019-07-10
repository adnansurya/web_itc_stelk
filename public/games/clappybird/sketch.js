var bird;
var pipes = [];
var count = 0;
var flag = true;
var pipe_flag = true;
//var w = 700;
//var h = 700;
var w = window.screen.width/1.3;
var h = window.screen.height/1.3;
var cnv;
var mic;
var sensi = 10;
var slider;
var sensiStr;
var nama;


function centerCanvas(){
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x,y);
}

function setup(){
  //cnv = createCanvas(windowWidth,windowHeight); //700,600
  cnv = createCanvas(w,h);
  centerCanvas();
  bird = new Bird;
  pipes.push(new Pipe());
  mic = new p5.AudioIn()
  mic.start();
 // alert("Source Code Game Ini DiColong lalu DiModifikasi dari : https://github.com/ilei2/flappy-bird");
  //alert("Pastikan anda memiliki microphone yang berfungsi dengan baik dan menekan Allow pada notifikasi share microphone yang muncul pada browser");
  nama = window.prompt("Masukkan nama anda ")
  slider = createSlider(50, 1000,50, 1 );
  slider.value('70'); // NILAI DEFAULT SLIDER (GUNAKAN SETELAH TESTING)
  slider.position(10, 80);

  sensiTxt = createElement('p', "sensitifitas");
  sensiTxt.position(10, 30);




}

function draw(){
  background(176,224,230);
  bird.update();
  bird.show();
  fill(0);
  textSize(32);
  str = "Streak: " + count;
  text(str, w/3, h/5);

  sensi = slider.value();

  sensiStr = "Sensitivitas : " + sensi;
  sensiTxt.html(sensiStr);



  if (frameCount % 150 == 0){
    pipes.push(new Pipe());
  }
  for (var i = 0; i < pipes.length; i ++){
    pipes[i].show();
    if (pipe_flag == true){
      pipes[i].update();
    }
    if (flag == true && pipes[i].x < 0/*(width/15)*/){ //negative?
      flag = false;
      count += 1;
      str = "Skor: " + count;
    }

    if (pipes[i].hits(bird)){
      str = "Skor: " + count;
      noLoop();
      startOver();
      pipe_flag = false;
    }

    if (pipes[i].x < -width/3){  //-width...goes off screen
      pipes.splice(i,1); //deletes element from array
      flag = true;
    }
  }
  micLevel = mic.getLevel() * 1000;
  console.log(micLevel);

if(micLevel > sensi){
    bird.up()
}


}

function startOver(){
  saveScore(count);
  var button = createButton("Main Lagi?");
  button.position(10,windowHeight/2);
  //button.position(windowWidth/2, windowHeight/2);
  button.mousePressed(reset);
}

function reset(){
  window.location.reload()
}

function windowResized(){
  centerCanvas();
}

function touchStarted(){
  if (pipe_flag == true){
    bird.up();
  }
  if (pipe_flag == false){
    reset();
  }
  return false;
}

function saveScore(skor){
  db.ref('games/clappybird/').push({
    nama : nama,
   // coba : percobaan,
    skor : skor

  }, function (error){
    if(error){
      alert('Terjadi Kesalahan : ' + error.message);
    }else{
      location.href='leaderboard.html';
    }
  });



}

/*function keyPressed(){
  if (key == ' ' && pipe_flag == true){
    bird.up();
  }
}*/
