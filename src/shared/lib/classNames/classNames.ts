type modType = Record<string, boolean>

export function classNames (cls: string, mods:modType={}, addClc: string[]=[]) :string {
    return cls +" " +addClc.join(" ")+" "+Object.entries(mods).filter(([clsName, clsValue])=>clsValue).map(([clsName, clsValue])=>clsValue?clsName:"").join(" ");
}
