import React from 'react'
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min'
import Home from '../../views/newssandbox/home/Home'
import UserList from '../../views/newssandbox/user-manage.js/UserList'
import RightList from '../../views/newssandbox/right-manage/RightList'
import RoleList from '../../views/newssandbox/right-manage/RoleList'
import NoPermission from '../../views/nopermission/NoPermission'
import { Switch } from 'react-router-dom'
import NewsAdd from '../../views/newssandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/newssandbox/news-manage/NewsCategory'
import NewsDraft from "../../views/newssandbox/news-manage/NewsDraft"
import Audit from '../../views/newssandbox/audit-manage/Audit'
import AuditList from '../../views/newssandbox/audit-manage/AuditList'
import Unpublished from '../../views/newssandbox/publish-manage/Unpublished'
import Published from '../../views/newssandbox/publish-manage/Published'
import Sunset from '../../views/newssandbox/publish-manage/Sunset'
import { useEffect, useState } from 'react'
import axios from 'axios'
import NewsPreview from '../../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/newssandbox/news-manage/NewsUpdate'
const LocalRouter = {
    '/home': Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id":NewsPreview,
    "/news-manage/update/:id":NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset,
}
export default function NewsRouter() {
    const [BackRouteList, setBackRouteList] = useState([])
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        }
        ).catch(error => {
            
        })
    }, [])
   
    const checkRoute = (item)=>{
       return LocalRouter[item.key] && (item.pagepermisson||item.routepermisson)
    

    }
    const checkUserPermission =(item)=>{
        return rights.includes(item.key)
        
    }
    
    return (
        <Switch>
            {
                BackRouteList.map(item => {
                    if (checkRoute(item)&&checkUserPermission(item)){
                      return <Route path={item.key} key={item.key} component={LocalRouter[item.key]} exact/>
                    }
                    return null
                }
                )
            }

            <Redirect from='/' to='/home' exact />
            {
                BackRouteList.length > 0 && <Route path='*' component={NoPermission} />
            }
        </Switch>
    )
}
