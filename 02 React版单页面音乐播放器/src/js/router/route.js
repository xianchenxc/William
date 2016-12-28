import React,{ Component } from 'react';
import { Router,Route,IndexRoute,useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import App from '../Component/App';

var appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

var Lyric = (location,cb) => {
	require.ensure([],require => {
    	cb(null,require('../Containers/Lyric.js').default);
  	},'lyric');
};

const routes = (
	<Route path="/" component={App}>
		<Route path="/lyric" getComponent={Lyric}/>
	</Route>
);

export default class Root extends Component{
	render(){
		return <Router history={appHistory} routes={routes}/>;
	}
};


//export default class Root extends Component{
//	render(){
//		return (
//			<Router history={appHistory}>
//				{routes}
//				<Route path="/lyric" component={App}/>
//			</Router>
//			);
//	}
//};