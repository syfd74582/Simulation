import { planetContainer,initAlt,satellite,px, imgWidth,planetLi,planetList,liBaseWidth,raitio,planetImg,scrollInput,plWidth2,saturn,outOfRange,inputAlt } from "./main.js"

const innerScale = $(".innerScale")
const imgWidthPercent="84%"//Use the same value as CSS
const planetLiBGcolor1="none"// for testing purpose only
const planetLiBGcolor2="none"// for testing purpose only
const mddlWidth= +$(".middle").css("width").split("px")[0]


export const checkSatelliteAlt=(top)=>{
    $((".showInitParams")).css("top",top>=70 ? "-40px":"30px")
}


export const inputAltChange=(num)=>{
    
    const top=window.innerHeight/2-planetContainer.css("width").split("px")[0]/2-num/px
    satellite.css("top",top+"px")
    top>0?outOfRange.hide():outOfRange.show()
    inputAlt.css("background-color",top>0?"#FFFFFF":"#FF7171")
    $(".showInitAlt").text(parseInt(num).toLocaleString())
    initAlt.text(parseInt(num).toLocaleString())
    checkSatelliteAlt(top)
}


export const convertNum=(num)=>{
    return `${(Math.round(100*num/(10**(num.toString().length-1))))/100}x10<sup>${num.toString().length-1}</sup>&nbsp;[km]`
}


export const makeStar=(num, classNum)=>{
    for(let i=0; i<=num; i++){
        const randX=(Math.random()*97)
        const randY=(Math.random()*97)
        const shineIntvl=Math.random()*5+3
        const div='<div class="star'+classNum+' star" style="top:'+randY+'%; left:'+randX+'%; animation-duration: '+shineIntvl+'s"></div>'
        $("body").append(div)
    }
}


