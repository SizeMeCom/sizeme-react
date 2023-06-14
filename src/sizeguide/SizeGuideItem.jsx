import React from "react";
import PropTypes from "prop-types";
import SizeGuideModel from "../api/ProductModel";
import uiOptions from "../api/uiOptions";
import Optional from "optional-js";

const realCanvasWidth = 350;
const realCanvasHeight = 480;
const padding = 0.07;
const drawColor = "#777777";
const fillColor = "#BBBBBB";
const itemLineWidth = 1;
const arcRadius = 10;
const arrowLift = 30;
const arrowLineWidth = 2;
const arrowEndRadius = 4;
const arrowNumberRadius = 10;
const arrowNumberFont = "10px sans-serif";
const arrowNumberHighlightFont = "bold 14px sans-serif";
const arrowColorInfo = "#666666";

const getMaxX = (data) => data.coords.reduce((max, val) => Math.max(max, val.X), 0);
const getMaxY = (data) => data.coords.reduce((max, val) => Math.max(max, val.Y), 0);
const getMinX = (data) => data.coords.reduce((min, val) => Math.min(min, val.X), 99999);
const getMinY = (data) => data.coords.reduce((min, val) => Math.min(min, val.Y), 99999);

function getArced(p1, p2) {
  const dX = p2.X - p1.X;
  p2.cp1X = p1.X + Math.round(dX / arcRadius);
  p2.cp1Y = p1.Y + Math.round(dX / arcRadius);
  p2.cp2X = p2.X - Math.round(dX / arcRadius);
  p2.cp2Y = p2.Y + Math.round(dX / arcRadius);
}

function liftCoords(data) {
  data.nX = 0;
  data.nY = 0;
  if (data.lift) {
    const [first, second] = data.coords.slice(-2);
    const dX = second.X - first.X;
    const dY = second.Y - first.Y;
    const angleA = Math.atan2(dY, dX);
    data.nX = Math.sin(angleA) * arrowLift;
    data.nY = -Math.cos(angleA) * arrowLift;
  }
}

function getMidPoints(data) {
  const [first, second] = data.coords;
  const dX = second.X - first.X;
  const dY = second.Y - first.Y;
  data.mid = {
    X: Math.round(dX / 2) + first.X,
    Y: Math.round(dY / 2) + first.Y,
  };
  if (data.style === "arc") {
    data.mid.Y += Math.round((dX / arcRadius) * 0.7);
  }
}

function plotArrow(c, data, options) {
  const { scale, offsetX, offsetY, highlighted } = options;
  const first = data.coords[0];

  const pX = (coord) => coord * scale + offsetX;
  const pY = (coord) => coord * scale + offsetY;

  c.beginPath();

  c.lineWidth = arrowLineWidth;

  if (highlighted) {
    c.lineWidth = arrowLineWidth + 2;
  }

  liftCoords(data);

  c.moveTo(pX(first.X + data.nX), pY(first.Y + data.nY));

  data.coords.slice(1).reduce((prev, curr) => {
    switch (data.style) {
      case "circle":
        getArced(prev, curr);
        c.bezierCurveTo(
          pX(curr.cp1X + data.nX),
          pY(curr.cp1Y + data.nY),
          pX(curr.cp2X + data.nX),
          pY(curr.cp2Y + data.nY),
          pX(curr.X + data.nX),
          pY(curr.Y + data.nY)
        );
        c.bezierCurveTo(
          pX(-curr.cp1X + data.nX),
          pY(-curr.cp1Y + data.nY),
          pX(-curr.cp2X + data.nX),
          pY(-curr.cp2Y + data.nY),
          pX(first.X + data.nX),
          pY(first.Y + data.nY)
        );
        break;
      case "arc":
        getArced(prev, curr);
      /* falls through */
      case "line":
        if (typeof curr.cp1X !== "undefined") {
          c.bezierCurveTo(
            pX(curr.cp1X + data.nX),
            pY(curr.cp1Y + data.nY),
            pX(curr.cp2X + data.nX),
            pY(curr.cp2Y + data.nY),
            pX(curr.X + data.nX),
            pY(curr.Y + data.nY)
          );
        } else {
          c.lineTo(pX(curr.X + data.nX), pY(curr.Y + data.nY));
        }
        break;
    }
    return curr;
  }, first);
  c.stroke();

  if (data.style === "line") {
    // start and end circles
    c.beginPath();
    c.arc(pX(first.X + data.nX), pY(first.Y + data.nY), arrowEndRadius, 0, Math.PI * 2, true);
    c.fill();
    c.beginPath();
    const [last] = data.coords.slice(-1);
    c.arc(pX(last.X + data.nX), pY(last.Y + data.nY), arrowEndRadius, 0, Math.PI * 2, true);
    c.fill();
  }

  // mid circle
  if (typeof data.midCircle !== "undefined") {
    data.mid = {
      X: data.midCircle.X,
      Y: data.midCircle.Y,
    };
  } else {
    getMidPoints(data);
  }

  let rad = arrowNumberRadius;
  if (highlighted) {
    rad += 5;
  }
  c.beginPath();
  c.arc(pX(data.mid.X + data.nX), pY(data.mid.Y + data.nY), rad, 0, Math.PI * 2, true);
  c.fill();
  c.beginPath();
  c.fillStyle = "#FFFFFF";
  c.font = arrowNumberFont;
  c.textAlign = "center";
  c.textBaseline = "middle";
  if (highlighted) {
    c.font = arrowNumberHighlightFont;
  }
  c.fillText(data.num, pX(data.mid.X + data.nX), pY(data.mid.Y + data.nY));
}

