const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.style.display = "none";
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

var pi = Math.PI;
var SQUAT = [[24,26],[26,28],[24,23],[23,25],[25,27]]
var stage="";
var counter1=0;
var counter2=0;
var status=0;


/**function to calculate angle */
function calculate_angle(x,y,z)
{
  var a=x;
  var b=y;
  var c=z;
  
  var radians= 
    Math.atan2(c[1]-b[1],c[0]-b[0])-Math.atan2(a[1]-b[1],a[0]-b[0]);
  var angle= radians * (180/pi)
  if(angle>180)
  {
    angle=360-angle;
  }

  return angle;
}


function find_distance(x, y) {
  return (Math.sqrt((x[1] - y[1]) ** 2 + (x[0] - y[0]) ** 2)) * 100;
}



function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.font = "15px serif"
  canvasCtx.fillStyle = "#00FF00";
  var landmarks = results.poseLandmarks;

  if(landmarks==null)
  { 
 
    document.getElementById("error").innerHTML ="Make yourself visible in front of the Camera";
    console.log("Make yourself visible in front of the Camera");
    status=1;

  }

  if(status==0)
  {
    document.getElementById("error").innerHTML ="";

  }




if(landmarks!=null)
{     // drawing landmarks only if landmarks are detected
  drawConnectors(canvasCtx, results.poseLandmarks, SQUAT,
    { color: '#FFFFFF', lineWidth: 4 });
    var custom_landmarks = [results.poseLandmarks[23], results.poseLandmarks[24], results.poseLandmarks[25], results.poseLandmarks[26], results.poseLandmarks[27], results.poseLandmarks[28]]
  drawLandmarks(canvasCtx, custom_landmarks,
    { color: '#000000', lineWidth: 2 });
  // drawing landmarks only if landmarks are detected 
  status=0;

  /**LEFT SIDE OF THE BODY */
  var lshoulder=[landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x,landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y]
  var lelbow=[landmarks[POSE_LANDMARKS.LEFT_ELBOW].x,landmarks[POSE_LANDMARKS.LEFT_ELBOW].y]
  var lwrist=[landmarks[POSE_LANDMARKS.LEFT_WRIST].x,landmarks[POSE_LANDMARKS.LEFT_WRIST].y]
  var lhip=[landmarks[POSE_LANDMARKS.LEFT_HIP].x,landmarks[POSE_LANDMARKS.LEFT_HIP].y]
  var lknee=[landmarks[POSE_LANDMARKS.LEFT_KNEE].x,landmarks[POSE_LANDMARKS.LEFT_KNEE].y]
  var lankle=[landmarks[POSE_LANDMARKS.LEFT_ANKLE].x,landmarks[POSE_LANDMARKS.LEFT_ANKLE].y]

  /**RIGHT SIDE OF THE BODY */
  var rshoulder=[landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].x,landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y]
  var relbow=[landmarks[POSE_LANDMARKS.RIGHT_ELBOW].x,landmarks[POSE_LANDMARKS.RIGHT_ELBOW].y]
  var rwrist=[landmarks[POSE_LANDMARKS.RIGHT_WRIST].x,landmarks[POSE_LANDMARKS.RIGHT_WRIST].y]
  var rhip=[landmarks[POSE_LANDMARKS.RIGHT_HIP].x,landmarks[POSE_LANDMARKS.RIGHT_HIP].y]
  var rknee=[landmarks[POSE_LANDMARKS.RIGHT_KNEE].x,landmarks[POSE_LANDMARKS.RIGHT_KNEE].y]
  var rankle=[landmarks[POSE_LANDMARKS.RIGHT_ANKLE].x,landmarks[POSE_LANDMARKS.RIGHT_ANKLE].y]


  /** NOSE */
  var nose=[landmarks[POSE_LANDMARKS.NOSE].x,landmarks[POSE_LANDMARKS.NOSE].y]



  /**CUSTOM KEYPOINTS  HIP CENETER AND SHOULDER CENTER*/
  var hc=[(rhip[0]+lhip[0])/2,(rhip[1]+lhip[1])/2]
  var sc=[(rshoulder[0]+lshoulder[0])/2,(rshoulder[1]+lshoulder[1])/2]



  /** ANGLES CALCULATION */
  var lSEW=Math.abs(Math.round(calculate_angle(lshoulder,lelbow,lwrist)))
  var lESH=Math.abs(Math.round(calculate_angle(lelbow,lshoulder,lhip)))
  var lSHK=Math.abs(Math.round(calculate_angle(lshoulder,lhip,lknee)))
  var lHKA=Math.abs(Math.round(calculate_angle(lhip,lknee,lankle)))
  var rSEW=Math.abs(Math.round(calculate_angle(rshoulder,relbow,rwrist)))
  var rESH=Math.abs(Math.round(calculate_angle(relbow,rshoulder,rhip)))
  var rSHK=Math.abs(Math.round(calculate_angle(rshoulder,rhip,rknee)))
  var rHKA=Math.abs(Math.round(calculate_angle(rhip,rknee,rankle)))
  var cent=  Math.abs(Math.round(calculate_angle(rknee, hc, lknee)))

  /**CUSTOM KEYPOINTS ANGLE */
  var rNNS=Math.abs(Math.round(calculate_angle(nose,sc,rshoulder))) //NOSE NECK SHOULDER RIGHT
  var lNNS=Math.abs(Math.round(calculate_angle(nose,sc,lshoulder))) //NOSE NECK SHOULDER LEFT
   

  var rNPH=Math.abs(Math.round(calculate_angle(sc,hc,rhip))) //NECK PELVIC HIP RIGHT
  var lNPH=Math.abs(Math.round(calculate_angle(sc,hc,lhip))) //NECK PELVIC HIP LEFT

  var NNP=Math.abs(Math.round(calculate_angle(nose,sc,hc))) //NOSE NECK PELVIC

  canvasCtx.restore();


  /**BICEP CURL COUNTER */

  var distance = find_distance(rshoulder, lshoulder)
   console.log('Distance', distance);



    /**SQUAT CURL COUNTER */
    if (distance > 5 && distance < 16) {

    
        document.getElementById("backbone").innerHTML = "";
        if (lHKA > 160 && rHKA > 160 && lSHK>160 && rSHK>160) {
          stage = "down";
        }
        if (lHKA < 140 && rHKA < 140 && lSHK<130 && rSHK<130 && stage == "down") {
          stage = "up";
          counter1 += 1;
          counter2 += 1;
        }


        console.log(counter1);
        document.getElementById("counter1").innerHTML = counter1;
        document.getElementById("counter2").innerHTML = counter2;
      }
      
    
    else {
      document.getElementById("backbone").innerHTML = "Please make your whole body visible";
    }

  

