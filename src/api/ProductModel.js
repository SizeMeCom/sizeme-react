import i18n from "i18next";
import Optional from "optional-js";

const fitStep = 55;
const norm = 1000;

const DEFAULT_OPTIMAL_FIT = 1070;
const DEFAULT_OPTIMAL_STRETCH = 5;

let fitRecommendation;
let optimalStretch = DEFAULT_OPTIMAL_STRETCH;

const fitLabelsAndColors = [
  { label: "too_small", arrowColor: "#BB5555" },
  { label: "slim", arrowColor: "#457A4C" },
  { label: "regular", arrowColor: "#42AE49" },
  { label: "loose", arrowColor: "#87B98E" },
  { label: "too_big", arrowColor: "#BB5555" },
];

class FitRange {
  constructor(label, start, end, arrowColor) {
    this.label = label;
    this.start = start;
    this.end = end;
    this.arrowColor = arrowColor;
  }

  matches(value) {
    return value >= this.start && (!this.end || value < this.end);
  }
}

const fitRanges = fitLabelsAndColors.map((l, i) => {
  const start = (i - 1) * fitStep + norm;
  const end = start + fitStep;
  return new FitRange(l.label, start, end, l.arrowColor);
});

const subRange = new FitRange("too_small", null, fitRanges[0].start, "#999999");
const superRange = new FitRange("too_big", fitRanges.slice(-1).end, null, "#BB5555");

const pinchedFits = [
  "chest",
  "underbust",
  "waist",
  "pant_waist",
  "hips",
  "thigh_width",
  "knee_width",
  "calf_width",
  "pant_sleeve_width",
  "neck_opening_width",
  "sleeve_top_width",
  "sleeve_top_opening",
  "wrist_width",
];

const longFits = ["inseam", "outseam", "sleeve", "front_height"];

const fitOrder = [
  "chest",
  "underbust",
  "waist",
  "pant_waist",
  "hips",
  "inseam",
  "outseam",
  "thigh_width",
  "knee_width",
  "calf_width",
  "pant_sleeve_width",
  "neck_opening_width",
  "shoulder_width",
  "sleeve_top_width",
  "sleeve_top_opening",
  "sleeve",
  "wrist_width",
  "front_height",
  "shoe_inside_length",
  "shoe_inside_width",
  "hat_width",
  "hood_height",
];

const humanMeasurementMap = new Map([
  ["sleeve", "sleeve"],
  ["chest", "chest"],
  ["underbust", "underbust"],
  ["waist", "shirtWaist"],
  ["neck_opening_width", "neckCircumference"],
  ["front_height", "frontHeight"],
  ["pant_waist", "pantWaist"],
  ["hips", "hips"],
  ["outseam", "outSeam"],
  ["thigh_width", "thighCircumference"],
  ["knee_width", "kneeCircumference"],
  ["calf_width", "calfCircumference"],
  ["pant_sleeve_width", "ankleCircumference"],
  ["shoe_inside_length", "footLength"],
  ["hat_width", "headCircumference"],
]);

function isInMeas(meas, thisMeas) {
  if (typeof meas !== "object") {
    return false;
  }
  if (meas.length === 0) {
    return false;
  }
  return (
    Object.values(meas).filter((obj) => {
      return parseInt(obj[thisMeas] ?? null) > 0;
    }).length > 0
  );
}

function getEssentialMeasurements(itemTypeArr, meas) {
  // returns essentials and required measurements for the item type
  const essentials = [];
  const required = [];
  switch (itemTypeArr[0]) {
    case 1:
      if (isInMeas(meas, "chest")) {
        essentials.push("chest");
        required.push("chest");
      }
      if (itemTypeArr[5] >= 4 && itemTypeArr[6] !== 3 && itemTypeArr[6] !== 6) {
        if (isInMeas(meas, "hips")) {
          essentials.push("hips");
        }
      }
      if (itemTypeArr[3] === 6 && itemTypeArr[2] === 1) {
        if (isInMeas(meas, "sleeve")) {
          essentials.push("sleeve");
        }
      }
      if (essentials.length < 3 && itemTypeArr[5] >= 3) {
        if (isInMeas(meas, "waist")) {
          essentials.splice(1, 0, "waist"); // stick this sucker in the second slot
          required.push("waist");
        }
      }
      if (essentials.length < 3 && itemTypeArr[5] === 3) {
        if (isInMeas(meas, "front_height")) {
          essentials.push("front_height");
        }
      }
      if (essentials.length < 3 && itemTypeArr[1] === 2) {
        if (isInMeas(meas, "neck_opening_width")) {
          essentials.push("neck_opening_width");
        }
      }
      if (essentials.length < 3) {
        if (isInMeas(meas, "underbust")) {
          essentials.push("underbust");
          required.push("underbust");
        }
      }
      break;

    case 2:
      if (isInMeas(meas, "pant_waist")) {
        essentials.push("pant_waist");
      }
      if (isInMeas(meas, "hips")) {
        essentials.push("hips");
        required.push("hips");
      }
      if (itemTypeArr[3] >= 6) {
        if (isInMeas(meas, "outseam")) {
          essentials.push("outseam");
        }
      }
      break;

    case 3:
      if (isInMeas(meas, "shoe_inside_length")) {
        essentials.push("shoe_inside_length");
        required.push("shoe_inside_length");
      }
      if (itemTypeArr[3] > 6) {
        if (isInMeas(meas, "calf_width")) {
          essentials.push("calf_width");
        }
      }
      if (itemTypeArr[3] > 7) {
        if (isInMeas(meas, "knee_width")) {
          essentials.push("knee_width");
        }
      }
      break;

    case 4:
      if (isInMeas(meas, "hat_width")) {
        essentials.push("hat_width");
        required.push("hat_width");
      }
      break;

    case 5:
      if (isInMeas(meas, "chest")) {
        essentials.push("chest");
        required.push("chest");
      }
      if (itemTypeArr[3] >= 6 && itemTypeArr[2] === 1 && isInMeas(meas, "sleeve")) {
        essentials.push("sleeve");
        if (isInMeas(meas, "hips")) {
          essentials.push("hips");
        }
      }
      if (essentials.length < 3) {
        if (isInMeas(meas, "waist")) {
          essentials.push("waist");
          required.push("waist");
        } else if (isInMeas(meas, "pant_waist")) {
          essentials.push("pant_waist");
        }
      }
      if (essentials.length < 3) {
        if (isInMeas(meas, "hips")) {
          essentials.push("hips");
        }
      }
      break;

    case 6:
      if (isInMeas(meas, "chest")) {
        essentials.push("chest");
        required.push("chest");
      }
      if (itemTypeArr[3] >= 6 && itemTypeArr[2] === 1) {
        if (isInMeas(meas, "sleeve")) {
          essentials.push("sleeve");
        }
      } else {
        if (isInMeas(meas, "front_height")) {
          essentials.push("front_height");
        }
      }
      if (itemTypeArr[5] >= 6) {
        if (isInMeas(meas, "outseam")) {
          essentials.push("outseam");
        }
      }
      if (essentials.length < 3) {
        if (isInMeas(meas, "pant_waist")) {
          essentials.push("pant_waist");
        }
      }
      if (essentials.length < 3) {
        if (isInMeas(meas, "hips")) {
          essentials.push("hips");
        }
      }
      break;
  }

  return { essentials, required };
}

