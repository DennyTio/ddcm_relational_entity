export const enum ItemOrConnector{
    none,
    item,
    connector,
}

export type EntitySpecsType = {
    entityTypeName:EntityTypeNames,
    imgName:string, 
    text:string,
    faClass:string,
}

export const enum EntityTypeNames{
    drag="drag",
    and="and",
    drop="drop",
    entity="entity",
    connector="connector"
}

export interface ElementPos extends HTMLDivElement{
    startX?:number;
    startY?:number;
    newX?:number;
    newY?:number;
    foundIndex?:number;
    devX?:number;
    currX?:number;
    currY?:number;
    domRect?:DOMRect;
}