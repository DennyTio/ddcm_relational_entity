import { ReactElement } from "react";
import { AppDispatch } from "./redux/store";
import { EntityTypeNames } from "./canvas/entity-objects.types";

export type moduleProps = {
    layer:number,
    dispatch:AppDispatch,
}

export const enum EntityIcons{
    compute="calculator-solid.svg",
    dataset="table-solid.svg",
    csv="file-csv-solid.svg",
    externalVariable="list-solid.svg",
}

export const enum ModalType{
    default,
    entityNameEdit,
}

export interface ModalProps{
    entityId:string|undefined; 
    modalID:string; 
    setModalEntityID:React.Dispatch<React.SetStateAction<string|undefined>>; 
    children?:JSX.Element|JSX.Element[]|null|undefined; 
}

export const enum fieldSize{
    small = "100px",
    medium = "240px",
    large = "450px",
}

export interface ButtonProps{
    title?:string;
    onClick?: Function;
    additionalClass?:string;
}

export interface APIDataset {
    [key: string]: any;
}

export type RelationType = {
    targetField:string,
    sourceField:string,
}

export const enum JoinStyle{
    nestedOneToMany,
    sqlLeftJoin,
}

export type SourceData = {
    [key:string]:{
        data:APIDataset[],
        relation:RelationType[]
    }
}

export type ReferenceResult = {
    [key:string]:{
        fieldNames:string[],
        row:number
    }
}

export type APIStructure = {
    data: APIDataset[]
}

export type ComputeError = {
    error:{
        message:string,
        position:{row:number,part:string,index:number}
    }
  }