function init(itemTypeArr) {
  const arrows = {};
  const itemDrawing = {};

  arrows.chest = {
    mirror: false,
    coords: [
      { X: -250, Y: 399 },
      { X: 250, Y: 399 },
    ],
    lift: false,
  };
  arrows.underbust = {
    mirror: false,
    coords: [
      { X: -250, Y: 499 },
      { X: 250, Y: 499 },
    ],
    lift: false,
  };
  arrows.waist = {
    mirror: false,
    coords: [
      { X: -250, Y: 689 },
      { X: 250, Y: 689 },
    ],
    lift: false,
  };
  arrows.front_height = {
    mirror: false,
    coords: [
      { X: -174, Y: 0 },
      { X: -174, Y: 978 },
    ],
    style: "line",
    lift: false,
  };
  arrows.neck_opening_width = {
    mirror: false,
    coords: [
      { X: 0, Y: 47 },
      { X: 174, Y: 0, cp1X: 65, cp1Y: 45, cp2X: 140, cp2Y: 23 },
      { X: 0, Y: 100, cp1X: 150, cp1Y: 46, cp2X: 50, cp2Y: 92 },
      { X: -174, Y: 0, cp1X: -50, cp1Y: 92, cp2X: -150, cp2Y: 46 },
      { X: 0, Y: 47, cp1X: -140, cp1Y: 23, cp2X: -65, cp2Y: 45 },
    ],
    style: "line",
    lift: true,
  };

  arrows.hood_height = {
    mirror: false,
    coords: [
      { X: 195, Y: -5 },
      { X: 195, Y: -390 },
    ],
    style: "line",
    lift: false,
  };
  arrows.shoulder_width = {
    mirror: false,
    coords: [
      { X: -329, Y: 42 },
      { X: -164, Y: -7 },
    ],
    style: "line",
    lift: true,
  };

  arrows.pant_waist = {
    mirror: false,
    coords: [
      { X: -232, Y: 0 },
      { X: 222, Y: 0 },
    ],
    lift: true,
  };
  arrows.hips = {
    mirror: false,
    coords: [
      { X: -250, Y: 170 },
      { X: 250, Y: 170 },
    ],
    lift: false,
  };
  arrows.outseam = {
    mirror: false,
    coords: [
      { X: 222, Y: 0 },
      { X: 263, Y: 171 },
      { X: 302, Y: 1071 },
    ],
    style: "line",
    lift: true,
  };
  arrows.inseam = {
    mirror: false,
    coords: [
      { X: 5, Y: 297 },
      { X: 151, Y: 1084 },
    ],
    style: "line",
    lift: false,
  };
  arrows.thigh_width = {
    mirror: false,
    coords: [
      { X: -256, Y: 274 },
      { X: -17, Y: 297 },
    ],
    lift: false,
  };
  arrows.knee_width = {
    mirror: false,
    coords: [
      { X: -276, Y: 727 },
      { X: -96, Y: 744 },
    ],
    lift: false,
  };
  arrows.pant_sleeve_width = {
    mirror: false,
    coords: [
      { X: -301, Y: 1071 },
      { X: -152, Y: 1084 },
    ],
    lift: false,
  };
  arrows.calf_width = {
    mirror: false,
    coords: [
      { X: 40, Y: 784 },
      { X: 280, Y: 784 },
    ],
    style: "line",
    lift: false,
  };

  arrows.shoe_inside_length = {
    mirror: false,
    coords: [
      { X: 169, Y: 984 },
      { X: 132, Y: 18 },
    ],
    style: "line",
    lift: false,
  };

  arrows.hat_width = {
    mirror: false,
    coords: [
      { X: 534, Y: 238 },
      { X: 539, Y: 265, cp1X: 559, cp1Y: 236, cp2X: 567, cp2Y: 252 },
      { X: 70, Y: 262, cp1X: 352, cp1Y: 353, cp2X: 223, cp2Y: 351 },
      { X: 77, Y: 242, cp1X: 38, cp1Y: 241, cp2X: 60, cp2Y: 234 },
    ],
    midCircle: { X: 300, Y: 325 },
    style: "line",
    lift: false,
  };

  itemDrawing.mirror = true;
  itemDrawing.coords = [];
  itemDrawing.accents = [];
  // load item drawing
  switch (itemTypeArr[0]) {
    case 1: // shirts/coats
    case 5: // overalls: start with normal top
    case 6: // top/bottom combined: also start with normal top
      switch (
        itemTypeArr[1] // collar
      ) {
        case 2: // tight (turnover)
          itemDrawing.coords.push(
            { X: 0, Y: -60 },
            {
              X: 119,
              Y: -48,
              cp1X: 68,
              cp1Y: -60,
              cp2X: 106,
              cp2Y: -57,
            },
            { X: 128, Y: 0 }
          );
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: -47 },
              { X: 100, Y: -35, cp1X: 64, cp1Y: -48, cp2X: 105, cp2Y: -47 },
              { X: -5, Y: 59, cp1X: 66, cp1Y: 8, cp2X: 6, cp2Y: 40 },
              { X: -104, Y: -34, cp1X: -25, cp1Y: 32, cp2X: -93, cp2Y: -12 },
              { X: 0, Y: -46, cp1X: -117, cp1Y: -48, cp2X: -52, cp2Y: -48 },
            ],
            noMirror: true,
          });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 129, Y: 0 },
              { X: 136, Y: 26, cp1X: 132, cp1Y: 14, cp2X: 133, cp2Y: 18 },
              { X: 78, Y: 125, cp1X: 123, cp1Y: 63, cp2X: 100, cp2Y: 95 },
              { X: 37, Y: 78, cp1X: 60, cp1Y: 106, cp2X: 51, cp2Y: 101 },
              { X: -12, Y: 111, cp1X: 24, cp1Y: 8, cp2X: -32, cp2Y: 66 },
            ],
            noMirror: true,
          }); // non mirrored turnover collar right
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: -129, Y: 0 },
              { X: -136, Y: 26, cp1X: -132, cp1Y: 14, cp2X: -133, cp2Y: 18 },
              { X: -90, Y: 127, cp1X: -127, cp1Y: 68, cp2X: -106, cp2Y: 110 },
              { X: -9, Y: 59, cp1X: -33, cp1Y: 88, cp2X: -61, cp2Y: 25 },
            ],
            noMirror: true,
          }); // non mirrored turnover collar left
          itemDrawing.accents.push({ type: "circle", coords: [{ X: 0, Y: 100, R: 5 }] });
          arrows.neck_opening_width = {
            mirror: false,
            coords: [
              { X: 0, Y: -47 },
              { X: 100, Y: -35, cp1X: 64, cp1Y: -48, cp2X: 105, cp2Y: -47 },
              { X: -5, Y: 59, cp1X: 66, cp1Y: 8, cp2X: 6, cp2Y: 40 },
              {
                X: -104,
                Y: -34,
                cp1X: -25,
                cp1Y: 32,
                cp2X: -93,
                cp2Y: -12,
              },
              { X: 0, Y: -46, cp1X: -117, cp1Y: -48, cp2X: -52, cp2Y: -48 },
            ],
            style: "line",
            lift: false,
            midCircle: { X: 0, Y: -47 },
          };
          arrows.shoulder_width = {
            mirror: false,
            coords: [
              { X: -329, Y: 49 },
              { X: -129, Y: -5 },
            ],
            style: "line",
            lift: true,
          };
          arrows.front_height = {
            mirror: false,
            coords: [
              { X: -167, Y: -4 },
              { X: -167, Y: 978 },
            ],
            style: "line",
            lift: false,
          };
          break;
        case 3: // hood
          itemDrawing.coords.push(
            { X: 0, Y: -390 },
            {
              X: 185,
              Y: 6,
              cp1X: 180,
              cp1Y: -400,
              cp2X: 160,
              cp2Y: -20,
            }
          );
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 185, Y: 6 },
              { X: 0, Y: 123, cp1X: 140, cp1Y: 70, cp2X: 70, cp2Y: 100 },
            ],
          }); // basic round collar line
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: -320 },
              {
                X: 144,
                Y: 0,
                cp1X: 150,
                cp1Y: -320,
                cp2X: 140,
                cp2Y: -20,
              },
              { X: 0, Y: 100, cp1X: 140, cp1Y: 46, cp2X: 40, cp2Y: 92 },
            ],
          }); // hood area
          arrows.shoulder_width = {
            mirror: false,
            coords: [
              { X: -329, Y: 42 },
              { X: -174, Y: -7 },
            ],
            style: "line",
            lift: true,
          };
          break;
        case 4: // lifted
          itemDrawing.coords.push(
            { X: 0, Y: -60 },
            {
              X: 119,
              Y: -48,
              cp1X: 68,
              cp1Y: -60,
              cp2X: 106,
              cp2Y: -57,
            },
            { X: 128, Y: 0 }
          );
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: -47 },
              { X: 104, Y: -34, cp1X: 64, cp1Y: -47, cp2X: 84, cp2Y: -47 },
              { X: 0, Y: 0, cp1X: 94, cp1Y: -20, cp2X: 64, cp2Y: 0 },
            ],
          });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 129, Y: 0 },
              { X: 136, Y: 26, cp1X: 132, cp1Y: 14, cp2X: 133, cp2Y: 18 },
              { X: 0, Y: 85, cp1X: 123, cp1Y: 43, cp2X: 100, cp2Y: 85 },
            ],
          });
          arrows.neck_opening_width = {
            mirror: false,
            coords: [
              { X: 0, Y: -47 },
              { X: 100, Y: -35, cp1X: 64, cp1Y: -48, cp2X: 105, cp2Y: -47 },
              { X: -5, Y: 59, cp1X: 66, cp1Y: 8, cp2X: 6, cp2Y: 40 },
              {
                X: -104,
                Y: -34,
                cp1X: -25,
                cp1Y: 32,
                cp2X: -93,
                cp2Y: -12,
              },
              { X: 0, Y: -46, cp1X: -117, cp1Y: -48, cp2X: -52, cp2Y: -48 },
            ],
            style: "line",
            lift: false,
            midCircle: { X: 0, Y: -47 },
          };
          arrows.shoulder_width = {
            mirror: false,
            coords: [
              { X: -329, Y: 49 },
              { X: -129, Y: -5 },
            ],
            style: "line",
            lift: true,
          };
          arrows.front_height = {
            mirror: false,
            coords: [
              { X: -167, Y: -4 },
              { X: -167, Y: 978 },
            ],
            style: "line",
            lift: false,
          };
          break;

        case 5: // open high round
          itemDrawing.coords.push({ X: 0, Y: 90 }, { X: 189, Y: 0 });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 210, Y: 6 },
              { X: 0, Y: 123, cp1X: 165, cp1Y: 70, cp2X: 100, cp2Y: 123 },
            ],
          }); // open round collar line
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: 49 },
              { X: 189, Y: 0, cp1X: 100, cp1Y: 47, cp2X: 155, cp2Y: 23 },
              {
                X: 0,
                Y: 102,
                cp1X: 165,
                cp1Y: 46,
                cp2X: 95,
                cp2Y: 102,
              },
            ],
          }); // open collar area
          break;
        case 6: // open low round
          itemDrawing.coords.push({ X: 0, Y: 180 }, { X: 114, Y: 130 }, { X: 164, Y: 0 });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 181, Y: 5 },
              { X: 0, Y: 196, cp1X: 146, cp1Y: 196, cp2X: 50, cp2Y: 196 },
            ],
          }); // collar line
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: 117 },
              { X: 164, Y: 0, cp1X: 55, cp1Y: 115, cp2X: 130, cp2Y: 103 },
              {
                X: 0,
                Y: 180,
                cp1X: 130,
                cp1Y: 180,
                cp2X: 45,
                cp2Y: 180,
              },
            ],
          }); // basic area
          break;
        case 7: // v-style high
          itemDrawing.coords.push({ X: 0, Y: 90 }, { X: 189, Y: 0 });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 210, Y: 6 },
              { X: 0, Y: 123, cp1X: 165, cp1Y: 70, cp2X: 80, cp2Y: 100 },
            ],
          }); // open round collar line
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: 47 },
              { X: 189, Y: 0, cp1X: 80, cp1Y: 45, cp2X: 155, cp2Y: 23 },
              {
                X: 0,
                Y: 100,
                cp1X: 165,
                cp1Y: 46,
                cp2X: 65,
                cp2Y: 92,
              },
            ],
          }); // open collar area
          break;
        case 8: // v-style low
          itemDrawing.coords.push({ X: 0, Y: 90 }, { X: 189, Y: 0 });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 210, Y: 6 },
              { X: 0, Y: 123, cp1X: 165, cp1Y: 70, cp2X: 80, cp2Y: 100 },
            ],
          }); // open round collar line
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: 47 },
              { X: 189, Y: 0, cp1X: 80, cp1Y: 45, cp2X: 155, cp2Y: 23 },
              {
                X: 0,
                Y: 100,
                cp1X: 165,
                cp1Y: 46,
                cp2X: 65,
                cp2Y: 92,
              },
            ],
          }); // open collar area
          break;
        case 9: // cut with turned collar
        case 10: // deep cut with turned collar (legacy support)
          itemDrawing.coords.push(
            { X: 0, Y: -60 },
            {
              X: 119,
              Y: -48,
              cp1X: 68,
              cp1Y: -60,
              cp2X: 106,
              cp2Y: -57,
            },
            { X: 128, Y: 0 }
          );
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: -47 },
              { X: 100, Y: -35, cp1X: 64, cp1Y: -48, cp2X: 105, cp2Y: -47 },
              { X: 0, Y: 209, cp1X: 66, cp1Y: 8, cp2X: 0, cp2Y: 209 },
            ],
          });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 129, Y: 0 },
              { X: 146, Y: 46, cp1X: 132, cp1Y: 14, cp2X: 143, cp2Y: 48 },
              { X: 94, Y: 125 },
              { X: 54, Y: 135 },
              { X: 100, Y: 206 },
              { X: 30, Y: 346 },
            ],
          });
          arrows.neck_opening_width = {
            mirror: false,
            coords: [
              { X: 0, Y: -47 },
              { X: 100, Y: -35, cp1X: 64, cp1Y: -48, cp2X: 105, cp2Y: -47 },
              { X: -5, Y: 59, cp1X: 66, cp1Y: 8, cp2X: 6, cp2Y: 40 },
              {
                X: -104,
                Y: -34,
                cp1X: -25,
                cp1Y: 32,
                cp2X: -93,
                cp2Y: -12,
              },
              { X: 0, Y: -46, cp1X: -117, cp1Y: -48, cp2X: -52, cp2Y: -48 },
            ],
            style: "line",
            lift: false,
            midCircle: { X: 0, Y: -47 },
          };
          arrows.shoulder_width = {
            mirror: false,
            coords: [
              { X: -329, Y: 49 },
              { X: -129, Y: -5 },
            ],
            style: "line",
            lift: true,
          };
          arrows.front_height = {
            mirror: false,
            coords: [
              { X: -167, Y: -4 },
              { X: -167, Y: 978 },
            ],
            style: "line",
            lift: false,
          };
          break;
        default: // elastic round
          itemDrawing.coords.push({ X: 0, Y: 90 }, { X: 164, Y: 0 });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 185, Y: 6 },
              { X: 0, Y: 110, cp1X: 140, cp1Y: 70, cp2X: 70, cp2Y: 108 },
            ],
          }); // basic round collar line
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 0, Y: 47 },
              { X: 164, Y: 0, cp1X: 55, cp1Y: 45, cp2X: 130, cp2Y: 23 },
              {
                X: 0,
                Y: 90,
                cp1X: 140,
                cp1Y: 46,
                cp2X: 55,
                cp2Y: 90,
              },
            ],
          }); // basic area
          break;
      }

      switch (
        itemTypeArr[3] // sleeve length
      ) {
        case 0: // tank top, string top or poncho
          itemDrawing.coords.push({ X: 199, Y: 10 });
          itemDrawing.coords.push({ X: 250, Y: 399, cp1X: 170, cp1Y: 124, cp2X: 220, cp2Y: 389 });
          arrows.shoulder_width = {
            mirror: false,
            coords: [
              { X: -299, Y: 32 },
              { X: -164, Y: -7 },
            ],
            style: "line",
            lift: true,
          };
          arrows.sleeve_top_width = {
            mirror: false,
            coords: [
              { X: 250, Y: 399 },
              { X: 289, Y: 34 },
            ],
            lift: false,
          };

          if (itemTypeArr[4] !== 0) {
            // is it you, poncho?
            itemDrawing.coords.push({ X: 250, Y: 399, cp1X: 328, cp1Y: 44, cp2X: 250, cp2Y: 260 });
            fitOrder.splice(13, 1); // remove sleeve top
            arrows.sleeve_top_width = false;
          }
          break;
        case 1: // very short (vest)
          itemDrawing.coords.push({ X: 289, Y: 34 });
          itemDrawing.coords.push({ X: 250, Y: 399, cp1X: 285, cp1Y: 44, cp2X: 220, cp2Y: 389 });
          arrows.shoulder_width = {
            mirror: false,
            coords: [
              { X: -299, Y: 32 },
              { X: -164, Y: -7 },
            ],
            style: "line",
            lift: true,
          };
          arrows.sleeve_top_width = {
            mirror: false,
            coords: [
              { X: 250, Y: 399 },
              { X: 289, Y: 34 },
            ],
            lift: false,
          };
          if (itemTypeArr[4] !== 0) {
            // is it you, poncho?
            itemDrawing.coords.push({ X: 250, Y: 399, cp1X: 328, cp1Y: 44, cp2X: 250, cp2Y: 260 });
            fitOrder.splice(13, 1); // remove sleeve top
            arrows.sleeve_top_width = false;
          }
          break;
        case 2: // short
        case 3: // short-medium (normal t-shirt)
          itemDrawing.coords.push({ X: 329, Y: 44 });
          itemDrawing.coords.push({ X: 482, Y: 460 }, { X: 324, Y: 529 });
          itemDrawing.coords.push({ X: 250, Y: 399 });

          arrows.sleeve_top_width = {
            mirror: false,
            coords: [
              { X: 250, Y: 399 },
              { X: 430, Y: 322 },
            ],
            lift: false,
          };
          arrows.wrist_width = {
            mirror: false,
            coords: [
              { X: 324, Y: 529 },
              { X: 482, Y: 460 },
            ],
            lift: false,
          };

          switch (
            itemTypeArr[2] // shoulder types
          ) {
            case 6: // dropped variation (drawing same, but measurement line different)
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  { X: 381, Y: 184 },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 381, Y: 184 },
                  { X: 482, Y: 460 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 432, Y: 322 },
              };
              break;
            case 3: // dropped
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  { X: 381, Y: 184 },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 174, Y: -16 },
                  { X: 329, Y: 27 },
                  { X: 482, Y: 460 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 406, Y: 243 },
              };
              break;
            case 2: // raglan line
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  {
                    X: 185,
                    Y: 6,
                    cp1X: 220,
                    cp1Y: 320,
                    cp2X: 185,
                    cp2Y: 6,
                  },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 174, Y: -16 },
                  { X: 329, Y: 27 },
                  { X: 482, Y: 460 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 406, Y: 243 },
              };
              break;
            case 1: // normal shoulder line
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 329, Y: 44 },
                  { X: 482, Y: 460 },
                ],
                style: "line",
                lift: true,
              };
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  {
                    X: 329,
                    Y: 44,
                    cp1X: 250,
                    cp1Y: 250,
                    cp2X: 300,
                    cp2Y: 70,
                  },
                ],
              });
              break;
          }
          break;
        case 4: // medium
        case 5: // semi-long
          itemDrawing.coords.push({ X: 329, Y: 44 });
          itemDrawing.coords.push({ X: 527, Y: 719 }, { X: 389, Y: 769 });
          itemDrawing.coords.push({ X: 250, Y: 399 });

          arrows.sleeve_top_width = {
            mirror: false,
            coords: [
              { X: 250, Y: 399 },
              { X: 419, Y: 340 },
            ],
            lift: false,
          };
          arrows.wrist_width = {
            mirror: false,
            coords: [
              { X: 389, Y: 769 },
              { X: 527, Y: 719 },
            ],
            lift: false,
          };

          switch (
            itemTypeArr[2] // shoulder types
          ) {
            case 6: // dropped (different measurement line)
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  { X: 369, Y: 196 },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 329, Y: 27 },
                  { X: 527, Y: 719 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 450, Y: 444 },
              };
              break;
            case 3: // dropped
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  { X: 369, Y: 196 },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 174, Y: -16 },
                  { X: 329, Y: 27 },
                  { X: 527, Y: 719 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 450, Y: 444 },
              };
              break;
            case 2: // raglan line
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  {
                    X: 185,
                    Y: 6,
                    cp1X: 220,
                    cp1Y: 320,
                    cp2X: 185,
                    cp2Y: 6,
                  },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 174, Y: -16 },
                  { X: 329, Y: 27 },
                  { X: 527, Y: 719 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 450, Y: 444 },
              };
              break;
            case 1: // normal shoulder line
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 329, Y: 44 },
                  { X: 527, Y: 719 },
                ],
                style: "line",
                lift: true,
              };
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  {
                    X: 329,
                    Y: 44,
                    cp1X: 250,
                    cp1Y: 250,
                    cp2X: 300,
                    cp2Y: 70,
                  },
                ],
              });
              break;
          }
          break;
        case 6: // long
        case 7: // very long
        case 8: // extra long
          itemDrawing.coords.push({ X: 329, Y: 44 });
          arrows.sleeve_top_width = {
            mirror: false,
            coords: [
              { X: 250, Y: 399 },
              { X: 410, Y: 348 },
            ],
            lift: false,
          };

          if (itemTypeArr[4] === 1) {
            // elastic
            itemDrawing.coords.push(
              { X: 556, Y: 902 },
              { X: 547, Y: 930 },
              { X: 557, Y: 978 },
              {
                X: 463,
                Y: 998,
              },
              { X: 449, Y: 951 },
              { X: 430, Y: 934 }
            );
            itemDrawing.accents.push(
              {
                type: "line",
                coords: [
                  { X: 465, Y: 944 },
                  { X: 476, Y: 996 },
                ],
              },
              {
                type: "line",
                coords: [
                  { X: 476, Y: 941 },
                  { X: 487, Y: 993 },
                ],
              },
              {
                type: "line",
                coords: [
                  { X: 487, Y: 938 },
                  { X: 498, Y: 990 },
                ],
              },
              {
                type: "line",
                coords: [
                  { X: 498, Y: 935 },
                  { X: 509, Y: 987 },
                ],
              },
              {
                type: "line",
                coords: [
                  { X: 509, Y: 932 },
                  { X: 520, Y: 984 },
                ],
              },
              {
                type: "line",
                coords: [
                  { X: 520, Y: 929 },
                  { X: 531, Y: 981 },
                ],
              },
              {
                type: "line",
                coords: [
                  { X: 531, Y: 926 },
                  { X: 542, Y: 978 },
                ],
              }
            );
            itemDrawing.coords.push({ X: 250, Y: 399 });
            arrows.wrist_width = {
              mirror: false,
              coords: [
                { X: 430, Y: 934 },
                { X: 556, Y: 902 },
              ],
              lift: false,
            };
          } else {
            itemDrawing.coords.push({ X: 571, Y: 978 }, { X: 454, Y: 1009 });
            itemDrawing.coords.push({ X: 250, Y: 399 });
            arrows.wrist_width = {
              mirror: false,
              coords: [
                { X: 571, Y: 978 },
                { X: 454, Y: 1009 },
              ],
              lift: false,
            };
          }

          switch (
            itemTypeArr[2] // shoulder types
          ) {
            case 6: // dropped (variation)
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  { X: 369, Y: 196 },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 369, Y: 196 },
                  { X: 571, Y: 978 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 470, Y: 587 },
              };
              break;
            case 3: // dropped
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  { X: 369, Y: 196 },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 174, Y: -16 },
                  { X: 329, Y: 27 },
                  { X: 571, Y: 978 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 437, Y: 444 },
              };
              break;
            case 2: // raglan line
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  {
                    X: 185,
                    Y: 6,
                    cp1X: 220,
                    cp1Y: 320,
                    cp2X: 185,
                    cp2Y: 6,
                  },
                ],
              });
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 174, Y: -16 },
                  { X: 329, Y: 27 },
                  { X: 571, Y: 978 },
                ],
                style: "line",
                lift: true,
                midCircle: { X: 437, Y: 444 },
              };
              break;
            case 1: // normal shoulder line
              arrows.sleeve = {
                mirror: false,
                coords: [
                  { X: 329, Y: 44 },
                  { X: 569, Y: 975 },
                ],
                style: "line",
                lift: true,
              };
              itemDrawing.accents.push({
                type: "line",
                coords: [
                  { X: 250, Y: 399 },
                  {
                    X: 329,
                    Y: 44,
                    cp1X: 250,
                    cp1Y: 250,
                    cp2X: 300,
                    cp2Y: 70,
                  },
                ],
              });
              break;
          }
          break;
      }

      // completely separate handling for two shoulder types
      switch (itemTypeArr[2]) {
        case 4:
          // if shoulder type indicates that there's nothing above chest meas, start from str
          itemDrawing.coords = [];
          itemDrawing.accents = [];
          itemDrawing.coords.push({ X: 0, Y: 370 });
          itemDrawing.coords.push({ X: 245, Y: 370, cp1X: 100, cp1Y: 355, cp2X: 145, cp2Y: 355 });
          break;
        case 5:
          // if shoulder type indicates that there's nothing above chest meas, start from str
          // has strap
          itemDrawing.coords = [];
          itemDrawing.accents = [];
          itemDrawing.coords.push({ X: 0, Y: 361 });
          itemDrawing.coords.push({ X: 132, Y: 297, cp1X: 30, cp1Y: 350, cp2X: 40, cp2Y: 320 });
          itemDrawing.coords.push({ X: 120, Y: 61, cp1X: 150, cp1Y: 180, cp2X: 150, cp2Y: 105 });
          itemDrawing.coords.push({ X: 75, Y: 320, cp1X: 80, cp1Y: 143, cp2X: 75, cp2Y: 320 });
          itemDrawing.coords.push({ X: 56, Y: 333 });
          itemDrawing.coords.push({ X: 118, Y: 50, cp1X: 72, cp1Y: 200, cp2X: 77, cp2Y: 88 });
          itemDrawing.coords.push({ X: 245, Y: 340, cp1X: 175, cp1Y: 84, cp2X: 128, cp2Y: 183 });
          // strap shadow
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 115, Y: 52 },
              { X: 120, Y: 61 },
              { X: 75, Y: 315, cp1X: 80, cp1Y: 143, cp2X: 75, cp2Y: 320 },
              { X: 56, Y: 326 },
              { X: 115, Y: 52, cp1X: 75, cp1Y: 180, cp2X: 77, cp2Y: 88 },
            ],
          });
          break;
      }

      // completely separate handling for two shoulder types
      switch (itemTypeArr[2]) {
        case 4:
          // if shoulder type indicates that there's nothing above chest meas, start from str
          itemDrawing.coords = [];
          itemDrawing.accents = [];
          itemDrawing.coords.push({ X: 0, Y: 370 });
          itemDrawing.coords.push({ X: 245, Y: 370, cp1X: 100, cp1Y: 355, cp2X: 145, cp2Y: 355 });
          break;
        case 5:
          // if shoulder type indicates that there's nothing above chest meas, start from str
          // has strap
          itemDrawing.coords = [];
          itemDrawing.accents = [];
          itemDrawing.coords.push({ X: 0, Y: 361 });
          itemDrawing.coords.push({ X: 132, Y: 297, cp1X: 30, cp1Y: 350, cp2X: 40, cp2Y: 320 });
          itemDrawing.coords.push({ X: 120, Y: 61, cp1X: 150, cp1Y: 180, cp2X: 150, cp2Y: 105 });
          itemDrawing.coords.push({ X: 75, Y: 320, cp1X: 80, cp1Y: 143, cp2X: 75, cp2Y: 320 });
          itemDrawing.coords.push({ X: 56, Y: 333 });
          itemDrawing.coords.push({ X: 118, Y: 50, cp1X: 72, cp1Y: 200, cp2X: 77, cp2Y: 88 });
          itemDrawing.coords.push({ X: 245, Y: 340, cp1X: 175, cp1Y: 84, cp2X: 128, cp2Y: 183 });
          // strap shadow
          itemDrawing.accents.push({
            type: "area",
            coords: [
              { X: 115, Y: 52 },
              { X: 120, Y: 61 },
              { X: 75, Y: 315, cp1X: 80, cp1Y: 143, cp2X: 75, cp2Y: 320 },
              { X: 56, Y: 326 },
              { X: 115, Y: 52, cp1X: 75, cp1Y: 180, cp2X: 77, cp2Y: 88 },
            ],
          });
          break;
      }

      if (itemTypeArr[0] === 1) {
        let $baseY = 0;
        switch (
          itemTypeArr[5] // waistband height
        ) {
          case 0: // poncho dude
            itemDrawing.coords.push({ X: 550, Y: 750, cp1X: 450, cp1Y: 70, cp2X: 450, cp2Y: 550 });
            itemDrawing.coords.push({ X: 0, Y: 1038, cp1X: 450, cp1Y: 800, cp2X: 400, cp2Y: 1038 });
            arrows.front_height = {
              mirror: false,
              coords: [
                { X: -174, Y: 5 },
                { X: -174, Y: 1018 },
              ],
              style: "line",
              lift: false,
            };
            arrows.sleeve = {
              mirror: false,
              coords: [
                { X: 174, Y: 0 },
                { X: 394, Y: 59 },
                { X: 550, Y: 750 },
              ],
              style: "line",
              lift: true,
              midCircle: { X: 480, Y: 444 },
            };
            break;
          case 1: // underbust
            $baseY = 478;
            arrows.underbust = {
              mirror: false,
              coords: [
                { X: -250, Y: $baseY },
                { X: 250, Y: $baseY },
              ],
              lift: false,
            };
            if (itemTypeArr[6] === 1) {
              // elastic
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: $baseY - 30,
                  cp1X: 247,
                  cp1Y: 362,
                  cp2X: 247,
                  cp2Y: $baseY - 80,
                },
                { X: 240, Y: $baseY },
                { X: 0, Y: $baseY }
              );
              // eslint-disable-next-line
              for (let $i = 0; $i < 25; $i++) {
                const $x = Math.round(($i + 0.5) * (240 / 25));
                itemDrawing.accents.push({
                  type: "line",
                  coords: [
                    { X: $x, Y: $baseY - 30 },
                    { X: $x, Y: $baseY },
                  ],
                });
              }
              arrows.underbust = {
                mirror: false,
                coords: [
                  { X: -250, Y: $baseY - 30 },
                  { X: 250, Y: $baseY - 30 },
                ],
                lift: false,
              };
              arrows.waist = [];
              arrows.pant_waist = arrows.waist; // in case of slight mis-tablization
              arrows.hips = arrows.pant_waist; // in case of slight mis-tablization
            } else {
              itemDrawing.coords.push(
                { X: 250, Y: $baseY, cp1X: 245, cp1Y: 402, cp2X: 245, cp2Y: $baseY - 50 },
                { X: 0, Y: $baseY, cp1X: 100, cp1Y: $baseY + 10, cp2X: 145, cp2Y: $baseY + 10 }
              );
              arrows.waist = [];
              arrows.pant_waist = arrows.waist; // in case of slight mis-tablization
              arrows.hips = arrows.pant_waist; // in case of slight mis-tablization
            }
            arrows.front_height.coords[1].Y = $baseY;
            break;
          case 2: // waist
            $baseY = 778;
            if (itemTypeArr[6] === 1) {
              // elastic
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: $baseY - 70,
                  cp1X: 247,
                  cp1Y: 402,
                  cp2X: 247,
                  cp2Y: $baseY - 120,
                },
                { X: 230, Y: $baseY },
                { X: 0, Y: $baseY }
              );
              // eslint-disable-next-line
              for (let $i = 0; $i < 15; $i++) {
                const $x = Math.round(($i + 0.5) * (230 / 15));
                itemDrawing.accents.push({
                  type: "line",
                  coords: [
                    { X: $x, Y: $baseY - 60 },
                    { X: $x, Y: $baseY },
                  ],
                });
              }
              arrows.waist = {
                mirror: false,
                coords: [
                  { X: -250, Y: $baseY - 70 },
                  { X: 250, Y: $baseY - 70 },
                ],
                lift: false,
              };
              arrows.pant_waist = arrows.waist; // in case of slight mis-tablization
              arrows.hips = arrows.pant_waist; // in case of slight mis-tablization
            } else {
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: $baseY,
                  cp1X: 245,
                  cp1Y: 402,
                  cp2X: 245,
                  cp2Y: $baseY - 50,
                },
                { X: 0, Y: $baseY }
              );
              arrows.waist = {
                mirror: false,
                coords: [
                  { X: -250, Y: $baseY },
                  { X: 250, Y: $baseY },
                ],
                lift: false,
              };
              arrows.pant_waist = arrows.waist; // in case of slight mis-tablization
              arrows.hips = arrows.pant_waist; // in case of slight mis-tablization
            }
            arrows.front_height.coords[1].Y = $baseY;
            break;
          case 3: // pant waist
            if (itemTypeArr[6] === 1) {
              // elastic
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: 908,
                  cp1X: 247,
                  cp1Y: 402,
                  cp2X: 247,
                  cp2Y: 858,
                },
                { X: 230, Y: 978 },
                { X: 0, Y: 978 }
              );
              // eslint-disable-next-line
              for (let $i = 0; $i < 15; $i++) {
                const $x = Math.round(($i + 0.5) * (230 / 15));
                itemDrawing.accents.push({
                  type: "line",
                  coords: [
                    { X: $x, Y: 918 },
                    { X: $x, Y: 978 },
                  ],
                });
              }
              arrows.pant_waist = {
                mirror: false,
                coords: [
                  { X: -250, Y: 908 },
                  { X: 250, Y: 908 },
                ],
                lift: false,
              };
              arrows.hips = arrows.pant_waist; // in case of slight mis-tablization
            } else {
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: 978,
                  cp1X: 245,
                  cp1Y: 402,
                  cp2X: 245,
                  cp2Y: 928,
                },
                { X: 0, Y: 978 }
              );
              arrows.pant_waist = {
                mirror: false,
                coords: [
                  { X: -250, Y: 978 },
                  { X: 250, Y: 978 },
                ],
                lift: false,
              };
              arrows.hips = arrows.pant_waist; // in case of slight mis-tablization
            }
            break;
          case 4: // hips
          /* falls through */
          case 5: // half-way-thigh
          /* falls through */
          default: {
            $baseY = 978;
            if (itemTypeArr[5] > 4) {
              $baseY = 978 + (itemTypeArr[5] - 4) * 160;
            }
            arrows.hips = {
              mirror: false,
              coords: [
                { X: -250, Y: 978 },
                { X: 250, Y: 978 },
              ],
              lift: false,
            };
            if (itemTypeArr[6] === 1) {
              // elastic
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: $baseY,
                  cp1X: 247,
                  cp1Y: 402,
                  cp2X: 247,
                  cp2Y: 908,
                },
                { X: 230, Y: $baseY + 60 },
                { X: 0, Y: $baseY + 60 }
              );
              // eslint-disable-next-line
              for (let $i = 0; $i < 15; $i++) {
                const $x = Math.round(($i + 0.5) * (230 / 15));
                itemDrawing.accents.push({
                  type: "line",
                  coords: [
                    { X: $x, Y: $baseY + 10 },
                    { X: $x, Y: $baseY + 60 },
                  ],
                });
              }
              arrows.front_height.coords[1].Y = $baseY + 60;
            } else {
              itemDrawing.coords.push(
                {
                  X: 250,
                  Y: $baseY + 60,
                  cp1X: 245,
                  cp1Y: 402,
                  cp2X: 245,
                  cp2Y: $baseY,
                },
                { X: 0, Y: $baseY + 60 }
              );
              arrows.front_height.coords[1].Y = $baseY + 60;
            }
            // define just in case
            arrows.pant_waist = {
              mirror: false,
              coords: [
                { X: -250, Y: 838 },
                { X: 250, Y: 838 },
              ],
              lift: false,
            };
          }
        }
      } else {
        // overalls (itemTypeArr[0] == 5)
        // top/bottom combinations (itemTypeArr[0] == 6)

        const $l = parseInt(itemTypeArr[5]); // sleeve length in overalls
        itemDrawing.coords.push({ X: 280, Y: 900 + $l * 200 });
        itemDrawing.coords.push({ X: 160, Y: 910 + $l * 200 });
        itemDrawing.coords.push({ X: 20, Y: 1200 });
        itemDrawing.coords.push({ X: 0, Y: 1200 });

        if (itemTypeArr[0] === 6 && itemTypeArr[4] === 1) {
          // top and bottom, elastic top sleeve
          // eslint-disable-next-line
          for (let $i = 0; $i < 15; $i++) {
            const $x = Math.round(($i + 0.5) * (250 / 15));
            itemDrawing.accents.push({
              type: "line",
              coords: [
                { X: $x, Y: 918 },
                { X: $x, Y: 978 },
              ],
            });
          }
        }
        if (itemTypeArr[0] === 6) {
          // top and bottom
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 0, Y: 978 },
              { X: 255, Y: 978 },
            ],
          });
        }
        if (itemTypeArr[6] === 1) {
          // elastic bottom sleeve
          for (let $i = 0; $i < 7; $i++) {
            itemDrawing.accents.push({
              type: "line",
              coords: [
                { X: Math.round(164 + $i * 17), Y: Math.round(850 + $l * 200 - $i * 2) },
                { X: Math.round(170 + $i * 16), Y: Math.round(910 + $l * 200 - $i * 2) },
              ],
            });
          }
        }
        arrows.waist = {
          mirror: false,
          coords: [
            { X: -262, Y: 689 },
            { X: 262, Y: 689 },
          ],
          lift: false,
        };
        arrows.pant_waist = {
          mirror: false,
          coords: [
            { X: -265, Y: 978 },
            { X: 265, Y: 978 },
          ],
          lift: false,
        };
        if (itemTypeArr[5] > 1) {
          arrows.hips = {
            mirror: false,
            coords: [
              { X: -265, Y: 1080 },
              { X: 265, Y: 1080 },
            ],
            lift: false,
          };
        } else {
          arrows.hips = {
            mirror: false,
            coords: [
              { X: -280, Y: 1080 },
              { X: 280, Y: 1080 },
            ],
            lift: false,
          };
        }
        arrows.outseam = {
          mirror: false,
          coords: [
            { X: 255, Y: 978 },
            { X: 280, Y: 900 + $l * 200 },
          ],
          style: "line",
          lift: true,
        };
        arrows.thigh_width = {
          mirror: false,
          coords: [
            { X: -264, Y: 1204 },
            { X: -24, Y: 1207 },
          ],
          lift: false,
        };
        arrows.knee_width = {
          mirror: false,
          coords: [
            { X: -265, Y: 1627 },
            { X: -74, Y: 1644 },
          ],
          lift: false,
        };
        arrows.calf_width = {
          mirror: false,
          coords: [
            { X: -275, Y: 1874 },
            { X: -103, Y: 1891 },
          ],
          lift: false,
        };
        arrows.pant_sleeve_width = {
          mirror: false,
          coords: [
            { X: -278, Y: 840 + $l * 200 },
            { X: -160, Y: 860 + $l * 200 },
          ],
          lift: false,
        };
      }
      break; // case 1 shirts/coats

    case 2: // trousers/shorts
      itemDrawing.mirror = false; // for accents mainly
      itemDrawing.coords.push(
        { X: -225, Y: 0 },
        {
          X: 225,
          Y: 0,
          cp1X: -100,
          cp1Y: 10,
          cp2X: 100,
          cp2Y: 10,
        },
        { X: 250, Y: 170 }
      );
      if (itemTypeArr[4] < 6) {
        // two sleeves
        // eslint-disable-next-line
        const $l = parseInt(itemTypeArr[3]); // sleeve length basically
        // right sleeve
        if (itemTypeArr[4] === 1) {
          // elastic
          itemDrawing.coords.push(
            { X: 250 + $l * 9, Y: 170 + $l * 135 },
            { X: 240 + $l * 9, Y: 180 + $l * 135 },
            { X: 240 + $l * 10, Y: 160 + $l * 150 },
            { X: 25 + $l * 25, Y: 170 + $l * 150 },
            { X: 25 + $l * 23, Y: 200 + $l * 135 },
            { X: 15 + $l * 23, Y: 190 + $l * 135 }
          );
          // eslint-disable-next-line
          for (let $i = 0; $i < 7; $i++) {
            itemDrawing.accents.push({
              type: "line",
              coords: [
                {
                  X: Math.round(40 + $i * 29 + $l * (23 - $i * 2)),
                  Y: Math.round(200 - $i * 3 + $l * 135),
                },
                {
                  X: Math.round(50 + $i * 28 + $l * (23 - $i * 2)),
                  Y: Math.round(170 - $i * 2 + $l * 150),
                },
              ],
            });
          }
        } else {
          itemDrawing.coords.push(
            { X: 250 + $l * 10, Y: 170 + $l * 150 },
            { X: 15 + $l * 25, Y: 180 + $l * 150 }
          );
        }
        itemDrawing.coords.push({ X: 10, Y: 297 }, { X: -10, Y: 297 });
        // left sleeve (as not mirror)
        if (itemTypeArr[4] === 1) {
          // elastic
          itemDrawing.coords.push(
            { X: -15 - $l * 23, Y: 190 + $l * 135 },
            { X: -25 - $l * 23, Y: 200 + $l * 135 },
            { X: -25 - $l * 25, Y: 170 + $l * 150 },
            { X: -240 - $l * 10, Y: 160 + $l * 150 },
            { X: -240 - $l * 9, Y: 180 + $l * 135 },
            { X: -250 - $l * 9, Y: 170 + $l * 135 }
          );
          // eslint-disable-next-line
          for (let $i = 0; $i < 7; $i++) {
            itemDrawing.accents.push({
              type: "line",
              coords: [
                {
                  X: -Math.round(40 + $i * 29 + $l * (23 - $i * 2)),
                  Y: Math.round(200 - $i * 3 + $l * 135),
                },
                {
                  X: -Math.round(50 + $i * 28 + $l * (23 - $i * 2)),
                  Y: Math.round(170 - $i * 2 + $l * 150),
                },
              ],
            });
          }
        } else {
          itemDrawing.coords.push(
            { X: -15 - $l * 25, Y: 180 + $l * 150 },
            { X: -250 - $l * 10, Y: 170 + $l * 150 }
          );
        }
        arrows.outseam = {
          mirror: false,
          coords: [
            { X: 225, Y: 0 },
            { X: 250, Y: 170 },
            { X: 250 + $l * 10, Y: 170 + $l * 150 },
          ],
          style: "line",
          lift: true,
        };

        switch (
          itemTypeArr[3] // left sleeve (as not mirror)
        ) {
          case 1: // very short
          case 2: // short
          case 3: // short-medium
            arrows.knee_width = {
              mirror: false,
              coords: [
                { X: -278, Y: 449 },
                { X: -38, Y: 474 },
              ],
              lift: false,
            };
            break;
          case 4: // medium
            arrows.knee_width = {
              mirror: false,
              coords: [
                { X: -281, Y: 626 },
                { X: -77, Y: 651 },
              ],
              lift: false,
            };
            break;
          case 5: // semi-long
          case 6: // long
            arrows.knee_width = {
              mirror: false,
              coords: [
                { X: -281, Y: 626 },
                { X: -77, Y: 651 },
              ],
              lift: false,
            };
            break;
        }

        // leg opening
        if (itemTypeArr[4] === 1) {
          // elastic
          arrows.pant_sleeve_width = {
            mirror: false,
            coords: [
              { X: -250 - $l * 9, Y: 170 + $l * 135 },
              { X: -15 - $l * 23, Y: 180 + $l * 135 },
            ],
            lift: false,
          };
        } else {
          arrows.pant_sleeve_width = {
            mirror: false,
            coords: [
              { X: -250 - $l * 10, Y: 170 + $l * 150 },
              { X: -15 - $l * 25, Y: 180 + $l * 150 },
            ],
            lift: false,
          };
        }
      } else {
        // skirt(s)
        // eslint-disable-next-line
        const $l = parseInt(itemTypeArr[3]); // sleeve length basically
        // right "sleeve"
        if (itemTypeArr[4] === 7) {
          // elastic
          itemDrawing.coords.push(
            { X: 250 - $l * 8, Y: 170 + $l * 95 },
            { X: 240 - $l * 8, Y: 180 + $l * 95 },
            { X: 235 - $l * 8, Y: 220 + $l * 95 }
          );
          // eslint-disable-next-line
          for (let $i = 0; $i < 16 - $l; $i++) {
            itemDrawing.accents.push({
              type: "line",
              coords: [
                {
                  X: Math.round($i * (14 + $l)),
                  Y: Math.round(180 + $l * 95),
                },
                {
                  X: Math.round($i * (14 + $l)),
                  Y: Math.round(220 + $l * 95),
                },
              ],
            });
          }
        } else {
          itemDrawing.coords.push({ X: 250 - $l * 8, Y: 220 + $l * 95 });
        }
        // left "sleeve" (as not mirror)
        if (itemTypeArr[4] === 7) {
          // elastic
          itemDrawing.coords.push(
            { X: -235 + $l * 8, Y: 220 + $l * 95 },
            { X: -240 + $l * 8, Y: 180 + $l * 95 },
            { X: -250 + $l * 8, Y: 170 + $l * 95 }
          );
          // eslint-disable-next-line
          for (let $i = 0; $i < 16 - $l; $i++) {
            itemDrawing.accents.push({
              type: "line",
              coords: [
                {
                  X: -Math.round($i * (14 + $l)),
                  Y: Math.round(180 + $l * 95),
                },
                {
                  X: -Math.round($i * (14 + $l)),
                  Y: Math.round(220 + $l * 95),
                },
              ],
            });
          }
        } else {
          itemDrawing.coords.push({ X: -250 + $l * 8, Y: 220 + $l * 95 });
        }
        arrows.outseam = {
          mirror: false,
          coords: [
            { X: 225, Y: 0 },
            { X: 250, Y: 170 },
            { X: 250 - $l * 8, Y: 220 + $l * 95 },
          ],
          style: "line",
          lift: true,
        };
      }
      itemDrawing.coords.push({ X: -250, Y: 170 });
      itemDrawing.accents.push({
        type: "area",
        coords: [
          { X: -225, Y: 0 },
          { X: 225, Y: 0, cp1X: -100, cp1Y: 10, cp2X: 100, cp2Y: 10 },
          {
            X: -225,
            Y: 0,
            cp1X: 122,
            cp1Y: 40,
            cp2X: -122,
            cp2Y: 40,
          },
        ],
      });
      if (itemTypeArr[6] !== 5) {
        itemDrawing.accents.push(
          {
            type: "line",
            coords: [
              { X: -235, Y: 160 },
              { X: -150, Y: 85, cp1X: -190, cp1Y: 160, cp2X: -155, cp2Y: 125 },
            ],
          },
          {
            type: "line",
            coords: [
              { X: 150, Y: 85 },
              { X: 235, Y: 160, cp1X: 155, cp1Y: 125, cp2X: 190, cp2Y: 160 },
            ],
          }
        );
      }

      switch (
        itemTypeArr[6] // trouser waistband
      ) {
        case 1: // elastic waistband
          // eslint-disable-next-line
          for (let $i = -14; $i < 15; $i++) {
            const $x = Math.round(($i * 230) / 15);
            const $y = Math.round(30 - Math.pow($i, 2) * 0.13);
            itemDrawing.accents.push({
              type: "line",
              coords: [
                { X: $x, Y: $y },
                { X: $x, Y: $y + 35 },
              ],
            });
          }
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 3, Y: 69 },
              { X: -4, Y: 297, cp1X: 3, cp1Y: 134, cp2X: 0, cp2Y: 215 },
            ],
          });
          break;
        case 4: // rope waistband
          itemDrawing.accents.push(
            {
              type: "line",
              coords: [
                { X: 9, Y: 49 },
                { X: 8, Y: 47, cp1X: -24, cp1Y: 168, cp2X: -69, cp2Y: 84 },
              ],
            },
            {
              type: "line",
              coords: [
                { X: 9, Y: 50 },
                { X: 8, Y: 49, cp1X: 47, cp1Y: 149, cp2X: 70, cp2Y: 99 },
              ],
            },
            {
              type: "line",
              coords: [
                { X: 9, Y: 49 },
                { X: 49, Y: 49, cp1X: 27, cp1Y: 59, cp2X: 36, cp2Y: 54 },
              ],
            },
            {
              type: "line",
              coords: [
                { X: 9, Y: 49 },
                { X: 9, Y: 64, cp1X: 11, cp1Y: 54, cp2X: 11, cp2Y: 54 },
              ],
            }
          );
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 3, Y: 69 },
              { X: -4, Y: 297, cp1X: 3, cp1Y: 134, cp2X: 0, cp2Y: 215 },
            ],
          });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: -225, Y: 37 },
              { X: 225, Y: 37, cp1X: -137, cp1Y: 76, cp2X: 129, cp2Y: 76 },
            ],
          });
          break;
        case 5: // straight waistband, no buttons, no pockets
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: 3, Y: 69 },
              { X: -4, Y: 297, cp1X: 3, cp1Y: 134, cp2X: 0, cp2Y: 215 },
            ],
          });
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: -225, Y: 37 },
              { X: 225, Y: 37, cp1X: -137, cp1Y: 76, cp2X: 129, cp2Y: 76 },
            ],
          });
          break;
        default:
          itemDrawing.accents.push({ type: "circle", coords: [{ X: 4, Y: 48, R: 10 }] });
          itemDrawing.accents.push(
            {
              type: "line",
              coords: [
                { X: -14, Y: 19 },
                { X: -8, Y: 297, cp1X: 3, cp1Y: 114, cp2X: 0, cp2Y: 215 },
              ],
            },
            {
              type: "line",
              coords: [
                { X: -4, Y: 254 },
                { X: 29, Y: 64, cp1X: 34, cp1Y: 242, cp2X: 35, cp2Y: 188 },
              ],
            }
          );
          itemDrawing.accents.push({
            type: "line",
            coords: [
              { X: -225, Y: 37 },
              { X: 225, Y: 37, cp1X: -137, cp1Y: 76, cp2X: 129, cp2Y: 76 },
            ],
          });
          break;
      }

      break; // case 2 trousers

    case 3: // shoes for my friends
      itemDrawing.mirror = false;
      itemDrawing.coords = [
        { X: 130, Y: 0 },
        { X: 363, Y: 456, cp1X: 240, cp1Y: 8, cp2X: 345, cp2Y: 214 },
        { X: 328, Y: 633, cp1X: 358, cp1Y: 532, cp2X: 328, cp2Y: 564 },
        {
          X: 182,
          Y: 999,
          cp1X: 330,
          cp1Y: 732,
          cp2X: 327,
          cp2Y: 994,
        },
        { X: 48, Y: 628, cp1X: 3, cp1Y: 994, cp2X: 48, cp2Y: 789 },
        { X: 0, Y: 340, cp1X: 42, cp1Y: 447, cp2X: 0, cp2Y: 444 },
        {
          X: 130,
          Y: 0,
          cp1X: 0,
          cp1Y: 114,
          cp2X: 72,
          cp2Y: 0,
        },
      ];
      itemDrawing.accents = [
        {
          type: "area",
          coords: [
            { X: 164, Y: 625 },
            { X: 266, Y: 716, cp1X: 270, cp1Y: 632, cp2X: 276, cp2Y: 638 },
            { X: 168, Y: 990, cp1X: 236, cp1Y: 982, cp2X: 208, cp2Y: 987 },
            { X: 69, Y: 716, cp1X: 92, cp1Y: 978, cp2X: 83, cp2Y: 852 },
            { X: 164, Y: 625, cp1X: 64, cp1Y: 641, cp2X: 57, cp2Y: 628 },
          ],
        },
        {
          type: "line",
          coords: [
            { X: 103, Y: 431 },
            { X: 212, Y: 430, cp1X: 112, cp1Y: 404, cp2X: 203, cp2Y: 405 },
          ],
        },
        {
          type: "line",
          coords: [
            { X: 115, Y: 469 },
            { X: 200, Y: 469, cp1X: 121, cp1Y: 447, cp2X: 188, cp2Y: 450 },
          ],
        },
        {
          type: "line",
          coords: [
            { X: 115, Y: 506 },
            { X: 200, Y: 506, cp1X: 121, cp1Y: 484, cp2X: 188, cp2Y: 484 },
          ],
        },
        {
          type: "line",
          coords: [
            { X: 115, Y: 555 },
            { X: 200, Y: 555, cp1X: 121, cp1Y: 533, cp2X: 188, cp2Y: 533 },
          ],
        },
        {
          type: "line",
          coords: [
            { X: 164, Y: 539 },
            {
              X: 283,
              Y: 541,
              cp1X: 242,
              cp1Y: 523,
              cp2X: 279,
              cp2Y: 609,
            },
            { X: 164, Y: 539, cp1X: 277, cp1Y: 492, cp2X: 209, cp2Y: 515 },
          ],
        },
        {
          type: "line",
          coords: [
            { X: 164, Y: 539 },
            {
              X: 45,
              Y: 492,
              cp1X: 123,
              cp1Y: 517,
              cp2X: 34,
              cp2Y: 532,
            },
            { X: 164, Y: 539, cp1X: 65, cp1Y: 457, cp2X: 129, cp2Y: 509 },
          ],
        },
      ];
      break; // case 3 shoes

    case 4: // hats off
      switch (itemTypeArr[1]) {
        case 3: // cap
          itemDrawing.mirror = false;
          itemDrawing.coords = [
            { X: 300, Y: 0 },
            { X: 544, Y: 280, cp1X: 452, cp1Y: 17, cp2X: 458, cp2Y: 61 },
            { X: 63, Y: 280, cp1X: 684, cp1Y: 530, cp2X: -77, cp2Y: 530 },
            { X: 300, Y: 0, cp1X: 156, cp1Y: 28, cp2X: 186, cp2Y: 16 },
          ];
          itemDrawing.accents = [
            {
              type: "line",
              coords: [
                { X: 544, Y: 280 },
                { X: 63, Y: 280, cp1X: 376, cp1Y: 368, cp2X: 209, cp2Y: 373 },
              ],
            },
          ];
          break;
        default: // bucket
          itemDrawing.mirror = false;
          itemDrawing.coords = [
            { X: 300, Y: 0 },
            { X: 522, Y: 214, cp1X: 452, cp1Y: 17, cp2X: 458, cp2Y: 61 },
            { X: 599, Y: 311, cp1X: 594, cp1Y: 245, cp2X: 601, cp2Y: 283 },
            { X: 293, Y: 437, cp1X: 597, cp1Y: 361, cp2X: 494, cp2Y: 433 },
            { X: 0, Y: 306, cp1X: 87, cp1Y: 433, cp2X: 2, cp2Y: 355 },
            { X: 92, Y: 209, cp1X: 1, cp1Y: 258, cp2X: 44, cp2Y: 227 },
            { X: 300, Y: 0, cp1X: 156, cp1Y: 28, cp2X: 186, cp2Y: 16 },
          ];
          itemDrawing.accents = [
            {
              type: "line",
              coords: [
                { X: 222, Y: 48 },
                { X: 367, Y: 43, cp1X: 269, cp1Y: 29, cp2X: 288, cp2Y: 64 },
              ],
            },
            {
              type: "line",
              coords: [
                { X: 523, Y: 214 },
                { X: 544, Y: 280 },
                { X: 63, Y: 278, cp1X: 376, cp1Y: 368, cp2X: 209, cp2Y: 373 },
                { X: 92, Y: 209 },
              ],
            },
          ];
          break;
      }
      break; // case 4 hats
  }

  return {
    arrows,
    itemDrawing,
  };
}

