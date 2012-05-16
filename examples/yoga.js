

function Main() {
# your character commands instructions in go here


Yoga();
KateDemo();
}


********************************************************
# Function definitions go down here

function Yoga() {
   Rotate(0, 45, 0, 0.2);
   DownwardDogVinyasas();
   WarriorTwoVinyasas();
   Rotate(0, -45, 0, 0.2);
}

function DownwardDogVinyasas() {
   DownwardDogVinyasa(0);
   DownwardDogVinyasa(1);
}

function WarriorTwoVinyasas() {
    WarriorTwoVinyasa(0);
    WarriorTwoVinyasa(1);
}

function DownwardDogVinyasa(side) {
   DownwardDog(1);
   DownwardDogToWarriorOne(1, side);
   WarriorOne(0, side);
}

function WarriorTwoVinyasa(side) {
   WarriorTwo(1, side);
   WarriorTwo(0, side);
}

function DownwardDog(set) {
var sign = 2 * set - 1;

var i = 0;

while (i < 2) {
var i_sign = 2 * i - 1;
if ((i_sign * sign) < 0) {
DoTogether {
      RotateWaist(sign * 180, 0, 0, 1);
      RotateShoulders(0, 0, sign * 180, 1);
      RotateElbows(0, 0, sign * 10, 1);
}
} else {
DoTogether {
      RotateAnkles(sign * -45, 0, 0, 1);
      RotateHips(sign * 45, 0, 0, 1);
      RotateKnees(0, 0, 0, 1);
      
      RotateWaist(sign * -60, 0, 0, 1);

      Move(0, sign * -3, 0, 1);
   }
}
i = i + 1;
}
}

function DownwardDogToWarriorOne(set, side) {
var sign = 2 * set - 1;

var i = 0;

while (i < 2) {
var i_sign = 2 * i - 1;
if ((i_sign * sign) < 0) {
DoTogether {
      RotateAnkle(side, sign * (0 + 45), 0, 0, 1);
      RotateHip(side, sign * (-45 + -80), 0, 0, 1);
      RotateKnee(side, sign * 80, 0, 0, 1);
      RotateWaist(sign * -45, 0, 0, 1);
   }
} else {
DoTogether {
      RotateWaist(sign * -65, 0, 0, 1);
}

}
i = i + 1;
}
}

function WarriorOne(set, side) {
var sign = 2 * set - 1;

 DoTogether {
      RotateShoulders(0, 0, sign * 180, 1);
      RotateElbows(0, 0, sign * 10, 1);

      RotateAnkle(side, 0, 0, 0, 1);
      RotateHip(side, sign * -80, 0, 0, 1);
      RotateKnee(side, sign * 80, 0, 0, 1);
    
      RotateAnkle(1 - side, sign * -45, 0, 0, 1);
      RotateHip(1 - side, sign * 45, 0, 0, 1);
      RotateKnee(1 - side, 0, 0, 0, 1);
      
      RotateWaist(sign * 10, 0, 0, 1);

      Move(0, sign * -3, 0, 1);
   }
}

function WarriorTwo(set, side) {
var set_sign = 2 * set - 1;
var side_sign = 2 * side - 1;

 DoTogether {
      RotateShoulders(0, 0, set_sign * 100, 1);
      RotateElbows(0, 0, set_sign * 10, 1);

      RotateAnkle(side, 0, 0, 0, 1);
      RotateHip(side, set_sign * -80, 0, 0, 1);
      RotateKnee(side, set_sign * 80, 0, 0, 1);
    
      RotateAnkle(1 - side, set_sign * -20, set_sign * side_sign * 70, 0, 1);
      RotateHip(1 - side, set_sign * 45, 0, 0, 1);
      RotateKnee(1 - side, 0, 0, 0, 1);
      
      RotateWaist(set_sign * 10, set_sign * side_sign * 90, 0, 1);

      Move(0, set_sign * -3, 0, 1);
   }
}



