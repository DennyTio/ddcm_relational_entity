import "../css/button.css";
import "../css/all.min.css";
import "../css/fontawesome.min.css";
import { MouseEvent,FC,ReactNode } from "react";
import { ButtonProps } from "./types";

export const ToggleUp:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-chevron-up ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const ToggleDown:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-chevron-down ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const ToggleLeft:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-chevron-left ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const ToggleRight:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-chevron-right ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Edit:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-pen-to-square ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Delete:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-trash ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Add:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i  title={title} className={`fa-solid fa-plus ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Close:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-x ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Setup:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-screwdriver-wrench ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const List:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-list ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Ellipsis:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-ellipsis-vertical ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Grip:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-grip-vertical ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Filter:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-filter ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Retrieve:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-cloud-arrow-down ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Execute:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-regular fa-circle-play ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Tools:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-toolbox ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Save:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-floppy-disk ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Copy:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-copy ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Doc:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-book ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const ExecOrder:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-arrow-down-1-9 ${additionalClass}`} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Error:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-triangle-exclamation ${additionalClass}`} style={{color:"red"}} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Warning:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-circle-exclamation ${additionalClass}`} style={{color:"#ff8400"}} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}

export const Info:FC<ButtonProps> = ({title="",onClick,additionalClass=""})=>{
    return (
        <i title={title} className={`fa-solid fa-circle-info ${additionalClass}`} style={{color:"green"}} onClick={(e)=>{if(typeof onClick === "function")onClick(e)}}></i>
    )
}