export default class ProductModel {
  constructor(item) {
    const itemTypeArr = item.itemType.split(".").map(Number);
    const { arrows, itemDrawing } = init(itemTypeArr);

    this.measurementOrder = [];
    fitRecommendation = item.fitRecommendation ?? DEFAULT_OPTIMAL_FIT;

    const firstSize = Object.entries(item.measurements || {})[0];
    if (firstSize && firstSize[1]) {
      const measurements = firstSize[1];
      let i = 1;
      for (const fit of fitOrder) {
        if (measurements[fit] && arrows[fit]) {
          arrows[fit].num = i++;
          this.measurementOrder.push(fit);
        }
      }
    }
    this.arrows = arrows;
    this.itemDrawing = itemDrawing;
    const { essentials, required } = getEssentialMeasurements(itemTypeArr, item.measurements);
    this.essentialMeasurements = essentials;
    this.requiredMeasurements = required;
    this.pinchedFits = pinchedFits;

    this.getItemTypeComponent = (index) => itemTypeArr[index];
  }

  measurementName = (measurement) => {
    if (this.getItemTypeComponent(0) === 1) {
      if (measurement === "hips" && this.getItemTypeComponent(5) < 5) {
        return i18n.t("measurement.hem");
      }
      if (measurement === "pantWaist" && this.getItemTypeComponent(5) < 4) {
        return i18n.t("measurement.hem");
      }

      const sleeveLength = this.getItemTypeComponent(3);
      if (measurement === "wrist_width" && sleeveLength >= 2 && sleeveLength <= 5) {
        return i18n.t("measurement.sleeve_opening");
      }
    }

    return i18n.t(`measurement.${measurement}`);
  };

