export interface DrawProps {
    type: "rect" | "circle" | "line" | "text";
    startX: number;
    startY: number;
    height?: number;
    width?: number;
    endX?: number;
    endY?: number;
    radius?: number;
    text?: string;

}
// common.ts
export const existshapes: DrawProps[] = []; 

