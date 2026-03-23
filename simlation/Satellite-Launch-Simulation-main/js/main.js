import { checkSatelliteAlt, inputAltChange, convertNum, listBrowsing, makeStar } from "./functions.js"

export const planetList=$(".planetList")
export const scrollInput=$(".scrollBar input")
export const planetContainer = $(".planetContainer")
export const initAlt = $(".initAlt")
export const satellite=$("#satellite");
export const arrowDown = $(".arrowDown")
export const arrowUp = $(".arrowUp")
export const inputVelo = $('input[name="velo"]')
export const inputAlt = $('input[name="alt"]')
export const launchBtn = $(".launchBtn")
export const question = $(".questionSymbolHolder")
export const initSVG = $(".initSVG")
export const outOfRange = $(".outOfRange")

const left_right=$(".left, .right")
const scrollBar=$(".scrollBar")
const initVelo = $(".initVelo")
const instruction = $(".instruction")
const instructionBG = $(".instructionBG")

let changeRatio=1;
const px_km=63.78//1px=63.78km

export let px=px_km/changeRatio;
export let planetLi, planetImg, liBaseWidth, imgWidth, plWidth2, mass, saturn
export let raitio=[]


const clickPlanetList=(E,data)=>{
    const pName=E.closest(".planetLi").querySelector(".pName span").textContent

    if(pName=="Ceres" && inputAlt.val()>=500){
        inputAlt.val(500)
        inputAltChange(inputAlt.val())
    }
    
    mass=data[pName].mass*(10**data[pName].mass2)
    
    planetContainer.find("img").attr("src",data[pName].image)
    planetContainer.find("img").css("width",pName=="Saturn"?"211%":"120%")

    $(".planetName").html(E.closest(".planetLi").querySelector(".pName").innerHTML)
    $(".planetDescription").text(data[pName].description)
    $(".massSpan").text(Math.round(data[pName].mass*100)/100)
    $(".massSup").text(data[pName].mass2)
    $(".diaSpan").html(convertNum(data[pName].diameter))
}


question.on("click",()=>{
    instruction.css("top",`50%`)
    instruction.css("opacity",1)
    question.css("opacity",0)
    instructionBG.show()
    setTimeout(()=>{
        instructionBG.css("opacity",1)
    },0)
})


$(".close").on("click", ()=>{
    
    instruction.css("top",`-${window.innerHeight}px`)
    instruction.css("opacity",0)

    question.css("opacity",1)
    instructionBG.css("opacity",0)
    setTimeout(()=>{
        instructionBG.hide()
    },1000)
})


arrowDown.on("click",()=>{
    planetList.css("transitionDelay","0s")
    scrollBar.css("transitionDelay","0s")
    arrowUp.css("transitionDelay",".7s")
    planetList.css("top","40%")
    planetList.css("opacity",1)
    scrollInput.prop("disabled", false)
    scrollBar.css("opacity",1)
    arrowDown.css("opacity",0)
    arrowUp.css("opacity",1)
    arrowDown.css("z-index",0)
    satellite.css("transitionDelay","0s")
    planetContainer.css("transitionDelay","0s")
    satellite.css("opacity",0)
    planetContainer.css("opacity",0)

    left_right.each(function(){
        $(this).css("opacity",0)
        $(this).css("z-index",-1)
        $(this).css("transitionDelay","0s")
    })

    inputAlt.prop("disabled", true)
    inputVelo.prop("disabled", true)
    launchBtn.prop("disabled", true)
})

const listUp=()=>{
    arrowDown.css("transitionDelay",".7s")
    arrowUp.css("transitionDelay","0s")
    planetList.css("top","-200px")
    planetList.css("opacity",0)
    scrollInput.prop("disabled", true)
    scrollBar.css("opacity",0)
    arrowDown.css("opacity",1)
    arrowDown.css("z-index",2)
    arrowUp.css("opacity",0)
    satellite.css("opacity",1)
    planetContainer.css("opacity",1)
    
    left_right.each(function(){
        $(this).css("opacity",1)
        $(this).css("z-index",2)
    })

    inputAlt.prop("disabled", false)
    inputVelo.prop("disabled", false)
    launchBtn.prop("disabled", false)

    setTimeout(() => {
        arrowDown.css("transitionDelay","0s")
    }, 0);
}

arrowUp.on("click",()=>{
    listUp()
})


inputVelo.on("input", function(){
    if($(this).val()/2 || $(this).val()==0){
        $(".showInitVelo").text(parseInt($(this).val()).toLocaleString())
        initVelo.text(parseInt($(this).val()).toLocaleString())
    }
})


inputAlt.on("input", function(){
    const alt=$(this).val()
    if(!alt){
        alert("Please set valid altitude.")
    }else{
        inputAltChange(alt)
    }
})

////////////////////////// Main //////////////////////////
fetch("planets.json")
.then((data)=>{
    return data.json()
    })
