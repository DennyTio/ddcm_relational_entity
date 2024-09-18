import { Fragment, useState, FC, useMemo, createContext } from "react";
import "../../css/data-transform.css";
import "../../css/general.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";

import { ItemOrConnector } from "./entity-objects.types.ts";
import Entities from "./entity-objects.tsx";
import Canvas from "./canvas.tsx";

//helper classes
import { ConnectorHelper, EntityHelper } from "../utilities/canvas-helper";

export interface DragContext{
    entityDragFlag:ItemOrConnector;
    setEntityDragFlag:React.Dispatch<React.SetStateAction<ItemOrConnector>>;
    connectorHelper:ConnectorHelper;
    entityHelper:EntityHelper;
}

export interface GeneralContextType{
    entityHelper:EntityHelper;
    connectorHelper:ConnectorHelper;
}

export const EntityDragContext = createContext<DragContext|null>(null);

export const GeneralContext = createContext<GeneralContextType|null>(null);

const DataCompute:FC = ()=>{
    const [entityDragFlag, setEntityDragFlag] = useState<ItemOrConnector>(ItemOrConnector.none);
    const dispatch: AppDispatch = useDispatch();

    const connectorHelper = useMemo(()=>{
        return new ConnectorHelper(dispatch);
    },[dispatch]);

    const entityHelper = useMemo(()=>{
        return new EntityHelper(dispatch);
    },[dispatch]);

    return (
    <Fragment>
    <div className="dt-container">
        
        <div className="canvas-container">
            <EntityDragContext.Provider value={{entityDragFlag,setEntityDragFlag,connectorHelper, entityHelper}}>
                <Canvas dispatch={dispatch}/>
                <Entities />
            </EntityDragContext.Provider>
        </div>
    </div>
    </Fragment>
    );
}

export default DataCompute;