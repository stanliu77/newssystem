export const siderReducer = (prevstate={
    isfold:false
},action) =>{
     switch(action.type){
       case 'sider':
       const newState = {...prevstate}
       newState.isfold = ! newState.isfold 
       return newState
       default: return prevstate
     }
}