function KateDemo() {
   
   Move(-60, 0, -80, 0.2);
   Rotate(0, 45, 0, 0.2);

   Walk(6);

   DoTogether {
      WaveThreeTimes();
      
      DoInOrder {
         TwistHips(-50, 0.8);  
         TwistHips(100, 1.6);
         TwistHips(-50, 0.8);  
      }
   }

   Wait(0.2);

   Pirouette();

   RotateRightElbow(0, 0, 60, 1);

   DoTogether {
      RotateRightShoulder(0, 0, 170, 1);
      RotateRightHip(0, 0, -3, 1);
      RotateLeftHip(0, 0, 3, 1);
      Move(-2, 50, 10, 3);

      RotateLeftAnkle(40, 0, 0, 1);
      RotateLeftHip(0, -100, -50, 1);
      RotateLeftKnee(-110, 0, 0, 1);
   }
   
}

function TwistHips(degrees, time) {

   var hipX = degrees / 7;
   var ankleX = degrees / 10;

   DoTogether {
      Rotate(0, degrees, 0, time);

      RotateLeftHip(-hipX, -degrees, 0, time);
      RotateLeftAnkle(ankleX, 0, 0, time);
 
      RotateRightHip(hipX, -degrees, 0, time);
      RotateRightAnkle(-ankleX, 0, 0, time);      
   }
}


function Walk(steps) {
   
   FirstStep();

   steps = steps - 1;

   var switch = 1;

   while (steps > 0) {
      
      if (switch == 1) {
         StepRight();
         switch = 0;
      } else {
         StepLeft();
         switch = 1;
      }

      steps = steps - 1;
   }

   if (switch == 1) {
      LastStepRight();
   } else {
      LastStepLeft();
   }

}

function FirstStep() {

   DoTogether {
      RotateWaist(8, 0, 0, 0.25);
      RotateRightHip(20, 0, 0, 0.25);
      RotateRightKnee(40, 0, 0, 0.25);
      
      RotateLeftHip(-40, 0, 0, 0.25);
      RotateLeftKnee(40, 0, 0, 0.25);

      Move(0, -1, 6.5, 0.25);

      RotateRightElbow(-60, 0, 0, 0.25);
      RotateRightShoulder(-40, 0, 0, 0.25); 

      RotateLeftShoulder(40, 0, 0, 0.25); 

   }

}

function LastStepRight() {
   DoTogether {
      RotateWaist(-8, 0, 0, 0.25);
      RotateRightHip(-20, 0, 0, 0.25);
      RotateRightKnee(-40, 0, 0, 0.25);
      
      RotateLeftHip(40, 0, 0, 0.25);
      RotateLeftKnee(-40, 0, 0, 0.25);

      RotateRightElbow(60, 0, 0, 0.25);
      RotateRightShoulder(40, 0, 0, 0.25); 

      RotateLeftShoulder(-40, 0, 0, 0.25);

      Move(0, 1, 6.5, 0.25);
   }
}

function LastStepLeft() {
   DoTogether {
      RotateWaist(-8, 0, 0, 0.25);
      RotateLeftHip(-20, 0, 0, 0.25);
      RotateLeftKnee(-35, 0, 0, 0.25);
      
      RotateRightHip(40, 0, 0, 0.25);
      RotateRightKnee(-45, 0, 0, 0.25);

      RotateRightShoulder(-40, 0, 0, 0.25); 

      RotateLeftElbow(60, 0, 0, 0.25);
      RotateLeftShoulder(40, 0, 0, 0.25);

      Move(0, 1, 6.5, 0.25);
   }

}