  static getFit = (measurementResult, overflowFits = true) => {
    if (!measurementResult) {
      return null;
    }
    const { componentFit, importance } = measurementResult;
    let relativeComponentFit = componentFit;
    if (fitRecommendation === 1000) {
      relativeComponentFit = componentFit >= 1000 ? DEFAULT_OPTIMAL_FIT : 990;
    } else {
      relativeComponentFit =
        Math.round(
          ((componentFit - fitRecommendation) / (fitRecommendation - 1000)) *
            (DEFAULT_OPTIMAL_FIT - 1000)
        ) + DEFAULT_OPTIMAL_FIT;
    }
    let fitRange = fitRanges.find((fr) => fr.matches(relativeComponentFit));
    if (!fitRange && overflowFits) {
      fitRange = componentFit < norm ? subRange : superRange;
    }
    if (importance !== 1 && fitRange.label === "too_big") {
      fitRange = fitRanges.find((fr) => fr.label === "loose");
    }
    return fitRange;
  };
}

const getResult = (measurement, value, matchItem) => {
  let fitValue;
  let fit;
  let addPlus = false;
  const pinched = pinchedFits.includes(measurement);
  if (matchItem && matchItem.componentFit > 0) {
    if (matchItem.overlap <= 0 && matchItem.componentFit >= 1000) {
      fitValue = 0;
    } else if (pinched) {
      fitValue = matchItem.overlap / 40.0;
    } else {
      fitValue = matchItem.overlap / 10.0;
    }
    addPlus = matchItem.overlap > 0;
    fit = ProductModel.getFit(matchItem);
  } else if (value > 0) {
    fitValue = value / 10.0;
  }
  let fitText = Optional.ofNullable(fitValue)
    .map((v) => v.toFixed(1) + " cm")
    .orElse("");

  if (addPlus) {
    fitText = "+" + fitText;
  }

  return {
    fitValue,
    fitText,
    fit,
    isPinched: pinched,
    isLongFit: longFits.includes(measurement),
  };
};

