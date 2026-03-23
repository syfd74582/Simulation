import { mass, px, satellite, arrowDown, arrowUp, launchBtn, inputVelo, inputAlt, question, initSVG } from "./main.js"

const gravitySpan = $(".gravity")
const time = $(".time")
const launchDirectionImg = $(".launchDirectionImg")
const showInitParams = $(".showInitParams")
const abortBtn = $(".abortBtn")
const altSpan = $(".alt")

const center_x = window.innerWidth/2;//center coordinate of earth 350+110
const center_y =  window.innerHeight/2;//center coordinate of earth 150+110
const size = satellite.css("width").split("px")[0];//satelite size(px)
const radius = $(".planetContainer").css("width").split("px")[0]/2;//radius(px)

const G=6.67;//*10^-11

const historyCV = document.querySelector(".history"); //$(selector) doesn't work
historyCV.width = window.innerWidth;
historyCV.height = window.innerHeight;
const drawPath = historyCV.getContext("2d");

let history=[];
let launch
let ini_velo
let ini_alt

///////////////////////////  Onclick  ///////////////////////////
launchBtn.click(()=>{

    ini_velo=inputVelo.val()
    ini_alt=inputAlt.val()

    if(ini_alt<=0){

        alert("Please set a positive number to launch altitude.")

    }else{

        satellite.css("transitionProperty","none")
        inputVelo.attr("disabled",true)
        inputAlt.attr("disabled",true)
        launchBtn.attr("disabled",true)
        abortBtn.attr("disabled",false)

        launchDirectionImg.css("display", "none")
        showInitParams.css("display", "none")

        arrowDown.css("top","-60px")
        arrowUp.css("top","-60px")
        question.css("left","-50px")

        $(".rectSVG").css("opacity",0)
        $(".instructionSVG").css("opacity",0)

        initSVG.css("opacity",0)
        setTimeout(()=>initSVG.hide(),1000)

        // Keep variables below inside onclick function to initialize them everytime launch button is clicked
        
        let d_x;//storing current position tempolarily
        let d_y;//storing current position tempolarily
        let i=0;//counter
        
        let time_m;//i=30
        let time_h;
        let hour;
        let time_day;
    
        let dis_pre;//distance between center of earth and satellite in px
        let dis;//distance between center of earth and satellite
        
        let alt;
        
        let gravity;
        let approach;//aproach distance in one minute by gravity
        let revision;
        
        const alt_px=ini_alt/px;// Initial altitude in px

        let current_x=center_x;//initial position_x
        let current_y=center_y-radius-alt_px;//initial position_y

        satellite.offset({top: current_y-size/2, left: current_x-size/2});

        const x=ini_velo/1000;//km/s
        const move=(x*60)/px;//px
        let prev_x=current_x-move;
        let prev_y=current_y;
        history[0]=[current_x,current_y];
        
        // setInterval
        launch=setInterval(()=>{

            i+=1;
        
            time_m=String(i%60).padStart(2,"0");
            time_h=Math.floor(i/60);
        
            hour=time_h%24;
            time_day=Math.floor(time_h/24);
    
            if(!time_h){
                time.text(`${time_m} min`);
            }else if(!time_day && time_h){
                time.text(`${hour} hr ${time_m} min`);
            }else{
                time.text(`${time_day} day ${hour} hr ${time_m} min`);
            }
        
            d_x=current_x;
            d_y=current_y;
        
            current_x=2*current_x-prev_x;
            current_y=2*current_y-prev_y;
        
            prev_x=d_x;
            prev_y=d_y;
        
            dis_pre=Math.sqrt((current_x-center_x)**2+(current_y-center_y)**2);//distance between center of earth and satellite in px
            dis=dis_pre*px;//km
        
            ///////////// Revision /////////////
            gravity=mass*G/((10**17)*(dis**2));
            
            approach=gravity*60;//aproach distance in one minute by gravity
            revision=approach/(dis*(10**3));
        
            current_x+= (center_x-current_x)*revision;
            current_y+= (center_y-current_y)*revision;
        
            dis_pre=Math.sqrt((current_x-center_x)**2+(current_y-center_y)**2);//distance between center of earth and satellite in px
            dis=dis_pre*px;//km
            alt=dis-px*radius;//distance between surface of earth and satellite in km
        
            gravity=mass*G/((10**17)*(dis**2));
            gravitySpan.text(gravity.toFixed(2));
            altSpan.text(parseInt(alt).toLocaleString());
        
            satellite.offset({top:current_y-size/2,left:current_x-size/2});
        
            history[i]=[current_x,current_y];
            
            if(i%8==0){
                drawPath.beginPath();
                drawPath.moveTo(history[i-1][0], history[i-1][1]);
                drawPath.lineTo(history[i][0], history[i][1]);
                drawPath.lineWidth=0.5;
                drawPath.strokeStyle="white";
                drawPath.closePath();
                drawPath.stroke();
            }
            
            if(current_x<0 || current_x>window.innerWidth || current_y<0 || current_y>window.innerHeight){
                alert("Aborted: Satellite is out of range.")
                clearInterval(launch)
                Reset()
            }

            if(dis<=px*radius){

                altSpan.text(0);
                clearInterval(launch)
                
                setTimeout(()=>{
                    alert("Aborted: Satellite reached surface of the planet/star.")
                    Reset()
                },50)
            }
        },10);
    }
})// End of onclick

const Reset=()=>{
    satellite.offset({top: center_y-radius-ini_alt/px-size/2, left: center_x-size/2});
    drawPath.clearRect(0, 0, historyCV.width, historyCV.height);
    arrowDown.css("top","0")
    arrowUp.css("top","0")
    abortBtn.attr("disabled",true)
    launchDirectionImg.css("display", "flex")
    showInitParams.css("display", "block")
    launchBtn.attr("disabled",false)
    inputVelo.attr("disabled",false)
    inputAlt.attr("disabled",false)
    altSpan.text("-")
    time.text("-")
    gravitySpan.text("-");
    question.css("left","10px")

    setTimeout(()=>{
        satellite.css("transitionProperty","opacity, top")
    },0)
}

abortBtn.click(()=>{
    alert("Aborted")
    clearInterval(launch)
    Reset()
})