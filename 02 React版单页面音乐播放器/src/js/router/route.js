import React,{ Component } from 'react';
import { Router,Route,IndexRoute,useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import App from '../Component/App';

var appHistory = useRouterHistory(createHashHistory)({ queryKey: false });


const routes = (
		<Route path="/" component={App}>
		</Route>
);

export default class Root extends Component{
	render(){
		return <Router history={appHistory} routes={routes}/>;
	}
};