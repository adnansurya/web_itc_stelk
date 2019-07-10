function Bird() {
  this.y = height/2;
  this.x = 64;

  this.gravity = .3;//.5;
  this.lift = 3; //10;
  this.velocity = 0;

  this.show = function(){
    fill(240,230,140);
    ellipse(this.x, this.y, 32, 32);
    fill(0);
    ellipse(this.x+8, this.y, 4, 4);
    fill(255,127,80);
    triangle(this.x+15, this.y-5, this.x+15, this.y+5, this.x+20, this.y);
  }

  this.up = function(){
    this.velocity -= this.lift;
  }

  this.update = function(){
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height){
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0){
      this.y = 0;
      this.velocity = 0;
    }
  }
}
