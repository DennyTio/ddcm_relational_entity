import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

import { EntitiesState, UpdateCanvasEntityProps, PosTypeEnum } from "./canvas-reducers.types";

//CANVAS OBJECTS (ENTITY)
export const addEntityToCanvas = createAction("addEntityToCanvas", function prepare(entProps:EntitiesState){
    return {
        payload:entProps
    }
});

export const updateCanvasEntity = createAction("updateCanvasEntity", function prepare(entProps:UpdateCanvasEntityProps){
    return {
        payload:entProps
    }
});

export const deleteCanvas = createAction("deleteCanvas", function prepare(entityId:string){
    return {payload:entityId};
});

const suggestName = (state:EntitiesState, name:string):string=>{
    let list = Object.values(state);
    let incrementFlag = 0;
    let foundIndex = 0;

    let newName = name.substring(0,1).toUpperCase() + (name.length > 1 ? name.substring(1,name.length) : "")
    while(foundIndex >= 0){
        foundIndex = list.findIndex((item)=>item.entityName === newName);
        if(foundIndex !== -1){
            incrementFlag += 1;
            newName = `${newName}_${incrementFlag}`;
        }else break;
    }
    //replace spaces into _
    newName = newName.replace(/\s/g, '_');
    return newName;
}

export const createCanvasState = createAction("createCanvasState", function prepare(state){
    return {payload:state};
});

export const canvasReducer = createReducer<EntitiesState>({} as EntitiesState, (builder) => {
    builder.addCase(createCanvasState, (state,action)=>{
        state = action.payload;
        return state;
    })
    .addCase(addEntityToCanvas, (state, action) => {
        const entities = action.payload as EntitiesState;

        for(const [entityId, item] of Object.entries(entities)){
            state[entityId] = {...item, entityName:suggestName(state,item.entityName || item.entityTypeName)};
        }

        return state;
    })
    .addCase(updateCanvasEntity, (state, action)=>{
        const newProps = action.payload as UpdateCanvasEntityProps;
        const entityId = newProps.entityId as string;
        delete newProps.entityId;
        if(newProps.entityName){
            newProps.entityName = suggestName(state, newProps.entityName);
        }
        state[entityId] = {...state[entityId], ...newProps};
        return state;
    })
    .addCase(deleteCanvas,(state, action) => {
        const entityId = action.payload as string;
        delete state?.[entityId];
    })
});

//CANVAS OBJECTS(CONNECTOR)
export type ConnectorState = {
    entityId1?:string,
    entityNodePos1:{x:number,y:number,posType:PosTypeEnum},
    entityId2?:string,
    entityNodePos2:{x:number,y:number,posType:PosTypeEnum},
    isSelected:boolean,
    width?:string,
    top?:string,
    left?:string,
    transform?:string,
    noDelete?:boolean
}

export type ConnectorStates = {
    [key:string]:ConnectorState,
}

export const setConnectorToCanvas = createAction("setConnectorToCanvas", function prepare(id:string,connProps:ConnectorState){
    return {
        payload:{
            id,
            connProps,
        }
    }
});

export const setMultipleConnectorToCanvas = createAction("setMultipleConnectorToCanvas", function prepare(connStates:ConnectorStates){
    return {
        payload:connStates
    }
});

export const connectorClicked = createAction("connectorClicked", function prepare(id:string){
    return {
        payload:id
    }
});

export const clearSelections = createAction("clearSelections", function prepare(){
    return {payload:null};
});

export const deleteConnector = createAction("deleteConnector", function prepare(connectorId:string){
    return {payload:connectorId};
});

export const createConnectorState = createAction("createConnectorState", function prepare(state: ConnectorStates){
    return {payload:state};
});

export const connectorReducer = createReducer<ConnectorStates>({} as ConnectorStates, (builder) => {
    builder.addCase(createConnectorState, (state, action)=>{
        state = action.payload;
        return state;
    })
    .addCase(setConnectorToCanvas, (state: ConnectorStates, action) => {
        const id = action.payload.id;
        const connParams = action.payload.connProps as ConnectorState;
        for(const val of Object.values(state)){
            val.isSelected = false;
        }
        state[id] = {...state[id], ...connParams};
        return state;
    })
    .addCase(setMultipleConnectorToCanvas, (state: ConnectorStates, action) => {
        const chosenConnStates = action.payload as ConnectorStates;
        for(const [connectorID,props] of Object.entries(chosenConnStates)){
            state[connectorID] = props;
        }
        return state;
    })
    .addCase(connectorClicked,(state:ConnectorStates, action) => {
        const id = action.payload;
        for(const [connID,val] of Object.entries(state)){
            if(connID !== id){
                val.isSelected = false;
            }else{
                val.isSelected = true;
            }
        }
    })
    .addCase(clearSelections,(state:ConnectorStates, action) => {
        const id = action.payload;
        for(const [connID,val] of Object.entries(state)){
            val.isSelected = false;
        }
        return state;
    })
    .addCase(deleteConnector, (state, action)=>{
        const connectorId = action.payload as string;
        delete state?.[connectorId];
    })
});