const isStretching = (matchMap, effFitRecommendation) => {
  if (effFitRecommendation <= 1000) {
    return true;
  }
  if (!matchMap) {
    return false;
  }
  if (matchMap.pant_waist !== undefined) {
    let numOfImportantMeasurements = 0;
    Object.entries(matchMap).forEach(([, oValue]) => {
      if (oValue.importance === 1) {
        numOfImportantMeasurements++;
      }
      if (oValue.importance === -1 && oValue.componentFit < 1000) {
        numOfImportantMeasurements++;
      }
    });
    if (numOfImportantMeasurements === 1) {
      optimalStretch = DEFAULT_OPTIMAL_STRETCH * 6;
      return true;
    }
  }
  return false;
};

function linearizeObject(inputValue, inputObject) {
  const keys = Object.keys(inputObject);

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = parseFloat(keys[i]);
    const nextKey = parseFloat(keys[i + 1]);

    if (inputValue >= inputObject[currentKey] && inputValue <= inputObject[nextKey]) {
      const keyDifference = nextKey - currentKey;
      const valueDifference = inputObject[nextKey] - inputObject[currentKey];
      const ratio = (inputValue - inputObject[currentKey]) / valueDifference;
      return currentKey + ratio * keyDifference;
    }
  }
  return null; // If the input value is outside the range of the object values
}

