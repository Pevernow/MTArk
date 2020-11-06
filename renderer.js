// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
/**
 * @param  {} size     : int        the rect clip width of the loding svg
 * @param  {} dotsize  : int        the r of a loading dot
 * @param  {} dotcolor : "#xxxxxx"  the color of the dot
 */
CreateLodingRing = function (size, dotsize, dotcolor) {
    //#region Create Element
    var ring = Object();

    let loadingring = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    loadingring.id = "winloding";
    loadingring.setAttribute("viewBox", "0 0" + " " + size + " " + size);
    loadingring.setAttribute("width", "10%")
    loadingring.setAttribute("height", "10%")
    loadingring.style.right = "2%";
    loadingring.style.bottom = "2%";
    loadingring.style.position = "absolute";
    for (let i = 0; i < 6; i++) {
        let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.style.transformOrigin = "center center";
        dot.style.opacity = 0;
        dot.setAttribute("class", "d" + (i + 1));
        dot.setAttribute("fill", dotcolor);
        dot.setAttribute("cx", size / 2);
        dot.setAttribute("cy", dotsize + 2);
        dot.setAttribute("r", dotsize);
        loadingring.appendChild(dot);
    }
    document.body.appendChild(loadingring);
    console.log(loadingring);

    //#endregion
    var tl = anime.timeline({
        loop: true
    });

    for (let i = 0; i < 6; i++) {
        let basevalue = -110 - 6 * i;

        tl.add(
            {
                targets: "#winloding .d" + (i + 1),
                rotate: [
                    { value: basevalue, duration: 0, easing: "cubicBezier(0.13,0.21,0.1,0.7)" },
                    { value: basevalue + 120, duration: 433, easing: "cubicBezier(0.02,0.33,0.38,0.77)" },
                    { value: basevalue + 203, duration: 767, easing: "linear" },
                    { value: basevalue + 315, duration: 417, easing: "cubicBezier(0.57,0.17,0.95,0.75)" },
                    { value: basevalue + 467, duration: 400, easing: "cubicBezier(0,0.19,0.07,0.72)" },
                    { value: basevalue + 549, duration: 766, easing: "linear" },
                    { value: basevalue + 695, duration: 434, easing: "cubicBezier(0,0,0.95,0.37)" }
                ],
                opacity: [
                    { value: 1, duration: 1, easing: "linear" },
                    { value: 1, duration: 3210, easing: "linear" },
                    { value: 0, duration: 10, easing: "linear" },
                    { value: 0, duration: 260, easing: "linear" }
                ]
            },
            167 * i
        );
    }

    ring.timeline = tl;
    ring.svgitem = loadingring;

    return ring;
}