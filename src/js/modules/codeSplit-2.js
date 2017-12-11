const splitCode2 = (startTime, endTime, parentElement) => {
    const testDiv = document.createElement("div");
    testDiv.innerHTML = `Loaded Dynamic Module in ${endTime.getTime() - startTime.getTime()} ms`;
    document.getElementById(parentElement).appendChild(testDiv);
}

export default splitCode2;