function StepRight() {
   
   DoTogether {
      RotateRightHip(-20, 0, 0, 0.25);
      RotateRightKnee(-30, 0, 0, 0.25);
      
      RotateLeftHip(40, 0, 0, 0.25);
      RotateLeftKnee(-35, 0, 0, 0.25);

      RotateRightShoulder(40, 0, 0, 0.25);
      RotateLeftShoulder(-40, 0, 0, 0.25);

      RotateRightElbow(30, 0, 0, 0.25);
      RotateLeftElbow(-30, 0, 0, 0.25);

      Move(0, 1, 6.5, 0.25);
   }

   DoTogether {
      RotateLeftHip(20, 0, 0, 0.25);
      RotateLeftKnee(30, 0, 0, 0.25);
      
      RotateRightHip(-40, 0, 0, 0.25);
      RotateRightKnee(35, 0, 0, 0.25);

      RotateRightShoulder(40, 0, 0, 0.25);
      RotateLeftShoulder(-40, 0, 0, 0.25);

      RotateRightElbow(30, 0, 0, 0.25);
      RotateLeftElbow(-30, 0, 0, 0.25);

      Move(0, -1, 6.5, 0.25);
   }

}

function StepLeft() {
   
   DoTogether {
      RotateLeftHip(-20, 0, 0, 0.25);
      RotateLeftKnee(-30, 0, 0, 0.25);
      
      RotateRightHip(40, 0, 0, 0.25);
      RotateRightKnee(-35, 0, 0, 0.25);

      RotateRightShoulder(-40, 0, 0, 0.25);
      RotateLeftShoulder(40, 0, 0, 0.25);

      RotateRightElbow(-30, 0, 0, 0.25);
      RotateLeftElbow(30, 0, 0, 0.25);

      Move(0, 1, 6.5, 0.25);
   }

   DoTogether {
      RotateRightHip(20, 0, 0, 0.25);
      RotateRightKnee(30, 0, 0, 0.25);
      
      RotateLeftHip(-40, 0, 0, 0.25);
      RotateLeftKnee(35, 0, 0, 0.25);

      RotateRightShoulder(-40, 0, 0, 0.25);
      RotateLeftShoulder(40, 0, 0, 0.25);

      RotateRightElbow(-30, 0, 0, 0.25);
      RotateLeftElbow(30, 0, 0, 0.25);

      Move(0, -1, 6.5, 0.25);
   }

}


function WaveThreeTimes() {
	RaiseArm();
	WaveElbow();

	WaveElbow();

	WaveElbow();
	LowerArm();

}

function RaiseArm() {
   DoTogether {
      RotateLeftShoulder(0, 0, 100, 0.7);
      RotateLeftElbow(0, 0, 100, 0.7);
   }
}

function LowerArm() {
   DoTogether {
      RotateLeftShoulder(0, 0, -100, 0.7);
      RotateLeftElbow(0, 0, -100, 0.7);
   }
}

function WaveElbow() {
   RotateLeftElbow(0, 0, -50, 0.5);
   RotateLeftElbow(0, 0, 50, 0.5);
}

function Pirouette() {
   SetPirouette(0.5);
   TwirlBallet(1);

}

function SetPirouette() {
  DoTogether {
      RotateRightShoulder(0, 0, -170, 1);
      RotateRightElbow(0, 0, -60, 1);
      RotateLeftShoulder(0, 0, 170, 1);
      RotateLeftElbow(0, 0, 60, 1);

      RotateRightAnkle(90, 0, 0, 1);
      RotateRightHip(0, 0, 0, 1);
      RotateRightKnee(0, 0, 0, 1);
    
      RotateLeftAnkle(50, 0, 0, 1);
      RotateLeftHip(0, 100, 50, 1);
      RotateLeftKnee(110, 0, 0, 1);

      RotateWaist(10, 0, 0, 1);

      Move(0, 1, 0, 1);
   }
}

function UnsetPirouette() {
  DoTogether {
      RotateRightShoulder(0, 0, 170, 1);
      RotateRightElbow(0, 0, 60, 1);
      RotateLeftShoulder(0, 0, -170, 1);
      RotateLeftElbow(0, 0, -60, 1);

      RotateRightAnkle(-90, 0, 0, 1);
      RotateRightHip(0, 0, 0, 1);
      RotateRightKnee(0, 0, 0, 1);
    
      RotateLeftAnkle(-50, 0, 0, 1);
      RotateLeftHip(0, -100, -50, 1);
      RotateLeftKnee(-110, 0, 0, 1);

      RotateWaist(-10, 0, 0, 1);

      Move(0, -1, 0, 1);
   }
}

