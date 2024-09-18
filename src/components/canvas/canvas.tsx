import { FC, useRef, useContext, useCallback, useEffect, Fragment, useState, ReactNode, useMemo } from "react";
import { EntityPropsType, EntitiesState, UpdateCanvasEntityProps, ConnectorOffsets, PosTypeEnum } from "../redux/canvas-reducers.types";
import { AppDispatch, store, RootState } from "../redux/store";
import { EntityDragContext, DragContext } from "./main";
import { ItemOrConnector, EntityTypeNames, ElementPos } from "./entity-objects.types";
import { useSelector } from "react-redux";
import { CanvasHelper } from "../utilities/canvas-helper";
import { v4 as uuid } from "uuid";
import Connector from "../entity-setup/connector";

//
import { ConnectorStates, updateCanvasEntity, addEntityToCanvas } from "../redux/canvas-reducers";

export const CanvasItem:FC<{objProps:{id:string}&EntityPropsType, dispatch:AppDispatch, connectorStates:ConnectorStates}> = ({objProps, dispatch, connectorStates})=>{
    const {entityDragFlag, connectorHelper, setEntityDragFlag} = useContext(EntityDragContext) as DragContext;
    const divRef = useRef<HTMLDivElement | null>(null);
    
    const mouseMove = useCallback((e: MouseEvent | React.MouseEvent):void => {
        if (divRef.current) {
            e.preventDefault();
            (divRef.current as ElementPos).newX = ((divRef.current as ElementPos).startX || 0) - e.clientX;
            (divRef.current as ElementPos).newY = ((divRef.current as ElementPos).startY || 0) - e.clientY;
    
            (divRef.current as ElementPos).startX = e.clientX;
            (divRef.current as ElementPos).startY = e.clientY;
            divRef.current.style.top = `${divRef.current.offsetTop - ((divRef.current as ElementPos).newY || 0)}px`;
            divRef.current.style.left = `${divRef.current.offsetLeft - ((divRef.current as ElementPos).newX || 0)}px`;
        }
      }, []);
    
    const mouseUp = useCallback((e: MouseEvent | React.MouseEvent)=>{
        if (divRef.current) {
            if(divRef.current.offsetTop < 0) divRef.current.style.top = "0";
            if(divRef.current.offsetLeft < 0) divRef.current.style.left = "0";
            connectorHelper.setNoHover(false);
            connectorHelper.setAlterConnector({},objProps.id,false,divRef.current);

            const offset:UpdateCanvasEntityProps = {
                entityId:objProps.id,
                posX:divRef.current.offsetLeft,
                posY:divRef.current.offsetTop,
            }
            dispatch(updateCanvasEntity(offset))
        }
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
    },[mouseMove, objProps.id, connectorHelper, dispatch]);

    const mouseDown = useCallback((e:MouseEvent | React.MouseEvent)=>{
        e.preventDefault();
        (divRef.current as ElementPos).startX = e.clientX;
        (divRef.current as ElementPos).startY = e.clientY;
        connectorHelper.setAlterConnector(connectorStates,objProps.id,true);
        connectorHelper.setNoHover(true);
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)

    },[mouseMove,mouseUp,connectorStates, connectorHelper, objProps.id]);

    const connectorDrop = useCallback((e:DragEvent | React.DragEvent)=>{
        if(!divRef.current) return;
        setEntityDragFlag(ItemOrConnector.none);
        const current = e.currentTarget as HTMLDivElement;
        if(current) current.style.backgroundColor = "transparent";

        if(entityDragFlag === ItemOrConnector.connector){
            if(!e.dataTransfer) return;
            const entityId = e.dataTransfer.getData("entityId");
            const targetEntityID = objProps.id;
            if(entityId === targetEntityID) return;

            const sourcePosType = Number(e.dataTransfer.getData("posType")) as PosTypeEnum;
            const targetPosType = Number(current.dataset.postype) as PosTypeEnum;
            
            // const connectorID = e.dataTransfer.getData("connectorID");
            let sourceOffsets: ConnectorOffsets | string = e.dataTransfer.getData("entityOffsets");
            if(!sourceOffsets) return;
            sourceOffsets = JSON.parse(sourceOffsets) as ConnectorOffsets;

            const targetOffsets = {
                offsetTop:divRef.current.offsetTop,
                offsetLeft:divRef.current.offsetLeft,
                offsetWidth:divRef.current.offsetWidth,
                offsetHeight:divRef.current.offsetHeight,
            }
            
            connectorHelper.setConnectorLink(entityId,targetEntityID,sourceOffsets,targetOffsets,sourcePosType,targetPosType);
        }
    },[entityDragFlag, objProps, connectorHelper, setEntityDragFlag]);

    useEffect(()=>{
        if(!divRef.current) return;
        const offset:UpdateCanvasEntityProps = {
            entityId:objProps.id,
            offsetWidth:divRef.current?.offsetWidth,
            offsetHeight:divRef.current?.offsetHeight,
        }
        dispatch(updateCanvasEntity(offset))
    },[dispatch, objProps.id])

    useEffect(()=>{
        if(!divRef.current) return;
        if(!objProps.offsetWidth || !objProps.offsetHeight){
            const offset:UpdateCanvasEntityProps = {
                entityId:objProps.id,
                offsetWidth:divRef.current?.offsetWidth,
                offsetHeight:divRef.current?.offsetHeight,
            }
            dispatch(updateCanvasEntity(offset))
        }
    }, [dispatch, objProps.offsetWidth, objProps.offsetHeight, objProps.id])

    useEffect(()=>{
        (divRef.current as ElementPos).style.top = objProps.posY + "px";
        (divRef.current as ElementPos).style.left = objProps.posX + "px";
    },[objProps.posX,objProps.posY]);

    const dragOver = useCallback((e:DragEvent | React.DragEvent)=>{
        if(entityDragFlag === ItemOrConnector.item){
            e.stopPropagation();
        }
    },[entityDragFlag]);

    const dragOverSection = useCallback((e:DragEvent | React.DragEvent)=>{
        if(entityDragFlag === ItemOrConnector.connector){
            e.preventDefault();
        }
    },[entityDragFlag])

    const dragEnter = useCallback((e:DragEvent | React.DragEvent)=>{
        if(entityDragFlag === ItemOrConnector.item){
            e.stopPropagation();
        }else if(entityDragFlag === ItemOrConnector.connector){
            // e.stopPropagation();
            // e.preventDefault();
            let currentDiv = e.currentTarget as HTMLDivElement;
            currentDiv.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }
    },[entityDragFlag]);

    const dragLeave = useCallback((e:DragEvent | React.DragEvent)=>{
        if(entityDragFlag === ItemOrConnector.connector){
            let currentDiv = e.currentTarget as HTMLDivElement;
            currentDiv.style.backgroundColor = "transparent";
        }
    },[entityDragFlag]);

    const dragStart = useCallback((e:DragEvent|React.DragEvent,posType:PosTypeEnum) => {
        if(!e.dataTransfer || !e.target) return;
        if(!divRef.current) return;
        setEntityDragFlag(ItemOrConnector.connector);
        const offset = {
            offsetTop:divRef.current.offsetTop,
            offsetLeft:divRef.current.offsetLeft,
            offsetWidth:divRef.current.offsetWidth,
            offsetHeight:divRef.current.offsetHeight,
        }
        e.dataTransfer.setData("entityId", objProps.id);
        e.dataTransfer.setData("entityOffsets",JSON.stringify(offset));
        e.dataTransfer.setData("posType",posType.toString());
    },[objProps, setEntityDragFlag]);

    const dragEnd = useCallback((e:DragEvent|React.DragEvent)=>{
        setEntityDragFlag(ItemOrConnector.none);
    },[setEntityDragFlag]);
    
    return (
        <Fragment>
            <div id={objProps.id} ref={divRef} className={"canvas-item"} onDragOver={dragOver} style={{transition:"opacity 5s ease"}}>
                <div className="ent-section-container">
                    <div data-postype={PosTypeEnum.top} className="ent-section section-top" onDrop={connectorDrop} onDragOver={dragOverSection} onDragEnter={dragEnter} onDragLeave={dragLeave}><div title="Drag this node to add a connector" className="connector-node" onDragStart={(e)=>{dragStart(e,PosTypeEnum.top)}} onDragEnd={dragEnd} draggable={true}></div></div>
                    <div data-postype={PosTypeEnum.right} className="ent-section section-right" onDrop={connectorDrop} onDragOver={dragOverSection} onDragEnter={dragEnter} onDragLeave={dragLeave}><div title="Drag this node to add a connector" className="connector-node" onDragStart={(e)=>{dragStart(e,PosTypeEnum.right)}} onDragEnd={dragEnd} draggable={true}></div></div>
                    <div data-postype={PosTypeEnum.bottom} className="ent-section section-bottom" onDrop={connectorDrop} onDragOver={dragOverSection} onDragEnter={dragEnter} onDragLeave={dragLeave}><div title="Drag this node to add a connector" className="connector-node" onDragStart={(e)=>{dragStart(e,PosTypeEnum.bottom)}} onDragEnd={dragEnd} draggable={true}></div></div>
                    <div data-postype={PosTypeEnum.left} className="ent-section section-left" onDrop={connectorDrop} onDragOver={dragOverSection} onDragEnter={dragEnter} onDragLeave={dragLeave}><div title="Drag this node to add a connector" className="connector-node" onDragStart={(e)=>{dragStart(e,PosTypeEnum.left)}} onDragEnd={dragEnd} draggable={true}></div></div>
                </div>
                <div className="canvas-body">
                    <div className="canvas-item-draggable" onMouseDown={mouseDown}><i title={"Drag to move"} className={`fa-solid fa-arrows-up-down-left-right`}/></div>
                    <div className="canvas-body-header">
                        <i className={objProps.faClass}></i>
                        <span>{objProps.entityName}</span>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const Canvas:FC<{dispatch: AppDispatch}> = ({dispatch})=>{
    const {entityDragFlag,connectorHelper} = useContext(EntityDragContext) as DragContext;
    const entities = useSelector((state:RootState):EntitiesState=>{
        return state.canvas
    });

    const connectors = useSelector((state:RootState):ConnectorStates=>{
        return state.connectors;
    })
    const [entitiesState, setEntitiesState] = useState<ReactNode[]>([]);

    const allowDrop = useCallback((e:DragEvent | React.DragEvent)=>{
        if(entityDragFlag === ItemOrConnector.item){
            e.preventDefault();
        }
    },[entityDragFlag]);

    const CanvasHelperIns:CanvasHelper = useMemo(()=> new CanvasHelper(),[]);

    const onDrop = useCallback((e:DragEvent | React.DragEvent)=>{
        if(!e.dataTransfer) return;
        const dataTransfer = e.dataTransfer.getData("entitySpecsId");
        if(!dataTransfer) return;
        const {posX,posY} = CanvasHelperIns.getProperPos(e.clientX,e.clientY);
        const dataTransferArr = dataTransfer.split("|");//index:0 is entityTypeName, 1 is font-awesome class + custom class
        const entityTypeName = dataTransferArr[0] as EntityTypeNames;
        const params = {
            id:uuid(),
            entityTypeName: entityTypeName,
            entityName: "",
            faClass:dataTransferArr[1],
            layer:0,
            posX,
            posY,
        };
        
        dispatch(addEntityToCanvas({
            [params.id as string]: {
                entityTypeName:params.entityTypeName,
                faClass:params.faClass,//font-awesome class + custom class
                entityName:"",
                layer:params.layer,
                posX:params.posX,
                posY:params.posY,
                offsetWidth:0,
                offsetHeight:0
            }
        }));
        
    },[CanvasHelperIns, dispatch]);

    useEffect(()=>{
        const entItems:ReactNode[] = [];
        let i = 1;
        for(const [entityId, val] of Object.entries(entities)){
            entItems.push(<CanvasItem key={i} objProps={{...val,id:entityId} as {id:string}&EntityPropsType} dispatch={dispatch} connectorStates={connectors}/>);
            i++;
        }

        for(const [id,conVal] of Object.entries(connectors)){
            entItems.push(<Connector key={i} 
                                    connectorID={id} 
                                    style={{top:conVal.top as string, left:conVal.left as string, transform:conVal.transform as string, width:conVal.width as string}} 
                                    connState={conVal}/>)
            i++;
        }
        setEntitiesState(entItems);
    },[entities, connectors, dispatch]);

    return (
        <Fragment>
        <div id="canvas" className="canvas" onDragOver={(e)=>{allowDrop(e)}} onDrop={onDrop} onClick={()=>{
            //reset all highlighted selections
            connectorHelper.clearSelections();
        }}>
            {entitiesState}
        </div>
        </Fragment>
    )
}

export default Canvas;