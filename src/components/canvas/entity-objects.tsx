import { FC, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { EntityDragContext, DragContext } from "./main";
import { ItemOrConnector, EntitySpecsType, EntityTypeNames } from "./entity-objects.types";
import { ToggleRight, ToggleLeft } from "../taskbar-buttons";

export const entitySpecs:EntitySpecsType[] = [
    {entityTypeName:EntityTypeNames.drag, imgName:"table-solid.svg",text:"Drag", faClass:"fa-solid fa-calculator entities-cont"},
    {entityTypeName:EntityTypeNames.and,imgName:"table-solid.svg",text:"And", faClass:"fa-solid fa-table entities-cont"},
    {entityTypeName:EntityTypeNames.drop,imgName:"table-solid.svg",text:"Drop", faClass:"fa-solid fa-file-csv entities-cont"},
    {entityTypeName:EntityTypeNames.entity,imgName:"table-solid.svg",text:"Entity", faClass:"fa-solid fa-list entities-cont"},
];

export const EntityObject = ()=>{
    const {setEntityDragFlag} = useContext(EntityDragContext) as DragContext;
    const [entities,setEntities] = useState<ReactNode[]>([]);
    const dragStart = useCallback((e:DragEvent|React.DragEvent, entitySpecsId:string, faClass:string, entityTypeName:EntityTypeNames) => {
        if(!e.dataTransfer || !e.target) return;
        if(entityTypeName === EntityTypeNames.connector){
            setEntityDragFlag(ItemOrConnector.connector);
            e.dataTransfer.setData("connector",`.`);
        }else{
            setEntityDragFlag(ItemOrConnector.item);
            e.dataTransfer.setData("entitySpecsId",`${entitySpecsId}|${faClass}`);
        }
        const img = document.getElementById(entitySpecsId) as Element;
        e.dataTransfer.setDragImage(img,4,4);
    },[]);

    const dragEnd = useCallback((e:DragEvent|React.DragEvent)=>{
        setEntityDragFlag(ItemOrConnector.none);
    },[]);

    useEffect(()=>{
        setEntities(entitySpecs.map((item,i)=>{
            const onDragStart = (e:DragEvent|React.DragEvent)=>{dragStart(e,item.entityTypeName,item.faClass,item.entityTypeName)};
            const style = {};
            return (<div key={i} draggable={true} className="ent-item" onDragEnd={dragEnd} onDragStart={onDragStart} style={style}>
                <img id={item.entityTypeName} className={"ent-img"} src={`/icons/${item.imgName}`} alt={item.entityTypeName}></img>
                <span style={{fontSize:"14px"}}>{item.text}</span>
            </div>);
    }));
    },[dragStart]);

    return (
        <div id="ent-obj-container">
            {entities}
        </div>
    )
}

const Entities:FC = ()=>{
    const [maxTaskbarClass,setToggleTaskbar] = useState(false);

    const toggleTaskbar = useCallback(()=>{
        setToggleTaskbar((state)=>!state);
    },[]);

    return(
    <div className={`sidebar entities ${maxTaskbarClass?"side-max side-max-ent":""}`}>
        <div className={`side-taskbar ${maxTaskbarClass?"side-taskbar-max entities-max":""}`}>
            {maxTaskbarClass && <ToggleRight title={"Hide Entities"}  onClick={toggleTaskbar} additionalClass="taskbar-btn"/>}
            {!maxTaskbarClass && <ToggleLeft title={"Display Entities"} onClick={toggleTaskbar} additionalClass="taskbar-btn"/>}
            {maxTaskbarClass && <h4 style={{marginLeft:"auto", marginTop:0, marginBottom:0, marginRight:"6px"}}>Entities</h4>}
        </div>
        {maxTaskbarClass && <EntityObject />}
    </div>
    );
}

export default Entities