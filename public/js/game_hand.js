const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.style.display = "none";
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
//canvasCtx.scale(-1, 1);

var pi = Math.PI;

var status = 0;
var label = "";
var stat2 = 0
var framespeed = 0
var point = 0
var lcounter = 0
var rcounter = 0
var timer = 450
var colorno = 0
var color_cur = "#FFFFFF"

function find_distance(x, y) {
  return (Math.round(Math.sqrt((x[1] - y[1]) ** 2 + (x[0] - y[0]) ** 2), 0));
}

function find_distance_shoulders(x, y) {
  return (Math.sqrt((x[1] - y[1]) ** 2 + (x[0] - y[0]) ** 2) * 100);
}



function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.font = "15px serif"
//   canvasCtx.fillStyle = "#0000FF";

  var landmarks = results.poseLandmarks;


  if (landmarks == null) {

    document.getElementById("error").innerHTML = "Make yourself visible in front of the Camera";
    console.log("Make yourself visible in front of the Camera");
    status = 1;

  }

  if (status == 0) {
    document.getElementById("error").innerHTML = "";

  }



  if (landmarks != null) {
    var nose = [landmarks[POSE_LANDMARKS.NOSE].x, landmarks[POSE_LANDMARKS.NOSE].y]

    var lshoulder = [landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x, landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y]
    var rshoulder = [landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].x, landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y]
    var distance = find_distance_shoulders(rshoulder, lshoulder);
    console.log(distance);
    if (distance > 25 && distance < 50) {

      if (nose[0] > 0.1 && nose[0] < 0.9) {
        
        var custom_landmarks = [results.poseLandmarks[19], results.poseLandmarks[20], results.poseLandmarks[31], results.poseLandmarks[32]]
        drawLandmarks(canvasCtx, custom_landmarks,
          { color: '#000000', lineWidth: 2 });
        status = 0;
        if (stat2 == 0) {
          document.getElementById("error").innerHTML = ""
          document.getElementById("backbone").innerHTML = "";
        }

        var lhand = [landmarks[POSE_LANDMARKS.LEFT_INDEX].x * 1200, landmarks[POSE_LANDMARKS.LEFT_INDEX].y * 600]
        var rhand = [landmarks[POSE_LANDMARKS.RIGHT_INDEX].x * 1200, landmarks[POSE_LANDMARKS.RIGHT_INDEX].y * 600]
        var colors=["#FF0000","#FFC000","#FFFC00","#FF0000","#00FFFF","#FF0000"]
        if (framespeed % 20 == 0) {
        //   var pointno = Math.floor(Math.random() * circles.length)
            point = [Math.random()*1100, Math.random()*400]
            colorno = Math.round(Math.random()*7,0)
            // var rgb = [];
            // for(var i = 0; i < 3; i++)
            // rgb.push(Math.floor(Math.random() * 255));
            // canvasCtx.fillStyle='rgb('+ rgb.join(',') +')';
            

        }
       

        if (point[0] != 0 && point[1] != 0) {
          canvasCtx.beginPath()
          canvasCtx.fillStyle=colors[colorno];
          canvasCtx.arc(point[0], point[1], 25, 0, 2 * Math.PI);
          canvasCtx.fill()
          canvasCtx.stroke()
        }

        var d1 = find_distance(lhand, point)
        var d2 = find_distance(rhand, point)

        var mindist = Math.min(d1, d2)
        var s = 'lhand ' + lhand + ' rhand ' + rhand + ' circle ' + point
        //console.log(s)
        if (mindist == d1) console.log("rhand")
        else if (mindist == d2) console.log("lhand")
    
        console.log(mindist)
        if (mindist < 50) {
          lcounter++;
          rcounter++;
          document.getElementById("counter").innerHTML = " ";
          point = [0, 0]
          document.getElementById("counter1").innerHTML = lcounter;
          document.getElementById("counter2").innerHTML = rcounter;
        }
        framespeed++;
        timer--;
        if (timer / 15) {
          document.getElementById("counter1").innerHTML = Math.round(timer / 15, 2);

        }
        if (framespeed >= 450) {

          document.getElementById("counter").innerHTML = "Time Up! You scored " + lcounter + " points.";
          lcounter = 0;
          rcounter = 0;
          framespeed = 0;
          timer = 450;
        }
        console.log(framespeed)
      }
      else {

        document.getElementById("error").innerHTML = "Stand in the Center"
      }

    } else { document.getElementById("backbone").innerHTML = "Please stand Close to the Camera"; }


  }
  else {
    document.getElementById("error").innerHTML = "please Stay in front of the Camera"
  }


  //canvasCtx.fillText("left", -360, 10)
  //canvasCtx.fillText("right", -840, 10)


}


const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });

  },
  width: 1200,
  height: 600
});
camera.start();