.then((data)=>{

    Object.keys(data).forEach((val,key)=>{
        const img=data[val].symbol?`<img src="${data[val].symbol}"/>`:""
        planetList.append(`
            <li class='planetLi planetLi${key+1} ${val}'>
                <div class="planetContainerLi"></div>
                <div class="planetLiTop">
                    <div class="pName">
                        <span>${val}</span>
                        ${img}
                    </div>
                    <div class="grid">
                        <div class="gridLeft">Diameter:</div>
                        <div class="diameter">${convertNum(data[val].diameter)}</div>
                        <div class="gridLeft">Mass:</div>
                        <div>${(Math.round(data[val].mass*100))/100}×10<sup>${data[val].mass2}</sup>&nbsp;[kg]</div>
                    </div>
                </div>
                <img class="planetImg" src="${data[val].image}"/>
                <div class="forBoxShadow"></div>
            </li>
        `)
        
        key && raitio.push(data[val].diameter/data[Object.keys(data)[key-1]].diameter)

    })//Object.keys(data).forEach, creating list items
    
    planetLi=document.querySelectorAll(".planetLi")
    planetImg=document.querySelectorAll(".planetLi .planetImg")
    liBaseWidth=planetLi[0].getBoundingClientRect().width
    imgWidth=planetImg[0].getBoundingClientRect().width
    saturn=$(".planetLi.Saturn")
    plWidth2=+planetList.css("width").split("px")[0]-(liBaseWidth+planetLi[planetLi.length-1].getBoundingClientRect().width)/2

    scrollInput.on("input", function(){
        listBrowsing($(this).val(),null,data)
    })

    scrollInput.on("change", function(){
        listBrowsing($(this).val(),null,data)
    })

    planetLi.forEach(val=>{
        val.onclick=(e)=>{
            
            if(e.target.closest("li").classList[2]=="Sirius-B"){

                alert("Sorry, simulation is unavailable with Sirius-B because of its too massive property values.")
            
            }else{

                changeRatio=1/(data[val.querySelector(".pName").innerText].diameter/data["Earth"].diameter)
                px=px_km/changeRatio // Is this necessary?
                
                clickPlanetList(e.target,data)
    
                planetLi.forEach(val=>{
                    val.style.width=liBaseWidth+"px"
                    val.style.background="none"
                })
                
                const num=e.target.closest(".planetLi").classList[1].split("planetLi")[1]
                listBrowsing(null,num,data)
                
                scrollInput.val(scrollInput.attr("max")*(num-1)/(planetLi.length-1))
                const satelliteTop=window.innerHeight/2-planetContainer.css("height").split("px")[0]/2-changeRatio*parseInt(inputAlt.val())/px_km
                satellite.css("top",satelliteTop+"px")

                satelliteTop>0?outOfRange.hide():outOfRange.show()
                inputAlt.css("background-color",satelliteTop>0?"#FFFFFF":"#FF7171")
    
                planetList.css("transitionDelay",".5s")
                scrollBar.css("transitionDelay",".5s")
                satellite.css("transitionDelay",".7s, 0s")
                planetContainer.css("transitionDelay",".7s")
                
                left_right.each(function(){
                    $(this).css("transitionDelay",".7s")
                })
    
                listUp()
                checkSatelliteAlt(satelliteTop)
            }
        }
    })//planetLi.forEach, onclick

    ////////////////////////// Onload //////////////////////////
    
    listBrowsing(null,10,data)
    clickPlanetList(document.querySelector("li.Earth"),data)
    
    saturn.find(".planetImg").css("width","150%")
    saturn.css("width","535px")
    scrollInput.val(scrollInput.attr("max")*9/(planetLi.length-1))

})// End of fetch("planets.json")


////////////////////////// Onload //////////////////////////
instruction.css("top",`-${window.innerHeight}px`)
satellite.css("top",window.innerHeight/2-planetContainer.css("width").split("px")[0]/2-changeRatio*inputAlt.val()/px+"px")

makeStar(50, 2);
makeStar(100, 4);

initVelo.text(parseInt(inputVelo.val()).toLocaleString())
initAlt.text(parseInt(inputAlt.val()).toLocaleString())

const leftBox_left=left_right[0].getBoundingClientRect().left//20
const leftBox_top=left_right[0].getBoundingClientRect().top//depends on device
const leftBox_width=left_right[0].getBoundingClientRect().width//250

$(".initSVG .bgPath").attr("d",
`m0,0 h${window.innerWidth} v${window.innerHeight} h-${window.innerWidth}z
m${leftBox_left},${leftBox_top+1} h${leftBox_width} v158 h-${leftBox_width}z`
)

$(".initSVG text").attr("x",leftBox_left+leftBox_width+40)
$(".initSVG text").attr("y",leftBox_top+70)

$(".initSVG .arrowPath").each(function(){
    $(this).attr("d",
    `m${leftBox_left+leftBox_width+10},${leftBox_top+80} l 15 -10 h-10 l-15 10 h750 v-1 h-750`
    )
})

setTimeout(()=>initSVG.css("opacity",1),500)



