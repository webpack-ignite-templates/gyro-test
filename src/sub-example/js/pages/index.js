/* eslint no-unused-vars: off */
import '../../../assets/scss/layout.scss'
import '../../../assets/scss/imageTests.scss'

const importTest = function(){
    const startTime = new Date;
    return import(/* webpackChunkName: "codeSplit-2" */ '../../../js/modules/codeSplit-2.js').then(codeSplit2 => {
        const endTime = new Date;
        codeSplit2.default(startTime, endTime, 'code-split-results');
    })
}

const button = document.getElementById('testButton');
button.addEventListener('click', ()=>{importTest()});