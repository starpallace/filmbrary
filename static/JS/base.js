$("#YearRanger").slider({});

$("#RatingRanger").slider({});

const flms =document.getElementsByClassName('individual-ratings')
var sliderList = []
for (el = 0; el<flms.length; el++){
    const bage = (flms[el].id)
    const bagenum = "#".concat(bage)
    sliderList.push(bagenum)
    eval('var ' + bage + '=$(bagenum).bleeder({})');
    }   

    