export const listBrowsing=(value, number, jsonData)=>{
    
    planetLi.forEach(val=>{
        val.style.outline="none"
        val.querySelector(".forBoxShadow").style.boxShadow="none"
    })

    if((value==0 && !number)||number==1){// Leftmost li
        
        planetList.css("left",(mddlWidth-liBaseWidth)/2+"px")
        planetLi[1].style.width=liBaseWidth*raitio[0]+"px"
        planetLi[2].style.width=planetLi[1].getBoundingClientRect().width*raitio[1]+"px"
        
        planetImg[0].style.width=imgWidthPercent
        planetImg[1].style.width=imgWidthPercent
        planetImg[2].style.width=imgWidthPercent
        planetLi[0].style.backgroundColor=planetLiBGcolor1// for testing purpose only
        planetLi[1].style.backgroundColor=planetLiBGcolor1// for testing purpose only
        planetLi[2].style.background="none"

        innerScale.html(planetLi[0].querySelector(".diameter").innerHTML)

    }else if((value==scrollInput.attr("max") && !number)||number==planetLi.length){// Rightmost li

        planetLi.forEach(val=> val.style.width=liBaseWidth+"px")

        planetList.css("left",(planetLi[planetLi.length-1].getBoundingClientRect().width+mddlWidth)/2-planetList.css("width").split("px")[0]+"px")
        planetLi[planetLi.length-1].style.backgroundColor=planetLiBGcolor1// for testing purpose only
        
        planetImg[planetLi.length-1].style.width=imgWidth+"px"
        planetImg[planetLi.length-2].style.width=imgWidth/raitio[planetLi.length-2]+"px"
        
        planetImg[planetLi.length-3].style.width=imgWidth/raitio[planetLi.length-2]/raitio[planetLi.length-3]+"px"
        planetLi[planetLi.length-3].style.background="none"
        
        planetImg[planetLi.length-4].style.width=imgWidth/raitio[planetLi.length-2]/raitio[planetLi.length-3]/raitio[planetLi.length-4]+"px"
        
        innerScale.html(planetLi[planetLi.length-1].querySelector(".diameter").innerHTML)

    }else{

        if(number){
            const left3=-liBaseWidth*number+mddlWidth/2+planetLi[number-1].getBoundingClientRect().width/2
            // planetList.style.left=
            planetList.css("left",left3+"px")
        }else{
            // planetList.style.left=(mddlWidth-liBaseWidth)/2-plWidth2*value/scrollInput.max+"px"
            planetList.css("left",(mddlWidth-liBaseWidth)/2-plWidth2*value/scrollInput.attr("max")+"px")
        }
        
        const widthSum=mddlWidth/2-(+planetList.css("left").split("px")[0])
        
        // let target=[]
        let bool=false
        planetLi.forEach((val,key)=>{
            if(!bool){

                let sum=0

                for(let i=0; i<=key; i++){
                    sum+=planetLi[i].getBoundingClientRect().width
                }

                if(widthSum<=sum-planetLi[key].getBoundingClientRect().width/2){
                    bool=true
                    // target=[key-1,key]
                    
                    sum-=planetLi[key].getBoundingClientRect().width + planetLi[key-1].getBoundingClientRect().width/2
                    
                    const Dis_2middles=(planetLi[key-1].getBoundingClientRect().width + planetLi[key].getBoundingClientRect().width)/2
                    const movingPx=-(+planetList.css("left").split("px")[0])+mddlWidth/2-sum
                    const percent=movingPx/Dis_2middles

                    const baseDis1=jsonData[planetLi[key-1].querySelector(".pName span").textContent].diameter
                    const baseDis2=jsonData[planetLi[key].querySelector(".pName span").textContent].diameter
                    const difference=baseDis2-baseDis1

                    innerScale.html(convertNum(Math.round(baseDis1+difference*percent)))
                    
                    planetLi[key].style.width=liBaseWidth*(1+(raitio[key-1]-1)*(1-percent))+"px"
                    planetImg[key].style.width=imgWidthPercent
                    planetLi[key].style.backgroundColor=planetLiBGcolor2

                    if(planetLi[key+1]){
                        planetLi[key+1].style.width=planetLi[key].getBoundingClientRect().width*raitio[key]+"px"
                        planetImg[key+1].style.width=imgWidthPercent
                        planetLi[key+1].style.background="none"
                    }
                    if(planetLi[key+2]){
                        planetLi[key+2].style.width=planetLi[key+1].getBoundingClientRect().width*raitio[key+1]+"px"
                        planetImg[key+2].style.width=imgWidthPercent
                        planetLi[key+2].style.background="none"
                    }
                    if(planetLi[key-1]){
                        planetImg[key-1].style.width=(imgWidth*(1-(1-1/raitio[key-1])*percent))+"px"
                        planetLi[key-1].style.backgroundColor=planetLiBGcolor2
                        planetLi[key-1].style.width=liBaseWidth+"px"
                    }
                    if(planetLi[key-2]){
                        planetImg[key-2].style.width=(imgWidth*(1-(1-1/raitio[key-1])*percent))/raitio[key-2]+"px"
                        planetLi[key-2].style.background="none"
                        planetLi[key-2].style.width=liBaseWidth+"px"
                    }
                    if(planetLi[key-3]){
                        planetImg[key-3].style.width=(imgWidth*(1-(1-1/raitio[key-1])*percent))/raitio[key-2]/raitio[key-3]+"px"
                        planetLi[key-3].style.width=liBaseWidth+"px"
                    }
                    if(planetLi[key-4]){
                        planetImg[key-4].style.width=(imgWidth*(1-(1-1/raitio[key-1])*percent))/raitio[key-2]/raitio[key-3]/raitio[key-4]+"px"
                        planetLi[key-4].style.width=liBaseWidth+"px"
                    }
                    if(
                        planetLi[key+2]?.classList[2]=="Saturn" ||
                        planetLi[key+1]?.classList[2]=="Saturn" ||
                        planetLi[key]?.classList[2]=="Saturn" ||
                        planetLi[key-1]?.classList[2]=="Saturn" ||
                        planetLi[key-2]?.classList[2]=="Saturn" ||
                        planetLi[key-3]?.classList[2]=="Saturn" ||
                        planetLi[key-4]?.classList[2]=="Saturn"
                        
                        ){
                        saturn.find(".planetImg").css("width",saturn.find(".planetImg").css("width").split("px")[0]*1.77+"px")
                        saturn.find(".planetLiTop").css("margin-bottom",saturn.find(".planetImg").css("height").split("px")[0]*1.07+"px")
                    }
                }
            }
        })
    }
    
    if(number){
        planetLi[number-1].style.outline="2px solid white"
        planetLi[number-1].querySelector(".forBoxShadow").style.boxShadow="inset 0 0 20px white, 0 0 30px white"
    }

}