// canvasCtx.fillText(lSEW, lelbow[0] * 1201, lelbow[1] * 601)
// canvasCtx.fillText(rSEW, relbow[0] * 1201, relbow[1] * 601)
// canvasCtx.fillText(lESH, lshoulder[0] * 1201, lshoulder[1] * 601)
// canvasCtx.fillText(rESH, rshoulder[0] * 1201, rshoulder[1] * 601)
// canvasCtx.fillText(lSHK, lhip[0]*1201, lhip[1]*601)
// canvasCtx.fillText(rSHK, rhip[0]*1201, rhip[1]*601)
// canvasCtx.fillText(lHKA, lknee[0]*1201,lknee[1]*601)
// canvasCtx.fillText(rHKA, rknee[0]*1201,rknee[1]*601)
// canvasCtx.fillText("lNNS"+lNNS,10,110)
// canvasCtx.fillText("rNNS"+rNNS,10,130)
// canvasCtx.fillText("lNPH"+lNPH, 10, 150)
// canvasCtx.fillText("rNPH"+rNPH, 10, 170)
// canvasCtx.fillText("NNP"+NNP, 10, 190)


  
  /** BACKBONE */
  // canvasCtx.beginPath();
  // canvasCtx.moveTo(sc[0]*1200,sc[1]*600);
  // canvasCtx.lineTo(hc[0]*1200,hc[1]*600); 
  // canvasCtx.strokeStyle = '#ffffff';
  // canvasCtx.lineWidth = 5;
  // canvasCtx.stroke();


  /** NOSE TO NECK */
  // canvasCtx.beginPath();
  // canvasCtx.moveTo(nose[0]*1200,nose[1]*600);
  // canvasCtx.lineTo(sc[0]*1200,sc[1]*600); 
  // canvasCtx.strokeStyle = '#ffffff';
  // canvasCtx.lineWidth = 5;
  // canvasCtx.stroke();
  
  // console.log(POSE_CONNECTIONS)


}
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

