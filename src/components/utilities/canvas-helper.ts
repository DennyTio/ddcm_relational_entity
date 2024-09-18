import { AppDispatch } from "../redux/store"
import { setConnectorToCanvas,ConnectorState, ConnectorStates, connectorClicked, setMultipleConnectorToCanvas, clearSelections, updateCanvasEntity, deleteCanvas, deleteConnector } from "../redux/canvas-reducers";
import { v4 as uuid } from "uuid";

import { EntityTypeNames } from "../canvas/entity-objects.types";
import { PosTypeEnum, ConnectorOffsets, DropPosNode, connectorPos, UpdateCanvasEntityProps } from "../redux/canvas-reducers.types";

export type GetEntDimension = {
    entMinWidth:number,
    entMinHeight:number,
    entPadding:number
}

export type ProperPos = {
    posX:number,
    posY:number
}
export class CanvasHelper {
    private entMinWidth = 0;
    private entMinHeight = 0;
    private entPadding = 0;

    constructor(){
        let style = getComputedStyle(document.body);
        this.entMinWidth = Number(style.getPropertyValue('--ent-min-width').replace(/px|rem|em/g,''));
        this.entMinHeight = Number(style.getPropertyValue('--ent-min-height').replace(/px|rem|em/g,''));
        this.entPadding = Number(style.getPropertyValue("--ent-item-padding").replace(/px|rem|em/g,''));
    }

    getEntDimension():GetEntDimension{
        return {
            entMinWidth:isNaN(this.entMinWidth)? 0 : this.entMinWidth,
            entMinHeight:isNaN(this.entMinHeight)? 0 : this.entMinHeight,
            entPadding:isNaN(this.entPadding)? 0 : this.entPadding
        }
    }

    getProperPos(clientX:number,clientY:number):ProperPos{
        const {entMinWidth, entMinHeight, entPadding}:GetEntDimension = this.getEntDimension();
        const canvasObj = document.getElementById("canvas");
        const offsetX = canvasObj?.offsetLeft || 0;
        const offsetY = canvasObj?.offsetTop || 0;
        const centerX = Math.floor((entMinWidth + (entPadding * 2))/2);
        const centerY = Math.floor((entMinHeight + (entPadding * 2))/2);
        return {
            posX: clientX - (offsetX + entPadding),
            posY: clientY - (offsetY + entPadding)
        }
    }
}

export const getCssVariable = (varName:string):string=>{
    let style = getComputedStyle(document.body);
    const val = style.getPropertyValue(varName).replace(/px|rem|em/g,'');
    return val;
}

export class ConnectorHelper {
    private dispatch:AppDispatch;
    private connInitialWidth:number;
    private sectionGap:number;
    private posTypeCheck:string[] = ["top","left","bottom","right"];
    private connectorColor:string;
    private referencedConns:{connectorID:string, posType:PosTypeEnum, stationedEntityID:string, stationedPosType:PosTypeEnum, stationedX:number, stationedY:number, node:1|2}[];
    constructor(dispatch:AppDispatch){
        this.dispatch = dispatch;
        // this.connInitialWidth = 159;
        let style = getComputedStyle(document.body);
        this.sectionGap = Number(style.getPropertyValue('--ent-item-padding').replace(/px|rem|em/g,'') || "0");
        this.connInitialWidth = Number(style.getPropertyValue('--connector-line-min-width').replace(/px|rem|em/g,'') || "0");
        this.connectorColor = style.getPropertyValue('--connector-color');
        this.referencedConns = [];
    }

    getPos(offsets:ConnectorOffsets, posType:PosTypeEnum):DropPosNode{
        let pos = {x:0,y:0}, rotation:number = 0;

        switch(posType){
            case PosTypeEnum.top:
                pos = {
                    x: offsets.offsetLeft + (offsets.offsetWidth / 2),
                    y: offsets.offsetTop + (this.sectionGap) - 3,
                };
                break;
            case PosTypeEnum.bottom:
                pos = {
                    x: offsets.offsetLeft + (offsets.offsetWidth / 2),
                    y: offsets.offsetTop + (offsets.offsetHeight - this.sectionGap) - 6,
                };
                break;
            case PosTypeEnum.left:
                pos = {
                    x: (offsets.offsetLeft + this.sectionGap) + 3,
                    y: offsets.offsetTop + (offsets.offsetHeight / 2) - 5,
                };
                break;
            case PosTypeEnum.right:
                pos = {
                    x: offsets.offsetLeft + (offsets.offsetWidth - this.sectionGap)- 3,
                    y: offsets.offsetTop + (offsets.offsetHeight / 2) - 5,
                };
                break;
            default:
                pos = {
                    x: 0,
                    y: 0,
                };
                break;
        }

        return pos;
    }

    calcLineAngle(x1:number,y1:number,x2:number,y2:number):connectorPos{
        // Calculate the distance
        var distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        // Calculate the angle
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var angleDeg = angle * (180 / Math.PI);

        // Set the width, position, and rotation of the line
        return {
            width: distance,
            top: y1,
            left: x1,
            rotation: angleDeg,
        }
    }

    setConnectorLink(entityId:string, targetEntityID:string, sourceOffsets:ConnectorOffsets, targetOffsets:ConnectorOffsets, sourcePosType:PosTypeEnum, targetPosType:PosTypeEnum, connId?:string):string{
        const connectorID = connId || uuid();
        const bothNodePos = {
            entityNodePos1: {...this.getPos(sourceOffsets,sourcePosType),...{posType:sourcePosType}},
            entityNodePos2: {...this.getPos(targetOffsets,targetPosType),...{posType:targetPosType}},
        }

        const {width,top,left,rotation} = this.calcLineAngle(bothNodePos.entityNodePos1.x,
                                                              bothNodePos.entityNodePos1.y,
                                                              bothNodePos.entityNodePos2.x,
                                                              bothNodePos.entityNodePos2.y);
        
        const connectorProps:ConnectorState = {
            entityId1: entityId,
            entityId2: targetEntityID,
            isSelected:false,
            width: width + "px",
            top:`${top}px`,
            left:`${left}px`,
            transform:`rotate(${rotation}deg)`,
            ...bothNodePos
        }

        this.dispatch(setConnectorToCanvas(connectorID,connectorProps));

        return connectorID
    }

