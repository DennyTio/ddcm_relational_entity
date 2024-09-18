import { FC, useRef, useEffect, useMemo, Fragment, useContext } from "react";
import { store } from "../redux/store";
import { ConnectorState } from "../redux/canvas-reducers";
import { Delete } from "../taskbar-buttons";
import { EntityDragContext, DragContext } from "../canvas/main";

import { ConnectorOffsets, PosTypeEnum } from "../redux/canvas-reducers.types";

type ConnectorProps = {
    connectorID:string,
    style:{
        width:string,
        top:string,
        left:string,
        transform:string,
    },
    connState:ConnectorState,
}
const Connector:FC<ConnectorProps> = ({connectorID, connState,style})=>{
    const {setEntityDragFlag, connectorHelper} = useContext(EntityDragContext) as DragContext;
    const divRef = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        if (divRef.current) {
          divRef.current.style.transition = 'width 0.1s, top 0.1s, left 0.1s, transform 0.1s';
        }
    }, [style]);

    useEffect(()=>{
        if(!connState.left || !connState.top || !connState.transform || !connState.width){
            const source = store.getState().canvas?.[connState.entityId1 as string];
            const target = store.getState().canvas?.[connState.entityId2 as string];
            if(!source || !target) return;
            if(!source.offsetWidth || !source.offsetHeight || !target.offsetWidth || !target.offsetHeight) return;
            const sourceOffsets:ConnectorOffsets = {
                offsetTop:source.posY,
                offsetLeft:source.posX,
                offsetWidth:source.offsetWidth,
                offsetHeight:source.offsetHeight,
            }

            const targetOffsets:ConnectorOffsets = {
                offsetTop:target.posY,
                offsetLeft:target.posX,
                offsetWidth:target.offsetWidth,
                offsetHeight:target.offsetHeight,
            }
            connectorHelper.setConnectorLink(connState.entityId1 as string, connState.entityId2 as string, sourceOffsets, targetOffsets, PosTypeEnum.right, PosTypeEnum.left, connectorID);
        }
    },[connectorHelper, connState, connectorID])

    const ctrlRotation = useMemo(()=>{
        if(!style?.transform) return;
        const extractNumber = style?.transform.match(/[-]?\d+/g) as string[];
        if(extractNumber.length === 0) return;
        const rotation = Number(extractNumber[0]) * -1;
        return rotation;
    },[style]);

    return (<Fragment>
        {connState.top !== undefined && connState.left !== undefined && <div ref={divRef} className={`connector-bg ${connState.isSelected && "connector-selected"}`} draggable={false} style={style} onClick={(e)=>{
                e.stopPropagation();
                connectorHelper.setClicked(connectorID);
            }}>
            {!connState.noDelete ? <div className="connector-ctrl" style={{transform:`rotate(${ctrlRotation}deg)`}}>
                <Delete title="Delete Connector" additionalClass="" onClick={()=>{
                    connectorHelper.deleteConnector(connectorID);
                }}/>
            </div> : null}
            <div className="line-ctrl" draggable={false}>
                <div id={`cl-${connectorID}`} className="connector-line" draggable={false}></div>
            </div>
        </div>}
        </Fragment>
    )
}

export default Connector;