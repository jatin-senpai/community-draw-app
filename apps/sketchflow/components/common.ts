export interface DrawProps {
    type: "rect" | "circle" | "line";
    startX: number;
    startY: number;
    height?: number;
    width?: number;
    endX?: number;
    endY?: number;

}
export let existshapes:DrawProps[] = []
