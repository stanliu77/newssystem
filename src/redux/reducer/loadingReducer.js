export const loadingReducer = (prevstate={
    isload:true
},action) =>{
     switch(action.type){
       case 'loading':
       const newState = {...prevstate}
       newState.isload = action.payload
       return newState
       default: return prevstate
     }
    }