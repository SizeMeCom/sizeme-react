import React from "react";
import SizeGuideCanvas from "./SizeGuideCanvas";

class SizeGuideItem extends React.Component {

    componentDidMount () {
        this.guideCanvas = new SizeGuideCanvas(this.canvas);
        this.guideCanvas.draw();
    }

    componentWillUnmount () {
        this.guideCanvas.unsubscribe();
    }

    render () {
        return (
            <div className="size-guide-item">
                <canvas id="sizeme-item-view" width={350} height={480}
                        ref={c => { this.canvas = c; }}
                />
            </div>
        );
    }

}

export default SizeGuideItem;