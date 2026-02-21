import type { ProgressBarProps } from "./PorgressbarProps"

function Progressbar({ value, color = "bg-blue-500"}: ProgressBarProps){

    return(
        <> 
        <div className="w-full bg-zinc-700 rounded-full h-3 my-3">
            <div className={`${color} h-3 rounded-full`} style={{ width: `${value}%`}}></div>
        </div>
        </>
    )
}

export default Progressbar