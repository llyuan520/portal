/**
 * author       : liuliyuan
 * createTime   : 2017/10/17 14:29
 * description  :
 */
export default function (routes) {
    return routes.map(item=>{
        if(!item.to){
            return {
                name:item.name,
                icon:item.icon,
                path:item.path
            }
        }
        return null;
    }).filter(item=>item);
}