import 'assets/scss/layout.scss';
import 'assets/scss/imageTests.scss';

const importTest = function(){
    const startTime = new Date;
    return import(/* webpackChunkName: "codeSplit-1" */ 'js/modules/codeSplit-1.js').then(codeSplit1 => {
        const endTime = new Date;
        codeSplit1.default(startTime, endTime, 'code-split-results');
    })
}

const button = document.getElementById('testButton');
button.addEventListener('click', ()=>{importTest()});