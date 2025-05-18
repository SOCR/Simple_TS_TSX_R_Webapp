declare module 'react-plotly.js' {
  import { Component } from 'react';

  interface PlotParams {
    data: any[];
    layout?: any;
    config?: any;
    frames?: any[];
    style?: React.CSSProperties;
    className?: string;
    onInitialized?: (figure: any) => void;
    onUpdate?: (figure: any) => void;
    onPurge?: (figure: any) => void;
    onError?: (error: Error) => void;
    onAfterPlot?: () => void;
    onRelayout?: (eventData: any) => void;
    onRedraw?: () => void;
    onSelected?: (eventData: any) => void;
    onSelecting?: (eventData: any) => void;
    onUnselect?: () => void;
    onHover?: (eventData: any) => void;
    onUnhover?: (eventData: any) => void;
    onClick?: (eventData: any) => void;
    onDoubleClick?: (eventData: any) => void;
    onRelayouting?: (eventData: any) => void;
    onRestyle?: (eventData: any) => void;
    onDeselect?: () => void;
    onBeforeHover?: (eventData: any) => void;
    onHovering?: (eventData: any) => void;
    onUnhovering?: (eventData: any) => void;
    onClickAnnotation?: (eventData: any) => void;
    onDoubleClickAnnotation?: (eventData: any) => void;
    onSelectedPoints?: (eventData: any) => void;
    onSelectingPoints?: (eventData: any) => void;
    onUnselectPoints?: () => void;
    onDeselectPoints?: () => void;
    onSelectedPointsHover?: (eventData: any) => void;
    onSelectedPointsUnhover?: (eventData: any) => void;
    onSelectedPointsClick?: (eventData: any) => void;
    onSelectedPointsDoubleClick?: (eventData: any) => void;
    onSelectedPointsRelayout?: (eventData: any) => void;
    onSelectedPointsRestyle?: (eventData: any) => void;
    onSelectedPointsDeselect?: () => void;
    onSelectedPointsBeforeHover?: (eventData: any) => void;
    onSelectedPointsHovering?: (eventData: any) => void;
    onSelectedPointsUnhovering?: (eventData: any) => void;
    onSelectedPointsClickAnnotation?: (eventData: any) => void;
    onSelectedPointsDoubleClickAnnotation?: (eventData: any) => void;
  }

  class Plot extends Component<PlotParams> {}

  export default Plot;
} 