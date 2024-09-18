import { EntityTypeNames } from "../canvas/entity-objects.types";

export interface EntityPropsType {
    entityTypeName:EntityTypeNames,
    faClass:string,//font-awesome class + custom class
    entityName:string|"",
    layer:number,
    posX:number,
    posY:number,
    offsetWidth:number,
    offsetHeight:number,
}

export interface EntitiesState{
    [key:string]:EntityPropsType;
}

export type UpdateCanvasEntityProps = {
    entityId?:string,
    entityTypeName?:EntityTypeNames,
    faClass?:string,//font-awesome class + custom class
    entityName?:string|"",
    layer?:number,
    posX?:number,
    posY?:number,
    offsetWidth?:number,
    offsetHeight?:number,
}

export type dataPos = {
    postype:string;
}

export type connectorPos = {
    width:number|string,
    top:number|string,
    left:number|string,
    rotation:number|string,
}

export type ConnectorOffsets = {
    offsetTop:number,
    offsetLeft:number,
    offsetWidth:number,
    offsetHeight:number,
}

export const enum PosTypeEnum{
    top,
    bottom,
    left,
    right,
}

export type DropPosNode = {x:number,y:number};