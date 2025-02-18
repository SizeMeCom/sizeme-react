import React from "react";
import PropTypes from "prop-types";

const cmFactor = 5;

const ShirtHips = (props) => {
  const widthPlus = Math.min(150, Math.max(0, props.overlap * cmFactor));
  const arrowPositions = widthPlus > 30 ? "arrowsInside" : "arrowsOutside";
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className="shirtHips"
      viewBox="128 290 262.5 210"
      preserveAspectRatio="xMidYMin meet"
    >
      <defs>
        <marker
          id="triangleInsideShirtHips"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          className="measurementLine"
          orient="auto-start-reverse"
        >
          <path className="noStroke" d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker
          id="triangleOutsideShirtHips"
          viewBox="0 0 10 10"
          refX="1"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          className="measurementLine"
          orient="auto-start-reverse"
        >
          <path className="noStroke" d="M 0 5 L 10 0 L 10 10 z" />
        </marker>
      </defs>

      <g>
        {/* torso */}
        <path
          className="mainLine baseFill"
          d="m349.03101,309.17599c-0.10501,-23.21799 -5.164,-88.552 -0.42102,-158.20599c51.11301,
                -1.62 90.423,2.16 106.33603,4.644c15.91397,2.48401 34.46198,7.343 76.30099,-0.756c41.73401,
                -7.991 77.88202,-3.34801 84.83698,-2.916c1.68701,0.108 5.90204,2.48399 10.85504,5.616c5.47998,
                3.347 8.85297,6.479 13.91095,9.179c7.79901,4.319 15.28204,6.371 7.48303,-4.42799c-1.47504,
                -2.052 -8.43103,-6.04701 -10.75,-8.63901c-1.47504,-1.728 8.11499,0.216 19.07599,
                4.32001c7.271,2.80699 9.06299,5.83099 13.48901,7.45099c2.73999,0.972 9.69598,0.75601 8.74701,
                -0.972c-2.31799,-4.10399 -10.53802,-10.151 -18.33704,-13.715c-10.95996,-5.075 -23.71198,
                -7.66699 -40.047,-11.66299c-27.08496,-6.69501 -57.12097,-11.98701 -75.24701,-15.76601c-36.78098,
                -7.668 -63.23303,-2.376 -80.51697,-2.376c-17.28302,0 -43.314,-8.855 -62.70502,-14.147c-19.392,
                -5.291 -49.74402,-11.4468 -63.97101,-14.6865s-32.14304,-11.8789 -34.77805,-22.678c-2.31799,
                -9.7191 -3.056,-28.1854 2.95099,-42.2241c0.42102,-0.864 2.95102,1.4038 3.37201,0.5399c0.31601,
                -0.7559 0.73807,-1.4039 1.05408,-2.1598c7.90399,-15.1186 6.323,-21.05811 6.323,-21.05811s-2.634,
                -2.69975 -4.742,3.23971c0.52701,-11.87893 4.216,-34.5569 -7.37701,-46.43579s-28.98199,
                -11.339 -28.98199,-11.339s-17.38901,-0.432 -28.981,11.447s-7.905,34.55685 -7.37799,
                46.43578c-2.10701,-5.93947 -4.74199,-3.23971 -4.74199,-3.23971s-1.37001,5.29153 5.05901,
                18.46632c0.42099,0.8639 0.84299,1.7279 1.26399,2.5918c0.106,0.216 2.319,-0.54 2.53,
                -0.324c7.58701,15.0106 7.48201,33.47701 4.847,44.06001c-2.634,10.7991 -20.55,18.35841 -34.778,
                21.5981s-41.312,10.5834 -60.59798,16.1984c-19.39102,5.616 -44.47302,15.443 -62.38921,
                15.659c-17.2837,0.216 -43.8414,-4.644 -80.51641,3.563c-18.0213,3.99599 -47.9515,
                9.71899 -75.03611,16.84698c-16.33521,4.319 -28.9817,7.01901 -39.94229,12.203c-7.693,
                3.77901 -15.91301,9.827 -18.126,14.03899c-0.94901,1.83502 6.007,1.94302 8.74699,
                0.86302c4.426,-1.72702 6.218,-4.75102 13.384,-7.55902c10.9603,-4.319 20.4452,-6.263 18.9698,
                -4.64301c-2.2131,2.591 -9.1687,6.69501 -10.6442,8.74701c-7.5876,10.799 -0.2107,8.74699 7.588,
                4.319c4.9532,-2.80701 8.3256,-5.93901 13.8058,-9.395c4.9532,-3.13199 9.1687,-5.61501 10.8549,
                -5.72298c6.9556,-0.43202 42.8929,-5.61601 84.83731,1.728c41.8389,7.45099 60.3872,2.375 76.3004,
                -0.32402c15.91399,-2.808 69.662,-7.34398 102.121,-6.37198c4.743,69.65399 2.84801,
                133.90799 -1.054,155.93799c-3.901,22.03 -8.433,45.24802 -7.061,96.759c1.373,51.51199 10.43402,
                82.397 9.274,93.08801c-1.159,10.69098 -1.897,27.86096 -1.897,27.86096s-8.957,11.44702 -8.957,
                44.60004s9.274,56.479 8.53601,77.862c-0.73801,21.38098 0.73799,37.79602 -3.37201,44.276c-4.11098,
                6.479 -21.605,27.10498 -15.59799,33.15198c6.007,6.15601 2.63499,6.15601 8.22,5.724s10.01199,
                -0.10797 17.49501,0.10803c4.42598,1.40399 11.17101,-0.54004 13.06801,-14.255s6.00699,
                -16.73804 6.323,-21.70599c0.422,-4.96704 -4.84801,-9.935 -3.68799,-20.95001c1.159,
                -11.01501 8.64098,-51.94299 13.38399,-74.83698c4.00499,-19.43805 7.58801,-24.29803 6.00699,
                -43.08801c-1.05399,-11.66302 -4.42598,-17.927 -0.73798,-30.88605c3.689,-12.95798 12.33098,
                -83.58395 15.703,-99.24298l12.22501,-58.53c0.211,-1.29599 2.108,-1.40399 2.42401,0l11.06598,
                57.01901c0,0 2.95102,63.71399 5.58502,74.405c2.63498,10.69101 12.33099,39.30801 11.17099,
                45.46402c-1.159,6.15497 -4.42599,25.16199 -2.95099,35.85199c1.47598,10.69202 14.12198,
                85.52899 15.28198,93.08801c0,4.21198 -0.73804,11.01495 -1.47598,13.71497c-0.737,2.70001 2.63498,
                23.65002 4.84799,32.82904c2.21301,9.17896 7.483,15.98297 16.33499,14.14697c8.95801,
                0.75598 16.01898,-1.51202 18.65402,-2.70001s9.27399,-9.17902 1.89691,-17.17102c-7.483,
                -7.99097 -18.65399,-17.16998 -17.495,-41.25195c1.16,-24.08203 16.336,-80.56 11.909,
                -110.69c-4.42593,-30.12903 -9.27399,-58.42297 -7.79794,-77.42902c1.47501,-19.11401 7.79794,
                -65.44199 9.06302,-74.83701c1.47501,-12.203 5.79599,-62.095 -0.42206,-100.323z"
        />

        {/* nipples */}
        <circle className="mainLine noFill" cx="229.47" cy="180" r="4.906" />
        <circle className="mainLine noFill" cx="322.43" cy="180" r="4.906" />

        {/* belly button */}
        <circle className="mainLine noFill" cx="276.331" cy="308.234" r="2.534" />

        {/* pants with pockets and button */}
        <path
          className="mainLine otherBaseFill"
          d="
                         M 356.76001,685.56201
                         l -1.819,-292.09702
                         l -2.7225,-53.91998
                         l -154.69001,0
                         l -3.59149,55.09799
                         l -5.433,289.87799
                         l 47.26199,0
                         l 33.063,-249.94302
                         l 9.69101,0
                         l 25.50998,251.19302z"
        />
        <path className="mainLine noFill" d="M230.208,364.504c0,0-3.344,24.618-27.826,25.548" />
        <path className="mainLine noFill" d="M317.346,365.795c0,0,3.346,24.618,27.826,25.548" />
        <circle className="mainLine noFill" cx="276.331" cy="355.234" r="5.906" />
      </g>
      <path
        className="mainLine overlayFill"
        d={`
                M ${186.75 - widthPlus} 537.89999
                q  0 -120 10 -381.23331
                l -232.00002 10.33331
                l -1.66667 -33
                l ${256.33336 + widthPlus} -43.66669
                c 33.77777 27.55557 75.55554 30.11112 110.33331 0
                l ${256.33336 + widthPlus} 43.66669
                l -1.66667 33
                l -232.00002 -10.33331
                q 10 260 10 381.23331 z`}
      />

      {/* measurement arrow line */}
      <path
        className={`measurementLine noFill ${arrowPositions}`}
        d={`
                M ${188 - widthPlus},385
                L 194, 385`}
      />
    </svg>
  );
};

ShirtHips.propTypes = {
  overlap: PropTypes.number,
};

ShirtHips.defaultProps = {
  overlap: 0,
};

export default ShirtHips;