function plotItem(c, data, scale, offsetX, offsetY) {
  const pX = (coord) => coord * scale + offsetX;
  const pY = (coord) => coord * scale + offsetY;

  const first = data.coords[0];

  c.beginPath();

  const accents = (accent) => {
    if (accent.type === "circle") {
      c.arc(
        pX(accent.coords[0].X),
        pY(accent.coords[0].Y),
        (accent.coords[0].R * realCanvasWidth) / 1000,
        0,
        Math.PI * 2,
        true
      );
    } else {
      c.moveTo(pX(accent.coords[0].X), pY(accent.coords[0].Y));
      for (const accCoord of accent.coords.slice(1)) {
        if (typeof accCoord.cp1X !== "undefined") {
          c.bezierCurveTo(
            pX(accCoord.cp1X),
            pY(accCoord.cp1Y),
            pX(accCoord.cp2X),
            pY(accCoord.cp2Y),
            pX(accCoord.X),
            pY(accCoord.Y)
          );
        } else {
          c.lineTo(pX(accCoord.X), pY(accCoord.Y));
        }
      }
    }
    if (accent.type === "area") {
      c.fill();
    }
  };

  const mirrorAccents = (accent) => {
    let lcp = [
      { X: null, Y: null },
      { X: null, Y: null },
    ];
    c.beginPath();
    const [lastCoord] = accent.coords.slice(-1);
    c.moveTo(pX(-lastCoord.X), pY(lastCoord.Y));
    for (let i = accent.coords.length - 1; i >= 0; i--) {
      const accCoord = accent.coords[i];
      const [lcp1, lcp2] = lcp;
      if (lcp1.X) {
        c.bezierCurveTo(
          pX(lcp1.X),
          pY(lcp1.Y),
          pX(lcp2.X),
          pY(lcp2.Y),
          pX(-accCoord.X),
          pY(accCoord.Y)
        );
      } else {
        c.lineTo(pX(-accCoord.X), pY(accCoord.Y));
      }

      if (typeof accCoord.cp1X !== "undefined") {
        lcp1.X = -accCoord.cp2X;
        lcp1.Y = accCoord.cp2Y;
        lcp2.X = -accCoord.cp1X;
        lcp2.Y = accCoord.cp1Y;
      } else {
        lcp = [
          { X: null, Y: null },
          { X: null, Y: null },
        ];
      }
    }
    if (accent.type === "area") {
      c.fill();
    }
    c.stroke();
  };

  c.fillStyle = fillColor;
  c.strokeStyle = fillColor;
  c.lineWidth = 0.1;

  c.moveTo(pX(first.X), pY(first.Y));

  for (const coord of data.coords.slice(1)) {
    if (typeof coord.cp1X !== "undefined") {
      c.bezierCurveTo(
        pX(coord.cp1X),
        pY(coord.cp1Y),
        pX(coord.cp2X),
        pY(coord.cp2Y),
        pX(coord.X),
        pY(coord.Y)
      );
    } else {
      c.lineTo(pX(coord.X), pY(coord.Y));
    }
  }

  if (data.mirror) {
    let lcp = [
      { X: null, Y: null },
      { X: null, Y: null },
    ];

    for (let i = data.coords.length - 1; i >= 0; i--) {
      const coord = data.coords[i];
      const [lcp1, lcp2] = lcp;
      if (lcp1.X) {
        c.bezierCurveTo(pX(lcp1.X), pY(lcp1.Y), pX(lcp2.X), pY(lcp2.Y), pX(-coord.X), pY(coord.Y));
      } else {
        c.lineTo(pX(-coord.X), pY(coord.Y));
      }
      if (typeof coord.cp1X !== "undefined") {
        lcp1.X = -coord.cp2X;
        lcp1.Y = coord.cp2Y;
        lcp2.X = -coord.cp1X;
        lcp2.Y = coord.cp1Y;
      } else {
        lcp = [
          { X: null, Y: null },
          { X: null, Y: null },
        ];
      }
    }
  }

  c.fill();
  c.stroke();

  // draw accents
  c.fillStyle = drawColor;
  c.strokeStyle = drawColor;
  c.lineWidth = itemLineWidth;
  c.lineCap = "butt";
  c.lineJoin = "miter";
  c.miterLimit = 1;

  for (const accent of data.accents) {
    c.beginPath();
    accents(accent);
    c.stroke();
    if (data.mirror && typeof accent.noMirror === "undefined") {
      mirrorAccents(accent);
    }
  } // end for accents
}

