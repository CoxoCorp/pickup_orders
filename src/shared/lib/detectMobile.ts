export const detectMobile = () : boolean=>{
    const isMobile = window.matchMedia
    if (!isMobile) return false
    const device = isMobile("only screen and (max-width: 1199px)")
    return device.matches
}