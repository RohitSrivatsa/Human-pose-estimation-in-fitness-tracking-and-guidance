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
  canvasCtx.fillStyle = "#0000FF";

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
    if (distance > 5 && distance < 20) {

      if (nose[0] > 0.3 && nose[0] < 0.7) {

        var custom_landmarks = [results.poseLandmarks[19], results.poseLandmarks[20], results.poseLandmarks[31], results.poseLandmarks[32]]
        drawLandmarks(canvasCtx, custom_landmarks,
          { color: '#000000', lineWidth: 2 });
        status = 0;
        if (stat2 == 0) {
          document.getElementById("error").innerHTML = ""

        }
        var circles = [[360, 40], [360, 170], [360, 310], [360, 430], [360, 550], [840, 40], [840, 170], [840, 310], [840, 430], [840, 550], [500, 40], [650, 40], [500, 550], [650, 550]]

        for (var i = 0; i < circles.length; i++) {
          canvasCtx.beginPath()
          canvasCtx.arc(circles[i][0], circles[i][1], 25, 0, 2 * Math.PI);
          canvasCtx.stroke()
        }

        var lhand = [landmarks[POSE_LANDMARKS.LEFT_INDEX].x * 1200, landmarks[POSE_LANDMARKS.LEFT_INDEX].y * 600]
        var lleg = [landmarks[POSE_LANDMARKS.LEFT_FOOT_INDEX].x * 1200, landmarks[POSE_LANDMARKS.LEFT_FOOT_INDEX].y * 600]
        var rhand = [landmarks[POSE_LANDMARKS.RIGHT_INDEX].x * 1200, landmarks[POSE_LANDMARKS.RIGHT_INDEX].y * 600]
        var rleg = [landmarks[POSE_LANDMARKS.RIGHT_FOOT_INDEX].x * 1200, landmarks[POSE_LANDMARKS.RIGHT_FOOT_INDEX].y * 600]

        if (framespeed % 30 == 0) {
          var pointno = Math.floor(Math.random() * circles.length)
          point = circles[pointno]

        }
        if (point[0] != 0 && point[1] != 0) {
          canvasCtx.beginPath()
          canvasCtx.arc(point[0], point[1], 25, 0, 2 * Math.PI);
          canvasCtx.fill()
          canvasCtx.stroke()
        }

        var d1 = find_distance(lhand, point)
        var d2 = find_distance(rhand, point)
        var d3 = find_distance(lleg, point)
        var d4 = find_distance(rleg, point)
        var mindist = Math.min(d1, d2, d3, d4)
        var s = 'lhand ' + lhand + ' rhand ' + rhand + ' lleg ' + lleg + ' rleg ' + rleg + ' circle ' + point
        //console.log(s)
        if (mindist == d1) console.log("rhand")
        else if (mindist == d2) console.log("lhand")
        else if (mindist == d3) console.log("rleg")
        else if (mindist == d4) console.log("lleg")
        console.log(mindist)
        if (mindist < 50) {
          lcounter++;
          rcounter++;
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

    } else { document.getElementById("backbone").innerHTML = "Please make your whole body visible"; }


  }
  else {
    document.getElementById("error").innerHTML = "please Stand back"
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

