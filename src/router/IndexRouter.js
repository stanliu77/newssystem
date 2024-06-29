import React from 'react'
import{HashRouter, Route,Switch,Redirect} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/newssandbox/NewsSandBox'
import NewDetail from '../views/news/NewDetail'
import New from '../views/news/New'



export default function IndexRouter() {
  return (
    <HashRouter>
            <Switch>
            <Route path='/login' component={Login} />
            <Route path='/news' component={New} />
            <Route path='/detail/:id' component={NewDetail} />
            <Route path='/' render={()=>
              localStorage.getItem("token")?
              <NewsSandBox></NewsSandBox>:
              <Redirect to ="/login"/>
            } />
            </Switch>
    </HashRouter>
  )
}