function writeItemCanvas(canvas, options) {
  if (!canvas.getContext) {
    return;
  }

  const { model, highlight, matchMap, measurements, selectedSize, isGuide } = options;
  const measurementArrows = model.arrows;
  const itemDrawing = model.itemDrawing;

  const c = canvas.getContext("2d");

  // Store the current transformation matrix
  c.save();
  // Use the identity matrix while clearing the canvas
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Restore the transform
  c.restore();

  // get scale and offsets
  const canvasWidth = realCanvasWidth * (1 - 2 * padding);
  const canvasHeight = realCanvasHeight * (1 - 2 * padding);

  let maxX = getMaxX(itemDrawing) - getMinX(itemDrawing);
  if (itemDrawing.mirror) {
    maxX = getMaxX(itemDrawing) * 2;
  }

  const maxY = getMaxY(itemDrawing) - getMinY(itemDrawing);
  let scale = 1;
  if (maxX !== 0) {
    scale = canvasWidth / maxX;
  }
  if (maxY !== 0 && canvasWidth / canvasHeight > maxX / maxY) {
    scale = canvasHeight / maxY;
  }

  let offsetX = (realCanvasWidth - (getMaxX(itemDrawing) + getMinX(itemDrawing)) * scale) / 2;
  if (itemDrawing.mirror) {
    offsetX = realCanvasWidth / 2;
  }
  const offsetY = (realCanvasHeight - (getMaxY(itemDrawing) + getMinY(itemDrawing)) * scale) / 2;

  const plotArrows = (selectedMeasurements) => {
    for (const [measurement, value] of Object.entries(selectedMeasurements)) {
      const arrow = Object.assign(
        {
          style: isGuide && uiOptions.flatMeasurements ? "line" : "arc",
          color: isGuide
            ? arrowColorInfo
            : Optional.ofNullable(SizeGuideModel.getFit(matchMap.get(measurement)))
                .map((fit) => fit.arrowColor)
                .orElse(arrowColorInfo),
        },
        measurementArrows[measurement]
      );
      if (value > 0 && arrow) {
        c.strokeStyle = c.fillStyle = arrow.color;
        plotArrow(c, arrow, {
          scale,
          offsetX,
          offsetY,
          highlighted: measurement === highlight,
        });
      }
    }
  };

  // item
  plotItem(c, itemDrawing, scale, offsetX, offsetY);
  // arrows
  if (measurements.size) {
    plotArrows(measurements.get(selectedSize) || measurements.values().next().value);
  }
}

class SizeGuideItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    if (
      this.props.highlight !== this.state.highlight ||
      (this.props.selectedProfile.selectDone &&
        (this.props.selectedProfile.id !== this.state.profile ||
          this.props.selectedSize !== this.state.size))
    ) {
      this.draw();
    }
  }

  draw() {
    this.setState({
      profile: this.props.selectedProfile.id,
      size: this.props.selectedSize,
      highlight: this.props.highlight,
    });
    writeItemCanvas(this.canvas, this.props);
  }

  render() {
    return (
      <div className="size-guide-item">
        <canvas
          id="sizeme-item-view"
          width={350}
          height={480}
          ref={(c) => {
            this.canvas = c;
          }}
        />
      </div>
    );
  }
}

SizeGuideItem.propTypes = {
  highlight: PropTypes.string,
  matchMap: PropTypes.instanceOf(Map).isRequired,
  measurements: PropTypes.instanceOf(Map).isRequired,
  selectedSize: PropTypes.string,
  selectedProfile: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(SizeGuideModel).isRequired,
  isGuide: PropTypes.bool.isRequired,
};

export default SizeGuideItem;
