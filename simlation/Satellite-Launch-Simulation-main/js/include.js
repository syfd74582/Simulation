document.write(`

    <p>This is a numerical satellite-launch simulation built based on the below formula for gravity.</p>

    <div class='parentFlex'>
        <div class='formulaFlex'>

            <div>g =</div>
            <div>
                <div class="MG">MG</div>
                <div>R<sup>2</sup></div>
            
            </div>
            <div>[m<sup>1</sup>s<sup>-2</sup>]</div>

        </div>

        <div class='params'>
            <div>M: Planet mass [kg]</div>
            <div>R: Distance between planet and satellite [km]</div>
            <div>G: Gravitational Constant 6.67x10<sup>-11</sup> [m<sup>3</sup>kg<sup>-1</sup>s<sup>-2</sup>]</div>
        </div>

    </div>

    <p>Newton's law of universal gravitation says that 2 different objects attract each other with a force F shown below.</p>

    <div class='parentFlex'>

        <div class='formulaFlex'>

            <div>F = G</div>
            <div>
                <div class="MG">m<sub>1</sub>m<sub>2</sub></div>
                <div>r<sup>2</sup></div>
            
            </div>
            
            <div>[m<sup>1</sup>s<sup>-2</sup>]</div>

        </div>

        <div class='params'>
            <div>m: Mass [kg]</div>
            <div>r: Distance between objects [km]</div>
            <div>G: Gravitational Constant 6.67x10<sup>-11</sup> [m<sup>3</sup>kg<sup>-1</sup>s<sup>-2</sup>]</div>
        </div>
        
    </div>

    <p>It is applicable to a planet and satellite travelling around the planet too. In that case, the satellite's mass is usually ignored since it is way too small
    compared to the planet's, and that is how the formula for gravity above is calclated.</p>
`)