    setClicked(id:string){
        this.dispatch(connectorClicked(id));
    }
    
    setAlterConnector(connectors:ConnectorStates, entityId:string, isDrag:boolean, entityElmt?:HTMLDivElement){   
        let connectorElmt:HTMLDivElement;
        
        if(isDrag){// isDrag === true -> entity is being dragged, set all connector's background with referenced entityIds to be blurred
            for(const [connectorID, props] of Object.entries(connectors)){
                connectorElmt = (document.getElementById(`cl-${connectorID}`) as HTMLDivElement);
                if(!connectorElmt) continue;
                if(props.entityId1===entityId){
                    connectorElmt.style.background = `linear-gradient(to left, ${this.connectorColor}, transparent 40%)`;
                    this.referencedConns.push({
                        connectorID, 
                        posType:props.entityNodePos1.posType,
                        node:1,
                        stationedEntityID:props.entityId2 as string,
                        stationedPosType:props.entityNodePos2.posType,
                        stationedX: props.entityNodePos2.x, 
                        stationedY:props.entityNodePos2.y});
                }else if(props.entityId2===entityId){
                    connectorElmt.style.background = `linear-gradient(to right, ${this.connectorColor}, transparent 40%)`;
                    this.referencedConns.push({
                        connectorID, 
                        node:2,
                        posType:props.entityNodePos2.posType,
                        stationedEntityID:props.entityId1 as string,
                        stationedPosType:props.entityNodePos1.posType,
                        stationedX: props.entityNodePos1.x, 
                        stationedY:props.entityNodePos1.y});
                }
            };
        }else{// isDrag === false -> entity is being dropped, set all connector's background with referenced entityIds back to initial
            if(!entityElmt) return;
            const targetOffsets:ConnectorOffsets = {
                offsetTop:entityElmt.offsetTop,
                offsetLeft:entityElmt.offsetLeft,
                offsetWidth:entityElmt.offsetWidth,
                offsetHeight:entityElmt.offsetHeight,
            };
            const chosenConnStates:ConnectorStates = {};
            for(const props of this.referencedConns){
                connectorElmt = (document.getElementById(`cl-${props.connectorID}`) as HTMLDivElement);
                if(!connectorElmt) continue;
                
                const newPos = this.getPos(targetOffsets,props.posType) as DropPosNode;
                const bothNodePos = {
                    entityNodePos1: {
                        x: props.node===1 ? newPos.x : props.stationedX,
                        y: props.node===1 ? newPos.y : props.stationedY,
                        posType: props.node===1 ? props.posType : props.stationedPosType,
                    },
                    entityNodePos2: {
                        x: props.node===2 ? newPos.x : props.stationedX,
                        y: props.node===2 ? newPos.y : props.stationedY,
                        posType: props.node===2 ? props.posType : props.stationedPosType,
                    },
                }
                const {width,top,left,rotation} = this.calcLineAngle(bothNodePos.entityNodePos1.x,
                    bothNodePos.entityNodePos1.y,
                    bothNodePos.entityNodePos2.x,
                    bothNodePos.entityNodePos2.y);

                chosenConnStates[props.connectorID] = {
                        entityId1: props.node===1 ? entityId : props.stationedEntityID,
                        entityId2: props.node===2 ? entityId : props.stationedEntityID,
                        isSelected:false,
                        width: width + "px",
                        top:`${top}px`,
                        left:`${left}px`,
                        transform:`rotate(${rotation}deg)`,
                        ...bothNodePos
                }

                connectorElmt.style.background = this.connectorColor;//set blurred connector to initial background color;
            }
            
            this.dispatch(setMultipleConnectorToCanvas(chosenConnStates));//set multiple connector new position and angle;
            this.referencedConns = [];//reset the referenced connector
        }
    }

    clearSelections(){
        this.dispatch(clearSelections());
    }

    setNoHover(isNoHover:boolean){
        const connectors = document.querySelectorAll(".connector-bg");
        const nodeSection = document.querySelectorAll(".ent-section");
        connectors.forEach(element => {
            if(isNoHover){
                element.classList.add("connector-no-hover");
            }else{
                element.classList.remove("connector-no-hover");
            }
        });

        nodeSection.forEach(element => {
            if(isNoHover){
                element.classList.add("node-no-hover");
            }else{
                element.classList.remove("node-no-hover");
            }
        });
    }

    deleteConnector = (connectorId:string)=>{
        this.dispatch(deleteConnector(connectorId));
    }
}

export class EntityHelper {
    constructor(private dispatch:AppDispatch){}

    updateCanvas = ((props: UpdateCanvasEntityProps)=>{
        this.dispatch(updateCanvasEntity(props));
    });

    deleteConnectorsByEntity = (currentEntityId:string, connectorStates: ConnectorStates)=>{
        //delete all connectors tied to targeted entityId
        for(const [connectorId, props] of Object.entries(connectorStates)){
            if(props.entityId1 === currentEntityId || props.entityId2 === currentEntityId){
                this.dispatch(deleteConnector(connectorId));
            }
        }
    }

    //delete Entity Object
    deleteEntity = (currentEntityId:string)=>{
        this.dispatch(deleteCanvas(currentEntityId));
    }
}