const getFitPosition = (value, matchMap) => {
  let effTotalFit = value;
  const maxStretchArr = [];
  if (matchMap) {
    const importanceArr = [];
    const componentFitArr = [];
    Object.entries(matchMap).forEach(([, oValue]) => {
      maxStretchArr.push(oValue.componentStretch);
      importanceArr.push(oValue.importance);
      componentFitArr.push(oValue.componentFit);
    });
    const maxImportance = Math.max.apply(null, importanceArr);
    const maxComponentFit = Math.max.apply(null, componentFitArr);
    if (effTotalFit === 1000 && maxImportance < 0 && maxComponentFit > 1000) {
      effTotalFit = maxComponentFit;
    }
  }
  if (isStretching(matchMap, fitRecommendation)) {
    // RENDER MODE: STRETCHING
    let newPos = 50;
    if (matchMap) {
      if (effTotalFit > 1000) {
        if (fitRecommendation <= 1000) {
          newPos = 60 + ((effTotalFit - 1000) / 55) * 60;
        } else {
          newPos = 60 + ((effTotalFit - 1000) / 55) * 10;
        }
      } else if (effTotalFit == 1000) {
        let stretchBreakpoint = 2 * optimalStretch;
        if (fitRecommendation < 1000) {
          stretchBreakpoint = 2 * (1000 - fitRecommendation);
        }
        const maxStretch = Math.max.apply(null, maxStretchArr);
        newPos =
          maxStretch > stretchBreakpoint
            ? Math.max(20, 40 - ((maxStretch - stretchBreakpoint) / (100 - stretchBreakpoint)) * 20)
            : Math.max(40, 60 - (maxStretch / stretchBreakpoint) * 20);
      } else {
        newPos = Math.max(0, 20 - ((1000 - effTotalFit) / 55) * 20);
      }
    }
    return newPos;
  } else if (fitRecommendation <= 1020) {
    // RENDER MODE: SLIMS
    // 0..20 too small
    if (effTotalFit < 1000) {
      return Math.max(0, 20 - ((1000 - effTotalFit) / 55) * 20);
    } else if (effTotalFit == 1000) {
      // 20..40 slim: is stretching
      const maxStretch = matchMap ? Math.max.apply(null, maxStretchArr) : optimalStretch;
      return Math.max(20, 40 - (maxStretch / 100) * 20);
    } else {
      // 40..100 regular, loose and big, create breakpoints
      const breakPoints = {
        40: 1000,
        60: 1000 + (fitRecommendation - 1000) * 2,
        80: Math.max(1040, 1000 + (fitRecommendation - 1000) * 8),
        100: Math.max(1080, 1000 + (fitRecommendation - 1000) * 16),
        200: 10000,
      };
      let newPos = 100;
      newPos = linearizeObject(effTotalFit, breakPoints);
      return newPos ?? 200;
    }
  } else {
    // RENDER MODE: NORMAL, with big softner
    const effFitRecommendation =
      fitRecommendation <= 1000 ? DEFAULT_OPTIMAL_FIT : fitRecommendation;
    const regular = fitRanges.find((r) => r.label === "regular");
    const rangeWidth = regular.end - regular.start;
    const regularMidPoint = regular.end - rangeWidth / 2;
    const scaledWidth = rangeWidth / ((regularMidPoint - 1000) / (effFitRecommendation - 1000));
    const sliderPosXMin = 1000 - scaledWidth;
    const sliderPosXMax = fitRanges.slice(1).reduce((end) => end + scaledWidth, 1000);
    const sliderScale = 100 / (sliderPosXMax - sliderPosXMin);
    let newPos = Math.max(0, (effTotalFit - sliderPosXMin) * sliderScale);
    if (newPos > 80) {
      newPos = (newPos - 80) / 2 + 80;
    }
    return newPos;
  }
};

export {
  humanMeasurementMap,
  fitRanges,
  getResult,
  getFitPosition,
  fitLabelsAndColors,
  pinchedFits,
};