function TwirlBallet(twirl_time) {

   DoTogether {
      Rotate(0, 360, 0, twirl_time);
      Move(-10, 0, -10, twirl_time);
   }

}

#Mirror actions, relative to left shoulder

# rotate both shoulders
function RotateShoulders(x, y, z, time) {
DoTogether {
   RotateLeftShoulder(x, y, z, time);
   RotateRightShoulder(x, -y, -z, time);
}
}

# rotate both elbows
function RotateElbows(x, y, z, time) {
DoTogether {
   RotateLeftElbow(x, y, z, time);
   RotateRightElbow(x, -y, -z, time);
}
}

# rotate both knees
function RotateKnees(x, y, z, time) {
DoTogether {
   RotateLeftKnee(x, y, z, time);
   RotateRightKnee(x, -y, -z, time);
}
}

# rotate both ankles
function RotateAnkles(x, y, z, time) {
DoTogether {
   RotateLeftAnkle(x, y, z, time);
   RotateRightAnkle(x, -y, -z, time);
}
}

# rotate both hips
function RotateHips(x, y, z, time) {
DoTogether {
   RotateLeftHip(x, y, z, time);
   RotateRightHip(x, -y, -z, time);
}
}

********************************************************
#basic functions
********************************************************

# left == 0
# right == 1

function Wait(time) { 
   	_move(0, 0, 0, 0, time);
}

# moves character x, y, z in time seconds
function Move(x, y, z, time) {
	_move(0, x, y, z, time);
}

# moves character to location (x, y, z) in time seconds
function MoveTo(x, y, z, time) {
        _moveTo(0, x, y, z, time);
}

# rotates the entire character for x, y, z degrees
function Rotate(x, y, z, time) {
	_rotate(0, x, y, z, time);   
}

# rotates the character at the waist
function RotateWaist(x, y, z, time) {
	_rotate(1, x, y, z, time);   
}

# rotate the specified shoulder
function RotateShoulder(side, x, y, z, time) {
      _rotate(2 + side, x, y, z, time);
}

# rotates the left shoulder
function RotateLeftShoulder(x, y, z, time) {
	_rotate(2, x, y, z, time);   
}

# rotates the right shoulder
function RotateRightShoulder(x, y, z, time) {
	_rotate(3, x, y, z, time);   
}

# rotate the specified elbow
function RotateElbow(side, x, y, z, time) {
      _rotate(7 + side, x, y, z, time);
}

# rotates the left elbow
function RotateLeftElbow(x, y, z, time) {
	_rotate(7, x, y, z, time);   
}

# rotates the right elbow
function RotateRightElbow(x, y, z, time) {
	_rotate(8, x, y, z, time);   
}

# rotate the specified knee
function RotateKnee(side, x, y, z, time) {
      _rotate(9 + side, x, y, z, time);
}

# rotates the left knee                          
function RotateLeftKnee(x, y, z, time) {
	_rotate(9, x, y, z, time);   
}

# rotates the right knee
function RotateRightKnee(x, y, z, time) {
	_rotate(10, x, y, z, time);   
}

# rotate the specified ankle
function RotateAnkle(side, x, y, z, time) {
      _rotate(11 + side, x, y, z, time);
}

# rotates the left ankle                       
function RotateLeftAnkle(x, y, z, time) {
	_rotate(11, x, y, z, time);   
}

# rotates the right ankle
function RotateRightAnkle(x, y, z, time) {
	_rotate(12, x, y, z, time);   
}

# rotate the specified hip
function RotateHip(side, x, y, z, time) {
      _rotate(4 + side, x, y, z, time);
}

# rotates the left hip
function RotateLeftHip(x, y, z, time) {
	_rotate(4, x, y, z, time);   
}

# rotates the right hip
function RotateRightHip(x, y, z, time) {
	_rotate(5, x, y, z, time);   
}

# rotates the neck
function RotateNeck(x, y, z, time) {
	_rotate(6, x, y, z, time);   
}

# returns a random # between low and high
function Random(low, high) {
	return _random(low, high);
}











